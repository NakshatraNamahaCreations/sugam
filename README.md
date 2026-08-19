# Sugam Met Tech — corrugated steel arch bridge microsite

Next.js 14 (App Router, JavaScript) port of `sugam-corrugated-bridge-microsite.html`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Layout

```
src/
  app/
    layout.js            font (next/font: Poppins) + metadata
    page.js              section order
    globals.css          the original stylesheet, unchanged apart from the font tokens
    api/enquiry/route.js enquiry endpoint (validates, logs — delivery is a TODO)
  components/            one component per section, plus Nav / Chrome / Footer
  data/site.js           all copy: stats, steps, timeline, specs, gallery, form options
  hooks/useScrollFx.js   useScroll, usePrefersReducedMotion, useInViewOnce, useActiveStep
```

The vanilla scroll code became hooks:

| Original | Now |
| --- | --- |
| `revealIO` | `useInViewOnce` behind `<Reveal>` |
| counters | `<Counter to={n} />` |
| sticky video rails | `useActiveStep` inside `StickyRail` |
| pinned horizontal gallery | `Types` (scroll handler writes the transform directly) |
| timeline spine, progress bar, parallax | `useScroll` |
| gallery filter + lightbox | `Gallery` component state |
| form validation | `Enquire` component state, revalidated in the API route |

## Theme

Light theme. Every colour resolves from the token block at the top of
`globals.css` — surfaces (`--paper`, `--paper-2`, `--paper-3`), ink (`--ink`,
`--ink-2`, `--ink-3`), brand (`--red`, `--molten`), rules and the `--dia-*`
diagram strokes. The inline SVGs in the components reference those same tokens,
so nothing hardcodes a colour outside that block. Going back to the original
dark palette means editing `:root`, not the components.

`--molten` is darkened to `#C2540A` for the galvanizing section; the original
`#FF7A18` is too light to read on white.

### Type

Poppins throughout, one family, loaded once in `layout.js` at weights
400/500/600/700/800 plus italic. The three type roles survive as weight and
tracking rather than as separate families:

| Token | Role | Now |
| --- | --- | --- |
| `--display` | the big figures | Poppins 700, tight tracking |
| `--body` | copy and headings | Poppins 400–800 |
| `--mono` | labels, counters, drawing annotation | Poppins 500 with wide letter-spacing |

It replaced Anton (display), Inter (body), Roboto Mono (labels) and EB Garamond
(the intro statement's italic line, now Poppins italic). The SVG figures no
longer hardcode `monospace` either — they read `var(--mono)` so they follow.

Anton was condensed and Poppins is not, so the sizes that leaned on that had to
come down: `.stat .n` went from 46px to 28px, or "60 to 75 YEARS" overflows its
258px column. `.h0`, `.datastrip b` and `.cmp-head b` picked up weight 700 and
negative tracking for the same reason.

## Brand assets

| File | Use |
| --- | --- |
| `public/sgm.png` | the horizontal lockup — nav and footer, both grounds |
| `src/app/icon.png` | favicon, the SMT arch cropped out of it |

The nav lockup renders at 140x66 and the footer at 200x94, both at quality 92.
At the previous 98px the browser fetched only the 128px variant — a 1.31x
oversample for artwork carrying a 4px "MET TECH (P) LTD." line, which is what
made it look soft. 140px pulls the 256px variant instead, a 1.83x oversample.

468 x 221, transparent, red throughout. It measures 5.01:1 on white and
3.86:1 on the dark hero photograph, so one file serves both grounds and there
is no light/dark swap to maintain.

The favicon is the SMT arch alone, cropped at y 1–69 where the artwork has a
clean gap before the wordmark starts at y 80. The full lockup would be
illegible at 32 px.

`logo.png` and `logo-mark.png` are the earlier stacked lockup and its
monogram, now unused.

## Hero banner

`public/banner.png` is the supplied master (1717 x 916, 2.25 MB). The hero loads
`banner.jpg`, an optimised derivative — `next/image` then serves responsive
WebP from it, so a 1080px viewport pulls about 83 KB and a 1920px one about
183 KB, with a blur placeholder while it arrives.

| File | Size | Role |
| --- | --- | --- |
| `banner.png` | 2306 KB | supplied master, kept unused |
| `banner.jpg` | 205 KB | hero source |
| `banner.webp` | 169 KB | spare, if you want to reference it directly |

Because the photograph is dark, the hero is the one dark panel on an otherwise
white site: headline, lede, cue and ghost button all flip to light-on-dark, the
red accents lift to `#FF4A63` so they clear the photograph, and the nav renders
light until it goes solid white on scroll. The logo needs no variant: `sgm.png`
is red throughout and clears the photograph on its own.

Two things worth knowing before launch:

- **The image is not a Sugam structure.** It is the Golden Bridge in Da Nang,
  Vietnam. On a page whose claim is "designed, manufactured and erected in
  India", an uncaptioned foreign landmark as the hero is a real
  misrepresentation risk. Caption it, or use an Udhna Junction photograph.
- **1717 px wide is under a full-bleed hero's needs.** It upscales on displays
  wider than about 1717 px, which will read as soft on a 2560 px monitor. A
  2560 px or wider master would fix it; upscaling this one adds no detail.

## Intro curtain

`components/Intro.jsx`, in five beats. White, like the rest of the site.

| Time | |
| --- | --- |
| 0.00 s | line opens at `scaleX(2.6)` — about 620 px, well inside the viewport |
| 0.90 s | contracted to its 240 px hairline, `scaleX(1)` |
| 1.26 s | collapsed to a point; **"We build India in steel"** opens out of it, flecks drifting |
| 2.41 s | the statement and the **START** gate |
| — | *waits for the visitor* |
| hold 1.1 s | ring fills; on completion the panels split, scroll unlocks, hero headline starts |
| +0.85 s | curtain gone |

The statement mirrors the reference's mixed setting: the first line in serif
italic (EB Garamond) with one word thrown into the bold sans, the second in
the body face.

> *In four decades we* **BUILT** *many structures.*
> This one was the first of its kind in India.

### Press and hold

START is held, not clicked. Hovering it reveals the affordance ("Press and
hold"); pressing fills a ring around the button over 1.1 s, and the page opens
when the ring closes. Let go early and the ring runs back down over 320 ms
rather than snapping, so a mis-tap reads as a near miss instead of a glitch.

The button's own border is the track; an SVG circle rotated -90° draws the
progress from the top, its `stroke-dashoffset` driven from a
`requestAnimationFrame` loop. Progress lives in a ref as well as state, so the
loop reads the current value rather than a stale closure.

Keyboard gets the same interaction: Enter or Space begins the hold on keydown
and ends it on keyup, with auto-repeat ignored. Pointer leave, cancel and blur
all release it.

### The gate earns its keep

Web Audio needs a user gesture, which is why the sound toggle could never
start anything on load. The gate is the one honest moment to offer it: choose
sound before entering, and the hold that opens the page starts the ambience.
`Intro` dispatches `sugam:sound-on` when the hold completes — about a second
after the pointerdown, comfortably inside the browser's transient activation
window — and `SoundToggle` handles it with the engine it already owns. One
engine, no duplicate audio path.

### Details

The flecks are the counterpart of the reference's sparkles — galvanized
offcuts, ink and red on white, thrown off the line and rotating as they fall.
Their positions, drift, rotation and timing are a fixed table rather than
random, because the curtain is server rendered and per-render values would
mismatch on hydration. Twelve of them; delete `FLECKS` to drop the effect.

The line is deliberately kept short of the edges: a 240 px base opening at
2.6x reaches about 620 px, which is 46% of a 1366 px viewport and 33% of a
1920 px one. Below 820 px the base is capped at 26vw and the opening scale
drops to 2.4, holding it at 62% of the screen — a 52vw base at 2.6x would
overrun a phone by a third.

The panels ease to `scale(.994)` from the collapse onward, so the curtain
reads as pulling away rather than only the line moving. They are 50.4% tall
each, overlapping by a hair so no seam shows.

`IntroProvider` publishes one boolean through context: has the curtain parted.
The hero reads it instead of firing on its own frame, so the headline plays
*through* the reveal. Scroll is locked until the panels part.

Timings are the four constants at the top of `Intro.jsx` — `DRAW`, `ZOOM`,
`TAGLINE`, `OPEN`.

Two ways out, so the curtain can never trap the page:

- `prefers-reduced-motion` skips it entirely — no curtain, page straight away
- a `<noscript>` block in `layout.js` hides it and resolves all the masked text

Note that the gate is now a deliberate stop: without a click, the visitor does
not reach the page. That is what the reference does, and it is a real
conversion trade — see "Still to wire".

## Hero layout

Modelled on the reference screenshot: logo left, links centred, tools right;
a left index rail carrying the chapter counter over a running rule with
"Scroll down" set vertically; an oversized sentence-case headline; the
standfirst bottom right; a scroll pill bottom centre.

The headline uses the body grotesque at weight 800 rather than the condensed
display face, which is what gives the reference its look — Anton is still used
for the statistics and the galvanizing data strip.

The copy is Sugam's, not the reference's. The screenshot's Grand Canyon
wording belongs to that site and describes a different structure.

### Text animation

Two tiers, sharing one technique — the mask sits on the word, so lines still
wrap and kern normally, and a padding / negative-margin pair keeps descenders
out of the clip.

**Banner headline** (`Hero.jsx`) reveals *character by character*: 37 letters,
28 ms apart, one continuous cascade across all three lines rather than
restarting per line, running 1.04 s. Character indices are precomputed from
the word list, so rewording the headline cannot break the rhythm. Everything
around it — eyebrow, buttons, standfirst, rail, scroll pill — lifts in
afterwards on the same clock, keyed off `TOTAL`.

**Section headings** (`SplitText.jsx`) reveal *word by word*, 45 ms apart,
fired by `useInViewOnce` as each heading scrolls in. The wrapper class is
`wordreveal`, deliberately not `split` — `.split` is the stylesheet's
two-column grid, and the collision turned every heading's words into grid
cells two to a row. Every `h1`-class heading
on the page uses it — 12 of them, 90 words. Drop-in:

```jsx
<SplitText as="h2" className="h1" style={{ maxWidth: '22ch' }}>
  Ten crossings, one structural system.
</SplitText>
```

Children must be plain text, since the words are split on whitespace.

Both tiers are disabled by the `prefers-reduced-motion` block.

Below 820 px the rail and scroll pill are dropped and the standfirst stacks
under the headline.

## Technology section

The three fundamentals and the figure beside them are one control: whichever
point is in the middle of the viewport draws its figure. That link is visible —
the live point's badge fills red, a rail runs down its left edge and the ground
tints, while the figure's foot bar reads `Fig. 01 — Flat plate` with three
ticks filling as you read down.

The three figures are drawn to be presented, not to decorate:

| Fig. | Shows | Annotated with |
| --- | --- | --- |
| 01 Flat plate | steel with depth, sagging under load | plate length, thickness, deflection curve, "carries by bending" |
| 02 Corrugated profile | the same steel pressed | pitch between crests, depth between crest and valley lines |
| 03 Assembled arch | arch, footings, hatched backfill | span, rise, load arrows, thrust into the footings, centreline |

Each composes across roughly y 120–350 of the 400 unit sheet. The earlier
versions drew a thin band around y 190–230 and left the panel two-thirds
empty, which is what made it look unfinished.

### Photograph or figure

A fundamental with an `image` shows a photograph in the sheet; the rest stay
drawn.

| | Fundamental | Sheet shows |
| --- | --- | --- |
| 01 | Corrugated profile | `plant/corrugated-profile.jpg` — crimped galvanized plates, lug and bolt holes |
| 02 | Crimped curvature | `plant/crimped-curvature.jpg` — the arch trial assembled on its jig |
| 03 | Soil steel action | `plant/soil-steel-action.jpg` — a supplied illustration |

**Figure 03 does not illustrate its point.** The supplied image is an AI
generated render of a steel column on a concrete pad footing, labelled LOAD,
LATERAL SOIL PRESSURE and SOIL BEARING PRESSURE. That is shallow foundation
mechanics: a column bearing down on a pad, and earth pushing in on its sides.

Soil steel action is a different mechanism. The corrugated barrel and the
compacted backfill act as one structure — load arches *around* the barrel
through the fill rather than bearing on a footing, which is why these
structures need so little foundation. The card's own body says it: "compacted
backfill becomes part of the structure". A pad footing is the thing they avoid.

The drawn figure this replaced showed it correctly — arch, hatched backfill,
load spreading into the fill, thrust into the springings. It is still in
`Technology.jsx` as `Arch`; deleting the `image` from that fundamental in
`data/site.js` brings it back.

It is also the only synthetic image on the site. Everything else is now a
photograph of Sugam's own work.

It was padded to square rather than cropped, on a `#F1F5F8` ground matching the
sheet: a centre crop would have cut the "LATERAL SOIL PRESSURE" labels off both
edges. 3342 KB PNG in, 163 KB JPEG out. Over a photograph the foot bar flips to
a dark gradient (the pale one it uses over line work vanishes against a
picture) and the sheet id reads "Plant" rather than "Indicative".

The supplied frame carried a camera stamp across the bottom
("NBD_ Naveen Babu D | Puradapalya | 26 June 2026 at 6:31 pm"); every crop is
taken above it. The same photograph, cropped tighter, replaced the gallery's
profile detail, which had been a soft crop from 480p video.

The panel is dressed as a drawing sheet: 40 px ruled ground, red corner ticks,
a sheet id at the head, the state bar over a fade at the foot, and a soft drop
shadow to lift it off the page.

### Keeping the figure on screen

Two things were cutting figure 03 off at the top of the window, and both are
fixed in `globals.css`:

- **The panel was taller than the viewport.** At a 1320 px container each
  column is 624 px, so a square panel plus the 120 px sticky offset and its
  caption needs 784 px — 16 px more than a 768 px window. `.morph` and
  `.layers` are now capped at `calc(100svh - 215px)` and centred, so they
  shrink on short screens and always clear.
- **Sticky was released too early.** The grid ended just as point 03 became
  active, so the figure was dragged off the top exactly when the arch was on
  screen. `.pts` now carries `min(30vh, 320px)` of runway below the last
  point, and `.lsteps` the same for the composite deck section.

Both are undone below 820 px, where the columns stack and nothing is sticky.

## Comparison section

Three takeaway figures on white cards sit above the table, so the argument
lands before anyone reads a row: 20–30% lower cost, hours not weeks, 60–75
year life. They come from `COMPARISON_HIGHLIGHTS` in `data/site.js`, beside
the rows they summarise.

### The dial

The six measures are set along an arc rather than stacked as rows: numbers
seated on a circle of radius 318 centred off to the right, sweeping 213° to
147° so 01 sits at the top, each tilted with the curve. The live measure's
number is pulled into the centre at up to 92 px with its label beside it, and
its two tracks run in the right half.

It cycles every 4.2 s once the section is in view, and stops for good the
moment someone picks a measure — an autoplaying carousel that keeps moving
under a reader is worse than none. The measures are a `tablist`: arrow keys
step through them, and only the live one is in the tab order.

Below 820 px the arc is dropped entirely — a 318 px radius does not fit a
phone — and the numbers become a plain row of chips above the readout.

Both tracks are **named in place** — "Corrugated" and "RCC / precast" — rather
than relying on the legend and colour alone.

The empty track carries `rgba(11,14,17,.14)`. It was `--paper-3`, which
measured 1.10:1 against the tinted section ground — invisible, which meant the
100% reference the bars are read against could not be seen. It is now 1.35:1,
with the red bar at 4.03:1 over it.

**Trade-off worth knowing:** the old layout showed all six measures at once.
The dial shows one. It reads far better, but a reader comparing cost against
foundation demand now has to click between them.

## Applications carousel

Ten cards in a horizontal rail rather than a five-column grid. Ten items never
read as a grid, and the rail gives each card a figure at a size worth drawing.

Native scroll does the work — snap points, touch swipe and keyboard scrolling
all come free — and the arrows only call `scrollBy`. The progress bar and the
`01 / 10` counter are derived from `scrollLeft`, and the arrows disable at each
end. The rail deliberately breaks the container so cards run to the viewport
edge, with the gutter restored as scroll padding.

### Card imagery

Every card carries a photograph. `Media` takes `image` ahead of `art`, so the
drawn figures in `AppArt.jsx` remain as the fallback if an `image` is removed.

All ten are stills cut with `ffmpeg-static` from the assets supplied — nothing
is stock. 1200x900 sources, served by `next/image` at about 20 KB each: 213 KB
for the whole carousel.

| | Card | Photograph | Depicts the card? |
| --- | --- | --- | --- |
| 01 | Highway bridges | aerial, carriageway beside the works | yes |
| 02 | Service road underpasses | aerial, road over the railway formation | yes |
| 03 | Railway crossings | track and ballast during the block | yes |
| 04 | Water crossings | steel arch over a river (`img1.png`) | yes |
| 05 | Tunnels | inside the corrugated arch, bolted ribs receding | yes |
| 06 | Rehabilitation | arch plates craned into place | **no — shows installation** |
| 07 | Landscaping decks | the finished deck and turf strip | partly |
| 08 | Animal crossings | viaduct in a wooded valley (`v1.mp4`) | **no — nearest wooded crossing** |
| 09 | Pedestrian crossings | the arch portal with the crane | yes — this project *is* one |
| 10 | Mining and forest | earthworks over the buried arch at dusk | partly |

Every crop is a true 4:3 window on its source frame, so nothing is upscaled,
and each is positioned to exclude the film's burned-in lower thirds.

**Four cards do not show their own application** — 06, 07, 08 and 10. The
supplied footage covers one railway subway job, which contains no rehabilitation
lining, no wildlife corridor and no mining haul route. Those four show the
product instead. Replace them first: drop a file in `public/apps/` and repoint
the entry's `image`.

## Project timeline

Eleven stages down a spine, alternating side to side. Ten of them carry a
photograph of that stage, cut from the project's own film — this section and
that film are the same job, so for once the images are exactly what the text
says.

| Stage | Photograph |
| --- | --- |
| 01 Material reaches site | aerial, cranes and plant on site |
| 02 Precast abutment | the cast abutment before the block |
| 03 Mock up assembly | the arch trial assembled beside the track |
| 04 Waterproofing membrane | the protection layer being laid over the arch |
| 05 Existing track removed | track and ballast, block begun |
| 06 Excavation | formation dug out |
| 07 Abutment installation | precast footings set in the pit |
| 08 Arch installation | the arch craned in |
| 09 Soil filling | engineered fill placed over the arch |
| 10 Track alignment | track work inside the block |
| 11 Train over the bridge | the junction from the air, chipped "Udhna Junction during the works" |

Three of the first cuts landed on the wrong shot — the officials' briefing
instead of the track lift, a pit instead of the crane — because the film cuts
between split-screen panels every second or two. Each crop is now checked
against its stage, and positioned to exclude the burned-in labels
("EXCAVATION DURING BLOCK", "ARCH INSTALLATION").

### Section design

A credentials strip sits between the standfirst and the spine — client,
contractor, location, structure, site window — from `PROJECT_FACTS` in
`data/site.js`. It fills what was dead space under the intro and gives the case
study the record a reader looks for first. White on the tinted section, so it
reads as a record rather than as more body copy. Every value comes from the
site's own copy; nothing is inferred from the film.

The spine is banded: **Traffic block begins** before stage 05 and **Traffic
restored** after stage 10, because that is what the section is about and the
copy for both stages already says so. Stage 11, the first train, sits outside
the band.

Each stage is one card: the photograph fills it and the stage number, title
and text sit over its foot on a dark gradient. The earlier layout put prose in
one column and a picture in the other, which left most of the section empty and
made the images small. One card per stage is denser and lets the photographs
carry the account.

Spine markers carry the stage number and fill red as each stage arrives, so the
spine reads as a numbered sequence rather than as dots. Cards lift on hover
with a slow image zoom.

Stage 11 shows the junction from the air. **There is no train anywhere in the
supplied footage** — the opening aerials were checked frame by frame, and
everything after 1:48 is colour bars — so the card carries a chip reading
"Udhna Junction during the works". The picture is the place the sentence names,
and the chip stops it passing for the first train. Replace it with the real
shot and drop the chip.

## Specifications section

Four headline figures sit above the table — 30 m span, 75 T live load, 60–75
year life, 610+ GSM — from `SPEC_HIGHLIGHTS` in `data/site.js`. They are the
numbers an engineer checks before reading a row, and they come from the table
below them.

The table itself was a spreadsheet: a solid black header band at 19:1 contrast
that pulled harder than the page heading, and grey zebra striping. It is now a
datasheet — the header is a light mono label at 4.1:1, striping is gone, and
hovering a row tints it and runs a red rule down its left edge so the eye
tracks parameter to value across the width.

Values are set in the mono role at weight 500 so figures line up as a column.

The download button carries a download glyph rather than being a bare ghost
button, since it is the one thing on the page a visitor takes away.

## Gallery

Fourteen photographs, all real, filtered by stage. **No placeholder tile
remains anywhere on the site.**

| Filter | Count | Contents |
| --- | --- | --- |
| Manufacturing | 4 | plasma cutting, crimped plates, profile detail, assembly mock up |
| Galvanizing | 2 | the zinc bath, plates slung for dispatch |
| Site execution | 7 | abutment, excavation, footings, arch craned in, membrane, backfill, track |
| Completed | 1 | Udhna Junction from the air |

The original twelve entries included an approved L&T drawing, a Sugam
production drawing and a 3D render. **Those were dropped rather than
illustrated.** They are specific documents belonging to the client and the
company; producing something that looked like an approved drawing would be
manufacturing a record. The two that could be shown honestly were kept as
photographs instead: the corrugated profile detail is a close crop of a bolted
seam, and the zinc bath is a frame from the plant video.

Captions were rewritten to describe what each photograph actually shows.

The `tall` and `warm` flags went with the rebuild. Every source is landscape,
and cropping landscape photographs into 3:4 tiles threw away too much of them;
the grid is uniform 4:3 now.

## Motion diagrams

The seven profile cards in the Types section run animated SVG diagrams from
`components/TypeArt.jsx` — arch drawing on, vehicles crossing, water flowing,
the rehabilitation liner sliding into the host structure. They are stand-ins for
real footage, not decoration: each one draws the geometry its card describes.

Animation classes (`dia-arch`, `dia-vehicle`, `dia-flow`, `dia-liner`,
`dia-pulse`) live in `globals.css` and are switched off by the
`prefers-reduced-motion` block.

## Media

`components/Media.jsx` renders one of four things, in priority order:

- `image` — a photograph, through `next/image` with `fill`
- `src` — footage: a muted loop via `LazyVideo`, or a controlled film with `controls`
- `art` — a motion diagram component (`TypeArt.jsx`)
- none — the labelled placeholder tile

So a card can be given a photo, a clip or a diagram by changing one field in
`data/site.js`, with no markup change.

`LazyVideo` plays only while the card is on screen and holds `preload="none"`,
so the initial load pulls posters rather than seven videos, and seven decoders
are never alive at once. It sits out entirely under `prefers-reduced-motion` —
the poster stands in.

### The project film

The right column of the manufacturing rail plays one narrated film rather than
a clip per step, because that is what the footage is: `Final Marge video AA.mp4`
is a 3:06 presentation cut with voice, burned-in captions, split screens and
lower thirds. Cropping it square and muting it, the way the type card loops are
treated, would have destroyed all four.

So it keeps its 16:9 frame, its audio and its controls. `FeatureVideo` handles
it; `LazyVideo` still handles the muted card loops.

**No transport controls.** It starts itself when the section comes into view,
loops, and pauses when it leaves. The native control bar is gone.

**It tries to start with sound.** Browsers block unmuted autoplay unless the
page already has user activation — which this page has, because nobody reaches
it without holding START on the intro curtain. So the first time the section
comes into view the film calls `play()` unmuted.

Where that is refused — Safari, autoplay disabled in settings, someone
deep-linking past the intro to `#process` — the promise rejects, and it retries
muted rather than leaving a frozen poster. The corner button then offers the
sound the browser would not give.

Only the first entry reaches for sound. After that the film respects whatever
the viewer last chose with the button, so muting it does not undo itself on the
next scroll past.

Playing with sound dispatches `sugam:sound-off`, which `SoundToggle` handles by
fading the ambience out — narration over generative music is unusable.

Under `prefers-reduced-motion` it does not start itself; the poster and the
controls remain.

One cost worth knowing: autoplay-in-view means most visitors who reach this
section download the 13.8 MB clip, where click-to-play only spent it on people
who asked. `preload="metadata"` keeps the initial page load unaffected.

**Only the first 108 seconds are footage.** From 1:49 to the end — 41% of the
file — the source is SMPTE colour bars with a raw filename burned in
(`VID-20260718-WA0070.mp4`, labelled "LEVELLING"), i.e. unfilled slots in a
rough cut. The shipped clip is trimmed at 108 s. Re-export from the master when
the edit is finished and the trim can go.

| | |
| --- | --- |
| master | 1080p, 9.1 Mbps, 3:06, 202 MB |
| shipped | `clips/udhna-build.mp4`, 720p, 1:48, 13.8 MB |

It is click-to-play with `preload="none"`, so the 13.8 MB is only fetched by
someone who asks for it.

Note the content is site execution at Udhna Junction — excavation, arch
installation, the DRM interview — not plant manufacturing. It sits under a
heading about the seven plant stages. It would belong more naturally in the
Project section.

### Card photographs

Card 01 uses a photograph rather than a clip. `public/img1.png` is the supplied
master (1536x1024, 2.5 MB); `public/types/single-span-arch.jpg` is a 1024²
centre crop of it at 153 KB, which `next/image` then serves responsively — 23 KB
at the card's 384 px, 61 KB at 2x.

The crop is square because the cards are. The arch survives it and the caption
plate covers only river, but both springing points are lost — worth knowing if
a replacement photo is chosen for a card.

Note the photograph is a **tied arch**: the arch sits above a suspended deck on
hangers. Card 01 describes a buried arch with no deck slab, which is close to
the opposite. It is a steel arch bridge and it reads well, but it is not the
product the card names.

### The profile card photographs

The seven profile cards carry photographs in `public/types/`, 900x900 because
the cards are square. All are stills cut with `ffmpeg-static`; about 20 KB each
delivered, 145 KB for the set.

| | Card | Photograph | Shows the card? |
| --- | --- | --- | --- |
| 01 | Single span arch | the corrugated arch portal, crane alongside | yes |
| 02 | Box culvert profile | the finished low, wide structure and apron | close |
| 03 | Elliptical and low profile | low arches over water, close aerial | visually, but masonry |
| 04 | Multi cell arch | the same viaduct wide — arches in series | visually, but masonry |
| 05 | Circular pipe arch | inside the bolted corrugated section | close |
| 06 | Rehabilitation liner | plates and membrane going over the structure | **no — new build** |
| 07 | Long span underpass | the buried arch at night during backfill | yes |

An earlier pass had three adjacent cards showing the same reservoir viaduct,
which read as a bug rather than a choice. All seven are now distinct.

03 and 04 are the masonry viaduct from `v1.mp4` — the only multi-arch and
low-profile imagery in any supplied asset. They are not corrugated steel and
not Sugam's work. 06 shows a new structure being built rather than an old one
being lined. Those three are the ones to replace.

The card design changed with the imagery: the caption sits over a dark foot
gradient with the index in a red tab, because a white plate over a photograph
washes it out. The old stock clips in `public/clips/type-*.mp4` are no longer
referenced.

### Card photographs

Card 01 uses a photograph rather than a clip. `public/img1.png` is the supplied
master (1536x1024, 2.5 MB); `public/types/single-span-arch.jpg` is a 1024²
centre crop of it at 153 KB, which `next/image` then serves responsively — 23 KB
at the card's 384 px, 61 KB at 2x.

The crop is square because the cards are. The arch survives it and the caption
plate covers only river, but both springing points are lost — worth knowing if
a replacement photo is chosen for a card.

Note the photograph is a **tied arch**: the arch sits above a suspended deck on
hangers. Card 01 describes a buried arch with no deck slab, which is close to
the opposite. It is a steel arch bridge and it reads well, but it is not the
product the card names.

### Rail step imagery

`StickyRail` takes an `image` per step now, on both the sticky clip and the
mobile one. A step with an `image` shows the photograph; without it, the
labelled placeholder tile remains. So the manufacturing and galvanizing rails
can be filled a step at a time as photographs arrive.

All four galvanizing steps carry photographs now, supplied at 1280x960 and
cropped to 1280x720 for the 16:9 tile.

| Step | File | Shows the step? |
| --- | --- | --- |
| 01 Surface preparation | `plant/plant-floor.jpg` | **no** — the shop floor after forming |
| 02 The zinc bath | `plant/plant-assembly.jpg` | **no** — the arch being trial assembled |
| 03 610 GSM verified | `plant/plasma-cutting.jpg` | **no** — the CNC plasma bed |
| 04 Ready to dispatch | `plant/ready-to-dispatch.jpg` | yes — galvanized plates slung for loading |

Only step 04 matches its step. The other three are good plant photographs
sitting in the wrong slots, and each has an obvious right home on the
manufacturing rail, whose seven steps are all still placeholders:

| File | Belongs on |
| --- | --- |
| `plasma-cutting.jpg` | manufacturing 02, *Plasma cutting* — it is literally that machine |
| `plant-assembly.jpg` | manufacturing 05, *First assembly mock up* — black steel, pre galvanizing |
| `plant-floor.jpg` | manufacturing 04, *Crimping and curving*, or 05 |

Moving any of them is one line. The galvanizing steps they vacate want the
pickling line, the kettle and a coating gauge; the plant video already in the
company section is the kettle, if a frame from it would do.

Still unfilled: manufacturing steps 01-07 and the three drawings in the
gallery.

### The plant clip

The company section plays `clips/plant-galvanizing.mp4` — corrugated arch
plates on the hoist going into the zinc bath, from a phone video shot at the
plant. Muted loop through `LazyVideo`, so it only plays while on screen.

| | |
| --- | --- |
| source | 480x480, 93 s, 725 kbps, 8.0 MB with audio |
| shipped | 480x480, no audio, CRF 30, 4.7 MB |

The audio went because the clip is decorative — a muted loop needs no track,
and it was half the weight.

It is held square because the source is. Cropping a 480 px frame to 4:3 throws
away a fifth of the little resolution it has, and at the column's ~624 px it is
already scaling up about 1.3x. It reads fine at that size, but it is the
softest asset on the page; a proper camera file would replace it well.

Worth noting the content is *galvanizing*, so it would sit at least as well in
that section, whose four rail tiles are still placeholders.

### The type card clips

`public/v1.mp4` and `public/v2.mp4` are the supplied masters: 4K at 99 Mbps
(48 s, 573 MB) and 1440p60 at 13.5 Mbps (17 s, 27 MB). Neither can be served.

`public/clips/` holds seven 7-second square loops cut from them with
`ffmpeg-static` — 720x720 centre crop, H.264 CRF 30, no audio, faststart —
plus a still per clip as the poster.

| | Source | Total |
| --- | --- | --- |
| masters | v1 + v2 | 600 MB |
| shipped | 7 clips + 7 posters | 2.6 MB |

To recut, the cut list is in the `node -e` command in the project history:
timestamps 12, 20, 28, 2 from v1 and 1, 9 from v2, then 38 from v1.

**The footage does not match the cards.** v1 is aerial drone video of a stone
multi-arch viaduct over a reservoir; v2 is a concrete gravity dam. Neither is
corrugated steel, neither is a Sugam structure, and neither is in India — and
the cards they now illustrate are named for specific corrugated steel profiles
(box culvert, circular pipe arch, rehabilitation liner). Concrete arches also
illustrate the material the comparison section argues against. Replace them
with plant and site footage when it exists: drop a file in `public/clips/`,
point the entry's `video` and `poster` at it in `data/site.js`, and nothing
else changes. Removing `video` from an entry restores its vector diagram.

## Sound

A toggle sits in the nav, left of the burger. Off by default — audio never
starts without a click, and a returning visitor who left it on only gets it
back after their first interaction, because playback needs a user gesture.
Playing audio is suspended while the tab is hidden.

With `AMBIENCE_FILE` unset (the default), `lib/ambience.js` synthesises the bed
live with the Web Audio API: bass, a pad under a slow filter sweep, filtered
air, a plucked melodic line walking a pentatonic, and struck-metal FM hits
through a feedback delay. Nothing loops, so there is no seam, and it
downloads nothing.

### Sound design, per section

The bed is built out of the subject matter. Under the music sit synthesised
plant textures, scheduled against whichever chapter the reader is in. Voices
are never restarted — harmony, filter cutoff, delay, tempo and every bus level
glide over 2.6 s, so it stays one continuous piece.

| Mood | Sections | Music | Plant sound |
| --- | --- | --- | --- |
| `steel` | Hero, Credentials, Technology, Comparison, Types, Composite deck, Specifications | open, no third in the melody | a plate set down on the stack, occasionally; faint mains hum |
| `plant` | Manufacturing | minor, tighter, faster notes, short delay | the press stamping every 2.4–3.4 s, plasma torch rushes, shop floor hum |
| `furnace` | Galvanizing | major, slow, long tail | the zinc bath — continuous sizzle and blips rising through the melt |
| `site` | Project, Applications, Gallery | suspended, wide, airy | a train crossing: rumble swelling past with rail joints underneath |
| `close` | Company, Enquire | quiet, sparse | nothing — out of the way of the form |

Each texture is synthesised, not sampled: the press is a pitch-dropping body
plus a filtered impact plus the plate ringing after it; the torch is a swept
bandpass on noise; the train is a lowpass sweeping up and back down over eight
seconds with fourteen rail joints timed across the pass.

Everything stays on a tonal centre of A; what moves is the mode, register,
tempo, space and which textures run. The mapping is `MOOD_BY_CHAPTER` in
`lib/ambience.js`, keyed on the `data-chapter` value each section carries, and
the moods themselves are the `MOODS` table above it. Both the chapter dots and
the ambience read the reader's position from the one `useActiveChapter` hook,
so they never disagree.

A supplied `AMBIENCE_FILE` plays as delivered — moods are generative only.

To use a real track instead, drop the file in `public/audio/` and set:

```js
// data/site.js
export const AMBIENCE_FILE = '/audio/ambience.mp3';
```

The toggle then plays that file on loop with the same fades and the same
gesture and visibility rules — no component changes.

## Contact details

Real details now, in `CONTACT` and `SOCIAL` in `data/site.js`, rendered in both
the footer and the enquiry block.

- five numbers — two Bengaluru landlines on 080 and three mobiles, each with a
  correct `tel:` href
- two addresses, `sugamengrs@gmail.com` and `sugamengrs@yahoo.co.in`
- two sites, sugammettech.com and sugamengrs.com
- Regd. office and works: Sy No. 62/1, Anchepalya, next to Rajarajeshwari
  Medical College and Hospital, Kengeri, Karnataka 560074

The footer grew a fourth column for the address and hours.

Social links are LinkedIn, Instagram and Facebook, with drawn brand glyphs in
`SocialIcon.jsx` rather than the "in / ig / fb" text that stood in before.
Three paths did not warrant an icon dependency. The LinkedIn URL was trimmed of
`/about/?viewAsMember=true`, which is a viewing mode rather than part of the
address.

**Removed rather than left as dummies:** the footer carried
`GSTIN 00XXXXXXXXXXXXX` and `CIN U00000XX0000XXX000000`. Placeholder
registration numbers on a live company site are worse than none — add the real
ones to `CONTACT` when you have them.

## Still to wire

- `src/app/api/enquiry/route.js` — mail / CRM delivery, and the GA4 conversion event in
  `Enquire.jsx` where marked.
- Real contact details, GSTIN, CIN and social links in `data/site.js` and `Footer.jsx`.
- The technical presentation PDF behind the download button in `Specs.jsx`.
- A decision on the START gate. It looks right, but it puts a click between a
  visitor and the specifications, and search traffic arriving from a tender
  query may bounce on it. Options: keep it, auto-open after a few seconds if
  nobody clicks, or show it only on the first visit of a session.
