import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, MapPin, Calendar } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiRequest } from '../services/api';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';
import Hero3DScene from '../components/Hero3DScene';
import CountdownTimer from '../components/CountdownTimer';
import MagneticButton from '../components/MagneticButton';
import AboutSection from '../components/AboutSection';
import EventsSection from '../components/EventsSection';
import ScheduleSection from '../components/ScheduleSection';
import SpeakersSection from '../components/SpeakersSection';
import SponsorsCarousel from '../components/SponsorsCarousel';
import GallerySection from '../components/GallerySection';
import RegistrationCTA from '../components/RegistrationCTA';
import TeamAndContactSection from '../components/TeamAndContactSection';
import RegistrationModal from '../components/RegistrationModal';

gsap.registerPlugin(ScrollTrigger);

const Home = ({ externalModalOpen = false, onCloseExternalModal }) => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotionPref();

  const [events, setEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({
    festivalDate: '2026-12-18T09:00:00+05:30',
    tagline: 'Beyond Technology. Beyond Imagination.'
  });
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isModalVisible = modalOpen || externalModalOpen;

  const handleCloseModal = () => {
    setModalOpen(false);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  // Lenis smooth scroll + GSAP ScrollTrigger sync
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest('/events'),
      apiRequest('/schedule'),
      apiRequest('/speakers'),
      apiRequest('/sponsors'),
      apiRequest('/gallery'),
      apiRequest('/settings')
    ])
      .then(([evs, sched, spks, spons, gal, sets]) => {
        if (!active) return;
        setEvents(evs);
        setSchedule(sched);
        setSpeakers(spks);
        setSponsors(spons);
        setGallery(gal);
        if (sets) setSettings(sets);
      })
      .catch((err) => {
        if (active) setEventsError(err.message);
      })
      .finally(() => {
        if (active) setLoadingEvents(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleMouseMove = (e) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1
    };
  };

  const handleOpenRegistration = (ev = null) => {
    setSelectedEvent(ev || events[0] || null);
    setModalOpen(true);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16">
        <Hero3DScene mouseRef={mouseRef} />

        {/* Ambient Gradient Orbs */}
        <div className="pointer-events-none absolute top-24 -left-24 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-blue-300 uppercase backdrop-blur-md"
          >
            <Sparkles size={14} className="text-pink-400" />
            Ajay Binay Institute of Technology, Cuttack • Welcome to all Abitans
          </motion.div>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            ABIT FEST <span className="text-gradient-fest">2026</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 font-['Space_Grotesk'] text-lg font-bold tracking-wide text-blue-200 sm:text-2xl"
          >
            WHERE INNOVATION MEETS CELEBRATION.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-lg"
          >
            One Campus. Infinite Possibilities. Unforgettable Memories. — <span className="text-pink-300">{settings.tagline}</span>
          </motion.p>

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={15} className="text-blue-400" />
              {new Date(settings.festivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-pink-400" />
              ABIT Campus, Cuttack, Odisha
            </span>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <MagneticButton onClick={() => handleOpenRegistration(events[0])} className="btn-gradient px-8 py-3.5 text-sm sm:text-base">
              Register Now
            </MagneticButton>
            <a
              href="#events"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-white/10 sm:text-base"
            >
              Browse Events
            </a>
          </motion.div>

          <CountdownTimer targetDate={settings.festivalDate} />

          <motion.a
            href="#about"
            aria-label="Scroll down"
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-10 inline-flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            <span>Scroll to explore</span>
            <ChevronDown size={18} />
          </motion.a>
        </div>
      </section>

      <AboutSection />

      <EventsSection
        events={events}
        loading={loadingEvents}
        error={eventsError}
        onRegisterEvent={handleOpenRegistration}
      />

      <ScheduleSection schedule={schedule} />

      <SpeakersSection speakers={speakers} />

      <SponsorsCarousel sponsors={sponsors} />

      <GallerySection items={gallery} />

      <RegistrationCTA onRegisterClick={() => handleOpenRegistration(events[0])} />

      <TeamAndContactSection />

      <RegistrationModal
        key={selectedEvent?._id || 'home-reg-modal'}
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        events={events}
        initialEvent={selectedEvent || events[0] || null}
      />
    </div>
  );
};

export default Home;
