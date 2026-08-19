'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SOUND_OFF_EVENT } from '@/components/Intro';
import { usePrefersReducedMotion } from '@/hooks/useScrollFx';

/* The project film. No transport controls: it starts itself when the section
   comes into view, loops, and pauses when it leaves.
 *
 * It tries to start *with sound*. Browsers block unmuted autoplay unless the
 * page already has user activation — which this one does, because nobody
 * reaches the page without holding START on the intro. Where that is not
 * enough (Safari, autoplay blocked in settings, someone deep-linking past the
 * intro) the play() promise rejects, and we retry muted rather than leave a
 * frozen poster. The button then offers the sound the browser refused.
 */
export default function FeatureVideo({ src, poster, label }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [muted, setMuted] = useState(true);
  const armed = useRef(false);

  const silenceAmbience = useCallback(() => {
    window.dispatchEvent(new CustomEvent(SOUND_OFF_EVENT));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    const enter = async () => {
      /* only reach for sound the first time; after that respect whatever the
         viewer last chose with the button */
      if (!armed.current) {
        armed.current = true;
        el.muted = false;
        try {
          await el.play();
          setMuted(false);
          silenceAmbience();
          return;
        } catch {
          el.muted = true;
          setMuted(true);
        }
      }
      el.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) enter();
          else el.pause();
        });
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced, silenceAmbience]);

  const toggleSound = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) {
      silenceAmbience();
      el.play().catch(() => {});
    }
  }, [silenceAmbience]);

  return (
    <>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
      <button
        className={['solo-sound', !muted && 'on'].filter(Boolean).join(' ')}
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? 'Turn film sound on' : 'Turn film sound off'}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9.5h3.6L12 6v12l-4.4-3.5H4z" fill="currentColor" />
          {muted ? (
            <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : (
            <>
              <path d="M15.4 9.2a4 4 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M17.9 6.8a7.5 7.5 0 0 1 0 10.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </>
          )}
        </svg>
        <span>{muted ? 'Sound' : 'Mute'}</span>
      </button>
    </>
  );
}
