import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import FeatureVideo from '@/components/FeatureVideo';

/* One frame, four states, in priority order:
   - `image` → a photograph
   - `src`   → footage: a muted loop, or a controlled film with `controls`
   - `art`   → a motion diagram component (see TypeArt.jsx)
   - none    → the labelled placeholder tile */
export default function Media({
  className = '',
  play = false,
  label,
  src,
  poster,
  image,
  sizes = '(max-width: 820px) 78vw, 384px',
  controls = false,
  art: Art,
  children,
  style,
}) {
  const cls = (...extra) => ['media', ...extra, className].filter(Boolean).join(' ');

  if (image) {
    return (
      <div className={cls('filled')} style={style}>
        <Image src={image} alt={label || ''} fill sizes={sizes} />
      </div>
    );
  }

  if (src) {
    return (
      <div className={cls('filled')} style={style}>
        {controls ? (
          <FeatureVideo src={src} poster={poster} label={label} />
        ) : (
          <LazyVideo src={src} poster={poster} label={label} />
        )}
      </div>
    );
  }

  if (Art) {
    return (
      <div className={cls('filled')} style={style}>
        <Art />
      </div>
    );
  }

  return (
    <div className={cls()} style={style}>
      <div>
        {play && <div className="play">&#9654;</div>}
        {label && <div className="lbl">{label}</div>}
        {children}
      </div>
    </div>
  );
}
