'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useScrollFx';

/* The intro curtain, in five beats:
 *
 *   1. a line arrives wider than the screen and contracts to a hairline
 *   2. it collapses to a point
 *   3. the company line opens out of that point, steel flecks drifting off
 *   4. the statement and the START gate
 *   5. the screen splits along the axis and the page is revealed
 *
 * START is press and hold, not click. The gate is also not only styling:
 * Web Audio needs a user gesture, so this is the one honest moment to offer
 * sound — choose it here, and the hold that opens the page starts the
 * ambience.
 *
 * The hero headline is held until the split begins, so its cascade plays
 * through the reveal rather than behind the curtain. Everything downstream
 * reads that moment from this context.
 */
const IntroContext = createContext(true);

export const useIntroDone = () => useContext(IntroContext);

export const SOUND_EVENT = 'sugam:sound-on';
export const SOUND_OFF_EVENT = 'sugam:sound-off';

const DRAW = 900; // line contracts from beyond the edges to a hairline
const ZOOM = 360; // and collapses to a point
const TAGLINE = 1150; // the company line is held
const OPEN = 850; // panels part, once the hold completes
const HOLD = 1100; // how long START must be held
const RELEASE = 320; // and how fast the ring falls back if let go

const RING_R = 58.5;
const RING_C = 2 * Math.PI * RING_R;

const WORDS = ['We', 'build', 'India', 'in', 'steel'];
const WORD_STAGGER = 0.07;

/* Fixed rather than random: the markup is server rendered, so anything
   generated per render would mismatch on hydration. */
const FLECKS = [
  { x: -38, y: 6, dx: -60, rot: 220, size: 9, delay: 0.02, dur: 3.4, warm: true },
  { x: -26, y: -14, dx: -30, rot: -180, size: 6, delay: 0.24, dur: 3.9 },
  { x: -14, y: 18, dx: -84, rot: 300, size: 11, delay: 0.1, dur: 3.1 },
  { x: -6, y: -22, dx: 24, rot: -260, size: 7, delay: 0.36, dur: 4.2, warm: true },
  { x: 4, y: 10, dx: -18, rot: 160, size: 8, delay: 0.16, dur: 3.6 },
  { x: 12, y: -18, dx: 52, rot: -320, size: 5, delay: 0.44, dur: 4.4 },
  { x: 22, y: 14, dx: 78, rot: 240, size: 12, delay: 0.06, dur: 3.3, warm: true },
  { x: 33, y: -8, dx: 40, rot: -200, size: 7, delay: 0.3, dur: 4 },
  { x: 41, y: 20, dx: 96, rot: 280, size: 9, delay: 0.19, dur: 3.7 },
  { x: -45, y: -4, dx: -96, rot: -240, size: 6, delay: 0.4, dur: 4.1 },
  { x: 18, y: 26, dx: 34, rot: 190, size: 10, delay: 0.5, dur: 3.5 },
  { x: -20, y: 28, dx: -46, rot: -300, size: 8, delay: 0.56, dur: 3.8, warm: true },
];

export function IntroProvider({ children }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('idle');
  const [done, setDone] = useState(false);
  const [wantSound, setWantSound] = useState(false);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const setProgressBoth = useCallback((p) => {
    progressRef.current = p;
    setProgress(p);
  }, []);

  useEffect(() => {
    /* Anyone who has asked for less motion gets the page, not a curtain. */
    if (reduced) {
      setPhase('gone');
      setDone(true);
      return undefined;
    }

    window.scrollTo(0, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => setPhase('draw'));
    const timers = [
      setTimeout(() => setPhase('zoom'), DRAW),
      setTimeout(() => setPhase('tagline'), DRAW + ZOOM),
      setTimeout(() => setPhase('gate'), DRAW + ZOOM + TAGLINE),
    ];

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      document.body.style.overflow = prevOverflow;
    };
  }, [reduced]);

  const open = useCallback(() => {
    /* The hold began with a pointerdown and runs about a second, so this is
       still inside the browser's transient user activation window — which is
       what lets the ambience start here at all. */
    if (wantSound) window.dispatchEvent(new CustomEvent(SOUND_EVENT));
    setPhase('open');
    document.body.style.overflow = '';
    setDone(true);
    setTimeout(() => setPhase('gone'), OPEN);
  }, [wantSound]);

  /* Press and hold. The ring fills over HOLD; letting go early runs it back
     down rather than snapping, so an accidental tap reads as a near miss. */
  const beginHold = useCallback(() => {
    if (phaseRef.current !== 'gate') return;
    cancelAnimationFrame(rafRef.current);
    setHolding(true);

    const from = progressRef.current;
    const startedAt = performance.now() - from * HOLD;
    const tick = (t) => {
      const p = Math.min((t - startedAt) / HOLD, 1);
      setProgressBoth(p);
      if (p >= 1) {
        setHolding(false);
        open();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [open, setProgressBoth]);

  const endHold = useCallback(() => {
    if (progressRef.current >= 1) return;
    cancelAnimationFrame(rafRef.current);
    setHolding(false);

    const from = progressRef.current;
    if (from <= 0) return;
    const startedAt = performance.now();
    const tick = (t) => {
      const p = Math.max(from * (1 - (t - startedAt) / RELEASE), 0);
      setProgressBoth(p);
      if (p > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [setProgressBoth]);

  /* keyboard gets the same hold, on Enter or Space */
  const onKeyDown = useCallback(
    (e) => {
      if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      beginHold();
    },
    [beginHold]
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <IntroContext.Provider value={done}>
      {phase !== 'gone' && (
        <div className={`intro ${phase}`}>
          <div className="panel t" />
          <div className="panel b" />

          <span className="line" aria-hidden="true" />

          <p className="tagline" aria-hidden="true">
            {WORDS.map((word, i) => (
              <span className="w" key={word}>
                <b style={{ transitionDelay: `${(i * WORD_STAGGER).toFixed(3)}s` }}>{word}</b>
              </span>
            ))}
          </p>

          <div className="gate">
            <p className="statement">
              <span className="l1">
                In four decades we <span className="hit">built</span> many structures.
              </span>
              <span className="l2">This one was the first of its kind in India.</span>
            </p>

            <button
              className={['start', holding && 'holding'].filter(Boolean).join(' ')}
              onPointerDown={beginHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onPointerCancel={endHold}
              onKeyDown={onKeyDown}
              onKeyUp={endHold}
              onBlur={endHold}
              aria-label="Press and hold to enter"
            >
              <svg className="ring" viewBox="0 0 120 120" aria-hidden="true">
                <circle
                  cx="60"
                  cy="60"
                  r={RING_R}
                  style={{
                    strokeDasharray: RING_C,
                    strokeDashoffset: RING_C * (1 - progress),
                  }}
                />
              </svg>
              <span>Start</span>
            </button>
            <span className="hint" aria-hidden="true">
              {holding ? 'Keep holding' : 'Press and hold'}
            </span>

            <button
              className={['audio', wantSound && 'on'].filter(Boolean).join(' ')}
              onClick={() => setWantSound((v) => !v)}
              aria-pressed={wantSound}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 14v-2a8 8 0 0 1 16 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect x="2.5" y="13.5" width="4" height="7" rx="1.6" fill="currentColor" />
                <rect x="17.5" y="13.5" width="4" height="7" rx="1.6" fill="currentColor" />
              </svg>
              <span>{wantSound ? 'Sound on' : 'Sound off'}</span>
            </button>
          </div>

          {/* galvanized offcuts thrown off the line */}
          <div className="flecks" aria-hidden="true">
            {FLECKS.map((f, i) => (
              <i
                key={i}
                className={f.warm ? 'warm' : undefined}
                style={{
                  left: `calc(50% + ${f.x}vw)`,
                  top: `calc(50% + ${f.y}px)`,
                  width: f.size,
                  height: f.size,
                  '--dx': `${f.dx}px`,
                  '--rot': `${f.rot}deg`,
                  animationDelay: `${f.delay}s`,
                  animationDuration: `${f.dur}s`,
                }}
              />
            ))}
          </div>

          <span className="mark" aria-hidden="true">
            Sugam Met Tech
          </span>
        </div>
      )}
      {children}
    </IntroContext.Provider>
  );
}
