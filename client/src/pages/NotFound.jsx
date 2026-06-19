import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="border-indigo-500/20 text-center py-12 px-6" hoverGlow>
          <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-primary/20 text-indigo-400 mb-6 animate-pulse">
            <Compass className="w-10 h-10" />
          </div>

          <h1 className="text-6xl font-black text-white m-0 tracking-widest">404</h1>
          <h2 className="text-xl font-bold text-gray-200 mt-4 mb-2">Page Lost in Space</h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed mb-8 max-w-xs mx-auto">
            The dashboard link or profile pathway you are searching for does not exist on our servers.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:brightness-110 shadow-glass-glow transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFound;
