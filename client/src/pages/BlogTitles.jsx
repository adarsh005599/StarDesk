import React, { useState, useEffect } from "react";
import { Hash, Tag } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const categories = [
  "General",
  "Technology",
  "Business",
  "Health",
  "Lifestyle",
  "Education",
  "Travel",
  "Food",
];

const BlogTitles = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Please enter a keyword.");
      return;
    }

    try {
      setLoading(true);

      const prompt = `Generate a blog title for the ${keyword} in the ${selectedCategory}`;
      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/blog-titles",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content) {
      const el = document.getElementById("blog-result");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [content]);

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col md:flex-row gap-6 backdrop-blur-md">

        {/* Left Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6 text-white"
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-purple-300">
              <Tag size={20} /> AI Title Generator
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-white">
                Keyword
              </label>
              <input
                type="text"
                placeholder="E.g., Future of AI, Remote Work, etc."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">
                Category
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      selectedCategory === cat
                        ? "bg-purple-200 text-purple-900 border-purple-300"
                        : "bg-white/10 hover:bg-black/50 text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white py-3 rounded-lg mt-4 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <Hash size={18} /> Generate title
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Panel - Output */}
        {!content ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6 text-center flex flex-col items-center justify-center text-white/70"
          >
            <Hash size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm">
              Enter keywords and click “Generate Titles” to get started
            </p>
          </motion.div>
        ) : (
          <div
            id="blog-result"
            className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6 text-white overflow-auto max-h-[500px]"
          >
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
