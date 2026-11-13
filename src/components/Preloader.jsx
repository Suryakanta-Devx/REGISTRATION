import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

const Preloader = ({ visible }) => {
  const reduced = useReducedMotionPref();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
          transition={{ duration: reduced ? 0.05 : 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#04060f] px-6"
          role="status"
          aria-label="Loading ABIT FEST 2026"
        >
          {/* Ambient radial glow */}
          <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-gradient-to-tr from-blue-600/25 via-purple-600/25 to-pink-500/25 blur-3xl" />

          {/* Animated College Crest / Tech Logo */}
          <motion.div
            initial={reduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6 flex h-24 w-24 items-center justify-center"
          >
            <motion.div
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-500"
            />
            <motion.div
              animate={reduced ? undefined : { rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-pink-500 border-l-orange-400"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 font-bold tracking-wider text-white shadow-lg shadow-purple-500/40">
              ABIT
            </div>
          </motion.div>

          <motion.h1
            initial={reduced ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            ABIT FEST <span className="text-gradient-fest">2026</span>
          </motion.h1>
          <p className="mt-2 text-center text-sm tracking-widest text-slate-400 uppercase">
            Beyond Technology. Beyond Imagination.
          </p>

          {/* Gradient Loader Bar */}
          <div className="mt-7 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
