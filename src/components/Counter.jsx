'use client';

import { useEffect, useRef, useState } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '@/hooks/useScrollFx';

const DURATION = 1100;

export default function Counter({ to }) {
  const ref = useRef(null);
  const start = useInViewOnce(ref, { threshold: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (reduced) {
      setValue(to);
      return undefined;
    }
    let raf;
    let t0 = null;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / DURATION, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, reduced, to]);

  return <span ref={ref}>{value}</span>;
}
