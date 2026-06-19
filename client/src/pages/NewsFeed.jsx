import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeeds } from '../context/FeedsContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import {
  Heart,
  MessageCircle,
  Share2,
  Image,
  BarChart2,
  Tag,
  Plus,
  Trash,
  Send,
  User,
  Sparkles,
  Search,
  X as CloseIcon
} from 'lucide-react';

const NewsFeed = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, likePost, commentPost, votePoll } = useFeeds();

  // Create post panel toggles & states
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);

  // Poll states
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Tags states
  const [tagsInput, setTagsInput] = useState('');
  const [showTagsInput, setShowTagsInput] = useState(false);

  // Filter state
  const [feedFilterTag, setFeedFilterTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand comments tracking state: holds list of postIds that are expanded
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Filter valid media URL
    const media = mediaUrl.trim() ? [mediaUrl.trim()] : [];

    // Filter valid poll options
    let opts = [];
    if (showPollBuilder && pollQuestion.trim()) {
      opts = pollOptions.map(o => o.trim()).filter(o => o.length > 0);
    }

    // Filter valid tags
    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const success = await createPost(
      text,
      media,
      showPollBuilder ? pollQuestion.trim() : '',
      showPollBuilder ? opts : [],
      tagsArr
    );

    if (success) {
      setText('');
      setMediaUrl('');
      setPollQuestion('');
      setPollOptions(['', '']);
      setTagsInput('');
      setShowMediaInput(false);
      setShowPollBuilder(false);
      setShowTagsInput(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    await commentPost(postId, commentText);
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const handleCommentInputChange = (postId, val) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: val
    }));
  };

  // Filter posts based on tags and search
  const filteredPosts = posts.filter(post => {
    const matchesTag = feedFilterTag ? post.tags?.includes(feedFilterTag) : true;
    const matchesSearch = searchQuery
      ? post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto overflow-y-auto">
        <div className="text-left">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">NEXORA Feed</h1>
            <p className="text-xs text-gray-400 font-light mt-1.5 font-sans">
              Share career updates, industry milestones, and poll opinions with your college network.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search feed posts or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50"
            />
          </div>

          {/* Filter Tag Display */}
          {feedFilterTag && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono bg-indigo-500/10 border border-primary/20 text-indigo-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                Filter: #{feedFilterTag}
                <button onClick={() => setFeedFilterTag('')} className="hover:text-white">
                  <CloseIcon className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Create Post Card */}
          <GlassCard className="border-primary/10 p-5 mb-8" hoverGlow={false}>
            <form onSubmit={handleCreatePostSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <img
                  src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-xl object-cover border border-primary/20 flex-shrink-0"
                />
                <textarea
                  required
                  placeholder="What's happening in your tech career, Aditya?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none resize-none pt-2 h-20"
                />
              </div>

              {/* Media input field */}
              {showMediaInput && (
                <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                  <label className="text-[10px] uppercase font-mono text-indigo-300">Add Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-example..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                  />
                </div>
              )}

              {/* Poll builder panel */}
              {showPollBuilder && (
                <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Poll Question</label>
                    <input
                      type="text"
                      placeholder="e.g. Which design library do you prefer?"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-mono text-indigo-300">Poll Options</label>
                    {pollOptions.map((opt, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          required
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOption(idx)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddPollOption}
                        className="self-start text-[10px] font-mono text-indigo-400 hover:text-white flex items-center gap-1 mt-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Option
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tags input field */}
              {showTagsInput && (
                <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                  <label className="text-[10px] uppercase font-mono text-indigo-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="SiliconValley, WebDev, Placement"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                  />
                </div>
              )}

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaInput(!showMediaInput)}
                    className={`p-2 rounded-lg border flex items-center justify-center transition ${
                      showMediaInput
                        ? 'bg-indigo-500/15 border-primary/30 text-indigo-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Add image"
                  >
                    <Image className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPollBuilder(!showPollBuilder)}
                    className={`p-2 rounded-lg border flex items-center justify-center transition ${
                      showPollBuilder
                        ? 'bg-indigo-500/15 border-primary/30 text-indigo-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Create poll"
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTagsInput(!showTagsInput)}
                    className={`p-2 rounded-lg border flex items-center justify-center transition ${
                      showTagsInput
                        ? 'bg-indigo-500/15 border-primary/30 text-indigo-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Add tags"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:brightness-110 shadow-glass-glow shadow-primary/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Publish Update (+15 XP)
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Posts Feed Stream List */}
          {loading ? (
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer h-48 rounded-2xl" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <GlassCard className="py-16 text-center text-gray-500 text-xs">
              No recent updates matching your preferences. Start publishing feed logs!
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredPosts.map((post) => {
                const totalPollVotes = post.poll?.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0) || 0;
                const hasLiked = post.likes?.includes(user?._id);
                const isExpanded = expandedComments[post._id];

                return (
                  <GlassCard key={post._id} className="border-white/5 p-6" hoverGlow>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={post.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={post.author?.name}
                        className="w-10 h-10 rounded-xl object-cover border border-primary/20 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{post.author?.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-indigo-400 capitalize px-2 py-0.5 rounded-full bg-indigo-950/40 border border-primary/10">
                            {post.author?.role}
                          </span>
                          {post.author?.xp !== undefined && (
                            <span className="text-[9px] font-mono text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/20 border border-amber-500/10">
                              Lvl {post.author?.level || 1}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 ml-auto">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Text Body */}
                    <p className="text-xs text-gray-300 font-light leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.text}
                    </p>

                    {/* Media Image Preview */}
                    {post.media && post.media.length > 0 && (
                      <div className="w-full rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-inner max-h-96">
                        <img
                          src={post.media[0]}
                          alt="Feed media preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Interactive Poll component */}
                    {post.poll && post.poll.question && (
                      <div className="glass-card p-4 rounded-xl border border-primary/10 mb-4 bg-primary/2 flex flex-col gap-3">
                        <span className="text-[9px] font-bold font-mono text-indigo-300 uppercase tracking-wide">
                          NEXORA POLL
                        </span>
                        <h5 className="text-xs font-bold text-white leading-snug">
                          {post.poll.question}
                        </h5>

                        <div className="flex flex-col gap-2.5">
                          {post.poll.options.map((opt) => {
                            const optionVotes = opt.votes?.length || 0;
                            const votePercent = totalPollVotes > 0 ? Math.round((optionVotes / totalPollVotes) * 100) : 0;
                            const userHasVoted = opt.votes?.includes(user?._id);

                            return (
                              <button
                                key={opt._id}
                                onClick={() => votePoll(post._id, opt._id)}
                                className={`w-full relative py-3 px-4 rounded-xl border text-left overflow-hidden group transition ${
                                  userHasVoted
                                    ? 'bg-primary/10 border-primary/45 text-white'
                                    : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                                }`}
                              >
                                {/* Percentage bar backing */}
                                <div
                                  className="absolute top-0 left-0 bottom-0 bg-primary/15 transition-all duration-500"
                                  style={{ width: `${votePercent}%` }}
                                />

                                <div className="relative flex justify-between items-center text-xs">
                                  <span className="font-medium">{opt.text}</span>
                                  <span className="font-mono text-[10px] text-indigo-300 font-semibold">
                                    {votePercent}% ({optionVotes})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <span className="text-[10px] text-gray-500 font-mono self-end">
                          Total votes: {totalPollVotes}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => setFeedFilterTag(tag)}
                            className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 border border-primary/10 px-2 py-0.5 rounded transition"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Bottom Counters & Actions bar */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono text-gray-500">
                      <div className="flex gap-6">
                        <button
                          onClick={() => likePost(post._id)}
                          className={`flex items-center gap-1.5 transition ${
                            hasLiked ? 'text-rose-400' : 'hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{post.likes?.length || 0}</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post._id)}
                          className={`flex items-center gap-1.5 hover:text-white transition ${
                            isExpanded ? 'text-indigo-400' : ''
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments?.length || 0} Comments</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/dashboard`);
                          alert('Link copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 hover:text-white transition"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comments expanded section */}
                    {isExpanded && (
                      <div className="border-t border-white/5 mt-4 pt-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Comments List */}
                        <div className="flex flex-col gap-3">
                          {post.comments?.length === 0 ? (
                            <p className="text-[10px] text-gray-600 text-center py-2">No comments posted yet.</p>
                          ) : (
                            post.comments.map((comment, index) => (
                              <div key={index} className="flex gap-2 items-start text-xs">
                                <img
                                  src={comment.author?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                                  alt={comment.author?.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-primary/20 flex-shrink-0"
                                />
                                <div className="flex-1 bg-white/2 rounded-xl p-2.5 border border-white/5">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-semibold text-white text-[10px]">{comment.author?.name}</span>
                                    <span className="text-[8px] font-mono text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 font-light leading-relaxed text-[11px] whitespace-pre-wrap">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input Form */}
                        <form
                          onSubmit={(e) => handleCommentSubmit(e, post._id)}
                          className="flex gap-2 items-center"
                        >
                          <input
                            type="text"
                            placeholder="Add a comment to this update..."
                            value={commentInputs[post._id] || ''}
                            onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                          />
                          <button
                            type="submit"
                            className="p-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-white transition shadow-glass-glow flex-shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewsFeed;
