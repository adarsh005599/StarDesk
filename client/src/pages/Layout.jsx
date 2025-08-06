import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useUser, SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const audioRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const shouldShowWelcome = sessionStorage.getItem('showWelcome');

    if (location.pathname === '/ai' && shouldShowWelcome === 'true') {
      sessionStorage.removeItem('showWelcome');
      setShowWelcome(true);
     

      const timer = setTimeout(() => setShowWelcome(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Show welcome animation screen ONLY
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <SignIn />
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Starry background with pulse/ping stars */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0 overflow-hidden">
          <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-ping" style={{ top: '20%', left: '40%' }} />
          <div className="absolute w-[3px] h-[3px] bg-white rounded-full animate-pulse" style={{ top: '70%', left: '70%' }} />
          <div className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full animate-ping" style={{ top: '30%', left: '60%' }} />
          <div className="absolute w-[2.5px] h-[2.5px] bg-white rounded-full animate-pulse" style={{ top: '60%', left: '25%' }} />
        </div>

        {/* Animated Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.img
            src="/bird.png"
            alt="Flying bird"
            className="w-28 sm:w-40 mx-auto mb-6"
            initial={{ y: 50, opacity: 0, rotate: -10 }}
            animate={{ y: [-10, 0, -10], opacity: 1, rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.h1
            className="text-2xl sm:text-4xl font-bold typing-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Welcome to <span className="bg-gradient-to-r from-amber-500 to-green-400 bg-clip-text text-transparent">StarkDesk Universe</span>...
          </motion.h1>
        </div>

        {/* Whoosh sound */}
       
      </div>
    );
  }

  // Actual app layout after welcome animation
  return (
    <div
      className="flex flex-col min-h-screen text-white"
      style={{
        backgroundImage: 'url("/xx1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Audio preload */}
      <audio ref={audioRef} src="/whoosh.wav" preload="auto" />

      {/* Navbar */}
      <nav className="w-full h-16 px-6 sm:px-10 flex items-center justify-between border-b border-white/10 backdrop-blur-md shadow-sm">
        <img
          onClick={() => navigate('/')}
          src={assets.logoimg}
          alt="Logo"
          className="w-28 sm:w-36 cursor-pointer select-none"
        />
        {sidebar ? (
          <X onClick={() => setSidebar(false)} className="w-6 h-6 sm:hidden cursor-pointer" />
        ) : (
          <Menu onClick={() => setSidebar(true)} className="w-6 h-6 sm:hidden cursor-pointer" />
        )}
      </nav>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto px-4 sm:px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
