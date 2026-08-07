(function () {
  'use strict';

  const data = window.terminalData;
  const section = document.getElementById('terminal-guide');
  const guide = data?.terminalGuide;
  if (!section || !guide) return;
  if (!window.SectionTitle) throw new Error('SectionTitle 컴포넌트가 필요합니다.');

  const sharedIcons = window.TerminalGuideIcons;
  if (sharedIcons) {
    const items = [
      ['./guide.html#directions', '오시는 길', 'directions'],
      ['./guide.html#parking', '주차 안내', 'parking'],
      ['./guide.html#ticketing', '매표·발권 안내', 'ticketing'],
      ['#boarding', '승선 안내', 'boarding'],
      ['./guide.html#facilities', '편의시설 안내', 'facilities'],
      ['./guide.html#accessibility', '교통약자 안내', 'accessibility']
    ];
    const menu = items.map(([href, label, iconName]) => `
      <a class="terminal-guide-menu-item" href="${href}">
        <span class="terminal-guide-menu-icon">${sharedIcons.icon(iconName)}</span>
        <span class="terminal-guide-menu-label">${label}</span>
      </a>`).join('');

    section.innerHTML = `
      <div class="container">
        <div class="terminal-guide-heading">
          ${window.SectionTitle.render({
            align: 'center',
            theme: 'dark',
            eyebrow: 'TERMINAL GUIDE',
            title: '터미널 이용안내',
            subtitle: '필요한 안내 항목을 선택하면 상세 정보를 확인할 수 있습니다.',
            titleId: 'terminal-guide-title'
          })}
        </div>
        <nav class="terminal-guide-menu" aria-label="터미널 이용안내 상세 메뉴">${menu}</nav>
      </div>`;
    return;
  }

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const iconPaths = {
    pin: '<path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 17V7h4.2a3 3 0 0 1 0 6H9"/>',
    ticket: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M12 8v2m0 4v2"/>',
    facilities: '<path d="M5 20V8l7-4 7 4v12"/><path d="M3 20h18M8 11h2m4 0h2M8 15h2m4 0h2"/>',
    lounge: '<path d="M5 12h14v6H5zM7 12V8h10v4M7 18v2m10-2v2"/>',
    nursing: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    store: '<path d="M5 9h14l-1-5H6L5 9Z"/><path d="M6 9v11h12V9M9 20v-6h6v6"/>',
    restaurant: '<path d="M6 3v7m3-7v7M5 7h5M7.5 10v11M15 3v18M15 3c3 2 4 5 4 8h-4"/>',
    locker: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18M8 8h1m6 0h1m-8 8h1m6 0h1"/>',
    wifi: '<path d="M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 3a4 4 0 0 1 4 0"/><circle cx="12" cy="18" r="1"/>',
    accessible: '<circle cx="10" cy="5" r="2"/><path d="M10 7.5v5h5l3 5M10 10H7a4 4 0 1 0 5 7.5"/>',
    lost: '<path d="M5 8h14v11H5zM8 8V5h8v3"/><circle cx="11" cy="13" r="2.5"/><path d="m13 15 2 2"/>'
  };

  const facilityIcon = {
    '대합실': 'lounge',
    '수유실': 'nursing',
    '편의점': 'store',
    '식당': 'restaurant',
    '물품보관함': 'locker',
    '무료 Wi-Fi': 'wifi',
    '교통약자 편의시설': 'accessible',
    '유실물 센터': 'lost'
  };

  function icon(name, className = '') {
    return `<svg class="terminal-guide-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.facilities}</svg>`;
  }

  const parkingRows = [
    ['기본 요금', guide.parking.free],
    ['이후 요금', guide.parking.rate],
    ['일일 최대', guide.parking.dailyMax]
  ].map(([label, value]) => `<tr><th scope="row">${label}</th><td>${escapeHtml(value)}</td></tr>`).join('');

  const facilities = (guide.facilities || []).map((facility) => `
    <li>${icon(facilityIcon[facility] || 'facilities', 'facility-icon')}<span>${escapeHtml(facility)}</span></li>`).join('');

  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(guide.mapQuery || guide.address)}`;

  section.innerHTML = `
    <div class="container">
      <div class="terminal-guide-heading">
        ${window.SectionTitle.render({
          align: 'center',
          theme: 'dark',
          eyebrow: 'TERMINAL GUIDE',
          title: '터미널 이용안내',
          subtitle: '필요한 안내 항목을 선택하면 상세 정보를 확인할 수 있습니다.',
          titleId: 'terminal-guide-title'
        })}
      </div>
      <div class="terminal-guide-grid">
        <article class="terminal-guide-card" id="terminal-guide-location">
          <div class="terminal-guide-card-title">${icon('pin')}<h3>오시는 길</h3></div>
          <dl class="terminal-guide-details">
            <div><dt>주소</dt><dd>${escapeHtml(guide.address)}</dd></div>
            <div><dt>대중교통</dt><dd>${escapeHtml(guide.transit.bus)}</dd></div>
            <div><dt>자가용</dt><dd>${escapeHtml(guide.transit.car)}</dd></div>
          </dl>
          <a class="terminal-map-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">지도 보기 <span aria-hidden="true">→</span></a>
        </article>
        <article class="terminal-guide-card" id="terminal-guide-parking">
          <div class="terminal-guide-card-title">${icon('parking')}<h3>주차 안내</h3></div>
          <div class="terminal-parking-table-wrap"><table class="terminal-parking-table"><caption class="sr-only">주차 요금 안내</caption><tbody>${parkingRows}</tbody></table></div>
          <dl class="terminal-guide-details terminal-guide-details-inline">
            <div><dt>주차 규모</dt><dd>${escapeHtml(guide.parking.capacity)}</dd></div>
            <div><dt>이용 시간</dt><dd>${escapeHtml(guide.parking.hours)}</dd></div>
          </dl>
        </article>
        <article class="terminal-guide-card" id="terminal-guide-ticketing">
          <div class="terminal-guide-card-title">${icon('ticket')}<h3>매표·발권 안내</h3></div>
          <dl class="terminal-guide-details">
            <div><dt>매표소</dt><dd>${escapeHtml(guide.ticketing.location)}</dd></div>
            <div><dt>운영시간</dt><dd>${escapeHtml(guide.ticketing.hours)}</dd></div>
            <div><dt>발권 마감</dt><dd>${escapeHtml(guide.ticketing.deadline)}</dd></div>
          </dl>
          <p class="terminal-ticket-notice"><strong>${escapeHtml(guide.ticketing.notice)}</strong><span>승선권 발권과 승선 시 본인 확인이 필요합니다.</span></p>
        </article>
        <article class="terminal-guide-card" id="terminal-guide-facilities">
          <div class="terminal-guide-card-title">${icon('facilities')}<h3>편의시설</h3></div>
          <ul class="terminal-facility-grid">${facilities}</ul>
        </article>
      </div>
    </div>`;
})();
