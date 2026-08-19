'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { APP_ART } from '@/components/AppArt';
import { APPLICATIONS } from '@/data/site';

const pad = (n) => `0${n}`.slice(-2);

/* A carousel rather than a grid: ten cards do not read as a grid, and this
   way each one gets a figure at a usable size. Native scroll does the work —
   snap points, touch swipe and keyboard all come free — and the buttons just
   drive scrollBy. */
export default function Applications() {
  const rail = useRef(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > max - 8);

    const card = el.firstElementChild;
    if (card) {
      const step = card.getBoundingClientRect().width + 16;
      setIndex(Math.min(APPLICATIONS.length - 1, Math.round(el.scrollLeft / step)));
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const nudge = (dir) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="alt" data-chapter="Applications">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          Where it is used
        </Reveal>
        <SplitText as="h2" className="h1" style={{ maxWidth: '22ch' }}>
          Ten crossings, one structural system.
        </SplitText>
      </div>

      {/* the rail breaks the container so cards can run to the edge */}
      <div className="apps-carousel">
        <div className="crail" ref={rail} onScroll={measure}>
          {APPLICATIONS.map((a, i) => (
            <article className="app" key={a.k}>
              <Media art={APP_ART[i]} image={a.image} label={a.title} sizes="300px" />
              <div className="in">
                <span className="k">{a.k}</span>
                <b>{a.title}</b>
                <p>{a.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="wrap cnav">
          <button aria-label="Previous" onClick={() => nudge(-1)} disabled={atStart}>
            &#8249;
          </button>
          <button aria-label="Next" onClick={() => nudge(1)} disabled={atEnd}>
            &#8250;
          </button>
          <div className="ctrack">
            <i style={{ width: `${Math.max(progress * 100, 4)}%` }} />
          </div>
          <span className="ccount">
            {pad(index + 1)} / {pad(APPLICATIONS.length)}
          </span>
        </div>
      </div>

      <div className="wrap">
        <Reveal className="note">
          Self weight is lower than any conventional bridge, so these structures can be built where the
          safe bearing capacity of the soil is very low, and in remote forest and mining locations.
        </Reveal>
      </div>
    </section>
  );
}
