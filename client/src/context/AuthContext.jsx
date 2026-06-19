import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchCurrentUser = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setProfile(data.profile);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Simulate OTP flow for login
      setPendingUser(data);
      setOtpSent(true);
      setLoading(false);
      return { otpRequired: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Simulate OTP flow for register
      setPendingUser(data);
      setOtpSent(true);
      setLoading(false);
      return { otpRequired: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const verifyOtp = async (code) => {
    setLoading(true);
    // Hardcoded mock OTP for testing convenience
    if (code === '123456' || code === '000000') {
      const userData = pendingUser;
      localStorage.setItem('token', userData.token);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isApproved: userData.isApproved
      });
      setOtpSent(false);
      setPendingUser(null);
      await fetchCurrentUser(userData.token);
      return true;
    } else {
      setLoading(false);
      throw new Error('Invalid verification OTP code. Use code "123456" for demo review.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setOtpSent(false);
    setPendingUser(null);
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        return data;
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const toggleMentorStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/auth/mentor-toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, isMentor: data.isMentor }));
        return data.isMentor;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      error,
      otpSent,
      login,
      register,
      verifyOtp,
      logout,
      updateProfile,
      toggleMentorStatus,
      apiUrl: API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};
