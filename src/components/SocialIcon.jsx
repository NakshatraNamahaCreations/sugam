/* Brand glyphs, drawn rather than pulled from an icon package — three paths
   are not worth a dependency. */
const PATHS = {
  linkedin: (
    <path
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9.2h3.6V21H3.2zM9.4 9.2H13v1.6h.05c.5-.95 1.73-1.95 3.56-1.95 3.8 0 4.5 2.2 4.5 5.05V21h-3.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9.4z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="17.1" cy="6.9" r="1.25" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      d="M13.6 21v-8h2.7l.4-3.1h-3.1V7.94c0-.9.25-1.51 1.54-1.51h1.66V3.65c-.29-.04-1.27-.13-2.42-.13-2.4 0-4.04 1.46-4.04 4.15V9.9H7.6V13h2.74v8z"
      fill="currentColor"
    />
  ),
};

export default function SocialIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
