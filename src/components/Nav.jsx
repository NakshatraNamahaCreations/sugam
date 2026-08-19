'use client';

import { useState } from 'react';
import Image from 'next/image';
import SoundToggle from '@/components/SoundToggle';
import { useScroll } from '@/hooks/useScrollFx';
import { NAV_LINKS } from '@/data/site';
import logo from '../../public/sgm.png';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useScroll(() => {
    setSolid(window.pageYOffset > window.innerHeight * 0.7);
  });

  return (
    <header id="nav" className={solid ? 'solid' : undefined}>
      <a className="brand" href="#hero" aria-label="Sugam Met Tech home">
        {/* one lockup for both grounds: the mark is red throughout, which
            clears the dark hero photograph as well as the white bar */}
        <Image className="mark" src={logo} alt="Sugam Met Tech (P) Ltd" sizes="140px" quality={92} priority />
      </a>

      {/* centre column: the links alone, as in the reference layout */}
      <nav id="navlinks" className={open ? 'open' : undefined} onClick={() => setOpen(false)}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {/* the panel version of the CTA; the desktop one lives on the right */}
        <a className="btn panel-cta" href="#enquire">
          Request a consultation
        </a>
      </nav>

      <div className="navright">
        <a className="btn desk-cta" href="#enquire">
          Request a consultation
        </a>

        <SoundToggle />

        <button
          id="burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
          <i />
        </button>
      </div>
    </header>
  );
}
