import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { User, Lock, Eye, Trash2, EyeOff, Save, Check } from 'lucide-react';

const Settings = () => {
  const { user, profile, updateProfile, toggleMentorStatus } = useAuth();
  const { addToast } = useNotifications();

  // Profile forms state
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setCompany(profile.company || '');
      setIndustry(profile.industry || '');
      setLocation(profile.location || '');
      setSkills(profile.skills?.join(', ') || '');
      setLinkedin(profile.socialLinks?.linkedin || '');
      setGithub(profile.socialLinks?.github || '');
      setTwitter(profile.socialLinks?.twitter || '');
    }
  }, [profile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      await updateProfile({
        bio,
        company,
        industry,
        location,
        skills: skillsArray,
        socialLinks: {
          linkedin,
          github,
          twitter
        }
      });
      addToast('Profile changes saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error saving profile changes', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;

    setPassLoading(true);
    setTimeout(() => {
      addToast('Security password updated successfully!', 'success');
      setOldPass('');
      setNewPass('');
      setPassLoading(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    const doubleCheck = window.confirm('Are you absolutely sure you want to delete your profile account? This operation is permanent.');
    if (doubleCheck) {
      addToast('Mock delete completed. Your account is flagged for deletion.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto overflow-y-auto">
        {/* Header Title */}
        <div className="text-left mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">Account Settings</h1>
          <p className="text-xs text-gray-400 font-light mt-1.5">
            Modify profile properties, update login passwords, and manage account preferences.
          </p>
        </div>

        {/* Settings split configurations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Left Side: General Profile configuration */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Edit Biography & details</h3>
            <GlassCard className="border-white/5" hoverGlow={false}>
              <form onSubmit={handleProfileSave} className="flex flex-col gap-4 text-xs font-light">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-gray-500 font-semibold">Biographical summary</label>
                  <textarea
                    placeholder="Describe your career goals, projects, or interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-primary/50 h-20 resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-gray-500 font-semibold">Current Company / School</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Stanford University"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-gray-500 font-semibold">Location (City, State)</label>
                    <input
                      type="text"
                      placeholder="e.g. Seattle, WA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-gray-500 font-semibold">Industry Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. FinTech, Hardware"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono text-gray-500 font-semibold">Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Go, Docker"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Social links details */}
                <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3">
                  <h4 className="text-[10px] uppercase font-mono text-indigo-300 m-0">Social Handles</h4>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-[10px] text-gray-500 font-mono">LinkedIn:</span>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-gray-700 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-[10px] text-gray-500 font-mono">GitHub:</span>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-gray-700 outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 text-white font-medium transition flex items-center justify-center gap-1.5 shadow-glass-glow self-start px-6"
                >
                  <Save className="w-4 h-4" /> Save Biography Changes
                </button>
              </form>
            </GlassCard>
          </div>

          {/* Right Side: Security Password & Banning options */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0">Security controls</h3>
            
            {/* Password edit */}
            <GlassCard className="border-white/5" hoverGlow={false}>
              <h4 className="text-[10px] uppercase font-mono text-gray-500 mb-3 m-0">Update Password</h4>
              
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    required
                    placeholder="Old Password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    required
                    placeholder="New Password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium hover:brightness-110 transition mt-2"
                >
                  Update Credentials
                </button>
              </form>
            </GlassCard>

            {/* Danger Zone account deletion */}
            <GlassCard className="border-red-500/10 bg-red-500/5" hoverGlow={false}>
              <h4 className="text-[10px] uppercase font-mono text-red-400 mb-2 m-0 font-bold">Danger Zone</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light mb-4">
                Deleting your account will erase your listings, booked slot requests, and recomendations.
              </p>
              
              <button
                onClick={handleDeleteAccount}
                className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Profile Account
              </button>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
