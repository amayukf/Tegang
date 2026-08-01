import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, MapPin, Clock, ArrowRight, Wrench, CheckCircle2,
  ChevronRight, Star, UserCheck, Wallet, Search, Zap, Check, TrendingUp
} from 'lucide-react';
import { BrandMark } from '../components/Sidebar';

// SVG components to match Figma perfectly
const ProviderImage = "https://images.unsplash.com/photo-1543165365-07232ed12fad?q=80&w=600&auto=format&fit=crop";
const WomanImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";

const WaveDivider = () => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
    <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white" />
    </svg>
  </div>
);

const WaveDividerTop = () => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
    <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white" />
    </svg>
  </div>
);

const ServiceIcons = {
  Plumbing: Wrench,
  Electrical: Zap,
  Construction: ShieldCheck,
  Painting: Search,
  Cleaning: Star,
  Carpentry: MapPin,
  HVAC: Clock,
  Landscaping: UserCheck
};

const categories = [
  { label: 'Plumbing', count: 24, icon: 'Plumbing' },
  { label: 'Electrical', count: 18, icon: 'Electrical' },
  { label: 'Construction', count: 11, icon: 'Construction' },
  { label: 'Painting', count: 15, icon: 'Painting' },
  { label: 'Cleaning', count: 32, icon: 'Cleaning' },
  { label: 'Carpentry', count: 9, icon: 'Carpentry' },
  { label: 'HVAC', count: 7, icon: 'HVAC' },
  { label: 'Landscaping', count: 6, icon: 'Landscaping' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 12400,
    providers: 540,
    jobs: 8500,
    response_time: '<15 min',
    rating: '4.8',
    categories: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:10000/api'}/public/stats`);
        setStats(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans selection:bg-primary-200">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#1d3269] bg-linear-to-b from-[#182859] to-[#203a7a] pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-60"></div>
        {/* Nav */}
        <header className="relative z-30 pt-6">
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              const token = localStorage.getItem('token');
              const role = localStorage.getItem('role') || localStorage.getItem('userRole');
              if (token) navigate(role === 'admin' ? '/admin' : role === 'provider' ? '/dashboard' : '/home');
              else navigate('/');
            }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-sm">
                <span className="text-xl font-bold text-white leading-none tracking-tighter">m</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Tegagn</span>
            </div>
            
            {/* Center Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#providers" className="hover:text-white transition-colors">Providers</a>
              <a href="#for-pros" className="hover:text-white transition-colors">For Pros</a>
            </nav>

            {/* Right Auth */}
            <div className="flex items-center gap-5">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
                Log In
              </button>
              <button onClick={() => navigate('/signup')} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 pt-24 pb-16 lg:pt-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-blue-100 mb-8">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                {stats.providers > 0 ? stats.providers : '540+' } verified providers active in Addis Ababa
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-white leading-[1.05] mb-6 drop-shadow-sm">
                Trusted home <br />services, <br />
                <span className="text-orange-500">on demand.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-xl mb-10 font-normal">
                Tegagn connects you with background-checked plumbers, electricians, painters, and cleaners in Addis Ababa — with upfront pricing and live availability, always.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link to="/signup" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-xl shadow-[0_4px_20px_0_rgba(249,115,22,0.4)] transition-all">
                  Find a Provider Now
                </Link>
                <Link to="/signup?role=provider" className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 text-base font-semibold rounded-xl transition-all">
                  Join as a Provider
                </Link>
              </div>

              <div className="flex flex-wrap flex-col sm:flex-row gap-4 sm:gap-6 text-sm md:text-base font-medium text-blue-200/80">
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> No upfront payment</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Identity-verified pros</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Cancel anytime</div>
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="relative hidden lg:block">
              {/* Back card (offset) */}
              <div className="absolute top-8 -right-4 w-[380px] h-[400px] rounded-3xl bg-[#0f1f45] shadow-2xl transform rotate-3 border border-white/10 opacity-70"></div>
              {/* Main Provider Card */}
              <div className="relative w-[400px] bg-white rounded-[24px] shadow-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transform -rotate-2 ml-4">
                <div className="h-56 overflow-hidden">
                  <img src={ProviderImage} alt="Provider" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-neutral-900">Abebe Girma</h4>
                      <p className="text-sm text-neutral-500">Master Plumber · Bole</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available Now
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 mb-5 pb-5 border-b border-neutral-100">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="font-bold text-neutral-900 ml-1">4.9</span>
                      <span className="text-neutral-500 text-sm">(134)</span>
                    </div>
                    <div>
                      <span className="font-bold text-blue-900">ETB 350-800</span><span className="text-sm text-neutral-500">/hr</span>
                    </div>
                  </div>

                  <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]">
                    Request Service
                  </button>
                  
                  {/* Floating Tag */}
                  <div className="absolute -bottom-4 -right-4 bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div className="text-xs">
                      <p className="font-bold text-neutral-900">Live · 24 available</p>
                      <p className="text-neutral-500">In your area right now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-white py-12 border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center text-blue-900">
          <div>
            <p className="text-4xl md:text-5xl font-bold mb-2">{stats.customers.toLocaleString()}+</p>

            <p className="text-sm text-neutral-500 font-medium tracking-wide">Customers served</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold mb-2">{stats.providers.toLocaleString()}+</p>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Verified providers</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold mb-2">{stats.rating}★</p>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Average rating</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold mb-2">{stats.response_time}</p>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Avg. response time</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-[#f4f7fb] py-24 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1d3269] mb-6">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1844] tracking-tight mb-4">
            From problem to solved in minutes.
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-16">
            Three steps, no friction. No phone calls, no negotiating in the dark.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-neutral-100 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
              <span className="absolute top-6 right-6 text-6xl font-bold text-neutral-50 group-hover:text-blue-50 transition-colors">01</span>
              <div className="w-14 h-14 bg-[#1d3269] rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3 relative z-10">Describe your job</h3>
              <p className="text-neutral-500 leading-relaxed relative z-10">
                Tell us what you need — plumbing, electrical, painting, or any other home service. Takes under a minute.
              </p>
            </div>
            
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-neutral-100 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
              <span className="absolute top-6 right-6 text-6xl font-bold text-neutral-50 group-hover:text-blue-50 transition-colors">02</span>
              <div className="w-14 h-14 bg-[#1d3269] rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3 relative z-10">Get matched instantly</h3>
              <p className="text-neutral-500 leading-relaxed relative z-10">
                We surface verified providers who are available right now, sorted by proximity, rating, and price.
              </p>
            </div>
            
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-neutral-100 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
              <span className="absolute top-6 right-6 text-6xl font-bold text-neutral-50 group-hover:text-blue-50 transition-colors">03</span>
              <div className="w-14 h-14 bg-[#1d3269] rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3 relative z-10">Book, track, pay safely</h3>
              <p className="text-neutral-500 leading-relaxed relative z-10">
                Confirm the quote, follow the job live, and only pay when the work is done to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600 mb-6">
            Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1844] tracking-tight mb-4">
            Every trade, one platform.
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-16">
            From a leaking pipe to a full apartment renovation — we have verified professionals for every job.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((c, i) => {
              const Icon = ServiceIcons[c.icon] || Wrench;
              const actualCount = stats.categories[c.label.toLowerCase()] || c.count;
              return (
                <div key={i} className="bg-white border border-neutral-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all rounded-[20px] p-6 text-center cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-[#1d3269] group-hover:bg-[#1d3269] group-hover:text-white transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-1">{c.label}</h3>
                  <p className="text-sm text-neutral-400 font-medium">{actualCount} providers</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA FOR PROVIDERS ===== */}
      <section id="for-pros" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-[#1d3269] bg-linear-to-br from-[#1d3269] to-[#122047] rounded-[40px] p-12 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-6 backdrop-blur">
                For Providers
              </div>
              <h2 className="text-4xl md:text-[44px] leading-[1.1] font-bold text-white tracking-tight mb-6">
                Grow your business.<br/>Work on your terms.
              </h2>
              <p className="text-lg text-blue-100/90 leading-relaxed mb-10 max-w-lg">
                Join {stats.providers > 0 ? stats.providers : '540+' } professionals already earning on Tegagn. Set your own hours, choose your jobs, and get paid directly — no middleman, no monthly fees to start.
              </p>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">ETB 22,400</h4>
                    <p className="text-xs text-blue-200/80 mt-0.5">avg. monthly earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Same day</h4>
                    <p className="text-xs text-blue-200/80 mt-0.5">payment on completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Verified badge</h4>
                    <p className="text-xs text-blue-200/80 mt-0.5">builds customer trust</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Flexible hours</h4>
                    <p className="text-xs text-blue-200/80 mt-0.5">work when you want</p>
                  </div>
                </div>
              </div>

              <Link to="/signup?role=provider" className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-xl shadow-[0_4px_20px_0_rgba(249,115,22,0.4)] transition-all">
                Apply as a Provider
              </Link>
            </div>

            <div className="relative hidden lg:block h-full min-h-[400px]">
              <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                <img src={WomanImage} alt="Provider" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-linear-to-t from-[#1d3269]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl">
                  <p className="text-sm font-medium text-white/80 mb-1">This week</p>
                  <p className="text-3xl font-bold text-white mb-2">ETB 6,800</p>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +12% vs last week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-[#f4f7fb] py-24 text-center border-t border-neutral-200">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1844] tracking-tight mb-6">
            Ready to fix it?
          </h2>
          <p className="text-lg text-neutral-500 mb-10 max-w-xl mx-auto">
            Post your first job free. No account needed to browse available providers in your area.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-xl shadow-[0_4px_20px_0_rgba(249,115,22,0.3)] transition-all">
              Find a Provider Now
            </button>
            <button onClick={() => {
              const token = localStorage.getItem('token');
              if (token) navigate('/home');
              else navigate('/login');
            }} className="w-full sm:w-auto px-8 py-4 border-2 border-[#1d3269] text-[#1d3269] hover:bg-[#1d3269]/5 text-base font-semibold rounded-xl transition-all">
              Browse Providers
            </button>
          </div>
          <p className="text-sm text-neutral-400 font-medium">
            No upfront payment · Cancel anytime · 4.8★ average rating
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0b1120] py-20 text-white/70">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <span className="text-lg font-bold text-white leading-none tracking-tighter">m</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Tegagn</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Ethiopia's trusted platform for home services — connecting customers with verified professionals across Addis Ababa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-5">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5">Services</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Plumbing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electrical</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Painting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cleaning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Construction</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}

