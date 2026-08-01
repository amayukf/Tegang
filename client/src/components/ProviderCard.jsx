import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { MapPin, Clock } from 'lucide-react';

const categoryLabels = {
  plumbing: 'Master Plumber',
  electrical: 'Certified Electrician',
  construction: 'General Contractor',
  painting: 'Professional Painter',
  cleaning: 'Cleaning Specialist',
  other: 'Service Provider',
};

const statusConfig = {
  available_now: {
    label: 'Available now',
    dot: 'bg-success-500',
    badge: 'bg-success-50 text-success-700 border border-success-100',
  },
  busy: {
    label: 'Busy',
    dot: 'bg-neutral-400',
    badge: 'bg-neutral-50 text-neutral-600 border border-neutral-200',
  },
  scheduled: {
    label: 'Available tomorrow',
    dot: 'bg-primary-500',
    badge: 'bg-primary-50 text-primary-700 border border-primary-100',
  },
};

const defaultCategoryAvatars = {
  plumbing: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  electrical: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  construction: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  painting: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  cleaning: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
};

export default function ProviderCard({ provider }) {
  const user = provider.userId || {};
  const name = user.name || 'Provider';
  const avatarUrl = provider.profilePhotoUrl || user.profileImage || defaultCategoryAvatars[provider.category] || defaultCategoryAvatars.other;
  const status = statusConfig[provider.availabilityStatus] || statusConfig.busy;

  const priceMin = Number(provider.priceRangeMin || 0);
  const priceMax = Number(provider.priceRangeMax || 0);

  return (
    <Link to={`/provider/${provider._id}`} className="block">
      <div className="card card-hover p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={name}
              className="h-14 w-14 rounded-full object-cover border border-neutral-200 shadow-xs"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-white ${status.dot}`}
              aria-hidden
            />
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-neutral-900 truncate">
                  {name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-500 truncate">
                  <span>{categoryLabels[provider.category] || provider.category}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {provider.location || 'Addis Ababa'}
                  </span>
                </p>
              </div>
              <span className={`badge shrink-0 ${status.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <StarRating
                rating={provider.rating}
                size={13}
                showValue
                count={provider.ratingCount || 0}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                ETB {priceMin.toLocaleString()} – {priceMax.toLocaleString()}
                <span className="ml-1 font-normal text-neutral-500">/hr</span>
              </p>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-success-700">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                ~10 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
