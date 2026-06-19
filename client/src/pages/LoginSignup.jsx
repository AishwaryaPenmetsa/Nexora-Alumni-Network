import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff, KeyRound, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student'); // student / alumni
  const [forgotMode, setForgotMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const { login, register, verifyOtp, otpSent, error: authError, loading } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token && !otpSent) {
      navigate('/dashboard');
    }
  }, [token, otpSent]);

  // Password strength meter calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', width: '0%', color: 'bg-gray-700' };
    if (password.length < 5) return { label: 'Weak', width: '30%', color: 'bg-danger' };
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (password.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { label: 'Strong', width: '100%', color: 'bg-success' };
    }
    return { label: 'Medium', width: '65%', color: 'bg-amber-500' };
  };

  const passStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (forgotMode) {
        addToast('Mock password reset email sent successfully! Use standard login to continue.', 'success');
        setForgotMode(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
        addToast('Verification code sent! Enter OTP: 123456', 'info');
      } else {
        await register(name, email, password, role);
        addToast('Verification code sent! Enter OTP: 123456', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const verified = await verifyOtp(otpCode);
      if (verified) {
        addToast('Access verified! Welcome to the platform.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div
              key="auth-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="border border-primary/20 relative" hoverGlow>
                {/* Header Title */}
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-primary/20 text-indigo-400 mb-3 animate-pulse">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white m-0">
                    {forgotMode ? 'Recover Password' : isLogin ? 'Sign In Network' : 'Create Account'}
                  </h2>
                  <p className="text-xs text-gray-400 font-light mt-1.5">
                    {forgotMode 
                      ? 'Enter your email address to receive reset details'
                      : isLogin 
                        ? 'Welcome back! Sign in to connect with your cohort' 
                        : 'Sign up to gain directory, job, and mentor access'}
                  </p>
                </div>

                {/* Main Auth Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  {/* Name field (Signup only) */}
                  {!isLogin && !forgotMode && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 font-mono">Full Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 w-4.5 h-4.5 text-gray-500" />
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 font-mono">University Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4.5 h-4.5 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="jane.doe@nexora.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition"
                      />
                    </div>
                  </div>

                  {/* Password field (Login / Signup only) */}
                  {!forgotMode && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 font-mono">Security Password</label>
                        {isLogin && (
                          <button
                            type="button"
                            onClick={() => setForgotMode(true)}
                            className="text-[10px] text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer font-sans"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 w-4.5 h-4.5 text-gray-500" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 p-1 text-gray-500 hover:text-white transition"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength meter (Signup only) */}
                      {!isLogin && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1 font-mono">
                            <span>Password Strength</span>
                            <span className="font-semibold text-indigo-400">{passStrength.label}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${passStrength.color} transition-all duration-300`} style={{ width: passStrength.width }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Role Selector (Signup only) */}
                  {!isLogin && !forgotMode && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 font-mono">Portal Role</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setRole('student')}
                          className={`py-2 text-xs rounded-xl border font-medium transition ${
                            role === 'student'
                              ? 'bg-primary/20 border-primary text-white shadow-glass-glow'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          Student Enrollment
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('alumni')}
                          className={`py-2 text-xs rounded-xl border font-medium transition ${
                            role === 'alumni'
                              ? 'bg-primary/20 border-primary text-white shadow-glass-glow'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          Alumni Graduate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:brightness-110 shadow-glass-glow transition duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : forgotMode ? (
                      'Request Reset Link'
                    ) : isLogin ? (
                      'Access Platform'
                    ) : (
                      'Initialize Account'
                    )}
                  </button>

                  {/* Back to login button (Forgot mode only) */}
                  {forgotMode && (
                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="mt-2 text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 bg-transparent border-0 self-center cursor-pointer"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" /> Back to login
                    </button>
                  )}
                </form>

                {/* Footer Switcher */}
                {!forgotMode && (
                  <div className="border-t border-white/5 mt-6 pt-4 text-center">
                    <p className="text-xs text-gray-500 font-light m-0">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-400 hover:underline border-0 bg-transparent font-medium cursor-pointer"
                      >
                        {isLogin ? 'Create one now' : 'Sign in here'}
                      </button>
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="otp-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="border border-accent/20" hoverGlow={false}>
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-accent/20 text-cyan-400 mb-3 animate-bounce">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white m-0">OTP Verification</h2>
                  <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed">
                    We sent a security code. To review, enter the default credentials code below:
                  </p>
                  <div className="mt-3 inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-xs font-mono text-cyan-400">
                    Use Verification Code: <span className="font-bold text-white">123456</span>
                  </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400 font-mono">Enter Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-center text-lg tracking-widest font-mono text-white placeholder-gray-600 outline-none focus:border-accent/50 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium hover:brightness-110 shadow-glass-glow shadow-cyan-500/20 transition duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      'Verify Account access'
                    )}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginSignup;
