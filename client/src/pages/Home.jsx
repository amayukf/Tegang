import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import Sidebar from '../components/Sidebar';
import ProviderCard from '../components/ProviderCard';
import {
  Search, MapPin, Bell, Briefcase, Sun, CloudSun, Sunset,
  Wrench, Zap, Building2, Paintbrush, Sparkles, Hammer,
  LayoutList, LayoutGrid, ChevronDown
} from 'lucide-react';
import { useToast } from '../components/Toast';

const categories = [
  { key: 'all',          label: 'All Services', icon: Wrench },
  { key: 'plumbing',     label: 'Plumbing',     icon: Wrench },
  { key: 'electrical',   label: 'Electrical',   icon: Zap },
  { key: 'construction', label: 'Construction', icon: Building2 },
  { key: 'painting',     label: 'Painting',     icon: Paintbrush },
  { key: 'cleaning',     label: 'Cleaning',     icon: Sparkles },
  { key: 'other',        label: 'Carpentry',    icon: Hammer },
];

const sortOptions = [
  { key: 'available', label: 'Available first' },
  { key: 'all',       label: 'All' },
  { key: 'rating',    label: 'Top rated' },
  { key: 'price',     label: 'Price: Low to High' },
];

function greetingForHour(h) {
  if (h < 12) return { label: 'Good morning', Icon: Sun };
  if (h < 18) return { label: 'Good afternoon', Icon: CloudSun };
  return { label: 'Good evening', Icon: Sunset };
}

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('available');
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const userName = (localStorage.getItem('userName') || '').trim() || 'there';

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedSort === 'available') params.availabilityStatus = 'available_now';
      if (selectedSort === 'rating') params.sort = 'rating';
      if (selectedSort === 'price') params.sort = 'price';
      const res = await axios.get(`${API_BASE_URL}/providers`, { params });
      setProviders(res.data || []);
    } catch {
      toast.error('Could not load providers', 'Please try again later');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSort, toast]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const { label: greeting, Icon: GreetIcon } = greetingForHour(new Date().getHours());
  const sortLabel = sortOptions.find(o => o.key === selectedSort)?.label || 'Sort';

  const filtered = providers.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const u = p.userId || {};
    return (u.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.bio || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="customer" />

      <main className="ml-56 flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
          <div className="px-6 h-16 flex items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700 border border-neutral-200">
              <MapPin className="h-4 w-4 text-neutral-500" strokeWidth={1.8} />
              <span className="font-medium">Bole, Addis Ababa</span>
            </div>

            <div className="flex-1 max-w-xl relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" strokeWidth={1.8} />
              <input
                type="search"
                placeholder="Search services, providers, or locations…"
                className="input pl-10 py-2.5"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500" />
            </button>
          </div>
        </header>

        <div className="px-6 py-6 space-y-6 max-w-6xl">
          {/* Greeting card */}
          <section className="card overflow-hidden">
            <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 text-sm text-primary-700 font-medium">
                  <GreetIcon className="h-4 w-4" strokeWidth={1.8} />
                  {greeting}, {userName.split(' ')[0]}
                </div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                  What do you need help with today?
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Post a job in under 60 seconds and receive quotes from vetted local professionals.
                </p>
              </div>
              <button
                onClick={() => navigate('/post-job')}
                className="btn-accent h-11 px-5 shrink-0 self-start md:self-center"
              >
                <Briefcase className="h-4 w-4" strokeWidth={2} />
                Post a job
              </button>
            </div>
          </section>

          {/* Category chips */}
          <section>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {categories.map(cat => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                      active
                        ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Controls */}
          <section className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {loading ? '—' : filtered.length}
                </span>
                {` providers · sorted by ${sortLabel.toLowerCase()}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(v => !v)}
                  onBlur={() => setTimeout(() => setSortOpen(false), 120)}
                  className="btn-secondary !py-2 h-9 gap-1.5"
                >
                  <span className="text-neutral-500">Sort:</span>
                  {sortLabel}
                  <ChevronDown className="h-4 w-4 text-neutral-500" strokeWidth={2} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 card py-1 z-20">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.key}
                        onMouseDown={() => { setSelectedSort(opt.key); setSortOpen(false); }}
                        className={`block w-full text-left px-3 py-2 text-sm ${
                          selectedSort === opt.key
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="h-6 w-px bg-neutral-200 mx-1" />
              <button className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50" aria-label="List view">
                <LayoutList className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </button>
              <button className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 bg-white" aria-label="Grid view" disabled>
                <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </button>
            </div>
          </section>

          {/* Providers */}
          <section className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-neutral-100 animate-pulse" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
                      <div className="h-3.5 w-64 bg-neutral-100 rounded animate-pulse" />
                      <div className="h-3.5 w-40 bg-neutral-100 rounded animate-pulse" />
                      <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map(p => <ProviderCard key={p._id} provider={p} />)
            ) : (
              <div className="card p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
                  <Search className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-neutral-800">No providers match your filters</h3>
                <p className="mt-1 text-sm text-neutral-500 max-w-sm mx-auto">
                  Try selecting a different category, clearing your search, or checking back later.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearch(''); setSelectedSort('all'); }}
                  className="mt-4 btn-secondary"
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
