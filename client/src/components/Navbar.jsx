import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => { 
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/10 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-10 flex items-center justify-between h-[72px]">
        <img
          onClick={() => navigate('/')}
          src={assets.logoimg}
          alt="Logo"
          className="w-28 sm:w-36 cursor-pointer select-none"
        />

        {user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button 
            onClick={openSignIn}
            className="flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 px-6 py-2.5 transition duration-200 text-white shadow-md"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
