import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Instagram, Facebook, Tiktok, History, Settings } from "lucide-react";

const Sidebar = ({ onHistoryClick }) => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 p-6 border-r border-gray-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400">Menu</h2>
      </div>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:text-purple-300 flex items-center">
          <Settings size={20} className="mr-2" />
          Home
        </Link>
        <Link to="/youtube" className="hover:text-purple-300 flex items-center">
          <Youtube size={20} className="mr-2" />
          YouTube
        </Link>
        <Link to="/instagram" className="hover:text-purple-300 flex items-center">
          <Instagram size={20} className="mr-2" />
          Instagram
        </Link>
        <Link to="/facebook" className="hover:text-purple-300 flex items-center">
          <Facebook size={20} className="mr-2" />
          Facebook
        </Link>
        <Link to="/tiktok" className="hover:text-purple-300 flex items-center">
          <Tiktok size={20} className="mr-2" />
          TikTok
        </Link>
        <button
          onClick={onHistoryClick}
          className="text-left hover:text-purple-300 flex items-center"
        >
          <History size={20} className="mr-2" />
          Download History
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
