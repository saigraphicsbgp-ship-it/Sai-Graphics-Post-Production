import React, { useState, useEffect } from 'react';
import { StudioSettings, ServiceItem, PortfolioItem, Enquiry, NewsletterSubscriber } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query,
  orderBy, 
  setDoc 
} from 'firebase/firestore';
import { getAccessToken, googleSignIn } from '../services/googleDriveAuth';
import { uploadToDrive } from '../services/googleDriveApi';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Shield,
  LayoutDashboard,
  Users,
  Film,
  Sliders,
  Settings,
  Phone,
  LogOut,
  Plus,
  Upload,
  Trash2,
  CheckCircle,
  ExternalLink,
  Save,
  MessageSquare,
  AlertCircle,
  Search,
  RefreshCw,
  ImageIcon,
  HardDrive,
  Mail
} from 'lucide-react';
import { SGLogo } from './SGLogo';

interface AdminDashboardProps {
  settings: StudioSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  onClose: () => void;
  onRefreshData: () => Promise<void>;
  onOpenDrive?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  services,
  portfolio,
  onClose,
  onRefreshData,
  onOpenDrive
}) => {
  const { user, isAdmin, login, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'newsletter' | 'services' | 'portfolio' | 'settings'>('overview');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [searchEnquiry, setSearchEnquiry] = useState('');

  // Newsletter Subscribers state
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [searchSubscriber, setSearchSubscriber] = useState('');

  // Editable settings state
  const [editableSettings, setEditableSettings] = useState<StudioSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // New Portfolio Item modal / form
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: 'Wedding Photography',
    description: '',
    imageUrl: '',
    videoUrl: '',
    client: '',
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0],
    featured: true
  });
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const portfolioFileInputRef = React.useRef<HTMLInputElement>(null);

  // Editing service state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [savingService, setSavingService] = useState(false);

  const fetchEnquiries = async () => {
    if (!isAdmin) return;
    setLoadingEnquiries(true);
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Enquiry));
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const fetchSubscribers = async () => {
    if (!isAdmin) return;
    setLoadingSubscribers(true);
    try {
      const snap = await getDocs(collection(db, 'newsletter'));
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as object) } as NewsletterSubscriber));
      setSubscribers(data);
    } catch (err) {
      console.error('Failed to load subscribers', err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!isAdmin || !window.confirm('Remove this subscriber from the workshop alerts list?')) return;
    try {
      await deleteDoc(doc(db, 'newsletter', id));
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete subscriber', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEnquiries();
      fetchSubscribers();
    }
  }, [isAdmin]);

  useEffect(() => {
    setEditableSettings(settings);
  }, [settings]);

  // Handle Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await login();
    } catch (err) {
      setLoginError('Google Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose(); // This clears the hash and closes the modal
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Status update
  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (id: string) => {
    if (!isAdmin || !window.confirm('Delete this customer enquiry record?')) return;
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete enquiry', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSavingSettings(true);
    setSettingsSaveMsg('');

    try {
      await setDoc(doc(db, 'settings', 'global'), editableSettings);
      setSettingsSaveMsg('Website settings saved and updated live!');
      await onRefreshData();
    } catch (err) {
      setSettingsSaveMsg('Firestore error saving settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Portfolio File Upload (Mac / PC / Phone)
  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // 1. Instantly compress photo client-side for 4K web loading
      const compressed = await compressImageFile(file, 1600, 0.84);
      setNewPortfolio(prev => ({ ...prev, imageUrl: compressed.dataUrl }));

      // 2. Optionally also backup to Google Drive if authorized
      try {
        const token = await getAccessToken();
        if (token) {
          await uploadToDrive(token, file);
        }
      } catch (driveErr) {
        console.warn('Google Drive backup skipped:', driveErr);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingPhoto(false);
      if (portfolioFileInputRef.current) portfolioFileInputRef.current.value = '';
    }
  };

  // Add Portfolio Item
  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newPortfolio.title || !newPortfolio.imageUrl) {
      alert('Title and Image URL are required. You can upload a photo or paste a URL.');
      return;
    }

    setSavingPortfolio(true);
    try {
      const id = `port-${Date.now()}`;
      await setDoc(doc(db, 'portfolio', id), {
        ...newPortfolio,
        id
      });
      await onRefreshData();
      setShowAddPortfolio(false);
      setNewPortfolio({
        title: '',
        category: 'Wedding Photography',
        description: '',
        imageUrl: '',
        videoUrl: '',
        client: '',
        year: new Date().getFullYear().toString(),
        date: new Date().toISOString().split('T')[0],
        featured: true
      });
    } catch (err) {
      console.error('Failed to save portfolio', err);
    } finally {
      setSavingPortfolio(false);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: string) => {
    if (!isAdmin || !window.confirm('Delete this project from portfolio?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      await onRefreshData();
    } catch (err) {
      console.error('Failed to delete portfolio item', err);
    }
  };

  // Update Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingService) return;

    setSavingService(true);
    try {
      await updateDoc(doc(db, 'services', editingService.id), {
        turnaround: editingService.turnaround,
        shortDesc: editingService.shortDesc,
        fullDesc: editingService.fullDesc
      });
      await onRefreshData();
      setEditingService(null);
    } catch (err) {
      console.error('Failed to update service', err);
    } finally {
      setSavingService(false);
    }
  };

  // LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in text-slate-100">
        <div className="w-full max-w-md bg-[var(--brand-bg)] border border-[#d4af37]/40 rounded-2xl p-8 shadow-2xl relative">
          
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37]/20 to-[#38bdf8]/20 border border-[#d4af37]/40 flex items-center justify-center mb-1">
              <Shield className="w-7 h-7 text-[#d4af37]" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-primary">
              Studio Admin Portal
            </h3>
            <p className="text-xs text-muted">
              Sai Graphics Post Production Lab Management
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {user && !isAdmin && (
            <div className="mb-6 p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center animate-pulse-slow">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="text-rose-400 font-bold uppercase tracking-widest text-sm mb-2">Strict Access Denied</h4>
              <p className="text-[11px] text-rose-300/80 leading-relaxed mb-4">
                Identity: <strong>{user.email}</strong><br/>
                Status: <span className="text-rose-400 font-mono">UNAUTHORIZED_CREDENTIALS</span>
              </p>
              <div className="h-px bg-rose-500/20 mb-4" />
              <p className="text-[10px] text-muted italic mb-4">
                This area is strictly restricted to the primary studio administrator. Access attempts are logged.
              </p>
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-slate-100 bg-rose-600 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Switch Account</span>
              </button>
            </div>
          )}

          {!user && (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] shadow-lg hover:brightness-105 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded p-0.5" alt="Google" />
              <span>{isLoggingIn ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>
          )}

          <div className="mt-8 text-center border-t border-secondary pt-4">
            <button
              onClick={onClose}
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchEnquiry.toLowerCase()) ||
      e.phone.includes(searchEnquiry) ||
      e.service.toLowerCase().includes(searchEnquiry.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[var(--brand-bg)] text-slate-100 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Top Admin Navbar */}
      <header className="h-16 px-6 bg-[var(--brand-bg)] border-b border-primary flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <SGLogo size="sm" showSubtext={false} />
          <div className="h-4 w-px bg-white/20" />
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
            STUDIO CONTROL CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchEnquiries}
            className="p-2 text-muted hover:text-primary hover:bg-soft rounded-lg transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loadingEnquiries ? 'animate-spin' : ''}`} />
          </button>

          {onOpenDrive && (
            <button
              onClick={onOpenDrive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 transition-all cursor-pointer"
              title="Open Google Drive File Hub"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive Hub</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary bg-soft hover:bg-soft border border-primary transition-colors"
          >
            Preview Site
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Tabs */}
        <aside className="w-64 bg-[var(--brand-bg)] border-r border-primary p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="space-y-1">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'enquiries'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customer Enquiries</span>
              </div>
              {newEnquiriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#38bdf8] text-slate-950">
                  {newEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('newsletter')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'newsletter'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Workshop Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'services'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Manage Services</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Portfolio & Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-secondary hover:bg-soft'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Content</span>
            </button>

          </div>

          {/* Studio Info Badge */}
          <div className="p-3 rounded-xl bg-muted border border-secondary text-xs text-muted">
            <span className="font-mono text-[#d4af37] block">SAI GRAPHICS LAB</span>
            <span className="text-[11px] block mt-0.5">Bhagalpur, Bihar</span>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[var(--brand-bg)]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-cinzel text-3xl font-bold text-primary">
                  Studio Operations Overview
                </h2>
                <p className="text-sm text-muted mt-1">
                  Real-time pipeline metrics for Sai Graphics Post Production Lab.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl glass-panel border border-primary space-y-2">
                  <span className="text-xs uppercase text-muted">Total Enquiries</span>
                  <div className="font-cinzel text-3xl font-bold text-primary tabular-nums">
                    {enquiries.length}
                  </div>
                  <span className="text-xs text-emerald-400">Active client pipeline</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel-gold border border-[#d4af37]/30 space-y-2">
                  <span className="text-xs uppercase text-[#d4af37]">New Uncontacted Leads</span>
                  <div className="font-cinzel text-3xl font-bold text-[#f3e5ab] tabular-nums">
                    {newEnquiriesCount}
                  </div>
                  <span className="text-xs text-secondary">Requires follow-up</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-primary space-y-2">
                  <span className="text-xs uppercase text-muted">Active Services</span>
                  <div className="font-cinzel text-3xl font-bold text-[#38bdf8] tabular-nums">
                    {services.length}
                  </div>
                  <span className="text-xs text-muted">All 10 services enabled</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-primary space-y-2">
                  <span className="text-xs uppercase text-muted">Portfolio Works</span>
                  <div className="font-cinzel text-3xl font-bold text-primary tabular-nums">
                    {portfolio.length}
                  </div>
                  <span className="text-xs text-muted">Showcase entries</span>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-lg font-bold text-primary">
                    Recent Customer Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-[#38bdf8] hover:text-primary"
                  >
                    View All ({enquiries.length}) →
                  </button>
                </div>

                <div className="rounded-2xl glass-panel overflow-hidden border border-primary">
                  {enquiries.slice(0, 5).map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 border-b border-secondary flex items-center justify-between gap-4 hover:bg-muted"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary text-sm">{enq.name}</span>
                          <span className="text-xs font-mono text-[#d4af37]">{enq.phone}</span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          {enq.service} · {new Date(enq.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-semibold ${
                            enq.status === 'New'
                              ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                              : enq.status === 'Contacted'
                              ? 'bg-[#d4af37]/20 text-[#f3e5ab]'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {enq.status}
                        </span>

                        <a
                          href={`https://wa.me/91${enq.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-primary transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-3xl font-bold text-primary">
                    Customer Enquiries ({enquiries.length})
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Manage incoming project leads, phone calls, and quotation requests.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, phone, service..."
                    value={searchEnquiry}
                    onChange={(e) => setSearchEnquiry(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[var(--brand-accent)]"
                  />
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="rounded-2xl glass-panel border border-primary overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--brand-bg)] text-muted uppercase tracking-wider font-mono border-b border-primary">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Date / Budget</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-muted transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-primary whitespace-nowrap">
                            {enq.name}
                            <div className="text-[10px] text-slate-500 font-normal">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <a href={`tel:${enq.phone}`} className="text-[#38bdf8] hover:underline">
                              {enq.phone}
                            </a>
                            {enq.email && (
                              <div className="text-[10px] text-muted">{enq.email}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-primary">{enq.service}</td>
                          <td className="py-3.5 px-4">
                            <div className="text-secondary">{enq.eventDate || 'N/A'}</div>
                            <div className="text-[10px] text-[#f3e5ab] font-mono">{enq.budget || ''}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-muted truncate">
                            {enq.message || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                handleUpdateStatus(enq.id, e.target.value as Enquiry['status'])
                              }
                              className="px-2 py-1 rounded bg-[var(--brand-bg)] border border-primary text-xs text-primary outline-none cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`https://wa.me/91${enq.phone}?text=Hello%20${encodeURIComponent(
                                  enq.name
                                )},%20greetings%20from%20Sai%20Graphics%20Post%20Production%20Lab%20Bhagalpur.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-primary transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-primary transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-cinzel text-3xl font-bold text-primary">
                  Manage Studio Services ({services.length})
                </h2>
                <p className="text-sm text-muted mt-1">
                  Edit descriptions, turnaround times, and offerings across all 10 services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl glass-panel border border-primary flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#d4af37]">
                          Service {srv.number}
                        </span>
                        <span className="text-[11px] font-mono text-muted">
                          {srv.turnaround}
                        </span>
                      </div>
                      <h4 className="font-outfit text-lg font-bold text-primary">{srv.title}</h4>
                      <p className="text-xs text-secondary mt-1">{srv.shortDesc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-secondary flex items-center justify-between">
                      <span className="text-xs text-[#38bdf8] font-mono">{srv.category}</span>
                      <button
                        onClick={() => setEditingService(srv)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-[#d4af37] hover:bg-[#f3e5ab] transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Service Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-lg bg-[var(--brand-bg)] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl">
                    <h3 className="font-cinzel text-xl font-bold text-primary mb-4">
                      Edit Service: {editingService.title}
                    </h3>
                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div>
                        <label className="text-xs text-secondary block mb-1">Turnaround Time</label>
                        <input
                          type="text"
                          value={editingService.turnaround}
                          onChange={(e) =>
                            setEditingService({ ...editingService, turnaround: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-secondary block mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={editingService.shortDesc}
                          onChange={(e) =>
                            setEditingService({ ...editingService, shortDesc: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-secondary block mb-1">Full Technical Description</label>
                        <textarea
                          rows={4}
                          value={editingService.fullDesc}
                          onChange={(e) =>
                            setEditingService({ ...editingService, fullDesc: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 rounded-lg text-xs text-secondary hover:bg-soft"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingService}
                          className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-[#d4af37] hover:bg-[#f3e5ab]"
                        >
                          {savingService ? 'Saving...' : 'Save Service'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PORTFOLIO & GALLERY */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-3xl font-bold text-primary">
                    Portfolio & Gallery Showcase ({portfolio.length})
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Upload images, embed cinematic wedding videos, and update showcase projects.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPortfolio(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 transition-all self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Add Project Form Modal */}
              {showAddPortfolio && (
                <div className="p-6 rounded-2xl glass-panel-gold border border-[#d4af37]/40 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel text-lg font-bold text-primary">
                      Upload New Portfolio Project
                    </h3>
                    <button
                      onClick={() => setShowAddPortfolio(false)}
                      className="text-xs text-muted hover:text-primary"
                    >
                      Close Form
                    </button>
                  </div>

                  <form onSubmit={handleAddPortfolio} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-secondary block mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Jaimala Cinema"
                          value={newPortfolio.title}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-secondary block mb-1">Category</label>
                        <select
                          value={newPortfolio.category}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--brand-bg)] border border-primary text-xs text-primary cursor-pointer"
                        >
                          <option value="Wedding Photography">Wedding Photography</option>
                          <option value="Pre-Wedding Photography">Pre-Wedding Photography</option>
                          <option value="Cinematic Wedding Videos">Cinematic Wedding Videos</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-secondary block mb-1">Project Main Image</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            required
                            placeholder="https://... or upload →"
                            value={newPortfolio.imageUrl}
                            onChange={(e) => setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                          />
                          <button
                            type="button"
                            onClick={() => portfolioFileInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="px-3 py-2 rounded-lg bg-[#38bdf8] text-slate-900 text-xs font-bold hover:bg-[#7dd3fc] disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                          >
                            {isUploadingPhoto ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            <span>{isUploadingPhoto ? 'Uploading...' : 'Upload from Mac'}</span>
                          </button>
                          <input
                            ref={portfolioFileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePortfolioFileUpload}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-secondary block mb-1">Video Embed URL (YouTube/Vimeo)</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube-nocookie.com/embed/..."
                          value={newPortfolio.videoUrl}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, videoUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-secondary block mb-1">Client Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Aman & Sneha"
                          value={newPortfolio.client}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, client: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-secondary block mb-1">Event Year</label>
                        <input
                          type="text"
                          placeholder="2026"
                          value={newPortfolio.year}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-secondary block mb-1">Event Date</label>
                        <input
                          type="date"
                          value={newPortfolio.date}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-secondary block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of the visual finishing and color grading..."
                        value={newPortfolio.description}
                        onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPortfolio(false)}
                        className="px-4 py-2 rounded-lg text-xs text-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingPortfolio}
                        className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-[#d4af37] hover:bg-[#f3e5ab]"
                      >
                        {savingPortfolio ? 'Saving...' : 'Add To Gallery'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl glass-panel overflow-hidden border border-primary group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-slate-950">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-mono text-[#38bdf8] bg-black/70 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-outfit font-bold text-primary text-sm">{item.title}</h4>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{item.description}</p>
                        <div className="mt-2 text-[11px] text-slate-500 font-mono">
                          {item.client} {item.year ? `· ${item.year}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex justify-end border-t border-secondary mt-2">
                      <button
                        onClick={() => handleDeletePortfolio(item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTENT & CONTACT DETAILS */}
          {/* NEWSLETTER SUBSCRIBERS TAB */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--brand-bg)] p-5 rounded-2xl border border-secondary">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-primary flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#d4af37]" />
                    <span>Workshop Alert Subscribers</span>
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Manage the mailing list for seasonal photography bootcamps and limited-time festive offers.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search email or source..."
                      value={searchSubscriber}
                      onChange={(e) => setSearchSubscriber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border border-primary text-xs text-primary focus:border-[var(--brand-accent)] outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={fetchSubscribers}
                    className="p-2 text-muted hover:text-primary hover:bg-soft rounded-lg transition-colors border border-primary"
                    title="Refresh List"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingSubscribers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="bg-[var(--brand-bg)] rounded-2xl border border-secondary overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-secondary">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Subscribed At</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Source</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {loadingSubscribers ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                            <div className="flex flex-col items-center gap-2">
                              <RefreshCw className="w-5 h-5 animate-spin text-[#d4af37]" />
                              <span>Loading subscribers...</span>
                            </div>
                          </td>
                        </tr>
                      ) : subscribers.filter(s => 
                        s.email.toLowerCase().includes(searchSubscriber.toLowerCase()) || 
                        (s.source && s.source.toLowerCase().includes(searchSubscriber.toLowerCase()))
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                            No subscribers found.
                          </td>
                        </tr>
                      ) : (
                        subscribers
                          .filter(s => 
                            s.email.toLowerCase().includes(searchSubscriber.toLowerCase()) || 
                            (s.source && s.source.toLowerCase().includes(searchSubscriber.toLowerCase()))
                          )
                          .map((sub) => (
                            <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold uppercase text-[10px]">
                                    {sub.email.charAt(0)}
                                  </div>
                                  <span className="text-primary font-medium">{sub.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-muted">
                                {new Date(sub.subscribedAt).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded-full bg-soft text-[10px] text-muted">
                                  {sub.source || 'Direct'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteSubscriber(sub.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Remove Subscriber"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-cinzel text-3xl font-bold text-primary">
                  Edit Website Content & Contact Info
                </h2>
                <p className="text-sm text-muted mt-1">
                  Changes made here update across the public homepage, contact links, and maps in real time.
                </p>
              </div>

              {settingsSaveMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsSaveMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="p-6 rounded-2xl glass-panel border border-primary space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#d4af37]">
                    Brand Identity & Taglines
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-secondary block mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={editableSettings.brandName}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-secondary block mb-1">Business Type</label>
                      <input
                        type="text"
                        value={editableSettings.businessType}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, businessType: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-secondary block mb-1">Primary Tagline</label>
                    <input
                      type="text"
                      value={editableSettings.tagline}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, tagline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary block mb-1">Sub-tagline</label>
                    <input
                      type="text"
                      value={editableSettings.subTagline}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, subTagline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary block mb-1">About Us Description (Official)</label>
                    <textarea
                      rows={3}
                      value={editableSettings.aboutDescription}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, aboutDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary resize-none"
                    />
                  </div>
                </div>

                {/* Contact Information & Channels */}
                <div className="p-6 rounded-2xl glass-panel border border-primary space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#38bdf8]">
                    Contact Channels & Location
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-secondary block mb-1">Mobile Calling Number</label>
                      <input
                        type="text"
                        value={editableSettings.mobileNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, mobileNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-secondary block mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editableSettings.whatsappNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-secondary block mb-1">Full Studio Address</label>
                    <input
                      type="text"
                      value={editableSettings.address}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-secondary block mb-1">Instagram Link</label>
                      <input
                        type="url"
                        value={editableSettings.instagram}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, instagram: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-secondary block mb-1">Facebook Link</label>
                      <input
                        type="url"
                        value={editableSettings.facebook}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, facebook: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-secondary block mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={editableSettings.googleMapsUrl}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, googleMapsUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-soft border border-primary text-xs text-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] hover:brightness-105 active:scale-98 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Saving Changes...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
