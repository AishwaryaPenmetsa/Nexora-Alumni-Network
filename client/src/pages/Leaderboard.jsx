import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { Trophy, Medal, Award, Flame, Star, Sparkles, BookOpen, MessageSquare, ThumbsUp } from 'lucide-react';

const Leaderboard = () => {
  const { user, apiUrl } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/directory/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [apiUrl]);

  // Determine Rank Tier based on XP
  const getTier = (xp) => {
    if (xp >= 300) return { name: 'Platinum Alumnus', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20' };
    if (xp >= 200) return { name: 'Gold Member', color: 'text-amber-400 border-amber-500/30 bg-amber-950/20' };
    if (xp >= 100) return { name: 'Silver Contributor', color: 'text-slate-300 border-slate-500/30 bg-slate-800/30' };
    return { name: 'Bronze Novice', color: 'text-amber-600 border-amber-700/30 bg-amber-950/10' };
  };

  // Find current user's rank
  const userIndex = users.findIndex(u => u._id === user?._id);
  const userRank = userIndex !== -1 ? userIndex + 1 : '--';
  const currentUserData = userIndex !== -1 ? users[userIndex] : null;

  // Next level calculator
  const userXp = currentUserData?.xp || user?.xp || 0;
  const currentLevel = currentUserData?.level || user?.level || 1;
  const xpForNextLevel = currentLevel * 100;
  const xpNeeded = xpForNextLevel - userXp;
  const levelProgressPercent = Math.min(((userXp % 100) / 100) * 100, 100);

  // Podiums
  const firstPlace = users[0];
  const secondPlace = users[1];
  const thirdPlace = users[2];
  const restUsers = users.slice(3);

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto overflow-y-auto">
        <div className="text-left">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0 flex items-center gap-2">
                <Trophy className="w-8 h-8 text-amber-400" /> NEXORA Leaderboard
              </h1>
              <p className="text-xs text-gray-400 font-light mt-1.5">
                Celebrate top active contributors, community leaders, and mentors across Aditya.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="shimmer h-[350px] rounded-2xl mb-8" />
          ) : (
            <>
              {/* Top 3 Podium Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 mb-10 mt-6">
                
                {/* 2nd Place Podium */}
                {secondPlace && (
                  <GlassCard className="border-slate-500/25 bg-slate-950/10 p-6 flex flex-col items-center justify-center text-center relative order-2 md:order-1 h-72" hoverGlow>
                    <div className="absolute top-4 left-4 bg-slate-500/20 text-slate-300 font-bold border border-slate-500/30 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono">
                      2
                    </div>
                    <div className="relative mb-3">
                      <img
                        src={secondPlace.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={secondPlace.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-400 shadow-lg"
                      />
                      <Medal className="w-5 h-5 text-slate-300 absolute -bottom-1 -right-1" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white mb-1 truncate max-w-full">{secondPlace.name}</h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{secondPlace.role}</span>
                    <div className="mt-3 flex items-center gap-1 bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-300">
                      <Flame className="w-3.5 h-3.5" /> {secondPlace.xp} XP
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded bg-slate-950/50 mt-2">
                      Level {secondPlace.level || 1}
                    </span>
                  </GlassCard>
                )}

                {/* 1st Place Podium (Featured Center) */}
                {firstPlace && (
                  <GlassCard className="border-amber-500/30 bg-gradient-to-t from-amber-950/5 via-primary/5 to-amber-950/20 p-8 flex flex-col items-center justify-center text-center relative order-1 md:order-2 h-80 shadow-2xl shadow-amber-500/5" hoverGlow>
                    <div className="absolute top-4 left-4 bg-amber-500/25 text-amber-300 font-black border border-amber-500/30 w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono shadow-glass-glow shadow-amber-500/20">
                      1
                    </div>
                    <div className="relative mb-4">
                      <img
                        src={firstPlace.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={firstPlace.name}
                        className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 shadow-2xl shadow-amber-400/20 animate-pulse"
                      />
                      <Trophy className="w-6 h-6 text-amber-400 absolute -bottom-1.5 -right-1.5" />
                    </div>
                    <h3 className="text-base font-black text-white mb-1.5 truncate max-w-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {firstPlace.name}
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{firstPlace.role}</span>
                    <div className="mt-3.5 flex items-center gap-1 bg-amber-950/40 border border-amber-500/25 px-4 py-1.5 rounded-full text-sm font-mono font-bold text-amber-300 shadow-md">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-500" /> {firstPlace.xp} XP
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded bg-amber-950/50 mt-2.5">
                      Level {firstPlace.level || 1}
                    </span>
                  </GlassCard>
                )}

                {/* 3rd Place Podium */}
                {thirdPlace && (
                  <GlassCard className="border-amber-700/25 bg-amber-950/5 p-6 flex flex-col items-center justify-center text-center relative order-3 h-64" hoverGlow>
                    <div className="absolute top-4 left-4 bg-amber-700/20 text-amber-600 font-bold border border-amber-700/20 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono">
                      3
                    </div>
                    <div className="relative mb-3">
                      <img
                        src={thirdPlace.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={thirdPlace.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-700 shadow-lg"
                      />
                      <Medal className="w-4 h-4 text-amber-700 absolute -bottom-1 -right-1" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white mb-1 truncate max-w-full">{thirdPlace.name}</h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{thirdPlace.role}</span>
                    <div className="mt-3 flex items-center gap-1 bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-600">
                      <Flame className="w-3.5 h-3.5" /> {thirdPlace.xp} XP
                    </div>
                    <span className="text-[9px] font-mono text-amber-700/80 border border-amber-700/20 px-2 py-0.5 rounded bg-amber-950/30 mt-2">
                      Level {thirdPlace.level || 1}
                    </span>
                  </GlassCard>
                )}
              </div>

              {/* Grid: Lower Standings + Current User Status Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Ranking Table List */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <h3 className="text-base font-bold text-white mb-1.5 uppercase tracking-wider font-mono">
                    Global Standings
                  </h3>
                  
                  <div className="flex flex-col gap-2.5">
                    {restUsers.map((item, idx) => {
                      const rank = idx + 4;
                      const tier = getTier(item.xp);

                      return (
                        <div
                          key={item._id}
                          className={`flex items-center gap-4 p-3.5 rounded-2xl border bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5 transition`}
                        >
                          {/* Rank */}
                          <span className="w-6 text-center text-xs font-mono font-bold text-gray-500">
                            #{rank}
                          </span>

                          {/* Avatar */}
                          <img
                            src={item.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                            alt={item.name}
                            className="w-9 h-9 rounded-xl object-cover border border-primary/20 flex-shrink-0"
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-extrabold text-white truncate">{item.name}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[8px] font-mono uppercase text-gray-500 font-medium">
                                {item.role}
                              </span>
                              <span className={`text-[8px] font-mono border px-1.5 py-0.2 rounded font-medium ${tier.color}`}>
                                {tier.name}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-right flex-shrink-0 font-mono">
                            <div className="text-xs font-bold text-white flex items-center gap-0.5 justify-end">
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.xp} <span className="text-[10px] text-gray-500">XP</span>
                            </div>
                            <span className="text-[8px] text-gray-600 block">Lvl {item.level || 1}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Current User Widget & Rewards Map */}
                <div className="flex flex-col gap-6">
                  
                  {/* Your Status */}
                  <GlassCard className="border-indigo-500/20 p-5" hoverGlow={false}>
                    <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest">
                      YOUR PROFILE PROGRESS
                    </span>
                    
                    <div className="flex items-center gap-3 mt-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                          alt={user?.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-primary/20"
                        />
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded-full border border-darkBg shadow">
                          Lvl {currentLevel}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-white truncate">{user?.name}</h4>
                        <div className="flex gap-1 items-center mt-0.5">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">{user?.role}</span>
                          <span className="text-gray-700 font-mono text-[9px]">•</span>
                          <span className={`text-[8px] font-mono border px-1.5 py-0.2 rounded font-medium ${getTier(userXp).color}`}>
                            {getTier(userXp).name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar to next level */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1">
                        <span>Level Progress</span>
                        <span>{userXp % 100} / 100 XP</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${levelProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-4 font-mono text-[10px] text-gray-400 flex items-center justify-between">
                      <span>Global Leaderboard Rank:</span>
                      <span className="text-white font-bold font-mono text-xs">Rank #{userRank}</span>
                    </div>

                    <p className="text-[10px] text-gray-500 font-light mt-3 leading-relaxed">
                      🔥 You need <span className="text-indigo-400 font-bold font-mono">{xpNeeded} XP</span> to advance to Level {currentLevel + 1}!
                    </p>
                  </GlassCard>

                  {/* Rewards Criteria Guide */}
                  <GlassCard className="border-white/5 p-5 text-xs">
                    <h4 className="text-xs font-extrabold text-white mb-3 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> How to Earn XP
                    </h4>
                    <p className="text-gray-500 font-light leading-relaxed mb-4">
                      Help your peers, share opportunities, and participate actively to earn XP.
                    </p>

                    <div className="flex flex-col gap-3">
                      {[
                        { title: 'Publish Feed Update', icon: Flame, xp: '+15 XP' },
                        { title: 'Post Technical Query', icon: BookOpen, xp: '+20 XP' },
                        { title: 'Answer Forum Thread', icon: MessageSquare, xp: '+15 XP' },
                        { title: 'Like / Upvote Posts', icon: ThumbsUp, xp: '+5 XP' },
                        { title: 'Answer Marked Best Answer', icon: Star, xp: '+25 XP' }
                      ].map((task, index) => {
                        const Icon = task.icon;
                        return (
                          <div key={index} className="flex items-center justify-between font-mono">
                            <span className="text-gray-300 flex items-center gap-1.5 text-[10px]">
                              <Icon className="w-3.5 h-3.5 text-indigo-400" /> {task.title}
                            </span>
                            <span className="text-emerald-400 font-bold text-[10px]">{task.xp}</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
