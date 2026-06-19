import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { Shield, Users, Award, BookOpen, UserCheck, ShieldAlert, Download, Trash2, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { apiUrl } = useAuth();
  const { addToast } = useNotifications();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch Stats
      const resStats = await fetch(`${apiUrl}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }

      // Fetch Users List
      const resUsers = await fetch(`${apiUrl}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resUsers.ok) {
        const usersData = await resUsers.json();
        setUsersList(usersData);
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching administrator dashboard details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [apiUrl]);

  const handleApprove = async (targetUserId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/admin/approve/${targetUserId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('Alumni account verified and approved!', 'success');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBanToggle = async (targetUserId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/admin/ban/${targetUserId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('User access status updated successfully', 'success');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    // Mock export CSV file
    const headers = 'ID,Name,Email,Role,Approved\n';
    const rows = usersList.map(u => `${u._id},"${u.name}",${u.email},${u.role},${u.isApproved}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `alumni_network_users_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
    addToast('CSV export downloaded successfully!', 'success');
  };

  const pendingAlumni = usersList.filter(u => u.role === 'alumni' && !u.isApproved);
  const activeUsers = usersList.filter(u => u.isApproved);

  return (
    <div className="min-h-screen bg-darkBg text-white pt-16 flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0 flex items-center gap-2">
              <Shield className="w-7 h-7 text-red-500 animate-pulse" />
              Administrator Dashboard Panel
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1.5">
              Monitor cohort accounts, verify pending alumni registrations, and view platform metrics.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1.5 self-start"
          >
            <Download className="w-4 h-4" /> Export Cohort Database (.CSV)
          </button>
        </div>

        {loading ? (
          <div className="shimmer h-40 rounded-2xl mb-8" />
        ) : (
          /* Stats overview row */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
            <GlassCard className="border-white/5" hoverGlow={false}>
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Total Users registered</span>
              <span className="text-2xl font-black text-white">{stats?.totalUsers || 0}</span>
            </GlassCard>
            <GlassCard className="border-white/5" hoverGlow={false}>
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Verified Alumni</span>
              <span className="text-2xl font-black text-emerald-400">{stats?.approvedAlumniCount || 0}</span>
            </GlassCard>
            <GlassCard className="border-white/5" hoverGlow={false}>
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Active Job Listings</span>
              <span className="text-2xl font-black text-cyan-400">{stats?.jobsCount || 0}</span>
            </GlassCard>
            <GlassCard className="border-white/5" hoverGlow={false}>
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Mentorship Requests</span>
              <span className="text-2xl font-black text-violet-400">{stats?.sessionsCount || 0}</span>
            </GlassCard>
          </div>
        )}

        {/* Pending approvals section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Pending Alumni list */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400 font-mono m-0 flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5" /> Pending Approvals ({pendingAlumni.length})
            </h3>
            
            <GlassCard className="border-red-500/10 bg-red-500/5 flex flex-col gap-3 max-h-96 overflow-y-auto" hoverGlow={false}>
              {pendingAlumni.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No pending registrations requiring approval.</p>
              ) : (
                pendingAlumni.map((pending) => (
                  <div key={pending._id} className="p-3 rounded-xl border border-white/5 bg-black/20 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{pending.name}</h4>
                      <span className="text-[9px] text-gray-500 font-mono block">{pending.email}</span>
                    </div>
                    
                    <button
                      onClick={() => handleApprove(pending._id)}
                      className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition"
                      title="Verify & Approve Profile"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </GlassCard>
          </div>

          {/* User management list table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 font-mono m-0 flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5" /> Platform Accounts Registry
            </h3>

            <GlassCard className="border-white/5 p-4 overflow-x-auto" hoverGlow={false}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 font-mono text-gray-500">
                    <th className="py-2.5 font-normal">Name</th>
                    <th className="py-2.5 font-normal">Email</th>
                    <th className="py-2.5 font-normal">Role</th>
                    <th className="py-2.5 font-normal">Approved</th>
                    <th className="py-2.5 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((userReg) => (
                    <tr key={userReg._id} className="hover:bg-white/5 transition">
                      <td className="py-3 font-semibold text-white">{userReg.name}</td>
                      <td className="py-3 text-gray-400 font-light">{userReg.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full capitalize font-mono text-[10px] ${
                          userReg.role === 'admin' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : userReg.role === 'alumni'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-primary/20'
                        }`}>
                          {userReg.role}
                        </span>
                      </td>
                      <td className="py-3 font-mono">{userReg.isApproved ? 'Yes' : 'No'}</td>
                      <td className="py-3 text-right">
                        {userReg.role !== 'admin' && (
                          <button
                            onClick={() => handleBanToggle(userReg._id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition ${
                              userReg.isApproved
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {userReg.isApproved ? 'Lock Account' : 'Verify Account'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
