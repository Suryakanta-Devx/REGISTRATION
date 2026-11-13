import { Award } from 'lucide-react';

const SponsorsCarousel = ({ sponsors = [] }) => {
  const list = sponsors.length > 0 ? [...sponsors, ...sponsors] : [];

  return (
    <section id="sponsors" className="overflow-hidden border-y border-white/10 bg-[#050817]/70 py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-blue-300 uppercase">
          Community &amp; Industry Partners
        </span>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Festival <span className="text-gradient-fest">Sponsors</span>
        </h2>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-[#04060f] to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#04060f] to-transparent" />

        <div className="sponsor-marquee-track gap-6 px-4">
          {list.map((sp, idx) => (
            <a
              key={`${sp._id || sp.name}-${idx}`}
              href={sp.website || '#sponsors'}
              target={sp.website ? '_blank' : undefined}
              rel="noreferrer"
              className="glass-panel glass-panel-hover flex min-w-[230px] items-center gap-3.5 rounded-2xl px-6 py-4"
            >
              {sp.logoUrl ? (
                <img src={sp.logoUrl} alt={sp.name} loading="lazy" className="h-10 w-10 rounded-lg object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300">
                  <Award size={20} />
                </div>
              )}
              <div className="text-left">
                <div className="text-sm font-bold text-white">{sp.name}</div>
                <div className="text-[11px] font-semibold tracking-wider text-purple-300 uppercase">
                  {sp.tier} Partner
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsCarousel;
