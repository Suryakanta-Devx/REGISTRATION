import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, PlayCircle, Maximize2 } from 'lucide-react';

const GallerySection = ({ items = [] }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((prev) => (prev + 1) % items.length);
      if (e.key === 'ArrowLeft') setLightboxIdx((prev) => (prev - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx, items.length]);

  const activeItem = lightboxIdx !== null ? items[lightboxIdx] : null;

  return (
    <section id="gallery" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-purple-300 uppercase">
            Moments &amp; Reels
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Interactive <span className="text-gradient-fest">Festival Gallery</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Click any photograph or video highlight to open the full-screen lightbox.
          </p>
        </div>

        {/* Masonry columns */}
        <div className="mt-12 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => (
            <motion.button
              key={item._id || `${item.title}-${idx}`}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="glass-panel glass-panel-hover group relative block w-full break-inside-avoid overflow-hidden rounded-2xl text-left"
            >
              {item.mediaType === 'video' ? (
                <div className="relative">
                  <video src={item.url} className="w-full rounded-2xl object-cover" muted playsInline />
                  <PlayCircle size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90" />
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="flex items-center justify-between bg-[#070b1a]/90 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-blue-300">{item.category}</div>
                </div>
                <Maximize2 size={16} className="text-slate-400 group-hover:text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx - 1 + items.length) % items.length)}
                aria-label="Previous media"
                className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % items.length)}
                aria-label="Next media"
                className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="max-h-[86vh] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#070b1a] p-3">
            {activeItem.mediaType === 'video' ? (
              <video src={activeItem.url} controls autoPlay className="max-h-[74vh] w-full rounded-xl" />
            ) : (
              <img src={activeItem.url} alt={activeItem.title} className="max-h-[74vh] w-full rounded-xl object-contain" />
            )}
            <div className="px-2 pt-3 text-center">
              <div className="text-base font-bold text-white">{activeItem.title}</div>
              <div className="text-xs text-slate-400">{activeItem.category}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
