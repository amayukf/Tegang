import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import {
  ClipboardList, MapPin, CalendarClock, ChevronRight, Search,
  FileText
} from 'lucide-react';

const statusConfig = {
  pending:     { label: 'Pending',     tone: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
  quoted:      { label: 'Quoted',      tone: 'bg-primary-50 text-primary-700 border-primary-100' },
  accepted:    { label: 'Accepted',    tone: 'bg-accent-50 text-accent-700 border-accent-100' },
  in_progress: { label: 'In progress', tone: 'bg-primary-50 text-primary-700 border-primary-100' },
  completed:   { label: 'Completed',   tone: 'bg-success-50 text-success-700 border-success-100' },
  cancelled:   { label: 'Cancelled',   tone: 'bg-neutral-50 text-neutral-500 border-neutral-200' },
};

const categories = ['All', 'Plumbing', 'Electrical', 'Construction', 'Painting', 'Cleaning', 'Other'];

export default function MyRequests() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const toast = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data || []);
      } catch (err) {
        toast.error('Could not load requests', err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, toast]);

  const filtered = jobs.filter(j => {
    const byCat = filter === 'All' || (j.category && j.category.toLowerCase() === filter.toLowerCase());
    const q = search.trim().toLowerCase();
    const bySearch = !q ||
      (j.description && j.description.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q));
    return byCat && bySearch;
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="customer" />

      <main className="ml-56 flex-1 min-w-0 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              My requests
            </h1>
            <p className="mt-1 text-sm text-neutral-500 flex items-center gap-1">
              <ClipboardList className="h-4 w-4" strokeWidth={1.8} />
              {loading ? 'Loading…' : `${jobs.length} total jobs`}
            </p>
          </div>

          <Link to="/post-job" className="btn-accent">
            <FileText className="h-4 w-4" strokeWidth={2} />
            Post new job
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search by description or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input !pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === c
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <section className="mt-5">
          {loading ? (
            <div className="card p-10 text-center text-neutral-500">
              Loading your requests…
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                <ClipboardList className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-semibold text-neutral-800">No requests yet</h3>
              <p className="mt-1 text-sm text-neutral-500 max-w-sm mx-auto">
                {jobs.length === 0
                  ? 'Post a job to get quotes from verified providers in your area.'
                  : 'No jobs match your filter — try clearing it.'}
              </p>
              {jobs.length === 0 && (
                <Link to="/post-job" className="btn-primary mt-5 inline-flex">
                  Post your first job
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(job => {
                const cfg = statusConfig[job.status] || statusConfig.pending;
                const prov = job.providerId || {};
                const provUser = prov.userId || {};
                return (
                  <Link
                    key={job._id}
                    to={`/job/${job._id}`}
                    className="card card-hover p-5 block"
                  >
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-semibold text-neutral-900 capitalize">
                            {job.category}
                          </p>
                          <span className={`badge ${cfg.tone}`}>{cfg.label}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-neutral-600 line-clamp-1">
                          {job.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                            {job.location || 'Not specified'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                              : 'Recent'}
                          </span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            ETB {Number(job.budgetMin || 0).toLocaleString()}–{Number(job.budgetMax || 0).toLocaleString()}
                          </span>
                        </div>

                        {provUser.name && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-1.5 text-xs">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold">
                              {provUser.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-neutral-700">{provUser.name}</span>
                            {typeof prov.rating === 'number' && (
                              <StarRating rating={prov.rating} size={12} />
                            )}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-neutral-300 mt-1" strokeWidth={2} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
