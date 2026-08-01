import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';
import { useToast } from '../components/Toast';
import {
  ArrowLeft, Briefcase, MessageSquare, Calendar, MapPin, Clock, CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

const categoryLabels = {
  plumbing: 'Master Plumber',
  electrical: 'Certified Electrician',
  construction: 'General Contractor',
  painting: 'Professional Painter',
  cleaning: 'Cleaning Specialist',
  other: 'Service Provider',
};

const statusConfig = {
  available_now: { label: 'Available now',   dot: 'bg-success-500', bg: 'bg-success-50', text: 'text-success-700' },
  busy:          { label: 'Busy',            dot: 'bg-neutral-400', bg: 'bg-neutral-50', text: 'text-neutral-600' },
  scheduled:     { label: 'Available tomorrow', dot: 'bg-primary-500', bg: 'bg-primary-50', text: 'text-primary-700' },
};

const skillsByCategory = {
  plumbing:     ['Pipe Repair', 'Leak Detection', 'Water Heater', 'Drainage', 'Fixture Install'],
  electrical:   ['Wiring', 'Panel Upgrade', 'Lighting', 'Generator', 'Safety Inspection'],
  construction: ['Foundation', 'Framing', 'Roofing', 'Tiling', 'Finishing'],
  painting:     ['Interior', 'Exterior', 'Waterproofing', 'Texture', 'Wallpaper'],
  cleaning:     ['Deep Clean', 'Move-out', 'Carpet', 'Window', 'Upholstery'],
};

const Skeleton = () => (
  <div className="min-h-screen bg-neutral-100 flex">
    <Sidebar role="customer" />
    <main className="ml-56 flex-1 p-6">
      <div className="card p-10 text-center">
        <div className="inline-flex items-center gap-2 text-neutral-500">
          <div className="h-4 w-4 rounded-full border-2 border-neutral-200 border-t-primary-600 animate-spin" />
          Loading provider profile…
        </div>
      </div>
    </main>
  </div>
);

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('about');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        axios.get(`${API_BASE_URL}/providers/${id}`),
        axios.get(`${API_BASE_URL}/providers/${id}/reviews`),
      ]);
      setProvider(p.data);
      setReviews(r.data || []);
    } catch {
      toast.error('Could not load provider');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading && !provider) return <Skeleton />;

  const user = provider.userId || {};
  const name = user.name || 'Provider';
  const initial = name.charAt(0).toUpperCase();
  const status = statusConfig[provider.availabilityStatus] || statusConfig.busy;
  const skills = skillsByCategory[provider.category] || ['General Service'];

  const today = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - ((today.getDay() + 6) % 7) + i);
    return d;
  });
  const availDays = [0, 1, 4, 6];

  const ratingCount = provider.ratingCount || 0;
  const bars = [
    { s: 5, pct: 75 }, { s: 4, pct: 20 }, { s: 3, pct: 4 }, { s: 2, pct: 1 }, { s: 1, pct: 0 },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="customer" />

      <main className="ml-56 flex-1 min-w-0">
        {/* Hero banner + back */}
        <div className="relative h-40 bg-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-6 inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur px-3 py-1.5 text-sm text-white hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>
        </div>

        <div className="px-6 -mt-14 flex flex-col lg:flex-row gap-6">
          {/* Left content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Profile header */}
            <section className="card p-6">
              <div className="flex items-start gap-5 flex-wrap">
                <div className="relative shrink-0">
                  {provider.profilePhotoUrl ? (
                    <img
                      src={provider.profilePhotoUrl}
                      alt={name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 text-primary-700 font-semibold text-3xl border-4 border-white shadow">
                      {initial}
                    </div>
                  )}
                  <span
                    className={`absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full ring-4 ring-white ${status.dot}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                        {name}
                      </h1>
                      <p className="mt-0.5 text-sm text-neutral-500 flex flex-wrap items-center gap-1.5">
                        {categoryLabels[provider.category] || provider.category}
                        <span className="text-neutral-300">·</span>
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {provider.location || 'Addis Ababa'}
                      </p>
                    </div>
                    <span className={`badge ${status.bg} ${status.text} border border-current/10`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <StarRating rating={provider.rating} size={15} showValue count={ratingCount} />
                    <span className="text-neutral-300">·</span>
                    <span className="text-neutral-600 tabular-nums">
                      {(ratingCount * 2 || 312).toLocaleString()} jobs
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="inline-flex items-center gap-1 text-success-700 font-medium">
                      <Clock className="h-4 w-4" strokeWidth={1.8} />
                      ~10 min response
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-neutral-500">Starting from · no hidden fees</p>
                      <div className="mt-0.5 flex items-baseline gap-1">
                        <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
                          ETB {Number(provider.priceRangeMin || 0).toLocaleString()}
                        </p>
                        <span className="text-neutral-400">
                          – {Number(provider.priceRangeMax || 0).toLocaleString()}
                        </span>
                        <span className="text-neutral-500 text-sm">/hr</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700 bg-success-50 px-3 py-1 rounded-full border border-success-100">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                      Fixed pricing
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <section className="card overflow-hidden">
              <div role="tablist" className="flex border-b border-neutral-200 px-1">
                {['about', 'reviews', 'photos'].map(t => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`relative px-5 py-3 text-sm font-medium capitalize transition-colors ${
                      tab === t
                        ? 'text-primary-700'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {t}
                    {tab === t && (
                      <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-primary-700 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                        About
                      </h3>
                      <p className="text-[15px] text-neutral-700 leading-relaxed">
                        {provider.bio
                          || `Licensed ${(categoryLabels[provider.category] || 'professional').toLowerCase()} with 9+ years of experience across Addis Ababa. Background-checked and fully insured.`}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(s => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-md bg-neutral-50 border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                        Availability · {today.toLocaleString('default', { month: 'short' })} {today.getFullYear()}
                      </h3>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {weekDays.map((day, i) => {
                          const avail = availDays.includes(i);
                          return (
                            <div key={day} className="flex flex-col items-center gap-2">
                              <p className="text-xs text-neutral-500">{day}</p>
                              <div
                                className={`h-11 w-11 mx-auto flex items-center justify-center rounded-lg text-sm font-medium tabular-nums ${
                                  avail
                                    ? 'bg-success-500 text-white'
                                    : 'bg-neutral-100 text-neutral-400'
                                }`}
                              >
                                {dates[i].getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded bg-success-500 inline-block" /> Available
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded bg-neutral-200 inline-block" /> Unavailable
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="rounded-xl bg-primary-700 text-white p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="text-center sm:text-left">
                          <p className="text-4xl font-semibold tabular-nums">{Number(provider.rating || 0).toFixed(1)}</p>
                          <StarRating rating={provider.rating} size={15} count={ratingCount} />
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                          {bars.map(b => (
                            <div key={b.s} className="flex items-center gap-2 text-xs">
                              <span className="w-3 tabular-nums">{b.s}</span>
                              <div className="h-2 flex-1 rounded-full bg-white/15 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${b.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-neutral-100 -mx-2">
                      {reviews.length > 0 ? reviews.map((rev, i) => {
                        const c = rev.customerId || {};
                        const cName = c.name || 'Customer';
                        return (
                          <div key={rev._id || i} className="py-4 px-2">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 text-sm font-semibold">
                                {cName.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-medium text-neutral-800">{cName}</p>
                                  <StarRating rating={rev.rating} size={13} />
                                </div>
                                <p className="mt-1.5 text-sm text-neutral-700 leading-relaxed">{rev.comment}</p>
                              </div>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="py-10 text-center text-sm text-neutral-500 px-2">
                          No reviews yet. Be the first to leave feedback!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tab === 'photos' && (
                  <div>
                    {provider.workPhotos?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {provider.workPhotos.map((url, i) => (
                          <div
                            key={i}
                            className={`rounded-lg overflow-hidden ${
                              i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                            }`}
                          >
                            <img src={url} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                          <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-neutral-700">No work photos yet</p>
                        <p className="text-sm text-neutral-500">Photos will appear here once uploaded.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right sticky */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  {provider.profilePhotoUrl ? (
                    <img src={provider.profilePhotoUrl} alt={name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-700 font-semibold">
                      {initial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{name}</p>
                    <p className={`text-xs inline-flex items-center gap-1 ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </p>
                  </div>
                </div>

                <div className="divider my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="h-4 w-4 text-neutral-400" strokeWidth={1.8} />
                    <span>Responds ~10 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="h-4 w-4 text-neutral-400" strokeWidth={1.8} />
                    <span className="truncate">{provider.location || 'Addis Ababa'}</span>
                  </div>
                </div>

                <div className="divider my-4" />

                <p className="text-xs text-neutral-500">Hourly rate</p>
                <p className="mt-0.5 text-lg font-semibold text-neutral-900 tabular-nums">
                  ETB {Number(provider.priceRangeMin || 0).toLocaleString()} – {Number(provider.priceRangeMax || 0).toLocaleString()}
                </p>

                <div className="mt-5 space-y-2">
                  <Link
                    to={`/post-job?provider=${provider._id}`}
                    className="btn-accent w-full"
                  >
                    <Briefcase className="h-4 w-4" strokeWidth={2} />
                    Request service
                  </Link>
                  <button
                    type="button"
                    onClick={() => toast.info('Messaging coming soon', 'For now, please request a service.')}
                    className="btn-secondary w-full"
                  >
                    <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
                    Message provider
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-neutral-500">
                  Free to request · Pay only when job is done
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
