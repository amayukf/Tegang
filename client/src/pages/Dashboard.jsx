import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import {
  CircleDot, CircleOff, ClipboardList, Star, CheckCircle2, TrendingUp,
  MapPin, Clock, Zap
} from 'lucide-react';

export default function Dashboard() {
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [isLive, setIsLive] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomingJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data || []);
    } catch {
      toast.error('Could not load incoming jobs');
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => { fetchIncomingJobs(); }, [fetchIncomingJobs]);

  const toggleAvailability = async () => {
    if (toggling) return;
    setToggling(true);
    const next = !isLive;
    try {
      await axios.patch(
        `${API_BASE_URL}/providers/me/availability`,
        { availabilityStatus: next ? 'available_now' : 'busy' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLive(next);
      toast.success(next ? 'You are now live' : 'You are now offline');
    } catch (err) {
      toast.error('Could not update availability', err.response?.data?.message);
    } finally {
      setToggling(false);
    }
  };

  const displayJobs = jobs.length > 0 ? jobs : [];

  const Stat = ({ label, value, hint, Icon, tone = 'neutral' }) => {
    const tones = {
      neutral:  'bg-neutral-50  text-neutral-700',
      success:  'bg-success-50  text-success-700',
      primary:  'bg-primary-50  text-primary-700',
      accent:   'bg-accent-50   text-accent-700',
      warn:     'bg-warning-50  text-warning-700',
    };
    return (
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900">{value}</p>
            {hint && <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>}
          </div>
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
        </div>
      </div>
    );
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} min ago`;
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day(s) ago`;
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="provider" />

      <main className="ml-56 flex-1 min-w-0">
        <div className="px-6 py-6 max-w-5xl space-y-6">
          {/* Availability card */}
          <section className={`card overflow-hidden border-l-4 ${isLive ? 'border-l-success-500' : 'border-l-neutral-300'}`}>
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${isLive ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {isLive
                    ? <CircleDot className="h-5 w-5 animate-pulse" strokeWidth={1.8} />
                    : <CircleOff className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {isLive ? "You're live" : "You're offline"}
                    </h2>
                    {isLive && <span className="badge bg-success-50 text-success-700 border border-success-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                      Visible to customers
                    </span>}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {isLive
                      ? 'Customers in your area can now find and book you.'
                      : 'Toggle availability to start receiving new requests.'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAvailability}
                disabled={toggling}
                role="switch"
                aria-checked={isLive}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:opacity-60 ${
                  isLive ? 'bg-success-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    isLive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Today"      value="ETB 1,200" hint="+12% vs. yesterday" Icon={TrendingUp}   tone="primary" />
            <Stat label="This week"  value="ETB 6,800" hint="across 8 jobs"         Icon={ClipboardList} tone="neutral" />
            <Stat label="Rating"     value="4.9"       hint="134 reviews"           Icon={Star}          tone="warn" />
            <Stat label="Jobs done"  value="312"       hint="lifetime"              Icon={CheckCircle2}   tone="success" />
          </section>

          {/* Incoming requests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Incoming requests</h3>
                <p className="text-sm text-neutral-500">New job posts matching your category.</p>
              </div>
              {displayJobs.length > 0 && (
                <span className="badge bg-accent-50 text-accent-700 border border-accent-100">
                  {displayJobs.length} new
                </span>
              )}
            </div>

            {loading ? (
              <div className="card divide-y divide-neutral-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5">
                    <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse mb-3" />
                    <div className="h-3.5 w-1/2 bg-neutral-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : displayJobs.length > 0 ? (
              <div className="card divide-y divide-neutral-100 overflow-hidden">
                {displayJobs.map(job => {
                  const customer = job.customerId || {};
                  const customerName = customer.name || 'Customer';
                  return (
                    <Link
                      key={job._id}
                      to={`/job/${job._id}`}
                      className="block p-5 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 font-semibold">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-neutral-900 truncate">{job.description}</h4>
                              <p className="mt-0.5 text-sm text-neutral-500">
                                {customerName} · {timeAgo(job.createdAt)}
                              </p>
                            </div>
                            <span className={`badge shrink-0 ${
                              job.urgency === 'now'
                                ? 'bg-accent-50 text-accent-700 border border-accent-100'
                                : 'bg-primary-50 text-primary-700 border border-primary-100'
                            }`}>
                              {job.urgency === 'now' ? (
                                <><Zap className="h-3 w-3" strokeWidth={2.5} /> Urgent</>
                              ) : (
                                <><Clock className="h-3 w-3" strokeWidth={2} /> Scheduled</>
                              )}
                            </span>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                              ETB {Number(job.budgetMin || 0).toLocaleString()} – {Number(job.budgetMax || 0).toLocaleString()}
                            </p>
                            <p className="inline-flex items-center gap-1 text-sm text-neutral-500">
                              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                              {job.location || '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="card p-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 mb-3">
                  <ClipboardList className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-semibold text-neutral-800">No incoming requests</h4>
                <p className="mt-1 text-sm text-neutral-500">
                  Toggle availability above to show up for customers nearby.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
