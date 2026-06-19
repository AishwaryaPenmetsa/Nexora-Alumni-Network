import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

export const ForumProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const fetchQuestions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await fetch(`${apiUrl}/forum`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, apiUrl]);

  const createQuestion = async (title, body, tags = []) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/forum/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body, tags })
      });
      if (res.ok) {
        const newQuestion = await res.json();
        setQuestions(prev => [newQuestion, ...prev]);
        addToast('Discussion thread created successfully! +20 XP Awarded!', 'success');
        return newQuestion;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create question');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const likeQuestion = async (questionId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/forum/like/${questionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(prev => prev.map(q => {
          if (q._id === questionId) {
            const hasLiked = q.likes.includes(user._id);
            return {
              ...q,
              likes: hasLiked
                ? q.likes.filter(id => id !== user._id)
                : [...q.likes, user._id]
            };
          }
          return q;
        }));
        addToast(data.liked ? 'Upvoted question! +5 XP Awarded to author!' : 'Removed upvote', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const answerQuestion = async (questionId, text) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/forum/answer/${questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const updatedQuestion = await res.json();
        setQuestions(prev => prev.map(q => q._id === questionId ? updatedQuestion : q));
        addToast('Response posted! +15 XP Awarded!', 'success');
        return updatedQuestion;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit response');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const pinAnswer = async (questionId, answerId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/forum/pin/${questionId}/${answerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const updatedQuestion = await res.json();
        setQuestions(prev => prev.map(q => q._id === questionId ? updatedQuestion : q));
        const pinnedAnswer = updatedQuestion.answers.find(a => a._id === answerId);
        addToast(pinnedAnswer?.isPinned ? 'Pin set as Best Answer! +25 XP to helper!' : 'Best answer unpinned', 'success');
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to toggle pin state');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuestions();
      const interval = setInterval(fetchQuestions, 12000);
      return () => clearInterval(interval);
    } else {
      setQuestions([]);
    }
  }, [user]);

  return (
    <ForumContext.Provider value={{
      questions,
      loading,
      createQuestion,
      likeQuestion,
      answerQuestion,
      pinAnswer,
      fetchQuestions
    }}>
      {children}
    </ForumContext.Provider>
  );
};
