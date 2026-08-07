(function () {
  'use strict';

  const data = window.terminalData;
  const root = document.getElementById('terminal-guide-page');
  const icons = window.TerminalGuideIcons;
  if (!data || !root || !icons) return;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const items = [
    ['directions', '오시는 길', 'directions'],
    ['parking', '주차 안내', 'parking'],
    ['ticketing', '매표·발권', 'ticketing'],
    ['facilities', '편의시설', 'facilities'],
    ['accessibility', '교통약자 안내', 'accessibility'],
    ['baggage', '수하물·반입금지', 'baggage'],
    ['lost-found', '유실물 센터', 'lostFound'],
    ['faq', '자주 묻는 질문', 'faq']
  ];
  const guide = data.terminalGuide;

  if (!guide) {
    root.innerHTML = `
      <section class="guide-page-hero"><div class="container">
        <nav class="guide-breadcrumb" aria-label="현재 위치"><a href="./index.html">홈</a><span aria-hidden="true">›</span><span>터미널 이용안내</span></nav>
        <p class="section-kicker">TERMINAL GUIDE</p><h1>터미널 이용안내</h1>
      </div></section>
      <div class="container guide-empty"><p>현재 준비된 터미널 이용안내가 없습니다.</p><a class="guide-back-link" href="./index.html">메인으로 돌아가기</a></div>`;
    return;
  }

  const parkingRows = [
    ['기본 요금', guide.parking?.free],
    ['이후 요금', guide.parking?.rate],
    ['일일 최대', guide.parking?.dailyMax]
  ].map(([label, value]) => `<tr><th scope="row">${label}</th><td>${escapeHtml(value || '안내 준비 중')}</td></tr>`).join('');

  const facilities = (guide.facilities || []).map((facility) => `
    <li>${icons.icon(icons.facilityIcon(facility), 'facility-icon')}<span>${escapeHtml(facility)}</span></li>`).join('');
  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(guide.mapQuery || guide.address || data.name)}`;

  const accessibility = guide.accessibility || '엘리베이터와 휠체어 대여 등 교통약자 편의시설 이용은 터미널 안내데스크에 문의해 주세요.';
  const baggage = guide.baggage || '선사별 수하물 규정과 반입 제한 품목이 다를 수 있으므로 이용 선사에 사전 확인해 주세요.';
  const lostFound = guide.lostFound || `분실 장소와 시간을 확인한 뒤 터미널 안내데스크 또는 대표전화 ${data.phone}로 문의해 주세요.`;
  const faq = Array.isArray(guide.faq) && guide.faq.length ? guide.faq : [
    { question: '승선할 때 신분증이 필요한가요?', answer: '네. 승선권 발권과 승선 시 본인 확인을 위해 유효한 신분증을 반드시 지참해 주세요.' },
    { question: '출항 몇 분 전까지 도착해야 하나요?', answer: `발권 마감은 ${guide.ticketing?.deadline || '출항 전'}입니다. 혼잡 시간을 고려해 여유 있게 도착해 주세요.` },
    { question: '운항 일정이 변경되면 어디에서 확인하나요?', answer: '메인 페이지의 실시간 운항정보를 확인하고, 출항 전 해당 선사에 최종 운항 여부를 문의해 주세요.' }
  ];

  const toc = items.map(([anchor, label]) => `<a href="#${anchor}">${label}</a>`).join('');
  const faqMarkup = faq.map((item) => `
    <details class="guide-faq-item">
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>`).join('');

  function heading(id, title, iconName) {
    return `<div class="guide-detail-title">${icons.icon(iconName)}<div><span>${id.toUpperCase().replace('-', ' ')}</span><h2>${title}</h2></div></div>`;
  }

  root.innerHTML = `
    <section class="guide-page-hero" aria-labelledby="guide-page-title">
      <div class="container">
        <nav class="guide-breadcrumb" aria-label="현재 위치"><a href="./index.html">홈</a><span aria-hidden="true">›</span><span>터미널 이용안내</span></nav>
        <p class="section-kicker">TERMINAL GUIDE</p>
        <h1 id="guide-page-title">터미널 이용안내</h1>
        <p>${escapeHtml(data.name)} 방문 전에 필요한 이용 정보를 확인하세요.</p>
      </div>
    </section>
    <div class="container guide-page-layout">
      <aside class="guide-page-toc-wrap">
        <nav class="guide-page-toc" aria-label="터미널 이용안내 목차">
          <strong>이용안내 목차</strong>${toc}
        </nav>
      </aside>
      <div class="guide-page-content">
        <section class="guide-detail-section" id="directions">
          ${heading('directions', '오시는 길', 'directions')}
          <div class="guide-directions-summary">
            <div><span>터미널 주소</span><strong>${escapeHtml(guide.address || data.address)}</strong></div>
            <a class="terminal-map-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">카카오맵에서 보기 <span aria-hidden="true">↗</span></a>
          </div>
          <div class="guide-transit-grid">
            <article class="guide-transit-block">
              <div class="guide-transit-title">${icons.icon('bus')}<h3>대중교통</h3></div>
              <dl><div><dt>버스·정류장</dt><dd>${escapeHtml(guide.transit?.bus || '안내 준비 중')}</dd></div></dl>
            </article>
            <article class="guide-transit-block">
              <div class="guide-transit-title">${icons.icon('car')}<h3>자가용</h3></div>
              <dl>
                <div><dt>길 안내</dt><dd>${escapeHtml(guide.transit?.car || '안내 준비 중')}</dd></div>
                <div><dt>내비게이션 검색</dt><dd>${escapeHtml(guide.mapQuery || guide.address || data.name)}</dd></div>
              </dl>
            </article>
          </div>
        </section>
        <section class="guide-detail-section" id="parking">
          ${heading('parking', '주차 안내', 'parking')}
          <div class="terminal-parking-table-wrap"><table class="terminal-parking-table"><caption class="sr-only">주차 요금 안내</caption><tbody>${parkingRows}</tbody></table></div>
          <dl class="terminal-guide-details terminal-guide-details-inline">
            <div><dt>주차 규모</dt><dd>${escapeHtml(guide.parking?.capacity || '안내 준비 중')}</dd></div>
            <div><dt>이용 시간</dt><dd>${escapeHtml(guide.parking?.hours || '안내 준비 중')}</dd></div>
          </dl>
        </section>
        <section class="guide-detail-section" id="ticketing">
          ${heading('ticketing', '매표·발권', 'ticketing')}
          <dl class="terminal-guide-details">
            <div><dt>매표소</dt><dd>${escapeHtml(guide.ticketing?.location || '안내 준비 중')}</dd></div>
            <div><dt>운영시간</dt><dd>${escapeHtml(guide.ticketing?.hours || '안내 준비 중')}</dd></div>
            <div><dt>발권 마감</dt><dd>${escapeHtml(guide.ticketing?.deadline || '선사별 확인')}</dd></div>
          </dl>
          <p class="terminal-ticket-notice"><strong>${escapeHtml(guide.ticketing?.notice || '신분증 필수')}</strong><span>승선권 발권과 승선 시 본인 확인이 필요합니다.</span></p>
        </section>
        <section class="guide-detail-section" id="facilities">
          ${heading('facilities', '편의시설', 'facilities')}
          ${facilities ? `<ul class="terminal-facility-grid">${facilities}</ul>` : '<p class="guide-default-copy">편의시설 정보를 준비하고 있습니다.</p>'}
        </section>
        <section class="guide-detail-section" id="accessibility">
          ${heading('accessibility', '교통약자 안내', 'accessibility')}
          <p class="guide-default-copy">${escapeHtml(accessibility)}</p>
        </section>
        <section class="guide-detail-section" id="baggage">
          ${heading('baggage', '수하물·반입금지', 'baggage')}
          <p class="guide-default-copy">${escapeHtml(baggage)}</p>
          <ul class="guide-bullet-list"><li>폭발성·인화성 물질과 위험물은 반입할 수 없습니다.</li><li>칼과 공구 등 날카로운 물품은 선사 규정을 확인해 주세요.</li><li>크기와 중량 제한은 이용 선사별로 다를 수 있습니다.</li></ul>
        </section>
        <section class="guide-detail-section" id="lost-found">
          ${heading('lost-found', '유실물 센터', 'lostFound')}
          <p class="guide-default-copy">${escapeHtml(lostFound)}</p>
        </section>
        <section class="guide-detail-section" id="faq">
          ${heading('faq', '자주 묻는 질문', 'faq')}
          <div class="guide-faq-list">${faqMarkup}</div>
        </section>
        <a class="guide-back-link" href="./index.html"><span aria-hidden="true">←</span> 메인으로 돌아가기</a>
      </div>
    </div>`;
})();
