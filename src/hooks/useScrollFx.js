'use client';

import { useEffect, useRef, useState } from 'react';

/* rAF throttled scroll + resize listener. The callback also runs once on mount
   so the initial state matches a restored scroll position. */
export function useScroll(callback) {
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      cb.current();
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    run();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

/* True once the element has entered the viewport, and stays true. */
export function useInViewOnce(ref, options) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.unobserve(e.target);
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  return seen;
}

/* Index of the step currently crossing the middle band of the viewport.
   Drives the sticky video rails, the layer build up and the morph diagram. */
export function useActiveStep(count, rootMargin = '-46% 0px -46% 0px') {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  const setRef = (i) => (el) => {
    refs.current[i] = el;
  };

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = els.indexOf(e.target);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count, rootMargin]);

  return [active, setRef];
}

/* The [data-chapter] section currently owning the viewport. Shared by the
   chapter dots and by the ambience, so both agree on where the reader is. */
export function useActiveChapter() {
  const [chapters, setChapters] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setChapters(
      Array.from(document.querySelectorAll('[data-chapter]')).map((el) => ({
        label: el.dataset.chapter,
        el,
      }))
    );
  }, []);

  useScroll(() => {
    const vh = window.innerHeight;
    let act = 0;
    chapters.forEach((c, i) => {
      if (c.el.getBoundingClientRect().top <= vh * 0.42) act = i;
    });
    setActive(act);
  });

  return { chapters, active, label: chapters[active]?.label };
}
