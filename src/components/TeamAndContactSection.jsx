import { Phone, Mail, MapPin, Users, User } from 'lucide-react';
import TiltCard from './TiltCard';

const HOST_MEMBERS = [
  { name: 'Suryakanta Senapati', role: 'Lead Host & Receipt Desk', phone: '7848817688', img: '/Surya.png' },
  { name: 'Manas Das', role: 'Lead Host & Event Operations', phone: '824 970 9981', img: '/manas.png' },
  { name: 'Dibya Ranjan Sethy', role: 'Host & Ticket Coordinator', phone: '', img: '' },
  { name: 'Debendra Pradhan', role: 'Host & Stage Management', phone: '', img: '' },
  { name: 'Pratik Khandai', role: 'Host & Pass Verification', phone: '', img: '' },
  { name: 'Subhashree Prusti', role: 'Host & Cultural Hospitality', phone: '', img: '' }
];

const TeamAndContactSection = () => {
  return (
    <>
      <section id="team" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-blue-300 uppercase">
              Organizing Committee &amp; Hosts
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
              Meet Our <span className="text-gradient-fest">Festival Team</span>
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-400 sm:text-base">
              Dear Candidate, get your receipt from Host Suryakanta Senapati, Manas Das, Dibya Ranjan Sethy, Debendra Pradhan, Pratik Khandai, Subhashree Prusti and Other Hosts Member.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOST_MEMBERS.map((member) => (
              <TiltCard key={member.name} className="glass-panel glass-panel-hover flex items-center gap-4 rounded-2xl p-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-400/40 bg-white/5">
                  {member.img ? (
                    <img src={member.img} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <User size={28} className="text-blue-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-slate-400">{member.role}</p>
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white"
                    >
                      <Phone size={12} /> {member.phone}
                    </a>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="glass-panel mt-6 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-center text-sm text-slate-300">
            <Users size={18} className="text-purple-400" />
            <span>Supported by Other Host Members &amp; Department Student Coordinators across ABIT Campus.</span>
          </div>
        </div>
      </section>

      <section id="contact" className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-pink-400" size={22} />
                <div>
                  <h4 className="font-bold text-white">Campus Address</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Ajay Binay Institute of Technology, CDA Sector-1, Cuttack, Odisha
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 shrink-0 text-blue-400" size={22} />
                <div>
                  <h4 className="font-bold text-white">Urgent Ticket Contact</h4>
                  <p className="mt-1 text-sm text-slate-300">
                    <a href="tel:7848817688" className="block hover:text-white">7848817688 — Host Suryakanta</a>
                    <a href="tel:8249709981" className="block hover:text-white">824 970 9981 — Host Manas</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-orange-400" size={22} />
                <div>
                  <h4 className="font-bold text-white">Official Helpdesk</h4>
                  <p className="mt-1 text-sm text-slate-400">fest@abit.edu.in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamAndContactSection;
