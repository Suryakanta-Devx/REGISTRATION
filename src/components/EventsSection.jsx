import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import TiltCard from './TiltCard';
import MagneticButton from './MagneticButton';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'Technical', 'Robotics', 'Cultural', 'Sports', 'Creative', 'Gaming', 'Academic'];

const CATEGORY_COLORS = {
  Technical: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
  Robotics: 'text-orange-300 border-orange-500/30 bg-orange-500/10',
  Cultural: 'text-pink-300 border-pink-500/30 bg-pink-500/10',
  Sports: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  Creative: 'text-fuchsia-300 border-fuchsia-500/30 bg-fuchsia-500/10',
  Gaming: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
  Academic: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10'
};

const EventsSection = ({ events = [], loading, error, onRegisterEvent }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const gridRef = useRef(null);
  const reduced = useReducedMotionPref();

  const filtered = events.filter((ev) => {
    const matchCat = activeCategory === 'All' || ev.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ =
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  useEffect(() => {
    if (reduced || !gridRef.current || filtered.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.event-card-item', {
        y: 34,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 82%',
          once: true
        }
      });
    }, gridRef);
    return () => ctx.revert();
  }, [reduced, filtered.length]);

  return (
    <section id="events" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-blue-300 uppercase">
            Explore 7 Dynamic Verticals
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Festival <span className="text-gradient-fest">Events &amp; Competitions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Filter across Technical, Robotics, Cultural, Sports, Creative, Gaming, and Academic tracks. Powered live from MongoDB.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by name, track, or venue..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pr-5 pl-11 text-sm text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="mt-12 text-center text-slate-400">Loading live events from database...</div>
        )}

        {error && !loading && (
          <div className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-200">
            Could not load events from backend API ({error}). Make sure the Express server is running on port 5000.
          </div>
        )}

        {!loading && !error && (
          <div ref={gridRef} className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ev) => {
              const badgeCls = CATEGORY_COLORS[ev.category] || 'text-blue-300 border-blue-500/30 bg-blue-500/10';
              const isCompleted = ev.status === 'Completed';
              return (
                <TiltCard key={ev._id} className="event-card-item glass-panel glass-panel-hover flex flex-col overflow-hidden rounded-3xl">
                  <div className="relative h-48 overflow-hidden border-b border-white/10">
                    <img
                      src={ev.posterUrl || '/hero-fest.jpg'}
                      alt={ev.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${badgeCls}`}>
                      {ev.category}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {ev.status}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-white">{ev.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{ev.description}</p>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-purple-400" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-pink-400" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-2">
                      <MagneticButton
                        disabled={isCompleted}
                        onClick={() => onRegisterEvent(ev)}
                        className={`w-full py-3 text-sm ${
                          isCompleted
                            ? 'cursor-not-allowed rounded-full border border-white/10 bg-white/5 text-slate-400'
                            : 'btn-gradient'
                        }`}
                      >
                        {isCompleted ? 'Event Completed' : 'Register Now'}
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
