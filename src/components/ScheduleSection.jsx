import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, UserCheck } from 'lucide-react';

const ScheduleSection = ({ schedule = [] }) => {
  const days = useMemo(() => {
    const unique = [...new Set(schedule.map((item) => item.day))];
    return unique.length > 0 ? unique : ['Day 1 • Dec 18'];
  }, [schedule]);

  const [selectedDay, setSelectedDay] = useState(null);
  const activeDay = selectedDay && days.includes(selectedDay) ? selectedDay : days[0];
  const dayItems = schedule.filter((item) => item.day === activeDay);

  return (
    <section id="schedule" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-orange-300 uppercase">
            Interactive Timeline
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Festival <span className="text-gradient-fest">Schedule</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Follow keynotes, hackathons, robotics heats, and cultural star nights hour by hour.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeDay === day
                  ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="relative mt-12 space-y-6 pl-8 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-pink-500">
          {dayItems.map((item, idx) => (
            <motion.div
              key={item._id || `${item.title}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="glass-panel glass-panel-hover relative rounded-2xl p-6"
            >
              <span className="absolute top-7 -left-[29px] h-4 w-4 rounded-full border-2 border-blue-400 bg-[#04060f] shadow-[0_0_12px_#60a5fa]" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400">
                  <Clock size={15} /> {item.time}
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-0.5 text-xs font-semibold text-purple-200">
                  {item.category}
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-pink-400" /> {item.venue}
                </span>
                {item.speakerOrLead && (
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck size={14} className="text-orange-400" /> {item.speakerOrLead}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
