'use client';

import { useRef } from 'react';
import { useInViewOnce } from '@/hooks/useScrollFx';

export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const shown = useInViewOnce(ref, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  return (
    <Tag ref={ref} className={['rv', shown && 'in', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  );
}
