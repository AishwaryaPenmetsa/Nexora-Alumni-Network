import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForum } from '../context/ForumContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import {
  Search,
  MessageSquare,
  ThumbsUp,
  Check,
  Pin,
  PlusCircle,
  Sparkles,
  BookOpen,
  Award,
  Clock,
  ArrowLeft,
  X as CloseIcon,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Forum = () => {
  const { user } = useAuth();
  const { questions, loading, createQuestion, likeQuestion, answerQuestion, pinAnswer } = useForum();

  // State controls
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);

  // Filter list
  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? q.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Get unique tags across all questions
  const allTags = Array.from(new Set(questions.flatMap(q => q.tags || [])));

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitLoading(true);
    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const success = await createQuestion(title, body, tagsArr);
    setSubmitLoading(false);

    if (success) {
      setTitle('');
      setBody('');
      setTagsInput('');
      setCreateOpen(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedQuestion) return;

    setAnswerLoading(true);
    const updated = await answerQuestion(selectedQuestion._id, answerText);
    setAnswerLoading(false);

    if (updated) {
      setAnswerText('');
      setSelectedQuestion(updated);
    }
  };

  const handlePinToggle = async (answerId) => {
    if (!selectedQuestion) return;
    const updated = await pinAnswer(selectedQuestion._id, answerId);
    if (updated) {
      setSelectedQuestion(updated);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto z-10 relative font-sans">
        <div className="absolute top-24 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        {selectedQuestion ? (
          <div className="text-left animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedQuestion(null)}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-mono text-xs mb-6 transition border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO DISCUSSION FEED
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <GlassCard className="border-indigo-500/10 p-6" hoverGlow={false}>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedQuestion.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt={selectedQuestion.author?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-primary/20"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white font-space">{selectedQuestion.author?.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                        <span className="text-[10px] text-indigo-400 capitalize px-2 py-0.5 rounded-full bg-indigo-950/40 border border-primary/10">
                          {selectedQuestion.author?.role}
                        </span>
                        {selectedQuestion.author?.xp !== undefined && (
                          <span className="text-[9px] text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/20 border border-amber-500/10">
                            Lvl {selectedQuestion.author?.level || 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h1 className="text-xl md:text-2xl font-extrabold text-white leading-snug mb-3 font-space">
                    {selectedQuestion.title}
                  </h1>

                  <p className="text-sm text-gray-300 font-light leading-relaxed whitespace-pre-wrap mb-6">
                    {selectedQuestion.body}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedQuestion.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-medium bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono text-gray-500">
                    <button
                      onClick={() => likeQuestion(selectedQuestion._id)}
                      className={`flex items-center gap-1.5 transition border-0 bg-transparent cursor-pointer ${
                        selectedQuestion.likes?.includes(user?._id)
                          ? 'text-cyan-400'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{selectedQuestion.likes?.length || 0} Upvotes</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(selectedQuestion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </GlassCard>

                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-space">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Responses ({selectedQuestion.answers?.length || 0})
                </h3>

                <div className="flex flex-col gap-4">
                  {selectedQuestion.answers?.length === 0 ? (
                    <GlassCard className="py-10 text-center text-gray-500 text-xs border-white/5">
                      No responses posted yet. Be the first to share your insights!
                    </GlassCard>
                  ) : (
                    [...selectedQuestion.answers]
                      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                      .map((ans) => {
                        const isQuestionAuthor = selectedQuestion.author?._id === user?._id;

                        return (
                          <div
                            key={ans._id}
                            className={`glass-card rounded-2xl border transition-all p-5 relative overflow-hidden ${
                              ans.isPinned
                                ? 'border-emerald-500/30 bg-emerald-950/5 shadow-emerald-500/5'
                                : 'border-white/5'
                            }`}
                          >
                            {ans.isPinned && (
                              <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 border-l border-b border-emerald-500/30 px-3 py-1 text-[9px] font-bold font-mono tracking-wider rounded-bl-xl flex items-center gap-1">
                                <Check className="w-3 h-3" /> BEST ANSWER
                              </div>
                            )}

                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={ans.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                                alt={ans.author?.name}
                                className="w-8 h-8 rounded-lg object-cover border border-primary/20"
                              />
                              <div>
                                <h5 className="text-xs font-semibold text-white font-space">{ans.author?.name}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                                  <span className="text-[9px] text-indigo-400 capitalize px-2 py-0.2 border border-primary/10 rounded-full bg-indigo-950/40">
                                    {ans.author?.role}
                                  </span>
                                  {ans.author?.xp !== undefined && (
                                    <span className="text-[9px] text-amber-400 px-2 py-0.2 border border-amber-500/10 rounded-full bg-amber-950/20">
                                      Lvl {ans.author?.level || 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-gray-300 font-light leading-relaxed mb-4 whitespace-pre-wrap">
                              {ans.text}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                              <span className="text-[10px] text-gray-500 font-mono">
                                Published {new Date(ans.createdAt).toLocaleDateString()}
                              </span>

                              {isQuestionAuthor && (
                                <button
                                  onClick={() => handlePinToggle(ans._id)}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                                    ans.isPinned
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                  }`}
                                >
                                  <Pin className="w-3 h-3" />
                                  {ans.isPinned ? 'Unpin Best Answer' : 'Mark as Best Answer'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                <GlassCard className="p-5 border-white/5">
                  <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-1.5 font-space">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" /> Share Your Response
                  </h4>
                  <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3">
                    <textarea
                      required
                      placeholder="Write your explanation or instructions here. Use formatting as needed..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-655 outline-none focus:border-primary/50 h-28 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={answerLoading}
                      className="self-end px-5 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition shadow-glass-glow border-0 cursor-pointer"
                    >
                      {answerLoading ? 'Publishing...' : 'Submit Response'}
                    </button>
                  </form>
                </GlassCard>
              </div>

              <div className="flex flex-col gap-6">
                <GlassCard className="border-indigo-500/10 p-5 text-xs">
                  <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5 uppercase font-mono">
                    <Award className="w-4.5 h-4.5 text-amber-400 fill-amber-500/15" /> Gamification XP Rewards
                  </h4>
                  <p className="text-gray-500 font-light leading-relaxed mb-4">
                    Earn XP points for contributing to technical queries and discussions. Accumulating XP unlocks badges and increases platform search rankings!
                  </p>
                  <ul className="flex flex-col gap-2.5 font-mono text-left list-none pl-0">
                    <li className="flex justify-between items-center text-gray-300">
                      <span>Detailed Query:</span>
                      <span className="text-emerald-400 font-bold font-mono">+20 XP</span>
                    </li>
                    <li className="flex justify-between items-center text-gray-300">
                      <span>Post Answer:</span>
                      <span className="text-emerald-400 font-bold font-mono">+15 XP</span>
                    </li>
                    <li className="flex justify-between items-center text-gray-300">
                      <span>Likes on Query:</span>
                      <span className="text-emerald-400 font-bold font-mono">+5 XP</span>
                    </li>
                    <li className="flex justify-between items-center text-gray-300 font-semibold border-t border-white/5 pt-2">
                      <span className="text-indigo-300 flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned Best Answer:
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">+25 XP</span>
                    </li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-left animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-white m-0 font-space">NEXORA Forums</h1>
                <p className="text-xs text-gray-400 font-light mt-1.5">
                  Engage in technical and career discussions, Q&A boards, and project queries.
                </p>
              </div>

              <button
                onClick={() => setCreateOpen(true)}
                className="px-5 py-3 rounded-xl bg-primary hover:bg-indigo-600 text-xs font-semibold text-white transition-all flex items-center gap-1.5 self-start shadow-glass-glow shadow-primary/15 border-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Ask a Question
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search discussions by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="relative">
                <Tag className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-primary/50 appearance-none cursor-pointer capitalize transition-colors"
                >
                  <option value="" className="bg-darkBg text-white">All Tags / Categories</option>
                  {allTags.map((tag, idx) => (
                    <option key={idx} value={tag} className="bg-darkBg text-white">#{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedTag && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-mono bg-indigo-500/10 border border-primary/20 text-indigo-300 px-3 py-1 rounded-full flex items-center gap-1">
                  Filter: #{selectedTag}
                  <button onClick={() => setSelectedTag('')} className="hover:text-white border-0 bg-transparent cursor-pointer p-0 flex items-center">
                    <CloseIcon className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="shimmer h-36 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredQuestions.length === 0 ? (
              <GlassCard className="py-20 text-center border-white/5">
                <p className="text-sm text-gray-500 font-light">No active discussions matching your parameters. Be the first to ask!</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredQuestions.map((q) => {
                  const hasPinned = q.answers?.some(a => a.isPinned);

                  return (
                    <GlassCard
                      key={q._id}
                      className={`glass-card-hover border-white/5 text-left p-5 cursor-pointer ${
                        hasPinned ? 'border-emerald-500/10 bg-emerald-950/2' : ''
                      }`}
                      onClick={() => setSelectedQuestion(q)}
                      hoverGlow
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={q.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                          alt={q.author?.name}
                          className="w-10 h-10 rounded-xl object-cover border border-primary/20 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1.5">
                            <span className="text-[10px] text-gray-500 font-mono">
                              By {q.author?.name || 'Deleted User'} • Lvl {q.author?.level || 1}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-white m-0 mb-1.5 leading-snug hover:text-indigo-400 transition truncate font-space">
                            {q.title}
                          </h3>

                          <p className="text-xs text-gray-400 font-light leading-relaxed mb-3 line-clamp-2">
                            {q.body}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-3">
                            <div className="flex gap-2">
                              {q.tags?.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-500"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {q.likes?.length || 0} Upvotes
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                                {q.answers?.length || 0} Replies
                              </span>
                              {hasPinned && (
                                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-[8px]">
                                  <Check className="w-2.5 h-2.5" /> Solved
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Ask a Question Modal Dialog */}
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
                  <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" /> Ask a Technical Question
                </h2>
                <p className="text-xs text-gray-400 font-light mb-6">
                  Post detailed inquiries. Getting correct answers pins them for massive XP bonuses.
                </p>

                <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Topic Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Best architecture for a real-time multiplayer board game?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Description Body</label>
                    <textarea
                      required
                      placeholder="Describe your issue, post code snippets, and outline steps to reproduce..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-650 outline-none focus:border-primary/50 h-32 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Tags / Categories (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Web3, NextJS, ServerSecurity"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-655 outline-none focus:border-primary/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:brightness-110 shadow-glass-glow transition border-0 cursor-pointer"
                  >
                    {submitLoading ? 'Publishing...' : 'Ask Community (+20 XP)'}
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

export default Forum;
