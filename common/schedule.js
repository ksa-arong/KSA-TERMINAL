(function () {
  'use strict';

  const config = window.scheduleData;
  const section = document.getElementById('schedule');
  if (!config || !section) throw new Error('scheduleData와 #schedule 요소가 필요합니다.');
  if (!window.SectionTitle) throw new Error('SectionTitle 컴포넌트가 필요합니다.');
  const t = window.i18n ? window.i18n.t : (key) => key;
  const localize = window.i18n ? window.i18n.localize : (value) => value && value.ko !== undefined ? value.ko : value;

  const schedule = config.items || [];
  const terminalDirectory = config.terminals || {};
  const portDirectory = config.ports || {};
  const filters = (config.filters || []).map((filter) => {
    if (typeof filter !== 'string') return filter;
    const terminal = terminalDirectory[filter] || {};
    return { id: filter, label: localize(terminal.filterLabel || terminal.tableLabel) || filter };
  });
  const statusMeta = {
    normal: { className: 'normal' }, delayed: { className: 'control' }, cancelled: { className: 'cancel' },
    controlled: { className: 'control' }, inquiry: { className: 'inquiry' }
  };
  const legacyStatusCodes = { '정상운항': 'normal', '지연': 'delayed', '결항': 'cancelled', '통제': 'controlled', '선사문의': 'inquiry' };
  const hasRouteType = schedule.some((item) => item.routeType);
  const referenceTime = minutes(config.referenceTime || '08:30');
  const notice = config.notice || '선사 사정 및 해상 기상 상황에 따라 운항 일정이 변동될 수 있으니, 출항 전 해당 여객선사에 반드시 확인하시기 바랍니다.';
  let expanded = false;

  function minutes(time) {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }

  function durationLabel(item) {
    if (item.duration) return item.duration;
    if (!item.arrivalTime) return '-';
    let totalMinutes = minutes(item.arrivalTime) - minutes(item.time);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return `${hours}:${String(remainingMinutes).padStart(2, '0')}`;
  }

  function portLabel(id, legacyLabel) {
    const directoryLabel = localize(portDirectory[id]);
    const dictionaryKey = id && t(`ports.${id}`);
    return directoryLabel || (dictionaryKey !== `ports.${id}` ? dictionaryKey : '') || legacyLabel || id || '-';
  }

  function terminalLabel(item) {
    const terminal = terminalDirectory[item.terminalId] || {};
    return localize(terminal.tableLabel) || item.terminalLabel || item.terminalId || '-';
  }

  function displayStatus(status) {
    const code = statusMeta[status] ? status : legacyStatusCodes[status];
    return code ? { ...statusMeta[code], label: t(`schedule.status.${code}`) } : { className: 'normal', label: status || t('schedule.status.normal') };
  }

  section.innerHTML = `
    <div class="container">
      <div class="section-head">
        ${window.SectionTitle.render({
          align: 'left',
          theme: 'light',
          title: '실시간 운항정보',
          subtitle: '터미널별 출항·입항 정보를 한눈에 확인하세요.',
          titleId: 'schedule-title'
        })}
        <span class="update-time"><strong id="today-date"></strong> ${config.referenceTime || '08:30'} 기준</span>
      </div>
      <div class="schedule-controls">
        <div class="movement-tabs" role="tablist" aria-label="${t('schedule.movementAria')}">
          <button class="movement-tab" id="departure-tab" type="button" role="tab" aria-selected="true" aria-controls="departure-panel">${t('schedule.departure')}</button>
          <button class="movement-tab" id="arrival-tab" type="button" role="tab" aria-selected="false" aria-controls="arrival-panel" tabindex="-1">${t('schedule.arrival')}</button>
        </div>
        <div class="terminal-tabs" id="terminal-filters" aria-label="${t('schedule.terminalFilterAria')}">
          <button class="terminal-tab" type="button" data-filter="all" aria-pressed="true">${t('schedule.all')}</button>
          ${filters.map((filter) => `<button class="terminal-tab" type="button" data-filter="${filter.id}" aria-pressed="false">${filter.label}</button>`).join('')}
        </div>
      </div>
      ${hasRouteType ? `<div class="route-type-filters" id="route-type-filters" aria-label="${t('schedule.routeFilterAria')}" hidden>
        <span>${t('schedule.routeType')}</span>
        <button class="route-type-filter" type="button" data-route-type="편도" aria-pressed="false">${t('schedule.oneWay')}</button>
        <button class="route-type-filter" type="button" data-route-type="순환" aria-pressed="false">${t('schedule.circular')}</button>
      </div>` : ''}
      <div class="movement-panel" id="departure-panel" role="tabpanel" aria-labelledby="departure-tab">
        ${table('departure')}
        ${legend()}
      </div>
      <div class="movement-panel" id="arrival-panel" role="tabpanel" aria-labelledby="arrival-tab" hidden>
        ${table('arrival')}
        ${legend()}
      </div>
      <button class="schedule-toggle" id="schedule-toggle" type="button" aria-expanded="false">${t('schedule.expand')}</button>
    </div>`;

  function legend() {
    return `<div class="schedule-meta"><p class="notice-line">※ ${notice}</p><div class="status-legend" aria-label="${t('schedule.legendAria')}"><span class="status normal">${t('schedule.status.normal')}</span><span class="status cancel">${t('schedule.status.cancelled')}</span><span class="status control">${t('schedule.status.controlled')}</span><span class="status inquiry">${t('schedule.status.inquiry')}</span></div></div>`;
  }

  function table(type) {
    return `<div class="status-table-wrap"><table class="schedule-table"><caption style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">출항시간 기준 운항 현황</caption>
      <thead><tr><th scope="col">출항시간</th><th scope="col">소요시간</th><th scope="col">항로</th><th scope="col">선사(선명)</th><th scope="col">터미널</th><th scope="col">운항상태</th></tr></thead>
      <tbody id="${type}-body"></tbody></table></div>`;
  }

  const terminalButtons = [...section.querySelectorAll('.terminal-tab[data-filter]')];
  const routeTypePanel = section.querySelector('#route-type-filters');
  const routeTypeButtons = [...section.querySelectorAll('.route-type-filter')];
  const movementTabs = [...section.querySelectorAll('.movement-tab')];
  const toggle = section.querySelector('#schedule-toggle');

  function activeFilter() {
    return terminalButtons.find((button) => button.getAttribute('aria-pressed') === 'true').dataset.filter;
  }

  function currentType() {
    return section.querySelector('#departure-tab').getAttribute('aria-selected') === 'true' ? 'departure' : 'arrival';
  }

  function activeRouteType() {
    return routeTypeButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.routeType || 'all';
  }

  function render() {
    const filter = activeFilter();
    const routeType = activeRouteType();
    const terminalItems = filter === 'all' ? schedule : schedule.filter((item) => item.terminalId === filter);
    const filtered = routeType === 'all' ? terminalItems : terminalItems.filter((item) => item.routeType === routeType);
    const departures = filtered.filter((item) => item.type === 'departure');
    const arrivals = filtered.filter((item) => item.type === 'arrival');
    const visibleDepartures = expanded ? departures : departures.filter((item) => minutes(item.time) >= referenceTime).slice(0, 5);
    const visibleArrivals = expanded ? arrivals : arrivals.filter((item) => minutes(item.time) >= referenceTime).slice(0, 5);

    section.querySelector('#departure-body').innerHTML = rows(visibleDepartures, 'departure');
    section.querySelector('#arrival-body').innerHTML = rows(visibleArrivals, 'arrival');

    const allItems = currentType() === 'departure' ? departures : arrivals;
    const visibleItems = currentType() === 'departure' ? visibleDepartures : visibleArrivals;
    toggle.hidden = !expanded && allItems.length === visibleItems.length;
    toggle.textContent = expanded ? t('schedule.collapse') : t('schedule.expand');
    toggle.setAttribute('aria-expanded', String(expanded));

    if (routeTypePanel) {
      const showRouteTypes = filter !== 'all' && terminalItems.some((item) => item.routeType);
      routeTypePanel.hidden = !showRouteTypes;
    }
  }

  function rows(items, type) {
    const columnCount = 6;
    if (!items.length) return `<tr><td colspan="${columnCount}"><div class="empty-state">표시할 운항편이 없습니다.</div></td></tr>`;
    return items.map((item, index) => {
      const status = displayStatus(item.status);
      const pastClass = minutes(item.time) < referenceTime ? 'past-row' : '';
      const tooltipId = `${type}-vessel-contact-${index}`;
      const contactPhone = item.operatorPhone || '1544-1114';
      const fallbackOperator = item.vessel.endsWith('해운') ? item.vessel : `${item.vessel.replace(/호$/, '')}해운`;
      const operator = item.operator || fallbackOperator;
      const operatorPhone = `<span class="vessel-contact" id="${tooltipId}" role="tooltip"><span class="contact-prefix">Tel.</span><strong>${contactPhone}</strong></span>`;
      const vessel = `<span class="vessel-info has-contact" tabindex="0" aria-describedby="${tooltipId}"><strong>${item.vessel}</strong><small>${operator}</small>${operatorPhone}</span>`;
      return `<tr class="${pastClass}">
        <td class="schedule-time" data-label="출항시간">${item.time}</td><td class="duration-time" data-label="소요시간">${durationLabel(item)}</td><td class="route" data-label="항로">${portLabel(item.originId, item.origin)}-${portLabel(item.destinationId, item.destination)}</td>
        <td data-label="선사(선명)">${vessel}</td><td class="terminal-name" data-label="터미널">${terminalLabel(item)}</td>
        <td data-label="운항상태"><span class="status-cell"><span class="status ${status.className}">${status.label}</span></span></td>
      </tr>`;
    }).join('');
  }

  terminalButtons.forEach((button) => button.addEventListener('click', () => {
    terminalButtons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', 'true');
    routeTypeButtons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    expanded = false;
    render();
  }));

  routeTypeButtons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.getAttribute('aria-pressed') === 'true';
    routeTypeButtons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', String(!selected));
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
