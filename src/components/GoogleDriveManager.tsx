import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@firebase/auth';
import {
  googleSignIn,
  googleSignOut,
  initAuth,
  getAccessToken,
  clearAccessToken
} from '../services/googleDriveAuth';
import {
  DriveFile,
  listDriveFiles,
  searchDriveFiles,
  createDriveFolder,
  uploadToDrive,
  deleteDriveFile
} from '../services/googleDriveApi';
import {
  Folder,
  FileImage,
  FileVideo,
  FileText,
  File as GenericFile,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  HardDrive,
  AlertTriangle,
  X,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

interface GoogleDriveManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  isOpen,
  onClose
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // File explorer state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<{ id: string; name: string }>({
    id: 'root',
    name: 'My Drive'
  });
  const [folderHistory, setFolderHistory] = useState<Array<{ id: string; name: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // New folder dialog
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Uploading state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Delete confirmation modal state (MANDATORY per skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when folder or token changes
  const fetchFiles = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    setUploadStatus(null);
    try {
      const data = await listDriveFiles(accessToken, currentFolder.id);
      setFiles(data);
      setAuthError(null);
    } catch (err: any) {
      console.error('Failed to load Drive files:', err);
      const msg = err.message || 'Failed to load Drive files';
      if (
        msg.toLowerCase().includes('insufficient') ||
        msg.toLowerCase().includes('scope') ||
        msg.toLowerCase().includes('permission') ||
        msg.toLowerCase().includes('403') ||
        msg.toLowerCase().includes('401')
      ) {
        setAuthError('Google Drive permissions required: Your current token has insufficient scopes. Please click below to authorize Google Drive access on the consent screen.');
        clearAccessToken();
        setAccessToken(null);
      } else {
        setAuthError(msg);
      }
    } finally {
      setIsLoadingFiles(false);
    }
  }, [accessToken, currentFolder.id]);

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles();
    }
  }, [isOpen, accessToken, fetchFiles]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google Drive');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setAccessToken(null);
    setFiles([]);
    setFolderHistory([]);
    setCurrentFolder({ id: 'root', name: 'My Drive' });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !searchQuery.trim()) return;
    setIsSearching(true);
    setIsLoadingFiles(true);
    try {
      const results = await searchDriveFiles(accessToken, searchQuery.trim());
      setFiles(results);
    } catch (err: any) {
      console.error('Search error:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchFiles();
  };

  const handleOpenFolder = (folder: DriveFile) => {
    setFolderHistory((prev) => [...prev, currentFolder]);
    setCurrentFolder({ id: folder.id, name: folder.name });
  };

  const handleNavigateBack = (targetIndex: number) => {
    const targetFolder = folderHistory[targetIndex];
    setFolderHistory((prev) => prev.slice(0, targetIndex));
    setCurrentFolder(targetFolder);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      await createDriveFolder(accessToken, newFolderName.trim(), currentFolder.id);
      setNewFolderName('');
      setShowNewFolderModal(false);
      await fetchFiles();
    } catch (err: any) {
      alert(`Error creating folder: ${err.message}`);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleCreatePresetDeliveryFolder = async () => {
    if (!accessToken) return;
    setIsCreatingFolder(true);
    try {
      const folder = await createDriveFolder(
        accessToken,
        `Sai Graphics – Project Delivery (${new Date().toLocaleDateString()})`,
        currentFolder.id
      );
      await fetchFiles();
      handleOpenFolder(folder);
    } catch (err: any) {
      alert(`Error creating folder: ${err.message}`);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!accessToken || !selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${selectedFiles.length} file(s) to Google Drive...`);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadToDrive(accessToken, selectedFiles[i], currentFolder.id);
      }
      setUploadStatus(`Successfully uploaded to Google Drive!`);
      await fetchFiles();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Mandatory Confirmation for destructive operations
  const confirmDelete = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      alert(`Failed to delete file: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const renderFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-[#d4af37]" />;
    }
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-[#38bdf8]" />;
    }
    if (mimeType.startsWith('video/')) {
      return <FileVideo className="w-5 h-5 text-purple-400" />;
    }
    if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-rose-400" />;
    }
    return <GenericFile className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0a0c12] border border-[#d4af37]/35 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#0d1017] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white leading-none">
                  Google Drive Studio Storage
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] font-bold">
                  WORKSPACE CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Access client wedding media, raw footage & master video exports directly on Google Drive.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close Google Drive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!currentUser || !accessToken ? (
          /* Sign In Screen with Official Button */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37]/20 to-[#38bdf8]/20 border border-[#d4af37]/40 flex items-center justify-center mb-5">
              <HardDrive className="w-8 h-8 text-[#d4af37]" />
            </div>

            <h4 className="font-cinzel text-2xl font-bold text-white mb-2">
              Connect Your Google Drive
            </h4>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-6">
              Sign in with your Google account to browse footage, deliver high-res photo albums, and manage studio files seamlessly.
            </p>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 max-w-lg flex flex-col gap-2 text-left">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Google Drive Permission Required</span>
                </div>
                <p className="leading-relaxed">
                  {authError}
                </p>
                <p className="text-[11px] text-amber-300/80 font-mono">
                  Tip: When the Google sign-in window appears, check the permissions box to allow file access.
                </p>
              </div>
            )}

            {/* Official Style Sign In with Google Button */}
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 shadow-xl active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isAuthenticating ? 'Connecting to Drive...' : 'Sign in with Google'}</span>
            </button>

            <span className="text-[11px] text-slate-500 mt-4">
              Access permissions are scoped to Google Drive with permission from the user.
            </span>
          </div>
        ) : (
          /* Logged In Google Drive Explorer */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="px-6 py-3 bg-[#0d1017]/70 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Left: User status & Presets */}
              <div className="flex items-center gap-3">
                {currentUser.photoURL && (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-7 h-7 rounded-full border border-white/20"
                  />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-white">{currentUser.displayName}</span>
                  <span className="text-slate-400 ml-2 hidden sm:inline">({currentUser.email})</span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors ml-2"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Right: Actions (New Folder, Preset, Upload) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreatePresetDeliveryFolder}
                  disabled={isCreatingFolder}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Delivery Folder</span>
                  <span className="sm:hidden">Deliveries</span>
                </button>

                <button
                  onClick={() => setShowNewFolderModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Folder</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-[#38bdf8] hover:bg-[#7dd3fc] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <button
                  onClick={fetchFiles}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  title="Refresh files"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>

            </div>

            {/* Breadcrumb Navigation & Search Strip */}
            <div className="px-6 py-2.5 bg-[#0a0c12] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-slate-400 font-medium overflow-x-auto">
                <button
                  onClick={() => {
                    setFolderHistory([]);
                    setCurrentFolder({ id: 'root', name: 'My Drive' });
                  }}
                  className={`hover:text-[#d4af37] transition-colors ${
                    currentFolder.id === 'root' ? 'text-[#d4af37] font-bold' : ''
                  }`}
                >
                  My Drive
                </button>

                {folderHistory.map((f, idx) => (
                  <React.Fragment key={f.id}>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <button
                      onClick={() => handleNavigateBack(idx)}
                      className="hover:text-[#d4af37] transition-colors truncate max-w-[120px]"
                    >
                      {f.name}
                    </button>
                  </React.Fragment>
                ))}

                {currentFolder.id !== 'root' && (
                  <>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-white font-bold truncate max-w-[150px]">
                      {currentFolder.name}
                    </span>
                  </>
                )}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search in Drive..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white outline-none focus:border-[#d4af37] w-44 sm:w-56"
                  />
                </div>
                {isSearching && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </form>

            </div>

            {/* Upload Notification */}
            {uploadStatus && (
              <div className="px-6 py-2 bg-[#d4af37]/15 border-b border-[#d4af37]/30 text-xs text-[#f3e5ab] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Files Grid / List View */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingFiles ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#d4af37] mb-2" />
                  <span>Loading Google Drive files...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                  <Folder className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-300">No files in this folder</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Upload wedding footage or create a dedicated delivery folder to organize files.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                      <div
                        key={file.id}
                        className="group relative p-3.5 rounded-xl glass-panel border border-white/5 hover:border-[#d4af37]/40 hover:bg-white/[0.02] transition-all flex flex-col justify-between"
                      >
                        <div
                          onClick={() => (isFolder ? handleOpenFolder(file) : null)}
                          className={isFolder ? 'cursor-pointer' : ''}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 shrink-0">
                              {renderFileIcon(file.mimeType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className="text-xs font-semibold text-white truncate group-hover:text-[#f3e5ab] transition-colors"
                                title={file.name}
                              >
                                {file.name}
                              </h5>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {isFolder ? 'Folder' : file.size ? `${(parseInt(file.size) / (1024 * 1024)).toFixed(1)} MB` : 'File'}
                              </span>
                            </div>
                          </div>

                          {/* Image preview thumbnail if available */}
                          {file.thumbnailLink && (
                            <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-white/5">
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>

                        {/* File Card Actions */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                          {file.webViewLink ? (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#38bdf8] hover:text-white flex items-center gap-1 font-mono transition-colors"
                            >
                              <span>Open in Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span />
                          )}

                          {/* Delete Trigger - MUST open confirmation per workspace integration skill */}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Modal: Create Folder */}
        {showNewFolderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#0d1017] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl">
              <h4 className="font-cinzel text-lg font-bold text-white mb-3">
                Create New Drive Folder
              </h4>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Folder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman & Sneha - 4K Cinema"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFolderModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingFolder}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#d4af37] hover:bg-[#f3e5ab] disabled:opacity-50"
                  >
                    {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mandatory User Confirmation Dialog for Destructive Operations (Skill Compliance) */}
        {fileToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0d1017] border border-rose-500/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cinzel text-lg font-bold text-white">
                    Confirm File Deletion
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Are you sure you want to permanently delete{' '}
                    <strong className="text-white font-mono">"{fileToDelete.name}"</strong> from your
                    Google Drive? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete from Drive'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
