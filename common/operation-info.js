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

  const tableBody = document.getElementById('operation-table-body');
  const regionSelect = document.getElementById('operation-region-select');
  const statusSelect = document.getElementById('operation-status-select');
  const searchForm = document.getElementById('operation-search-form');
  const searchInput = document.getElementById('operation-search-input');
  const emptyState = document.getElementById('operation-empty');
  const tableWrap = document.querySelector('.portal-operation-table-wrap');
  const cardList = document.getElementById('operation-card-list');
  const pagination = document.getElementById('operation-pagination');
  const pageSize = 10;
  let currentPage = 1;

  if (!tableBody || !regionSelect || !statusSelect || !searchForm || !searchInput || !emptyState || !tableWrap || !cardList || !pagination) return;

  const configuredRegions = Array.isArray(window.PORTAL_TERMINAL_REGIONS)
    ? window.PORTAL_TERMINAL_REGIONS
    : [];
  const availableRegions = [...new Set([
    ...configuredRegions,
    ...operationRows.map((row) => row.region)
  ])].sort((a, b) => a.localeCompare(b, 'ko-KR'));
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
    tableBody.innerHTML = rows.map((row) => {
      const formattedTime = formatTime(row.time);
      const reason = row.reason ? escapeHtml(row.reason) : '<span class="portal-operation-muted">-</span>';
      return `<tr>
        <td data-label="지역">${escapeHtml(row.region)}</td>
        <td data-label="출항지">${escapeHtml(row.departure)}</td>
        <td data-label="출항시각"><time datetime="${formattedTime}">${formattedTime}</time></td>
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
    const selectedRegion = regionSelect.value;
    const selectedStatus = statusSelect.value;
    const query = searchInput.value.trim().toLocaleLowerCase('ko-KR');

    const filteredRows = operationRows.filter((row) => {
      const matchesRegion = selectedRegion === 'all' || row.region === selectedRegion;
      const matchesStatus = selectedStatus === 'all' || row.status === selectedStatus;
      const searchableText = [row.ship, row.route, row.departure, row.status].join(' ').toLocaleLowerCase('ko-KR');
      const matchesQuery = !query || searchableText.includes(query);
      return matchesRegion && matchesStatus && matchesQuery;
    });

    const totalPages = Math.ceil(filteredRows.length / pageSize);
    currentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
    const pageStart = (currentPage - 1) * pageSize;
    const visibleRows = filteredRows.slice(pageStart, pageStart + pageSize);

    renderRows(visibleRows);
    window.PortalPagination.renderPagination(pagination, currentPage, totalPages, (page) => {
      currentPage = page;
      applyFilters();
      const resultsStart = mobileTableQuery.matches ? cardList : tableWrap;
      resultsStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tableWrap.hidden = filteredRows.length === 0;
    cardList.hidden = filteredRows.length === 0;
    emptyState.hidden = filteredRows.length !== 0;
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters(true);
  });
  searchInput.addEventListener('input', () => applyFilters(true));
  regionSelect.addEventListener('change', () => applyFilters(true));
  statusSelect.addEventListener('change', () => applyFilters(true));
  applyFilters(true);
}());
