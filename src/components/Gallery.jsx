'use client';

import { useCallback, useEffect, useState } from 'react';
import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { GALLERY, GALLERY_FILTERS } from '@/data/site';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(-1);

  const shown = GALLERY.filter((g) => filter === 'all' || g.c === filter);
  const open = index >= 0 && index < shown.length;
  const current = open ? shown[index] : null;

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (d) => setIndex((i) => (i + d + shown.length) % shown.length),
    [shown.length]
  );

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  return (
    <>
      <section className="alt" data-chapter="Gallery">
        <div className="wrap">
          <Reveal as="span" className="eyebrow">
            Project gallery
          </Reveal>
          <SplitText as="h2" className="h1">
            Drawing board to running track.
          </SplitText>

          <Reveal className="filters">
            {GALLERY_FILTERS.map((f) => (
              <button
                key={f.f}
                className={['chip', filter === f.f && 'on'].filter(Boolean).join(' ')}
                onClick={() => {
                  setFilter(f.f);
                  setIndex(-1);
                }}
              >
                {f.label}
              </button>
            ))}
          </Reveal>

          <div className="grid-g">
            {shown.map((g, i) => (
              <Reveal as="figure" className="g" key={g.cap} onClick={() => setIndex(i)}>
                <Media image={g.image} label={g.cap} sizes="(max-width: 820px) 46vw, 300px" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div
        id="lb"
        className={open ? 'on' : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Gallery viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button className="x" aria-label="Close" onClick={close}>
          &#10005;
        </button>
        <button className="p" aria-label="Previous" onClick={() => step(-1)}>
          &#8249;
        </button>
        <button className="n" aria-label="Next" onClick={() => step(1)}>
          &#8250;
        </button>
        <div className="box">
          <Media image={current?.image} label={current?.cap} sizes="(max-width: 1100px) 90vw, 1000px" />
          <p className="cap">{current?.cap}</p>
        </div>
      </div>
    </>
  );
}
