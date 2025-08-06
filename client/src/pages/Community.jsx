import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [creation, setCreation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        console.log("CREATIONS FETCHED: ", data); 

      if (data.success) {
        setCreation(data.creation || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch creations");
    } finally {
      setLoading(false);
    }
  };

const imageLikeToggle = async (id) => {
  try {
    const token = await getToken();
    const { data } = await axios.post(
      "/api/user/get-like-creation",
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      await fetchCreations(); 
    } else {
      toast.error(data.message || "Failed to like creation");
    }
  } catch (error) {
    toast.error(error.message || "Error liking the image");
  }
};


  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className='text-xl font-semibold mb-2'>Creations</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : creation.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {creation.map((creation, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className='relative group w-full overflow-hidden rounded-xl shadow-md bg-white'
            >
              <img
                src={creation.content}
                alt='creation'
                className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110'
              />

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 flex flex-col justify-end p-4 text-white'
              >
                <p className='text-sm mb-2 line-clamp-2'>{creation.prompt}</p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>{creation.likes.length} likes</span>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`w-5 h-5 cursor-pointer transition-transform duration-300 hover:scale-125 ${
                      creation.likes.includes(user.id)
                        ? 'fill-red-500 text-red-600'
                        : 'text-white'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Download Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100'
              >
                <a
                  href={creation.content}
                  download
                  className='bg-white text-black py-1 px-3 rounded shadow-md text-sm'
                >
                  Download
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">No creations found.</p>
      )}
    </div>
  );
};

export default Community;
