import React, { useEffect, useState } from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';
import CreationsItems from '../components/CreationsItems';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Dashboard = () => {
  const [creation, setCreation] = useState([]);
  const [loading, setLoading] = useState(true); // default loading true
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    setLoading(true); // set loading before request
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreation(data.creation || []);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching creations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className='h-full overflow-auto p-4 sm:p-6 text-white/80'>

      {/* Summary Cards */}
      <motion.div
        className='flex flex-wrap justify-start gap-4 sm:gap-6'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        {/* Total Creations */}
        <motion.div
          className='flex justify-between items-center w-full sm:w-72 p-5 px-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer'
          custom={1}
          variants={fadeInUp}
        >
          <div>
            <p className='text-white/80 text-sm'>Total Creations</p>
            <h2 className='text-white text-2xl font-semibold'>{creation.length}</h2>
          </div>
          <Sparkles className='w-9 h-9 p-1.5 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-white shadow-lg hover:shadow-yellow-500/30 transition duration-300' />
        </motion.div>

        {/* Active Plan */}
        <motion.div
          className='flex justify-between items-center w-full sm:w-72 p-5 px-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer'
          custom={2}
          variants={fadeInUp}
        >
          <div>
            <p className='text-white/80 text-sm'>Active Plan</p>
            <h2 className='text-white text-2xl font-semibold'>
              <Protect plan='Free' fallback='Premium'>Premium</Protect>
            </h2>
          </div>
          <Gem className='w-9 h-9 p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/40 transition duration-300' />
        </motion.div>
      </motion.div>

      {/* Recent Creations */}
      <div className='mt-10'>
        <p className='text-lg font-semibold text-white mb-4'>✨ Recent Creations</p>

        {loading ? (
          <div className='flex flex-col gap-5'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='h-40 bg-white/10 animate-pulse rounded-xl'
              ></div>
            ))}
          </div>
        ) : creation.length === 0 ? (
          <p className="text-white/50 italic">No creations found.</p>
        ) : (
          <div className='gap-5'>
            {creation.map((item, i) => (
              <motion.div
                key={item.id}
                className='flex flex-col gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-pink-950 shadow-md hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <CreationsItems item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
