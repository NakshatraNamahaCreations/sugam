import { IntroProvider } from '@/components/Intro';
import Chrome from '@/components/Chrome';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Credibility from '@/components/Credibility';
import Technology from '@/components/Technology';
import Comparison from '@/components/Comparison';
import Types from '@/components/Types';
import Manufacturing from '@/components/Manufacturing';
import Galvanizing from '@/components/Galvanizing';
import Timeline from '@/components/Timeline';
import CompositeDeck from '@/components/CompositeDeck';
import Applications from '@/components/Applications';
import Specs from '@/components/Specs';
import Gallery from '@/components/Gallery';
import Company from '@/components/Company';
import Enquire from '@/components/Enquire';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <IntroProvider>
      <Chrome />
      <Nav />
      <main>
        <Hero />
        <Credibility />
        <Technology />
        <Comparison />
        <Types />
        <Manufacturing />
        <Galvanizing />
        <Timeline />
        <CompositeDeck />
        <Applications />
        <Specs />
        <Gallery />
        <Company />
        <Enquire />
      </main>
      <Footer />
    </IntroProvider>
  );
}
