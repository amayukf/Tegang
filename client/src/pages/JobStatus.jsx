import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';
import {
  ArrowLeft, CheckCircle2, Tag, MapPin, Clock, Zap, CalendarDays
} from 'lucide-react';

const steps = ['pending', 'quoted', 'accepted', 'in_progress', 'completed'];
const stepLabels = {
  pending: 'Pending',
  quoted: 'Quoted',
  accepted: 'Accepted',
  in_progress: 'In progress',
  completed: 'Completed',
};

export default function JobStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quotePrice, setQuotePrice] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(res.data);
    } catch (err) {
      toast.error('Could not load job', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, toast]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  const runAction = async (action, body, successMsg) => {
    if (busy) return;
    setBusy(true);
    try {
      await axios.patch(`${API_BASE_URL}/jobs/${id}/${action}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (successMsg) toast.success(successMsg);
      fetchJob();
    } catch (err) {
      toast.error('Action failed', err.response?.data?.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading && !job) {
    return (
      <div className="min-h-screen bg-neutral-100 flex">
        <Sidebar role={role} />
        <main className="ml-56 flex-1 p-6">
          <div className="card p-8 text-center text-neutral-500">Loading job details…</div>
        </main>
      </div>
    );
  }
  if (!job) return null;

  const current = Math.max(0, steps.indexOf(job.status));

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role={role} />

      <main className="ml-56 flex-1 min-w-0">
        <div className="px-6 py-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>

          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Job details
          </h1>
          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{job.description}</p>

          {/* Stepper */}
          <section className="card p-6 mt-5">
            <ol className="flex items-center">
              {steps.map((s, i) => {
                const done = i < current;
                const active = i === current;
                return (
                  <li key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                          done
                            ? 'bg-success-600 text-white'
                            : active
                            ? 'bg-primary-700 text-white'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} /> : i + 1}
                      </div>
                      <p
                        className={`mt-2 text-xs font-medium ${
                          done || active ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {stepLabels[s]}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`mx-2 flex-1 h-0.5 ${done ? 'bg-success-500' : 'bg-neutral-200'}`} />
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Summary table */}
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Row label="Category" value={<span className="capitalize">{job.category}</span>} />
              <Row label="Location" value={
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
                  {job.location || '—'}
                </span>
              } />
              <Row
                label="Urgency"
                value={
                  <span className={`badge ${job.urgency === 'now'
                    ? 'bg-accent-50 text-accent-700 border border-accent-100'
                    : 'bg-primary-50 text-primary-700 border border-primary-100'
                  }`}>
                    {job.urgency === 'now'
                      ? <><Zap className="h-3 w-3" strokeWidth={2.5} /> Urgent</>
                      : <><CalendarDays className="h-3 w-3" strokeWidth={2} /> Scheduled</>}
                  </span>
                }
              />
              <Row
                label="Budget"
                value={
                  <span className="inline-flex items-center gap-1 font-semibold text-neutral-800 tabular-nums">
                    <Tag className="h-4 w-4 text-neutral-400" strokeWidth={1.8} />
                    ETB {Number(job.budgetMin || 0).toLocaleString()} – {Number(job.budgetMax || 0).toLocaleString()}
                  </span>
                }
              />
              {job.agreedPrice ? (
                <Row
                  label="Agreed price"
                  value={<span className="font-semibold text-success-700 tabular-nums">
                    ETB {Number(job.agreedPrice).toLocaleString()}
                  </span>}
                />
              ) : null}
              {job.createdAt && (
                <Row
                  label="Posted"
                  value={
                    <span className="text-neutral-600">
                      {new Date(job.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  }
                />
              )}
            </dl>
          </section>

          {/* Actions */}
          <section className="card p-6 mt-5">
            {/* Provider: quote pending */}
            {role === 'provider' && job.status === 'pending' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="qp" className="form-label">Your quote (ETB)</label>
                  <input
                    id="qp"
                    type="number"
                    min={0}
                    className="input"
                    placeholder="Enter price"
                    value={quotePrice}
                    onChange={e => setQuotePrice(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => runAction('quote', { agreedPrice: Number(quotePrice) }, 'Quote sent')}
                  disabled={busy || !quotePrice || Number(quotePrice) <= 0}
                  className="btn-primary w-full"
                >
                  {busy ? 'Sending…' : 'Send quote'}
                </button>
              </div>
            )}

            {/* Customer: accept quote */}
            {role === 'customer' && job.status === 'quoted' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-center">
                  <p className="text-sm text-neutral-600">Provider quoted</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-primary-700">
                    ETB {Number(job.agreedPrice || 0).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => runAction('accept', null, 'Quote accepted')}
                  disabled={busy}
                  className="btn w-full !bg-success-600 text-white hover:!bg-success-700"
                >
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                  Accept quote
                </button>
              </div>
            )}

            {/* Provider: start job */}
            {role === 'provider' && job.status === 'accepted' && (
              <button
                onClick={() => runAction('status', { status: 'in_progress' }, 'Job started')}
                disabled={busy}
                className="btn-accent w-full"
              >
                <Clock className="h-4 w-4" strokeWidth={2} />
                Start job
              </button>
            )}

            {/* Provider: complete */}
            {role === 'provider' && job.status === 'in_progress' && (
              <button
                onClick={() => runAction('status', { status: 'completed' }, 'Job marked complete')}
                disabled={busy}
                className="btn w-full !bg-success-600 text-white hover:!bg-success-700"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                Mark as completed
              </button>
            )}

            {/* Completed */}
            {job.status === 'completed' && (
              <div className="text-center py-2">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900">Job completed</h3>
                <p className="text-sm text-neutral-500">Thank you for using Tegagn.</p>
                {role === 'customer' && (
                  <Link to={`/review/${job._id}`} className="btn-accent mt-4">
                    Leave a review
                  </Link>
                )}
              </div>
            )}

            {/* Cancelled */}
            {job.status === 'cancelled' && (
              <div className="text-center py-2">
                <h3 className="text-base font-semibold text-neutral-900">Job cancelled</h3>
                <p className="text-sm text-neutral-500">This job is no longer active.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-neutral-100 last:border-0 sm:border-0 sm:py-1">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-800">{value}</dd>
    </div>
  );
}
