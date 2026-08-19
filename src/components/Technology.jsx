'use client';

import Image from 'next/image';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useActiveStep } from '@/hooks/useScrollFx';
import { FUNDAMENTALS } from '@/data/site';

/* Three drawing-sheet figures: flat plate, corrugated profile, assembled arch.
   Whichever fundamental is in the middle of the viewport draws its figure.

   All three are composed to fill the sheet and carry real annotation —
   dimensions, hatching, a centreline, load arrows — because this section is
   the technical argument of the page. Strokes resolve from the --dia-* tokens
   so the figures follow the theme. */

const RED = 'var(--red)';
const INK = 'var(--dia-strong)';
const MID = 'var(--dia-mid)';
const SOFT = 'var(--dia-soft)';
const LABEL = 'var(--dia-label)';

/* a run of corrugations: quadratic peaks chained with t */
function ripple(x0, y, pitch, amp, count) {
  let d = `M${x0} ${y} q${pitch / 2} ${-amp} ${pitch} 0`;
  for (let i = 1; i < count; i += 1) d += ` t${pitch} 0`;
  return d;
}

function Dim({ x1, y1, x2, y2, label, lx, ly, anchor = 'middle' }) {
  const vertical = x1 === x2;
  return (
    <g>
      <g stroke={RED} strokeWidth="1.1">
        <path d={`M${x1} ${y1} L${x2} ${y2}`} />
        {vertical ? (
          <>
            <path d={`M${x1 - 6} ${y1} h12`} />
            <path d={`M${x2 - 6} ${y2} h12`} />
          </>
        ) : (
          <>
            <path d={`M${x1} ${y1 - 6} v12`} />
            <path d={`M${x2} ${y2 - 6} v12`} />
          </>
        )}
      </g>
      <text x={lx} y={ly} fill={RED} fontSize="11" fontFamily="var(--mono)" textAnchor={anchor} letterSpacing="1">
        {label}
      </text>
    </g>
  );
}

function Arrow({ x, y, len = 24, label }) {
  return (
    <g>
      <g stroke={MID} strokeWidth="1.2">
        <path d={`M${x} ${y} v${len}`} />
        <path d={`M${x} ${y + len} l-5 -8`} />
        <path d={`M${x} ${y + len} l5 -8`} />
      </g>
      {label && (
        <text x={x} y={y - 8} fill={LABEL} fontSize="11" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1">
          {label}
        </text>
      )}
    </g>
  );
}

/* 01 — the raw plate. Strong steel, but it carries load by bending. */
function FlatPlate() {
  return (
    <>
      <defs>
        <pattern id="tw-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={SOFT} strokeWidth="1" />
        </pattern>
      </defs>

      {/* given a little depth so it reads as steel, not as a line */}
      <path d="M64 214 L332 214 L360 186 L92 186 Z" fill="rgba(11,14,17,.05)" stroke={INK} strokeWidth="1.6" />
      <path d="M64 214 L332 214 L332 232 L64 232 Z" fill="rgba(11,14,17,.09)" stroke={INK} strokeWidth="1.6" />
      <path d="M332 214 L360 186 L360 204 L332 232 Z" fill="url(#tw-hatch)" stroke={INK} strokeWidth="1.6" />

      <Arrow x={198} y={140} label="LOAD" />

      {/* it answers the load by sagging: that is the whole point of the figure */}
      <path d="M64 256 q134 34 268 0" fill="none" stroke={MID} strokeWidth="1.2" strokeDasharray="5 5" />
      <text x="198" y="286" fill={LABEL} fontSize="10.5" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1">
        CARRIES BY BENDING
      </text>

      <Dim x1={64} y1={318} x2={332} y2={318} label="PLATE LENGTH" lx={198} ly={310} />
      <Dim x1={376} y1={214} x2={376} y2={232} label="t" lx={388} ly={228} anchor="start" />
    </>
  );
}

/* 02 — pressed. The same steel, a fraction of the deflection. */
function Corrugated() {
  const X0 = 56;
  const PITCH = 34;
  const AMP = 36;
  const COUNT = 8;
  const span = PITCH * COUNT;
  const crest1 = X0 + PITCH / 2;
  const crest2 = crest1 + PITCH;

  return (
    <>
      {/* body first, then the two edges drawn over it */}
      <path d={ripple(X0, 200, PITCH, AMP, COUNT)} fill="none" stroke="rgba(11,14,17,.1)" strokeWidth="24" strokeLinecap="round" />
      <path d={ripple(X0, 189, PITCH, AMP, COUNT)} fill="none" stroke={INK} strokeWidth="1.8" />
      <path d={ripple(X0, 211, PITCH, AMP, COUNT)} fill="none" stroke={INK} strokeWidth="1.8" />

      {/* crest and valley lines the depth is measured between */}
      <g stroke={SOFT} strokeWidth="1" strokeDasharray="4 4">
        <path d={`M${X0} 171 H${X0 + span + 10}`} />
        <path d={`M${X0} 225 H${X0 + span + 10}`} />
      </g>

      <Arrow x={198} y={128} label="LOAD" />

      <Dim x1={crest1} y1={272} x2={crest2} y2={272} label="PITCH" lx={(crest1 + crest2) / 2} ly={264} />
      <Dim x1={362} y1={171} x2={362} y2={225} label="DEPTH" lx={354} ly={202} anchor="end" />

      <text x="198" y="312" fill={LABEL} fontSize="10.5" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1">
        STIFFNESS WITHOUT ADDED WEIGHT
      </text>
    </>
  );
}

/* 03 — crimped to a radius and backfilled. The soil becomes structural. */
function Arch() {
  return (
    <>
      <defs>
        <pattern id="tw-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(11,14,17,.2)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* engineered backfill, carrying load around the opening */}
      <path
        d="M34 300 V178 H366 V300 h-40 V246 A126 118 0 0 0 74 246 V300 Z"
        fill="url(#tw-soil)"
        stroke={SOFT}
        strokeWidth="1"
      />
      <path d="M34 178 H366" stroke={MID} strokeWidth="1.4" />

      <g>
        <Arrow x={128} y={140} len={22} />
        <Arrow x={200} y={132} len={22} label="LOAD" />
        <Arrow x={272} y={140} len={22} />
      </g>

      {/* the arch */}
      <path d="M74 300 V246 A126 118 0 0 1 326 246 V300" fill="none" stroke={INK} strokeWidth="3.4" />
      <path d="M74 300 V246 A126 118 0 0 1 326 246 V300" fill="none" stroke={RED} strokeWidth="1" strokeDasharray="2 9" />

      {/* thrust into the footings */}
      <g stroke={RED} strokeWidth="1.2">
        <path d="M74 286 l-16 12" />
        <path d="M58 298 l2 -8" />
        <path d="M58 298 l8 -1" />
        <path d="M326 286 l16 12" />
        <path d="M342 298 l-2 -8" />
        <path d="M342 298 l-8 -1" />
      </g>

      <g fill="rgba(11,14,17,.14)" stroke={INK} strokeWidth="1.4">
        <rect x="50" y="300" width="42" height="16" />
        <rect x="308" y="300" width="42" height="16" />
      </g>

      <path d="M20 316 H380" stroke={INK} strokeWidth="1.6" />
      <g stroke={SOFT} strokeWidth="1">
        {Array.from({ length: 19 }, (_, i) => (
          <path key={i} d={`M${26 + i * 19} 316 l-8 10`} />
        ))}
      </g>

      {/* centreline */}
      <path d="M200 156 V312" stroke={SOFT} strokeWidth="1" strokeDasharray="10 4 2 4" />

      <Dim x1={74} y1={346} x2={326} y2={346} label="SPAN" lx={200} ly={338} />
      <Dim x1={366} y1={178} x2={366} y2={300} label="RISE" lx={358} ly={242} anchor="end" />
    </>
  );
}

const STATES = [
  { name: 'Flat plate', Art: FlatPlate },
  { name: 'Corrugated profile', Art: Corrugated },
  { name: 'Assembled arch', Art: Arch },
];

export default function Technology() {
  const [active, setStepRef] = useActiveStep(FUNDAMENTALS.length, '-42% 0px -42% 0px');
  const shot = Boolean(FUNDAMENTALS[active]?.image);

  return (
    <section id="what" data-chapter="Technology">
      <div className="wrap split">
        <div>
          <Reveal as="span" className="eyebrow">
            The fundamentals
          </Reveal>
          <SplitText as="h2" className="h1">
            A structure that carries load through its shape, not its mass.
          </SplitText>
          <Reveal as="p" className="lede" style={{ marginTop: 26 }}>
            A corrugated steel bridge is built from flat steel plates pressed into a deep corrugated
            profile, then crimped at regular intervals to force them into a curved arch. The corrugation
            multiplies the stiffness of the plate without adding weight.
          </Reveal>
          <Reveal as="p" className="lede" style={{ marginTop: 18 }}>
            The arch transfers load into the surrounding compacted soil rather than into a heavy concrete
            deck. Steel and engineered backfill work as one system. Less concrete. Less foundation. Far
            less time on site.
          </Reveal>

          {/* the point in view draws the figure, so it is marked as the live
              one — otherwise the link between the two columns is invisible */}
          <Reveal className="pts">
            {FUNDAMENTALS.map((f, i) => (
              <div
                className={['pt', i === active && 'on'].filter(Boolean).join(' ')}
                key={f.k}
                ref={setStepRef(i)}
              >
                <span className="k">{f.k}</span>
                <div>
                  <b>{f.title}</b>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="sticky-col">
          <div className={['morph', shot && 'photo'].filter(Boolean).join(' ')}>
            <span className="sheet-id">
              Sugam Met Tech &nbsp;·&nbsp; {shot ? 'Plant' : 'Indicative'}
            </span>

            {/* a fundamental with a photograph shows it; the rest stay drawn */}
            {FUNDAMENTALS.map((f, i) =>
              f.image ? (
                <div key={`shot-${f.k}`} className={['shot', i === active && 'on'].filter(Boolean).join(' ')}>
                  <Image src={f.image} alt={f.title} fill sizes="(max-width: 820px) 92vw, 620px" />
                </div>
              ) : null
            )}

            {STATES.map(({ Art }, i) =>
              FUNDAMENTALS[i]?.image ? null : (
                <svg key={i} viewBox="0 0 400 400" className={i === active ? 'on' : undefined}>
                  <Art />
                </svg>
              )
            )}

            <div className="state">
              <span>
                Fig. {`0${active + 1}`} <b>{shot ? FUNDAMENTALS[active].title : STATES[active].name}</b>
              </span>
              <span className="ticks">
                {STATES.map((_, i) => (
                  <i key={i} className={i <= active ? 'on' : undefined} />
                ))}
              </span>
            </div>
          </div>
          <p className="cap" style={{ marginTop: 14 }}>
            Diagram is indicative. Profile, rise and span are fixed by the approved design drawing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
