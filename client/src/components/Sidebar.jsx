import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Briefcase, MessageSquare,
  Calendar, Settings, ShieldCheck, UserCheck, Newspaper,
  MessageCircle, Trophy, Brain, ChevronLeft, ChevronRight, Flame,
  Users, Zap, Star
} from 'lucide-react';

const Sidebar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  // Profile completion calculation
  const calculateCompletion = () => {
    if (!profile) return 30;
    let score = 30;
    if (profile.bio) score += 15;
    if (profile.company || profile.department) score += 15;
    if (profile.skills?.length > 0) score += 15;
    if (profile.experience?.length > 0) score += 15;
    if (profile.socialLinks?.linkedin || profile.socialLinks?.github) score += 10;
    return Math.min(score, 100);
  };

  const completion = calculateCompletion();
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  // XP to next level
  const xp = user.xp || 0;
  const level = user.level || 1;
  const xpToNext = level * 100;
  const xpPercent = Math.min((xp % 100) / 100 * 100, 100);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-indigo-400' },
    { name: 'News Feed', path: '/feed', icon: Newspaper, color: 'text-blue-400' },
    { name: 'Forum', path: '/forum', icon: MessageCircle, color: 'text-violet-400' },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, color: 'text-amber-400' },
    { name: 'AI Career Hub', path: '/ai-career', icon: Brain, color: 'text-pink-400' },
    { name: 'Alumni Directory', path: '/directory', icon: Users, color: 'text-cyan-400' },
    { name: 'Mentorship', path: '/mentorship', icon: GraduationCap, color: 'text-emerald-400' },
    { name: 'Jobs & Referrals', path: '/jobs', icon: Briefcase, color: 'text-orange-400' },
    { name: 'Messages', path: '/messages', icon: MessageSquare, color: 'text-blue-400' },
    { name: 'Events', path: '/events', icon: Calendar, color: 'text-red-400' },
    { name: 'Settings', path: '/settings', icon: Settings, color: 'text-gray-400' },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '4.5rem' : '15rem' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-[calc(100vh-4rem)] sticky top-16 hidden md:flex z-30 overflow-hidden flex-shrink-0"
      style={{
        background: 'rgba(5, 8, 22, 0.6)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)'
        }}
      />

      <div className="relative flex flex-col h-full p-3 gap-2">
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end p-1.5 rounded-lg border border-white/[0.06] hover:border-indigo-500/30 bg-white/[0.03] hover:bg-indigo-500/[0.08] text-gray-500 hover:text-indigo-400 transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Profile Card */}
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-3.5 mb-1 relative overflow-hidden cursor-pointer hover:border-indigo-500/20 transition-all duration-300 border border-white/[0.05]"
              style={{ background: 'rgba(10,16,37,0.6)' }}
              onClick={() => navigate('/settings')}
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)' }} />

              {/* User info row */}
              <div className="flex items-center gap-2.5">
                {/* Avatar with completion ring */}
                <div className="relative flex-shrink-0">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r={radius} strokeWidth="2.5" stroke="rgba(255,255,255,0.05)" fill="none" />
                    <circle
                      cx="24" cy="24" r={radius} strokeWidth="2.5"
                      stroke="url(#completionGrad)" fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                    <defs>
                      <linearGradient id="completionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-1 rounded-full overflow-hidden border border-white/10">
                    <img
                      src={user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {user.isApproved && (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border border-[#050816]">
                      <UserCheck className="w-2 h-2 text-white" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="text-xs font-semibold text-white truncate leading-tight">{user.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono text-indigo-400 capitalize bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                    {user.isMentor && (
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        Mentor
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* XP bar */}
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Level {level}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500">{xp} XP</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] text-gray-600 font-mono">{completion}% profile</span>
                  <Star className="w-2.5 h-2.5 text-amber-500/50" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center mb-1 gap-1"
              onClick={() => navigate('/settings')}
            >
              <div className="relative w-10 h-10 cursor-pointer">
                <svg className="w-10 h-10 -rotate-90 absolute inset-0" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r={radius} strokeWidth="2.5" stroke="rgba(255,255,255,0.05)" fill="none" />
                  <circle cx="24" cy="24" r={radius} strokeWidth="2.5" stroke="url(#cg2)" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-1 rounded-full overflow-hidden border border-white/10">
                  <img
                    src={user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[8px] font-bold font-mono text-amber-400 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-amber-500" />{level}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                          border: '1px solid rgba(99,102,241,0.2)'
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      />
                    )}

                    {/* Hover background */}
                    <div className="absolute inset-0 rounded-xl bg-white/[0] group-hover:bg-white/[0.04] transition-all duration-200" />

                    {/* Icon */}
                    <Icon className={`relative z-10 flex-shrink-0 w-4 h-4 ${isActive ? item.color : 'text-gray-600 group-hover:text-gray-400'} transition-colors`} />

                    {/* Label */}
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}

                    {/* Active dot */}
                    {isActive && isCollapsed && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Admin */}
          {user.role === 'admin' && (
            <div className="mt-2 pt-2 border-t border-white/[0.05]">
              <NavLink
                to="/admin"
                title={isCollapsed ? 'Admin' : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isCollapsed ? 'justify-center' : ''
                  } ${isActive ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'text-red-500/60 hover:text-red-400 hover:bg-red-500/5'}`
                }
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Admin Panel</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Bottom version tag */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-white/[0.05] text-center">
            <span className="text-[9px] font-mono text-gray-700">NEXORA v2.0</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
