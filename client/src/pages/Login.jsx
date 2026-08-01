import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Clock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import { BrandMark } from '../components/Sidebar';

const benefits = [
  { icon: ShieldCheck, text: 'Background-checked, verified providers' },
  { icon: CheckCircle2, text: 'Upfront prices — never a surprise' },
  { icon: Clock,       text: 'See real-time provider availability' },
];

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.name);
      toast.success('Signed in', `Welcome back, ${res.data.name.split(' ')[0]}`);
      navigate(res.data.role === 'customer' ? '/' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error('Sign in failed', err.response?.data?.message || 'Check your phone and password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-1 flex-col bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex-1 flex flex-col p-10 xl:p-14">
          <BrandMark />
          <div className="mt-auto max-w-md">
            <h2 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-tight">
              A better way to care for your home.
            </h2>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              Tegagn connects Addis Ababa with trusted home-service professionals.
              Simple, transparent and on your schedule.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map(b => {
                const Icon = b.icon;
                return (
                  <li key={b.text} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-primary-400">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-sm text-neutral-200">{b.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-neutral-50 flex flex-col">
        <div className="lg:hidden px-5 py-4 border-b border-neutral-200 bg-white">
          <BrandMark />
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Welcome back</h1>
              <p className="mt-1.5 text-sm text-neutral-500">Sign in to continue to Tegagn.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="form-label" htmlFor="phone">Phone number</label>
                <div className="flex rounded-lg border border-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition">
                  <span className="flex items-center px-3 bg-neutral-50 border-r border-neutral-200 text-sm text-neutral-600 font-medium shrink-0">
                    +251
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="flex-1 px-3.5 py-2.5 bg-white border-0 outline-none text-sm"
                    placeholder="91 234 5678"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="form-label mb-0" htmlFor="password">Password</label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input pr-10"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-md"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" strokeWidth={1.8} /> : <Eye className="h-4 w-4" strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-11 mt-2"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="text-center text-sm text-neutral-500">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-medium text-primary-700 hover:text-primary-800">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
