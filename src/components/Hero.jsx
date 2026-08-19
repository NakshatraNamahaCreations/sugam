'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useScroll, usePrefersReducedMotion } from '@/hooks/useScrollFx';
import { useIntroDone } from '@/components/Intro';
import banner from '../../public/banner.jpg';

/* The banner headline reveals character by character, each letter lifting out
   of its word's mask a beat behind the last. Words stay inline-block so the
   line still wraps and kerns normally; the mask sits on the word, not the
   letter. Indices are precomputed so the cascade is one continuous run across
   all three lines rather than restarting per line. */
const RAW = [
  { words: ['India’s', 'first'] },
  { words: ['corrugated', 'steel'], em: true },
  { words: ['arch', 'bridge'] },
];

const CHAR_STAGGER = 0.028;

let charCount = 0;
const LINES = RAW.map((line) => ({
  em: line.em,
  words: line.words.map((word) => ({
    chars: Array.from(word).map((ch) => ({ ch, i: charCount++ })),
  })),
}));

const secs = (n) => `${n.toFixed(3)}s`;
const TOTAL = charCount * CHAR_STAGGER;

export default function Hero() {
  const bg = useRef(null);
  const reduced = usePrefersReducedMotion();
  /* the headline cascade starts as the intro curtain parts */
  const loaded = useIntroDone();

  useScroll(() => {
    if (reduced || !bg.current) return;
    const y = window.pageYOffset;
    if (y < window.innerHeight) {
      bg.current.style.transform = `scale(1.06) translateY(${y * 0.14}px)`;
    }
  });

  return (
    <section id="hero" data-chapter="Hero" className={loaded ? 'loaded' : undefined}>
      <div className="bg" ref={bg}>
        <Image src={banner} alt="" fill sizes="100vw" priority placeholder="blur" />
      </div>
      <div className="scrim" />

      {/* left index rail: chapter counter over a rule, scroll cue at the foot */}
      <div className="hero-rail rise" aria-hidden="true" style={{ transitionDelay: secs(TOTAL + 0.35) }}>
        <div className="count">
          <span className="n on">01</span>
          <span className="rule" />
          <span className="n">14</span>
        </div>
        <span className="down">Scroll down</span>
      </div>

      <div className="inner">
        <div className="col">
          <span className="eyebrow rise" style={{ transitionDelay: '.1s' }}>
            Sugam Met Tech (P) Ltd &nbsp;&mdash;&nbsp; Since 1985
          </span>
          <h1 className="h0">
            {LINES.map((line, li) => (
              <span className="hero-line" key={li}>
                {line.words.map((word, wi) => (
                  <span className={['hero-word', line.em && 'em'].filter(Boolean).join(' ')} key={wi}>
                    {word.chars.map(({ ch, i }) => (
                      <b key={i} style={{ transitionDelay: secs(i * CHAR_STAGGER) }}>
                        {ch}
                      </b>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div className="acts rise" style={{ transitionDelay: secs(TOTAL + 0.1) }}>
            <a className="btn" href="#process">
              Watch the build
            </a>
            <a className="btn ghost" href="#enquire">
              Request a consultation
            </a>
          </div>
        </div>
      </div>

      {/* the standfirst sits bottom right, out of the headline's way */}
      <p className="hero-note rise" style={{ transitionDelay: secs(TOTAL + 0.25) }}>
        Designed, manufactured, hot dip galvanized at 610 GSM and erected in India. The fifth
        manufacturer in the world. The first in the country.
      </p>

      <a
        className="hero-scroll rise"
        href="#cred"
        aria-label="Scroll to the next section"
        style={{ transitionDelay: secs(TOTAL + 0.45) }}
      >
        <i />
      </a>
    </section>
  );
}
