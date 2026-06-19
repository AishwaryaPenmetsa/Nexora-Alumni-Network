import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { Calendar, MapPin, Users, PlusCircle, Clock, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventsPortal = () => {
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Workshop');
  const [createLoading, setCreateLoading] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching events list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [apiUrl]);

  // Compute countdown ticker
  useEffect(() => {
    if (events.length === 0) return;

    const upcoming = events
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    if (!upcoming) return;

    const timer = setInterval(() => {
      const difference = +new Date(upcoming.date) - +new Date();
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const handleRSVPToggle = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/events/rsvp/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(data.rsvped ? 'Successfully registered RSVP!' : 'RSVP cancelled', 'success');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !date || !location) return;

    setCreateLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description: desc, date, location, category })
      });
      if (res.ok) {
        addToast('Event created successfully!', 'success');
        setCreateOpen(false);
        setTitle('');
        setDesc('');
        setDate('');
        setLocation('');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const nextEvent = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative">
        <div className="absolute top-24 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-white m-0 font-space">Campus & Alumni Events</h1>
            <p className="text-xs text-gray-400 font-light mt-1.5">
              RSVP for upcoming networking seminars, workshops, and student hackathons.
            </p>
          </div>

          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button
              onClick={() => setCreateOpen(true)}
              className="px-5 py-3 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition-all flex items-center gap-1.5 self-start shadow-glass-glow shadow-primary/15 border-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Schedule New Event
            </button>
          )}
        </div>

        {nextEvent && (
          <GlassCard className="border-accent/20 bg-gradient-to-r from-cyan-950/20 via-primary/5 to-secondary/10 mb-8 p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6" hoverGlow={false}>
            <div>
              <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-accent/20 px-3.5 py-1.5 rounded-full">
                NEXT UPCOMING EVENT
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-3 mb-1.5 font-space">{nextEvent.title}</h2>
              <span className="text-xs text-gray-405 font-mono flex items-center gap-1 font-sans">
                <MapPin className="w-3.5 h-3.5" /> {nextEvent.location}
              </span>
            </div>

            <div className="flex gap-4 font-mono text-center">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hrs', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-lg md:text-2xl font-bold text-white shadow min-w-12">
                    {time.val < 10 ? `0${time.val}` : time.val}
                  </div>
                  <span className="text-[9px] text-gray-500 uppercase mt-1.5">{time.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-48 rounded-2xl animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <GlassCard className="py-20 text-center border-white/5">
            <p className="text-sm text-gray-500 font-light">No events hosted yet. Host one to kick things off!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans">
            {events.map((e) => {
              const isRSVPed = e.rsvps.includes(user?._id);
              const eventDate = new Date(e.date);

              return (
                <GlassCard key={e._id} className="flex flex-col justify-between border-white/5 glass-card-hover" hoverGlow>
                  <div>
                    <span className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase border inline-block mb-3.5 ${
                      e.category === 'Hackathon'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : e.category === 'Workshop'
                          ? 'bg-indigo-500/10 text-indigo-400 border-primary/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-accent/20'
                    }`}>
                      {e.category}
                    </span>

                    <h3 className="text-base font-extrabold text-white m-0 mb-1.5 leading-snug font-space">{e.title}</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed mb-4 line-clamp-3">{e.description}</p>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-3 mb-4 text-[10px] text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> {eventDate.toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {e.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Users className="w-4 h-4 text-indigo-400" /> {e.rsvps.length} RSVPs
                    </span>

                    <button
                      onClick={() => handleRSVPToggle(e._id)}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isRSVPed
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-inner'
                          : 'bg-primary hover:bg-indigo-650 border-transparent text-white shadow-glass-glow'
                      }`}
                    >
                      {isRSVPed ? 'RSVP Registered' : 'RSVP to Event'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Create Event Dialog Modal */}
        <AnimatePresence>
          {createOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg glass-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
              >
                <button
                  onClick={() => setCreateOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition border-0 bg-transparent cursor-pointer"
                >
                  <CloseIcon className="w-4.5 h-4.5" />
                </button>

                <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2 font-space">
                  <Calendar className="w-5 h-5 text-indigo-400 animate-pulse" /> Host New Event
                </h2>
                <p className="text-xs text-gray-400 font-light mb-6">Fill details to schedule a campus meetup or virtual workshop.</p>

                <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 text-left font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Event Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annual Alumni Dinner"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="Workshop" className="bg-darkBg text-white">Workshop</option>
                        <option value="Hackathon" className="bg-darkBg text-white">Hackathon</option>
                        <option value="Alumni Meetup" className="bg-darkBg text-white">Alumni Meetup</option>
                        <option value="University Event" className="bg-darkBg text-white">University Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-mono text-indigo-300">Venue / Link</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Virtual Zoom, Audi 101"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Event Description</label>
                    <textarea
                      required
                      placeholder="Enter details of event scheduling, topics, prizes..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-655 outline-none focus:border-primary/50 h-24 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition cursor-pointer border-0"
                  >
                    {createLoading ? 'Publishing Event...' : 'Host Campus Event'}
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

export default EventsPortal;
