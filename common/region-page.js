(function defineRegionPageRenderer() {
  'use strict';

  const escapeHtml = window.PortalDomUtils.escapeHtml;
  const localize = (value) => window.i18n ? window.i18n.localize(value) : value?.ko || value || '';
  const bookingUrl = 'http://island.theksa.co.kr';
  const nationalTel = '1544-1114';
  const createPaths = (regionId) => window.KsaPathResolver.create({ location: 'region', regionId });

  function allPages() {
    return (window.REGION_MENU || []).flatMap((group) => (group.pages || group.children).map((item) => ({ ...item, groupId: group.id, groupLabel: group.label })));
  }

  function definition(pageKey) {
    return allPages().find((item) => item.page === pageKey && !item.external) || null;
  }

  function routes(scheduleData = window.scheduleData) {
    return Array.isArray(scheduleData?.routes) ? scheduleData.routes : [];
  }

  function operators(scheduleData = window.scheduleData) {
    const result = new Map();
    routes(scheduleData).forEach((entry) => {
      const route = entry.route || {};
      const responsibility = localize(route.group) || localize(route.destination) || entry.id;
      (route.operators || []).forEach((operator) => {
        const name = localize(operator.name);
        if (!name) return;
        const key = `${name}|${operator.tel || ''}`;
        const current = result.get(key) || { name, tel: operator.tel || '', verified: true, routes: new Set() };
        current.verified = current.verified && operator.verified !== false;
        current.routes.add(responsibility);
        result.set(key, current);
      });
    });
    return [...result.values()].map((item) => ({ ...item, routes: [...item.routes] }));
  }

  function vessels(scheduleData = window.scheduleData) {
    const result = new Map();
    routes(scheduleData).forEach((entry) => {
      const route = entry.route || {};
      const name = localize(route.vessel?.name);
      if (!name) return;
      const key = name;
      const current = result.get(key) || { name, tonnage: route.vessel?.tonnage || null, capacity: route.vessel?.capacity || null, routes: new Set() };
      current.routes.add(localize(route.group) || localize(route.destination) || entry.id);
      result.set(key, current);
    });
    return [...result.values()].map((item) => ({ ...item, routes: [...item.routes] }));
  }

  function pageRecord(pageKey, terminalData = window.terminalData, scheduleData = window.scheduleData) {
    return terminalData?.pages?.[pageKey] || scheduleData?.pages?.[pageKey] || null;
  }

  function getPageState(pageKey, terminalData = window.terminalData, scheduleData = window.scheduleData) {
    if (!definition(pageKey)) return 'preparing';
    const sharedContent = window.PORTAL_SUBPAGE_DATA?.content;
    if (typeof sharedContent === 'string' && sharedContent.trim()) return 'ready';
    return window.getRegionPageState
      ? window.getRegionPageState(pageKey, terminalData, scheduleData)
      : 'preparing';
  }

  function telephone(tel, label = tel) {
    const callable = String(tel).replace(/[^\d+]/g, '');
    return `<a class="region-page-phone" href="tel:${callable}">${escapeHtml(label)}</a>`;
  }

  function contentSection(id, title, description, content, className = '') {
    return `<section class="template-section"><div class="container"><section class="content-block${className ? ` ${className}` : ''}" aria-labelledby="${escapeHtml(id)}">
      <div class="content-heading"><h2 id="${escapeHtml(id)}">${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div>
      ${content}
    </section></div></section>`;
  }

  function terminalProfiles(terminalData = window.terminalData) {
    return Array.isArray(terminalData?.terminalProfiles) ? terminalData.terminalProfiles.filter((terminal) => terminal.verified !== false) : [];
  }

  function terminalCarriers(terminalData = window.terminalData) {
    const result = new Map();
    terminalProfiles(terminalData).forEach((terminal) => (terminal.carriers || []).forEach((carrier) => {
      const key = `${carrier.name}|${carrier.tel || ''}`;
      const current = result.get(key) || { name: carrier.name, tel: carrier.tel || '', verified: true, terminals: new Set() };
      current.verified = current.verified && carrier.verified !== false;
      current.terminals.add(terminal.shortName || terminal.name);
      result.set(key, current);
    }));
    return [...result.values()].map((carrier) => ({ ...carrier, terminals: [...carrier.terminals] }));
  }

  function renderTerminalTabs(pageKey, terminals, renderPanel) {
    if (!terminals.length) return '';
    const primary = terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    const multiple = terminals.length > 1;
    const sectionPages = [
      { page: 'terminal-introduction', label: '터미널 소개', href: 'terminal-introduction.html' },
      { page: 'directions', label: '오시는 길', href: 'directions.html' },
      { page: 'facilities', label: '시설 안내', href: 'facilities.html' },
      { page: 'parking', label: '주차 안내', href: 'parking.html' }
    ];
    const currentSectionPage = sectionPages.find((item) => item.page === pageKey);
    const tabs = `<nav class="tab-list" aria-label="${escapeHtml(`${primary.shortName || primary.name} 안내 메뉴`)}" data-terminal-section-tabs>${sectionPages.map((item) => `<a class="tab-button" href="${item.href}#${escapeHtml(primary.id)}"${item.page === pageKey ? ' aria-current="page"' : ''} data-terminal-section-link data-page-href="${item.href}">${item.label}</a>`).join('')}</nav>`;
    const heading = currentSectionPage && pageKey !== 'parking' ? `<div class="content-heading"><h2 id="${escapeHtml(pageKey)}-content-title">${escapeHtml(currentSectionPage.label)}</h2></div>` : '';
    const panels = terminals.map((terminal) => `<section id="${pageKey}-panel-${escapeHtml(terminal.id)}" class="region-terminal-panel" data-terminal-panel="${escapeHtml(terminal.id)}" data-terminal-short-name="${escapeHtml(terminal.shortName || terminal.name)}" data-terminal-name="${escapeHtml(terminal.name)}" data-terminal-address="${escapeHtml(terminal.address || '')}" data-terminal-map-url="${escapeHtml(terminalMapUrl(terminal))}"${multiple && terminal.id !== primary.id ? ' hidden' : ''}>${renderPanel(terminal)}</section>`).join('');
    return `${tabs}${heading}${panels}`;
  }

  function numberText(value, unit) {
    return value === null || value === undefined ? '' : `${Number(value).toLocaleString('ko-KR')}${unit}`;
  }

  function renderTerminalIntroduction(terminalData) {
    const terminals = terminalProfiles(terminalData);
    const primary = terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    if (!primary) return contentSection('terminal-introduction-content-title', '터미널 소개', '터미널 정보를 준비 중입니다.', '');
    const labels = { siteArea: '대지면적', buildingArea: '건축면적', totalFloorArea: '연면적', hallArea: '대합실 면적', capacity: '수용인원' };
    const content = renderTerminalTabs('terminal-introduction', terminals, (terminal) => {
      const photos = (Array.isArray(terminal.photo) ? terminal.photo : terminal.photo ? [terminal.photo] : []).filter((photo) => photo && photo.src);
      const photoGallery = photos.length ? `<div class="region-terminal-photo-slider${photos.length > 1 ? ' region-terminal-photo-slider--multiple' : ''}" data-terminal-photo-slider aria-label="${escapeHtml(terminal.name)} 사진">
        <div class="region-terminal-photo-viewport">${photos.map((photo, index) => `<figure class="region-terminal-photo" data-photo-slide${index === 0 ? '' : ' hidden'}><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || `${terminal.name} 전경`)}" loading="lazy"></figure>`).join('')}</div>
        ${photos.length > 1 ? `<div class="region-terminal-photo-controls"><button class="region-terminal-photo-button region-terminal-photo-button--previous" type="button" aria-label="이전 사진" data-photo-prev><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><span class="region-terminal-photo-status" aria-live="polite" data-photo-status>1 / ${photos.length}</span><button class="region-terminal-photo-button region-terminal-photo-button--next" type="button" aria-label="다음 사진" data-photo-next><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></div>` : ''}
      </div>` : '';
      const scale = Object.entries(terminal.scale || {}).filter(([, value]) => value !== null && value !== undefined).map(([key, value]) => `<li><span>${labels[key] || key}</span><strong>${numberText(value, key === 'capacity' ? '명' : '㎡')}</strong></li>`).join('');
      const introductionCopy = localize(terminal.introduction);
      const operationInfo = renderTerminalOperationInfo(terminal);
      return `${introductionCopy ? `<p class="region-terminal-introduction-copy">${escapeHtml(introductionCopy)}</p>` : ''}${photoGallery}${operationInfo}${scale ? `<ul class="region-terminal-scale">${scale}</ul>` : ''}`;
    });
    return `<section class="template-section"><div class="container"><section class="content-block" aria-labelledby="page-title">
      ${content}
    </section></div></section>`;
  }

  function renderParking(parking) {
    if (!parking) return '';
    const heading = (title, description = '') => `<div class="content-heading"><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div>`;
    const table = (caption, rows) => `<div class="portal-lost-center-table-wrap table-scroll-region" role="region" aria-label="${escapeHtml(caption)}" tabindex="0"><table class="portal-data-table region-parking-table">
      <caption class="sr-only">${escapeHtml(caption)}</caption>
      <colgroup><col style="width: 20%;"><col style="width: 40%;"><col style="width: 40%;"></colgroup>
      <thead><tr><th scope="col">구분</th><th scope="col">기준</th><th scope="col">안내</th></tr></thead>
      <tbody>${rows.map((row, index) => {
        const continuesGroup = index > 0 && rows[index - 1][0] === row[0];
        let groupLength = 1;
        while (index + groupLength < rows.length && rows[index + groupLength][0] === row[0]) groupLength += 1;
        const groupHeader = continuesGroup ? '' : `<th scope="${groupLength > 1 ? 'rowgroup' : 'row'}"${groupLength > 1 ? ` rowspan="${groupLength}"` : ''}>${escapeHtml(row[0])}</th>`;
        return `<tr>${groupHeader}<td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`;
      }).join('')}</tbody>
    </table></div>`;
    if (parking.type === 'free') {
      const rows = [['기본 요금', '무료', '-']];
      const area = parking.area !== null && parking.area !== undefined ? numberText(parking.area, '㎡') : '';
      let capacities = '';
      if (parking.capacity) {
        capacities = [
          parking.capacity.small !== null && parking.capacity.small !== undefined ? `소형 ${parking.capacity.small}대` : '',
          parking.capacity.large !== null && parking.capacity.large !== undefined ? `대형 ${parking.capacity.large}대` : ''
        ].filter(Boolean).join(' · ');
      }
      if (area && capacities) rows.push(['주차장 규모', area, capacities]);
      else if (area) rows.push(['면적', '주차장 전체 면적', area]);
      else if (capacities) rows.push(['주차면', '차종별 수용 규모', capacities]);
      return `<section class="content-guide-section">${heading('주차 요금')}${table('무료 주차장 안내', rows)}</section>`;
    }
    const feeRows = [];
    if (parking.freeMinutes !== null && parking.freeMinutes !== undefined) feeRows.push(['기본 요금', `최초 ${parking.freeMinutes}분`, '무료']);
    (parking.rates || []).forEach((rate) => feeRows.push(['기본 요금', rate.label, `${Number(rate.fee).toLocaleString('ko-KR')}원`]));
    if (parking.extra) feeRows.push(['추가 요금', parking.extra.basis || '기본 구간 이후', parking.extra.label]);
    if (parking.dailyMax) feeRows.push([
      parking.dailyMax.label || '일 최대',
      parking.dailyMax.basis || (parking.dailyMax.overMinutes ? `${parking.dailyMax.overMinutes}분 초과` : '일 최대요금'),
      `${Number(parking.dailyMax.fee).toLocaleString('ko-KR')}원${parking.dailyMax.note ? ` · ${parking.dailyMax.note}` : ''}`
    ]);
    if (parking.settle) feeRows.push(['정산 방법', '이용요금 정산', parking.settle]);
    const discountRows = (parking.discounts || []).map((discount) => ['할인', discount.target, `${discount.rate}% 할인${discount.note ? ` · ${discount.note}` : ''}`]);
    const legalNote = parking.legal ? `<p class="content-guide-note">${escapeHtml(parking.legal)}</p>` : '';
    const feeContent = feeRows.length ? `<section class="content-guide-section">${heading('주차 요금')}${table('유료 주차장 요금 안내', feeRows)}${discountRows.length ? '' : legalNote}</section>` : '';
    const discountContent = discountRows.length ? `<section class="content-guide-section">${heading('할인 안내')}${table('유료 주차장 할인 안내', discountRows)}${legalNote}</section>` : '';
    return `${feeContent}${discountContent}`;
  }

  function renderTerminalFacilities(terminalData) {
    const terminals = terminalProfiles(terminalData);
    const primary = terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    if (!primary) return contentSection('facilities-content-title', '시설 안내', '터미널 정보를 준비 중입니다.', '');
    const content = renderTerminalTabs('facilities', terminals, (terminal) => {
      const floorEntries = (terminal.floors || []).filter((floor) => floor.items?.length || floor.image);
      const floorTabs = floorEntries.map((floor, index) => {
        const floorId = `${terminal.id}-${index}`;
        const primaryFacilities = (floor.items || []).slice(0, 4);
        const remainingCount = Math.max((floor.items || []).length - primaryFacilities.length, 0);
        const facilitySummary = floor.navSummary || (primaryFacilities.length
          ? `${primaryFacilities.join(', ')}${remainingCount ? ` 외 ${remainingCount}개` : ''}`
          : '시설 배치도');
        return `<button class="region-terminal-floor-button" id="facilities-floor-tab-${escapeHtml(floorId)}" type="button" role="tab" aria-selected="${String(index === 0)}" aria-controls="facilities-floor-panel-${escapeHtml(floorId)}" aria-label="${escapeHtml(`${floor.label}: ${facilitySummary}`)}" tabindex="${index === 0 ? '0' : '-1'}" data-floor-tab="${escapeHtml(floorId)}"><strong class="region-terminal-floor-label">${escapeHtml(floor.level)}</strong><span class="region-terminal-floor-summary">${escapeHtml(facilitySummary)}</span></button>`;
      }).join('');
      const floorPanels = floorEntries.map((floor, index) => {
        const floorId = `${terminal.id}-${index}`;
        const floorImage = floor.image ? `<img class="region-terminal-floor-image" src="${escapeHtml(floor.image)}" alt="${escapeHtml(`${terminal.name} ${floor.label} 시설 배치도`)}" loading="lazy">` : '';
        return `<section class="region-terminal-floor-panel" id="facilities-floor-panel-${escapeHtml(floorId)}" role="tabpanel" aria-labelledby="facilities-floor-tab-${escapeHtml(floorId)}" data-floor-panel="${escapeHtml(floorId)}"${index === 0 ? '' : ' hidden'}>${floorImage}</section>`;
      }).join('');
      const floors = floorEntries.length ? `<div class="region-terminal-floor-browser" data-terminal-floor-browser><div class="region-terminal-floor-tabs" role="tablist" aria-label="${escapeHtml(terminal.name)} 층 선택">${floorTabs}</div><div class="region-terminal-floor-stage">${floorPanels}</div></div>` : '';
      const floorGuideRows = floorEntries.map((floor) => {
        const guideGroups = (floor.guideGroups || []).map((group) => {
          const roomList = (group.rooms || []).map((room) => `<div><dt>${escapeHtml(room.room)}</dt><dd>${escapeHtml(room.name)}</dd></div>`).join('');
          const groupContent = roomList
            ? `<dl class="region-terminal-floor-room-list">${roomList}</dl>`
            : `<p>${escapeHtml((group.items || []).join(', '))}</p>`;
          if (roomList && !group.label) return groupContent;
          return `<div class="region-terminal-floor-guide-group"><strong>${escapeHtml(group.label)}</strong>${groupContent}</div>`;
        }).join('');
        const guideContent = guideGroups
          ? `<div class="region-terminal-floor-guide-groups">${guideGroups}</div>`
          : escapeHtml((floor.items || []).join(', ') || '시설 정보를 준비 중입니다.');
        return `<tr><th class="portal-table-cell--centered" scope="row">${escapeHtml(floor.label)}</th><td>${guideContent}</td></tr>`;
      }).join('');
      const floorGuide = floorGuideRows ? `<section class="content-guide-section"><div class="content-heading"><h2>층별 안내</h2></div><div class="portal-table-wrap table-scroll-region" role="region" aria-label="${escapeHtml(terminal.name)} 층별 시설 안내" tabindex="0"><table class="portal-data-table"><caption class="sr-only">${escapeHtml(terminal.name)} 층별 주요 시설</caption><colgroup><col style="width: 18%;"><col style="width: 82%;"></colgroup><thead><tr><th scope="col">구분</th><th scope="col">주요 시설</th></tr></thead><tbody>${floorGuideRows}</tbody></table></div></section>` : '';
      const amenityItems = (terminal.featuredAmenities || []).map((amenity) => `<article class="content-feature-item region-terminal-amenity-item"><div class="content-feature-visual portal-guide-photo"><img src="${escapeHtml(amenity.image)}" alt="${escapeHtml(amenity.imageAlt || `${amenity.name} 예시 이미지`)}" loading="lazy"></div><div class="content-feature-body"><div class="content-feature-summary"><h3 class="content-feature-title">${escapeHtml(amenity.name)}</h3>${amenity.location ? `<span class="region-terminal-amenity-location">위치 ${escapeHtml(amenity.location)}</span>` : ''}</div><div class="content-feature-details"><span>${escapeHtml(amenity.description || '')}</span></div></div></article>`).join('');
      const featuredAmenities = amenityItems ? `<section class="content-guide-section"><div class="content-heading"><h2>주요 편의시설</h2></div><div class="content-feature-list region-terminal-amenity-list">${amenityItems}</div></section>` : '';
      return `${floors}${floorGuide}${featuredAmenities}`;
    });
    return `<section class="template-section"><div class="container"><section class="content-block" aria-labelledby="page-title">
      ${content}
    </section></div></section>`;
  }

  let kakaoMapsSdkPromise = null;
  const terminalMapInstances = new WeakMap();

  function terminalMapUrl(terminal) {
    if (!terminal || !terminal.coords) return '';
    const latitude = Number(terminal.coords.lat);
    const longitude = Number(terminal.coords.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return '';
    return `https://map.kakao.com/link/to/${encodeURIComponent(terminal.name)},${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  }

  function renderTerminalLocationHeading(terminal, headingId, includeMapLink = true) {
    const mapUrl = terminalMapUrl(terminal);
    const mapLink = includeMapLink ? `<a class="btn btn--outline btn--md" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${terminal.name} 카카오맵 길찾기 새 창`)}"${mapUrl ? '' : ' hidden'}>카카오맵에서 보기 <span aria-hidden="true">↗</span></a>` : '';
    return `<div class="content-heading${includeMapLink ? ' content-heading--with-action' : ''}"><div><h2 id="${escapeHtml(headingId)}">${escapeHtml(terminal.name)}</h2><p>${escapeHtml(terminal.address || '')}</p></div>${mapLink}</div>`;
  }

  function renderTerminalOperationInfo(terminal) {
    const contactNumber = terminal.tel?.main || terminal.tel?.ars || '';
    const contactHref = contactNumber.replace(/[^0-9+]/g, '');
    return `<dl class="content-info-panel content-info-panel--outlined region-terminal-introduction-info">
      <div><dt>명칭</dt><dd>${escapeHtml(terminal.name || '정보 준비 중')}</dd></div>
      <div><dt>운영시간</dt><dd>${escapeHtml(terminal.hours || '정보 준비 중')}</dd></div>
      <div><dt>주소</dt><dd>${escapeHtml(terminal.address || '정보 준비 중')}</dd></div>
      <div><dt>대표 전화번호</dt><dd>${contactNumber ? `<a href="tel:${contactHref}">${escapeHtml(contactNumber)}</a>` : '정보 준비 중'}</dd></div>
    </dl>`;
  }

  function renderTerminalMap(terminal) {
    if (!terminal || !terminal.coords) return '';
    const latitudeValue = Number(terminal && terminal.coords && terminal.coords.lat);
    const longitudeValue = Number(terminal && terminal.coords && terminal.coords.lng);
    if (!Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue)) return '';

    const latitude = latitudeValue.toFixed(6);
    const longitude = longitudeValue.toFixed(6);
    const mapName = localize(terminal.name) || '여객선터미널';
    const safeMapName = escapeHtml(mapName);
    return `<section class="region-terminal-map" aria-label="${safeMapName} 위치 지도">
      <div class="region-terminal-map-viewport" data-kakao-map data-map-lat="${latitude}" data-map-lng="${longitude}" data-map-name="${safeMapName}">
        <p class="region-terminal-map-status" role="status">카카오 지도를 불러오는 중입니다.</p>
        <div class="region-terminal-map-canvas" role="region" aria-label="${safeMapName} 위치 지도"></div>
      </div>
    </section>`;
  }

  function renderTerminalAccessGuide(terminal) {
    const routes = Array.isArray(terminal.transit?.routes) ? terminal.transit.routes : [];
    const shipRoutes = Array.isArray(terminal.transit?.shipRoutes) ? terminal.transit.shipRoutes : [];
    const longDistance = Array.isArray(terminal.transit?.longDistance) ? terminal.transit.longDistance : [];
    const sections = [];

    const carIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 11 1.5-5h11l1.5 5"></path><rect x="3" y="10" width="18" height="8" rx="2"></rect><path d="M6 18v3m12-3v3M6.5 14h.01M17.5 14h.01"></path></svg>';
    const trainIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8a3 3 0 0 1 3 3v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a3 3 0 0 1 3-3Z"></path><path d="M7 10h10M8 6h8M8 15h.01M16 15h.01M8 22l3-3m5 3-3-3"></path></svg>';
    const busIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="16" rx="3"></rect><path d="M7 6h10v6H7zM4 9H2v4m18-4h2v4M7 16h.01M17 16h.01M7 22v-3m10 3v-3"></path></svg>';
    const accessIcons = { car: carIcon, train: trainIcon, expressBus: busIcon };

    const renderPendingActions = (actions = []) => actions.map((action) => {
      if (action.url) return `<a class="btn btn--outline btn--md" href="${escapeHtml(action.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(action.label)}</a>`;
      return action.todo ? `<!-- TODO: ${escapeHtml(action.todo)} -->` : '';
    }).join('');

    const renderLongDistanceRoute = (route) => {
      const direction = route.direction || '→';
      const routeLabel = direction === '↔'
        ? `${route.origin} 및 ${route.destination} 왕복`
        : `${route.origin} 출발, ${route.destination} 도착`;
      const meta = [
        route.duration ? `<div><dt>예상 소요</dt><dd>${escapeHtml(route.duration)}</dd></div>` : '',
        route.frequency ? `<div><dt>운행 횟수</dt><dd>${escapeHtml(route.frequency)}</dd></div>` : ''
      ].filter(Boolean).join('');
      return `<article class="region-directions-route"><div class="region-directions-route-heading">${route.badge ? `<span class="content-feature-badge">${escapeHtml(route.badge)}</span>` : ''}<strong class="region-directions-route-title" aria-label="${escapeHtml(routeLabel)}">${escapeHtml(route.origin)} <span aria-hidden="true">${escapeHtml(direction)}</span> ${escapeHtml(route.destination)}</strong></div>${route.line ? `<p class="region-directions-route-line">${escapeHtml(route.line)}</p>` : ''}${meta ? `<dl class="region-directions-route-meta">${meta}</dl>` : ''}</article>`;
    };

    if (longDistance.length) {
      const longDistanceSections = longDistance.map((item) => {
        const renderDetails = (details) => (details || []).map((detail) => `<div class="content-feature-summary"><div class="content-feature-details"><span>${escapeHtml(detail)}</span></div></div>`).join('');
        const details = Array.isArray(item.routes)
          ? `<div class="region-directions-route-list">${item.routes.map(renderLongDistanceRoute).join('')}</div>${renderPendingActions(item.actions)}`
          : Array.isArray(item.services)
          ? item.services.map((service) => `<div class="content-feature-summary"><span class="content-feature-badge">${escapeHtml(service.label)}</span><div class="content-feature-details">${(service.details || []).map((detail) => `<span>${escapeHtml(detail)}</span>`).join('')}</div></div>`).join('')
          : renderDetails(item.details);
        const itemContent = `<article class="content-feature-item"><div class="content-feature-visual" aria-hidden="true"><span class="content-feature-icon">${accessIcons[item.mode] || busIcon}</span></div><div class="content-feature-body">${details}</div></article>`;
        return `<section class="content-guide-section content-guide-section--prominent"><h3>${escapeHtml(item.label)}</h3><div class="content-feature-list region-directions-feature-list">${itemContent}</div></section>`;
      });
      sections.push(...longDistanceSections);
      sections.push(renderPendingActions(terminal.transit?.pendingActions));
      if (terminal.transit?.notice) sections.push(`<p class="content-guide-note region-directions-notice" role="note">${escapeHtml(terminal.transit.notice)}</p>`);
    }

    const transitItems = routes.map((route) => {
      const routeHeading = route.from.includes('버스터미널') ? '버스터미널에서 이용 시' : route.from.includes('역') ? '기차역에서 이용 시' : `${route.from}에서 이용 시`;
      const isTrain = route.from.includes('역');
      const modeLabel = isTrain ? '기차역' : '버스터미널';
      const icon = isTrain ? trainIcon : busIcon;
      return `<article class="content-feature-item"><div class="content-feature-visual"><span class="content-feature-icon" role="img" aria-label="${modeLabel}">${icon}</span></div><div class="content-feature-body"><span class="content-feature-badge">${escapeHtml(routeHeading)}</span><div class="content-feature-summary"><strong class="content-feature-title">${escapeHtml(route.bus)} 버스</strong><div class="content-feature-details"><span>${escapeHtml(route.board)} <b>승차</b></span><i class="content-feature-separator" aria-hidden="true">→</i><span>${escapeHtml(route.alight)} <b>하차</b></span></div></div></div></article>`;
    }).join('');

    if (transitItems) {
      sections.push(`<section class="content-guide-section content-guide-section--prominent"><h3>대중교통 이용</h3><div class="content-feature-list region-directions-feature-list">${transitItems}</div></section>`);
    }
    if (shipRoutes.length) {
      const shipIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14 6 7h12l2 7"></path><path d="M8 7V3h8v4M3 14h18l-2 5H5l-2-5Z"></path><path d="M7 22c1.2 0 1.8-1 3-1s1.8 1 3 1 1.8-1 3-1 1.8 1 3 1"></path></svg>';
      const shipSummaries = shipRoutes.map((route) => `<div class="content-feature-summary"><strong class="content-feature-title">${escapeHtml(route.from)} → ${escapeHtml(route.to)}</strong><div class="content-feature-details"><span>${escapeHtml((route.times || []).join(', '))}</span></div></div>`).join('');
      const shipItem = `<article class="content-feature-item"><div class="content-feature-visual"><span class="content-feature-icon" role="img" aria-label="선박이용">${shipIcon}</span></div><div class="content-feature-body"><span class="content-feature-badge">선박 이용 시</span>${shipSummaries}</div></article>`;
      sections.push(`<section class="content-guide-section content-guide-section--prominent"><h3>선박 이용</h3><div class="content-feature-list region-directions-feature-list">${shipItem}</div></section>`);
    }
    return sections.length ? `<div class="content-guide">${sections.join('')}</div>` : '';
  }

  function renderTerminalDirections(terminalData) {
    const terminals = terminalProfiles(terminalData);
    const primary = terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    if (!primary) return contentSection('directions-content-title', '오시는 길', '터미널 정보를 준비 중입니다.', '');
    const content = renderTerminalTabs('directions', terminals, (terminal) => {
      const terminalHeading = renderTerminalLocationHeading(terminal, `directions-content-title-${terminal.id}`);
      const accessGuide = renderTerminalAccessGuide(terminal);
      return `${renderTerminalMap(terminal)}${terminalHeading}${accessGuide}`;
    });
    return `<section class="template-section"><div class="container"><section class="content-block" aria-labelledby="page-title">
      ${content}
    </section></div></section>`;
  }

  function renderTerminalParking(terminalData) {
    const terminals = terminalProfiles(terminalData);
    const primary = terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    if (!primary) return contentSection('parking-content-title', '주차 안내', '터미널 정보를 준비 중입니다.', '');
    const content = renderTerminalTabs('parking', terminals, (terminal) => {
      const parking = renderParking(terminal.parking);
      return parking
        ? `<div class="content-guide region-terminal-parking-guide">${parking}</div>`
        : '<section class="content-guide-section"><p>주차 안내 정보를 준비 중입니다.</p></section>';
    });
    return `<section class="template-section"><div class="container"><section class="content-block" aria-labelledby="page-title">
      ${content}
    </section></div></section>`;
  }

  function sourceText(scheduleData) {
    return localize(scheduleData?.sourceLabel) || scheduleData?.period || '';
  }

  function viaText(leg) {
    const ports = (leg.via || []).map((stop) => localize(stop.port)).filter(Boolean);
    return ports.join(' → ');
  }

  function renderRoutes(scheduleData) {
    const cards = routes(scheduleData).map((entry, index) => {
      const route = entry.route || {};
      const title = localize(route.group) || localize(route.destination) || `항로 ${index + 1}`;
      const vessel = localize(route.vessel?.name);
      const legs = (route.outbound || []).map((leg) => `<li><time>${escapeHtml(leg.dep || '')}</time><span>${escapeHtml(viaText(leg))}</span></li>`).join('');
      const departurePort = localize(route.departurePort);
      const note = localize(route.note);
      return `<article class="region-page-card region-route-card">
        <span class="region-page-card-index">ROUTE ${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(title)}</h3>
        ${vessel ? `<p class="region-page-card-meta"><strong>선박</strong>${escapeHtml(vessel)}</p>` : ''}
        ${departurePort ? `<p class="region-page-alert"><strong>출항지</strong> ${escapeHtml(departurePort)}</p>` : ''}
        ${legs ? `<ul class="region-route-legs">${legs}</ul>` : ''}
        ${note ? `<p class="region-page-note">${escapeHtml(note)}</p>` : ''}
      </article>`;
    }).join('');
    return contentSection('routes-content-title', '항로 안내', `확인된 ${routes(scheduleData).length}개 운항 항목의 출항시각과 기항지입니다.`, `<div class="region-page-grid region-page-grid--two">${cards}</div>`);
  }

  function renderOperators(terminalData, scheduleData) {
    const operatorDetails = Array.isArray(terminalData?.operatorDetails) ? terminalData.operatorDetails : [];
    if (operatorDetails.length) {
      const sections = operatorDetails.map((operator) => {
        const phone = String(operator.telHref || operator.tel || '').replace(/[^\d+]/g, '');
        const majorRoutes = operator.majorRoute || [...new Set((operator.vessels || []).map((vessel) => vessel.route).filter(Boolean))].join(' · ');
        const ticketOffice = operator.ticketOffice
          ? escapeHtml(operator.ticketOffice)
          : '<span class="region-operator-status">정보 준비 중</span>';
        const homepage = operator.homepage
          ? `<a class="btn btn--md btn--outline" href="${escapeHtml(operator.homepage)}" target="_blank" rel="noopener noreferrer"><svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.7h-6v-6h-5v6h-6z"/></svg><span>선사 홈페이지</span></a>`
          : '';
        return `<article class="region-operator-section">
          <div class="region-operator-profile">
            <div class="region-operator-logo" aria-hidden="true">${operator.logo ? `<img src="${escapeHtml(operator.logo)}" alt="">` : `<span>${escapeHtml(operator.name)}</span>`}</div>
            <div class="region-operator-content">
              <header class="region-operator-heading"><h3>${escapeHtml(operator.name)}</h3>${homepage}</header>
              <ul class="region-operator-details">
                ${majorRoutes ? `<li><strong>주요 항로</strong><span>${escapeHtml(majorRoutes)}</span></li>` : ''}
                <li><strong>매표소 위치</strong><span>${ticketOffice}</span></li>
                <li><strong>TEL</strong><span>${operator.tel ? `<a class="region-operator-phone" href="tel:${phone}" aria-label="${escapeHtml(operator.name)} 전화 ${escapeHtml(operator.tel)}">${escapeHtml(operator.tel)}</a>` : '<span class="region-operator-status">정보 준비 중</span>'}</span></li>
              </ul>
            </div>
          </div>
        </article>`;
      }).join('');
      return contentSection('operators-content-title', '선사 안내', '터미널을 이용하는 선사의 기본 정보와 연락처를 안내합니다.', `<div class="region-operator-list">${sections}</div>`);
    }
    const terminalCarrierData = terminalCarriers(terminalData);
    const items = terminalCarrierData.length ? terminalCarrierData : operators(scheduleData).map((operator) => ({ ...operator, terminals: operator.routes }));
    const cards = items.map((operator) => `<article class="region-page-card">
      <div class="region-page-card-title"><h3>${escapeHtml(operator.name)}</h3></div>
      ${operator.tel ? telephone(operator.tel) : ''}
      <p class="region-page-card-meta"><strong>담당 터미널</strong>${escapeHtml(operator.terminals.join(' · '))}</p>
    </article>`).join('');
    return contentSection('operators-content-title', '선사 안내', '운항 여부와 승선 관련 사항은 출항 전에 해당 선사로 확인하세요.', `<div class="region-page-grid region-page-grid--three">${cards}</div>`);
  }

  function renderVessels(terminalData, scheduleData) {
    const vesselDetails = Array.isArray(terminalData?.vesselDetails) ? terminalData.vesselDetails : [];
    const operatorDetails = Array.isArray(terminalData?.operatorDetails) ? terminalData.operatorDetails : [];
    const operatorVessels = operatorDetails.flatMap((operator) => (operator.vessels || []).map((vessel) => {
      const speed = String(vessel.scale || '').match(/속력\s*(.+)$/)?.[1]?.trim() || '';
      const tonnage = String(vessel.scale || '').match(/총톤수(?:\([^)]*\))?\s*(.+?)(?=,\s*속력|$)/)?.[1]?.trim() || '';
      const ports = Array.isArray(vessel.stops) ? vessel.stops.join(' · ') : (vessel.stops || vessel.ports || '');
      return {
        ...vessel,
        operator: operator.name,
        speed,
        tonnage,
        distance: vessel.distance || '',
        duration: vessel.duration || '',
        ports
      };
    }));
    const detailedVessels = vesselDetails.length ? vesselDetails : operatorVessels;
    const items = detailedVessels.length ? detailedVessels : vessels(scheduleData).map((vessel) => ({
      ...vessel,
      route: vessel.routes.join(' · '),
      operator: '',
      type: '',
      speed: '',
      distance: '',
      duration: '',
      ports: ''
    }));
    const pairedValue = (primary, secondary, primaryClass = '') => {
      if (!primary && !secondary) return '<span class="region-vessel-value"><span class="region-vessel-status">정보 준비 중</span></span>';
      return `<span class="region-vessel-value">${primary ? `<${primaryClass ? `strong class="${primaryClass}"` : 'span'}>${escapeHtml(String(primary))}</${primaryClass ? 'strong' : 'span'}>` : ''}${secondary ? `<span class="region-vessel-subtext">${escapeHtml(String(secondary))}</span>` : ''}</span>`;
    };
    const multilineValue = (value) => {
      if (!value) return '<span class="region-vessel-value"><span class="region-vessel-status">정보 준비 중</span></span>';
      const lines = String(value).split(/\s+·\s+(?=[①②③④⑤⑥⑦⑧⑨⑩])/).filter(Boolean);
      if (lines.length === 1) return pairedValue(value, '');
      return `<span class="region-vessel-value region-vessel-value--multiline">${lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</span>`;
    };
    const infoIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5"></path><path d="M12 8h.01"></path></svg>';
    const vesselSpecTooltip = (vessel, index) => {
      const specs = [
        ['속력', vessel.speed],
        ['총톤수', vessel.tonnage],
        ['정원', vessel.capacity],
        ['항로거리', vessel.distance]
      ].filter(([, value]) => value);
      const specId = `region-vessel-spec-${index}`;
      return specs.length ? `<span class="region-vessel-spec"><button class="region-vessel-spec-trigger" type="button" aria-label="${escapeHtml(String(vessel.name))} 제원 정보 보기" aria-describedby="${specId}">${infoIcon}</button><span id="${specId}" class="region-vessel-spec-tooltip" role="tooltip"><dl>${specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join('')}</dl></span></span>` : '';
    };
    const vesselTypeDetails = (vessel, index) => {
      return `<span class="region-vessel-value region-vessel-value--type"><span class="region-vessel-type-line"><span>${vessel.type ? escapeHtml(String(vessel.type)) : '정보 준비 중'}</span>${vesselSpecTooltip(vessel, index)}</span></span>`;
    };
    const vesselRouteValue = (vessel, index) => {
      const stops = vessel.ports || vessel.stops;
      if (!stops) return pairedValue(vessel.route, '');
      const stopLines = String(stops).split(/\s+·\s+(?=[①②③④⑤⑥⑦⑧⑨⑩])/).filter(Boolean);
      const durationLines = vessel.duration ? String(vessel.duration).split(/\s+·\s+(?=[①②③④⑤⑥⑦⑧⑨⑩])/).filter(Boolean) : [];
      const cleanDuration = (value) => String(value || '').replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '');
      const tooltipId = `region-vessel-route-${index}`;
      const tooltipRows = stopLines.map((line, lineIndex) => {
        const duration = cleanDuration(durationLines[lineIndex] || (durationLines.length === 1 ? durationLines[0] : ''));
        return `<span class="region-vessel-route-stop"><span>${escapeHtml(line)}</span>${duration ? `<span class="region-vessel-route-duration">(${escapeHtml(duration)})</span>` : ''}</span>`;
      }).join('');
      return `<span class="region-vessel-route"><button class="region-vessel-route-trigger" type="button" aria-label="${escapeHtml(String(vessel.name))} 기항지 보기" aria-describedby="${tooltipId}"><span>${escapeHtml(String(vessel.route))}</span>${infoIcon}</button><span id="${tooltipId}" class="region-vessel-route-tooltip" role="tooltip">${tooltipRows}</span></span>`;
    };
    const rows = items.map((vessel, index) => `<tr data-vessel-row>
      <td data-label="사진"><div class="region-vessel-identity">${vessel.image ? `<button class="region-vessel-photo-trigger" type="button" aria-label="${escapeHtml(String(vessel.name))} 선박 사진 크게 보기"><img class="region-vessel-photo" src="${escapeHtml(String(vessel.image))}" alt="${escapeHtml(String(vessel.name))} 선박 사진"><span class="region-vessel-photo-preview" aria-hidden="true"><img src="${escapeHtml(String(vessel.image))}" alt=""><span>${escapeHtml(String(vessel.name))}</span></span></button>` : '<span class="region-vessel-status">사진 준비 중</span>'}</div></td>
      <td data-label="선명" class="region-vessel-cell--primary">${pairedValue(vessel.name, '', 'region-vessel-name')}</td>
      <td data-label="선사명">${vessel.operator ? escapeHtml(String(vessel.operator)) : '정보 준비 중'}</td>
      <td data-label="항로" class="region-vessel-cell--emphasis">${vesselRouteValue(vessel, index)}</td>
      <td data-label="선종" class="region-vessel-cell--details">${vesselTypeDetails(vessel, index)}</td>
      <td data-label="정원">${vessel.capacity ? escapeHtml(String(vessel.capacity)) : '정보 준비 중'}</td>
    </tr>`).join('');
    const table = `<div class="region-vessel-table-wrap table-scroll-region" role="region" aria-label="선박 안내표" tabindex="0"><table class="portal-data-table region-vessel-table mobile-table--stacked">
      <caption class="sr-only">목포항 여객선 선박 안내</caption>
      <colgroup><col class="region-vessel-col-photo"><col class="region-vessel-col-name"><col class="region-vessel-col-operator"><col class="region-vessel-col-route"><col class="region-vessel-col-type"><col class="region-vessel-col-capacity"></colgroup>
      <thead><tr><th scope="col">사진</th><th scope="col">선명</th><th scope="col">선사명</th><th scope="col">항로</th><th scope="col">선종</th><th scope="col">정원</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
    return contentSection('vessels-content-title', '선박 안내', '2026년도 목포지역 항로별 취항 선박 현황을 선명 기준으로 안내합니다.', table);
  }

  function renderVehicleShipping(terminalData) {
    const contacts = (terminalData.cargoContacts || []).map((contact) => `<article class="region-page-card"><h3>${escapeHtml(localize(contact.route))}</h3><p class="region-page-card-meta"><strong>화물·차량선적 문의</strong>${escapeHtml(localize(contact.name))}</p>${telephone(contact.tel)}</article>`).join('');
    return contentSection('vehicle-shipping-content-title', '차량 선적', '확인된 연락처를 먼저 제공합니다.', `<div class="region-page-grid region-page-grid--two">${contacts}</div><div class="region-page-inline-preparing"><strong>절차·요금은 준비 중입니다.</strong><p>차량 선적 가능 여부와 접수 조건은 해당 업체에 사전 문의해 주세요.</p></div>`);
  }

  function renderContacts(terminalData, scheduleData) {
    const terminalCarrierData = terminalCarriers(terminalData);
    const contactOperators = terminalCarrierData.length ? terminalCarrierData : operators(scheduleData).map((operator) => ({ ...operator, terminals: operator.routes }));
    const operatorCards = contactOperators.map((operator) => `<li><span><strong>${escapeHtml(operator.name)}</strong>${escapeHtml(operator.terminals.join(' · '))}</span>${telephone(operator.tel)}</li>`).join('');
    const cargoCards = (terminalData.cargoContacts || []).map((contact) => `<li><span><strong>${escapeHtml(localize(contact.name))}</strong>${escapeHtml(localize(contact.route))}</span>${telephone(contact.tel)}</li>`).join('');
    return contentSection('contacts-content-title', '문의처', `${localize(terminalData.name)} 대표번호는 미확보 상태이며, 전국 안내와 확인된 업체 연락처를 제공합니다.`, `
      <div class="region-page-grid region-page-grid--two"><article class="region-page-national-contact"><span>목포 운항정보 ARS</span>${telephone('1666-0910')}</article><article class="region-page-national-contact"><span>전국여객선운항안내</span>${telephone(nationalTel)}</article></div>
      <div class="region-page-contact-groups"><article><h3>선사 연락처</h3><ul>${operatorCards}</ul></article>${cargoCards ? `<article><h3>화물·차량선적 문의</h3><ul>${cargoCards}</ul></article>` : ''}</div>`);
  }

  function renderGenericPage(page, record) {
    const sections = record.sections.map((section) => {
      const items = Array.isArray(section.items) ? section.items.map((item) => `<li>${item.label ? `<strong>${escapeHtml(localize(item.label))}</strong>` : ''}<span>${escapeHtml(localize(item.value) || localize(item))}</span></li>`).join('') : '';
      const contacts = Array.isArray(section.contacts) ? section.contacts.map((contact) => `<li><span><strong>${escapeHtml(localize(contact.name))}</strong>${contact.description ? escapeHtml(localize(contact.description)) : ''}</span>${contact.tel ? telephone(contact.tel) : ''}</li>`).join('') : '';
      return `<article class="region-page-card"><h3>${escapeHtml(localize(section.title))}</h3>${section.description ? `<p>${escapeHtml(localize(section.description))}</p>` : ''}${items ? `<ul class="region-page-data-list">${items}</ul>` : ''}${contacts ? `<ul class="region-page-data-list region-page-data-list--contacts">${contacts}</ul>` : ''}${section.note ? `<p class="region-page-note">${escapeHtml(localize(section.note))}</p>` : ''}</article>`;
    }).join('');
    return contentSection(`${page.page}-content-title`, page.label, localize(record.description), `<div class="region-page-grid region-page-grid--two">${sections}</div>`);
  }

  function renderPreparing(page) {
    return contentSection('region-page-preparing-title', `${page.label}는 준비 중입니다`, '검증된 자료가 확보되는 대로 안내하겠습니다. 운항과 예매 관련 사항은 아래 공식 안내를 이용해 주세요.', `
      <strong class="region-page-preparing-label">준비 중</strong>
      <div class="region-guide-actions"><a class="btn btn--outline" href="tel:${nationalTel.replace(/-/g, '')}">전국여객선운항안내 ${nationalTel}</a><a class="btn btn--outline" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">KSA 여객선 예매 <span aria-hidden="true">↗</span></a></div>
    `, 'region-page-preparing');
  }

  function renderBreadcrumb(pageKey, terminalData, scheduleData) {
    const paths = createPaths(terminalData.regionId);
    const groups = window.REGION_MENU || [];
    const currentPage = definition(pageKey);
    const currentGroup = groups.find((group) => group.id === currentPage?.groupId);
    const regions = (window.PORTAL_REGION_REGISTRY || []).filter((region) => region.hasPage && region.folder);
    const hrefForPage = (item) => item.external ? paths.portal(item.href) : paths.regionPage(item.href);
    const availableChildren = (group) => (group.pages || group.children).filter((item) => item.external || getPageState(item.page, terminalData, scheduleData) !== 'preparing');
    const regionItems = regions.map((region) => `<li><a class="${region.key === terminalData.regionId ? 'active' : ''}" href="${paths.region(region.folder)}"${region.key === terminalData.regionId ? ' aria-current="page"' : ''}>${escapeHtml(region.gnbLabelKo || region.nameKo)}</a></li>`).join('');
    const groupItems = groups.map((group) => {
      const first = availableChildren(group)[0];
      if (!first) return '';
      const current = group.id === currentGroup?.id;
      return `<li><a class="${current ? 'active' : ''}" href="${escapeHtml(hrefForPage(first))}"${current ? ' aria-current="page"' : ''}>${escapeHtml(group.label)}</a></li>`;
    }).join('');
    const pageItems = availableChildren(currentGroup || { children: [] }).map((item) => {
      const current = item.page === pageKey;
      return `<li><a class="${current ? 'active' : ''}" href="${escapeHtml(hrefForPage(item))}"${current ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`;
    }).join('');
    const terminalPage = Boolean(currentGroup?.terminalDirectory);
    const terminals = terminalProfiles(terminalData);
    const requestedTerminalId = decodeURIComponent(window.location?.hash?.slice(1) || '');
    const selectedTerminal = terminals.find((terminal) => terminal.id === requestedTerminalId) || terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    const terminalItems = terminalPage ? terminals.map((terminal) => {
      const current = terminal.id === selectedTerminal?.id;
      return `<li><a class="${current ? 'active' : ''}" href="${escapeHtml(`${currentPage.href}#${terminal.id}`)}" data-breadcrumb-terminal-link="${escapeHtml(terminal.id)}"${current ? ' aria-current="page"' : ''}>${escapeHtml(terminal.shortName || terminal.name)}</a></li>`;
    }).join('') : '';
    const dropdown = (id, label, items, className = '', labelAttribute = '') => `<div class="breadcrumb-dropdown${className ? ` ${className}` : ''}">
      <button class="breadcrumb-trigger" type="button" aria-expanded="false" aria-controls="${id}"><span${labelAttribute}>${escapeHtml(label)}</span><i aria-hidden="true"></i></button>
      <ul class="breadcrumb-menu" id="${id}" hidden>${items}</ul>
    </div>`;

    return `<nav class="breadcrumb subnav-breadcrumb" aria-label="현재 위치">
      <a class="breadcrumb-home" href="${paths.portal()}" aria-label="홈"><svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.7h-6v-6h-5v6h-6z"/></svg></a>
      <span class="breadcrumb-separator region-breadcrumb-terminal" aria-hidden="true"></span>
      ${dropdown('region-breadcrumb-terminal-menu', localize(terminalData.name), regionItems, 'region-breadcrumb-terminal')}
      <span class="breadcrumb-separator" aria-hidden="true"></span>
      ${dropdown('region-breadcrumb-group-menu', currentPage.groupLabel, groupItems)}
      ${terminalPage && selectedTerminal ? `<span class="breadcrumb-separator" aria-hidden="true"></span>
      ${dropdown('region-breadcrumb-selected-terminal-menu', selectedTerminal.shortName || selectedTerminal.name, terminalItems, 'region-breadcrumb-selected-terminal', ' data-breadcrumb-terminal-name')}` : ''}
      ${terminalPage ? '' : `<span class="breadcrumb-separator" aria-hidden="true"></span>
      ${dropdown('region-breadcrumb-page-menu', currentPage.label, pageItems)}`}
    </nav>`;
  }

  function renderContent(pageKey, terminalData, scheduleData) {
    const sharedContent = window.PORTAL_SUBPAGE_DATA?.content;
    if (typeof sharedContent === 'string' && sharedContent.trim()) {
      return `<section class="template-section"><div class="container">${sharedContent}</div></section>`;
    }
    if (getPageState(pageKey, terminalData, scheduleData) === 'preparing') return renderPreparing(definition(pageKey));
    if (pageKey === 'terminal-introduction') return renderTerminalIntroduction(terminalData);
    if (pageKey === 'facilities') return renderTerminalFacilities(terminalData);
    if (pageKey === 'directions') return renderTerminalDirections(terminalData);
    if (pageKey === 'parking') return renderTerminalParking(terminalData);
    if (pageKey === 'timetable') return `<section class="template-section"><div class="container"><section class="content-block region-section region-schedule-section region-page-schedule" id="schedule" aria-labelledby="schedule-title"></section></div></section>`;
    if (pageKey === 'routes') return renderRoutes(scheduleData);
    if (pageKey === 'operators') return renderOperators(terminalData, scheduleData);
    if (pageKey === 'vessels') return renderVessels(terminalData, scheduleData);
    if (pageKey === 'vehicle-shipping') return renderVehicleShipping(terminalData);
    if (pageKey === 'contacts') return renderContacts(terminalData, scheduleData);
    const record = pageRecord(pageKey, terminalData, scheduleData);
    return record ? renderGenericPage(definition(pageKey), record) : renderPreparing(definition(pageKey));
  }

  function renderMain({ pageKey, terminalData, scheduleData }) {
    const page = definition(pageKey);
    if (!page) throw new Error(`REGION_MENU에서 ${pageKey} 페이지를 찾을 수 없습니다.`);
    const terminalName = localize(terminalData.name);
    const status = getPageState(pageKey, terminalData, scheduleData);
    const source = sourceText(scheduleData);
    const terminalPage = page.groupId === 'terminal';
    const terminals = terminalPage ? terminalProfiles(terminalData) : [];
    const requestedTerminalId = decodeURIComponent(window.location?.hash?.slice(1) || '');
    const selectedTerminal = terminals.find((terminal) => terminal.id === requestedTerminalId) || terminals.find((terminal) => terminal.isPrimary) || terminals[0];
    const heroTitle = selectedTerminal?.name || page.label;
    document.title = `${page.label} | ${terminalName}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${terminalName} ${page.label} 안내${pageKey === 'timetable' && source ? ` (${source})` : ''}`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = document.title;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = description?.content || '';

    return `<main id="main" class="region-subpage-main">
      <div class="subnav-bar"><div class="container">${renderBreadcrumb(pageKey, terminalData, scheduleData)}</div></div>
      <section class="subhero" aria-labelledby="page-title"><div class="container"><div class="subhero-title"><h1 id="page-title"${terminalPage ? ' data-terminal-page-title' : ''}>${escapeHtml(heroTitle)}</h1>${status === 'partial' ? '<span class="region-page-status">일부 정보 제공</span>' : ''}</div></div></section>
      ${renderContent(pageKey, terminalData, scheduleData)}
    </main>`;
  }

  function createKakaoTerminalMap(viewport, maps) {
    if (!viewport || terminalMapInstances.has(viewport) || !maps || !maps.Map) return;

    const latitude = Number(viewport.dataset.mapLat);
    const longitude = Number(viewport.dataset.mapLng);
    const mapName = viewport.dataset.mapName || '';
    const canvas = viewport.querySelector('.region-terminal-map-canvas');
    if (!canvas || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    const center = new maps.LatLng(latitude, longitude);
    const map = new maps.Map(canvas, { center, level: 3 });
    const zoomControl = new maps.ZoomControl();
    map.addControl(zoomControl, maps.ControlPosition.RIGHT);
    const marker = new maps.Marker({ map, position: center, title: mapName });
    const infoWindow = new maps.InfoWindow({
      position: center,
      content: `<div class="region-terminal-map-info"><strong>${escapeHtml(mapName)}</strong></div>`
    });
    infoWindow.open(map, marker);

    terminalMapInstances.set(viewport, { map, center, marker, infoWindow });
    viewport.classList.add('is-kakao-map-ready');
  }

  function refreshKakaoTerminalMap(viewport) {
    const instance = viewport && terminalMapInstances.get(viewport);
    if (!instance) return;
    instance.map.relayout();
    instance.map.setCenter(instance.center);
    instance.infoWindow.close();
    instance.infoWindow.open(instance.map, instance.marker);
  }

  function loadKakaoMapsSdk() {
    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) return Promise.resolve(window.kakao.maps);
    if (kakaoMapsSdkPromise) return kakaoMapsSdkPromise;

    const key = String((window.KSA_MAP_CONFIG && window.KSA_MAP_CONFIG.kakaoJavaScriptKey) || '').trim();
    if (!document.head || !document.createElement) return Promise.resolve(null);

    if (!key) return Promise.resolve(null);

    kakaoMapsSdkPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
      script.onload = () => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.load) {
          resolve(null);
          return;
        }
        window.kakao.maps.load(() => resolve(window.kakao.maps));
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
    return kakaoMapsSdkPromise;
  }

  function initializeTerminalMaps() {
    const viewports = Array.from(document.querySelectorAll('[data-kakao-map]'));
    if (!viewports.length) return;

    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      viewports.forEach((viewport) => createKakaoTerminalMap(viewport, window.kakao.maps));
      return;
    }

    loadKakaoMapsSdk().then((maps) => {
      if (!maps) {
        viewports.forEach((viewport) => {
          const status = viewport.querySelector('.region-terminal-map-status');
          if (status) status.textContent = '지도를 불러오지 못했습니다. 카카오맵에서 위치를 확인해 주세요.';
          viewport.classList.add('is-kakao-map-error');
        });
        return;
      }
      viewports.forEach((viewport) => createKakaoTerminalMap(viewport, maps));
    });
  }

  function initializePhotoSliders() {
    document.querySelectorAll('[data-terminal-photo-slider]').forEach((slider) => {
      const slides = [...slider.querySelectorAll('[data-photo-slide]')];
      if (slides.length < 2) return;
      const previousButton = slider.querySelector('[data-photo-prev]');
      const nextButton = slider.querySelector('[data-photo-next]');
      const status = slider.querySelector('[data-photo-status]');
      let currentIndex = 0;
      const show = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== currentIndex; });
        if (status) status.textContent = `${currentIndex + 1} / ${slides.length}`;
      };
      if (previousButton) previousButton.addEventListener('click', () => show(currentIndex - 1));
      if (nextButton) nextButton.addEventListener('click', () => show(currentIndex + 1));
      show(0);
    });
  }

  function initializeFloorBrowsers() {
    document.querySelectorAll('[data-terminal-floor-browser]').forEach((browser) => {
      const tabs = [...browser.querySelectorAll('[role="tab"][data-floor-tab]')];
      const panels = [...browser.querySelectorAll('[data-floor-panel]')];
      if (!tabs.length) return;
      const activate = (tab) => {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => { panel.hidden = panel.dataset.floorPanel !== tab.dataset.floorTab; });
      };
      activate(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (event) => {
          if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : ['ArrowDown', 'ArrowRight'].includes(event.key) ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
          tabs[nextIndex].focus();
          activate(tabs[nextIndex]);
        });
      });
    });
  }

  function initialize() {
    initializeTerminalMaps();
    initializePhotoSliders();
    initializeFloorBrowsers();
    document.querySelectorAll('.tab-list[data-terminal-section-tabs]').forEach((tablist) => {
      const panels = [...document.querySelectorAll('[data-terminal-panel]')];
      const links = [...tablist.querySelectorAll('[data-terminal-section-link]')];
      if (!panels.length || !links.length) return;
      const activate = (terminalId) => {
        panels.forEach((panel) => { panel.hidden = panel.dataset.terminalPanel !== terminalId; });
        const activePanel = panels.find((panel) => panel.dataset.terminalPanel === terminalId);
        if (!activePanel) return;
        refreshKakaoTerminalMap(activePanel && activePanel.querySelector('[data-kakao-map]'));
        links.forEach((link) => { link.href = `${link.dataset.pageHref}#${terminalId}`; });
        tablist.setAttribute('aria-label', `${activePanel.dataset.terminalShortName || activePanel.dataset.terminalName || ''} 안내 메뉴`);
        const breadcrumbName = document.querySelector('[data-breadcrumb-terminal-name]');
        if (breadcrumbName) breadcrumbName.textContent = activePanel.dataset.terminalShortName || activePanel.dataset.terminalName || '';
        const pageTitle = document.querySelector('[data-terminal-page-title]');
        if (pageTitle) pageTitle.textContent = activePanel.dataset.terminalName || '';
        document.querySelectorAll('[data-breadcrumb-terminal-link]').forEach((link) => {
          const current = link.dataset.breadcrumbTerminalLink === terminalId;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      };
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      activate(panels.some((panel) => panel.dataset.terminalPanel === hashId) ? hashId : panels.find((panel) => !panel.hidden)?.dataset.terminalPanel || panels[0].dataset.terminalPanel);
      window.addEventListener('hashchange', () => {
        const nextId = decodeURIComponent(window.location.hash.slice(1));
        if (panels.some((panel) => panel.dataset.terminalPanel === nextId)) activate(nextId);
      });
    });
  }

  window.RegionPage = { definition, getPageState, renderMain, initialize, operators, vessels };
}());
