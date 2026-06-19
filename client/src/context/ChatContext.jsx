import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await fetch(`${apiUrl}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user, apiUrl]);

  const fetchMessageHistory = useCallback(async (partnerId) => {
    const token = localStorage.getItem('token');
    if (!token || !user || !partnerId) return;

    try {
      const res = await fetch(`${apiUrl}/messages/history/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user, apiUrl]);

  const sendMessage = async (recipientId, text) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId, text })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        fetchConversations();
        return newMsg;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      addToast('Error sending message', 'error');
    }
  };

  // Poll conversations list when logged in
  useEffect(() => {
    if (user) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    } else {
      setConversations([]);
      setActivePartner(null);
      setMessages([]);
    }
  }, [user]);

  // Poll current chat log if activePartner is set
  useEffect(() => {
    if (user && activePartner) {
      fetchMessageHistory(activePartner._id);
      const interval = setInterval(() => {
        fetchMessageHistory(activePartner._id);
      }, 4000);

      // Simulate typing indicator briefly when opening a new chat
      setIsTyping(true);
      const typingTimeout = setTimeout(() => setIsTyping(false), 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(typingTimeout);
      };
    } else {
      setMessages([]);
    }
  }, [user, activePartner]);

  return (
    <ChatContext.Provider value={{
      conversations,
      messages,
      activePartner,
      isTyping,
      setActivePartner,
      sendMessage,
      fetchConversations,
      fetchMessageHistory
    }}>
      {children}
    </ChatContext.Provider>
  );
};
