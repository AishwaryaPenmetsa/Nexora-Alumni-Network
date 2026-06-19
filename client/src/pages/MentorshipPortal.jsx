import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Check, 
  X as CloseIcon, 
  BookOpen, 
  Video, 
  Star, 
  Award,
  ToggleLeft,
  ToggleRight,
  Send,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MentorshipPortal = () => {
  const { user, toggleMentorStatus, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const [mentors, setMentors] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('find'); // find / history

  // Booking details state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review details state
  const [selectedSessionReview, setSelectedSessionReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchMentorsAndHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Find mentors
      const resMentors = await fetch(`${apiUrl}/mentorship/mentors`);
      if (resMentors.ok) {
        const mentorsData = await resMentors.json();
        setMentors(mentorsData);
      }

      // History
      if (token) {
        const resHistory = await fetch(`${apiUrl}/mentorship/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resHistory.ok) {
          const historyData = await resHistory.json();
          setHistory(historyData);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading mentorship details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsAndHistory();
  }, [apiUrl]);

  const handleToggleMentor = async () => {
    try {
      const isMentor = await toggleMentorStatus();
      addToast(isMentor ? 'You are now registered as a Mentor!' : 'Mentor registration disabled', 'success');
      fetchMentorsAndHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !date || !time) return;

    setBookingLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/mentorship/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mentorId: selectedMentor.user._id,
          topic,
          date,
          time,
          notes
        })
      });
      if (res.ok) {
        addToast('Mentorship session requested successfully!', 'success');
        setSelectedMentor(null);
        setTopic('');
        setDate('');
        setTime('');
        setNotes('');
        fetchMentorsAndHistory();
        setTab('history');
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Booking failed');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/mentorship/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        addToast(`Session ${status}!`, 'success');
        fetchMentorsAndHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/mentorship/session/${selectedSessionReview._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, text: reviewText })
      });
      if (res.ok) {
        addToast('Review submitted successfully!', 'success');
        setSelectedSessionReview(null);
        setReviewText('');
        setRating(5);
        fetchMentorsAndHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative">
        <div className="absolute top-24 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 font-space">Mentorship Portal</h1>
            <p className="text-xs text-gray-400 font-light mt-1.5">
              Secure career guidance. Schedule meetings or manage student slots.
            </p>
          </div>

          {user?.role === 'alumni' && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl self-start">
              <span className="text-xs text-gray-300 font-medium font-space">Become a Mentor</span>
              <button onClick={handleToggleMentor} className="text-indigo-400 focus:outline-none transition border-0 bg-transparent cursor-pointer flex items-center">
                {user.isMentor ? <ToggleRight className="w-8 h-8 text-accent animate-pulse" /> : <ToggleLeft className="w-8 h-8 text-gray-500" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex border-b border-white/5 gap-8 mb-6 text-left">
          <button
            onClick={() => setTab('find')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all outline-none border-0 bg-transparent cursor-pointer ${
              tab === 'find' ? 'border-primary text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Find a Mentor
          </button>
          <button
            onClick={() => setTab('history')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all outline-none border-0 bg-transparent cursor-pointer ${
              tab === 'history' ? 'border-primary text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Session History & Slots
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer h-48 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : tab === 'find' ? (
          mentors.length === 0 ? (
            <GlassCard className="py-20 text-center border-white/5">
              <p className="text-sm text-gray-500 font-light">No mentors registered at this time. Check back later.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {mentors.map((m) => (
                <GlassCard key={m._id} className="flex flex-col justify-between border-white/5 glass-card-hover" hoverGlow>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={m.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={m.user.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white m-0 font-space">{m.user.name}</h3>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{m.company || 'Industry Leader'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-3 font-sans">{m.bio}</p>

                    <div className="flex items-center gap-1.5 mb-4 text-xs font-mono">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-white font-bold">{m.rating > 0 ? m.rating.toFixed(1) : 'New'}</span>
                      <span className="text-gray-500">Score</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {m.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {user?._id !== m.user._id && (
                    <button
                      onClick={() => setSelectedMentor(m)}
                      className="w-full mt-2 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition cursor-pointer border-0 shadow-glass-glow shadow-primary/15"
                    >
                      Book Session
                    </button>
                  )}
                </GlassCard>
              ))}
            </div>
          )
        ) : (
          history.length === 0 ? (
            <GlassCard className="py-20 text-center border-white/5">
              <p className="text-sm text-gray-500 font-light">No mentorship sessions logs recorded yet.</p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-4 text-left font-sans">
              {history.map((sess) => {
                const isMentorUser = sess.mentor._id === user?._id;
                const partnerName = isMentorUser ? sess.student.name : sess.mentor.name;

                return (
                  <GlassCard key={sess._id} className="border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6" hoverGlow={false}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-primary/10">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white m-0 font-space">{sess.topic}</h4>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {isMentorUser ? 'Student applicant' : 'Mentor advisor'}:{' '}
                            <span className="text-indigo-300 font-semibold">{partnerName}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {sess.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sess.time}</span>
                        {sess.notes && <span className="text-gray-400 italic">Notes: "{sess.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono px-3 py-1 rounded-xl uppercase border ${
                        sess.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : sess.status === 'completed'
                            ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                            : sess.status === 'rejected'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : 'bg-indigo-500/15 text-indigo-400 border-primary/30'
                      }`}>
                        {sess.status}
                      </span>

                      {isMentorUser && sess.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(sess._id, 'approved')}
                            className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                            title="Approve Session"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(sess._id, 'rejected')}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                            title="Reject Request"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {!isMentorUser && sess.status === 'approved' && (
                        <div className="flex items-center gap-2">
                          {sess.meetingLink && (
                            <a
                              href={sess.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition flex items-center gap-1 shadow"
                            >
                              <Video className="w-4 h-4" /> Join Meet
                            </a>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(sess._id, 'completed')}
                            className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold text-white transition cursor-pointer border-0"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}

                      {!isMentorUser && sess.status === 'completed' && !sess.review?.rating && (
                        <button
                          onClick={() => setSelectedSessionReview(sess)}
                          className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white transition cursor-pointer bg-transparent"
                        >
                          Review Session
                        </button>
                      )}

                      {sess.status === 'completed' && sess.certificateUrl && (
                        <a
                          href={sess.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl border border-cyan-500/25 bg-cyan-950/45 text-cyan-400 text-xs font-mono flex items-center gap-1 hover:brightness-110 transition shadow-inner"
                        >
                          <Award className="w-4 h-4" /> Certificate
                        </a>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )
        )}

        {/* Booking Calendar Dialog Modal */}
        <AnimatePresence>
          {selectedMentor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
              >
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition border-0 bg-transparent cursor-pointer"
                >
                  <CloseIcon className="w-4.5 h-4.5" />
                </button>

                <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2 font-space">
                  <Calendar className="w-5 h-5 text-indigo-400 animate-pulse" /> Book Career Session
                </h2>
                <p className="text-xs text-gray-400 font-light mb-6">
                  Booking a virtual 1-on-1 meeting slot with <span className="text-white font-medium">{selectedMentor.user.name}</span>.
                </p>

                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4 text-left font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Topic of Discussion</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mock Technical Interview, Resume Review"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Time Slot</label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Detailed Notes (Optional)</label>
                    <textarea
                      placeholder="Write details or links to your project repository..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition cursor-pointer border-0"
                  >
                    {bookingLoading ? 'Submitting Slot...' : 'Confirm Meeting Reservation'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Dialog Modal */}
        <AnimatePresence>
          {selectedSessionReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-sm glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
              >
                <button
                  onClick={() => setSelectedSessionReview(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition border-0 bg-transparent cursor-pointer"
                >
                  <CloseIcon className="w-4.5 h-4.5" />
                </button>

                <h2 className="text-lg font-bold text-white mb-1 font-space">Rate Mentorship Session</h2>
                <p className="text-xs text-gray-400 font-light mb-4">Provide rating scores and feedback text to help alumni recalibrate.</p>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Rating (1 - 5 Stars)</label>
                    <div className="flex gap-2.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform active:scale-95 bg-transparent border-0 cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-650'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Feedback Comments</label>
                    <textarea
                      required
                      placeholder="Write a brief comment about what went well and what can improve..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 h-20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition cursor-pointer border-0 shadow"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Session Review'}
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

export default MentorshipPortal;
