import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset="0.65" stop-color="#0B101B"/></linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.35" r="0.55"><stop offset="0" stop-color="#1D4ED8" stop-opacity="0.35"/><stop offset="1" stop-color="#1D4ED8" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(870,200) rotate(-14)" opacity="0.9">
    <circle r="150" fill="none" stroke="#E2E5EB" stroke-width="1.1" stroke-dasharray="1 6" opacity="0.5"/>
    <circle r="118" fill="none" stroke="#E2E5EB" stroke-width="1.1" stroke-dasharray="1 6" opacity="0.35"/>
    <circle r="86" fill="none" stroke="#4C7BF0" stroke-width="1.4" stroke-dasharray="1 6" opacity="0.8"/>
    <circle r="150" fill="none" stroke="#E2E5EB" stroke-width="1.1" stroke-dasharray="1 6" opacity="0.25" transform="scale(1.18)"/>
  </g>
  <text x="84" y="128" font-family="Inter" font-weight="640" font-size="21" letter-spacing="6" fill="#F7F8FA">ASENTXIA <tspan fill="#98A2B8" font-size="15">SYSTEMS</tspan></text>
  <text x="84" y="316" font-family="Inter" font-weight="480" font-size="56" fill="#F7F8FA">Machine-native infrastructure</text>
  <text x="84" y="384" font-family="Inter" font-weight="480" font-size="56" fill="#F7F8FA">for <tspan fill="#4C7BF0">autonomous intelligence.</tspan></text>
  <text x="84" y="452" font-family="Inter" font-weight="450" font-size="22" fill="#98A2B8">Architecture for persistent, governed autonomous intelligence.</text>
  <text x="84" y="560" font-family="Inter" font-weight="560" font-size="14" letter-spacing="3" fill="#98A2B8">DCA · CONTINUUM · STAXIONS</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('dist/og/asentxia-home.png');
console.log('OG image written');
