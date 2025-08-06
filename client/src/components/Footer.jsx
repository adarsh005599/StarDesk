import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { FaFacebookF, FaGithub,  FaTwitter, FaLinkedinIn} from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
      className='relative mt-0 px-6 md:px-16  mlg:px-24 xl:px-32 pt-12 z-10 overflow-hidden bg-[#0b0b0b] text-white'
    >
      {/* Glowing Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[160px] top-[-200px] left-[-150px] z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[120px] bottom-[-100px] right-[-100px] z-0"></div>

      <div className='flex flex-wrap justify-between gap-12 md:gap-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 relative z-10'>

        {/* Logo and Intro */}
        <div className='max-w-80'>
          <img
            src={assets.logoimg}
            className="w-36 sm:w-44 mb-3 mx-auto"
            alt="logo"
          />
          <p className='text-sm leading-relaxed text-center text-white mb-0'>
            Experience the power of AI with <strong>StarkDesk</strong>.<br />
            Transform your content creation with tools and plans tailored to your needs.
          </p>
          {/* Social Icons */}
        <div className='flex items-center justify-center gap-4 mt-5'>
  {[
    { Icon: FaGithub, link: 'https://github.com/adarsh005599/' },
    { Icon: FaFacebookF, link: 'https://facebook.com/yourprofile' },
    { Icon: FaLinkedinIn, link: 'https://linkedin.com/in/adarsh-singh0099' },
    { Icon: FaTwitter, link: 'https://twitter.com/yourprofile' },
    
  ].map(({ Icon, link }, i) => (
    <a
      key={i}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-pink-400 transition"
    >
      <Icon className="w-5 h-5 cursor-pointer" />
    </a>
  ))}
</div>

        </div>

        {/* Link Sections */}
        {[
          {
            heading: "COMPANY",
            links: ["About", "Careers", "Press", "Blog", "Partners"],
          },
          {
            heading: "SUPPORT",
            links: ["Help Center", "Safety Information", "Cancellation Options", "Contact Us", "Accessibility"],
          }
        ].map((section, idx) => (
          <div key={idx}>
            <p className='text-base font-semibold text-white mb-3'>{section.heading}</p>
            <ul className='flex flex-col gap-2 text-sm'>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-pink-400 transition text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className='max-w-80'>
          <p className='text-base font-semibold text-white mb-3'>STAY UPDATED</p>
          <p className='text-sm mb-4 text-white'>
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className='flex items-center'>
            <input
              type="email"
              className='bg-white/10 rounded-full border border-gray-400 h-9 px-3 text-sm text-white placeholder:text-gray-300 focus:ring-2 focus:ring-pink-500 outline-none w-full'
              placeholder='Your email'
            />
            <button className='bg-pink-600 hover:bg-pink-700 transition text-white h-9 w-9 flex items-center justify-center rounded-full ml-2 flex-shrink-0'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='flex flex-col md:flex-row items-center justify-between py-6 text-sm text-gray-400 mt-6 gap-2 relative z-10'>
        <p className="text-center text-xs md:text-sm text-gray-400">
          © 2025 StarkDesk. Made by Adarsh 💌 All rights reserved.
        </p>
        <ul className='flex gap-4'>
          <li><a href="#" className="hover:text-white transition">Privacy</a></li>
          <li><a href="#" className="hover:text-white transition">Terms</a></li>
          <li><a href="#" className="hover:text-white transition">Sitemap</a></li>
        </ul>
      </div>
    </motion.footer>
  );
};

export default Footer;
