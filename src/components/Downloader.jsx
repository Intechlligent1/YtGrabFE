import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader, Youtube, Settings, PlaySquare, Check, AlertCircle, Info, History, X, File, ChevronUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Downloader() {
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState("1080p");
  const [downloadType, setDownloadType] = useState("video");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentDownloadTitle, setCurrentDownloadTitle] = useState("");
  const [showChromeDownload, setShowChromeDownload] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [minimizeDownload, setMinimizeDownload] = useState(false);

  // Utility functions
 
// Copy
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

  const estimateTimeRemaining = (loaded, total, startTime) => {
    if (loaded === 0) return "Calculating...";
    const elapsed = (Date.now() - startTime) / 1000;
    const bytesPerSecond = loaded / elapsed;
    if (bytesPerSecond === 0) return "Unknown";
    
    const remainingBytes = total - loaded;
    const remainingSeconds = remainingBytes / bytesPerSecond;
    
    if (remainingSeconds < 60) return `${Math.round(remainingSeconds)}s`;
    if (remainingSeconds < 3600) return `${Math.round(remainingSeconds / 60)}m`;
    return `${Math.round(remainingSeconds / 3600)}h`;
  };

  useEffect(() => {
    const saved = localStorage.getItem("recentDownloads");
    if (saved) setRecentDownloads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("recentDownloads", JSON.stringify(recentDownloads));
  }, [recentDownloads]);

  useEffect(() => {
    if (downloadComplete) {
      const timer = setTimeout(() => {
        setShowChromeDownload(false);
        setDownloadComplete(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [downloadComplete]);

  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const addToRecentDownloads = (title, type, quality, size) => {
    const newDownload = {
      id: Date.now(),
      title,
      type,
      quality,
      size: formatFileSize(size),
      date: new Date().toLocaleString()
    };
    setRecentDownloads(prev => [newDownload, ...prev.slice(0, 9)]);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setProgress(0);
    setFileSize(0);
    setDownloadedSize(0);
    setShowChromeDownload(true);
    setDownloadComplete(false);
    setMinimizeDownload(false);
    const downloadStartTime = Date.now();

    try {
      const infoResponse = await axios.post(
        "http://127.0.0.1:5050/api/get_info/",
        { url }
      );
      setCurrentDownloadTitle(infoResponse.data.title || "YouTube Video");
    } catch (error) {
      setCurrentDownloadTitle("YouTube Video");
    }

    const toastId = toast.loading("Preparing download...");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5050/api/download/", 
        { 
          url, 
          resolution, 
          download_type: downloadType,
          fallback_resolution: resolution === "1080p" ? "720p" : "480p"
        },
        {
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
              setFileSize(progressEvent.total);
              setDownloadedSize(progressEvent.loaded);
            }
          }
        }
      );

      setDownloadComplete(true);
      setProgress(100);

      if (downloadType === "playlist") {
        const count = response.data.titles?.length || 0;
        const totalSize = response.data.total_size || fileSize;
        toast.success(`Playlist downloaded: ${count} videos`, { id: toastId });
        showNotification("Playlist Downloaded", `${count} videos downloaded`);
        addToRecentDownloads(`Playlist (${count} videos)`, "playlist", resolution, totalSize);
      } else {
        const title = response.data.title || currentDownloadTitle;
        const size = response.data.file_size || fileSize;
        toast.success(`Downloaded: ${title}`, { id: toastId });
        showNotification("Download Completed", title);
        addToRecentDownloads(title, "video", resolution, size);
      }
      setUrl("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error downloading video", { id: toastId });
      setShowChromeDownload(false);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setRecentDownloads([]);
    localStorage.removeItem("recentDownloads");
    toast.success("Download history cleared");
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white opacity-100" />
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="absolute inset-0 bg-glow" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
      
      <motion.button
        onClick={() => setShowHistory(!showHistory)}
        className="fixed right-6 top-6 z-50 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full shadow-lg backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={showHistory ? "Close history" : "View download history"}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {showHistory ? <X size={20} /> : <History size={20} />}
      </motion.button>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              borderLeft: '4px solid #8b5cf6',
            },
            success: { borderLeft: '4px solid #10b981' },
            error: { borderLeft: '4px solid #ef4444' },
          }}
        />
        
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="fixed top-0 left-0 w-full h-1.5 bg-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <Youtube className="w-12 h-12 text-red-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            InTech Downloader
          </h1>
        </motion.div>
        
        <motion.form 
          onSubmit={handleDownload}
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
                <input
                  type="text"
                  placeholder="Paste YouTube URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-4 pl-4 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Quality</label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full pl-10 p-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
                    >
                      <option value="1080p">1080p HD</option>
                      <option value="720p">720p HD</option>
                      <option value="480p">480p SD</option>
                      <option value="360p">360p Low</option>
                      <option value="best">Best Quality</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Type</label>
                  <div className="relative">
                    <PlaySquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={downloadType}
                      onChange={(e) => setDownloadType(e.target.value)}
                      className="w-full pl-10 p-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
                    >
                      <option value="video">Single Video</option>
                      <option value="playlist">Playlist</option>
                    </select>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                className="relative w-full p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !url}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Downloading... {progress}%</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Download Now</span>
                    </>
                  )}
                </span>
              </motion.button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-gray-400 hover:text-purple-400 text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <Info size={14} />
                  <span>{showInfo ? "Hide" : "Show"} information</span>
                </button>
              </div>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-700/20 rounded-lg p-4 text-sm text-gray-300 overflow-hidden backdrop-blur-sm border border-gray-700/30"
                  >
                    <h3 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      How to use
                    </h3>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Paste any YouTube video or playlist URL</li>
                      <li>Select your preferred quality</li>
                      <li>Choose between single video or playlist</li>
                      <li>Downloaded files are saved to your Videos folder</li>
                      <li>For playlists, each video will be downloaded separately</li>
                      <li>Click the history icon <History size={12} className="inline" /> to view download history</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.form>

        <motion.p 
          className="mt-8 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          InTech YtGrab &copy; {new Date().getFullYear()} • All videos are saved to your Videos folder
        </motion.p>
      </div>

      {/* Chrome-style Download Panel */}
      <AnimatePresence>
        {showChromeDownload && (
          <motion.div 
            className={`fixed bottom-0 ${minimizeDownload ? 'right-0 w-64' : 'right-6 w-80'} z-50 bg-gray-800 rounded-t-lg shadow-2xl border border-gray-700 overflow-hidden`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Download size={16} className={downloadComplete ? "text-green-400" : "text-blue-400"} />
                <span className="text-sm font-medium text-gray-200">
                  {downloadComplete ? "Download complete" : "Downloading"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button 
                  onClick={() => setMinimizeDownload(!minimizeDownload)}
                  className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronUp size={16} className={minimizeDownload ? "rotate-180" : ""} />
                </motion.button>
                <motion.button 
                  onClick={() => setShowChromeDownload(false)}
                  className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {!minimizeDownload && (
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center"
                    animate={{ 
                      backgroundColor: downloadComplete ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)" 
                    }}
                  >
                    {downloadComplete ? 
                      <File className="text-green-400" size={20} /> : 
                      <Loader className="animate-spin text-blue-400" size={20} />
                    }
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {currentDownloadTitle.length > 40 
                        ? `${currentDownloadTitle.substring(0, 37)}...` 
                        : currentDownloadTitle}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {downloadComplete 
                          ? formatFileSize(fileSize) 
                          : `${formatFileSize(downloadedSize)} of ${formatFileSize(fileSize)}`
                        }
                      </span>
                      {!downloadComplete && progress > 0 && (
                        <span className="text-blue-400">
                          {progress}%
                        </span>
                      )}
                    </div>
                    
                    {!downloadComplete && (
                      <>
                        <div className="mt-2 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Est. time: {estimateTimeRemaining(downloadedSize, fileSize, Date.now())}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
            />
            
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900/80 border-l border-gray-700/50 shadow-xl z-50 overflow-hidden backdrop-blur-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <History size={18} />
                    Download History
                  </h2>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {recentDownloads.length > 0 && (
                  <div className="flex justify-end mb-2">
                    <button 
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <X size={12} />
                      Clear All
                    </button>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {recentDownloads.length > 0 ? (
                    recentDownloads.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800/30 rounded-lg p-4 text-sm border border-gray-700/50 hover:border-gray-600/50 transition-all backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 rounded-full p-1 mt-1">
                            <Check className="text-green-500" size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate" title={item.title}>
                              {item.title}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                              <span className="bg-gray-700/30 px-2 py-1 rounded">
                                {item.type === "video" ? "Video" : "Playlist"} • {item.quality} • {item.size}
                              </span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <Download className="mx-auto mb-3 opacity-30" size={32} />
                      <p>No downloads yet</p>
                      <p className="text-xs mt-1">Your download history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Downloader;