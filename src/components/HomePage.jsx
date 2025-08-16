import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Youtube, Zap, Shield, Clock } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Youtube className="w-6 h-6 text-red-500" />
            <span className="text-xl font-semibold text-gray-900">InTech Downloader</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            About
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Download Videos
              <span className="block text-red-500">From Any Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Fast, secure, and reliable video downloader supporting YouTube, TikTok, Twitter/X, and Instagram. 
              No registration required, completely free to use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={() => navigate('/downloader')}
                className="flex items-center space-x-2 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>Start Downloading</span>
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>1M+ Downloads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>No Registration</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
              Why Choose InTech Downloader?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-6">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600">
                  Download videos in seconds with our optimized servers and advanced compression technology.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-6">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Secure</h3>
                <p className="text-gray-600">
                  Your privacy is protected. We don't store your data or track your downloads.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-6">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Always Available</h3>
                <p className="text-gray-600">
                  24/7 uptime guarantee. Download anytime, anywhere, on any device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Platforms */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Supported Platforms
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Download from your favorite social media and video platforms
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { name: "YouTube", color: "text-red-500", bg: "bg-red-50" },
                { name: "TikTok", color: "text-black", bg: "bg-gray-100" },
                { name: "Twitter/X", color: "text-blue-500", bg: "bg-blue-50" },
                { name: "Instagram", color: "text-pink-500", bg: "bg-pink-50" }
              ].map((platform) => (
                <div key={platform.name} className={`p-6 rounded-xl ${platform.bg} border border-gray-200`}>
                  <div className={`w-12 h-12 ${platform.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Youtube className={`w-6 h-6 ${platform.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/downloader')}
              className="inline-flex items-center space-x-2 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Try It Now</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Youtube className="w-6 h-6 text-red-500" />
              <span className="text-xl font-semibold">InTech Downloader</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 InTech • All rights reserved
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>All videos are downloaded to your device. We respect platform terms of service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;