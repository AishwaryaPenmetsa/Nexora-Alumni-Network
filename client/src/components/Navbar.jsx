import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, Search, LogOut, User, Check, Settings as SettingsIcon, 
  Zap, Command, ChevronRight, X
} from 'lucide-react';
import CommandPalette from './CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfile(false);
  };

  const typeColors = {
    message: 'bg-blue-500',
    mentorship_request: 'bg-indigo-500',
    mentorship_status: 'bg-emerald-500',
    connection: 'bg-purple-500',
    default: 'bg-gray-500'
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#050816]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl' 
          : 'bg-transparent backdrop-blur-md border-b border-white/[0.04]'
      }`}>

        {/* ===== LEFT: LOGO ===== */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          {/* Logo mark */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}
          >
            <span className="text-white font-black text-sm font-space z-10">N</span>
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-80" />
          </motion.div>
          <span className="font-extrabold text-lg tracking-wide text-white font-space hidden sm:block">
            NEX<span className="text-gradient">ORA</span>
          </span>
        </Link>

        {/* ===== MIDDLE: SEARCH (logged-in only) ===== */}
        {user && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setCmdOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] text-gray-500 hover:text-gray-300 text-sm transition-all duration-300 group min-w-[200px] max-w-xs"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-indigo-400 transition flex-shrink-0" />
            <span className="text-xs flex-1 text-left">Search NEXORA...</span>
            <kbd className="hidden lg:flex items-center gap-1 text-[9px] font-mono text-gray-600 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </motion.button>
        )}

        {/* ===== RIGHT: ACTIONS ===== */}
        <div className="flex items-center gap-2">
          {!user ? (
            // Public actions
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-white transition text-sm font-medium hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 0 20px rgba(99,102,241,0.35)'
                }}
              >
                Join Free
              </Link>
            </div>
          ) : (
            // Authenticated actions
            <>
              {/* Mobile search */}
              <button
                onClick={() => setCmdOpen(true)}
                className="md:hidden p-2 rounded-xl border border-white/5 hover:border-white/15 bg-white/5 text-gray-400 hover:text-white transition"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                  className={`relative p-2 rounded-xl border transition-all duration-300 ${
                    unreadCount > 0
                      ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                      : 'border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-[#050816]"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotif && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2.5 w-80 glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Activity</span>
                          {unreadCount > 0 && (
                            <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-mono">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-indigo-400 hover:text-white transition flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification list */}
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-light">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                markAsRead(notif._id);
                                if (notif.link) navigate(notif.link);
                                setShowNotif(false);
                              }}
                              className={`flex items-start gap-3 p-3.5 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-all ${
                                !notif.isRead ? 'bg-indigo-500/[0.04]' : ''
                              }`}
                            >
                              <div className="relative flex-shrink-0">
                                {notif.sender?.profilePicture ? (
                                  <img src={notif.sender.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-indigo-950 flex items-center justify-center border border-indigo-500/20">
                                    <User className="w-3.5 h-3.5 text-indigo-400" />
                                  </div>
                                )}
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#050816] ${typeColors[notif.type] || typeColors.default}`} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-[11px] text-gray-300 leading-snug">{notif.text}</p>
                                <span className="text-[9px] text-gray-600 font-mono mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1" />}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-white/[0.05]">
                        <button
                          onClick={() => { navigate('/dashboard'); setShowNotif(false); }}
                          className="w-full text-[10px] text-center text-gray-500 hover:text-indigo-400 transition py-1.5 font-mono"
                        >
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile avatar + dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                  className="flex items-center gap-2 pl-2 rounded-xl hover:bg-white/5 transition p-1"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/40 hover:border-indigo-400 transition flex-shrink-0"
                    style={{ boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-950 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-white truncate max-w-[100px]">{user.name?.split(' ')[0]}</div>
                    <div className="text-[9px] text-gray-500 capitalize font-mono">{user.role}</div>
                  </div>
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2.5 w-56 glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                    >
                      {/* Profile info */}
                      <div className="p-3.5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-indigo-500/30">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-indigo-950 flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                            <div className="text-[9px] text-gray-500 truncate">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        <button
                          onClick={() => { navigate('/settings'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.06] transition text-left"
                        >
                          <SettingsIcon className="w-3.5 h-3.5 text-gray-500" />
                          Settings
                        </button>
                        <button
                          onClick={() => { navigate('/dashboard'); setShowProfile(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.06] transition text-left"
                        >
                          <Zap className="w-3.5 h-3.5 text-gray-500" />
                          Dashboard
                        </button>
                      </div>

                      <div className="p-1.5 border-t border-white/[0.06]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Navbar;
