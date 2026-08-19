import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import { STATS, CREDS } from '@/data/site';

function Parts({ parts }) {
  return parts.map((p, i) =>
    typeof p === 'string' ? <span key={i}>{p}</span> : <Counter key={i} to={p.count} />
  );
}

export default function Credibility() {
  return (
    <section id="cred" data-chapter="Credentials">
      <div className="wrap">
        <div className="stats">
          {STATS.map((s) => (
            <Reveal className="stat" key={s.note}>
              <div className="n">
                {s.red ? (
                  <u>
                    <Parts parts={s.parts} />
                  </u>
                ) : (
                  <Parts parts={s.parts} />
                )}
              </div>
              <p>{s.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="creds">
          {CREDS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
