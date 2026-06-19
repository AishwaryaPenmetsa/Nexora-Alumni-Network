import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useChat } from '../context/ChatContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { Search, MapPin, Briefcase, GraduationCap, ChevronRight, Grid, List, Check, UserPlus, Heart, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlumniDirectory = () => {
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();
  const { setActivePartner } = useChat();
  const navigate = useNavigate();

  // Search parameters
  const [name, setName] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [dept, setDept] = useState('');
  const [institution, setInstitution] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append('name', name);
      if (gradYear) queryParams.append('graduationYear', gradYear);
      if (dept) queryParams.append('department', dept);
      if (institution) queryParams.append('institution', institution);
      if (company) queryParams.append('company', company);
      if (skills) queryParams.append('skills', skills);
      if (location) queryParams.append('location', location);

      const res = await fetch(`${apiUrl}/directory/alumni?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading alumni directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleClearFilters = () => {
    setName('');
    setGradYear('');
    setDept('');
    setInstitution('');
    setCompany('');
    setSkills('');
    setLocation('');
    setTimeout(() => {
      fetchAlumni();
    }, 100);
  };

  const handleConnect = async (targetId, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/directory/connect/${targetId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(data.connected ? 'Connection request established!' : 'Disconnected successfully', 'success');
        
        setProfiles(prev => prev.map(p => {
          if (p.user._id === targetId) {
            const isConnected = p.connections.includes(user._id);
            return {
              ...p,
              connections: isConnected 
                ? p.connections.filter(id => id !== user._id)
                : [...p.connections, user._id]
            };
          }
          return p;
        }));

        if (selectedProfile && selectedProfile.user._id === targetId) {
          const isConnected = selectedProfile.connections.includes(user._id);
          setSelectedProfile(prev => ({
            ...prev,
            connections: isConnected 
              ? prev.connections.filter(id => id !== user._id)
              : [...prev.connections, user._id]
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (targetId, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/directory/follow/${targetId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(data.following ? 'Following alumnus' : 'Unfollowed alumnus', 'success');
        
        setProfiles(prev => prev.map(p => {
          if (p.user._id === targetId) {
            const isFollowing = p.followers.includes(user._id);
            return {
              ...p,
              followers: isFollowing 
                ? p.followers.filter(id => id !== user._id)
                : [...p.followers, user._id]
            };
          }
          return p;
        }));

        if (selectedProfile && selectedProfile.user._id === targetId) {
          const isFollowing = selectedProfile.followers.includes(user._id);
          setSelectedProfile(prev => ({
            ...prev,
            followers: isFollowing 
              ? prev.followers.filter(id => id !== user._id)
              : [...prev.followers, user._id]
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startConversation = (partner, e) => {
    if (e) e.stopPropagation();
    setActivePartner(partner);
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 font-space">Alumni Directory</h1>
            <p className="text-xs text-gray-400 font-light mt-1.5">
              Filter through verified alumni, schedule mentor hours, or request career referrals.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl self-start">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-all ${isGridView ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-all ${!isGridView ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <GlassCard className="border-white/5 p-5" hoverGlow={false}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-4 text-left">Search Filters</h3>
              <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Google, Stripe..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Department</label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Computer Science..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Institution</label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="" className="bg-darkBg text-white">All Institutions</option>
                    <option value="Aditya Engineering College" className="bg-darkBg text-white">Aditya Engineering College (AEC)</option>
                    <option value="Aditya College of Engineering & Technology" className="bg-darkBg text-white">Aditya College of Eng & Tech (ACET)</option>
                    <option value="Aditya Global Business School" className="bg-darkBg text-white">Aditya Global Business School (AGBS)</option>
                    <option value="Aditya Degree College" className="bg-darkBg text-white">Aditya Degree College (ADC)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Go, Python"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-655 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-mono text-gray-500">Graduation Year</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-medium transition cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl bg-primary hover:bg-indigo-650 text-xs text-white font-semibold shadow-glass-glow transition cursor-pointer border-0"
                  >
                    Apply Filter
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="shimmer h-44 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <GlassCard className="py-20 text-center border-white/5 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500 font-light">No alumni matching these search criteria.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition-colors border-0 cursor-pointer"
                >
                  Reset Directory
                </button>
              </GlassCard>
            ) : (
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
                {profiles.map((p) => {
                  const isConnected = p.connections.includes(user?._id);
                  return (
                    <GlassCard
                      key={p._id}
                      onClick={() => setSelectedProfile(p)}
                      className="text-left glass-card-hover border-white/5 flex flex-col justify-between"
                      hoverGlow
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                              alt={p.user.name}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10"
                            />
                            <div>
                              <h3 className="text-base font-bold text-white m-0 flex items-center gap-1.5 font-space">
                                {p.user.name}
                              </h3>
                              <span className="text-[10px] text-indigo-300 font-mono flex flex-col gap-0.5 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  Class of {p.graduationYear || '2019'} &bull; {p.department}
                                </span>
                                <span className="text-cyan-400 text-[9px] font-medium">{p.institution}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 mb-4 text-xs font-light text-gray-400">
                          {p.company && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-cyan-400" />
                              <span className="text-gray-300 font-medium">{p.company}</span> &bull; {p.industry}
                            </div>
                          )}
                          {p.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-indigo-400" />
                              <span>{p.location}</span>
                            </div>
                          )}
                          <p className="line-clamp-2 mt-1 leading-relaxed text-gray-400/90 font-light">{p.bio}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} className="text-[9px] font-mono text-gray-450 border border-white/5 bg-white/5 px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {p.skills.length > 3 && (
                            <span className="text-[9px] font-mono text-gray-500 px-2 py-0.5 rounded-full">
                              +{p.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${p.user._id}`);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0"
                          >
                            Full Timeline <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleConnect(p.user._id, e)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isConnected 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-inner' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                              }`}
                              title={isConnected ? 'Connected' : 'Connect'}
                            >
                              {isConnected ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={(e) => startConversation(p.user, e)}
                              className="p-2 rounded-xl border bg-white/5 border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              title="Send Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Profile Preview Popup Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedProfile.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                  alt={selectedProfile.user.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-primary/20"
                />
                <div>
                  <h3 className="text-xl font-bold text-white m-0 font-space">{selectedProfile.user.name}</h3>
                  <span className="text-xs text-indigo-400 font-mono block mt-0.5 capitalize">
                    Class of {selectedProfile.graduationYear} &bull; {selectedProfile.user.role}
                  </span>
                  <span className="text-cyan-400 text-[10px] font-medium block mt-0.5 font-sans">{selectedProfile.institution}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-gray-300 leading-relaxed font-light mb-6 font-sans">
                {selectedProfile.company && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-cyan-400" />
                    <span>Works at <span className="font-semibold text-white">{selectedProfile.company}</span></span>
                  </div>
                )}
                {selectedProfile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-indigo-400" />
                    <span>Based in {selectedProfile.location}</span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-3 mt-2">
                  <p className="text-gray-400 text-xs font-light italic mb-0">"{selectedProfile.bio}"</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <h4 className="text-[9px] uppercase font-mono text-indigo-300 m-0">Skills</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedProfile.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    navigate(`/profile/${selectedProfile.user._id}`);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white transition text-center font-semibold cursor-pointer bg-transparent"
                >
                  View Full Timeline
                </button>
                <button
                  onClick={() => handleConnect(selectedProfile.user._id)}
                  className="py-2.5 px-4 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer border-0 shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  {selectedProfile.connections.includes(user?._id) ? 'Connected' : 'Connect'}
                </button>
                <button
                  onClick={() => startConversation(selectedProfile.user)}
                  className="py-2.5 px-4 rounded-xl border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlumniDirectory;
