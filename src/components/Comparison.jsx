'use client';

import { useRef } from 'react';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useInViewOnce } from '@/hooks/useScrollFx';
import { COMPARISON, COMPARISON_HIGHLIGHTS } from '@/data/site';

const pad = (n) => `0${n}`.slice(-2);

function Track({ kind, who, w, v, delay, run }) {
  return (
    <div className={`trk ${kind}`}>
      <span className="who">{who}</span>
      <div className="fill">
        <i style={{ right: run ? `${100 - w}%` : '100%', transitionDelay: `${delay}ms` }} />
      </div>
      <span className="v">{v}</span>
    </div>
  );
}

function Bar({ row, n }) {
  const ref = useRef(null);
  const shown = useInViewOnce(ref, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  const run = useInViewOnce(ref, { threshold: 0.45 });

  return (
    <div className={['bar', 'rv', shown && 'in'].filter(Boolean).join(' ')} ref={ref}>
      <div className="lab">
        <span className="n">{pad(n)}</span>
        <b>{row.label}</b>
      </div>
      <div className="tracks">
        {/* named on every row, so the comparison does not rest on colour alone */}
        <Track kind="us" who="Corrugated" w={row.us.w} v={row.us.v} delay={0} run={run} />
        <Track kind="them" who="RCC / precast" w={row.them.w} v={row.them.v} delay={120} run={run} />
      </div>
    </div>
  );
}

export default function Comparison() {
  return (
    <section className="alt" data-chapter="Comparison">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          The case for corrugated
        </Reveal>
        <SplitText as="h2" className="h1" style={{ maxWidth: '20ch' }}>
          Faster, lighter and materially cheaper than concrete.
        </SplitText>

        {/* the three figures worth taking away, before the detail */}
        <div className="cmp-heads">
          {COMPARISON_HIGHLIGHTS.map((h) => (
            <Reveal className="cmp-head" key={h.label}>
              <b>{h.value}</b>
              <span>{h.label}</span>
              <p>{h.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="legend">
          <span>
            <i style={{ background: 'var(--red)' }} />
            Corrugated steel arch
          </span>
          <span>
            <i style={{ background: 'var(--them)' }} />
            Conventional RCC or precast
          </span>
        </Reveal>

        <div className="bars">
          {COMPARISON.map((row, i) => (
            <Bar key={row.label} row={row} n={i + 1} />
          ))}
        </div>

        <Reveal className="note">
          At Udhna Junction the arch was placed and the track was restored inside a single traffic block.
          Conventional methods would have measured that same work in weeks.
        </Reveal>
      </div>
    </section>
  );
}
