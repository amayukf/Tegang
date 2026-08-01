import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { useToast } from '../components/Toast';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';
import { ArrowLeft } from 'lucide-react';

export default function Review() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // For display on the form: the jobId is in the URL; providerId usually comes from the job.
  // We keep an input to allow explicit entry (required by backend) while keeping the UI simple.
  // In a production flow the page would load `/job/:id` and prefill providerId.
  const [providerId, setProviderId] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) { toast.error('Select a rating'); return; }
    if (!comment.trim()) { toast.error('Leave a short comment'); return; }
    if (!providerId.trim()) { toast.error('Provider ID is required'); return; }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/reviews`, {
        jobId,
        providerId: providerId.trim(),
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
            className="mb-5 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> Back
          </button>

          <div className="card p-6 md:p-8">
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
              How was the service?
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Your feedback helps other homeowners find the best providers.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div>
                <label className="form-label">Rating</label>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      aria-label={`Rate ${n} stars`}
                    >
                      <StarRating rating={(hover || rating) >= n ? n : n - 1} size={28} />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-medium text-neutral-700 tabular-nums">{rating}.0</span>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="providerId">Provider ID</label>
                <input
                  id="providerId"
                  type="text"
                  className="input"
                  placeholder="Provider's user or profile ID"
                  value={providerId}
                  onChange={e => setProviderId(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows={5}
                  className="textarea"
                  placeholder="Share what went well, or what could be improved."
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
          </div>
        </div>
      </main>
    </div>
  );
}
