'use client';

import { useCallback, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useScroll, usePrefersReducedMotion } from '@/hooks/useScrollFx';
import { COMPARISON, COMPARISON_HIGHLIGHTS } from '@/data/site';

const pad = (n) => `0${n}`.slice(-2);
const N = COMPARISON.length;

/* The dial. Measures sit on a circle whose centre is off to the right, and
   scrolling rotates the whole ring, so the live measure travels into the
   centre rather than a highlight hopping between fixed numbers. */
const CX = 372;
const CY = 236;
const R = 318;
const STEP = 13; // degrees between measures
const MID = 180; // leftmost point of the circle, where the live one sits

function seat(i, progress) {
  const a = MID + (i - progress * (N - 1)) * STEP;
  const rad = (a * Math.PI) / 180;
  const off = Math.abs(a - MID);
  return {
    left: Math.round(CX + R * Math.cos(rad)),
    top: Math.round(CY + R * Math.sin(rad)),
    tilt: Number((MID - a).toFixed(1)),
    /* fade with distance from the centre, so the ring reads as depth */
    fade: Number(Math.max(0, 1 - off / 46).toFixed(2)),
  };
}

/* Keyed on the measure, so every arrival replays the fill from zero rather
   than sliding from the previous measure's length. */
function Track({ kind, who, w, v, delay }) {
  return (
    <div className={`trk ${kind}`}>
      <span className="who">{who}</span>
      <div className="fill">
        <i style={{ '--w': `${100 - w}%`, animationDelay: `${delay}ms` }} />
      </div>
      <span className="v">{v}</span>
    </div>
  );
}

export default function Comparison() {
  const pin = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useScroll(() => {
    const el = pin.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    if (travel <= 0) {
      setProgress(0);
      return;
    }
    const p = -el.getBoundingClientRect().top / travel;
    setProgress(Math.min(Math.max(p, 0), 1));
  });

  const active = Math.round(progress * (N - 1));
  const row = COMPARISON[active];

  /* a measure is chosen by scrolling to it, so the dial keeps one source of
     truth rather than fighting the scroll position */
  const jump = useCallback(
    (i) => {
      const el = pin.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      window.scrollTo({
        top: el.offsetTop + (travel * i) / (N - 1),
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [reduced]
  );

  const onKey = useCallback(
    (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        jump(Math.min(active + 1, N - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        jump(Math.max(active - 1, 0));
      }
    },
    [active, jump]
  );

  return (
    <section className="alt" data-chapter="Comparison">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          The case for corrugated
        </Reveal>
        <SplitText as="h2" className="h1" style={{ maxWidth: '20ch' }}>
          Faster, lighter and materially cheaper than concrete.
        </SplitText>

        <div className="cmp-heads">
          {COMPARISON_HIGHLIGHTS.map((h) => (
            <Reveal className="cmp-head" key={h.label}>
              <b>{h.value}</b>
              <span>{h.label}</span>
              <p>{h.note}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="cmp-pin" ref={pin}>
        <div className="cmp-vp">
          <div className="wrap dial">
            <div className="marks" role="tablist" aria-label="Comparison measures" onKeyDown={onKey}>
              <svg className="arc" viewBox="0 0 760 472" aria-hidden="true">
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(11,14,17,.13)" strokeWidth="1" />
              </svg>

              {COMPARISON.map((r, i) => {
                const s = seat(i, progress);
                return (
                  <button
                    key={r.label}
                    role="tab"
                    aria-selected={i === active}
                    tabIndex={i === active ? 0 : -1}
                    className={['seat', i === active && 'on'].filter(Boolean).join(' ')}
                    style={{
                      left: `${s.left}px`,
                      top: `${s.top}px`,
                      transform: `translate(-50%,-50%) rotate(${s.tilt}deg)`,
                      opacity: s.fade,
                    }}
                    onClick={() => jump(i)}
                  >
                    {pad(i + 1)}
                  </button>
                );
              })}

              <div className="live" aria-hidden="true" key={active}>
                <span className="dot" />
                <span className="n">{pad(active + 1)}</span>
                <span className="lab">
                  <b>{row.label}</b>
                  <i>{row.us.v}</i>
                </span>
              </div>
            </div>

            <div className="dial-bars">
              <Track key={`us-${active}`} kind="us" who="Corrugated" w={row.us.w} v={row.us.v} delay={0} />
              <Track
                key={`them-${active}`}
                kind="them"
                who="RCC / precast"
                w={row.them.w}
                v={row.them.v}
                delay={110}
              />

              <div className="dial-track" aria-hidden="true">
                <i style={{ width: `${(progress * 100).toFixed(1)}%` }} />
              </div>

              <div className="legend">
                <span>
                  <i style={{ background: 'var(--red)' }} />
                  Corrugated steel arch
                </span>
                <span>
                  <i style={{ background: 'var(--them)' }} />
                  Conventional RCC or precast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <Reveal className="note">
          At Udhna Junction the arch was placed and the track was restored inside a single traffic block.
          Conventional methods would have measured that same work in weeks.
        </Reveal>
      </div>
    </section>
  );
}
