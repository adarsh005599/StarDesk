import React, { useState , useEffect} from "react";
import { Pencil, FileEdit } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from  'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("short");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();
const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!topic.trim()) {
      toast.error("Please enter a keyword.");
      return;
    }

  try {
    setLoading(true);

    const prompt = `Write an article about ${topic} in ${length} length`;

    const token = await getToken();

    const { data } = await axios.post(
      "/api/ai/write-article",
      { prompt, length },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",  // ✅ REQUIRED!
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col md:flex-row gap-6 transition-all duration-300 backdrop-blur-md">
        {/* Left Box - Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6"
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-blue-600">
              <Pencil size={20} /> AI Article Writer
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-900">Article Topic</label>
              <input
                type="text"
                placeholder="The future of artificial intelligence"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-800">Article Length</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full border ${
                    length === "short"
                      ? "bg-blue-100 text-blue-700 border-blue-400"
                      : "bg-white/10 hover:bg-black/50"
                  } transition`}
                  onClick={() => setLength("short")}
                  disabled={loading}
                >
                  Short (200 - 400 words)
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full border ${
                    length === "long"
                      ? "bg-blue-100 text-blue-700 border-blue-400"
                      : "bg-white/10 hover:bg-black/50"
                  } transition`}
                  onClick={() => setLength("long")}
                  disabled={loading}
                >
                  Long (400 - 800 words)
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg mt-4 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FileEdit size={18} /> Generate article
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Box - Output */}
        {!content ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6 text-center flex flex-col items-center justify-center text-gray-500 backdrop-blur-md"
          >
            <FileEdit size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm">Enter a topic and click “Generate article” to get started</p>
          </motion.div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-shadow-black">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
              
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
