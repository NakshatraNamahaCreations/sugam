import StickyRail from '@/components/StickyRail';
import { MANUFACTURING_STEPS } from '@/data/site';

export default function Manufacturing() {
  return (
    <StickyRail
      id="process"
      chapter="Manufacturing"
      sectionClassName="alt"
      eyebrow="Inside the plant"
      heading="From flat plate to a finished arch, in seven controlled stages."
      headingStyle={{ maxWidth: '22ch' }}
      steps={MANUFACTURING_STEPS}
      video={{
        src: '/clips/udhna-build.mp4',
        poster: '/clips/udhna-build.jpg',
        label: 'Udhna Junction: the arch built and installed',
        caption: 'Udhna Junction, Surat · 1:48',
      }}
    />
  );
}
