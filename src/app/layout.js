import { Poppins } from 'next/font/google';
import './globals.css';

/* One family across the whole site. The weights cover everything the
   stylesheet asks for: 400 body, 500 labels, 600 headings, 700 the big
   figures, 800 the hero headline. Italic 400 is for the intro statement. */
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Corrugated Steel Arch Bridge Manufacturer in India | Sugam Met Tech',
  description:
    "India's first corrugated steel arch bridge. Designed, manufactured, hot dip galvanized at 610 GSM and erected in India by Sugam Met Tech (P) Ltd.",
  openGraph: {
    title: "India's First Corrugated Steel Arch Bridge | Sugam Met Tech",
    description:
      'Spans up to 30 metres. Live load up to 75 tonnes. 60 to 75 year design life. 20 to 30 percent more economical than RCC.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Without scripting the curtain would never lift and the masked text
            would never arrive, so both are shown resolved. */}
        <noscript>
          <style>{`
            .intro{display:none!important}
            .hero-word b,.wordreveal-w b{transform:none!important}
            .rv,.rise{opacity:1!important;transform:none!important}
            .hero-scroll.rise{transform:translateX(-50%)!important}
            .step{opacity:1!important}
          `}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
