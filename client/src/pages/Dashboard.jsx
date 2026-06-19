import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import InsightsPanel from '../components/InsightsPanel';
import Sidebar from '../components/Sidebar';
import FloatingParticles from '../components/FloatingParticles';
import {
  Users,
  Calendar as CalendarIcon,
  Briefcase,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Clock,
  Video,
  Award,
  Cpu,
  FileText,
  Building,
  Trophy,
  Flame,
  Star,
  Activity,
  ArrowUp,
  MessageSquare,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, profile, apiUrl } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Simulated AI/Recruiter metrics for widgets
  const [resumeScore, setResumeScore] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch sessions
        const resSessions = await fetch(`${apiUrl}/mentorship/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resSessions.ok) {
          const sessionsData = await resSessions.json();
          setSessions(sessionsData.slice(0, 3));
        }

        // Fetch referrals
        const resReferrals = await fetch(`${apiUrl}/jobs/referrals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resReferrals.ok) {
          const referralsData = await resReferrals.json();
          setReferrals(referralsData.slice(0, 3));
        }

        // Fetch leaderboard standings
        const resLeader = await fetch(`${apiUrl}/directory/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resLeader.ok) {
          const leaderData = await resLeader.json();
          setLeaderboard(leaderData.slice(0, 5));
        }

        // Fetch user notifications
        const resNotifs = await fetch(`${apiUrl}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resNotifs.ok) {
          const notifsData = await resNotifs.json();
          setRecentNotifs(notifsData.slice(0, 4));
        }

        // Student-specific data fetch (mock resume parsed score check)
        if (user?.role === 'student') {
          const resReview = await fetch(`${apiUrl}/ai/resume-review`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ resumeUrl: 'mock-dashboard-cv' })
          });
          if (resReview.ok) {
            const reviewData = await resReview.json();
            setResumeScore(reviewData.score);
          }
        }

        // Recruiter-specific company data fetch
        if (user?.role === 'recruiter') {
          const resJobs = await fetch(`${apiUrl}/jobs`);
          if (resJobs.ok) {
            const jobsData = await resJobs.json();
            // filter positions posted by this recruiter
            const myJobs = jobsData.filter(j => j.postedBy?._id === user?._id);
            setCompanyData({
              companyName: profile?.company || 'Corporate Partner',
              activeJobsCount: myJobs.length,
              companyJobs: myJobs.slice(0, 3)
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [apiUrl, user, profile]);

  // Quick Action Buttons config
  const quickActions = [
    { title: 'Find Career Mentors', desc: 'Browse staff mentors', path: '/mentorship', icon: GraduationCap, color: 'text-indigo-400 bg-indigo-500/10' },
    { title: 'Browse Referrals', desc: 'Find open jobs', path: '/jobs', icon: Briefcase, color: 'text-cyan-400 bg-cyan-500/10' },
    { title: 'Alumni Directory', desc: 'Search active cohorts', path: '/directory', icon: Users, color: 'text-violet-400 bg-secondary/10' },
    { title: 'AI Career Hub', desc: 'Resume & Skill analysis', path: '/ai-career', icon: Cpu, color: 'text-cyan-400 bg-cyan-400/10' },
    { title: 'Discussion Forums', desc: 'Participate & earn XP', path: '/forum', icon: Trophy, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Account Settings', desc: 'Complete profile bio', path: '/settings', icon: Sparkles, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

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

  // Level & XP tracking
  const currentXp = user?.xp || 0;
  const currentLvl = user?.level || 1;
  const nextLvlXp = currentLvl * 100;
  const xpProgress = Math.min(((currentXp % 100) / 100) * 100, 100);

  // Dynamic Circle Radius for readiness score gauge
  const finalCareerScore = resumeScore || 78;
  const readyCircumference = 2 * Math.PI * 34;
  const strokeOffset = readyCircumference - (finalCareerScore / 100) * readyCircumference;

  // Profile completion circle values
  const completionPercent = calculateCompletion();
  const completionCircumference = 2 * Math.PI * 22;
  const completionOffset = completionCircumference - (completionPercent / 100) * completionCircumference;

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-16 flex relative overflow-x-hidden">
      {/* Floating Canvas Particles */}
      <FloatingParticles />

      {/* Animated Aurora Glow Blobs Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[30%] left-[40%] w-[45%] h-[45%] rounded-full bg-purple-500/[0.03] blur-[110px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 grid-bg opacity-15" />
      </div>

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative xl:pr-[340px] transition-all duration-300">
        
        {/* Welcome Header & Term */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 flex items-center gap-2 font-space uppercase tracking-tight">
              Welcome back, {user?.name}
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1.5 capitalize font-sans">
              System Role: {user?.role} Workspace Dashboard &bull; Accessing Live Portals.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start font-mono">
            <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl shadow-inner">
              Academic Term: Fall 2026
            </span>
          </div>
        </div>

        {/* Quick Stats & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
          <GlassCard className="flex items-center gap-4 border-white/5 hover:border-indigo-500/20 card-gradient-border" hoverGlow>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-primary/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">Connections Established</span>
              <span className="text-xl font-extrabold text-white">{profile?.connections?.length || 0} Members</span>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 border-white/5 hover:border-cyan-500/20 card-gradient-border" hoverGlow>
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-accent/20 text-cyan-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">Upcoming Bookings</span>
              <span className="text-xl font-extrabold text-white">
                {sessions.filter(s => s.status === 'approved' || s.status === 'pending').length} Sessions
              </span>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 border-white/5 hover:border-violet-500/20 card-gradient-border" hoverGlow>
            <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-violet-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">Active Referrals</span>
              <span className="text-xl font-extrabold text-white">{referrals.length} Positions</span>
            </div>
          </GlassCard>
        </div>

        {/* Gamified XP Progress Indicator Bar */}
        {user?.role && (
          <GlassCard className="mb-8 border-indigo-500/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-cyan-500/5 p-5 text-left card-gradient-border" hoverGlow={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6 fill-amber-500/20" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white m-0 flex items-center gap-1.5 font-space">
                    Gamification Rank Tier: Lvl {currentLvl}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">
                    Total XP Accumulation: {currentXp} XP &bull; {nextLvlXp - currentXp} XP to Lvl {currentLvl + 1}
                  </p>
                </div>
              </div>

              {/* Progress Tracker Slider */}
              <div className="flex-1 max-w-md w-full">
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 rounded-full shadow-inner"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Main 2-Column Dashboard Core Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left mb-8">
          
          {/* Column 1: Progress Indicators & Chart */}
          <div className="flex flex-col gap-8">
            
            {/* Double Progress Panel (Readiness Index & Profile Completion) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Career score circular gauge */}
              <GlassCard className="border-white/5 p-5 flex items-center justify-between h-48 card-gradient-border" hoverGlow>
                <div className="flex flex-col justify-between h-full text-left">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">
                      Readiness Index
                    </h3>
                    <h4 className="text-[10px] text-gray-400 font-light leading-relaxed mt-2 max-w-[150px]">
                      ATS compatibility match index based on parsed profile keywords.
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate('/ai-career')}
                    className="text-[10px] font-mono text-cyan-405 hover:text-white flex items-center gap-1 transition-all self-start border-0 bg-transparent cursor-pointer pl-0 font-bold"
                  >
                    Run Analyzer <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="34"
                      className="stroke-white/5 fill-transparent"
                      strokeWidth="5"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="34"
                      className="stroke-cyan-500 fill-transparent transition-all duration-500"
                      strokeWidth="5"
                      strokeDasharray={readyCircumference}
                      strokeDashoffset={strokeOffset}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-white font-space block">{finalCareerScore}</span>
                    <span className="text-[8px] text-gray-500 font-mono uppercase">ATS SCORE</span>
                  </div>
                </div>
              </GlassCard>

              {/* Profile Completion Circle Gauge Card */}
              <GlassCard className="border-white/5 p-5 flex items-center justify-between h-48 card-gradient-border" hoverGlow>
                <div className="flex flex-col justify-between h-full text-left">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">
                      Profile Setup
                    </h3>
                    <h4 className="text-[10px] text-gray-400 font-light leading-relaxed mt-2 max-w-[150px]">
                      Your credential profile is complete! Verified by the NEXORA directory.
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-[10px] font-mono text-indigo-405 hover:text-white flex items-center gap-1 transition-all self-start border-0 bg-transparent cursor-pointer pl-0 font-bold"
                  >
                    Edit Profile <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="22"
                      className="stroke-white/5 fill-transparent"
                      strokeWidth="4"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="22"
                      className="stroke-indigo-400 fill-transparent transition-all duration-500"
                      strokeWidth="4"
                      strokeDasharray={completionCircumference}
                      strokeDashoffset={completionOffset}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-black text-white font-space block">{completionPercent}%</span>
                    <span className="text-[7px] text-gray-500 font-mono uppercase">SETUP</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Network statistics SVG analytics representation */}
            <GlassCard className="border-white/5 p-5 flex flex-col justify-between h-48 card-gradient-border" hoverGlow>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">
                    Weekly Progress
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <ArrowUp className="w-2.5 h-2.5" /> +14.2%
                  </span>
                </div>
                {/* SVG Line Chart */}
                <div className="h-20 w-full mt-3">
                  <svg className="w-full h-full text-indigo-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M 0 25 Q 15 22 30 12 T 60 8 T 90 2 T 100 1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 0 25 Q 15 22 30 12 T 60 8 T 90 2 T 100 1 L 100 30 L 0 30 Z" fill="url(#chartGrad)" opacity="0.15" />
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between text-[8px] text-gray-500 font-mono mt-1">
                <span>MON</span>
                <span>WED</span>
                <span>FRI</span>
                <span>SUN</span>
              </div>
            </GlassCard>

            {/* Student Specific Pathways */}
            {user?.role === 'student' && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">
                  AI Recommended Pathways
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="border-white/5 p-5 flex flex-col justify-between h-40 card-gradient-border" hoverGlow>
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 mb-2">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[9px] font-bold font-mono tracking-widest uppercase">Pathway Match</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 font-space">Identify Skills Gaps</h4>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                        Verify technical stack differences against Google or Meta recruiter templates.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/ai-career')}
                      className="text-[10px] font-mono text-indigo-400 hover:text-white flex items-center gap-1 transition border-0 bg-transparent cursor-pointer pl-0 font-bold"
                    >
                      Audit Skills <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </GlassCard>

                  <GlassCard className="border-white/5 p-5 flex flex-col justify-between h-40 card-gradient-border" hoverGlow>
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-[9px] font-bold font-mono tracking-widest uppercase">ATS Audit</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 font-space">Audit Resume Profiles</h4>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                        Generate instant layout alerts to skip applicant screening filters.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/ai-career')}
                      className="text-[10px] font-mono text-cyan-400 hover:text-white flex items-center gap-1 transition border-0 bg-transparent cursor-pointer pl-0 font-bold"
                    >
                      Audit Layout <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Recruiter Dashboard */}
            {user?.role === 'recruiter' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">
                    Corporate Hiring Dashboard
                  </h3>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                  >
                    Post position <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <GlassCard className="border-white/5 p-5 text-xs text-left card-gradient-border" hoverGlow={false}>
                  <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                    <Building className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white font-space">{companyData?.companyName || 'Associated Company'}</h4>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{companyData?.activeJobsCount || 0} Open Careers</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-mono text-indigo-300 uppercase mb-1">Posted Positions</span>
                    {companyData?.companyJobs?.length === 0 ? (
                      <p className="text-[10px] text-gray-550">No open jobs posted yet. Build one to hire students!</p>
                    ) : (
                      companyData?.companyJobs?.map((job) => (
                        <div key={job._id} className="flex justify-between items-center p-2.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition">
                          <div>
                            <span className="text-xs font-bold text-white block">{job.title}</span>
                            <span className="text-[9px] text-gray-500 block font-light mt-0.5">{job.salary} &bull; {job.location}</span>
                          </div>
                          <button
                            onClick={() => navigate('/jobs')}
                            className="text-[9px] font-mono text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer font-bold"
                          >
                            Applications
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Quick Operations List */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Quick Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <GlassCard
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="flex flex-col gap-2 border-white/5 hover:border-white/10 card-gradient-border cursor-pointer"
                      hoverGlow
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${action.color}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-500 hover:text-white transition" />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2 mb-0.5 font-space">{action.title}</h4>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed">{action.desc}</p>
                    </GlassCard>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column 2: Scheduled Bookings, Referrals, Notifications & Leaderboard Preview */}
          <div className="flex flex-col gap-8">
            
            {/* Mentorship Schedule Card */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Mentorship Schedule</h3>
              <GlassCard className="flex flex-col gap-4 h-max card-gradient-border border-white/5" hoverGlow={false}>
                {loadingData ? (
                  <div className="shimmer h-24 rounded-xl" />
                ) : sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
                    <CalendarIcon className="w-8 h-8 text-gray-600" />
                    <p className="text-xs text-gray-505">No scheduled sessions found.</p>
                    <button
                      onClick={() => navigate('/mentorship')}
                      className="px-4.5 py-2 text-xs rounded-xl bg-primary hover:bg-indigo-600 text-white font-medium transition-all cursor-pointer border-0"
                    >
                      Book a Slot
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sessions.map((sess) => {
                      const isMentorUser = sess.mentor?._id === user?._id;
                      const partnerName = isMentorUser ? sess.student?.name : sess.mentor?.name;
                      return (
                        <div key={sess._id} className="p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                              sess.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : sess.status === 'completed'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {sess.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              {sess.date} @ {sess.time}
                            </span>
                          </div>

                          <div className="text-left font-sans">
                            <h4 className="text-xs font-bold text-white mb-0.5 font-space">{sess.topic}</h4>
                            <p className="text-[10px] text-gray-500 font-light m-0">
                              {isMentorUser ? 'Student' : 'Mentor'}: <span className="text-indigo-300 font-semibold">{partnerName || 'Aditya Cohort'}</span>
                            </p>
                          </div>

                          {sess.status === 'approved' && sess.meetingLink && (
                            <a
                              href={sess.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                            >
                              <Video className="w-3.5 h-3.5" /> Launch Video Call
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Referral request feed card */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Referral Request Feed</h3>
                <Link to="/jobs" className="text-xs text-indigo-405 hover:underline flex items-center gap-0.5 font-bold">
                  See job board <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <GlassCard className="flex flex-col gap-3 py-4 card-gradient-border border-white/5" hoverGlow={false}>
                {loadingData ? (
                  <div className="shimmer h-12 rounded-xl" />
                ) : referrals.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No active referral applications submitted yet.</p>
                ) : (
                  referrals.map((ref) => (
                    <div key={ref._id} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition mx-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center font-bold text-white text-xs">
                          {ref.job?.company ? ref.job.company[0] : 'J'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white m-0 font-space">{ref.job?.title || 'Software Position'}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">{ref.job?.company || 'Corporate Partner'} &bull; {ref.job?.location || 'Aditya Link'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-lg capitalize border ${
                          ref.status === 'accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : ref.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border-red-500/25'
                              : 'bg-indigo-500/10 text-indigo-400 border-primary/25'
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </GlassCard>
            </div>

            {/* Recent Notifications feed */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Recent Alerts</h3>
              <GlassCard className="flex flex-col gap-3 py-4 card-gradient-border border-white/5" hoverGlow={false}>
                {loadingData ? (
                  <div className="shimmer h-12 rounded-xl" />
                ) : recentNotifs.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No recent notifications.</p>
                ) : (
                  recentNotifs.map((notif) => (
                    <div key={notif._id} className="flex gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition mx-4 text-left">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/40 border border-primary/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 m-0 font-sans leading-relaxed">{notif.text}</p>
                        <span className="text-[8px] text-gray-500 font-mono block mt-1 uppercase">{notif.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </GlassCard>
            </div>

            {/* Leaderboard Standings Preview */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Leaderboard Rankings</h3>
                <Link to="/leaderboard" className="text-xs text-indigo-405 hover:underline flex items-center gap-0.5 font-bold">
                  Full leaderboard <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <GlassCard className="flex flex-col gap-2.5 p-4 card-gradient-border border-white/5" hoverGlow={false}>
                {loadingData ? (
                  <div className="shimmer h-24 rounded-xl" />
                ) : leaderboard.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No rankings loaded.</p>
                ) : (
                  leaderboard.map((item, idx) => {
                    const isCurrentUser = item.name === user?.name;
                    return (
                      <div 
                        key={item._id} 
                        className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          isCurrentUser 
                            ? 'bg-indigo-500/10 border-indigo-500/25' 
                            : 'bg-white/2 border-white/5 hover:border-white/10'
                        } transition`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center text-xs font-mono font-bold text-gray-500">#{idx + 1}</span>
                          <img src={item.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'} alt={item.name} className="w-7 h-7 rounded-lg object-cover" />
                          <span className={`text-xs font-bold ${isCurrentUser ? 'text-indigo-300' : 'text-white'}`}>{item.name}</span>
                          <span className="text-[8px] font-mono text-gray-500 uppercase">{item.role}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                          <Flame className="w-3 h-3 fill-amber-500" /> {item.xp} <span className="text-[8px] text-gray-500">XP</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </GlassCard>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Right Sidebar Panel */}
      <InsightsPanel />
    </div>
  );
};

export default Dashboard;
