import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PortfolioItem } from '../types';
import { compressImageFile, formatBytes } from '../utils/imageCompressor';
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Shield,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { useAesthetic } from '../context/AestheticContext';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: PortfolioItem) => void;
  onOpenAdminLogin?: () => void;
}

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenAdminLogin,
}) => {
  const { user, isAdmin, login } = useAuth();
  const { config } = useAesthetic();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileStats, setFileStats] = useState<{ original: number; compressed: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Wedding Photography' | 'Pre-Wedding Photography' | 'Cinematic Wedding Videos'>('Wedding Photography');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [featured, setFeatured] = useState(true);

  if (!isOpen) return null;

  // Handle file selection from Mac / Phone / PC
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setIsCompressing(true);

    try {
      const result = await compressImageFile(file, 1600, 0.84);
      setPreviewUrl(result.dataUrl);
      setFileStats({
        original: result.originalSize,
        compressed: result.compressedSize,
      });

      // Auto-suggest title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err: any) {
      console.error('Image compression error:', err);
      setErrorMessage('Could not process this image. Please try another photo or use an image URL.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleResetPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFileStats(null);
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isAdmin) {
      setErrorMessage('Admin privileges required to publish to Sai Graphics Gallery.');
      return;
    }

    const finalImageUrl = uploadMode === 'device' ? previewUrl : imageUrlInput.trim();

    if (!finalImageUrl) {
      setErrorMessage('Please choose a photo from your device or enter an image URL.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Project title is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const id = `port-${Date.now()}`;
      const newItem: PortfolioItem = {
        id,
        title: title.trim(),
        category,
        description: description.trim() || `${category} captured and mastered by Sai Graphics Studio, Bhagalpur.`,
        imageUrl: finalImageUrl,
        videoUrl: videoUrl.trim() || undefined,
        client: client.trim() || undefined,
        year: year.trim() || new Date().getFullYear().toString(),
        date: date || new Date().toISOString().split('T')[0],
        featured,
      };

      // Save directly to Firestore collection
      await setDoc(doc(db, 'portfolio', id), newItem);

      setSuccessMessage('Photo published live to the Sai Graphics Gallery!');
      onSuccess(newItem);

      // Auto close after brief display
      setTimeout(() => {
        onClose();
        handleResetPhoto();
        setTitle('');
        setDescription('');
        setClient('');
        setVideoUrl('');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to save to portfolio:', err);
      setErrorMessage(err.message || 'Error saving photo to gallery. Please verify your admin connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-[var(--brand-bg)] border border-[#d4af37]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[var(--brand-bg)] border-b border-primary flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-primary">
                  Upload Photo to Gallery
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  STUDIO SHOWCASE
                </span>
              </div>
              <p className="text-xs text-muted">
                Add new wedding photography, pre-wedding shoots, or cinematic videos to your live gallery.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary rounded-lg hover:bg-soft transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Authenticated as Admin Warning */}
        {!isAdmin ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-7 h-7" />
            </div>

            <h4 className="font-cinzel text-xl font-bold text-primary">
              Admin Authentication Required
            </h4>

            <p className="text-xs text-secondary max-w-md leading-relaxed">
              Only the authorized studio administrator (<strong className="text-primary">saigraphicsbgp@gmail.com</strong>) can publish new photos, albums, and video reels to the public gallery.
            </p>

            {user ? (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-300">
                Logged in as <strong>{user.email}</strong>. This account does not have gallery publishing rights.
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={async () => {
                  if (onOpenAdminLogin) {
                    onClose();
                    onOpenAdminLogin();
                  } else {
                    await login();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span>Sign in as Admin</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-soft hover:bg-soft transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Admin Upload Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Photo Selection Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose Photo Source</span>
                </label>
                
                <div className="flex items-center gap-1 bg-soft p-1 rounded-lg border border-primary text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUploadMode('device')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      uploadMode === 'device'
                        ? 'bg-[#d4af37] text-slate-950 font-bold'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    From Mac / Phone / PC
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      uploadMode === 'url'
                        ? 'bg-[#d4af37] text-slate-950 font-bold'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {/* Upload Mode: File from Device */}
              {uploadMode === 'device' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="gallery-file-upload"
                  />

                  {!previewUrl ? (
                    <label
                      htmlFor="gallery-file-upload"
                      className="group border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-soft hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 group-hover:bg-[#d4af37]/25 flex items-center justify-center text-[#d4af37] mb-3 transition-colors">
                        {isCompressing ? (
                          <RefreshCw className="w-6 h-6 animate-spin text-[#d4af37]" />
                        ) : (
                          <Upload className="w-6 h-6" />
                        )}
                      </div>

                      <p className="font-semibold text-sm text-primary mb-1">
                        {isCompressing ? 'Optimizing photo for 4K web...' : 'Click to select photo from your Mac / Device'}
                      </p>
                      <p className="text-xs text-muted max-w-sm">
                        Supports high-resolution RAW exports, JPEG, PNG, or WebP. Automatically optimized for ultra-crisp loading.
                      </p>

                      <div className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md group-hover:brightness-105">
                        Browse Files
                      </div>
                    </label>
                  ) : (
                    /* Image Preview Card */
                    <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/50 bg-black/80 flex flex-col sm:flex-row items-center gap-4 p-3 shadow-xl">
                      <div className="relative w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-primary shrink-0">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-emerald-400">
                          Ready to publish
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 text-left space-y-1 w-full">
                        <p className="text-xs font-bold text-primary truncate">
                          {selectedFile?.name || 'Selected Photo'}
                        </p>
                        {fileStats && (
                          <div className="text-[11px] text-muted space-y-0.5 font-mono">
                            <p>Original: <span className="text-slate-400">{formatBytes(fileStats.original)}</span></p>
                            <p className="text-emerald-400 font-semibold">
                              Web Optimized: {formatBytes(fileStats.compressed)} (
                              {Math.round((1 - fileStats.compressed / fileStats.original) * 100)}% lighter)
                            </p>
                          </div>
                        )}
                        <p className="text-[10px] text-secondary">
                          Resized for fast 4K responsive delivery on all screens.
                        </p>
                      </div>

                      <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary bg-soft hover:bg-soft border border-primary transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleResetPhoto}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Upload Mode: Image URL */
                <div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or cloud image URL"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
                  />
                  {imageUrlInput && (
                    <div className="mt-3 aspect-video max-h-48 rounded-xl overflow-hidden bg-slate-950 border border-primary">
                      <img
                        src={imageUrlInput}
                        alt="URL Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setErrorMessage('Invalid image URL. Please check the link.')}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category & Project Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-secondary block mb-1.5 font-medium">
                  Gallery Category *
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--brand-bg)] border border-primary text-xs text-primary outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="Wedding Photography">Wedding Photography</option>
                  <option value="Pre-Wedding Photography">Pre-Wedding Photography</option>
                  <option value="Cinematic Wedding Videos">Cinematic Wedding Videos</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-secondary block mb-1.5 font-medium">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarush & Sneha – Royal Wedding"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Client Name & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-secondary block mb-1.5 font-medium">
                  Client / Couple Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram & Pooja"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-secondary block mb-1.5 font-medium">
                  Event Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-secondary block mb-1.5 font-medium">
                  Year
                </label>
                <input
                  type="text"
                  placeholder="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Video Link */}
            <div>
              <label className="text-xs text-secondary block mb-1.5 font-medium flex items-center justify-between">
                <span>Video Embed Link (Optional - YouTube / Vimeo)</span>
                <span className="text-[10px] text-muted">Adds playable video modal</span>
              </label>
              <input
                type="url"
                placeholder="https://www.youtube-nocookie.com/embed/... or https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary block mb-1.5 font-medium">
                Photo / Project Story
              </label>
              <textarea
                rows={2}
                placeholder="Details about color grading, rituals, photography equipment, or album styling..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-soft border border-primary text-xs text-primary outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            {/* Featured Switch */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-soft border border-primary">
              <input
                type="checkbox"
                id="gallery-featured-toggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
              />
              <label htmlFor="gallery-featured-toggle" className="text-xs text-primary font-medium cursor-pointer flex-1">
                Pin to Spotlight Reel & Top Highlights
              </label>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-primary">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-soft hover:bg-soft transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isCompressing || (!previewUrl && !imageUrlInput)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] hover:brightness-105 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Add to Gallery / फोटो अपलोड करें</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
