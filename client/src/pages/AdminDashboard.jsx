import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import {
  LayoutDashboard, Users, Briefcase, UserCheck, TrendingUp, Settings,
  Search, Bell, Plus, CheckCircle, AlertTriangle, ShieldAlert, XCircle,
  LogOut, ArrowUpRight, ChevronRight, Sliders, RefreshCw, Star, ShieldCheck,
  Eye, Lock, Unlock, AlertOctagon, MapPin, Phone, User, DollarSign, Calendar
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'providers' | 'jobs' | 'customers' | 'revenue' | 'security' | 'settings'
  const [stats, setStats] = useState({
    revenueMTD: 342800,
    activeJobs: 47,
    totalJobs: 2847,
    verifiedProviders: 540,
    pendingProvidersCount: 8,
    totalProviders: 548,
    totalCustomers: 12400,
    jobStatus: { completed: 68, inProgress: 14, pending: 12, cancelled: 6 },
    categories: { Plumbing: 28, Cleaning: 18, Electrical: 12, Painting: 8, Construction: 8 }
  });

  const [providers, setProviders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);

  const [providerFilter, setProviderFilter] = useState('all'); // 'all' | 'verified' | 'pending' | 'suspended'
  const [jobFilter, setJobFilter] = useState('all'); // 'all' | 'active' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('30D');

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [emergencyLock, setEmergencyLock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || userRole !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }
    fetchDashboardData();
  }, [token, userRole, providerFilter, jobFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [statsRes, providersRes, jobsRes, customersRes, secRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`, config).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/admin/providers?status=${providerFilter}`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/admin/jobs?status=${jobFilter}`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/admin/customers`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/admin/security-logs`, config).catch(() => ({ data: [] }))
      ]);

      if (statsRes.data) setStats(prev => ({ ...prev, ...statsRes.data }));
      if (providersRes.data) setProviders(providersRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      if (secRes.data) setSecurityLogs(secRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProviderStatus = async (providerId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_BASE_URL}/admin/providers/${providerId}/status`, { status: newStatus }, config);
      toast.success('Status Updated', `Provider status set to ${newStatus}`);
      setSelectedProvider(null);
      fetchDashboardData();
    } catch (err) {
      toast.error('Update Failed', 'Failed to update provider status');
    }
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_BASE_URL}/admin/jobs/${jobId}/status`, { status: newStatus }, config);
      toast.success('Job Updated', `Job status set to ${newStatus}`);
      setSelectedJob(null);
      fetchDashboardData();
    } catch (err) {
      toast.error('Update Failed', 'Failed to update job status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Signed Out', 'Admin logged out safely');
    navigate('/login', { replace: true });
  };

  // Demo sparkline points
  const revenueTrendPoints = [
    { x: 20, y: 140 }, { x: 70, y: 145 }, { x: 120, y: 130 }, { x: 170, y: 138 },
    { x: 220, y: 110 }, { x: 270, y: 115 }, { x: 320, y: 95 }, { x: 370, y: 90 },
    { x: 420, y: 100 }, { x: 470, y: 75 }, { x: 520, y: 70 }, { x: 570, y: 60 },
    { x: 620, y: 68 }
  ];
  const sparklineD = revenueTrendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex text-neutral-900 font-sans">
      {/* 1. DARK NAVY SIDEBAR (#0F172A) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-white flex flex-col z-40 shadow-xl border-r border-slate-800">
        {/* Brand Header */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-lg shadow-md shadow-orange-500/20">
            ጠ
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">Tegagn</h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Admin Console</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* PLATFORM GROUP */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Platform</p>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('providers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'providers'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Providers</span>
              </div>
              {stats.pendingProvidersCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  {stats.pendingProvidersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Jobs</span>
              </div>
              {jobs.length > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  {jobs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Customers</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'revenue'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Revenue</span>
              </div>
            </button>
          </div>

          {/* SYSTEM & SECURITY GROUP */}
          <div className="space-y-1 pt-2">
            <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Security & System</p>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" strokeWidth={1.8} />
                <span>Security Audit</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4.5 w-4.5" strokeWidth={1.8} />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Admin Super User Profile Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                alt="Sara Mulugeta"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Sara Mulugeta</p>
              <p className="text-[11px] text-slate-400">Super Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="ml-64 flex-1 min-w-0 pb-16">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight capitalize">{activeTab}</h2>
            <p className="text-xs text-neutral-500 font-medium">
              {activeTab === 'overview' && 'Live platform metrics & MongoDB analytics'}
              {activeTab === 'providers' && `${stats.totalProviders} total · ${stats.pendingProvidersCount} pending review`}
              {activeTab === 'jobs' && `${jobs.length} total jobs posted in database`}
              {activeTab === 'customers' && `${customers.length} registered customer accounts`}
              {activeTab === 'revenue' && 'Financial transactions & commission accounting'}
              {activeTab === 'security' && 'Platform safety logs & system lock overrides'}
              {activeTab === 'settings' && 'Platform governance & security rules'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border-none rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-800 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 bg-neutral-100 rounded-xl text-neutral-600 hover:bg-neutral-200 transition-colors">
              <Bell className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-orange-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* MAIN BODY TAB CONTENT */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Top Sparkline Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Revenue MTD */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      +18%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight tabular-nums">
                      ETB {stats.revenueMTD.toLocaleString()}
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">Revenue (MTD)</p>
                  </div>
                  <svg className="w-full h-8 text-blue-500 overflow-visible stroke-current fill-none stroke-[2.5]" viewBox="0 0 100 25">
                    <path d="M0 20 Q 25 22, 40 12 T 70 8 T 100 2" />
                  </svg>
                </div>

                {/* 2. Active Jobs */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                      <Briefcase className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      +12%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight tabular-nums">
                      {stats.activeJobs}
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">Active Jobs</p>
                  </div>
                  <svg className="w-full h-8 text-orange-500 overflow-visible stroke-current fill-none stroke-[2.5]" viewBox="0 0 100 25">
                    <path d="M0 18 Q 20 10, 45 15 T 80 5 T 100 8" />
                  </svg>
                </div>

                {/* 3. Verified Providers */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <Users className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      +8%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight tabular-nums">
                      {stats.verifiedProviders}
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">Verified Providers</p>
                  </div>
                  <svg className="w-full h-8 text-purple-500 overflow-visible stroke-current fill-none stroke-[2.5]" viewBox="0 0 100 25">
                    <path d="M0 22 Q 30 18, 50 12 T 85 10 T 100 4" />
                  </svg>
                </div>

                {/* 4. Customers */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <UserCheck className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      +23%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight tabular-nums">
                      {stats.totalCustomers.toLocaleString()}
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">Customers</p>
                  </div>
                  <svg className="w-full h-8 text-emerald-500 overflow-visible stroke-current fill-none stroke-[2.5]" viewBox="0 0 100 25">
                    <path d="M0 20 Q 30 15, 60 10 T 80 8 T 100 2" />
                  </svg>
                </div>
              </div>

              {/* Grid Layout: Revenue Trend (Left) + Charts (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Revenue Trend Curve */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Revenue Trend</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold text-neutral-900 tabular-nums">ETB {stats.revenueMTD.toLocaleString()}</h3>
                        <span className="text-xs font-semibold text-emerald-600">↗ +18% vs previous period</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                      {['14D', '30D', '90D'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTimeRange(t)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                            timeRange === t ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="h-64 w-full relative pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 650 180">
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`${sparklineD} L 620 180 L 20 180 Z`}
                        fill="url(#revenueGrad)"
                      />
                      <path
                        d={sparklineD}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {revenueTrendPoints.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                      ))}
                    </svg>
                    <div className="flex justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                      <span>Jul 19</span>
                      <span>21</span>
                      <span>23</span>
                      <span>25</span>
                      <span>27</span>
                      <span>29</span>
                      <span>31</span>
                    </div>
                  </div>
                </div>

                {/* Right: Job Status Donut + Category Breakdown */}
                <div className="space-y-6">
                  {/* Job Status Donut Breakdown */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Job Status</h4>
                    <div className="flex items-center gap-6">
                      <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="4"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="4"
                            strokeDasharray="68, 100"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="4"
                            strokeDasharray="14, 100"
                            strokeDashoffset="-68"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="4"
                            strokeDasharray="12, 100"
                            strokeDashoffset="-82"
                          />
                        </svg>
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed</span>
                          <span className="font-bold text-neutral-900">{stats.jobStatus.completed || 68}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> In Progress</span>
                          <span className="font-bold text-neutral-900">{stats.jobStatus.inProgress || 14}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending</span>
                          <span className="font-bold text-neutral-900">{stats.jobStatus.pending || 12}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-neutral-400" /> Cancelled</span>
                          <span className="font-bold text-neutral-900">{stats.jobStatus.cancelled || 6}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">By Category</h4>
                    <div className="grid grid-cols-5 items-end gap-2 h-28 pt-4">
                      {[
                        { label: 'Plumb.', pct: '28%', bg: 'bg-blue-600', height: 'h-24' },
                        { label: 'Clean.', pct: '18%', bg: 'bg-cyan-500', height: 'h-16' },
                        { label: 'Elec.', pct: '18%', bg: 'bg-amber-500', height: 'h-16' },
                        { label: 'Paint.', pct: '12%', bg: 'bg-purple-500', height: 'h-12' },
                        { label: 'Const.', pct: '8%', bg: 'bg-emerald-500', height: 'h-8' },
                      ].map((c, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 text-[10px] text-neutral-500 font-semibold">
                          <span>{c.pct}</span>
                          <div className={`w-full ${c.height} ${c.bg} rounded-t-lg transition-all hover:opacity-90`} />
                          <span className="truncate max-w-9">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROVIDERS MANAGEMENT */}
          {activeTab === 'providers' && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden space-y-4 p-6">
              {/* Header Filters & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
                  {['all', 'verified', 'pending', 'suspended'].map(st => (
                    <button
                      key={st}
                      onClick={() => setProviderFilter(st)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                        providerFilter === st ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => toast.success('Invite Copied', 'Provider registration link copied to clipboard')}
                  className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm shrink-0 active:scale-98"
                >
                  <Plus className="h-4 w-4" />
                  + Invite Provider
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Provider</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Jobs</th>
                      <th className="py-3.5 px-4">Earnings (ETB)</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Joined</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {providers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-neutral-400">
                          No providers found matching current filter.
                        </td>
                      </tr>
                    ) : (
                      providers.map(p => (
                        <tr key={p._id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                                alt={p.name}
                                className="h-9 w-9 rounded-full object-cover border border-neutral-200"
                              />
                              <div>
                                <p className="font-bold text-neutral-900">{p.name}</p>
                                <p className="text-[11px] text-neutral-400">{p.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 capitalize">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-600">
                            ★ {p.rating}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-neutral-800">{p.jobsCount}</td>
                          <td className="py-3.5 px-4 font-bold text-neutral-900 tabular-nums">
                            {p.earningsETB.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              p.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-500">{p.joinedDate}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedProvider(p)}
                                className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                title="Inspect Provider"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {p.status !== 'Verified' && (
                                <button
                                  onClick={() => handleUpdateProviderStatus(p._id, 'verified')}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                                >
                                  Verify
                                </button>
                              )}
                              {p.status !== 'Suspended' && (
                                <button
                                  onClick={() => handleUpdateProviderStatus(p._id, 'suspended')}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold transition-colors"
                                >
                                  Suspend
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: JOBS MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden space-y-4 p-6">
              {/* Filter Pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl w-fit">
                  {['all', 'active', 'pending', 'completed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setJobFilter(st)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                        jobFilter === st ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-neutral-400 font-semibold">
                  Showing {jobs.length} jobs
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Job Details</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Assigned Provider</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-neutral-400">
                          No jobs found matching current filter.
                        </td>
                      </tr>
                    ) : (
                      jobs.map(j => (
                        <tr key={j._id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-neutral-900">{j.title}</p>
                              <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 text-neutral-400" />
                                {j.location || 'Addis Ababa'}
                              </p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-neutral-900 font-bold">{j.customerName}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{j.customerPhone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-neutral-900 font-bold">{j.providerName}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{j.providerPhone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 capitalize">
                              {j.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              j.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              j.status === 'Active' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              j.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {j.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-neutral-900 tabular-nums">ETB {j.amountETB}</td>
                          <td className="py-3.5 px-4 text-neutral-500">{j.time}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedJob(j)}
                                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold transition-colors"
                              >
                                View Details
                              </button>

                              {j.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateJobStatus(j._id, 'completed')}
                                  className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold transition-colors text-[11px]"
                                >
                                  Force Complete
                                </button>
                              )}

                              {j.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateJobStatus(j._id, 'cancelled')}
                                  className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold transition-colors text-[11px]"
                                >
                                  Cancel Job
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden p-6 space-y-4">
              <h3 className="text-base font-bold text-neutral-900">Registered Customers ({customers.length})</h3>
              <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Phone Number</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4">Total Jobs Posted</th>
                      <th className="py-3.5 px-4">Total Spent</th>
                      <th className="py-3.5 px-4">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {customers.map(c => (
                      <tr key={c._id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-neutral-900">{c.name}</td>
                        <td className="py-3.5 px-4 text-neutral-600 font-mono">{c.phone}</td>
                        <td className="py-3.5 px-4 text-neutral-500">{c.joinedDate}</td>
                        <td className="py-3.5 px-4 font-bold text-neutral-800">{c.totalJobs}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">ETB {c.totalSpentETB.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVENUE */}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Platform Revenue Overview</h3>
                  <p className="text-xs text-neutral-500">15% Tegagn service commission auto-deducted from completed bookings</p>
                </div>
                <button
                  onClick={() => toast.success('Report Exported', 'CSV report downloaded to your computer')}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Export Financial Report (CSV)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-xs text-neutral-500 font-medium">Gross Platform Volume</p>
                  <p className="text-xl font-bold text-neutral-900 mt-1">ETB 2,285,300</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-medium">Tegagn Net Commission (15%)</p>
                  <p className="text-xl font-bold text-emerald-900 mt-1">ETB 342,800</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">Provider Payouts Settled</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">ETB 1,942,500</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY AUDIT */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Emergency Security Panel */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 text-white rounded-xl">
                    <AlertOctagon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-amber-900">Emergency Maintenance & Lock Mode</h3>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {emergencyLock ? 'System is currently locked. New job postings are frozen.' : 'System is operating normally. All security protections active.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEmergencyLock(v => !v);
                    toast.success(emergencyLock ? 'System Unlocked' : 'Emergency Lock Active', emergencyLock ? 'Normal operations restored' : 'Job postings frozen');
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    emergencyLock ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {emergencyLock ? 'Unlock Platform' : 'Activate Emergency Lock'}
                </button>
              </div>

              {/* Security Audit Trail */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-neutral-900">Security Audit Trail</h3>
                <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Event</th>
                        <th className="py-3.5 px-4">Target User / Object</th>
                        <th className="py-3.5 px-4">IP Address</th>
                        <th className="py-3.5 px-4">Time</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {securityLogs.map(log => (
                        <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-neutral-900">{log.event}</td>
                          <td className="py-3.5 px-4 text-neutral-700">{log.user}</td>
                          <td className="py-3.5 px-4 font-mono text-neutral-500">{log.ip}</td>
                          <td className="py-3.5 px-4 text-neutral-500">{log.time}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">Platform Governance & Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Automatic Provider Verification</p>
                    <p className="text-xs text-neutral-500">Require manual admin verification before providers receive direct requests</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox h-5 w-5 rounded text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Platform Commission Rate</p>
                    <p className="text-xs text-neutral-500">Percentage deducted from completed job amounts</p>
                  </div>
                  <span className="font-bold text-sm bg-white border px-3 py-1 rounded-lg">15 %</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* JOB INSPECTION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {selectedJob.category}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">{selectedJob.title}</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                <p className="font-bold text-neutral-700">Description</p>
                <p className="text-neutral-600">{selectedJob.fullDescription || selectedJob.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-400 font-bold">Customer</p>
                  <p className="font-bold text-neutral-900 mt-1">{selectedJob.customerName}</p>
                  <p className="text-neutral-500 font-mono">{selectedJob.customerPhone}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-400 font-bold">Assigned Provider</p>
                  <p className="font-bold text-neutral-900 mt-1">{selectedJob.providerName}</p>
                  <p className="text-neutral-500 font-mono">{selectedJob.providerPhone || 'Not assigned'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl text-blue-900">
                <span className="font-bold">Agreed Amount</span>
                <span className="text-base font-black">ETB {selectedJob.amountETB}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => handleUpdateJobStatus(selectedJob._id, 'completed')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
              >
                Force Complete Job
              </button>
              <button
                onClick={() => handleUpdateJobStatus(selectedJob._id, 'cancelled')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs"
              >
                Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROVIDER INSPECTION MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">Provider Credentials</h3>
              <button onClick={() => setSelectedProvider(null)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">✕</button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedProvider.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={selectedProvider.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h4 className="text-lg font-bold text-neutral-900">{selectedProvider.name}</h4>
                <p className="text-xs text-neutral-500 font-mono">{selectedProvider.phone}</p>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 mt-1 inline-block capitalize">
                  {selectedProvider.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-neutral-400 font-semibold">Rating</p>
                <p className="text-base font-bold text-amber-600 mt-0.5">★ {selectedProvider.rating}</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-neutral-400 font-semibold">Earnings</p>
                <p className="text-base font-bold text-emerald-700 mt-0.5">ETB {selectedProvider.earningsETB.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              {selectedProvider.status !== 'Verified' && (
                <button
                  onClick={() => handleUpdateProviderStatus(selectedProvider._id, 'verified')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
                >
                  Verify Provider
                </button>
              )}
              {selectedProvider.status !== 'Suspended' && (
                <button
                  onClick={() => handleUpdateProviderStatus(selectedProvider._id, 'suspended')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
                >
                  Suspend Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
