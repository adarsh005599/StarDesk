import React, { useState } from "react";
import { ImagePlus, Image, Download } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const styles = ["Realistic", "Ghibli Style", "Anime", "Cyberpunk", "3D style", "Fantasy"];

const GenreateImages = () => {
  const [input, setInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter an image description.");
      return;
    }

    try {
      setLoading(true);

      const fullPrompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt: fullPrompt, publish },
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
        toast.error(data.message || "Image generation failed.");
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement("a");
    link.href = content;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col md:flex-row gap-6 backdrop-blur-md transition-all duration-300">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-black/10 border-2 border-pink-900 rounded-xl p-6"
        >
          <form onSubmit={onSubmitHandler}>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-green-600">
              <ImagePlus size={20} /> AI Image Generator
            </h2>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-200">
                Describe Your Image
              </label>
              <textarea
                rows="4"
                placeholder="Describe what you want to see in the image..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white/10 text-white placeholder-white/60"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Style
              </label>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`px-4 py-2 rounded-full border ${
                      selectedStyle === s
                        ? "bg-green-100 text-green-700 border-green-400"
                        : "bg-white/10 hover:bg-black/50 text-white"
                    } transition`}
                    onClick={() => setSelectedStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-white text-sm">
              <input
                id="publish"
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              <label htmlFor="publish">Publish to community</label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg mt-4 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              {loading ? (
                <>
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
                </>
              ) : (
                <>
                  <ImagePlus size={18} /> Generate image
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
          className="flex-1 border-2 border-pink-900 rounded-xl p-6 text-center flex flex-col items-center justify-center backdrop-blur-md text-gray-400"
        >
          {loading ? (
            <div className="w-full h-[300px] bg-gray-600/30 animate-pulse rounded-xl" />
          ) : content ? (
            <>
              <img
                src={content}
                alt="Generated"
                className="rounded-xl max-h-[400px] object-contain shadow-md mb-4"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                <Download size={16} /> Download
              </button>
            </>
          ) : (
            <>
              <Image size={40} strokeWidth={1.2} className="mb-3" />
              <p className="text-sm">
                Describe an image and click “Generate Image” to get started
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GenreateImages;
