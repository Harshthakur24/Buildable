import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { User, LogOut, Settings, Plus } from 'lucide-react'

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const isDesktop = useMediaQuery({ minWidth: 767})
  const tablet = useMediaQuery({ maxWidth: 767})

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
        <div className='p-[8px] l:p-[2px] bg-[#f84f39] '></div>
        <nav className='outer_padding flex px-[40px] m:pt-[24px] pb-[25px] w-full min-h-[70px] items-center justify-between bg-[#f4f3fa]'>
            <div className='leftFlex flex items-center justify-center gap-[25px] font-semibold'>
              <Link to="/">
                <div className='flex items-center gap-[20px]'>
                    <div className='w-[25px] h-[25px] bg-[#f84f39] rounded-lg flex items-center justify-center text-white font-bold text-sm'>B</div>
                    <div className='text-xl font-bold text-[#26253b]'>Buildable</div>
                </div>
              </Link>
                <div className='hidden m:block'>
                  <div className='flex gap-[25px] '>
                    <Link to="/explore" className='hidden l:block cursor-pointer hover:text-[#f84f39] transition-colors'>Explore</Link>
                    <Link to="/projects" className='cursor-pointer hover:text-[#f84f39] transition-colors'>Projects</Link>
                    <Link to="/leaderboard" className='cursor-pointer hover:text-[#f84f39] transition-colors'>Leaderboard</Link>
                    
                  </div>
                </div>
            </div>

            { isDesktop && <div className='RightFlex flex gap-[25px] font-semibold invisible m:visible items-center'>
              <h2 className='cursor-pointer hover:text-[#f84f39] transition-colors'>Community</h2>
              <h2 className='hidden l:block cursor-pointer hover:text-[#f84f39] transition-colors'>API</h2>
              
              {isAuthenticated ? (
                <div className='relative'>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className='flex items-center gap-2 hover:text-[#f84f39] transition-colors'
                  >
                    <div className='w-8 h-8 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className='hidden l:block'>{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'>
                      <div className='px-4 py-3 border-b border-gray-100'>
                        <p className='font-semibold text-gray-900 truncate'>{user?.name}</p>
                        <p className='text-sm text-gray-500 truncate' title={user?.email}>{user?.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowUserMenu(false)}
                        className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700'
                      >
                        <User className='w-4 h-4' />
                        Profile
                      </Link>
                      <Link 
                        to="/submit-project" 
                        onClick={() => setShowUserMenu(false)}
                        className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700'
                      >
                        <Plus className='w-4 h-4' />
                        Submit Project
                      </Link>
                      <Link 
                        to="/settings" 
                        onClick={() => setShowUserMenu(false)}
                        className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700'
                      >
                        <Settings className='w-4 h-4' />
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600'
                      >
                        <LogOut className='w-4 h-4' />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className='text-[#f84f39] border-2 border-[#f84f39] px-4 py-2 rounded-full hover:text-[#d63027] transition-colors'
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup"
                    className='bg-[#f84f39] text-white px-4 py-2 rounded-full hover:bg-[#d63027] transition-colors'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>} 
            
            { tablet &&
              <div className='flex items-center justify-between gap-[20px]'>
                {isAuthenticated ? (
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className='flex items-center gap-2'
                  >
                    <div className='w-6 h-6 bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center'>
                      <span className='text-white text-xs font-bold'>
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link 
                    to="/signup"
                    className='text-[#f84f39] font-semibold cursor-pointer'
                  >
                    Join Now
                  </Link>
                )}
                <div className='w-[17px] h-[17px] border-2 border-[#f84f39] rounded transform rotate-45'></div>
              </div>
            }
        </nav>
        
        {/* Mobile user menu */}
        {tablet && showUserMenu && isAuthenticated && (
          <div className='bg-white border-t border-gray-100 px-4 py-2'>
            <div className='flex flex-col gap-2'>
              <span className='font-semibold text-gray-900'>{user?.name}</span>
              <button 
                onClick={handleLogout}
                className='text-left text-red-600 text-sm'
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
    </>
  )
}

export default Navbar