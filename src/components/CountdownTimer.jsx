import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function computeTimeLeft(targetIso) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(targetDate));

  useEffect(() => {
    const update = () => setTimeLeft(computeTimeLeft(targetDate));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
      {blocks.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + idx * 0.08 }}
          className="glass-panel min-w-[96px] rounded-2xl px-5 py-4 text-center"
        >
          <div className="font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[11px] font-semibold tracking-widest text-blue-400 uppercase">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
