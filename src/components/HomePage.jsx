import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube } from 'lucide-react';
import { FeaturesSectionDemo } from './Features';
// import { FeaturesSectionDemoTwo } from './FeaturesTwo';


function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Grid Background  */}
      <div className="absolute inset-0 bg-grid-white bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="absolute inset-0 bg-glow" />
 
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 animate-fade-in mt-20">
            <Youtube className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              InTech Downloader
            </h1>
          </div>
          
          <p className="text-gray-400 text-lg mb-8 max-w-2xl">
            Download your favorite YouTube videos in high quality with our fast and reliable downloader.
          </p>

          <button
            onClick={() => navigate('/downloader')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-md text-white font-semibold text-lg 
            hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105
            border border-white/10 backdrop-blur-sm"
          >
            Start Downloading
          </button>
        </div>

        <FeaturesSectionDemo />
        {/* <FeaturesSectionDemoTwo /> */}

        <div className="absolute bottom-8 text-gray-500 text-sm">
          © 2024 InTech YTGrab • All videos are saved to your Videos folder
        </div>
      </div>
      
    </div>
  );
}

export default Home;