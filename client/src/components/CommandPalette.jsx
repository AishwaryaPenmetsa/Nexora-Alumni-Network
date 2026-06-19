import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Compass, BookOpen, Briefcase, MessageSquare, Calendar, Settings, Shield, LogOut, X, Newspaper, MessageCircle, Trophy, Brain } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const items = [
    { name: 'News Feed Stream', path: '/feed', icon: Newspaper, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Discussion Forum Q&A', path: '/forum', icon: MessageCircle, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Gamification Leaderboard', path: '/leaderboard', icon: Trophy, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'NEXORA AI Career Hub', path: '/ai-career', icon: Brain, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Explore Alumni Directory', path: '/directory', icon: Compass, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Mentorship Portal', path: '/mentorship', icon: BookOpen, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Job & Referral Center', path: '/jobs', icon: Briefcase, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Chat Box / Messaging', path: '/messages', icon: MessageSquare, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Campus Meetups & Events', path: '/events', icon: Calendar, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Account Settings', path: '/settings', icon: Settings, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] },
    { name: 'Admin Dashboard Panels', path: '/admin', icon: Shield, role: ['admin'] },
    { name: 'Sign Out Account', action: 'logout', icon: LogOut, role: ['student', 'alumni', 'recruiter', 'staff', 'admin'] }
  ].filter(item => !item.role || (user && item.role.includes(user.role)));

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          handleSelect(filteredItems[activeIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-darkBg/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or navigate pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder-gray-500 text-sm"
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No commands found matching "{query}"</p>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition ${
                    index === activeIndex
                      ? 'bg-gradient-to-r from-primary/25 to-secondary/25 text-white border border-primary/20'
                      : 'text-gray-400 hover:bg-gray-800/40 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-[10px] font-mono bg-gray-800/60 text-gray-500 px-2 py-0.5 rounded border border-gray-700/40">
                    Enter
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/40 text-[10px] text-gray-500 border-t border-gray-800/60 font-mono">
          <span>Use ↑↓ to navigate, ↵ to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
