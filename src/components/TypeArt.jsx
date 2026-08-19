/* Motion diagrams for the profile range cards. Each one draws the geometry
   named in its card and then animates what actually moves through it — a
   vehicle, a train, water, or the liner sliding into an old structure.
   These are vector stand-ins for plant and site footage: when real clips
   arrive, pass `src` to <Media> instead of `art` and these drop straight out.

   All strokes resolve from the --dia-* tokens so the diagrams follow the
   theme, and the animation classes in globals.css are switched off wholesale
   by the prefers-reduced-motion block. The art is aligned to the top of the
   card because the caption plate covers the lower third. */

const VIEW = '0 0 400 300';

function Frame({ title, children }) {
  return (
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMin meet" role="img" aria-label={title}>
      {children}
    </svg>
  );
}

function Ground() {
  return (
    <>
      <path d="M0 250 H400" stroke="var(--dia-mid)" strokeWidth="1.4" />
      <g stroke="var(--dia-soft)" strokeWidth="1">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${i * 20} 250 l-9 14`} />
        ))}
      </g>
    </>
  );
}

/* Compacted backfill shoulders either side of an opening. */
function Fill({ d }) {
  return <path d={d} fill="rgba(11,14,17,.05)" stroke="var(--dia-soft)" strokeWidth="1" />;
}

function Car({ className = 'dia-vehicle' }) {
  return (
    <g className={className}>
      <path d="M0 0 h44 l10 -13 h20 l8 13 h6 v14 h-88 z" fill="var(--red)" />
      <circle cx="18" cy="16" r="5" fill="var(--dia-strong)" />
      <circle cx="70" cy="16" r="5" fill="var(--dia-strong)" />
    </g>
  );
}

function Train({ className = 'dia-vehicle' }) {
  return (
    <g className={className}>
      <path d="M0 0 h58 v-16 h-42 z" fill="var(--red)" />
      <rect x="62" y="-14" width="46" height="14" fill="var(--dia-strong)" />
      <rect x="112" y="-14" width="46" height="14" fill="var(--dia-strong)" />
      <g fill="var(--dia-strong)">
        <circle cx="14" cy="4" r="4" />
        <circle cx="44" cy="4" r="4" />
        <circle cx="76" cy="4" r="4" />
        <circle cx="130" cy="4" r="4" />
      </g>
    </g>
  );
}

/* A corrugated arc: the profile line, drawn on, plus its rib ticks. */
function Corrugation({ d, len }) {
  return (
    <>
      <path
        className="dia-arch"
        style={{ '--len': String(len) }}
        d={d}
        fill="none"
        stroke="var(--dia-strong)"
        strokeWidth="3.4"
      />
      <path d={d} fill="none" stroke="var(--red)" strokeWidth="1" strokeDasharray="2 9" opacity=".55" />
    </>
  );
}

/* 01 — the standard buried arch. Traffic runs over the fill, not on a deck. */
export function SingleSpanArch() {
  return (
    <Frame title="Single span buried arch with traffic passing over it">
      <Fill d="M40 250 V150 q160 -132 320 0 V250 h-40 V172 q-120 -96 -240 0 V250 z" />
      <Corrugation d="M80 250 V172 q120 -96 240 0 V250" len={470} />
      <path d="M40 148 H360" stroke="var(--dia-mid)" strokeWidth="2" />
      <g transform="translate(0,134)">
        <Car />
      </g>
      <Ground />
    </Frame>
  );
}

/* 02 — low rise, wide span, for restricted headroom. */
export function BoxCulvert() {
  return (
    <Frame title="Low rise box culvert profile with a vehicle passing through">
      <Fill d="M20 250 V150 H380 V250 h-42 V192 H62 V250 z" />
      <Corrugation d="M62 250 V200 q6 -14 20 -14 H318 q14 0 20 14 V250" len={480} />
      <path d="M20 148 H380" stroke="var(--dia-mid)" strokeWidth="2" />
      <g stroke="var(--red)" strokeWidth="1.2">
        <path d="M62 226 H100" />
        <path d="M62 220 v12" />
        <path d="M100 220 v12" />
      </g>
      <text x="81" y="244" fill="var(--red)" fontSize="9" fontFamily="var(--mono)" textAnchor="middle">
        LOW RISE
      </text>
      <g transform="translate(0,236)">
        <Car />
      </g>
      <Ground />
    </Frame>
  );
}

/* 03 — shallow cover, maximum waterway. */
export function Elliptical() {
  return (
    <Frame title="Elliptical low profile arch carrying a watercourse">
      <Fill d="M16 250 V158 H384 V250 h-38 V196 q-146 -58 -292 0 V250 z" />
      <Corrugation d="M54 250 V196 q146 -58 292 0 V250" len={430} />
      <path d="M16 156 H384" stroke="var(--dia-mid)" strokeWidth="2" />
      <g stroke="var(--signal)" strokeWidth="2.2" className="dia-flow" fill="none" opacity=".85">
        <path d="M64 226 h272" />
        <path d="M64 238 h272" />
      </g>
      <Ground />
    </Frame>
  );
}

/* 04 — parallel arches under a divided carriageway. */
export function MultiCell() {
  return (
    <Frame title="Two parallel arches carrying a divided carriageway">
      <Fill d="M14 250 V140 H386 V250 h-32 V186 q-70 -60 -140 0 V250 h-28 V186 q-70 -60 -140 0 V250 z" />
      <Corrugation d="M46 250 V186 q70 -60 140 0 V250" len={290} />
      <Corrugation d="M214 250 V186 q70 -60 140 0 V250" len={290} />
      <path d="M14 138 H386" stroke="var(--dia-mid)" strokeWidth="2" />
      <path d="M200 126 V150" stroke="var(--red)" strokeWidth="1.6" strokeDasharray="8 8" />
      <g transform="translate(0,124)">
        <Car />
      </g>
      <g transform="translate(0,124)">
        <Car className="dia-vehicle rev" />
      </g>
      <Ground />
    </Frame>
  );
}

/* 05 — full circular section for storm water and irrigation. */
export function CircularPipe() {
  return (
    <Frame title="Full circular pipe arch carrying storm water">
      <Fill d="M20 250 V132 H380 V250 h-70 a110 110 0 0 0 -220 0 z" />
      <circle
        className="dia-arch"
        style={{ '--len': '478' }}
        cx="200"
        cy="196"
        r="76"
        fill="none"
        stroke="var(--dia-strong)"
        strokeWidth="3.4"
      />
      <circle cx="200" cy="196" r="76" fill="none" stroke="var(--red)" strokeWidth="1" strokeDasharray="2 9" opacity=".55" />
      <circle cx="200" cy="196" r="60" fill="none" stroke="var(--dia-soft)" strokeWidth="1.2" />
      <path d="M20 130 H380" stroke="var(--dia-mid)" strokeWidth="2" />
      <g stroke="var(--signal)" strokeWidth="2.2" className="dia-flow" fill="none" opacity=".85">
        <path d="M142 208 h116" />
        <path d="M150 222 h100" />
      </g>
      <Ground />
    </Frame>
  );
}

/* 06 — new liner slid inside a distressed masonry structure. */
export function RehabLiner() {
  return (
    <Frame title="Corrugated liner sliding inside an old masonry arch">
      <path
        className="dia-pulse"
        d="M40 250 V168 q160 -104 320 0 V250"
        fill="none"
        stroke="var(--dia-mid)"
        strokeWidth="10"
        strokeDasharray="26 7"
      />
      <g stroke="var(--dia-soft)" strokeWidth="1">
        <path d="M92 214 l16 12" />
        <path d="M286 208 l-14 14" />
        <path d="M196 176 v16" />
      </g>
      <g className="dia-liner">
        <path d="M70 250 V184 q130 -84 260 0 V250" fill="none" stroke="var(--dia-strong)" strokeWidth="3.4" />
        <path d="M70 250 V184 q130 -84 260 0 V250" fill="none" stroke="var(--red)" strokeWidth="1" strokeDasharray="2 9" opacity=".7" />
      </g>
      <g stroke="var(--red)" strokeWidth="1.6" fill="none">
        <path d="M332 150 h42" />
        <path d="M332 150 l9 -6" />
        <path d="M332 150 l9 6" />
      </g>
      <text x="353" y="138" fill="var(--red)" fontSize="9" fontFamily="var(--mono)" textAnchor="middle">
        SLID IN
      </text>
      <Ground />
    </Frame>
  );
}

/* 07 — the 30 metre class span, railway formation over the top. */
export function LongSpanUnderpass() {
  return (
    <Frame title="Long span underpass with a train crossing above">
      <Fill d="M8 250 V124 H392 V250 h-24 V166 q-168 -116 -336 0 V250 z" />
      <Corrugation d="M32 250 V166 q168 -116 336 0 V250" len={560} />
      <path d="M8 122 H392" stroke="var(--dia-mid)" strokeWidth="2" />
      <g stroke="var(--dia-soft)" strokeWidth="2">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${14 + i * 25} 116 v10`} />
        ))}
      </g>
      <path d="M8 114 H392" stroke="var(--dia-strong)" strokeWidth="1.6" />
      <g transform="translate(0,110)">
        <Train />
      </g>
      <g stroke="var(--red)" strokeWidth="1.2">
        <path d="M32 236 H368" />
        <path d="M32 230 v12" />
        <path d="M368 230 v12" />
      </g>
      <text x="200" y="228" fill="var(--red)" fontSize="10" fontFamily="var(--mono)" textAnchor="middle">
        UP TO 30 m
      </text>
      <Ground />
    </Frame>
  );
}

/* Indexed to match the order of TYPES in data/site.js. */
export const TYPE_ART = [
  SingleSpanArch,
  BoxCulvert,
  Elliptical,
  MultiCell,
  CircularPipe,
  RehabLiner,
  LongSpanUnderpass,
];
