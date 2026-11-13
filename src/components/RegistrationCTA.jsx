import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const RegistrationCTA = ({ onRegisterClick }) => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-blue-600/25 via-purple-600/30 to-pink-600/25 p-10 text-center shadow-2xl sm:p-16"
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-pink-500/25 blur-3xl" />

          <h2 className="relative text-3xl font-extrabold text-white sm:text-5xl">
            Ready to Make History at <span className="text-gradient-fest">ABIT FEST 2026?</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-sm text-slate-200 sm:text-lg">
            Reserve your spot across Technical, Robotics, Cultural, Sports, Creative, Gaming, and Academic tracks. Receive an instant Registration ID, QR Pass, and PDF Receipt.
          </p>
          <div className="relative mt-8 flex justify-center">
            <MagneticButton onClick={onRegisterClick} className="btn-gradient px-8 py-4 text-base">
              Register Now
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationCTA;
