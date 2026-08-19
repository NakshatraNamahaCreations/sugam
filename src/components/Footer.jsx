import Image from 'next/image';
import SocialIcon from '@/components/SocialIcon';
import { CONTACT, FOOTER_LINKS, SOCIAL } from '@/data/site';
import logo from '../../public/sgm.png';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="frow">
          <div>
            <a className="brand" href="#hero" aria-label="Sugam Met Tech home">
              <Image className="mark" src={logo} alt="Sugam Met Tech (P) Ltd" sizes="200px" quality={92} />
            </a>
            <p className="cap" style={{ marginTop: 18, maxWidth: '44ch' }}>
              Corrugated steel arch bridges, steel structures, expanded metal and metal sections. Four
              decades of manufacturing in India.
            </p>
            <div className="social">
              {SOCIAL.map((sm) => (
                <a
                  key={sm.name}
                  href={sm.href}
                  aria-label={sm.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon name={sm.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              {CONTACT.phones.map((t) => (
                <li key={t.href}>
                  <a href={t.href}>{t.label}</a>
                </li>
              ))}
              {CONTACT.emails.map((t) => (
                <li key={t.href}>
                  <a href={t.href}>{t.label}</a>
                </li>
              ))}
              {CONTACT.sites.map((t) => (
                <li key={t.href}>
                  <a href={t.href} target="_blank" rel="noreferrer">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{CONTACT.address.label}</h4>
            <address>
              {CONTACT.address.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="cap" style={{ marginTop: 14 }}>
              {CONTACT.hours}
            </p>
          </div>
        </div>

        <div className="fbot">
          <span>&copy; {new Date().getFullYear()} Sugam Met Tech (P) Ltd. All rights reserved.</span>
          <span>
            Designed and developed by{' '}
            <a
              className="credit"
              href="https://www.nakshatranamahacreations.com/"
              target="_blank"
              rel="noreferrer"
            >
              Nakshatra Namaha Creations
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
