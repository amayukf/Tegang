import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';
import { ArrowLeft, User, ShieldCheck } from 'lucide-react';

export default function Review() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(res.data);
    } catch (err) {
      toast.error('Could not load job details', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [jobId, token, toast]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  const providerObj = job?.providerId || {};
  const providerName = providerObj.name || 'Provider';
  const providerUserId = providerObj._id || (typeof providerObj === 'string' ? providerObj : '');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) { toast.error('Select a rating'); return; }
    if (!comment.trim()) { toast.error('Leave a short comment'); return; }
    if (!providerUserId) { toast.error('Provider information missing'); return; }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/reviews`, {
        jobId,
        providerId: providerUserId,
        rating,
        comment: comment.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Thank you!', 'Your review has been posted.');
      navigate('/requests', { replace: true });
    } catch (err) {
      toast.error('Could not submit review', err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar role="customer" />

      <main className="ml-56 flex-1 min-w-0">
        <div className="px-6 py-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> Back
          </button>

          <div className="card p-6 md:p-8">
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
              How was the service?
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Your feedback helps other homeowners find the best providers on Tegagn.
            </p>

            {loading ? (
              <div className="mt-6 card p-8 text-center text-neutral-500">
                Loading service details…
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-6">
                {/* Provider Card Badge */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-800 font-semibold">
                    <User className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-neutral-900">{providerName}</p>
                      <ShieldCheck className="h-4 w-4 text-success-600" strokeWidth={2} />
                    </div>
                    <p className="text-xs text-neutral-500 capitalize">{job?.category || 'Service'} Job</p>
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="form-label">Overall Rating</label>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform active:scale-95"
                        aria-label={`Rate ${n} stars`}
                      >
                        <StarRating rating={(hover || rating) >= n ? n : n - 1} size={30} />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm font-semibold text-neutral-800 tabular-nums">
                        {rating}.0 / 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment area */}
                <div>
                  <label className="form-label" htmlFor="comment">Your Review</label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="textarea mt-1"
                    placeholder="Describe your experience with this provider..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  />
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
                    className="btn-primary"
                  >
                    {submitting ? 'Submitting…' : 'Submit review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

