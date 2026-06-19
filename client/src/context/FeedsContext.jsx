import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const FeedsContext = createContext();

export const useFeeds = () => useContext(FeedsContext);

export const FeedsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await fetch(`${apiUrl}/feed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, apiUrl]);

  const createPost = async (text, media = [], pollQuestion = '', pollOptions = [], tags = []) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/feed/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, media, pollQuestion, pollOptions, tags })
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts(prev => [newPost, ...prev]);
        addToast('Post published successfully! +15 XP Awarded!', 'success');
        return newPost;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to publish post');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const likePost = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/feed/like/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => {
          if (p._id === postId) {
            const hasLiked = p.likes.includes(user._id);
            return {
              ...p,
              likes: hasLiked 
                ? p.likes.filter(id => id !== user._id)
                : [...p.likes, user._id]
            };
          }
          return p;
        }));
        addToast(data.liked ? 'Liked post! +5 XP Awarded!' : 'Unliked post', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const commentPost = async (postId, text) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/feed/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
        addToast('Comment published! +5 XP Awarded!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const votePoll = async (postId, optionId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/feed/vote/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ optionId })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
        addToast('Vote registered! +5 XP Awarded!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
      const interval = setInterval(fetchPosts, 12000);
      return () => clearInterval(interval);
    } else {
      setPosts([]);
    }
  }, [user]);

  return (
    <FeedsContext.Provider value={{
      posts,
      loading,
      createPost,
      likePost,
      commentPost,
      votePoll,
      fetchPosts
    }}>
      {children}
    </FeedsContext.Provider>
  );
};
