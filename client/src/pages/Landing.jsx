import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, MapPin, Clock, ArrowRight, Wrench, CheckCircle2,
  ChevronRight, Star, UserCheck, Wallet
} from 'lucide-react';
import { BrandMark } from '../components/Sidebar';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified & Insured',
    desc: 'Every provider is background-checked, licensed and fully insured. Quality work with zero surprises.',
  },
  {
    icon: Clock,
    title: 'Available Right Now',
    desc: 'See who is on-call in your neighbourhood, and book same-day service in as little as 30 minutes.',
  },
  {
    icon: Wallet,
    title: 'Upfront Transparent Pricing',
    desc: 'See hourly rates before you book. No hidden fees, no surprise add-ons — ever.',
  },
  {
    icon: UserCheck,
    title: 'Real Customer Reviews',
    desc: 'Read genuine reviews from real homeowners in Addis Ababa before you make your decision.',
  },
  {
    icon: MapPin,
    title: 'Local Professionals',
    desc: 'Every provider lives and works in Addis Ababa. We know Bole from Kazanchis.',
  },
  {
    icon: Wrench,
    title: 'All Home Services',
    desc: 'Plumbing, electrical, painting, cleaning, construction — one app for everything your home needs.',
  },
];

const categories = [
  { label: 'Plumbing',     count: 120 },
  { label: 'Electrical',   count: 86 },
  { label: 'Construction', count: 54 },
  { label: 'Painting',     count: 41 },
  { label: 'Cleaning',     count: 77 },
  { label: 'Carpentry',    count: 33 },
];

const stats = [
  { value: '12,000+', label: 'Happy customers' },
  { value: '480+',   label: 'Vetted providers' },
  { value: '96%',    label: 'Job completion' },
  { value: '4.8',    label: 'Average rating' },
];

const testimonials = [
  {
    quote: 'The electrician showed up in 40 minutes, fixed everything and cleaned up. I was shocked how professional it was.',
    name: 'Sara Mulugeta',
    location: 'Bole, Addis Ababa',
    rating: 5,
  },
  {
    quote: 'I posted a plumbing job at 8pm and had three quotes by 9am the next day. The whole process was seamless.',
    name: 'Kebede Alemu',
    location: 'Kazanchis',
    rating: 5,
  },
  {
    quote: 'Pricing was fair, the painter was respectful, and the quality is outstanding. I will use Tegagn every time.',
    name: 'Hana Tesfaye',
    location: 'Sar Bet',
    rating: 5,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-neutral-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-neutral-200/80">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary"
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                Now serving 10 woredas across Addis Ababa
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.05]">
                The reliable way to get help around your home.
              </h1>
              <p className="mt-5 text-lg text-neutral-600 leading-relaxed max-w-xl">
                Tegagn connects Addis Ababa homeowners with verified, insured local professionals —
                plumbing, electrical, cleaning, painting, and more — in minutes, not days.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/signup" className="btn-primary h-11 px-5">
                  Book a service
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
                <Link to="/signup?role=provider" className="btn-secondary h-11 px-5">
                  I&apos;m a provider
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-9 w-9 rounded-full border-2 border-white bg-neutral-${[200,300,200,300][i]} -ml-2 first:ml-0`} />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                    ))}
                    <span className="ml-1 font-semibold text-neutral-800">4.8</span>
                  </div>
                  <p className="text-neutral-500">Based on 3,200+ real reviews</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-3xl blur-2xl opacity-70" />
              <div className="relative card p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-800">Plumbers near you</p>
                  <p className="text-xs text-neutral-500">Bole sub-city</p>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { name: 'Dawit T.', role: 'Master Plumber', rating: 4.9, reviews: 128, price: 350, now: true  },
                    { name: 'Mekdes A.', role: 'Plumbing Expert', rating: 4.8, reviews: 92,  price: 300, now: true  },
                    { name: 'Samson K.', role: 'Licensed Plumber', rating: 4.7, reviews: 61, price: 280, now: false },
                  ].map(p => (
                    <div key={p.name} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3 hover:border-neutral-200 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                          {p.now ? (
                            <span className="badge bg-success-50 text-success-700 border border-success-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                              Now
                            </span>
                          ) : (
                            <span className="badge bg-neutral-100 text-neutral-600">Tomorrow</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">{p.role} · {p.reviews} jobs</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-neutral-900">ETB {p.price}</p>
                        <div className="flex items-center gap-0.5 justify-end">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                          <span className="text-[11px] text-neutral-600">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-semibold text-neutral-900 tabular-nums">{s.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">How it works</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Book a pro in three simple steps.
          </h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Tell us what you need',
              desc: 'Post a job in under 60 seconds — pick a category, describe the work, set a budget.',
            },
            {
              step: '02',
              title: 'Review & choose',
              desc: 'Receive quotes from qualified providers nearby. Compare ratings, prices and availability.',
            },
            {
              step: '03',
              title: 'Pay when done',
              desc: 'Your provider shows up, does the work, and you pay only when you are 100% satisfied.',
            },
          ].map(block => (
            <div key={block.step} className="card p-6 card-hover">
              <p className="text-sm font-semibold text-primary-700">{block.step}</p>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">{block.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{block.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">Why Tegagn</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Built for a world that deserves better home services.
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-6 card-hover">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">Categories</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Every home service. One place.
            </h2>
          </div>
          <Link to="/signup" className="text-sm font-medium text-primary-700 inline-flex items-center gap-1 hover:text-primary-800">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(c => (
            <div key={c.label} className="card p-4 card-hover cursor-pointer text-center">
              <p className="text-sm font-semibold text-neutral-800">{c.label}</p>
              <p className="mt-1 text-xs text-neutral-500">{c.count} pros</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">Loved by Addis Ababa</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Trusted by real homeowners.
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <figure key={t.name} className="card p-6">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm text-neutral-700 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 pt-5 border-t border-neutral-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="card overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 border-0 text-white">
          <div className="px-8 py-14 md:px-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Your home doesn&apos;t have to wait.
              </h2>
              <p className="mt-3 text-primary-100 text-base leading-relaxed">
                Join over 12,000 Addis Ababa residents who get reliable, affordable home services delivered to their door.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn bg-white text-primary-800 hover:bg-neutral-50 h-11 px-5 font-semibold">
                Get started
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link to="/signup?role=provider" className="btn border border-white/30 text-white hover:bg-white/10 h-11 px-5">
                Become a provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <BrandMark />
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Tegagn Technologies PLC · Addis Ababa, Ethiopia
          </p>
          <div className="flex items-center gap-5 text-sm text-neutral-500">
            <a className="hover:text-neutral-700" href="#">Privacy</a>
            <a className="hover:text-neutral-700" href="#">Terms</a>
            <a className="hover:text-neutral-700" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
