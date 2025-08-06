import React, { useState } from "react";
import { Scissors, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObj = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); 

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description); // Send this to backend

      const token = await getToken();

      const { data } = await axios.post("/api/ai/remove-obj", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content); // Assuming backend returns { success: true, url: '...' }
        toast.success("Object removed successfully!");
      } else {
        toast.error(data.message || "Image processing failed.");
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-10">
      <div className="bg-white/5 shadow-xl rounded-2xl w-full max-w-6xl grid md:grid-cols-2 gap-6 p-6">

        {/* Left - Upload and Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/10 border-2 border-pink-900 rounded-xl p-6 backdrop-blur-md"
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="text-lg font-semibold text-blue-500 mb-4 flex items-center gap-2">
              <Scissors className="text-blue-500" size={18} />
              Object Removal
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Upload image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-900 border-2 border-pink-950 rounded-lg cursor-pointer bg-white/10 focus:outline-none file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm file:font-medium"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Describe object to remove
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., car in background, tree from the image"
                className="w-full px-3 py-2 border rounded-md text-sm text-pink-950 focus:ring-2 focus:ring-blue-800 outline-none"
              />
              <p className="text-xs text-gray-800 mt-1">
                Be specific about what you want to remove
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
              } text-white py-3 rounded-lg text-sm font-semibold shadow-md transition`}
            >
              {loading ? "Removing..." : "✂️ Remove object"}
            </motion.button>
          </form>
        </motion.div>

        {/* Right - Output */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/10 border-2 border-pink-900 rounded-xl p-6 flex flex-col justify-center items-center text-center text-gray-800"
        >
          {!content ? (
            <>
              <Scissors size={36} strokeWidth={1.2} className="mb-3 text-blue-500" />
              <p className="text-sm">Upload an image and describe what to remove</p>
            </>
          ) : (
            <>
              <img src={content} alt="Processed" className="rounded-xl mb-4 max-h-[300px] object-contain backdrop-blur-md" />
              <p className="text-sm text-green-500">Here is your processed image</p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RemoveObj;
