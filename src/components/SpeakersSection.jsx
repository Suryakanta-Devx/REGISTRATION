import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import TiltCard from './TiltCard';

const SpeakersSection = ({ speakers = [] }) => {
  return (
    <section id="speakers" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-pink-300 uppercase">
            Keynotes &amp; Mentors
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Speakers &amp; <span className="text-gradient-fest">Distinguished Guests</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Industry architects, developer advocates, and cultural icons inspiring ABIT FEST 2026.
          </p>
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((sp, idx) => (
            <motion.div
              key={sp._id || sp.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <TiltCard className="glass-panel glass-panel-hover flex h-full flex-col rounded-3xl p-6 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-blue-500/20 to-pink-500/20">
                  {sp.imageUrl ? (
                    <img src={sp.imageUrl} alt={sp.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <User size={38} className="text-blue-300" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{sp.name}</h3>
                <p className="mt-1 text-xs font-semibold text-blue-300">{sp.designation}</p>
                {sp.organization && (
                  <p className="text-xs text-slate-400">{sp.organization}</p>
                )}
                {sp.topic && (
                  <div className="mt-3 inline-flex items-center justify-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-pink-300">
                    <Sparkles size={11} /> {sp.topic}
                  </div>
                )}
                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-400">{sp.bio}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
