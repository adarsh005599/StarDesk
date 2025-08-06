import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Plan = () => {
  return (
    <motion.div
      className='relative z-20 px-4 sm:px-10 py-24 overflow-hidden bg-[#0b0b0b] text-white'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      {/* for gradient bg */}
      <div className="absolute w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[180px] top-[-200px] left-[-150px] z-0"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[150px] bottom-[10%] left-[60%] z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[120px] top-[20%] right-[-100px] z-0"></div>

      <div className='text-center relative z-10'>
        <h2 className=' text-[36px] sm:text-[42px] font-semibold bg-gradient-to-r from-pink-500 via-green-400 to-cyan-400 bg-clip-text text-transparent'>
          Choose your plan
        </h2>
        <p className='text-white text-sm sm:text-base max-w-lg mx-auto mt-2'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      <div className='mt-14 max-sm:mx-2 relative z-10'>
        <PricingTable />
      </div>
    </motion.div>
  );
};

export default Plan;
