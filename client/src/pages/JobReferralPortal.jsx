import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  PlusCircle, 
  ExternalLink, 
  ArrowUpRight, 
  Check, 
  X as CloseIcon,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobReferralPortal = () => {
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const [jobs, setJobs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('board'); // board / referrals

  // Search/Filters state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);

  // Post Job modal state
  const [postOpen, setPostOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [desc, setDesc] = useState('');
  const [salary, setSalary] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [expRequired, setExpRequired] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  // Apply Referral modal state
  const [applyJob, setApplyJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  const fetchJobsAndReferrals = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Fetch Jobs
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (location) queryParams.append('location', location);
      if (isRemote) queryParams.append('isRemote', 'true');

      const resJobs = await fetch(`${apiUrl}/jobs?${queryParams.toString()}`);
      if (resJobs.ok) {
        const jobsData = await resJobs.json();
        setJobs(jobsData);
      }

      // Fetch referrals
      if (token) {
        const resRefs = await fetch(`${apiUrl}/jobs/referrals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resRefs.ok) {
          const refsData = await resRefs.json();
          setReferrals(refsData);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching jobs and referrals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndReferrals();
  }, [search, location, isRemote]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title || !company || !desc || !jobLocation) return;

    setPostLoading(true);
    const token = localStorage.getItem('token');
    try {
      const skillsArray = skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${apiUrl}/jobs/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          company,
          description: desc,
          salary,
          location: jobLocation,
          experienceRequired: expRequired,
          isRemote,
          skillsRequired: skillsArray
        })
      });
      if (res.ok) {
        addToast('Job posting listed successfully!', 'success');
        setPostOpen(false);
        // Reset states
        setTitle('');
        setCompany('');
        setDesc('');
        setSalary('');
        setJobLocation('');
        setExpRequired('');
        setSkillsRequired('');
        fetchJobsAndReferrals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl) return;

    setApplyLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/jobs/referral/${applyJob._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeUrl, notes })
      });
      if (res.ok) {
        addToast('Referral request submitted successfully!', 'success');
        setApplyJob(null);
        setResumeUrl('');
        setNotes('');
        fetchJobsAndReferrals();
        setTab('referrals');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleBookmarkToggle = async (jobId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/jobs/bookmark/${jobId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(data.bookmarked ? 'Job bookmarked!' : 'Bookmark removed', 'success');
        fetchJobsAndReferrals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReferralStatus = async (refId, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/jobs/referral/${refId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        addToast(`Referral request ${status}!`, 'success');
        fetchJobsAndReferrals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative">
        <div className="absolute top-24 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 font-space">Job Referral Portal</h1>
            <p className="text-xs text-gray-400 font-light mt-1.5">
              Secure alumni job referrals. Post openings or request professional vouches.
            </p>
          </div>

          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button
              onClick={() => setPostOpen(true)}
              className="px-5 py-3 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition-all flex items-center gap-1.5 self-start shadow-glass-glow shadow-primary/15 border-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Post a Job Opening
            </button>
          )}
        </div>

        <div className="flex border-b border-white/5 gap-8 mb-6 text-left">
          <button
            onClick={() => setTab('board')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all outline-none border-0 bg-transparent cursor-pointer ${
              tab === 'board' ? 'border-primary text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Job board listings
          </button>
          <button
            onClick={() => setTab('referrals')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all outline-none border-0 bg-transparent cursor-pointer ${
              tab === 'referrals' ? 'border-primary text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Referral Applications
          </button>
        </div>

        {tab === 'board' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <GlassCard className="border-white/5 p-5" hoverGlow={false}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 mb-4 text-left">Search parameters</h3>
                <div className="flex flex-col gap-4 text-left font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-mono text-gray-500">Keyword Search</label>
                    <input
                      type="text"
                      placeholder="Title, Company, Skill..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-mono text-gray-500">Location</label>
                    <input
                      type="text"
                      placeholder="City or Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <span className="text-xs text-gray-300 font-medium">Remote Only</span>
                    <input
                      type="checkbox"
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="rounded bg-white/5 border-white/10 text-primary w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-32 rounded-2xl animate-pulse" />)}
                </div>
              ) : jobs.length === 0 ? (
                <GlassCard className="py-16 text-center border-white/5">
                  <p className="text-sm text-gray-500 font-light">No jobs listed. Refine filters or try again.</p>
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-4 text-left font-sans">
                  {jobs.map((job) => {
                    const isBookmarked = job.bookmarks.includes(user?._id);
                    return (
                      <GlassCard key={job._id} className="border-white/5 flex flex-col justify-between hover:border-indigo-500/15" hoverGlow>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center font-bold text-white text-sm border border-white/5 flex-shrink-0">
                              {job.logo ? (
                                <img src={job.logo} className="w-full h-full rounded-xl object-cover" alt={job.company} />
                              ) : (
                                job.company[0]
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white m-0 flex items-center gap-2 font-space">
                                {job.title}
                                {job.isRemote && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                                    Remote
                                  </span>
                                )}
                              </h3>
                              <span className="text-xs text-gray-400 mt-1 block">
                                {job.company} &bull; <MapPin className="inline w-3.5 h-3.5 -mt-0.5" /> {job.location}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleBookmarkToggle(job._id, e)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isBookmarked 
                                ? 'bg-primary/10 border-primary/30 text-white' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3 mt-2">
                          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
                            {job.salary && <span className="flex items-center text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>}
                            <span>Experience: {job.experienceRequired || 'Entry Level'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-1.5 mr-4">
                              {job.skillsRequired.slice(0, 2).map((s, idx) => (
                                <span key={idx} className="text-[9px] font-mono text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>

                            {user?._id !== job.postedBy?._id && (
                              <button
                                onClick={() => setApplyJob(job)}
                                className="px-4.5 py-2.5 rounded-xl bg-primary hover:bg-indigo-650 text-xs font-semibold text-white transition-all shadow-glass-glow shadow-primary/15 border-0 cursor-pointer"
                              >
                                Apply Referral
                              </button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          referrals.length === 0 ? (
            <GlassCard className="py-20 text-center border-white/5">
              <p className="text-sm text-gray-500 font-light">No referral applications listed yet.</p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-4 text-left font-sans">
              {referrals.map((ref) => {
                const isAlumniPoster = ref.alumni._id === user?._id;
                const partnerName = isAlumniPoster ? ref.candidate.name : ref.alumni.name;

                return (
                  <GlassCard key={ref._id} className="border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6" hoverGlow={false}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-primary/10">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white m-0 font-space">{ref.job.title}</h4>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {isAlumniPoster ? 'Candidate student' : 'Alumnus sponsor'}:{' '}
                            <span className="text-indigo-300 font-semibold">{partnerName}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-mono">
                        <span>Company: {ref.job.company}</span>
                        {ref.notes && <span className="text-gray-400 italic">Notes: "{ref.notes}"</span>}
                        {ref.resumeUrl && (
                          <a
                            href={ref.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-0.5"
                          >
                            Resume PDF <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono px-3 py-1 rounded-xl uppercase border ${
                        ref.status === 'accepted'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : ref.status === 'rejected'
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-indigo-500/15 text-indigo-400 border-primary/30'
                      }`}>
                        {ref.status}
                      </span>

                      {isAlumniPoster && ref.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReferralStatus(ref._id, 'accepted')}
                            className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                            title="Accept Referral Vouch"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReferralStatus(ref._id, 'rejected')}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                            title="Decline"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )
        )}

        {/* Post Job Modal */}
        <AnimatePresence>
          {postOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
              >
                <button
                  onClick={() => setPostOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition border-0 bg-transparent cursor-pointer"
                >
                  <CloseIcon className="w-4.5 h-4.5" />
                </button>

                <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2 font-space">
                  <Briefcase className="w-5 h-5 text-indigo-400 animate-pulse" /> Post a Job Listing
                </h2>
                <p className="text-xs text-gray-400 font-light mb-6">Create a job post visible to all students in the portal.</p>

                <form onSubmit={handlePostSubmit} className="flex flex-col gap-4 text-left font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Software Engineer I"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Stripe"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 col-span-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Salary Range</label>
                      <input
                        type="text"
                        placeholder="$120k - $140k"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1 col-span-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Location</label>
                      <input
                        type="text"
                        required
                        placeholder="New York, NY"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1 col-span-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Experience</label>
                      <input
                        type="text"
                        placeholder="0-2 Years"
                        value={expRequired}
                        onChange={(e) => setExpRequired(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Skills Required (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Go, Linux"
                      value={skillsRequired}
                      onChange={(e) => setSkillsRequired(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Description details</label>
                    <textarea
                      required
                      placeholder="Write roles, responsibilities, or requirements..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-655 outline-none focus:border-primary/50 h-20 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <span className="text-xs text-gray-300 font-medium">Remote Work Option</span>
                    <input
                      type="checkbox"
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="rounded bg-white/5 border-white/10 text-primary w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={postLoading}
                    className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition cursor-pointer border-0"
                  >
                    {postLoading ? 'Creating Post...' : 'Publish Job Listing'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Apply Referral Modal */}
        <AnimatePresence>
          {applyJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
              >
                <button
                  onClick={() => setApplyJob(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition border-0 bg-transparent cursor-pointer"
                >
                  <CloseIcon className="w-4.5 h-4.5" />
                </button>

                <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2 font-space">
                  <Send className="w-5 h-5 text-indigo-400 animate-pulse" /> Apply for Referral
                </h2>
                <p className="text-xs text-gray-400 font-light mb-6">
                  Request a referral vouch for the <span className="text-white font-medium">{applyJob.title}</span> position at {applyJob.company}.
                </p>

                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4 text-left font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Resume Link (PDF / Drive Link)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/my-resume"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Candidate Note to Alumni</label>
                    <textarea
                      placeholder="Vouch statement: Why are you a good fit for this role?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 h-24 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition cursor-pointer border-0"
                  >
                    {applyLoading ? 'Submitting...' : 'Submit Referral Request'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default JobReferralPortal;
