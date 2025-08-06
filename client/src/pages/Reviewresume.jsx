import React, { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a file.");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const formData = new FormData();
      formData.append("resume", file);

      const token = await getToken();

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message || "Resume review failed.");
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
      <div className="bg-white/10 shadow-xl rounded-2xl w-full max-w-6xl grid md:grid-cols-2 gap-6">
        
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-black/10 border-2 border-pink-900 shadow-md rounded-2xl p-6 backdrop-blur-md "
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-green-900 mb-4">
              <Sparkles className="text-green-600" size={18} />
              Resume Review
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Upload Resume
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm border border-green-400 rounded-lg bg-white/20 cursor-pointer focus:outline-none file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-green-400 file:text-sm file:font-medium text-gray-700"
              />
              <p className="text-xs text-gray-800 mt-1">
                Supports PDF, PNG, JPG formats
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70"
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Reviewing...
                </span>
              ) : (
                "Review Resume"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Result / Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-black/10 border-2 border-pink-900 shadow-md rounded-2xl p-6 flex flex-col justify-start items-start text-start text-white overflow-y-auto max-h-[500px] backdrop-blur-md"
        >
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full h-full"
              >
                <Loader2 className="animate-spin w-6 h-6 text-green-500" />
                <p className="ml-2 text-sm text-green-600">Analyzing Resume...</p>
              </motion.div>
            ) : content ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-black w-full"
              >
                <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <FileText className="text-green-400" /> Resume Feedback
                </h3>
                <Markdown>{content}</Markdown>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center w-full"
              >
                <FileText size={36} className="mb-3 text-green-400 mx-auto" />
                <h3 className="text-md font-semibold mb-1">Analysis Results</h3>
                <p className="text-sm text-gray-800">
                  Upload your resume and click "Review Resume" to get started.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewResume;
