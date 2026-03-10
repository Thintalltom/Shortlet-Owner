import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  HeartIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const savedProperties = useAppSelector((s) => s.savedProperties.list);
  const savedCount = savedProperties.filter(
    (s) => s.userId === currentUser?.id
  ).length;
  const navLinks = [
  {
    label: 'Home',
    path: '/'
  },
  {
    label: 'Browse Listings',
    path: '/listings'
  },
  {
    label: 'How It Works',
    path: '/#how-it-works'
  }];

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin-x7k9';
    if (currentUser.role === 'user') return '/user/dashboard';
    return currentUser.role === 'owner' ?
    '/owner/dashboard' :
    '/agent/dashboard';
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };
  const getRoleBadgeColor = () => {
    if (currentUser?.role === 'owner') return 'bg-[#E8F5EE] text-[#1B6B3A]';
    if (currentUser?.role === 'agent') return 'bg-amber-50 text-amber-700';
    if (currentUser?.role === 'admin') return 'bg-purple-50 text-purple-700';
    return 'bg-blue-50 text-blue-700';
  };
  const isActive = (path: string) => location.pathname === path;
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="ShortletConnect Home">

            <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
              <HomeIcon size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[#111827]">
              Shortlet<span className="text-[#1B6B3A]">Connect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[#1B6B3A] ${isActive(link.path) ? 'text-[#1B6B3A]' : 'text-[#6B7280]'}`}>

                {link.label}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ?
            <>
                {savedCount > 0 && currentUser.role === 'user' &&
              <Link
                to="/user/saved"
                className="relative p-2 rounded-lg text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
                title="Saved properties">

                    <HeartIcon
                  size={18}
                  className="fill-[#EF4444] text-[#EF4444]" />

                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {savedCount}
                    </span>
                  </Link>
              }
                <div className="flex items-center gap-2">
                  <img
                  src={
                  currentUser.profileImage ||
                  'https://i.pravatar.cc/150?img=1'
                  }
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#E5E7EB]" />

                  <div className="text-sm">
                    <div className="font-semibold text-[#111827] leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}>

                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <Link
                to={getDashboardPath()}
                className="flex items-center gap-1.5 text-sm font-medium text-[#1B6B3A] hover:bg-[#E8F5EE] px-3 py-2 rounded-lg transition-colors">

                  <LayoutDashboardIcon size={15} />
                  Dashboard
                </Link>
                <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#EF4444] hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">

                  <LogOutIcon size={15} />
                  Logout
                </button>
              </> :

            <>
                <Link
                to="/login"
                className="text-sm font-medium text-[#6B7280] hover:text-[#1B6B3A] px-4 py-2 rounded-lg transition-colors">

                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            }
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>

            {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen &&
      <div className="md:hidden border-t border-[#E5E7EB] bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-[#E8F5EE] text-[#1B6B3A]' : 'text-[#6B7280] hover:bg-gray-50'}`}>

                {link.label}
              </Link>
          )}
            <div className="pt-3 border-t border-[#E5E7EB] mt-3 space-y-2">
              {currentUser ?
            <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                  src={
                  currentUser.profileImage ||
                  'https://i.pravatar.cc/150?img=1'
                  }
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E7EB]" />

                    <div>
                      <div className="font-semibold text-[#111827]">
                        {currentUser.name}
                      </div>
                      <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}>

                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <Link
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#1B6B3A] hover:bg-[#E8F5EE] rounded-lg transition-colors">

                    <LayoutDashboardIcon size={16} /> Dashboard
                  </Link>
                  <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors">

                    <LogOutIcon size={16} /> Logout
                  </button>
                </> :

            <>
                  <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#6B7280] hover:bg-gray-50 rounded-lg transition-colors">

                    Login
                  </Link>
                  <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block btn-primary justify-center py-3 text-center">

                    Register
                  </Link>
                </>
            }
            </div>
          </div>
        </div>
      }
    </nav>);

}