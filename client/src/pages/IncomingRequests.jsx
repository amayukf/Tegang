import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import {
  Briefcase, MapPin, Clock, ChevronRight, CheckCircle2, Star,
  Sparkles, Zap, CalendarDays
} from 'lucide-react';

const statusConfig = {
  pending:     { label: 'Pending',     tone: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
  quoted:      { label: 'Quoted',      tone: 'bg-primary-50 text-primary-700 border-primary-100' },
  accepted:    { label: 'Accepted',    tone: 'bg-accent-50 text-accent-700 border-accent-100' },
  in_progress: { label: 'In progress', tone: 'bg-primary-50 text-primary-700 border-primary-100' },
  completed:   { label: 'Completed',   tone: 'bg-success-50 text-success-700 border-success-100' },
};

export default function IncomingRequests() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/incoming`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data || []);
      } catch (err) {
        toast.error('Could not load jobs', err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, toast]);

  const pending = jobs.filter(j => j.status === 'pending');
  const active = jobs.filter(j => ['quoted', 'accepted', 'in_progress'].includes(j.status));
  const done = jobs.filter(j => j.status === 'completed');

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="provider" />

      <main className="ml-56 flex-1 min-w-0 p-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Incoming requests
            </h1>
            <p className="mt-1 text-sm text-neutral-500 flex items-center gap-1">
              <Briefcase className="h-4 w-4" strokeWidth={1.8} />
              {loading ? 'Loading…' : `${pending.length} new · ${active.length} active · ${done.length} completed`}
            </p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            Dashboard overview
          </Link>
        </div>

        <div className="mt-6 space-y-8">
          <Section
            title="New requests"
            subtitle="Jobs waiting for your quote"
            icon={<Sparkles className="h-4 w-4" strokeWidth={1.8} />}
            tone="bg-accent-50 text-accent-700 border-accent-100"
            items={pending}
            loading={loading}
            emptyText="No new requests yet — check back soon."
          />
          <Section
            title="Active jobs"
            subtitle="Quoted, accepted, and in progress"
            icon={<Zap className="h-4 w-4" strokeWidth={1.8} />}
            tone="bg-primary-50 text-primary-700 border-primary-100"
            items={active}
            loading={loading}
            emptyText="You have no active jobs."
          />
          <Section
            title="Completed"
            subtitle="Recently finished work"
            icon={<CheckCircle2 className="h-4 w-4" strokeWidth={2} />}
            tone="bg-success-50 text-success-700 border-success-100"
            items={done}
            loading={loading}
            emptyText="Completed jobs will appear here."
            collapseEmpty
          />
        </div>
      </main>
    </div>
  );

  function Section({ title, subtitle, icon, tone, items, loading, emptyText, collapseEmpty }) {
    if (collapseEmpty && !loading && items.length === 0) return null;
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 badge ${tone}`}>
              {icon}
              {title}
              <span className="tabular-nums opacity-70">· {items.length}</span>
            </span>
            <span className="text-xs text-neutral-500">{subtitle}</span>
          </div>
        </div>
        {loading && items.length === 0 ? (
          <div className="card p-8 text-center text-neutral-500">Loading {title.toLowerCase()}…</div>
        ) : items.length === 0 ? (
          <Empty text={emptyText} />
        ) : (
          <div className="space-y-3">
            {items.map(job => {
              const cfg = statusConfig[job.status] || statusConfig.pending;
              const cust = (job.customerId && job.customerId.name) || 'Customer';
              const urgencyBadge = job.urgency === 'now'
                ? 'bg-accent-50 text-accent-700 border border-accent-100'
                : 'bg-neutral-50 text-neutral-600 border border-neutral-200';
              return (
                <Link
                  key={job._id}
                  to={`/job/${job._id}`}
                  className="card card-hover p-5 block"
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                            <Star className="h-4 w-4" strokeWidth={1.8} />
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold capitalize text-neutral-900 leading-tight">
                              {job.category}
                            </p>
                            <p className="text-xs text-neutral-500">for {cust}</p>
                          </div>
                        </div>
                        <span className={`badge ${cfg.tone}`}>{cfg.label}</span>
                      </div>

                      <p className="mt-2 text-sm text-neutral-600 line-clamp-1">
                        {job.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="inline-flex items-center gap-1 text-neutral-500">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                          {job.location || 'Location TBD'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-neutral-500">
                          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : 'Recently'}
                        </span>
                        <span className="inline-flex items-center gap-1 tabular-nums font-medium text-neutral-700">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                          ETB {Number(job.budgetMin || 0).toLocaleString()}–{Number(job.budgetMax || 0).toLocaleString()}
                        </span>
                        <span className={`badge ${urgencyBadge}`}>
                          {job.urgency === 'now' ? <><Zap className="h-3 w-3" strokeWidth={2.5} /> Urgent</> : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-300 mt-1" strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    );
  }
}

function Empty({ text }) {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
        <Briefcase className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <p className="text-sm text-neutral-500">{text}</p>
    </div>
  );
}
