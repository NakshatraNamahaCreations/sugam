import StickyRail from '@/components/StickyRail';
import Reveal from '@/components/Reveal';
import { GALVANIZING_STEPS, GALV_DATA } from '@/data/site';

export default function Galvanizing() {
  return (
    <StickyRail
      id="galv"
      chapter="Galvanizing"
      sectionClassName="warmsec"
      eyebrow="Surface protection"
      warm
      heading="610 GSM of zinc. Sixty to seventy five years of service."
      headingStyle={{ maxWidth: '20ch' }}
      steps={GALVANIZING_STEPS}
    >
      <Reveal className="datastrip">
        {GALV_DATA.map((d) => (
          <div key={d.label}>
            <b>{d.n}</b>
            <span>{d.label}</span>
          </div>
        ))}
      </Reveal>
    </StickyRail>
  );
}
