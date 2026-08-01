import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import {
  Wrench, Zap, Building2, Paintbrush, Sparkles, Settings2,
  Clock, CalendarDays
} from 'lucide-react';

const categories = [
  { key: 'plumbing',     label: 'Plumbing',     icon: Wrench },
  { key: 'electrical',   label: 'Electrical',   icon: Zap },
  { key: 'construction', label: 'Construction', icon: Building2 },
  { key: 'painting',     label: 'Painting',     icon: Paintbrush },
  { key: 'cleaning',     label: 'Cleaning',     icon: Sparkles },
  { key: 'other',        label: 'Carpentry',    icon: Settings2 },
];

export default function PostJob() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();
  const token = localStorage.getItem('token');
  const preselectedProvider = params.get('provider');

  const [targetProvider, setTargetProvider] = useState(null);
  const [form, setForm] = useState({
    category: 'plumbing',
    description: '',
    location: '',
    urgency: 'now',
    scheduledDate: '',
    budgetMin: '',
    budgetMax: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedProvider) {
      axios.get(`${API_BASE_URL}/providers/${preselectedProvider}`)
        .then(res => {
          setTargetProvider(res.data);
          if (res.data.category) {
            setForm(f => ({ ...f, category: res.data.category }));
          }
        })
        .catch(() => {});
    }
  }, [preselectedProvider]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const min = Number(form.budgetMin);
    const max = Number(form.budgetMax);
    if (!form.description.trim()) return toast.error('Add a description');
    if (!form.location.trim()) return toast.error('Add a location');
    if (Number.isNaN(min) || Number.isNaN(max) || min < 0) return toast.error('Enter a valid budget');
    if (max < min) return toast.error('Max budget must be above min budget');
    if (form.urgency === 'scheduled' && !form.scheduledDate)
      return toast.error('Pick a scheduled date');

    setSubmitting(true);
    try {
      const payload = { ...form, budgetMin: min, budgetMax: max };
      if (preselectedProvider) payload.providerId = preselectedProvider;

      const res = await axios.post(`${API_BASE_URL}/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Job posted', 'Providers will send quotes shortly.');
      navigate(`/job/${res.data._id}`, { replace: true });
    } catch (err) {
      toast.error('Could not post job', err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="customer" />

      <main className="ml-56 flex-1 min-w-0">
        <div className="px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Post a job
            </h1>
            {targetProvider && (
              <div className="mt-4 p-4 rounded-xl bg-primary-50 border border-primary-200 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-white font-semibold text-sm">
                  {(targetProvider.userId?.name || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Direct Request</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {targetProvider.userId?.name || 'Provider'} ({targetProvider.category})
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              {/* Category */}
              <div>
                <h2 className="form-label">Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const active = form.category === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setField('category', cat.key)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'bg-primary-50 border-primary-600 text-primary-700 ring-1 ring-primary-600/20'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="desc" className="form-label">Description</label>
                <textarea
                  id="desc"
                  rows={4}
                  className="textarea"
                  placeholder="Share details: room size, fixture type, materials, etc."
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="loc" className="form-label">Location</label>
                <input
                  id="loc"
                  type="text"
                  className="input"
                  placeholder="e.g. Bole Medhanialem, Addis Ababa"
                  value={form.location}
                  onChange={e => setField('location', e.target.value)}
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <h2 className="form-label">When do you need it?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setField('urgency', 'now')}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left ${
                      form.urgency === 'now'
                        ? 'bg-accent-50 border-accent-500 text-accent-700 ring-1 ring-accent-500/20'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <div>
                      <p className="text-sm font-medium">As soon as possible</p>
                      <p className="text-xs opacity-80">Usually same day</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setField('urgency', 'scheduled')}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left ${
                      form.urgency === 'scheduled'
                        ? 'bg-primary-50 border-primary-600 text-primary-700 ring-1 ring-primary-600/20'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <div>
                      <p className="text-sm font-medium">Schedule for later</p>
                      <p className="text-xs opacity-80">Pick a date & time</p>
                    </div>
                  </button>
                </div>
                {form.urgency === 'scheduled' && (
                  <input
                    type="date"
                    className="input mt-3"
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.scheduledDate}
                    onChange={e => setField('scheduledDate', e.target.value)}
                  />
                )}
              </div>

              {/* Budget */}
              <div>
                <h2 className="form-label">Budget range (ETB)</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    className="input"
                    placeholder="Min"
                    value={form.budgetMin}
                    onChange={e => setField('budgetMin', e.target.value)}
                    required
                  />
                  <span className="text-neutral-400">–</span>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    placeholder="Max"
                    value={form.budgetMax}
                    onChange={e => setField('budgetMax', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent"
                >
                  {submitting ? 'Posting…' : 'Post job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
