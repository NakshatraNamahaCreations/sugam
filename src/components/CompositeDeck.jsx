'use client';

import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useActiveStep } from '@/hooks/useScrollFx';
import { DECK_LAYERS } from '@/data/site';

/* Schematic cross section. Layers stack up cumulatively as the reader moves
   down the eight build up steps. */
const LAYER_ART = [
  () => (
    <>
      <path d="M40 300 q160 -120 320 0" fill="none" stroke="var(--dia-strong)" strokeWidth="3" />
      <text x="200" y="330" fill="var(--dia-label)" fontSize="10" fontFamily="var(--mono)" textAnchor="middle">
        CORRUGATED STEEL PLATE
      </text>
    </>
  ),
  () => (
    <g stroke="#C8102E" strokeWidth="2">
      <path d="M92 268v-16" />
      <path d="M146 246v-16" />
      <path d="M200 238v-16" />
      <path d="M254 246v-16" />
      <path d="M308 268v-16" />
    </g>
  ),
  () => (
    <g stroke="rgba(46,124,246,.9)" strokeWidth="1.2">
      <path d="M46 288 q154 -118 308 0" fill="none" strokeDasharray="6 5" />
      <path d="M52 278 q148 -114 296 0" fill="none" strokeDasharray="6 5" />
    </g>
  ),
  () => (
    <g stroke="var(--dia-mid)" strokeWidth="1.4" fill="none">
      <path d="M34 300 V262" />
      <path d="M366 300 V262" />
      <path d="M34 262 h20" />
      <path d="M346 262 h20" />
    </g>
  ),
  () => <path d="M40 268 q160 -122 320 0 v-22 q-160 -122 -320 0 z" fill="rgba(11,14,17,.08)" stroke="var(--dia-mid)" />,
  () => (
    <g fill="rgba(11,14,17,.06)" stroke="var(--dia-mid)">
      <rect x="10" y="240" width="26" height="72" />
      <rect x="364" y="240" width="26" height="72" />
    </g>
  ),
  () => (
    <g fill="rgba(200,16,46,.12)" stroke="rgba(200,16,46,.5)">
      <path d="M36 244 q164 -120 328 0 v-56 h-328 z" />
    </g>
  ),
  () => (
    <g stroke="var(--dia-strong)" strokeWidth="2">
      <path d="M36 186 h328" />
      <path d="M60 178 h50 M140 178 h50 M220 178 h50 M300 178 h40" strokeWidth="1" stroke="var(--dia-mid)" />
    </g>
  ),
];

export default function CompositeDeck() {
  const [active, setStepRef] = useActiveStep(DECK_LAYERS.length);

  return (
    <section id="deck" data-chapter="Composite deck">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          Highway variant
        </Reveal>
        <SplitText as="h2" className="h1" style={{ maxWidth: '24ch', marginBottom: 60 }}>
          Where the plate carries a concrete deck, the section is built up in eight layers.
        </SplitText>

        <div className="split">
          <Reveal className="sticky-col">
            <div className="layers">
              <svg viewBox="0 0 400 400" aria-hidden="true">
                {LAYER_ART.map((Art, i) => (
                  <g key={i} className={['lyr', i <= active && 'on'].filter(Boolean).join(' ')}>
                    <Art />
                  </g>
                ))}
              </svg>
            </div>
            <p className="cap" style={{ marginTop: 14 }}>
              Cross section is schematic. Layer detail follows the approved design.
            </p>
          </Reveal>

          <div className="steps lsteps">
            {DECK_LAYERS.map((l, i) => (
              <div
                className={['step', i === active && 'on'].filter(Boolean).join(' ')}
                key={l.k}
                ref={setStepRef(i)}
              >
                <div className="k">
                  <i />
                  {l.k}
                </div>
                <h3 className="h2">{l.title}</h3>
                <p>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
