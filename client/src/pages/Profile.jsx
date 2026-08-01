import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import {
  User, Phone, MapPin, CreditCard, Bell, ClipboardList, Star, Heart,
  HelpCircle, FileText, Lock, LogOut, ChevronRight, Camera, X, Check,
  Sparkles, ShieldCheck, Plus, Trash2, Smartphone
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80'
];

export default function Profile() {
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'customer';

  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || 'Sara Mulugeta',
    phone: localStorage.getItem('userPhone') || '+251 91 234 5678',
    profileImage: localStorage.getItem('profileImage') || '',
    role: role
  });

  const [stats, setStats] = useState({
    completedJobs: 0,
    rating: 4.9,
    savedProvidersCount: 3,
    savedAddressesCount: 2
  });

  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'edit-profile', 'addresses', 'payment', 'notifications', 'saved-providers', 'support', 'terms', 'privacy'
  const [busy, setBusy] = useState(false);

  // Edit Profile form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editImage, setEditImage] = useState('');

  // Saved addresses state
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Bole Atlas, Addis Ababa', default: true },
    { id: 2, label: 'Office', address: 'Kazanchis, Kirkos, Addis Ababa', default: false }
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  // Notifications toggle state
  const [notifs, setNotifs] = useState({ push: true, sms: true, email: false });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setUser(prev => ({
            ...prev,
            ...res.data,
            profileImage: res.data.profileImage || prev.profileImage
          }));
          if (res.data.name) localStorage.setItem('userName', res.data.name);
          if (res.data.profileImage) localStorage.setItem('profileImage', res.data.profileImage);
        }
      } catch (err) {
        console.error('Could not fetch user profile:', err);
      }

      // Fetch completed job count if available
      try {
        const jobsRes = await axios.get(`${API_BASE_URL}/jobs/${role === 'customer' ? 'my-requests' : 'incoming'}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const completed = (jobsRes.data || []).filter(j => j.status === 'completed').length;
        setStats(prev => ({ ...prev, completedJobs: completed || (role === 'customer' ? 12 : 47) }));
      } catch (e) {
        setStats(prev => ({ ...prev, completedJobs: role === 'customer' ? 12 : 47 }));
      } finally {
        setLoading(false);
      }
    })();
  }, [token, role]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Signed out successfully');
    navigate('/login', { replace: true });
  };

  const openEditModal = () => {
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditImage(user.profileImage || '');
    setActiveModal('edit-profile');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setBusy(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/auth/profile`,
        { name: editName, phone: editPhone, profileImage: editImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(prev => ({ ...prev, ...res.data }));
      if (res.data.name) localStorage.setItem('userName', res.data.name);
      if (res.data.profileImage !== undefined) localStorage.setItem('profileImage', res.data.profileImage);
      toast.success('Profile updated successfully');
      setActiveModal(null);
    } catch (err) {
      toast.error('Failed to update profile', err.response?.data?.message);
    } finally {
      setBusy(false);
    }
  };

  const resizeAndCropImage = (file, targetSize = 400) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          // Calculate 1:1 center crop square coordinates
          let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
          if (img.width > img.height) {
            sWidth = img.height;
            sx = (img.width - img.height) / 2;
          } else {
            sHeight = img.width;
            sy = (img.height - img.width) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB');
        return;
      }
      try {
        const resizedDataUrl = await resizeAndCropImage(file, 400);
        setEditImage(resizedDataUrl);
        toast.success('Photo processed & resized');
      } catch (err) {
        toast.error('Failed to process image file');
      }
    }
  };

  const handleAddAddress = () => {
    if (!newAddrText.trim()) return;
    setAddresses(prev => [
      ...prev,
      { id: Date.now(), label: newAddrLabel || 'Other', address: newAddrText.trim(), default: false }
    ]);
    setNewAddrLabel('');
    setNewAddrText('');
    toast.success('New address saved');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  const formatPhone = (phoneStr) => {
    if (!phoneStr) return '+251 91 234 5678';
    const clean = phoneStr.replace(/\D/g, '');
    if (clean.startsWith('251') && clean.length === 12) {
      return `+251 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
    }
    return phoneStr;
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex text-neutral-900">
      <Sidebar role={role} />

      <main className="ml-56 flex-1 min-w-0 pb-16">
        {/* Top Dark Royal Blue Banner */}
        <div className="h-44 w-full bg-[linear-gradient(135deg,#0F172A_0%,#1E3A8A_50%,#1D4ED8_100%)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="max-w-xl mx-auto px-4 pt-6 text-white flex justify-between items-center relative z-10">
            <span className="text-xs uppercase tracking-widest font-semibold text-blue-200 opacity-80">User Profile</span>
            <span className="text-xs bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 capitalize text-white">
              {role === 'provider' ? '⚡ Service Provider' : '👤 Customer Account'}
            </span>
          </div>
        </div>

        {/* Main Content Layout Container */}
        <div className="max-w-xl mx-auto px-4 -mt-20 relative z-20 space-y-6">

          {/* Floating Hero Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 border border-neutral-100 flex items-center gap-5 relative">
            <div className="relative group shrink-0">
              <div className="h-20 w-20 aspect-square rounded-2xl overflow-hidden bg-neutral-100 border-2 border-white shadow-md flex items-center justify-center text-2xl font-bold text-primary-700 shrink-0">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <span>{(user.name || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={openEditModal}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md hover:bg-primary-700 transition-transform active:scale-95 z-10"
                title="Change Profile Picture"
              >
                <Camera className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-neutral-900 truncate tracking-tight">{user.name}</h2>
              <p className="text-sm font-medium text-neutral-500 mt-0.5">{formatPhone(user.phone)}</p>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {user.role === 'provider' ? 'Service Provider' : 'Customer'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                  ★ {stats.rating} · {stats.completedJobs} completed
                </span>
              </div>
            </div>
          </div>

          {/* ACCOUNT GROUP */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <div className="px-5 py-3.5 bg-neutral-50/60 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Account</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              
              {/* Personal Information */}
              <button
                onClick={openEditModal}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Personal Information</h4>
                    <p className="text-xs text-neutral-500 truncate">{user.name} · {user.phone}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

              {/* Saved Addresses */}
              <button
                onClick={() => setActiveModal('addresses')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <MapPin className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Saved Addresses</h4>
                    <p className="text-xs text-neutral-500 truncate">{addresses.length} saved addresses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {addresses.length}
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
                </div>
              </button>

              {/* Payment Methods */}
              <button
                onClick={() => setActiveModal('payment')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <CreditCard className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Payment Methods</h4>
                    <p className="text-xs text-neutral-500 truncate">Telebirr, CBE Birr & Cash</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setActiveModal('notifications')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Bell className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Notifications</h4>
                    <p className="text-xs text-neutral-500 truncate">Push & SMS enabled</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

            </div>
          </div>

          {/* ACTIVITY GROUP */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <div className="px-5 py-3.5 bg-neutral-50/60 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Activity</h3>
            </div>
            <div className="divide-y divide-neutral-100">

              {/* Job History */}
              <Link
                to={role === 'customer' ? '/requests' : '/incoming'}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ClipboardList className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Job History</h4>
                    <p className="text-xs text-neutral-500 truncate">{stats.completedJobs} completed jobs</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </Link>

              {/* My Reviews */}
              <button
                onClick={() => toast.info('You have 0 pending reviews')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Star className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">My Reviews</h4>
                    <p className="text-xs text-neutral-500 truncate">Reviews you have written & received</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

              {/* Saved Providers */}
              {role === 'customer' && (
                <button
                  onClick={() => setActiveModal('saved-providers')}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <Heart className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-900">Saved Providers</h4>
                      <p className="text-xs text-neutral-500 truncate">{stats.savedProvidersCount} providers saved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {stats.savedProvidersCount}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
                  </div>
                </button>
              )}

            </div>
          </div>

          {/* SUPPORT & LEGAL GROUP */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <div className="px-5 py-3.5 bg-neutral-50/60 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Support & Legal</h3>
            </div>
            <div className="divide-y divide-neutral-100">

              <button
                onClick={() => setActiveModal('support')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <HelpCircle className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Help & Support</h4>
                    <p className="text-xs text-neutral-500 truncate">Chat with our 24/7 team</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

              <button
                onClick={() => setActiveModal('terms')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <FileText className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Terms of Service</h4>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

              <button
                onClick={() => setActiveModal('privacy')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Lock className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900">Privacy Policy</h4>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>

            </div>
          </div>

          {/* SIGN OUT BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Sign Out
            </button>
          </div>

        </div>
      </main>

      {/* MODALS (Rendered via React Portal at document.body level to escape all parent stacking contexts) */}
      {activeModal && createPortal(
        <>
          {/* 1. Edit Personal Information & Avatar Modal */}
          {activeModal === 'edit-profile' && (
            <div style={{ zIndex: 999999, isolation: 'isolate' }} className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900">Edit Personal Info</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100">
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Profile Image Picker */}
                  <div className="space-y-2">
                    <label className="form-label text-xs font-semibold">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl font-bold text-neutral-600 shrink-0">
                        {editImage ? (
                          <img src={editImage} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <span>{(editName || 'U').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="btn-secondary text-xs px-3 py-2 cursor-pointer inline-flex items-center gap-1.5">
                          <Camera className="h-4 w-4" strokeWidth={1.8} />
                          Upload photo
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        {editImage && (
                          <button
                            type="button"
                            onClick={() => setEditImage('')}
                            className="text-xs text-red-600 hover:underline block"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preset Avatars */}
                    <div className="mt-3">
                      <p className="text-xs text-neutral-500 mb-2">Or choose from sample avatars:</p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((url, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setEditImage(url)}
                            className={`h-10 w-10 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${
                              editImage === url ? 'border-primary-600 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${i+1}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xs font-semibold">Full Name</label>
                    <input
                      type="text"
                      className="input text-sm"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="e.g. Sara Mulugeta"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs font-semibold">Phone Number</label>
                    <input
                      type="text"
                      className="input text-sm"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="+251 91 234 5678"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-secondary flex-1 py-2.5 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary flex-1 py-2.5 text-sm font-semibold"
                    >
                      {busy ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 2. Saved Addresses Modal */}
          {activeModal === 'addresses' && (
            <div style={{ zIndex: 999999, isolation: 'isolate' }} className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 my-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900">Saved Addresses</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100">
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {addresses.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">{item.label}</span>
                          {item.default && (
                            <span className="text-[10px] bg-primary-100 text-primary-800 px-1.5 py-0.2 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5">{item.address}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(item.id)} className="text-neutral-400 hover:text-red-600 p-1">
                        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                <div className="pt-2 border-t border-neutral-100 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-700">Add New Address</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Home, Office)"
                      className="input text-xs w-1/3"
                      value={newAddrLabel}
                      onChange={e => setNewAddrLabel(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Full Address in Addis Ababa"
                      className="input text-xs flex-1"
                      value={newAddrText}
                      onChange={e => setNewAddrText(e.target.value)}
                    />
                  </div>
                  <button onClick={handleAddAddress} className="btn-secondary text-xs w-full py-2 flex items-center justify-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Payment Methods Modal */}
          {activeModal === 'payment' && (
            <div style={{ zIndex: 999999, isolation: 'isolate' }} className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 my-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900">Payment Methods</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100">
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                        tb
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Telebirr Direct</h4>
                        <p className="text-xs text-neutral-500">Connected (+251 91***5678)</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Default</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-700 text-white font-bold flex items-center justify-center text-sm">
                        CBE
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">CBE Birr</h4>
                        <p className="text-xs text-neutral-500">Commercial Bank of Ethiopia</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                        💵
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Cash on Service Completion</h4>
                        <p className="text-xs text-neutral-500">Pay directly to provider</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={() => setActiveModal(null)} className="btn-primary w-full py-2.5 text-sm">
                  Done
                </button>
              </div>
            </div>
          )}

          {/* 4. Notifications Settings Modal */}
          {activeModal === 'notifications' && (
            <div style={{ zIndex: 999999, isolation: 'isolate' }} className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 my-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900">Notifications</h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100">
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">Push Notifications</h4>
                      <p className="text-xs text-neutral-500">Real-time job updates & quotes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifs.push}
                      onChange={e => setNotifs(prev => ({ ...prev, push: e.target.checked }))}
                      className="h-5 w-5 accent-primary-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">SMS Alerts</h4>
                      <p className="text-xs text-neutral-500">Urgent job updates on mobile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifs.sms}
                      onChange={e => setNotifs(prev => ({ ...prev, sms: e.target.checked }))}
                      className="h-5 w-5 accent-primary-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <button onClick={() => { toast.success('Preferences saved'); setActiveModal(null); }} className="btn-primary w-full py-2.5 text-sm">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* 5. Support & Legal Modals */}
          {(activeModal === 'support' || activeModal === 'terms' || activeModal === 'privacy') && (
            <div style={{ zIndex: 999999, isolation: 'isolate' }} className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 my-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900 capitalize">
                    {activeModal === 'support' ? 'Help & Support' : activeModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100">
                    <X className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>

                {activeModal === 'support' ? (
                  <div className="space-y-3 text-sm text-neutral-600">
                    <p>Need assistance with a job or booking? Our team is available 24/7.</p>
                    <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs space-y-1">
                      <p className="font-semibold">📞 Customer Care Line:</p>
                      <p>+251 911 000 999 / +251 900 888 777</p>
                      <p className="font-semibold pt-2">✉️ Email Support:</p>
                      <p>support@tegagn.et</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-neutral-600 max-h-60 overflow-y-auto">
                    <p>Welcome to Tegagn Home Services Platform. By using our service, you agree to comply with our platform safety rules, fair pricing policies, and customer protection guidelines.</p>
                    <p>All service providers are verified according to local service standards. Payments made via Telebirr or cash are protected under Tegagn Guarantee.</p>
                  </div>
                )}

                <button onClick={() => setActiveModal(null)} className="btn-primary w-full py-2 text-sm">
                  Close
                </button>
              </div>
            </div>
          )}
        </>,
        document.body
      )}

    </div>
  );
}
