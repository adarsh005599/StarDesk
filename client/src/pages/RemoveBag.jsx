import React, { useState } from "react";
import { ImageOff, UploadCloud, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBag = () => {
  const [imageFile, setImageFile] = useState(null);
   const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const formData = new FormData();
      formData.append("image", imageFile);

      const token = await getToken();

      const { data } = await axios.post("/api/ai/remove-bg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
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
 

  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement("a");
    link.href = content;
    link.download = "bg_removed_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col md:flex-row gap-6 transition-all backdrop-blur-md duration-300">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6"
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-rose-600">
              <ImageOff size={20} /> Background Removal
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Upload image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg bg-black/10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-400 file:text-sm file:font-medium"
              />
              <p className="text-sm text-gray-800 mt-1">
                Supports JPG, PNG, and other image formats
              </p>
            </div>

            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className={`w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 rounded-lg mt-4 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
                  Removing...
                </>
              ) : (
                <>
                  <ImageOff size={18} />
                  Remove Background
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 border-2 border-pink-900 rounded-xl p-6 flex flex-col items-center justify-center backdrop-blur-md bg-black/10"
        >
          {loading ? (
            <div className="text-gray-500 text-sm text-center flex flex-col items-center gap-3">
              <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-white" />
              <p>Processing image...</p>
            </div>
          ) : content ? (
            <>
              <img
                src={content}
                alt="Removed Background Result"
                className="w-full h-auto rounded-lg object-contain mb-4"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow transition"
              >
                <Download size={16} />
                Download
              </motion.button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <UploadCloud size={40} strokeWidth={1.2} className="mb-3" />
              <p className="text-sm">
                Upload an image and click “Remove Background” to get started
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RemoveBag;
