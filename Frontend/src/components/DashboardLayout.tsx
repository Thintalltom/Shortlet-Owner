import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  BuildingIcon,
  FileTextIcon,
  UserIcon,
  ShieldCheckIcon,
  MenuIcon,
  XIcon,
  HomeIcon,
  LogOutIcon,
  ChevronRightIcon,
  HeartIcon,
  CalendarIcon,
  UsersIcon,
  CreditCardIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const ownerLinks = [
  {
    label: 'Dashboard',
    path: '/owner/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    label: 'My Properties',
    path: '/owner/properties',
    icon: BuildingIcon
  },
  {
    label: 'Applications',
    path: '/owner/applications',
    icon: FileTextIcon
  },
  {
    label: 'Commissions',
    path: '/owner/commissions',
    icon: CreditCardIcon
  },
  {
    label: 'Profile',
    path: '/owner/profile',
    icon: UserIcon
  }];

  const agentLinks = [
  {
    label: 'Dashboard',
    path: '/agent/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    label: 'My Applications',
    path: '/agent/applications',
    icon: FileTextIcon
  },
  {
    label: 'My Properties',
    path: '/agent/properties',
    icon: BuildingIcon
  },
  {
    label: 'Commissions',
    path: '/agent/commissions',
    icon: CreditCardIcon
  },
  {
    label: 'Verification',
    path: '/agent/verification',
    icon: ShieldCheckIcon
  },
  {
    label: 'Profile',
    path: '/agent/profile',
    icon: UserIcon
  }];

  const userLinks = [
  {
    label: 'Dashboard',
    path: '/user/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    label: 'My Bookings',
    path: '/user/bookings',
    icon: CalendarIcon
  },
  {
    label: 'Saved Properties',
    path: '/user/saved',
    icon: HeartIcon
  },
  {
    label: 'Profile',
    path: '/user/profile',
    icon: UserIcon
  }];

  const adminLinks = [
  {
    label: 'Dashboard',
    path: '/admin-x7k9',
    icon: LayoutDashboardIcon
  },
  {
    label: 'Users',
    path: '/admin-x7k9/users',
    icon: UsersIcon
  },
  {
    label: 'Properties',
    path: '/admin-x7k9/properties',
    icon: BuildingIcon
  },
  {
    label: 'Commissions',
    path: '/admin-x7k9/commissions',
    icon: CreditCardIcon
  }];

  const getLinks = () => {
    if (currentUser?.role === 'admin') return adminLinks;
    if (currentUser?.role === 'user') return userLinks;
    if (currentUser?.role === 'owner') return ownerLinks;
    return agentLinks;
  };
  const links = getLinks();
  const currentPath = location.pathname;
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  const getRoleBadgeColor = () => {
    if (currentUser?.role === 'owner') return 'bg-[#E8F5EE] text-[#1B6B3A]';
    if (currentUser?.role === 'agent') return 'bg-amber-50 text-amber-700';
    if (currentUser?.role === 'admin') return 'bg-purple-50 text-purple-700';
    return 'bg-blue-50 text-blue-700';
  };
  const SidebarContent = () =>
  <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#E5E7EB]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
            <HomeIcon size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#111827]">
            Shortlet<span className="text-[#1B6B3A]">Connect</span>
          </span>
        </Link>
      </div>

      {currentUser &&
    <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <img
          src={
          currentUser.profileImage || 'https://i.pravatar.cc/150?img=1'
          }
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#E5E7EB]" />

            <div className="min-w-0">
              <div className="font-semibold text-sm text-[#111827] truncate">
                {currentUser.name}
              </div>
              <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getRoleBadgeColor()}`}>

                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
    }

      <nav className="flex-1 p-3 space-y-1" aria-label="Dashboard navigation">
        {links.map((link) => {
        const Icon = link.icon;
        const isActive = currentPath === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'bg-[#1B6B3A] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'}`}>

              <Icon size={17} />
              {link.label}
              {isActive && <ChevronRightIcon size={14} className="ml-auto" />}
            </Link>);

      })}
      </nav>

      <div className="p-3 border-t border-[#E5E7EB] space-y-1">
        <Link
        to="/"
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827] transition-colors">

          <HomeIcon size={17} /> Back to Site
        </Link>
        <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors">

          <LogOutIcon size={17} /> Logout
        </button>
      </div>
    </div>;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5E7EB] flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen &&
      <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setSidebarOpen(false)} />

          <aside className="relative w-72 bg-white flex flex-col shadow-xl">
            <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100">

              <XIcon size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      }

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#6B7280] hover:bg-gray-100"
            aria-label="Open sidebar">

            <MenuIcon size={20} />
          </button>
          <span className="font-semibold text-[#111827]">
            {links.find((l) => l.path === currentPath)?.label || 'Dashboard'}
          </span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>);

}