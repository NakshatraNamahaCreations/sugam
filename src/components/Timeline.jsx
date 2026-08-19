'use client';

import { Fragment, useRef } from 'react';
import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useScroll, useInViewOnce } from '@/hooks/useScrollFx';
import { PROJECT_FACTS, TIMELINE } from '@/data/site';

/* Each stage is one card: the photograph carries it, the text sits over the
   foot of it. Two columns of prose and picture left the section mostly empty. */
function Node({ stage, side, n }) {
  const ref = useRef(null);
  const shown = useInViewOnce(ref, { threshold: 0.25 });

  return (
    <article className={['node', side, shown && 'in'].filter(Boolean).join(' ')} ref={ref}>
      <div className="scard">
        <Media image={stage.image} label={stage.title} sizes="(max-width: 820px) 90vw, 560px" />
        <div className="over">
          <span className="k">{stage.k}</span>
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
        </div>
      </div>
      {/* the marker carries the stage number, so the spine reads as a sequence */}
      <span className="dot">{n}</span>
    </article>
  );
}

export default function Timeline() {
  const tl = useRef(null);
  const fill = useRef(null);

  useScroll(() => {
    if (!tl.current || !fill.current) return;
    const r = tl.current.getBoundingClientRect();
    const p = (window.innerHeight * 0.55 - r.top) / r.height;
    fill.current.style.height = `${Math.min(Math.max(p, 0), 1) * 100}%`;
  });

  return (
    <section id="project" className="alt" data-chapter="Project">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          Udhna Junction, Surat
        </Reveal>
        <SplitText as="h2" className="h1" style={{ maxWidth: '22ch' }}>
          A live railway crossing, replaced inside a single traffic block.
        </SplitText>
        <Reveal as="p" className="lede" style={{ marginTop: 20 }}>
          Executed for Indian Railways through Larsen &amp; Toubro. Eleven stages, from the arrival of
          galvanized plates to the first train running over the completed structure.
        </Reveal>

        {/* the credentials, before the stage by stage account */}
        <Reveal className="pfacts">
          {PROJECT_FACTS.map((f) => (
            <div key={f.label}>
              <b>{f.label}</b>
              <span>{f.value}</span>
            </div>
          ))}
        </Reveal>

        <div className="tl" ref={tl}>
          <div className="spine">
            <i ref={fill} />
          </div>

          {/* stage 05 opens the block and stage 10 closes it — the copy for
              both says so, and it is the point of the whole section */}
          {TIMELINE.map((stage, i) => (
            <Fragment key={stage.k}>
              {i === 4 && (
                <div className="tlmark">
                  <span>Traffic block begins</span>
                </div>
              )}
              <Node stage={stage} side={i % 2 === 0 ? 'l' : 'r'} n={`0${i + 1}`.slice(-2)} />
              {i === 9 && (
                <div className="tlmark">
                  <span>Traffic restored</span>
                </div>
              )}
            </Fragment>
          ))}

          {/* The junction from the air. The first train itself is not in the
              supplied footage, and the chip says what the picture is rather
              than letting it pass for the train. */}
          <article className="node wide">
            <div className="scard">
              <Media
                image="/stages/11-complete.jpg"
                label="Udhna Junction from the air"
                sizes="(max-width: 820px) 92vw, 1200px"
              />
              <div className="over">
                <span className="k">Stage 11</span>
                <h3>Train moving over the bridge</h3>
                <p>
                  Live traffic restored over the completed corrugated steel arch at Udhna Junction,
                  Surat.
                </p>
                <span className="await">Udhna Junction during the works</span>
              </div>
            </div>
            <span className="dot">11</span>
          </article>
        </div>
      </div>
    </section>
  );
}
