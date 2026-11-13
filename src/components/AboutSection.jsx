import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Music, Trophy, Sparkles } from 'lucide-react';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const textColRef = useRef(null);
  const imgColRef = useRef(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(textColRef.current, {
        y: 42,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true
        }
      });

      gsap.from(imgColRef.current, {
        scale: 0.94,
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const stats = [
    { icon: Cpu, label: '7 Event Verticals', color: 'text-blue-400' },
    { icon: Music, label: 'Star & DJ Nights', color: 'text-pink-400' },
    { icon: Trophy, label: '₹1.5L+ Prize Pool', color: 'text-orange-400' },
    { icon: Sparkles, label: '3,000+ Abitans', color: 'text-purple-400' }
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div ref={textColRef}>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-purple-300 uppercase">
              About The Festival
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
              Ajay Binay Institute of Technology&apos;s <span className="text-gradient-fest">Flagship Fest</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              Welcome to all Abitans! <strong className="text-white">ABIT FEST 2026</strong> brings together engineers, designers, performers, athletes, and creators from Cuttack and across Odisha for two electrifying days of hackathons, robotics battles, keynote talks, sports championships, and unforgettable cultural nights.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Inspired by global developer conferences like DevFest and college cultural summits, every track blends hands-on technical mastery with campus spirit.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass-panel flex items-center gap-3 rounded-2xl p-4">
                    <Icon size={22} className={s.color} />
                    <span className="text-sm font-semibold text-white">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={imgColRef} className="relative">
            <div className="glass-panel overflow-hidden rounded-3xl p-2.5">
              <img
                src="/hero-fest.jpg"
                alt="ABIT FEST 2026 Campus Celebration"
                loading="lazy"
                className="h-[360px] w-full rounded-2xl object-cover sm:h-[420px]"
              />
            </div>
            <div className="glass-panel absolute -bottom-5 left-6 right-6 rounded-2xl border border-blue-500/30 px-5 py-4 sm:left-auto sm:right-8 sm:w-80">
              <div className="text-xs font-semibold tracking-wider text-blue-300 uppercase">Venue • Cuttack, Odisha</div>
              <div className="mt-1 text-sm font-semibold text-white">ABIT Main Auditorium, Innovation Block &amp; Sports Complex</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
