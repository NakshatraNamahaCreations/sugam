import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';

const CARDS = [
  { title: 'First in India', body: 'First to manufacture corrugated steel arch bridges domestically.' },
  { title: 'Fifth in the world', body: 'One of five manufacturers globally with this capability.' },
  { title: 'Four decades', body: 'Steel structures, expanded metal and metal sections.' },
  { title: 'End to end', body: 'Design, manufacturing, galvanizing, dispatch and site erection.' },
];

export default function Company() {
  return (
    <section data-chapter="Company">
      <div className="wrap split">
        <Reveal>
          <span className="eyebrow">The company</span>
          <SplitText as="h2" className="h1">We build India in steel.</SplitText>
          <p className="lede" style={{ marginTop: 24 }}>
            Sugam Met Tech (P) Ltd has spent more than four decades in steel structures, expanded metal
            and metal sections. When corrugated steel arch bridges came to India, we did not import them.
            We became the fifth manufacturer in the world with this capability, and the first to
            manufacture them in this country.
          </p>
          <div className="quote">
            <p>
              We did not set out to supply a component. We set out to give Indian infrastructure a faster
              way to build.
            </p>
            <span>Mr. Sathyanarayana A, Managing Director</span>
          </div>
        </Reveal>

        <Reveal>
          {/* plant footage: arch plates going into the zinc bath. Square,
              because the source is — cropping a 480px frame to 4:3 would throw
              away a fifth of what little resolution it has. */}
          <Media
            src="/clips/plant-galvanizing.mp4"
            poster="/clips/plant-galvanizing.jpg"
            label="Corrugated arch plates entering the galvanizing bath"
            style={{ aspectRatio: '1/1', marginBottom: 14 }}
          />
          <p className="cap" style={{ marginTop: -4, marginBottom: 18 }}>
            Arch plates entering the zinc bath at the plant.
          </p>
          <div className="cards">
            {CARDS.map((c) => (
              <div className="card" key={c.title}>
                <b>{c.title}</b>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
