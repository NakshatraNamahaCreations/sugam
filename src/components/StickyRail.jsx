'use client';

import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { useActiveStep } from '@/hooks/useScrollFx';

const pad = (n) => `0${n}`.slice(-2);

/* Scrollytelling rail: the step that reaches the middle of the viewport
   swaps the sticky clip beside it. Used for manufacturing and galvanizing.
   Below 820px the CSS hides the sticky column and shows the per-step clip. */
export default function StickyRail({
  id,
  chapter,
  sectionClassName = '',
  eyebrow,
  warm = false,
  heading,
  headingStyle,
  steps,
  video,
  children,
}) {
  const [active, setStepRef] = useActiveStep(steps.length);
  const total = steps.length;
  const mediaClass = warm ? 'warm' : '';

  return (
    <section
      id={id}
      className={['rail-sec', sectionClassName].filter(Boolean).join(' ')}
      data-chapter={chapter}
    >
      <div className="wrap">
        <Reveal as="span" className={['eyebrow', warm && 'warm'].filter(Boolean).join(' ')}>
          {eyebrow}
        </Reveal>
        <SplitText as="h2" className="h1" style={{ marginBottom: 70, ...headingStyle }}>
          {heading}
        </SplitText>

        <div className={['rail-grid', video && 'solo'].filter(Boolean).join(' ')}>
          <div className="steps">
            {steps.map((s, i) => (
              <div
                className={['step', i === active && 'on'].filter(Boolean).join(' ')}
                key={s.title}
                ref={setStepRef(i)}
              >
                {/* a rail showing one film has no use for a clip per step */}
                {!video && (
                  <Media
                    className={['m-clip', mediaClass].filter(Boolean).join(' ')}
                    image={s.image}
                    play={!s.image}
                    label={s.image ? s.title : s.stepMedia}
                  />
                )}
                <div className="k">
                  <i />
                  {`Step ${pad(i + 1)} of ${pad(total)}`}
                </div>
                <h3 className="h2">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="rail-media">
            <div className="counter">
              <span className="n">
                {pad(active + 1)} / {pad(total)}
              </span>
              <div className="track">
                <i style={{ width: `${((active + 1) / total) * 100}%` }} />
              </div>
            </div>

            {/* one narrated film for the whole rail, or a clip per step */}
            {video ? (
              <Media
                className="solo"
                src={video.src}
                poster={video.poster}
                controls
                label={video.label}
              />
            ) : (
              <div className="stack">
                {steps.map((s, i) => (
                  <Media
                    key={s.title}
                    className={['clip', i === active && 'on', mediaClass].filter(Boolean).join(' ')}
                    image={s.image}
                    play={!s.image}
                    label={
                      s.image ? (
                        s.title
                      ) : (
                        <>
                          {`Video ${pad(i + 1)}`}
                          <br />
                          {s.clipMedia}
                        </>
                      )
                    }
                    sizes="(max-width: 820px) 92vw, 700px"
                  />
                ))}
              </div>
            )}

            <div className="now">{video ? video.caption : steps[active].title}</div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
