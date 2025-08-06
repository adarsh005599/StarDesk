import React from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Aitools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="relative px-4 sm:px-20 xl:px-32 py-24 overflow-hidden bg-[#0b0b0b] text-white">

      {/* --- Premium Glowing Blobs --- */}
      <div className="absolute w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[180px] top-[-200px] left-[-150px] z-0"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[150px] bottom-[10%] left-[60%] z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[120px] top-[20%] right-[-100px] z-0"></div>

      {/* Optional SVG Mesh Overlay */}
      <div className="absolute inset-0 bg-[url('/grid-mesh.svg')] bg-cover bg-center opacity-5 pointer-events-none z-0" />

      {/* Content Container */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-green-400 to-cyan-400 bg-clip-text text-transparent">
          Powerful AI Tools
        </h2>
        <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm sm:text-base">
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="relative z-10 flex flex-wrap mt-16 justify-center">
        {AiToolsData.map((tool, index) => (
          <motion.div
            key={index}
            className="p-8 m-4 max-w-xs rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.04)] cursor-pointer transition-all"
            onClick={() => user && navigate(tool.path)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
            whileTap={{ scale: 0.96 }}
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-white rounded-xl border border-white/20"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>
            <p className="text-white/70 text-sm max-w-[95%]">{tool.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Aitools;
