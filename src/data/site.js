/* Point this at a real track (e.g. '/audio/ambience.mp3') and the sound
   toggle plays that file instead of the generative Web Audio bed. */
export const AMBIENCE_FILE = null;

export const NAV_LINKS = [
  { href: '#what', label: 'Technology' },
  { href: '#types', label: 'Types' },
  { href: '#process', label: 'Process' },
  { href: '#project', label: 'Project' },
  { href: '#specs', label: 'Specifications' },
];

export const FOOTER_LINKS = [
  { href: '#what', label: 'Technology' },
  { href: '#types', label: 'Types' },
  { href: '#process', label: 'Manufacturing' },
  { href: '#galv', label: 'Galvanizing' },
  { href: '#project', label: 'Udhna Junction' },
  { href: '#specs', label: 'Specifications' },
];

export const STATS = [
  {
    parts: [{ count: 4 }, ' DECADES'],
    note: 'In steel structures, expanded metal and metal sections',
  },
  {
    parts: [{ count: 60 }, ' to ', { count: 75 }, ' YEARS'],
    note: 'Design life of a hot dip galvanized corrugated arch',
  },
  {
    red: true,
    parts: [{ count: 20 }, ' to ', { count: 30 }, '%'],
    note: 'More economical than RCC, precast and composite',
  },
  {
    parts: [{ count: 610 }, '+ GSM'],
    note: 'Hot dip zinc coating, approximately 86 microns',
  },
];

export const CREDS = [
  'Executed for Indian Railways',
  'Through Larsen & Toubro',
  'Udhna Junction, Surat',
  'Designed to IRC standards',
];

export const FUNDAMENTALS = [
  {
    k: '01',
    title: 'Corrugated profile',
    body: 'Deep pressed ribs give strength without bulk.',
    /* a photograph stands in for the drawn figure where one exists */
    image: '/plant/corrugated-profile.jpg',
  },
  {
    k: '02',
    title: 'Crimped curvature',
    body: 'Regular crimping shapes the plate into a true arch radius.',
    image: '/plant/crimped-curvature.jpg',
  },
  {
    k: '03',
    title: 'Soil steel action',
    body: 'Compacted backfill becomes part of the structure.',
    /* an illustration of footing pressure, not of soil steel action — see the
       README note. The drawn figure for this point is still in Technology.jsx
       if it is wanted back. */
    image: '/plant/soil-steel-action.jpg',
  },
];

/* The three numbers worth reading before the table — pulled from the rows
   below, so they stay in step with them. */
export const COMPARISON_HIGHLIGHTS = [
  { value: '20-30%', label: 'Lower project cost', note: 'Against RCC, precast and composite construction.' },
  { value: 'Hours', label: 'Not weeks on site', note: 'Udhna Junction went in inside a single traffic block.' },
  { value: '60-75', label: 'Year design life', note: 'On 610 GSM hot dip galvanizing, about 86 microns.' },
];

export const COMPARISON = [
  { label: 'Project cost', us: { w: 72, v: '20 to 30% lower' }, them: { w: 100, v: 'Baseline' } },
  { label: 'Site execution time', us: { w: 12, v: 'Hours to days' }, them: { w: 100, v: 'Weeks to months' } },
  { label: 'Design life', us: { w: 100, v: '60 to 75 years' }, them: { w: 72, v: '40 to 60 years' } },
  { label: 'Foundation demand', us: { w: 26, v: 'Low, works on poor SBC' }, them: { w: 100, v: 'High bearing needed' } },
  { label: 'Self weight', us: { w: 22, v: 'Light' }, them: { w: 100, v: 'Heavy' } },
  { label: 'Remote area feasibility', us: { w: 94, v: 'High, plates transportable' }, them: { w: 30, v: 'Low' } },
];

/* Each card shows a photograph from public/types. `art` (TypeArt.jsx, by
   index) stays as the fallback if an `image` is removed, and `video` can be
   added back to play a clip instead. */
export const TYPES = [
  {
    k: '01',
    image: '/types/single-span-arch.jpg',
    title: 'Single span arch',
    body: 'The standard highway and railway crossing. Buried arch, no deck slab.',
    media: 'Photo: single span arch bridge',
  },
  {
    k: '02',
    image: '/types/box-culvert.jpg',
    title: 'Box culvert profile',
    body: 'Low rise, wide span. Used where headroom above the crossing is limited.',
    media: 'Photo: box culvert profile',
  },
  {
    k: '03',
    image: '/types/elliptical.jpg',
    title: 'Elliptical and low profile',
    body: 'Maximum waterway or carriageway width under a shallow cover.',
    media: 'Photo: elliptical low profile arch',
  },
  {
    k: '04',
    image: '/types/multi-cell.jpg',
    title: 'Multi cell arch',
    body: 'Two or more arches in parallel for wide crossings and divided carriageways.',
    media: 'Photo: multi cell arch',
  },
  {
    k: '05',
    image: '/types/circular-pipe.jpg',
    title: 'Circular pipe arch',
    body: 'Full circular section for storm water, canals and irrigation crossings.',
    media: 'Photo: circular pipe arch',
  },
  {
    k: '06',
    image: '/types/rehab-liner.jpg',
    title: 'Rehabilitation liner',
    body: 'Slid inside a distressed masonry or RCC structure to extend its service life.',
    media: 'Photo: rehabilitation liner inside an old bridge',
  },
  {
    k: '07',
    image: '/types/long-span.jpg',
    title: 'Long span underpass',
    body: 'Spans up to 30 metres for national highway and railway underpasses.',
    media: 'Photo: long span vehicular underpass',
  },
];

export const MANUFACTURING_STEPS = [
  {
    title: 'Raw material preparation',
    body: 'Steel coil and plate are received, verified against mill test certificates and staged for production. Grade, thickness and surface condition are checked before anything enters the line.',
    stepMedia: 'Video: raw material yard, plate staging',
    clipMedia: 'Raw material yard, plate staging and inspection',
  },
  {
    title: 'Plasma cutting',
    body: 'Plates are profiled on a plasma bed to the exact dimensions taken from the approved production drawing. Every plate is cut to the arch geometry, not trimmed to fit.',
    stepMedia: 'Video: plasma cutting bed',
    clipMedia: 'Plasma torch cutting the arch profile',
  },
  {
    title: 'Corrugation forming',
    body: 'Flat sheet is pressed into a rigid corrugated pattern. This single operation converts a plate into a structural element. Rib depth and pitch are held to the design profile across the full plate length.',
    stepMedia: 'Video: corrugation press line',
    clipMedia: 'Press line forming the corrugation',
  },
  {
    title: 'Crimping and curving',
    body: 'The corrugated plate is crimped at regular intervals, forcing it into the curved arch radius specified by the drawing. Curvature is checked against a template at every stage.',
    stepMedia: 'Video: crimping and curving',
    clipMedia: 'Crimping machine curving the plate',
  },
  {
    title: 'First assembly mock up',
    body: 'Plates are trial assembled in the plant to confirm they match the drawing before anything leaves the factory. The Udhna arch was mocked up at 2.7 m height and 5.4 m width.',
    stepMedia: 'Video: first assembly mock up on plant floor',
    clipMedia: 'Plant floor mock up assembly',
  },
  {
    title: 'Weld joint testing',
    body: 'Every weld joint is tested. Nothing moves to final assembly on visual inspection alone.',
    stepMedia: 'Video: weld joint testing',
    clipMedia: 'Weld joint inspection and testing',
  },
  {
    title: 'Final assembly',
    body: 'The full arch is assembled, verified and released for surface treatment. What leaves this stage is a structure, not a set of parts.',
    stepMedia: 'Video: complete assembled arch, wide shot',
    clipMedia: 'Completed arch on the plant floor',
  },
];

export const GALVANIZING_STEPS = [
  {
    title: 'Surface preparation',
    /* plant floor: crimped plates and an assembled arch. Not the pickling
       line itself — see the README note. */
    image: '/plant/plant-floor.jpg',
    body: 'Degreasing, pickling and fluxing. Zinc will only bond to clean steel, so the preparation is not a formality.',
    stepMedia: 'Video: degreasing and pickling',
    clipMedia: 'Degreasing, pickling and fluxing',
  },
  {
    title: 'The zinc bath',
    /* plant assembly, not the kettle — see the README note */
    image: '/plant/plant-assembly.jpg',
    body: 'The assembled arch is immersed in molten zinc. The coating forms metallurgically. It becomes part of the steel rather than a layer sitting on top of it.',
    stepMedia: 'Video: immersion in molten zinc',
    clipMedia: 'The arch entering the molten zinc bath',
  },
  {
    title: '610 GSM verified',
    /* the plasma bed, not the coating check — see the README note */
    image: '/plant/plasma-cutting.jpg',
    body: 'The coating is measured at 610 grams per square metre, approximately 86 microns. This is the figure behind the design life, and it is what allows the structure to sit in soil, in water crossings and in coastal air.',
    stepMedia: 'Video: coating thickness measurement',
    clipMedia: 'Coating thickness verification',
  },
  {
    title: 'Ready to dispatch',
    image: '/plant/ready-to-dispatch.jpg',
    body: 'Galvanized plates are marked, bundled by erection sequence and loaded. The sequence matters, because at site the arch goes up in the order it comes off the truck.',
    stepMedia: 'Video: bundling and loading for dispatch',
    clipMedia: 'Marked, bundled and loaded for dispatch',
  },
];

export const GALV_DATA = [
  { n: '610+', label: 'GSM zinc coating' },
  { n: '86', label: 'Microns, approximate' },
  { n: '60-75', label: 'Year design life' },
  { n: 'BONDED', label: 'Metallurgically, not painted on' },
];

/* The project's credentials, read before the stage-by-stage account. Every
   value is from the site's own copy — nothing inferred from the film. */
export const PROJECT_FACTS = [
  { label: 'Client', value: 'Indian Railways' },
  { label: 'Executed through', value: 'Larsen & Toubro' },
  { label: 'Location', value: 'Udhna Junction, Surat' },
  { label: 'Structure', value: 'Corrugated steel arch' },
  { label: 'Site window', value: 'A single traffic block' },
];

/* Stills from the project's own film, so each stage shows that stage. The
   eleventh — the first train over the finished structure — is not in the
   supplied footage. */
export const TIMELINE = [
  { k: 'Stage 01', image: '/stages/01-material.jpg', title: 'Material reaches site', body: 'Galvanized plates arrive at Udhna Junction, marked in erection sequence.', media: 'Photo: material unloading at site' },
  { k: 'Stage 02', image: '/stages/02-abutment.jpg', title: 'Precast abutment', body: 'Abutments are cast and positioned in advance of the block, off the critical path.', media: 'Photo: precast abutment' },
  { k: 'Stage 03', image: '/stages/03-mockup.jpg', title: 'Mock up assembly at site', body: 'The arch is trial assembled beside the track to confirm fit before the block opens.', media: 'Photo: site mock up assembly' },
  { k: 'Stage 04', image: '/stages/04-membrane.jpg', title: 'Waterproofing membrane', body: 'Membrane is applied over the assembled arch and lapped to the design detail.', media: 'Photo: waterproofing membrane' },
  { k: 'Stage 05', image: '/stages/05-track-removed.jpg', title: 'Existing track removed', body: 'The traffic block begins. From this point every hour is measured.', media: 'Photo: track removal' },
  { k: 'Stage 06', image: '/stages/06-excavation.jpg', title: 'Excavation', body: 'Formation is excavated to the design level and prepared for the abutments.', media: 'Photo: excavation' },
  { k: 'Stage 07', image: '/stages/07-footings.jpg', title: 'Abutment installation', body: 'Precast abutments are set, levelled and checked.', media: 'Photo: abutment installation' },
  { k: 'Stage 08', image: '/stages/08-arch.jpg', title: 'Arch installation', body: 'The corrugated steel arch is craned onto the abutments as a complete unit.', media: 'Photo: arch being craned into position' },
  { k: 'Stage 09', image: '/stages/09-backfill.jpg', title: 'Soil filling', body: 'Engineered backfill is placed and compacted in layers. This is where the soil becomes structural.', media: 'Photo: backfill and compaction' },
  { k: 'Stage 10', image: '/stages/10-track.jpg', title: 'Track alignment', body: 'Track is relaid, aligned and cleared for traffic.', media: 'Photo: track alignment' },
];

export const DECK_LAYERS = [
  { k: 'Layer 01', title: 'Corrugated plate erected', body: 'Plates are erected at site on the deck sheet and bolted to the design torque.' },
  { k: 'Layer 02', title: 'Shear studs', body: 'Shear studs ensure composite action between the concrete slab and the structural steel beams. Their use is decided case to case, as per design intent.' },
  { k: 'Layer 03', title: 'Expanded metal reinforcement', body: 'Once the plate is erected, expanded metal reinforcement is laid over it.' },
  { k: 'Layer 04', title: 'Shuttering', body: 'Shuttering is set on the corrugated steel plate ahead of the pour.' },
  { k: 'Layer 05', title: 'Concreting', body: 'Deck concrete is poured, creating the composite section that carries the running surface.' },
  { k: 'Layer 06', title: 'Precast wing walls', body: 'Precast wing walls are placed on either side to retain the approach fill.' },
  { k: 'Layer 07', title: 'Earth filling', body: 'Earth filling over the bridge with suitable filters at designed intervals.' },
  { k: 'Layer 08', title: 'Road formation', body: 'Compaction to the required CBR, sub grade construction and a standard road surface, all as per IRC.' },
];

/* Every card carries a photograph. Most are stills from the Surat pedestrian
   subway film; 04 is the steel arch over a river (img1.png) and 08 is the only
   wooded crossing in any supplied asset.

   Four of them show the product rather than that specific crossing type —
   06 rehabilitation, 07 landscaping decks, 08 animal crossings and 10 mining
   and forest. Replace those first when real photographs of those jobs exist;
   the drawn figures in AppArt.jsx remain as the fallback if `image` is
   removed. */
export const APPLICATIONS = [
  { k: '01', image: '/apps/highway-bridges.jpg', title: 'Highway bridges', body: 'Road bridges for state and national highways.' },
  { k: '02', image: '/apps/service-road.jpg', title: 'Service road underpasses', body: 'Connecting service roads on either side of a main carriageway.' },
  { k: '03', image: '/apps/railway-crossings.jpg', title: 'Railway crossings', body: 'Underpasses and over bridges for railway formations.' },
  { k: '04', image: '/apps/water-crossings.jpg', title: 'Water crossings', body: 'Rivers, canals and storm water channels.' },
  { k: '05', image: '/apps/tunnels.jpg', title: 'Tunnels', body: 'Construction of tunnel sections using corrugated plate.' },
  { k: '06', image: '/apps/rehabilitation.jpg', title: 'Rehabilitation', body: 'Relining and extending the life of old bridge structures.' },
  { k: '07', image: '/apps/landscaping-decks.jpg', title: 'Landscaping decks', body: 'Landscaping over bridges and covered spaces.' },
  { k: '08', image: '/apps/animal-crossings.jpg', title: 'Animal crossings', body: 'Safe passage across highways in wildlife corridors.' },
  { k: '09', image: '/apps/pedestrian-crossings.jpg', title: 'Pedestrian crossings', body: 'Subways for pedestrian movement at junctions and stations.' },
  { k: '10', image: '/apps/mining-forest.jpg', title: 'Mining and forest', body: 'Remote locations where conventional construction is not practical.' },
];

/* The four figures an engineer checks first, lifted from the table below. */
export const SPEC_HIGHLIGHTS = [
  { value: '30', unit: 'm', label: 'Maximum span' },
  { value: '75', unit: 'T', label: 'Live load' },
  { value: '60–75', unit: 'yrs', label: 'Design life' },
  { value: '610+', unit: 'GSM', label: 'Zinc coating' },
];

export const SPECS = [
  ['Maximum span', 'Up to 30 metres'],
  ['Live load capacity', 'Up to 75 tonnes'],
  ['Design code', 'IRC standards'],
  ['Design life', '60 to 75 years'],
  ['Coating', 'Hot dip galvanized, 610+ GSM, approx. 86 microns'],
  ['Structural action', 'Soil steel composite arch'],
  ['Foundation requirement', 'Low, suitable for poor SBC sites'],
  ['Cost against RCC or precast', '20 to 30 percent more economical'],
  ['Erection', 'Bolted plate assembly, crane erected'],
  ['Deck options', 'Buried arch, or composite deck with shear studs'],
];

export const GALLERY_FILTERS = [
  { f: 'all', label: 'All' },
  { f: 'mfg', label: 'Manufacturing' },
  { f: 'galv', label: 'Galvanizing' },
  { f: 'site', label: 'Site execution' },
  { f: 'done', label: 'Completed' },
];

export const GALLERY = [
  { c: 'mfg', image: '/plant/plasma-cutting.jpg', cap: 'Plasma cutting the arch profile', label: 'Plasma cutting' },
  { c: 'mfg', image: '/plant/plant-floor.jpg', cap: 'Crimped plates on the shop floor', label: 'Crimped plates' },
  { c: 'mfg', image: '/gallery/profile-detail.jpg', cap: 'Corrugated profile, crimped and galvanized', label: 'Profile detail' },
  { c: 'mfg', image: '/plant/plant-assembly.jpg', cap: 'First assembly mock up in the plant', label: 'Assembly mock up' },
  { c: 'galv', image: '/gallery/zinc-bath.jpg', cap: 'The arch entering the zinc bath', label: 'Zinc bath' },
  { c: 'galv', image: '/plant/ready-to-dispatch.jpg', cap: 'Galvanized plates slung for dispatch', label: 'Ready to dispatch' },
  { c: 'site', image: '/stages/02-abutment.jpg', cap: 'Precast abutment at Udhna Junction', label: 'Precast abutment' },
  { c: 'site', image: '/stages/06-excavation.jpg', cap: 'Excavation during the traffic block', label: 'Excavation' },
  { c: 'site', image: '/stages/07-footings.jpg', cap: 'Precast footings set in the formation', label: 'Footings' },
  { c: 'site', image: '/stages/08-arch.jpg', cap: 'The arch craned into position', label: 'Arch installation' },
  { c: 'site', image: '/stages/04-membrane.jpg', cap: 'Protection layer laid over the arch', label: 'Membrane' },
  { c: 'site', image: '/stages/09-backfill.jpg', cap: 'Engineered backfill placed over the arch', label: 'Backfilling' },
  { c: 'site', image: '/stages/10-track.jpg', cap: 'Track relaid inside the block', label: 'Track work' },
  { c: 'done', image: '/stages/11-complete.jpg', cap: 'Udhna Junction from the air', label: 'Udhna Junction' },
];

export const APPLICATION_OPTIONS = [
  'Highway bridge',
  'Railway underpass',
  'Road underpass',
  'Water crossing',
  'Tunnel',
  'Rehabilitation of an old bridge',
  'Mining or forest',
  'Animal or pedestrian crossing',
  'Other',
];

export const LOAD_OPTIONS = ['Up to 25 T', '25 to 50 T', '50 to 75 T', 'Not known'];
export const TIMELINE_OPTIONS = ['Immediate', '1 to 3 months', '3 to 6 months', 'Exploring'];

export const SOCIAL = [
  {
    name: 'LinkedIn',
    /* the supplied link carried /about/?viewAsMember=true, which is a viewing
       mode rather than part of the address */
    href: 'https://www.linkedin.com/company/sugam-met-tech-pvt-limited/',
    icon: 'linkedin',
  },
  { name: 'Instagram', href: 'https://www.instagram.com/sugam.met.tech', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/Yita2rHnEASwj13X/', icon: 'facebook' },
];

export const CONTACT = {
  /* 080 is the Bengaluru STD code; the two landlines share it */
  phones: [
    { label: '+91 80 2860 0732', href: 'tel:+918028600732' },
    { label: '+91 80 2860 1422', href: 'tel:+918028601422' },
    { label: '+91 95901 12191', href: 'tel:+919590112191' },
    { label: '+91 95901 12151', href: 'tel:+919590112151' },
    { label: '+91 99001 01880', href: 'tel:+919900101880' },
  ],
  emails: [
    { label: 'sugamengrs@gmail.com', href: 'mailto:sugamengrs@gmail.com' },
    { label: 'sugamengrs@yahoo.co.in', href: 'mailto:sugamengrs@yahoo.co.in' },
  ],
  sites: [
    { label: 'www.sugammettech.com', href: 'https://www.sugammettech.com' },
    { label: 'www.sugamengrs.com', href: 'https://www.sugamengrs.com' },
  ],
  hours: 'Monday to Saturday, 9:30 am to 6:30 pm IST',
  address: {
    label: 'Regd. office & works',
    lines: [
      'Sy No. 62/1, Anchepalya',
      'Next to Rajarajeshwari Medical College and Hospital',
      'Kengeri, Karnataka 560074',
    ],
  },
};
