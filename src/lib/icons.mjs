// Ikony liniowe 24×24 (stroke = currentColor), wstawiane raz na stronę jako sprite.
const P = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  siren: '<path d="M6 18v-5a6 6 0 0 1 12 0v5"/><path d="M4 18h16v3H4z"/><path d="M12 2v2M3.5 6.5 5 8M20.5 6.5 19 8"/>',
  shelter: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  bag: '<path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><rect x="4" y="6" width="16" height="15" rx="4"/><path d="M8 13h8v4"/>',
  aid: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M12 10v6M9 13h6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  radio: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M7 8l10-5"/><circle cx="8.5" cy="14.5" r="2.5"/><path d="M14 13h4M14 16h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  check: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  down: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-6.8 0-4.2-3.6-6.4-4.4-10.2-2 1.7-3 3.6-3 5.6-1.3-.7-2.1-2-2.4-3.3C7.4 9.2 5 11.6 5 15.2 5 19.2 8 22 12 22z"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  water: '<path d="M7 3h10l-1 18H8z"/><path d="M7.5 9h9"/>',
};

export const ICON_NAMES = Object.keys(P);

export function sprite() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${Object.entries(P)
    .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`)
    .join('')}<symbol id="i-mark" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#F08A24"/><path d="M16 6.5 27 25.5H5z" fill="#1D3F8F"/></symbol></svg>`;
}

export const icon = (name, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Samodzielny plik SVG znaku (favicon, ikona aplikacji).
export const MARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#F08A24"/><path d="M16 6.5 27 25.5H5z" fill="#1D3F8F"/></svg>';
