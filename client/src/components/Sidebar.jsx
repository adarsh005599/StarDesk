import React from 'react';
import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import {
  Hash, House, SquarePen, Image, Eraser, Scissors, FileText, User, LogOut, Menu
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-artical', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/genreat-image', label: 'Generate Image', Icon: Image },
  { to: '/ai/remove-bag', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-obj', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/cummunity', label: 'Community', Icon: User },
]; 

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <>
       <div
        className={`w-60 bg-white/10 text-black rounded-3xl border border-white/20 backdrop-blur-xl shadow-lg flex flex-col justify-between items-center max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-40
        ${sidebar ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'} 
        max-sm:right-0 sm:relative transition-all duration-300 ease-in-out`}
      >
        
        <div className='my-7 w-full'>
          {user && (
            <div className="flex flex-col items-center mb-4">
              <img src={user.imageUrl} className='w-14 h-14 rounded-full border-2 border-pink-950 shadow-md' alt="User profile" />
              <h1 className='mt-2 text-sm text-pink-900/90 font-semibold'>{user.fullName}</h1>
            </div>
          )}

          <div className='px-6 mt-3 text-sm font-medium space-y-2'>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-md'
                    : 'hover:bg-white/10 hover:text-white/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-6 h-6.5 p-1.5 rounded-lg transition-all
                        ${isActive
                          ? 'bg-white text-pink-950 shadow-sm'
                          : 'bg-white/5 text-black/90 border border-pink-950 hover:shadow-md'
                        }`}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className='w-full p-4 px-6 flex items-center justify-between border-t border-white/10 bg-white/5 rounded-b-3xl'>
          <div className='flex items-center gap-2 cursor-pointer' onClick={openUserProfile}>
            <img src={user?.imageUrl} className='w-8 h-8 rounded-full border border-white/20' alt='user' />
            <div className='flex flex-col'>
              <span className='text-xs text-pink-900/90 font-semibold'>{user?.fullName}</span>
              <span className='text-[10px] text-yellow-200 font-medium'>
                <Protect plan='Free' fallback='Premium'>Premium</Protect> Plan
              </span>
            </div>
          </div>
          <LogOut
            onClick={signOut}
            className='w-5 h-5 text-white hover:text-red-400 transition cursor-pointer'
          />
        </div>
      </div>
    </>
  );
};
 
export default Sidebar;
