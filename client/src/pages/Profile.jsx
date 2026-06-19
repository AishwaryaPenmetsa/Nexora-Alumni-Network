import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useChat } from '../context/ChatContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Linkedin, 
  Github, 
  Twitter, 
  Download, 
  Award, 
  Star, 
  MessageSquare, 
  UserPlus, 
  Check, 
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { id } = useParams();
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();
  const { setActivePartner } = useChat();
  const navigate = useNavigate();

  const [targetUser, setTargetUser] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Recommendation input
  const [recommendText, setRecommendText] = useState('');
  const [submittingRec, setSubmittingRec] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${apiUrl}/directory/profile/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTargetUser(data.user);
        setTargetProfile(data.profile);
      } else {
        addToast('Profile not found', 'error');
        navigate('/directory');
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/directory/connect/${targetUser._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(data.connected ? 'Connection established!' : 'Connection removed', 'success');
        
        // Update local state
        setTargetProfile(prev => {
          const isConnected = prev.connections.some(c => c._id === user._id);
          return {
            ...prev,
            connections: isConnected 
              ? prev.connections.filter(c => c._id !== user._id)
              : [...prev.connections, { _id: user._id, name: user.name, role: user.role }]
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    if (!recommendText.trim()) return;

    setSubmittingRec(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/directory/recommend/${targetUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: recommendText })
      });
      if (res.ok) {
        addToast('Recommendation added!', 'success');
        setRecommendText('');
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      addToast('Error submitting recommendation', 'error');
    } finally {
      setSubmittingRec(false);
    }
  };

  const startChat = () => {
    setActivePartner(targetUser);
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center pt-16">
        <div className="w-10 h-10 border-t-2 border-primary border-r-2 border-r-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isConnected = targetProfile?.connections?.some(c => c._id === user?._id);

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto overflow-y-auto z-10 relative">
        <div className="absolute top-24 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Banner image wrapper */}
        <div className="w-full h-40 md:h-48 rounded-3xl bg-gradient-to-r from-primary/25 via-secondary/25 to-accent/25 relative overflow-hidden mb-6 border border-white/5 shadow-inner">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute bottom-4 right-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-darkBg/60 backdrop-blur px-3 py-1.5 rounded-xl border border-white/5">
            Cohort Member Timeline
          </div>
        </div>

        {/* Profile Card Summary & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 px-4 mb-8 text-left relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <img
              src={targetUser?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
              alt={targetUser?.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-darkBg shadow-2xl flex-shrink-0"
            />
            <div className="pb-1">
              <h1 className="text-3xl font-extrabold text-white m-0 flex items-center gap-2 font-space">
                {targetUser?.name}
              </h1>
              <span className="text-xs text-indigo-300 font-mono block mt-1.5 capitalize">
                {targetProfile?.graduationYear ? `Class of ${targetProfile.graduationYear}` : 'Student Enrolled'} &bull; {targetUser?.role}
              </span>
            </div>
          </div>

          {/* Socials & Connect Buttons (Don't render actions if reviewing own profile) */}
          {user?._id !== targetUser?._id && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleConnect}
                className={`py-2.5 px-4 rounded-xl border font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-primary hover:bg-indigo-650 text-white shadow-glass-glow shadow-primary/20 border-0'
                }`}
              >
                {isConnected ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isConnected ? 'Connected' : 'Connect'}
              </button>
              <button
                onClick={startChat}
                className="py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          )}
        </div>

        {/* Profile Grid (Left Details, Right Bio & Experience Timeline) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Details, Skills, Badges, Socials) */}
          <div className="lg:col-span-1 flex flex-col gap-6 text-left">
            {/* Bio Card */}
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-3">About Me</h3>
              <p className="text-xs text-gray-405 font-light leading-relaxed m-0 font-sans">{targetProfile?.bio || 'No bio description provided.'}</p>

              {/* Social Channels */}
              <div className="flex items-center gap-4 mt-6 border-t border-white/5 pt-4">
                {targetProfile?.socialLinks?.linkedin && (
                  <a href={targetProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                )}
                {targetProfile?.socialLinks?.github && (
                  <a href={targetProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    <Github className="w-4.5 h-4.5" />
                  </a>
                )}
                {targetProfile?.socialLinks?.twitter && (
                  <a href={targetProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    <Twitter className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>
            </GlassCard>

            {/* Badges and Skills Card */}
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              {/* Badges */}
              {targetProfile?.badges && targetProfile.badges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-3">System Badges</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {targetProfile.badges.map((badge, idx) => (
                      <span key={idx} className="text-[9px] font-bold font-mono text-cyan-400 bg-cyan-950/45 border border-accent/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 animate-pulse" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-3">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {targetProfile?.skills && targetProfile.skills.length > 0 ? (
                  targetProfile.skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">No skills listed yet.</span>
                )}
              </div>

              {/* Resume Download */}
              {targetProfile?.resumeUrl && (
                <div className="border-t border-white/5 pt-4 mt-6">
                  <a
                    href={targetProfile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-indigo-400 hover:text-white font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" /> Download Resume PDF
                  </a>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column (Experience, Projects, Recommendations) */}
          <div className="lg:col-span-2 flex flex-col gap-6 text-left">
            {/* Professional Timeline */}
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Career Experience
              </h3>

              {targetProfile?.experience && targetProfile.experience.length > 0 ? (
                <div className="relative border-l border-white/10 pl-6 ml-2 flex flex-col gap-8">
                  {targetProfile.experience.map((exp, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 bg-indigo-500 w-2 h-2 rounded-full border-4 border-darkBg shadow-md" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5 font-space">{exp.role}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2 font-mono">
                          <span className="text-gray-300 font-medium">{exp.company}</span>
                          <span>&bull;</span>
                          <span>{exp.from} - {exp.current ? 'Present' : exp.to}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-light leading-relaxed font-sans">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No career experiences entered yet.</p>
              )}
            </GlassCard>

            {/* Academic Degrees */}
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-6 flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5" /> Education Details
              </h3>

              {targetProfile?.education && targetProfile.education.length > 0 ? (
                <div className="flex flex-col gap-6 font-sans">
                  {targetProfile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-indigo-400 self-start">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5 font-space">{edu.school}</h4>
                        <span className="text-xs text-gray-400">{edu.degree} &bull; {edu.fieldOfStudy}</span>
                        <span className="text-[9px] text-gray-500 font-mono mt-1.5 block">Graduation: {edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No academic education entered yet.</p>
              )}
            </GlassCard>

            {/* Showcase Projects */}
            {targetProfile?.projects && targetProfile.projects.length > 0 && (
              <GlassCard className="border-white/5 p-5" hoverGlow={false}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-6">Highlighted Projects</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {targetProfile.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between gap-3 font-sans">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 font-space">{proj.title}</h4>
                        <p className="text-[11px] text-gray-400 font-light leading-relaxed m-0">{proj.description}</p>
                      </div>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline self-start font-mono"
                        >
                          Source Code / Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Recommendations Wall */}
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Recommendation Wall
              </h3>

              {user?._id !== targetUser?._id && (
                <form onSubmit={handleRecommendSubmit} className="flex gap-3 mb-6 bg-white/5 border border-white/5 p-3.5 rounded-2xl">
                  <textarea
                    required
                    placeholder="Write a recommendation review about this alumni..."
                    value={recommendText}
                    onChange={(e) => setRecommendText(e.target.value)}
                    className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-gray-500 resize-none h-10 outline-none font-sans"
                  />
                  <button
                    type="submit"
                    disabled={submittingRec}
                    className="p-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-white transition self-end cursor-pointer border-0 shadow"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Recommendations List */}
              {targetProfile?.recommendations && targetProfile.recommendations.length > 0 ? (
                <div className="flex flex-col gap-4 font-sans">
                  {targetProfile.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3.5 border border-white/5 rounded-2xl bg-white/2 flex gap-3 text-left">
                      <img
                        src={rec.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={rec.author?.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xs font-bold text-white m-0 font-space">{rec.author?.name}</h4>
                          <span className="text-[8px] font-mono text-indigo-400 capitalize px-2 py-0.2 rounded-full bg-indigo-950/50 border border-primary/10">
                            {rec.author?.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 font-light leading-relaxed">"{rec.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic m-0">No recommendations posted on this profile yet.</p>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
