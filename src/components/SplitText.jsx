'use client';

import { useRef } from 'react';
import { useInViewOnce } from '@/hooks/useScrollFx';

const STAGGER = 0.045;

/* A heading that lifts out of a mask word by word when it comes into view.

   The class is `wordreveal`, not `split` — `.split` is the stylesheet's
   two-column grid, and colliding with it turned every heading's words into
   grid cells.
   The hero runs its own version of this, because it fires on load rather
   than on scroll and carries the red accent words.

   Children must be plain text — the words are split on whitespace. */
export default function SplitText({
  as: Tag = 'h2',
  className = '',
  stagger = STAGGER,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const shown = useInViewOnce(ref, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  const words = String(children ?? '')
    .split(/\s+/)
    .filter(Boolean);

  return (
    <Tag ref={ref} className={['wordreveal', shown && 'in', className].filter(Boolean).join(' ')} {...rest}>
      {words.map((word, i) => (
        <span className="wordreveal-w" key={`${word}-${i}`}>
          <b style={{ transitionDelay: `${(i * stagger).toFixed(3)}s` }}>{word}</b>
        </span>
      ))}
    </Tag>
  );
}
