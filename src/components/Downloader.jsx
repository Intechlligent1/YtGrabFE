import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader, Youtube, Settings, PlaySquare, Check, AlertCircle, Info, X, File, ExternalLink, Copy, Sparkles, ChevronDown, ChevronUp, Volume2, Video } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Toast notifications
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className={`p-4 rounded-xl shadow-lg max-w-sm backdrop-blur-sm border ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}
      >
        <div className="flex items-center gap-2">
          {toast.type === 'success' && <Check size={16} />}
          {toast.type === 'error' && <X size={16} />}
          {toast.type === 'loading' && <Loader className="animate-spin" size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

// Simple clipboard hook
const useClipboard = () => ({
  copy: (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
});

// URL Input Component
const UrlInput = ({ url, setUrl, isPasted, handlePaste, copyToClipboard, thumbnailUrl, currentDownloadTitle, urlInputRef }) => (
  <div className="space-y-4">
    <div className="relative">
      <input
        ref={urlInputRef}
        type="text"
        placeholder="Paste your video URL here (YouTube, TikTok, Twitter/X, Instagram)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onPaste={handlePaste}
        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
        required
      />
      <AnimatePresence>
        {url && (
          <motion.button
            type="button"
            onClick={copyToClipboard}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy size={18} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPasted && (
          <motion.div
            className="absolute -bottom-6 left-0 text-xs text-green-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} />
            URL pasted successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    
    {thumbnailUrl && (
      <motion.div
        className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={thumbnailUrl} 
          alt="Video thumbnail" 
          className="w-full h-auto"
        />
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-700 font-medium truncate">
            {currentDownloadTitle || "Video Preview"}
          </p>
        </div>
      </motion.div>
    )}
  </div>
);

function Downloader() {
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState("1080p");
  const [downloadType, setDownloadType] = useState("video");
  const [platform, setPlatform] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentDownloadTitle, setCurrentDownloadTitle] = useState("");
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [toasts, setToasts] = useState([]);

  const clipboard = useClipboard();
  const urlInputRef = useRef(null);

  // Toast management
  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Debounced setUrl
  const debouncedSetUrl = useMemo(() => debounce(setUrl, 300), []);

  // Validate URL for supported platforms
  const isValidUrl = (url) => {
    const supportedDomains = [
      'youtube.com', 'youtu.be',
      'tiktok.com',
      'twitter.com', 'x.com',
      'instagram.com'
    ];
    return supportedDomains.some(domain => url.toLowerCase().includes(domain));
  };

  // Auto-hide download complete panel
  useEffect(() => {
    if (downloadComplete) {
      const timer = setTimeout(() => {
        setShowDownloadPanel(false);
        setDownloadComplete(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [downloadComplete]);

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      setIsPasted(true);
      setTimeout(() => setIsPasted(false), 1000);
    }
  };

  const copyToClipboard = () => {
    if (url) {
      clipboard.copy(url);
      addToast("URL copied to clipboard", "success");
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (videoId, quality = "hqdefault") => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  const getFriendlyError = (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (typeof detail === 'object') {
        return detail.message || detail.error || "Download failed";
      }
      return detail;
    }
    return error.message || "An unexpected error occurred";
  };

  const openDownloadsFolder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/open_folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error("Failed to open downloads folder");
      }
      addToast("Downloads folder opened", "success");
    } catch (error) {
      addToast("Failed to open downloads folder", "error");
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!isValidUrl(url)) {
      addToast("Please enter a valid URL from a supported platform", "error");
      return;
    }

    setLoading(true);
    setShowDownloadPanel(true);
    setDownloadComplete(false);
    
    const toastId = addToast("Preparing download...", "loading", 0);

    try {
      const requestData = {
        url,
        resolution: audioOnly ? "best" : resolution,
        download_type: downloadType,
        fallback_resolution: resolution === "1080p" ? "720p" : "480p",
        platform
      };

      const response = await fetch(`${API_BASE_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setDownloadComplete(true);
      removeToast(toastId);

      const data = result.data || result;
      const detectedPlatform = data.platform || "Unknown";
      const title = data.title || "Video";
      
      if (downloadType === "playlist") {
        const successful = data.successful || [];
        const failed = data.failed || [];
        const count = successful.length;
        addToast(`Playlist downloaded: ${count} videos from ${detectedPlatform}`, "success");
      } else {
        setCurrentDownloadTitle(title);
        addToast(`Successfully downloaded: ${title}`, "success");
      }
      
      setUrl("");
    } catch (error) {
      console.error("Download error:", error);
      removeToast(toastId);
      addToast(getFriendlyError(error), "error");
      setShowDownloadPanel(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, []);

  const videoId = extractVideoId(url);
  const thumbnailUrl = videoId ? getThumbnailUrl(videoId) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Youtube className="w-6 h-6 text-red-500" />
            <span className="text-xl font-semibold text-gray-900">InTech Downloader</span>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Info size={16} />
            <span>Help</span>
          </button>
        </div>
      </header>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6">
              <Download className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Download Your Videos
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Paste any video URL and download in your preferred quality. 
              Supports YouTube, TikTok, Twitter/X, and Instagram.
            </p>
          </motion.div>

          {/* Download Form */}
          <motion.form 
            onSubmit={handleDownload}
            className="space-y-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <UrlInput
                url={url}
                setUrl={debouncedSetUrl}
                isPasted={isPasted}
                handlePaste={handlePaste}
                copyToClipboard={copyToClipboard}
                thumbnailUrl={thumbnailUrl}
                currentDownloadTitle={currentDownloadTitle}
                urlInputRef={urlInputRef}
              />

              {/* Platform Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { value: "auto", label: "Auto-detect", icon: Sparkles },
                    { value: "youtube", label: "YouTube", icon: Youtube },
                    { value: "tiktok", label: "TikTok", icon: PlaySquare },
                    { value: "twitter", label: "Twitter/X", icon: PlaySquare },
                    { value: "instagram", label: "Instagram", icon: PlaySquare }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPlatform(value)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        platform === value
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon size={20} className="mb-1" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality and Type Selection */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quality</label>
                  <div className="space-y-2">
                    {[
                      { value: "best", label: "Best Available", desc: "Highest quality" },
                      { value: "1080p", label: "1080p HD", desc: "Full HD (1920×1080)" },
                      { value: "720p", label: "720p HD", desc: "HD (1280×720)" },
                      { value: "480p", label: "480p SD", desc: "Standard (854×480)" }
                    ].map(({ value, label, desc }) => (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="resolution"
                          value={value}
                          checked={resolution === value}
                          onChange={(e) => setResolution(e.target.value)}
                          disabled={audioOnly}
                          className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500 disabled:opacity-50"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{label}</div>
                          <div className="text-xs text-gray-500">{desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Download Type</label>
                  <div className="space-y-2">
                    {[
                      { value: "video", label: "Single Video", desc: "Download one video", icon: Video },
                      { value: "playlist", label: "Playlist", desc: "Download entire playlist", icon: PlaySquare }
                    ].map(({ value, label, desc, icon: Icon }) => (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="downloadType"
                          value={value}
                          checked={downloadType === value}
                          onChange={(e) => setDownloadType(e.target.value)}
                          className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                        />
                        <div className="ml-3 flex items-center">
                          <Icon size={16} className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{label}</div>
                            <div className="text-xs text-gray-500">{desc}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>Advanced Options</span>
                </button>
                
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={audioOnly}
                          onChange={() => setAudioOnly(!audioOnly)}
                          className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                        />
                        <div className="flex items-center gap-2">
                          <Volume2 size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Audio Only (MP3)</span>
                        </div>
                      </label>
                      <p className="text-xs text-gray-500 mt-2 ml-7">
                        Download audio only and convert to MP3 format
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Download Button */}
              <motion.button
                type="submit"
                className="w-full mt-8 px-6 py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !url}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Download Now</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Help Section */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 bg-blue-50 rounded-2xl border border-blue-200 p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Info size={20} />
                  How to Use
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">Supported Platforms</h4>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>YouTube (videos and playlists)</li>
                      <li>TikTok (individual videos)</li>
                      <li>Twitter/X (video posts)</li>
                      <li>Instagram (video posts)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Multiple quality options</li>
                      <li>Audio-only downloads (MP3)</li>
                      <li>Playlist support</li>
                      <li>Automatic platform detection</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> This tool is for personal use only. Please respect the terms of service of each platform and copyright laws.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Download Progress Panel */}
      <AnimatePresence>
        {showDownloadPanel && (
          <motion.div 
            className="fixed bottom-6 right-6 w-80 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${downloadComplete ? 'bg-green-500' : 'bg-blue-500'}`} />
                <span className="text-sm font-medium text-gray-900">
                  {downloadComplete ? "Download Complete" : "Downloading..."}
                </span>
              </div>
              <button 
                onClick={() => setShowDownloadPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  downloadComplete ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {downloadComplete ? 
                    <Check className="text-green-600" size={20} /> : 
                    <Loader className="animate-spin text-blue-600" size={20} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentDownloadTitle || "Processing video..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {downloadComplete ? "Saved to Downloads folder" : "Please wait..."}
                  </p>
                </div>
              </div>
              
              {downloadComplete && (
                <button
                  className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2"
                  onClick={openDownloadsFolder}
                >
                  <ExternalLink size={16} />
                  Open Downloads Folder
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Downloader;