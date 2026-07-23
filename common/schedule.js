(function () {
  'use strict';

  const config = window.scheduleData;
  const section = document.getElementById('schedule');
  if (!config || !section) throw new Error('scheduleData와 #schedule 요소가 필요합니다.');

  const schedule = config.items || [];
  const filters = config.filters || [];
  const statusClass = { '정상운항': 'normal', '지연': 'delay', '결항': 'cancel' };
  const referenceTime = minutes(config.referenceTime || '08:30');
  let expanded = false;

  function minutes(time) {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }

  section.innerHTML = `
    <div class="container">
      <div class="section-head">
        <div><h2 id="schedule-title">실시간 운항정보</h2><p class="section-desc">터미널별 출항·입항 정보를 한눈에 확인하세요.</p></div>
        <span class="update-time"><strong id="today-date"></strong> ${config.referenceTime || '08:30'} 기준</span>
      </div>
      <div class="schedule-controls">
        <div class="movement-tabs" role="tablist" aria-label="입출항 선택">
          <button class="movement-tab" id="departure-tab" type="button" role="tab" aria-selected="true" aria-controls="departure-panel">출항 현황</button>
          <button class="movement-tab" id="arrival-tab" type="button" role="tab" aria-selected="false" aria-controls="arrival-panel" tabindex="-1">입항 현황</button>
        </div>
        <div class="terminal-tabs" id="terminal-filters" aria-label="터미널 필터">
          <button class="terminal-tab" type="button" data-filter="all" aria-pressed="true">전체</button>
          ${filters.map((filter) => `<button class="terminal-tab" type="button" data-filter="${filter.id}" aria-pressed="false">${filter.label}</button>`).join('')}
        </div>
      </div>
      <div class="movement-panel" id="departure-panel" role="tabpanel" aria-labelledby="departure-tab">
        ${table('departure')}
        ${legend()}
      </div>
      <div class="movement-panel" id="arrival-panel" role="tabpanel" aria-labelledby="arrival-tab" hidden>
        ${table('arrival')}
        ${legend()}
      </div>
      <button class="schedule-toggle" id="schedule-toggle" type="button" aria-expanded="false">전체 운항 시간표 보기</button>
      <p class="notice-line">※ ${config.notice || '여객선사 및 해상 기상 상황에 따라 운항 여부가 변동될 수 있으니 사전에 여객선사로 확인 바랍니다. 전국여객선운항안내 1544-1114'}</p>
    </div>`;

  function legend() {
    return '<div class="status-legend" aria-label="운항 상태 색상 안내"><span><i class="legend-dot" style="background:var(--green)"></i>정상운항</span><span><i class="legend-dot" style="background:var(--orange)"></i>지연</span><span><i class="legend-dot" style="background:var(--red)"></i>결항</span></div>';
  }

  function table(type) {
    const timeLabel = type === 'departure' ? '출발시간' : '도착시간';
    return `<div class="status-table-wrap"><table><caption style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${timeLabel} 기준 운항 현황</caption>
      <thead><tr><th scope="col">${timeLabel}</th><th scope="col">출발지</th><th scope="col">도착지</th><th scope="col">선박명</th><th scope="col">터미널</th><th scope="col">운항상태</th></tr></thead>
      <tbody id="${type}-body"></tbody></table></div>`;
  }

  const terminalButtons = [...section.querySelectorAll('.terminal-tab[data-filter]')];
  const movementTabs = [...section.querySelectorAll('.movement-tab')];
  const toggle = section.querySelector('#schedule-toggle');

  function activeFilter() {
    return terminalButtons.find((button) => button.getAttribute('aria-pressed') === 'true').dataset.filter;
  }

  function currentType() {
    return section.querySelector('#departure-tab').getAttribute('aria-selected') === 'true' ? 'departure' : 'arrival';
  }

  function render() {
    const filter = activeFilter();
    const filtered = filter === 'all' ? schedule : schedule.filter((item) => item.terminalId === filter);
    const departures = filtered.filter((item) => item.type === 'departure');
    const arrivals = filtered.filter((item) => item.type === 'arrival');
    const visibleDepartures = expanded ? departures : departures.filter((item) => minutes(item.time) >= referenceTime).slice(0, 5);
    const visibleArrivals = expanded ? arrivals : arrivals.filter((item) => minutes(item.time) >= referenceTime).slice(0, 5);

    section.querySelector('#departure-body').innerHTML = rows(visibleDepartures, 'departure');
    section.querySelector('#arrival-body').innerHTML = rows(visibleArrivals, 'arrival');

    const allItems = currentType() === 'departure' ? departures : arrivals;
    const visibleItems = currentType() === 'departure' ? visibleDepartures : visibleArrivals;
    toggle.hidden = !expanded && allItems.length === visibleItems.length;
    toggle.textContent = expanded ? '운항 시간표 접기' : '전체 운항 시간표 보기';
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  function rows(items, type) {
    const timeLabel = type === 'departure' ? '출발시간' : '도착시간';
    if (!items.length) return '<tr><td colspan="6"><div class="empty-state">표시할 운항편이 없습니다.</div></td></tr>';
    return items.map((item) => {
      const pastClass = minutes(item.time) < referenceTime ? 'past-row' : '';
      return `<tr class="${pastClass}">
        <td class="schedule-time" data-label="${timeLabel}">${item.time}</td><td data-label="출발지">${item.origin}</td><td data-label="도착지">${item.destination}</td>
        <td class="route" data-label="선박명">${item.vessel}</td><td class="terminal-name" data-label="터미널">${item.terminalLabel}</td>
        <td data-label="운항상태"><span class="status-cell"><span class="status ${statusClass[item.status] || 'normal'}">${item.status}</span></span></td>
      </tr>`;
    }).join('');
  }

  terminalButtons.forEach((button) => button.addEventListener('click', () => {
    terminalButtons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', 'true');
    expanded = false;
    render();
  }));

  function selectMovement(tab) {
    movementTabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      section.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !selected;
    });
    expanded = false;
    render();
  }

  movementTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectMovement(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const next = movementTabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + movementTabs.length) % movementTabs.length];
      selectMovement(next);
      next.focus();
    });
  });

  toggle.addEventListener('click', () => { expanded = !expanded; render(); });
  section.querySelector('#today-date').textContent = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  render();
})();
