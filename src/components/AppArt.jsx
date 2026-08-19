/* One drawn figure per application card. Same drawing-sheet language as the
   technology figures — ground line, hatched backfill, red accent on whatever
   the card is actually about.

   These are illustrations, not photographs. When real photographs exist, give
   the entry an `image` in data/site.js and it takes priority over the figure;
   nothing else changes. */

const INK = 'var(--dia-strong)';
const MID = 'var(--dia-mid)';
const SOFT = 'var(--dia-soft)';
const RED = 'var(--red)';
const BLUE = 'var(--signal)';

const VIEW = '0 0 400 300';

function Frame({ title, children }) {
  return (
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}>
      <defs>
        <pattern id="aa-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(11,14,17,.16)" strokeWidth="1" />
        </pattern>
      </defs>
      {children}
    </svg>
  );
}

function Ground({ y = 250 }) {
  return (
    <>
      <path d={`M16 ${y} H384`} stroke={INK} strokeWidth="1.6" />
      <g stroke={SOFT} strokeWidth="1">
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M${22 + i * 21} ${y} l-7 9`} />
        ))}
      </g>
    </>
  );
}

/* buried arch: hatched fill with an opening cut out of it */
function Buried({ deck = 120, spring = 250, rise = 96, half = 104, cx = 200 }) {
  const l = cx - half;
  const r = cx + half;
  return (
    <>
      <path
        d={`M30 ${spring} V${deck} H370 V${spring} h-${370 - r} V${spring - rise + 40} A${half} ${rise} 0 0 0 ${l} ${spring - rise + 40} V${spring} Z`}
        fill="url(#aa-soil)"
        stroke={SOFT}
        strokeWidth="1"
      />
      <path d={`M30 ${deck} H370`} stroke={MID} strokeWidth="1.4" />
      <path
        d={`M${l} ${spring} V${spring - rise + 40} A${half} ${rise} 0 0 1 ${r} ${spring - rise + 40} V${spring}`}
        fill="none"
        stroke={INK}
        strokeWidth="3"
      />
      <path
        d={`M${l} ${spring} V${spring - rise + 40} A${half} ${rise} 0 0 1 ${r} ${spring - rise + 40} V${spring}`}
        fill="none"
        stroke={RED}
        strokeWidth="1"
        strokeDasharray="2 8"
      />
    </>
  );
}

function Car({ x, y, s = 1, color = RED }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 h34 l8 -10 h16 l6 10 h5 v11 h-69 z" fill={color} />
      <circle cx="14" cy="13" r="4" fill={INK} />
      <circle cx="55" cy="13" r="4" fill={INK} />
    </g>
  );
}

function Tree({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 v-14" stroke={INK} strokeWidth="2" />
      <path d="M0 -12 c-11 0 -15 -10 -8 -15 c-2 -9 12 -13 16 -6 c9 -1 12 10 4 14 c1 6 -6 8 -12 7 z" fill="rgba(11,14,17,.14)" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

function Person({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="1.6" fill="none">
      <circle cx="0" cy="-16" r="3.4" fill={INK} stroke="none" />
      <path d="M0 -12 v9" />
      <path d="M-5 -8 h10" />
      <path d="M0 -3 l-4 7" />
      <path d="M0 -3 l4 7" />
    </g>
  );
}

/* 01 */
export function HighwayBridges() {
  return (
    <Frame title="Highway bridge over a buried corrugated arch">
      <Buried />
      <g stroke={SOFT} strokeWidth="2" strokeDasharray="16 12">
        <path d="M40 110 H360" />
      </g>
      <Car x={96} y={96} />
      <Car x={232} y={96} color={MID} />
      <Ground />
    </Frame>
  );
}

/* 02 */
export function ServiceRoadUnderpasses() {
  return (
    <Frame title="Service road passing beneath a main carriageway">
      <Buried deck={116} rise={84} half={92} />
      <g stroke={SOFT} strokeWidth="2" strokeDasharray="14 10">
        <path d="M40 106 H360" />
      </g>
      <Car x={70} y={92} />
      <Car x={244} y={92} color={MID} />
      <Car x={152} y={228} s={0.8} color={MID} />
      <text x="200" y="284" fill={RED} fontSize="10" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1.4">
        SERVICE ROAD BELOW
      </text>
      <Ground />
    </Frame>
  );
}

/* 03 */
export function RailwayCrossings() {
  return (
    <Frame title="Railway formation carried over a corrugated arch">
      <Buried deck={112} rise={92} half={98} />
      <g stroke={MID} strokeWidth="2">
        {Array.from({ length: 15 }, (_, i) => (
          <path key={i} d={`M${44 + i * 21} 104 v9`} />
        ))}
      </g>
      <path d="M34 100 H366" stroke={INK} strokeWidth="1.8" />
      <g transform="translate(120 74)">
        <path d="M0 0 h46 v-18 h-32 z" fill={RED} />
        <rect x="50" y="-16" width="38" height="16" fill={INK} />
        <rect x="92" y="-16" width="38" height="16" fill={INK} />
        <g fill={INK}>
          <circle cx="12" cy="4" r="3.6" />
          <circle cx="36" cy="4" r="3.6" />
          <circle cx="66" cy="4" r="3.6" />
          <circle cx="110" cy="4" r="3.6" />
        </g>
      </g>
      <Ground />
    </Frame>
  );
}

/* 04 */
export function WaterCrossings() {
  return (
    <Frame title="River passing through a corrugated arch">
      <Buried deck={118} rise={92} half={104} />
      <g stroke={BLUE} strokeWidth="2.4" fill="none" opacity=".85">
        <path d="M110 214 h180" />
        <path d="M124 228 h152" />
        <path d="M138 242 h124" />
      </g>
      <Car x={150} y={94} />
      <Ground />
    </Frame>
  );
}

/* 05 */
export function Tunnels() {
  return (
    <Frame title="Corrugated plate tunnel section receding into the hillside">
      <path d="M20 250 V150 q180 -104 360 0 V250 Z" fill="url(#aa-soil)" stroke={SOFT} strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => {
        const k = 1 - i * 0.16;
        const half = 96 * k;
        const rise = 84 * k;
        return (
          <path
            key={i}
            d={`M${200 - half} 250 V${250 - rise + 34} A${half} ${rise} 0 0 1 ${200 + half} ${250 - rise + 34} V250`}
            fill="none"
            stroke={i === 0 ? INK : MID}
            strokeWidth={i === 0 ? 3 : 1.4}
            opacity={i === 0 ? 1 : 0.85 - i * 0.2}
          />
        );
      })}
      <path
        d="M104 250 V200 A96 84 0 0 1 296 200 V250"
        fill="none"
        stroke={RED}
        strokeWidth="1"
        strokeDasharray="2 8"
      />
      <Ground />
    </Frame>
  );
}

/* 06 */
export function Rehabilitation() {
  return (
    <Frame title="New liner slid inside a distressed masonry arch">
      <path
        d="M46 250 V178 q154 -96 308 0 V250"
        fill="none"
        stroke={MID}
        strokeWidth="11"
        strokeDasharray="24 7"
      />
      <g stroke={SOFT} strokeWidth="1.2">
        <path d="M104 214 l14 12" />
        <path d="M290 208 l-13 13" />
        <path d="M200 178 v16" />
      </g>
      <path d="M76 250 V192 q124 -78 248 0 V250" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M76 250 V192 q124 -78 248 0 V250" fill="none" stroke={RED} strokeWidth="1" strokeDasharray="2 8" />
      <g stroke={RED} strokeWidth="1.6" fill="none">
        <path d="M330 156 h38" />
        <path d="M330 156 l8 -6" />
        <path d="M330 156 l8 6" />
      </g>
      <text x="200" y="284" fill={RED} fontSize="10" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1.4">
        LINER INSIDE THE OLD ARCH
      </text>
      <Ground />
    </Frame>
  );
}

/* 07 */
export function LandscapingDecks() {
  return (
    <Frame title="Planting carried over a buried arch">
      <Buried deck={126} rise={88} half={100} />
      <Tree x={70} y={126} s={1.1} />
      <Tree x={132} y={126} s={0.9} />
      <Tree x={268} y={126} s={0.95} />
      <Tree x={330} y={126} s={1.15} />
      <g stroke={SOFT} strokeWidth="1.4">
        <path d="M170 126 q30 -16 60 0" />
      </g>
      <Ground />
    </Frame>
  );
}

/* 08 */
export function AnimalCrossings() {
  return (
    <Frame title="Wildlife corridor carried over a highway">
      <Buried deck={124} rise={90} half={104} />
      <Tree x={78} y={124} s={1} />
      <Tree x={318} y={124} s={1} />
      {/* a deer crossing the green bridge */}
      <g transform="translate(176 104)" stroke={INK} strokeWidth="1.8" fill="none">
        <path d="M0 0 h26" />
        <path d="M0 0 v14" />
        <path d="M8 0 v14" />
        <path d="M18 0 v14" />
        <path d="M26 0 v14" />
        <path d="M26 0 l10 -9" />
        <path d="M36 -9 l4 -8" />
        <path d="M36 -9 l-3 -9" />
        <circle cx="37" cy="-7" r="2.4" fill={INK} stroke="none" />
      </g>
      <Car x={150} y={222} s={0.8} color={MID} />
      <Ground />
    </Frame>
  );
}

/* 09 */
export function PedestrianCrossings() {
  return (
    <Frame title="Pedestrian subway beneath a road">
      <Buried deck={118} rise={78} half={86} />
      <g stroke={SOFT} strokeWidth="2" strokeDasharray="14 10">
        <path d="M40 108 H360" />
      </g>
      <Car x={72} y={94} color={MID} />
      <Car x={248} y={94} />
      <Person x={172} y={248} s={1.15} />
      <Person x={200} y={248} s={1.15} />
      <Person x={228} y={248} s={1.15} />
      <Ground />
    </Frame>
  );
}

/* 10 */
export function MiningAndForest() {
  return (
    <Frame title="Haul route crossing in remote terrain">
      {/* rough ground rather than a formed road */}
      <path d="M20 250 V148 q40 -22 78 -6 q46 20 92 -8 q52 -30 96 -2 q40 26 94 6 V250 Z" fill="url(#aa-soil)" stroke={SOFT} strokeWidth="1" />
      <path d="M20 148 q40 -22 78 -6 q46 20 92 -8 q52 -30 96 -2 q40 26 94 6" fill="none" stroke={MID} strokeWidth="1.6" />
      <path d="M118 250 V206 A82 74 0 0 1 282 206 V250" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M118 250 V206 A82 74 0 0 1 282 206 V250" fill="none" stroke={RED} strokeWidth="1" strokeDasharray="2 8" />
      {/* haul truck on the crossing */}
      <g transform="translate(150 108)">
        <path d="M0 0 h58 v-16 h-20 l-6 -10 h-32 z" fill={RED} />
        <circle cx="14" cy="6" r="6" fill={INK} />
        <circle cx="46" cy="6" r="6" fill={INK} />
      </g>
      <Tree x={54} y={150} s={0.9} />
      <Tree x={348} y={150} s={0.9} />
      <Ground />
    </Frame>
  );
}

/* Indexed to match APPLICATIONS in data/site.js. */
export const APP_ART = [
  HighwayBridges,
  ServiceRoadUnderpasses,
  RailwayCrossings,
  WaterCrossings,
  Tunnels,
  Rehabilitation,
  LandscapingDecks,
  AnimalCrossings,
  PedestrianCrossings,
  MiningAndForest,
];
