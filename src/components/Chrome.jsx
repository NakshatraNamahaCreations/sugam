'use client';

import { useState } from 'react';
import { useScroll, usePrefersReducedMotion, useActiveChapter } from '@/hooks/useScrollFx';

/* Fixed page furniture: the scroll progress bar, the chapter rail on the
   right and the floating enquire button. */
export default function Chrome() {
  const reduced = usePrefersReducedMotion();
  const { chapters, active } = useActiveChapter();
  const [progress, setProgress] = useState(0);
  const [fabOn, setFabOn] = useState(false);

  useScroll(() => {
    const y = window.pageYOffset;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    setProgress(max > 0 ? (y / max) * 100 : 0);
    setFabOn(y > vh * 2.2 && y < max - vh * 0.8);
  });

  return (
    <>
      <div id="prog" style={{ width: `${progress}%` }} />

      <div id="dots" aria-hidden="true">
        {chapters.map((c, i) => (
          <button
            key={c.label}
            className={i === active ? 'on' : undefined}
            onClick={() => c.el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}
          >
            <span>{c.label}</span>
            <i />
          </button>
        ))}
      </div>

      <a id="fab" className={['btn', fabOn && 'on'].filter(Boolean).join(' ')} href="#enquire">
        Enquire
      </a>
    </>
  );
}
