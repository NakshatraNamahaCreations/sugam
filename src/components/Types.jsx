'use client';

import { useRef, useState } from 'react';
import Media from '@/components/Media';
import { TYPE_ART } from '@/components/TypeArt';
import { useScroll, usePrefersReducedMotion } from '@/hooks/useScrollFx';
import { TYPES } from '@/data/site';
import SplitText from '@/components/SplitText';

const pad = (n) => `0${n}`.slice(-2);

/* On desktop the section is pinned and vertical scroll is translated into
   horizontal travel across the cards. Below 820px, and whenever reduced
   motion is requested, the CSS turns it into a plain swipe rail and this
   component leaves the transform alone. */
export default function Types() {
  const pin = useRef(null);
  const rail = useRef(null);
  const track = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(1);

  useScroll(() => {
    if (!pin.current || !rail.current) return;

    const mobile = window.innerWidth <= 820;
    if (mobile || reduced) {
      rail.current.style.transform = '';
      if (track.current) track.current.style.width = '';
      return;
    }

    const vh = window.innerHeight;
    const total = pin.current.offsetHeight - vh;
    if (total <= 0) return;

    const p = Math.min(Math.max(-pin.current.getBoundingClientRect().top / total, 0), 1);
    const dist = rail.current.scrollWidth - window.innerWidth + 48;
    if (dist <= 0) return;

    rail.current.style.transform = `translate3d(${-p * dist}px,0,0)`;
    if (track.current) track.current.style.width = `${p * 100}%`;
    setCount(Math.min(TYPES.length, Math.floor(p * (TYPES.length - 0.01)) + 1));
  });

  return (
    <section id="types" data-chapter="Types">
      <div className="pin" ref={pin}>
        <div className="vp">
          <div className="head">
            <span className="eyebrow">Profile range</span>
            <SplitText as="h2" className="h1">One technology. Many geometries.</SplitText>
            <p className="lede" style={{ marginTop: 18 }}>
              Span, rise and profile are selected against the site condition, the crossing requirement and
              the live load. Spans up to 30 metres, live load up to 75 tonnes, designed to IRC standards.
            </p>
          </div>

          <div className="rail" ref={rail}>
            {TYPES.map((t, i) => (
              <article className="tcard" key={t.k}>
                <Media
                  art={TYPE_ART[i]}
                  image={t.image}
                  src={t.video}
                  poster={t.poster}
                  label={t.title}
                  sizes="(max-width: 820px) 78vw, 384px"
                />
                <span className="idx">{t.k}</span>
                <div className="plate">
                  <b>{t.title}</b>
                  <p>{t.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hint">
            <span>Drag or scroll</span>
            <div className="track">
              <i ref={track} />
            </div>
            <span>{`${pad(count)} / ${pad(TYPES.length)}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
