(function () {
  'use strict';

  const paths = {
    directions: '<path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 17V7h4.2a3 3 0 0 1 0 6H9"/>',
    ticketing: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M12 8v2m0 4v2"/>',
    boarding: '<g transform="translate(0 -1.5)"><path d="M3 15h18l-2.5 4H6L3 15Z"/><path d="M7 15V9h8l3 6M12 9V6h3v3"/><path d="M9 12h2m2 0h2M3 21c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/></g>',
    facilities: '<path d="M5 20V8l7-4 7 4v12"/><path d="M3 20h18M8 11h2m4 0h2M8 15h2m4 0h2"/>',
    accessibility: '<circle cx="10" cy="5" r="2"/><path d="M10 7.5v5h5l3 5M10 10H7a4 4 0 1 0 5 7.5"/>',
    baggage: '<rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 11v5m6-5v5"/>',
    lostFound: '<path d="M5 8h14v11H5zM8 8V5h8v3"/><circle cx="11" cy="13" r="2.5"/><path d="m13 15 2 2"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2 1-1.2 1.8v.3M12 17h.01"/>',
    bus: '<rect x="4" y="3" width="16" height="16" rx="3"/><path d="M7 7h10M7 12h10M7 19v2m10-2v2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>',
    car: '<path d="m5 11 2-5h10l2 5"/><path d="M4 11h16v7H4zM6 18v2m12-2v2"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/>',
    lounge: '<path d="M5 12h14v6H5zM7 12V8h10v4M7 18v2m10-2v2"/>',
    nursing: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    store: '<path d="M5 9h14l-1-5H6L5 9Z"/><path d="M6 9v11h12V9M9 20v-6h6v6"/>',
    restaurant: '<path d="M6 3v7m3-7v7M5 7h5M7.5 10v11M15 3v18M15 3c3 2 4 5 4 8h-4"/>',
    locker: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18M8 8h1m6 0h1m-8 8h1m6 0h1"/>',
    wifi: '<path d="M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 3a4 4 0 0 1 4 0"/><circle cx="12" cy="18" r="1"/>'
  };

  const facilityIcons = {
    waitingRoom: 'lounge', nursing: 'nursing', store: 'store', restaurant: 'restaurant',
    locker: 'locker', wifi: 'wifi', accessibility: 'accessibility', lostFound: 'lostFound'
  };

  function icon(name, className = '') {
    const extraClass = className ? ` ${className}` : '';
    return `<svg class="terminal-guide-icon${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.facilities}</svg>`;
  }

  window.TerminalGuideIcons = {
    icon,
    facilityIcon(name) {
      const match = Object.keys(facilityIcons).find((key) => window.i18n && window.i18n.t(`facilities.${key}`) === name);
      return facilityIcons[match] || 'facilities';
    }
  };
})();
