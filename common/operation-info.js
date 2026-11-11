(function initializeOperationInformation() {
  'use strict';

  const sourceRows = Array.isArray(window.PORTAL_OPERATION_ROWS)
    ? window.PORTAL_OPERATION_ROWS
    : [];
  const operationRows = sourceRows.map((row) => ({
    ...row,
    status: row.status || (row.operationType === '비운'
      ? (row.reason ? '통제' : '선사문의')
      : '정상운항')
  }));
  const options = window.PORTAL_OPERATION_OPTIONS || {};
  const fixedRegion = options.fixedRegion || '';
  const showRegionColumn = options.showRegionColumn !== false;
  const timeFirst = options.timeFirst === true;
  const contactTimetable = options.contactTimetable === true;
  const groupedContactTimetable = options.groupedContactTimetable === true;

  const tableBody = document.getElementById('operation-table-body');
  const periodSelect = document.getElementById('operation-period-select');
  const routeSelect = document.getElementById('operation-route-select');
  const regionSelect = document.getElementById('operation-region-select');
  const statusSelect = document.getElementById('operation-status-select');
  const searchForm = document.getElementById('operation-search-form');
  const searchInput = document.getElementById('operation-search-input');
  const emptyState = document.getElementById('operation-empty');
  const tableWrap = document.querySelector('.portal-operation-table-wrap');
  const groupList = document.getElementById('operation-group-list');
  const cardList = document.getElementById('operation-card-list');
  const pagination = document.getElementById('operation-pagination');
  const pageSize = 10;
  let currentPage = 1;

  const hasTableTarget = groupedContactTimetable ? Boolean(groupList) : Boolean(tableBody && tableWrap);
  if (!hasTableTarget || (!regionSelect && !fixedRegion) || (!statusSelect && !contactTimetable) || !searchForm || !searchInput || !emptyState || !cardList || !pagination) return;

  const configuredRegions = Array.isArray(window.PORTAL_TERMINAL_REGIONS)
    ? window.PORTAL_TERMINAL_REGIONS
    : [];
  const availableRegions = [...new Set([
    ...configuredRegions,
    ...operationRows.map((row) => row.region)
  ])].sort((a, b) => a.localeCompare(b, 'ko-KR'));
  if (regionSelect) {
    const allRegionOption = document.createElement('option');
    allRegionOption.value = 'all';
    allRegionOption.textContent = '전체 지역';
    regionSelect.append(allRegionOption);
    availableRegions.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionSelect.append(option);
    });
  }

  if (periodSelect) {
    const availablePeriods = [...new Set(operationRows.map((row) => row.period).filter(Boolean))]
      .sort((a, b) => b.localeCompare(a));
    availablePeriods.forEach((period) => {
      const [year, month] = period.split('-');
      const option = document.createElement('option');
      option.value = period;
      option.textContent = `${year}년 ${Number(month)}월`;
      periodSelect.append(option);
    });
    if (availablePeriods.includes(options.defaultPeriod)) periodSelect.value = options.defaultPeriod;
  }

  if (routeSelect) {
    const routeRows = fixedRegion
      ? operationRows.filter((row) => row.region === fixedRegion)
      : operationRows;
    const availableRoutes = [...new Set(routeRows.map((row) => row.group).filter(Boolean))];
    const allRouteOption = document.createElement('option');
    allRouteOption.value = 'all';
    allRouteOption.textContent = '전체 항로';
    routeSelect.append(allRouteOption);
    availableRoutes.forEach((route) => {
      const option = document.createElement('option');
      option.value = route;
      option.textContent = route;
      routeSelect.append(option);
    });
  }

  if (statusSelect) {
    const availableStatuses = [...new Set(operationRows.map((row) => row.status))];
    const allStatusOption = document.createElement('option');
    allStatusOption.value = 'all';
    allStatusOption.textContent = '전체 출항여부';
    statusSelect.append(allStatusOption);
    availableStatuses.forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      statusSelect.append(option);
    });
  }

  const escapeHtml = window.PortalDomUtils.escapeHtml;

  function formatTime(value) {
    return `${value.slice(0, 2)}:${value.slice(2)}`;
  }

  function statusKey(status) {
    if (status === '출항전') return 'pending';
    if (status === '운항중') return 'sailing';
    if (status === '완료') return 'complete';
    if (status === '정상운항') return 'normal';
    if (status === '통제') return 'control';
    if (status === '결항') return 'cancelled';
    return 'contact';
  }

  function renderRows(rows) {
    if (contactTimetable) {
      const renderOperator = (row) => Array.isArray(row.operatorSchedules) && row.operatorSchedules.length
        ? `<span class="mokpo-timetable-operator-list">${row.operatorSchedules.map((operator) => `<span class="mokpo-timetable-operator"><span>${escapeHtml(operator.name || '')}</span><span class="mokpo-timetable-operator-schedule-badge">${escapeHtml(operator.schedule || '')}</span></span>`).join('')}</span>`
        : escapeHtml(row.operator || '');
      const renderContact = (row) => {
        const contacts = (Array.isArray(row.contact)
          ? row.contact
          : String(row.contact || '').split(/\s*·\s*/))
          .map((contact) => String(contact).trim())
          .filter(Boolean);
        if (contacts.length < 2) return escapeHtml(contacts[0] || '');
        return `<span class="mokpo-timetable-contact-list">${contacts.map((contact) => `<span>${escapeHtml(contact)}</span>`).join('')}</span>`;
      };

      const renderTableRows = (tableRows) => tableRows.map((row) => {
        const formattedTime = formatTime(row.time);
        const suspensionBadge = row.suspension
          ? `<span class="mokpo-timetable-suspension-badge">${escapeHtml(row.suspension)}</span>`
          : '';
        return `<tr>
        <td data-label="출항시각"><time datetime="${formattedTime}">${formattedTime}</time>${suspensionBadge}</td>
        <td data-label="기항지">${escapeHtml(row.route)}</td>
        <td class="portal-operation-ship" data-label="선명">${escapeHtml(row.ship)}</td>
        <td data-label="소요시간">${escapeHtml(row.duration || '-')}</td>
        <td data-label="선종">${escapeHtml(row.shipType || '')}</td>
        <td data-label="선사명">${renderOperator(row)}</td>
        <td data-label="연락처">${renderContact(row)}</td>
      </tr>`;
      }).join('');

      const renderCards = (cardRows) => cardRows.map((row) => {
        const formattedTime = formatTime(row.time);
        return `<article class="portal-operation-card" aria-label="${escapeHtml(`${row.ship} ${row.route}`)}">
        <div class="portal-operation-card__main">
          <div class="portal-operation-card__departure-time"><time datetime="${formattedTime}">${formattedTime}</time>${row.suspension ? `<span class="mokpo-timetable-suspension-badge">${escapeHtml(row.suspension)}</span>` : ''}</div>
          <div class="portal-operation-card__identity">
            <div class="portal-operation-card__heading"><h3>${escapeHtml(row.ship)}</h3><span>${escapeHtml(row.route)}</span></div>
            <p><span>소요시간</span><i aria-hidden="true">:</i><span>${escapeHtml(row.duration || '-')}</span></p>
            <p><span>선종</span><i aria-hidden="true">:</i><span>${escapeHtml(row.shipType || '')}</span></p>
            <p><span>선사명</span><i aria-hidden="true">:</i><span>${renderOperator(row)}</span></p>
            <p><span>연락처</span><i aria-hidden="true">:</i><span>${renderContact(row)}</span></p>
          </div>
        </div>
      </article>`;
      }).join('');

      const renderGroupNote = (title, content) => content
        ? `<div class="mokpo-timetable-group-note" role="note"><strong class="mokpo-timetable-group-note__title"><svg class="mokpo-timetable-group-note__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 10v6"></path><path d="M12 7h.01"></path></svg><span>${escapeHtml(title)}</span></strong><p>${escapeHtml(content)}</p></div>`
        : '';

      if (groupedContactTimetable) {
        const groups = [...rows.reduce((map, row) => {
          const label = row.group || '운항 스케쥴';
          if (!map.has(label)) map.set(label, []);
          map.get(label).push(row);
          return map;
        }, new Map())];
        groupList.innerHTML = groups.map(([label, groupRows], index) => {
          const headingId = `mokpo-timetable-group-title-${index}`;
          const groupNote = groupRows.find((row) => row.groupNote)?.groupNote || '';
          const groupNoteTitle = groupRows.find((row) => row.groupNoteTitle)?.groupNoteTitle || '운항안내';
          return `<section class="mokpo-timetable-group" aria-labelledby="${headingId}">
          <div class="content-heading"><h2 id="${headingId}">${escapeHtml(label)}</h2></div>
          <div class="portal-table-wrap portal-operation-table-wrap table-scroll-region" role="region" aria-label="${escapeHtml(label)} 운항 스케쥴" tabindex="0">
            <table class="portal-data-table portal-operation-table mokpo-timetable-table">
              <caption class="sr-only">${escapeHtml(label)} 출항시각, 기항지, 선명, 소요시간, 선종, 선사명, 연락처</caption>
              <colgroup><col class="mokpo-timetable-col-time"><col class="mokpo-timetable-col-route"><col class="mokpo-timetable-col-ship"><col class="mokpo-timetable-col-duration"><col class="mokpo-timetable-col-type"><col class="mokpo-timetable-col-operator"><col class="mokpo-timetable-col-contact"></colgroup>
              <thead><tr><th scope="col">출항시각</th><th scope="col">기항지</th><th scope="col">선명</th><th scope="col">소요시간</th><th scope="col">선종</th><th scope="col">선사명</th><th scope="col">연락처</th></tr></thead>
              <tbody>${renderTableRows(groupRows)}</tbody>
            </table>
          </div>
          ${renderGroupNote(groupNoteTitle, groupNote)}
        </section>`;
        }).join('');
        cardList.innerHTML = groups.map(([label, groupRows], index) => {
          const headingId = `mokpo-timetable-card-group-title-${index}`;
          const groupNote = groupRows.find((row) => row.groupNote)?.groupNote || '';
          const groupNoteTitle = groupRows.find((row) => row.groupNoteTitle)?.groupNoteTitle || '운항안내';
          return `<section class="mokpo-timetable-card-group" aria-labelledby="${headingId}"><div class="content-heading"><h2 id="${headingId}">${escapeHtml(label)}</h2></div>${renderCards(groupRows)}${renderGroupNote(groupNoteTitle, groupNote)}</section>`;
        }).join('');
      } else {
        tableBody.innerHTML = renderTableRows(rows);
        cardList.innerHTML = renderCards(rows);
      }
      return;
    }

    tableBody.innerHTML = rows.map((row) => {
      const formattedTime = formatTime(row.time);
      const reason = row.reason ? escapeHtml(row.reason) : '<span class="portal-operation-muted">-</span>';
      const regionCell = showRegionColumn ? `<td data-label="지역">${escapeHtml(row.region)}</td>` : '';
      const departureCell = `<td data-label="출항지">${escapeHtml(row.departure)}</td>`;
      const timeCell = `<td data-label="출항시각"><time datetime="${formattedTime}">${formattedTime}</time></td>`;
      const leadingCells = timeFirst
        ? `${timeCell}${regionCell}${departureCell}`
        : `${regionCell}${departureCell}${timeCell}`;
      return `<tr>
        ${leadingCells}
        <td class="portal-operation-ship" data-label="여객선명">${escapeHtml(row.ship)}</td>
        <td data-label="운항항로명">${escapeHtml(row.route)}</td>
        <td data-label="출항여부"><span class="portal-operation-status" data-status="${statusKey(row.status)}">${escapeHtml(row.status)}</span></td>
        <td data-label="운항구분"><span class="portal-operation-kind">${escapeHtml(row.operationType)}</span></td>
        <td data-label="사유">${reason}</td>
      </tr>`;
    }).join('');

    cardList.innerHTML = rows.map((row) => {
      const formattedTime = formatTime(row.time);
      const reason = row.reason
        ? `<p class="portal-operation-card__reason">${escapeHtml(row.reason)}</p>`
        : '';
      const state = statusKey(row.status);
      return `<article class="portal-operation-card" aria-label="${escapeHtml(`${row.ship} ${row.route}`)}">
        <div class="portal-operation-card__main">
          <div class="portal-operation-card__departure-time">
            <time datetime="${formattedTime}">${formattedTime}</time>
          </div>
          <div class="portal-operation-card__identity">
            <div class="portal-operation-card__heading">
              <h3>${escapeHtml(row.ship)}</h3>
              <span>${escapeHtml(row.route)}</span>
            </div>
            <p><span>출항지</span><i aria-hidden="true">:</i><span>${escapeHtml(row.departure)}</span></p>
          </div>
          <div class="portal-operation-card__status-group">
            <span class="portal-operation-status" data-status="${state}">${escapeHtml(row.status)}</span>
            ${reason}
          </div>
        </div>
      </article>`;
    }).join('');
  }

  const mobileTableQuery = window.matchMedia('(max-width: 760px)');
  function syncTableInteraction() {
    if (!tableWrap) return;
    if (mobileTableQuery.matches) {
      tableWrap.removeAttribute('tabindex');
      tableWrap.setAttribute('aria-label', '여객선 운항정보 목록');
      return;
    }
    tableWrap.setAttribute('tabindex', '0');
    tableWrap.setAttribute('aria-label', '여객선 운항정보 표');
  }

  mobileTableQuery.addEventListener('change', syncTableInteraction);
  syncTableInteraction();

  function applyFilters(resetPage = false) {
    if (resetPage) currentPage = 1;
    const selectedRegion = fixedRegion || regionSelect.value;
    const selectedPeriod = periodSelect?.value || '';
    const selectedRoute = routeSelect?.value || 'all';
    const selectedStatus = statusSelect?.value || 'all';
    const query = searchInput.value.trim().toLocaleLowerCase('ko-KR');

    const filteredRows = operationRows.filter((row) => {
      const matchesRegion = selectedRegion === 'all' || row.region === selectedRegion;
      const matchesPeriod = !selectedPeriod || row.period === selectedPeriod;
      const matchesRoute = selectedRoute === 'all' || row.group === selectedRoute;
      const matchesStatus = selectedStatus === 'all' || row.status === selectedStatus;
      const operatorScheduleText = Array.isArray(row.operatorSchedules)
        ? row.operatorSchedules.map((operator) => `${operator.name || ''} ${operator.schedule || ''}`).join(' ')
        : '';
      const searchableText = [row.ship, row.shipType, row.route, row.departure, row.operator, operatorScheduleText, row.status, row.contact, row.duration, row.suspension].join(' ').toLocaleLowerCase('ko-KR');
      const matchesQuery = !query || searchableText.includes(query);
      return matchesRegion && matchesPeriod && matchesRoute && matchesStatus && matchesQuery;
    });

    const totalPages = groupedContactTimetable
      ? (filteredRows.length ? 1 : 0)
      : Math.ceil(filteredRows.length / pageSize);
    currentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
    const pageStart = (currentPage - 1) * pageSize;
    const visibleRows = groupedContactTimetable
      ? filteredRows
      : filteredRows.slice(pageStart, pageStart + pageSize);

    renderRows(visibleRows);
    if (groupedContactTimetable) {
      pagination.innerHTML = '';
      pagination.hidden = true;
    } else {
      window.PortalPagination.renderPagination(pagination, currentPage, totalPages, (page) => {
        currentPage = page;
        applyFilters();
        const resultsStart = mobileTableQuery.matches ? cardList : tableWrap;
        resultsStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (groupedContactTimetable) groupList.hidden = filteredRows.length === 0;
    else tableWrap.hidden = filteredRows.length === 0;
    cardList.hidden = filteredRows.length === 0;
    emptyState.hidden = filteredRows.length !== 0;
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters(true);
  });
  searchInput.addEventListener('input', () => applyFilters(true));
  periodSelect?.addEventListener('change', () => applyFilters(true));
  routeSelect?.addEventListener('change', () => applyFilters(true));
  regionSelect?.addEventListener('change', () => applyFilters(true));
  statusSelect?.addEventListener('change', () => applyFilters(true));
  applyFilters(true);
}());
