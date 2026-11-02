import React, { useState, useEffect } from 'react';
import { StudioSettings, ServiceItem, PortfolioItem, Enquiry } from '../types';
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
  Trash2,
  CheckCircle,
  ExternalLink,
  Save,
  MessageSquare,
  AlertCircle,
  Search,
  RefreshCw,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { SGLogo } from './SGLogo';

interface AdminDashboardProps {
  settings: StudioSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  onClose: () => void;
  onRefreshData: () => Promise<void>;
  authToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onOpenDrive?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  services,
  portfolio,
  onClose,
  onRefreshData,
  authToken,
  onLoginSuccess,
  onLogout,
  onOpenDrive
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'services' | 'portfolio' | 'settings'>('overview');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [searchEnquiry, setSearchEnquiry] = useState('');

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
    featured: true
  });
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  // Editing service state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [savingService, setSavingService] = useState(false);

  // Fetch enquiries if logged in
  const fetchEnquiries = async () => {
    if (!authToken) return;
    setLoadingEnquiries(true);
    try {
      const res = await fetch('/api/enquiries', {
        headers: { Authorization: authToken }
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchEnquiries();
    }
  }, [authToken]);

  useEffect(() => {
    setEditableSettings(settings);
  }, [settings]);

  // Handle Login
  const handleLogin = async (keyToUse?: string) => {
    const key = keyToUse || passwordInput;
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: key })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.token);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Status update
  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (id: string) => {
    if (!authToken || !window.confirm('Delete this customer enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authToken }
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete enquiry', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSavingSettings(true);
    setSettingsSaveMsg('');

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
        body: JSON.stringify(editableSettings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSaveMsg('Website settings saved and updated live!');
        await onRefreshData();
      } else {
        setSettingsSaveMsg('Failed to save settings.');
      }
    } catch (err) {
      setSettingsSaveMsg('Network error saving settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Add Portfolio Item
  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    if (!newPortfolio.title || !newPortfolio.imageUrl) {
      alert('Title and Image URL are required');
      return;
    }

    setSavingPortfolio(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
        body: JSON.stringify(newPortfolio)
      });
      if (res.ok) {
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
          featured: true
        });
      }
    } catch (err) {
      console.error('Failed to save portfolio', err);
    } finally {
      setSavingPortfolio(false);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: string) => {
    if (!authToken || !window.confirm('Delete this project from portfolio?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authToken }
      });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error('Failed to delete portfolio item', err);
    }
  };

  // Update Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !editingService) return;

    setSavingService(true);
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        await onRefreshData();
        setEditingService(null);
      }
    } catch (err) {
      console.error('Failed to update service', err);
    } finally {
      setSavingService(false);
    }
  };

  // LOGIN SCREEN
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
        <div className="w-full max-w-md bg-[#0d1017] border border-[#d4af37]/40 rounded-2xl p-8 shadow-2xl relative">
          
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37]/20 to-[#38bdf8]/20 border border-[#d4af37]/40 flex items-center justify-center mb-1">
              <Shield className="w-7 h-7 text-[#d4af37]" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Studio Admin Portal
            </h3>
            <p className="text-xs text-slate-400">
              Sai Graphics Post Production Lab Management
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Studio Security Key / PIN
              </label>
              <input
                type="password"
                placeholder="Enter admin key"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] shadow-lg hover:brightness-105 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In To Dashboard'}
            </button>
          </form>

          {/* Quick Demo Login Preset Button for convenience */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              onClick={() => handleLogin('8809216991')}
              className="text-xs font-semibold text-[#38bdf8] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            >
              🔑 Quick Demo Login (Studio Passcode: 8809216991)
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition-colors"
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
    <div className="fixed inset-0 z-50 bg-[#08090d] text-slate-100 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Top Admin Navbar */}
      <header className="h-16 px-6 bg-[#0c0e14] border-b border-white/10 flex items-center justify-between shrink-0">
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
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Preview Site
          </button>

          <button
            onClick={onLogout}
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
        <aside className="w-64 bg-[#0a0c12] border-r border-white/10 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="space-y-1">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-white/5'
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
                  : 'text-slate-300 hover:bg-white/5'
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
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                activeTab === 'services'
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-white/5'
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
                  : 'text-slate-300 hover:bg-white/5'
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
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Content</span>
            </button>

          </div>

          {/* Studio Info Badge */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
            <span className="font-mono text-[#d4af37] block">SAI GRAPHICS LAB</span>
            <span className="text-[11px] block mt-0.5">Bhagalpur, Bihar</span>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#07080c]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-cinzel text-3xl font-bold text-white">
                  Studio Operations Overview
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Real-time pipeline metrics for Sai Graphics Post Production Lab.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
                  <span className="text-xs uppercase text-slate-400">Total Enquiries</span>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {enquiries.length}
                  </div>
                  <span className="text-xs text-emerald-400">Active client pipeline</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel-gold border border-[#d4af37]/30 space-y-2">
                  <span className="text-xs uppercase text-[#d4af37]">New Uncontacted Leads</span>
                  <div className="font-cinzel text-3xl font-bold text-[#f3e5ab] tabular-nums">
                    {newEnquiriesCount}
                  </div>
                  <span className="text-xs text-slate-300">Requires follow-up</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
                  <span className="text-xs uppercase text-slate-400">Active Services</span>
                  <div className="font-cinzel text-3xl font-bold text-[#38bdf8] tabular-nums">
                    {services.length}
                  </div>
                  <span className="text-xs text-slate-400">All 10 services enabled</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
                  <span className="text-xs uppercase text-slate-400">Portfolio Works</span>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {portfolio.length}
                  </div>
                  <span className="text-xs text-slate-400">Showcase entries</span>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-lg font-bold text-white">
                    Recent Customer Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-[#38bdf8] hover:text-white"
                  >
                    View All ({enquiries.length}) →
                  </button>
                </div>

                <div className="rounded-2xl glass-panel overflow-hidden border border-white/10">
                  {enquiries.slice(0, 5).map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 border-b border-white/5 flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">{enq.name}</span>
                          <span className="text-xs font-mono text-[#d4af37]">{enq.phone}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
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
                          className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
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
                  <h2 className="font-cinzel text-3xl font-bold text-white">
                    Customer Enquiries ({enquiries.length})
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage incoming project leads, phone calls, and quotation requests.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, phone, service..."
                    value={searchEnquiry}
                    onChange={(e) => setSearchEnquiry(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c0e14] text-slate-400 uppercase tracking-wider font-mono border-b border-white/10">
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
                        <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
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
                              <div className="text-[10px] text-slate-400">{enq.email}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">{enq.service}</td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-300">{enq.eventDate || 'N/A'}</div>
                            <div className="text-[10px] text-[#f3e5ab] font-mono">{enq.budget || ''}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-slate-400 truncate">
                            {enq.message || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                handleUpdateStatus(enq.id, e.target.value as Enquiry['status'])
                              }
                              className="px-2 py-1 rounded bg-[#0d1017] border border-white/10 text-xs text-white outline-none cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
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
                <h2 className="font-cinzel text-3xl font-bold text-white">
                  Manage Studio Services ({services.length})
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Edit descriptions, turnaround times, and offerings across all 10 services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#d4af37]">
                          Service {srv.number}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {srv.turnaround}
                        </span>
                      </div>
                      <h4 className="font-outfit text-lg font-bold text-white">{srv.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{srv.shortDesc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
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
                  <div className="w-full max-w-lg bg-[#0d1017] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl">
                    <h3 className="font-cinzel text-xl font-bold text-white mb-4">
                      Edit Service: {editingService.title}
                    </h3>
                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Turnaround Time</label>
                        <input
                          type="text"
                          value={editingService.turnaround}
                          onChange={(e) =>
                            setEditingService({ ...editingService, turnaround: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={editingService.shortDesc}
                          onChange={(e) =>
                            setEditingService({ ...editingService, shortDesc: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Full Technical Description</label>
                        <textarea
                          rows={4}
                          value={editingService.fullDesc}
                          onChange={(e) =>
                            setEditingService({ ...editingService, fullDesc: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5"
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
                  <h2 className="font-cinzel text-3xl font-bold text-white">
                    Portfolio & Gallery Showcase ({portfolio.length})
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
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
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Upload New Portfolio Project
                    </h3>
                    <button
                      onClick={() => setShowAddPortfolio(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close Form
                    </button>
                  </div>

                  <form onSubmit={handleAddPortfolio} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Jaimala Cinema"
                          value={newPortfolio.title}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Category</label>
                        <select
                          value={newPortfolio.category}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0d1017] border border-white/10 text-xs text-white cursor-pointer"
                        >
                          <option value="Wedding Photography">Wedding Photography</option>
                          <option value="Cinematic Wedding Films">Cinematic Wedding Films</option>
                          <option value="Pre-Wedding Shoots">Pre-Wedding Shoots</option>
                          <option value="Professional Photo Editing">Professional Photo Editing</option>
                          <option value="Creative Graphic Design">Creative Graphic Design</option>
                          <option value="Album Design">Album Design</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Image URL (High-Res) *</label>
                        <input
                          type="url"
                          required
                          placeholder="https://..."
                          value={newPortfolio.imageUrl}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Video Embed URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube-nocookie.com/embed/..."
                          value={newPortfolio.videoUrl}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, videoUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Client Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Aman & Sneha"
                          value={newPortfolio.client}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, client: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Year</label>
                        <input
                          type="text"
                          placeholder="2026"
                          value={newPortfolio.year}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of the visual finishing and color grading..."
                        value={newPortfolio.description}
                        onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPortfolio(false)}
                        className="px-4 py-2 rounded-lg text-xs text-slate-300"
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
                    className="rounded-2xl glass-panel overflow-hidden border border-white/10 group flex flex-col justify-between"
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
                        <h4 className="font-outfit font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                        <div className="mt-2 text-[11px] text-slate-500 font-mono">
                          {item.client} {item.year ? `· ${item.year}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex justify-end border-t border-white/5 mt-2">
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
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-cinzel text-3xl font-bold text-white">
                  Edit Website Content & Contact Info
                </h2>
                <p className="text-sm text-slate-400 mt-1">
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
                <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#d4af37]">
                    Brand Identity & Taglines
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={editableSettings.brandName}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Business Type</label>
                      <input
                        type="text"
                        value={editableSettings.businessType}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, businessType: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Primary Tagline</label>
                    <input
                      type="text"
                      value={editableSettings.tagline}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, tagline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Sub-tagline</label>
                    <input
                      type="text"
                      value={editableSettings.subTagline}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, subTagline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">About Us Description (Official)</label>
                    <textarea
                      rows={3}
                      value={editableSettings.aboutDescription}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, aboutDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white resize-none"
                    />
                  </div>
                </div>

                {/* Contact Information & Channels */}
                <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                  <h3 className="font-cinzel text-base font-bold text-[#38bdf8]">
                    Contact Channels & Location
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Mobile Calling Number</label>
                      <input
                        type="text"
                        value={editableSettings.mobileNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, mobileNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editableSettings.whatsappNumber}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Full Studio Address</label>
                    <input
                      type="text"
                      value={editableSettings.address}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Instagram Link</label>
                      <input
                        type="url"
                        value={editableSettings.instagram}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, instagram: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Facebook Link</label>
                      <input
                        type="url"
                        value={editableSettings.facebook}
                        onChange={(e) =>
                          setEditableSettings({ ...editableSettings, facebook: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={editableSettings.googleMapsUrl}
                      onChange={(e) =>
                        setEditableSettings({ ...editableSettings, googleMapsUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
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
