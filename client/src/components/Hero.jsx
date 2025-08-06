import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Hero = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    sessionStorage.setItem('showWelcome', 'true'); 
    navigate('/ai');
  };
 const handleWatchDemo = () => {
    toast("Oh come on... do it yourself and be a legend 😎", {
      icon: "🥺",
      style: {
        borderRadius: '8px',
       background: 'linear-gradient(to right, #6a00f4, #8e2de2)',
        color: '#fff',
      },
    });
  };


  return (
    <motion.div
      className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-gradient-to-br from-black via-[#0f0f0f] to-black min-h-screen overflow-hidden'
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Gradient Blur Glow Background */}
      <div className='absolute w-[600px] h-[600px] rounded-full bg-pink-500/20 blur-3xl top-10 -left-40 z-0'></div>
      <div className='absolute w-[500px] h-[500px] rounded-full bg-green-400/20 blur-2xl bottom-0 right-0 z-0'></div>

      {/* Hero Content */}
      <motion.div className='text-center mb-6 z-10' variants={fadeUp}>
        <motion.h1
          className='text-3xl text-white sm:text-5xl md:text-6xl 2xl:text-7xl font-extrabold mx-auto leading-tight tracking-tight'
          whileHover={{ scale: 1.015 }}
        >
          Create powerful content with <br />
          <motion.span
            className='inline-block bg-gradient-to-r from-amber-500 to-green-400 bg-clip-text text-transparent'
            whileHover={{
              scale: 1.1,
              rotate: [-1.5, 1.5, -1, 1, 0],
              transition: { duration: 0.6 },
            }}
          >
            Stark-AI tools
          </motion.span>
        </motion.h1>

        <motion.p
          className='mt-5 max-w-xs sm:max-w-xl m-auto text-white/80 text-sm sm:text-base'
          variants={fadeUp}
        >
          Unlock your creative potential with our cutting-edge AI suite. Write compelling articles, generate stunning images, and streamline your productivity.
        </motion.p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className='flex flex-wrap justify-center gap-6 text-sm max-sm:text-xs mt-6 z-10'
        variants={fadeUp}
      >
        <motion.button
          onClick={handleStart} 
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px #ec4899' }}
          whileTap={{ scale: 0.95 }}
          className='bg-gradient-to-r from-pink-600 to-rose-500 text-white font-medium px-10 py-3 rounded-xl transition-all duration-300 shadow-lg'
        >
          Enter StarkDesk Universe

        </motion.button>

        <motion.button onClick={handleWatchDemo}
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px #22c55e' }}
          whileTap={{ scale: 0.95 }}
          className='bg-gradient-to-r from-green-600 to-emerald-400 text-white font-medium px-10 py-3 rounded-xl transition-all duration-300 shadow-lg'
        >
          Watch Demo
        </motion.button>
      </motion.div>

      {/* Trusted Badge */}
      <motion.div
        className='flex items-center gap-4 mt-10 mx-auto text-white text-sm font-medium z-10'
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, 0],
          boxShadow: '0 0 30px rgba(255,255,255,0.2)',
        }}
        transition={{ duration: 0.6, type: 'spring' }}
        variants={fadeUp}
      >
        <motion.img
          src={assets.user_group}
          className='h-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, 0],
          boxShadow: '0 0 30px rgba(255,255,255,0.2)',
        }}
        />
        Trusted by <span className='text-green-400 font-semibold ml-1'>10K+ creators</span>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
