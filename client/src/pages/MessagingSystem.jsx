import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useChat } from '../context/ChatContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { MessageSquare, Send, User, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessagingSystem = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const { 
    conversations, 
    messages, 
    activePartner, 
    isTyping, 
    setActivePartner, 
    sendMessage 
  } = useChat();

  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner) return;

    try {
      await sendMessage(activePartner._id, text.trim());
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const selectConversation = (partner) => {
    setActivePartner(partner);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-hidden h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6 text-left z-10 relative">
        <div className="absolute top-24 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        {/* Left Side: Conversations list */}
        <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden">
          <h2 className="text-2xl font-extrabold text-white m-0 font-space">Conversations</h2>
          
          <GlassCard className="border-white/5 flex-1 p-2.5 flex flex-col gap-2 overflow-y-auto" hoverGlow={false}>
            {conversations.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-12 font-light">No chat threads found.</p>
            ) : (
              conversations.map((conv) => {
                const partner = conv.user;
                const isSelected = activePartner?._id === partner._id;
                return (
                  <motion.div
                    key={partner._id}
                    onClick={() => selectConversation(partner)}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border font-sans ${
                      isSelected 
                        ? 'bg-gradient-to-r from-primary/15 to-secondary/15 border-primary/45 text-white shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={partner.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-darkBg rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold truncate text-white m-0 font-space">{partner.name}</h4>
                        <span className="text-[8px] font-mono text-gray-550">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate m-0 font-light leading-relaxed">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unread && (
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0 animate-ping" />
                    )}
                  </motion.div>
                );
              })
            )}
          </GlassCard>
        </div>

        {/* Right Side: Conversation Dialogue Box */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {activePartner ? (
            <GlassCard className="border-white/5 flex-1 p-0 flex flex-col overflow-hidden h-full" hoverGlow={false}>
              {/* Dialogue Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/3 font-sans">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activePartner.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt={activePartner.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-darkBg rounded-full" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white m-0 font-space">{activePartner.name}</h3>
                    <span className="text-[9px] text-indigo-300 font-mono capitalize tracking-wider">
                      {activePartner.role} Advisor
                    </span>
                  </div>
                </div>

                <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition border-0 bg-transparent cursor-pointer">
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Message streams */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-sans">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-20 font-light">No messages exchanged yet. Say hello!</p>
                ) : (
                  messages.map((msg) => {
                    const isMyMsg = msg.sender._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex gap-3 max-w-[80%] ${isMyMsg ? 'self-end flex-row-reverse' : 'self-start'}`}
                      >
                        {!isMyMsg && (
                          <img
                            src={msg.sender.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                            alt={msg.sender.name}
                            className="w-7 h-7 rounded-full object-cover border border-white/5 mt-0.5"
                          />
                        )}
                        <div>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs leading-normal ${
                              isMyMsg
                                ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow'
                                : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-gray-500 font-mono mt-1 block text-right">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Mock Typing Indicator bubble */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[80%] self-start">
                    <img
                      src={activePartner.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt="Typing..."
                      className="w-7 h-7 rounded-full object-cover border border-white/5"
                    />
                    <div className="bg-white/5 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input panel */}
              <form onSubmit={handleSend} className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center gap-3 font-sans">
                <button type="button" className="p-2 rounded-xl text-gray-550 hover:text-white transition border-0 bg-transparent cursor-pointer">
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-primary/50"
                />

                <button type="button" className="p-2 rounded-xl text-gray-550 hover:text-white transition border-0 bg-transparent cursor-pointer">
                  <Smile className="w-4.5 h-4.5" />
                </button>

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-white transition flex-shrink-0 cursor-pointer border-0 shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          ) : (
            <GlassCard className="border-white/5 flex-1 flex flex-col items-center justify-center text-center p-12" hoverGlow={false}>
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-primary/20 text-indigo-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 font-space">Select a Conversation</h3>
              <p className="text-xs text-gray-400 font-light max-w-xs leading-relaxed">
                Click a cohort peer on the sidebar thread to start exchanging instant job descriptions, interview notes, or recommendations.
              </p>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagingSystem;
