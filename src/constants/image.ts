export const GROUP_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="0.8"
    d="M17 20h5v-2a3 3 0 00-5.356-1.857
       M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
       M7 20H2v-2a3 3 0 015.356-1.857
       M7 20v-2c0-.656.126-1.283.356-1.857
       m0 0a5.002 5.002 0 019.288 0
       M15 7a3 3 0 11-6 0 3 3 0 016 0
       m6 3a2 2 0 11-4 0 2 2 0 014 0
       M7 10a2 2 0 11-4 0 2 2 0 014 0"
  />
</svg>
`);

export const PROFILE_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="90" fill="#E5E7EB" />
  <ellipse cx="85" cy="85" rx="18" ry="22" fill="white" />
  <ellipse cx="88" cy="85" rx="8" ry="10" fill="#9CA3AF" />
  <ellipse cx="115" cy="85" rx="18" ry="22" fill="white" />
  <ellipse cx="112" cy="85" rx="8" ry="10" fill="#9CA3AF" />
  <path d="M 70 120 Q 100 155 130 120" stroke="#9CA3AF" stroke-width="8" fill="transparent" stroke-linecap="round" />
</svg>
`);
