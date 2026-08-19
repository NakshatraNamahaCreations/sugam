'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useScrollFx';

/* Only the clip on screen plays. Seven cards autoplaying at once would pull
   every file down and keep seven decoders alive for no benefit; the poster
   paints immediately and the video is fetched when the card comes into view. */
export default function LazyVideo({ src, poster, label }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.play().catch(() => {
              /* a browser that refuses autoplay keeps the poster */
            });
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
