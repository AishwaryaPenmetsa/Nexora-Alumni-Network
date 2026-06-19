import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import { FeedsProvider } from './context/FeedsContext';
import { ForumProvider } from './context/ForumContext';
import { AnimatePresence, motion } from 'framer-motion';

// Components & Pages imports
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import Profile from './pages/Profile';
import MentorshipPortal from './pages/MentorshipPortal';
import JobReferralPortal from './pages/JobReferralPortal';
import MessagingSystem from './pages/MessagingSystem';
import EventsPortal from './pages/EventsPortal';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import NewsFeed from './pages/NewsFeed';
import Forum from './pages/Forum';
import Leaderboard from './pages/Leaderboard';
import AiCareerHub from './pages/AiCareerHub';
import ScrollToTop from './components/ScrollToTop';

import { Sparkles, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';


// ===== GLOBAL AURORA BACKGROUND =====
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Deep space base */}
    <div className="absolute inset-0 bg-[#050816]" />
    
    {/* Aurora blob 1 - Primary/Indigo */}
    <div 
      className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.12]"
      style={{ 
        background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'aurora-move 20s ease-in-out infinite'
      }}
    />
    
    {/* Aurora blob 2 - Secondary/Purple */}
    <div 
      className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.10]"
      style={{ 
        background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'aurora-move 28s ease-in-out infinite reverse'
      }}
    />

    {/* Aurora blob 3 - Accent/Cyan */}
    <div 
      className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full opacity-[0.08]"
      style={{ 
        background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
        filter: 'blur(90px)',
        animation: 'aurora-move 35s ease-in-out infinite 5s'
      }}
    />

    {/* Aurora blob 4 - Violet */}
    <div 
      className="absolute top-[50%] left-[50%] w-[800px] h-[400px] rounded-full opacity-[0.06]"
      style={{ 
        background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
        filter: 'blur(120px)',
        transform: 'translate(-50%, -50%)',
        animation: 'aurora-move 40s ease-in-out infinite 10s reverse'
      }}
    />

    {/* Subtle grid overlay */}
    <div className="absolute inset-0 grid-bg opacity-20" />

    {/* Floating particles */}
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          opacity: Math.random() * 0.3 + 0.1,
          animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite ${Math.random() * 5}s`
        }}
      />
    ))}
  </div>
);

// ===== TOAST NOTIFICATION SYSTEM =====
const ToastContainer = () => {
  const { toasts } = useNotifications();

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-indigo-500/30'
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border glass-card shadow-2xl min-w-[280px] ${borderColors[toast.type] || 'border-white/10'}`}
          >
            {icons[toast.type] || icons.info}
            <span className="text-xs text-gray-200 font-medium leading-snug">{toast.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ===== PAGE TRANSITION WRAPPER =====
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ===== ANIMATED ROUTES =====
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginSignup /></PageTransition>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute><PageTransition><AlumniDirectory /></PageTransition></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><PageTransition><MentorshipPortal /></PageTransition></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><PageTransition><JobReferralPortal /></PageTransition></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PageTransition><MessagingSystem /></PageTransition></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><PageTransition><EventsPortal /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><PageTransition><NewsFeed /></PageTransition></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><PageTransition><Forum /></PageTransition></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />
        <Route path="/ai-career" element={<ProtectedRoute><PageTransition><AiCareerHub /></PageTransition></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Global Aurora Background */}
      <AuroraBackground />
      
      {/* Global Navbar */}
      <Navbar />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Animated Page Routes */}
      <div className="relative z-10">
        <ScrollToTop />
        <AnimatedRoutes />

      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <FeedsProvider>
            <ForumProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </ForumProvider>
          </FeedsProvider>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
