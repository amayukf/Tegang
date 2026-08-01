import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Home, Search, ClipboardList, User, LayoutDashboard,
  CalendarPlus, LogOut, Briefcase
} from 'lucide-react';

const nav = {
  customer: [
    { to: '/home',     icon: Home,         label: 'Home' },
    { to: '/requests', icon: ClipboardList,label: 'My Requests' },
    { to: '/profile',  icon: User,         label: 'Profile' },
  ],
  provider: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/incoming',  icon: ClipboardList,   label: 'Incoming Requests' },
    { to: '/profile',   icon: User,            label: 'Profile' },
  ],
};

const BrandMark = ({ compact = false }) => {
  const role = localStorage.getItem('role') || localStorage.getItem('userRole');
  const target = role === 'admin' ? '/admin' : role === 'provider' ? '/dashboard' : role === 'customer' ? '/home' : '/';
  return (
    <Link to={target} className="flex items-center gap-2.5 shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-semibold text-lg">
        ጠ
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-neutral-900">Tegagn</p>
          <p className="text-[11px] text-neutral-500">ጠጋኝ · Home Services</p>
        </div>
      )}
    </Link>
  );
};

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const userName = (localStorage.getItem('userName') || '').trim() || 'User';
  const links = nav[role] || nav.customer;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const initial = userName.charAt(0).toUpperCase();

  const profileImage = localStorage.getItem('profileImage');

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-neutral-200 flex flex-col z-40">
      <div className="px-5 py-4 border-b border-neutral-100">
        <BrandMark />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to + link.label}
              to={link.to}
              end={link.to === '/' || link.to === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {role === 'customer' && (
        <div className="px-3 py-3 border-t border-neutral-100">
          <NavLink
            to="/post-job"
            className="btn-accent w-full"
          >
            <Briefcase className="h-4 w-4" strokeWidth={2} />
            Post a Job
          </NavLink>
        </div>
      )}

      <div className="border-t border-neutral-100 p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-neutral-50 transition-colors">
          <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 text-sm font-semibold shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={userName} className="h-full w-full object-cover rounded-full" />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{userName}</p>
            <p className="text-xs text-neutral-500 capitalize">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
export { BrandMark };
