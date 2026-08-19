import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { SPECS, SPEC_HIGHLIGHTS } from '@/data/site';

export default function Specs() {
  return (
    <section id="specs" data-chapter="Specifications">
      <div className="wrap">
        <Reveal as="span" className="eyebrow">
          Technical data
        </Reveal>
        <SplitText as="h2" className="h1">
          Specifications.
        </SplitText>

        {/* the four figures that get checked first, before the table */}
        <div className="spec-heads">
          {SPEC_HIGHLIGHTS.map((h) => (
            <Reveal className="spec-head" key={h.label}>
              <b>
                {h.value}
                <i>{h.unit}</i>
              </b>
              <span>{h.label}</span>
            </Reveal>
          ))}
        </div>

        <Reveal as="table" className="spec">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Specification</th>
            </tr>
          </thead>
          <tbody>
            {SPECS.map(([param, value]) => (
              <tr key={param}>
                <td>{param}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </Reveal>

        <Reveal className="dl">
          <a className="btn ghost" href="#" download>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Download the technical presentation (PDF)
          </a>
          <span className="cap">
            Reference project: Udhna Junction, Surat, for Indian Railways through L&amp;T.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
