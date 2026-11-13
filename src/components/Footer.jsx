import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Camera, Share2, Video } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/10 bg-[#03050d] pt-16 pb-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white">
              ABIT FEST <span className="text-gradient-fest">2026</span>
            </h3>
            <p className="mt-2 text-sm font-semibold tracking-wider text-blue-300 uppercase">
              Beyond Technology. Beyond Imagination.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Annual Techno-Cultural Festival of Ajay Binay Institute of Technology (ABIT), Sector 1, CDA, Cuttack, Odisha.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Globe, label: 'Website', href: '#home' },
                { icon: Camera, label: 'Gallery', href: '#gallery' },
                { icon: Share2, label: 'Partners', href: '#sponsors' },
                { icon: Video, label: 'Highlights', href: '#gallery' }
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-blue-400 hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">Portal Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#events" className="hover:text-white">Explore Events</a></li>
              <li><a href="#schedule" className="hover:text-white">Event Schedule</a></li>
              <li><Link to="/student-dashboard" className="hover:text-white">Student Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-white">Admin Console</Link></li>
              <li><Link to="/auth" className="hover:text-white">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">Campus &amp; Urgent Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-pink-400" />
                <span>Ajay Binay Institute of Technology, CDA Sector-1, Cuttack, Odisha 753014</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-blue-400" />
                <a href="tel:7848817688" className="hover:text-white">7848817688 (Host Suryakanta)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-purple-400" />
                <a href="tel:8249709981" className="hover:text-white">824 970 9981 (Host Manas)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-orange-400" />
                <span>fest@abit.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ABIT FEST 2026 — Ajay Binay Institute of Technology, Cuttack, Odisha. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
