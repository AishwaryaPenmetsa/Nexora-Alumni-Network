import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import {
  Cpu,
  FileText,
  Compass,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Play,
  ArrowRight,
  Gauge,
  TrendingUp,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AiCareerHub = () => {
  const { apiUrl } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('resume');

  // Resume states
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeReview, setResumeReview] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Career recommendation states
  const [careerData, setCareerData] = useState(null);
  const [careerLoading, setCareerLoading] = useState(false);

  // Mentor matching states
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);

  // Handlers
  const handleResumeCheck = async (e) => {
    e.preventDefault();
    if (!resumeUrl.trim()) return;

    setResumeLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/ai/resume-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setResumeReview(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResumeLoading(false);
    }
  };

  const fetchCareerData = async () => {
    setCareerLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/ai/career-recommend`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCareerData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCareerLoading(false);
    }
  };

  const fetchMentorMatches = async () => {
    setMentorsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/ai/mentor-match`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMentors(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMentorsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'career') {
      fetchCareerData();
    } else if (activeTab === 'mentors') {
      fetchMentorMatches();
    }
  }, [activeTab, apiUrl]);

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto overflow-y-auto z-10 relative text-left">
        <div className="absolute top-24 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 flex items-center gap-2 font-space">
              <Cpu className="w-8 h-8 text-cyan-400 animate-spin-slow" /> NEXORA AI Career Hub
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1.5 font-sans">
              Leverage local vector match logic for resume scoring, career pathways, and expert mentor matchmaking.
            </p>
          </div>

          {resumeReview && activeTab === 'resume' && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <div className="font-mono text-left">
                <span className="text-[9px] text-gray-500 block">RESUME ATS SCORE</span>
                <span className="text-sm font-bold text-white">{resumeReview.score} / 100</span>
              </div>
            </div>
          )}
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-4 font-sans">
          {[
            { id: 'resume', label: 'ATS Resume Review', icon: FileText },
            { id: 'career', label: 'Career Recommendations', icon: Compass },
            { id: 'mentors', label: 'Alumni Mentor Matcher', icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3.5 px-1.5 text-xs font-semibold border-b-2 outline-none border-0 bg-transparent cursor-pointer whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-500 text-white font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'resume' && (
            <motion.div
              key="resume-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-1 flex flex-col gap-6">
                <GlassCard className="border-indigo-500/10 p-5" hoverGlow={false}>
                  <h3 className="text-sm font-extrabold text-white mb-2 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    ATS Scanner
                  </h3>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed mb-5 font-sans">
                    Simulate deep vector NLP scoring checks on your resume profile content to prepare for placement filters.
                  </p>

                  <form onSubmit={handleResumeCheck} className="flex flex-col gap-4 font-sans">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-mono text-indigo-300">Resume Doc URL</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. google-drive/sarah-resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resumeLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition text-xs cursor-pointer border-0"
                    >
                      {resumeLoading ? 'Analyzing Resume...' : 'Parse & Score CV'}
                    </button>
                  </form>
                </GlassCard>

                {resumeReview && (
                  <GlassCard className="border-emerald-500/25 bg-emerald-950/2 p-5 text-xs" hoverGlow={false}>
                    <h4 className="text-white font-bold mb-2 flex items-center gap-1 font-space">
                      <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" /> ATS Compatibility Passed
                    </h4>
                    <p className="text-gray-400 leading-relaxed font-light font-sans">
                      Your score of <span className="text-emerald-400 font-bold font-mono">{resumeReview.score}</span> places your profile in the top 15% of mock applicant pools. Review skills gap suggestions on the right to optimize.
                    </p>
                  </GlassCard>
                )}
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                {resumeReview ? (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <GlassCard className="border-emerald-500/10 p-5 text-xs" hoverGlow={false}>
                        <h4 className="text-xs font-extrabold text-emerald-400 mb-3 flex items-center gap-1.5 uppercase font-mono">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Key Strengths
                        </h4>
                        <ul className="flex flex-col gap-2.5 list-none pl-0 text-left text-gray-300 font-light font-sans">
                          {resumeReview.strengths.map((str, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>

                      <GlassCard className="border-red-500/10 p-5 text-xs" hoverGlow={false}>
                        <h4 className="text-xs font-extrabold text-red-400 mb-3 flex items-center gap-1.5 uppercase font-mono">
                          <AlertCircle className="w-4 h-4 text-red-500" /> Identified Gaps
                        </h4>
                        <ul className="flex flex-col gap-2.5 list-none pl-0 text-left text-gray-300 font-light font-sans">
                          {resumeReview.skillsGaps.map((gap, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-red-500 font-bold">•</span>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </div>

                    <GlassCard className="border-white/5 p-5 text-xs" hoverGlow={false}>
                      <h4 className="text-xs font-extrabold text-white mb-3 uppercase font-mono tracking-wider">
                        ATS Improvement Recommendations
                      </h4>
                      
                      <div className="flex flex-col gap-4 font-sans">
                        <div className="bg-white/2 p-3.5 rounded-xl border border-white/5">
                          <span className="text-[9px] font-bold font-mono text-indigo-300 uppercase block mb-1">
                            FORMATTING AUDIT
                          </span>
                          <p className="text-gray-400 font-light leading-relaxed leading-normal">
                            {resumeReview.formatting}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold font-mono text-indigo-300 uppercase mb-1.5">
                            ACTIONABLE CHECKLIST
                          </span>
                          {resumeReview.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-300 font-light border-b border-white/5 pb-2 last:border-0 last:pb-0">
                              <span className="w-5 h-5 rounded-full bg-indigo-950 flex items-center justify-center font-mono text-[9px] font-bold text-indigo-400 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ) : (
                  <GlassCard className="py-24 text-center text-gray-500 text-xs flex flex-col items-center justify-center gap-3 border-white/5">
                    <FileText className="w-10 h-10 text-gray-600 animate-pulse" />
                    <span className="font-sans">Enter your resume file URL on the left to display AI score metrics.</span>
                  </GlassCard>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'career' && (
            <motion.div
              key="career-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              {careerLoading ? (
                <div className="shimmer h-[300px] rounded-2xl animate-pulse" />
              ) : careerData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    <GlassCard className="border-cyan-500/25 bg-gradient-to-br from-cyan-950/15 via-primary/5 to-cyan-950/5 p-6 text-center" hoverGlow>
                      <span className="text-[9px] font-black font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-500/20 px-3.5 py-1.5 rounded-full">
                        RECOMMENDED TRACK
                      </span>
                      <h3 className="text-xl font-black text-white mt-5 mb-2.5 leading-snug font-space">
                        {careerData.roleMatched}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-max mx-auto text-xs font-mono">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Confidence: {careerData.confidence}
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed font-light mt-5 font-sans">
                        Based on skills logged in your student profile, our engine matches you to this track. Verify skill-gap metrics to configure courses.
                      </p>
                    </GlassCard>
                  </div>

                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <GlassCard className="border-white/5 p-5 text-xs text-left" hoverGlow={false}>
                      <h4 className="text-xs font-extrabold text-white mb-4 uppercase font-mono tracking-wider flex items-center gap-1">
                        <Award className="w-4 h-4 text-indigo-400" /> Core Skill Priorities
                      </h4>

                      <div className="flex flex-col gap-2.5 font-sans">
                        {careerData.skillsGapAnalysis?.map((gap, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/2 hover:border-white/10 hover:bg-white/5 transition-all duration-300"
                          >
                            <div className="min-w-0 text-left">
                              <span className="text-xs font-bold text-white block">{gap.skill}</span>
                              <span className="text-[10px] text-gray-500 block font-light mt-0.5">{gap.status}</span>
                            </div>

                            <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-full font-bold ${
                              gap.priority === 'High'
                                ? 'text-red-400 border-red-500/25 bg-red-950/20'
                                : 'text-amber-400 border-amber-500/25 bg-amber-950/20'
                            }`}>
                              {gap.priority} Priority
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard className="border-white/5 p-5 text-xs text-left" hoverGlow={false}>
                      <h4 className="text-xs font-extrabold text-white mb-4 uppercase font-mono tracking-wider">
                        Suggested Learning Courses
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                        {careerData.recommendedCourses?.map((course, idx) => (
                          <div
                            key={idx}
                            className="p-4 border border-white/5 rounded-2xl bg-white/2 flex flex-col justify-between hover:border-white/10 hover:bg-white/5 transition-all duration-300 h-32 text-left"
                          >
                            <div>
                              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">
                                {course.provider}
                              </span>
                              <h5 className="text-xs font-extrabold text-white mt-1 mb-2 line-clamp-2 leading-snug font-space">
                                {course.name}
                              </h5>
                            </div>

                            <button className="text-[10px] font-mono text-indigo-400 hover:text-white flex items-center gap-1.5 transition border-0 bg-transparent cursor-pointer p-0">
                              <Play className="w-3 h-3 fill-indigo-400 text-indigo-405" /> Start Learning <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              ) : (
                <GlassCard className="py-20 text-center text-gray-500 text-xs border-white/5">
                  No career recommendation data. Click to load mapping algorithms.
                </GlassCard>
              )}
            </motion.div>
          )}

          {activeTab === 'mentors' && (
            <motion.div
              key="mentors-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              {mentorsLoading ? (
                <div className="shimmer h-[300px] rounded-2xl animate-pulse" />
              ) : mentors.length === 0 ? (
                <GlassCard className="py-20 text-center text-gray-500 text-xs border-white/5">
                  No overlapping skill matches located in database. Expand your profile skills tags!
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wider font-mono">
                    Top Vector Mentorship Matches
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {mentors.map((m, idx) => (
                      <GlassCard
                        key={idx}
                        className="border-white/5 text-center p-6 flex flex-col justify-between h-80"
                        hoverGlow
                      >
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <img
                              src={m.mentor?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                              alt={m.mentor?.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                            />
                            <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-full border border-darkBg shadow">
                              {m.matchPercentage}% MATCH
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-white m-0 mb-1 font-space">{m.mentor?.name}</h4>
                          <span className="text-[10px] font-mono text-gray-500 uppercase">
                            {m.company || 'Alumni Mentor'}
                          </span>

                          <div className="flex flex-wrap gap-1.5 items-center justify-center mt-3.5">
                            {m.skillsMatched?.slice(0, 3).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[8px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2 py-0.2 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          to="/mentorship"
                          className="w-full mt-5 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-white text-xs font-semibold shadow-glass-glow transition-all block text-center border-0"
                        >
                          Schedule Mentorship Session
                        </Link>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AiCareerHub;
