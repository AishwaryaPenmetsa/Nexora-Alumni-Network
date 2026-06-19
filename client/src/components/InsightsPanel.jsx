import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Briefcase, Users, Calendar } from 'lucide-react';

/**
 * InsightsPanel – Right‑side panel showing trending discussions,
 * latest jobs, suggested mentors, upcoming events, and career insights.
 * Data is mocked for now; replace with real API calls when available.
 */
const InsightsPanel = () => {
  const [insights, setInsights] = useState({
    discussions: [],
    jobs: [],
    mentors: [],
    events: [],
    career: []
  });

  // Mock data loading
  useEffect(() => {
    // In a real app, fetch from APIs here.
    const mock = {
      discussions: [
        { id: 1, title: 'AI in Education', replies: 12 },
        { id: 2, title: 'Remote Internship Tips', replies: 8 }
      ],
      jobs: [
        { id: 1, title: 'Frontend Engineer', company: 'TechCorp' },
        { id: 2, title: 'Data Analyst', company: 'DataCo' }
      ],
      mentors: [
        { id: 1, name: 'Dr. Maya Patel', field: 'Product Management' },
        { id: 2, name: 'Arjun Singh', field: 'Machine Learning' }
      ],
      events: [
        { id: 1, name: 'Hackathon 2026', date: 'Oct 12' },
        { id: 2, name: 'Career Fair', date: 'Nov 5' }
      ],
      career: [
        { id: 1, tip: 'Optimize your LinkedIn headline' },
        { id: 2, tip: 'Showcase project impact with numbers' }
      ]
    };
    setInsights(mock);
  }, []);

  const cardClass = 'glass-card p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-indigo-500/20 transition-all duration-300';

  return (
    <aside className="hidden xl:block xl:w-80 xl:ml-4 fixed right-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto z-20">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Trending Discussions */}
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Trending Discussions
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {insights.discussions.map(d => (
              <li key={d.id} className="flex justify-between">
                <span>{d.title}</span>
                <span className="text-indigo-400">{d.replies} repl.</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Latest Jobs */}
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
            <Briefcase className="w-4 h-4 text-cyan-400" /> Latest Jobs
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {insights.jobs.map(j => (
              <li key={j.id} className="flex justify-between">
                <span>{j.title}</span>
                <span className="text-cyan-400">{j.company}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Suggested Mentors */}
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
            <Users className="w-4 h-4 text-emerald-400" /> Suggested Mentors
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {insights.mentors.map(m => (
              <li key={m.id}>
                <span className="font-medium">{m.name}</span> – {m.field}
              </li>
            ))}
          </ul>
        </div>
        {/* Upcoming Events */}
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
            <Calendar className="w-4 h-4 text-amber-400" /> Upcoming Events
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {insights.events.map(e => (
              <li key={e.id} className="flex justify-between">
                <span>{e.name}</span>
                <span className="text-amber-400">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Career Insights */}
        <div className={cardClass}>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" /> Career Insights
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {insights.career.map(c => (
              <li key={c.id}>• {c.tip}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </aside>
  );
};

export default InsightsPanel;
