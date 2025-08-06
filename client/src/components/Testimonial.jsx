import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image: "adarsh.jpg",
      name: "Adarsh",
      title: "Marketing Director",
      content:
        "This is not just another AI tool. StarkDesk feels like it understands what I want. The results are super polished and ready to publish. I’ve doubled my client output and kept my sanity!",
      rating: 4,
    },
    {
      image: "/IMG_8670.JPG",
      name: "Diksha Singh",
      title: "Model",
      content:
        "I was skeptical at first, but StarkDesk blew me away. The article generator and image tools helped our team reduce content production time by over 60%. It’s like having a creative team on autopilot."

,
      rating: 5,
    },
    {
      image: "adarsh.img.png.jpg",
      name: "Happy",
      title: "Content Writer, TechCorp",
      content:
        "StarkDesk has completely ☠️ The AI tools are intuitive, fast, and insanely powerful. I generated a week's worth of social posts in one evening. Absolute game-changer!",
      rating: 4,
    },
  ];

  return (
    <div className="relative z-10 px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-br from-[#1b061a] via-black to-[#19091e] overflow-hidden">
      {/* Glowing background lines */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[140%] h-full pointer-events-none z-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ea2c79]/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-pink-500/20 blur-3xl rounded-full" />
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-violet-500/10 blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 text-center">
        <h2 className=" text-[42px] font-semibold bg-gradient-to-r from-pink-500 via-green-400 to-cyan-400 bg-clip-text text-transparent">Loved by Creators</h2>
        <p className="text-white max-w-lg mx-auto ">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap mt-10 justify-center">
        {dummyTestimonialData.map((testimonial, index) => (
          <motion.div
            key={index}
             className="p-8 m-4 max-w-xs rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.04)] cursor-pointer transition-all"
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
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img
                    key={i}
                    src={i < testimonial.rating ? assets.star_icon : assets.star_dull_icon}
                    className="w-4 h-4"
                    alt="star"
                  />
                ))}
            </div>

            <p className="text-white text-sm my-5">"{testimonial.content}"</p>
            <hr className="mb-5 border-2 border-pink-950" />
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                className="w-12 object-contain rounded-full"
                alt="user"
              />
              <div className="text-sm text-white/70 ">
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-xs">{testimonial.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
