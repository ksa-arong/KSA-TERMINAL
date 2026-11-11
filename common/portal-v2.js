(function definePortalV2() {
  'use strict';

  const paths = window.KsaPathResolver.create({ location: 'portal-root' });

  const regionImages = Object.freeze({
    incheon: 'common/images/portal-hero-island-harbor-wide.png',
    boryeong: 'common/images/portal-hero-island-v3.png',
    gunsan: 'common/images/portal-hero-island-harbor-wide.png',
    mokpo: 'common/images/portal-hero-mokpo-coastal-aerial.png',
    busan: 'common/images/portal-hero-pohang-international-v2.jpg',
    yeosu: 'common/images/portal-hero-seogwipo-gangjeong-color-v2.jpg',
    wando: 'common/images/portal-hero-hongdo-coastal.jpg',
    jeju: 'common/images/portal-hero-jeju-coastal-wide.png',
    tongyeong: 'common/images/portal-hero-island-harbor-wide.png',
    pohang: 'common/images/portal-hero-pohang-international-v2.jpg',
    donghae: 'common/images/portal-hero-pohang-international.jpg'
  });

  const weatherAreaFallbacks = Object.freeze({
    incheon: 'boryeong',
    busan: 'tongyeong'
  });
  const weatherStatusLabels = Object.freeze({
    success: '운항 정상',
    warning: '운항 주의',
    danger: '운항 통제'
  });
  const terminalWeatherConditions = Object.freeze([
    '맑음',
    '구름 조금',
    '구름 많음',
    '흐림',
    '흐리고 한때 비',
    '이슬비',
    '소나기',
    '안개',
    '연무',
    '황사',
    '눈'
  ]);
  const terminalTypeLabels = Object.freeze({
    coastal: '연안',
    international: '국제',
    ulleungDodong: '도동',
    ulleungSadong: '사동',
    ulleungJeodong: '저동',
    samcheonpo: '삼천포신항',
    seogwipo: '서귀포',
    jindo: '진도항',
    ttangkkeut: '땅끝항',
    expo: '엑스포',
    nokdong: '녹동신항',
    narodo: '나로도',
    geomundo: '거문도',
    yeongdoCruise: '영도 크루즈',
    heuksando: '흑산도항',
    hongdo: '홍도항',
    sokcho: '속초항',
    ocheon: '오천항'
  });
  const terminalTypeOrders = Object.freeze({
    pohang: ['coastal', 'international', 'ulleungDodong', 'ulleungSadong', 'ulleungJeodong'],
    tongyeong: ['coastal', 'international', 'samcheonpo'],
    jeju: ['coastal', 'international', 'seogwipo'],
    incheon: ['coastal', 'international'],
    wando: ['coastal', 'international', 'jindo', 'ttangkkeut'],
    yeosu: ['coastal', 'international', 'expo', 'nokdong', 'narodo', 'geomundo'],
    busan: ['coastal', 'international', 'yeongdoCruise'],
    mokpo: ['coastal', 'international', 'heuksando', 'hongdo'],
    donghae: ['coastal', 'international', 'sokcho'],
    boryeong: ['coastal', 'international', 'ocheon'],
    gunsan: ['coastal', 'international']
  });
  const indexMapTerminalPositions = Object.freeze({
    incheon: { coastal: [33.1, 49.3], international: [34.1, 52.7] },
    boryeong: { coastal: [41.5, 65.6], ocheon: [42.4, 60.6] },
    gunsan: { coastal: [40, 52], international: [35.3, 53] },
    mokpo: { coastal: [57.6, 67.4], international: [57.9, 63.8], heuksando: [44.5, 67.4], hongdo: [30.2, 69] },
    wando: { coastal: [32, 60], international: [61, 43], jindo: [8, 60], ttangkkeut: [29, 60] },
    yeosu: { coastal: [42, 52], international: [72, 31], expo: [32, 36], nokdong: [50, 50], narodo: [68, 62], geomundo: [43, 75] },
    tongyeong: { coastal: [52.4, 59.2], international: [70, 38], samcheonpo: [30.7, 54.4] },
    busan: { coastal: [52.7, 64.3], international: [54.8, 63.4], yeongdoCruise: [61.9, 66.1] },
    pohang: { coastal: [42, 75], international: [47, 71], ulleungDodong: [78, 13], ulleungSadong: [77, 14], ulleungJeodong: [79, 12] },
    donghae: { coastal: [59.2, 40.6], international: [62.6, 42.7], sokcho: [36.5, 18.9] },
    jeju: { coastal: [40, 75], international: [47, 73], seogwipo: [48, 85] }
  });
  const heroImageRequestIds = new WeakMap();
  const koreaMapBounds = Object.freeze({
    minX: 746111.0313,
    minY: 1458603.1919,
    maxX: 1387949.157,
    maxY: 2068443.9535,
    width: 720,
    height: 684,
    padding: 16
  });

  function localize(value) {
    if (typeof value === 'string') return value;
    return value?.ko || value?.en || '';
  }

  function formatTerminalDisplayName(regionName = '', terminalName = '') {
    const normalizedRegionName = regionName.trim();
    const normalizedTerminalName = terminalName.trim();
    if (!normalizedRegionName || !normalizedTerminalName || normalizedTerminalName.includes(normalizedRegionName)) {
      return normalizedTerminalName;
    }
    return `${normalizedRegionName} ${normalizedTerminalName}`;
  }

  function resolveWeatherIcon(condition = '') {
    const normalizedCondition = String(condition).trim().toLocaleLowerCase('ko-KR');
    const iconName = [
      { keywords: ['뇌우', '천둥', '번개'], name: 'extreme-thunderstorms' },
      { keywords: ['흐리고 한때 비', '흐리고 비', '흐림 후 비'], name: 'overcast-rain' },
      { keywords: ['진눈깨비'], name: 'sleet' },
      { keywords: ['우박'], name: 'hail' },
      { keywords: ['눈'], name: 'snow' },
      { keywords: ['이슬비'], name: 'drizzle' },
      { keywords: ['비', '소나기'], name: 'rain' },
      { keywords: ['안개'], name: 'fog-day' },
      { keywords: ['박무', '연무'], name: 'haze-day' },
      { keywords: ['황사'], name: 'dust-day' },
      { keywords: ['구름 조금'], name: 'partly-cloudy-day' },
      { keywords: ['구름 많음'], name: 'cloudy' },
      { keywords: ['흐림', '흐린'], name: 'overcast' },
      { keywords: ['구름'], name: 'cloudy' },
      { keywords: ['맑음', '맑아'], name: 'clear-day' }
    ].find(({ keywords }) => keywords.some((keyword) => normalizedCondition.includes(keyword)))?.name || 'cloudy';

    return `common/images/weather/${iconName}.svg`;
  }

  function formatRouteDuration(value = '') {
    const normalizedValue = String(value).trim();
    const match = normalizedValue.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return normalizedValue;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    return [hours ? `${hours}시간` : '', minutes ? `${minutes}분` : ''].filter(Boolean).join(' ');
  }

  function formatRouteFrequency(value = '') {
    const normalizedValue = String(value).trim();
    if (!normalizedValue) return '운항 일정 확인';
    if (normalizedValue.includes('운항')) return normalizedValue;
    if (normalizedValue.includes('1일')) return `${normalizedValue} 운항`;
    return `1일 ${normalizedValue} 운항`;
  }

  function buildSelectedRouteView(route = {}) {
    const segments = String(route.name || '').split(/→|↔/).map((segment) => segment.trim()).filter(Boolean);
    return {
      origin: segments.length > 1 ? segments[0] : '',
      destination: segments.length > 1 ? segments[segments.length - 1] : String(route.name || ''),
      duration: formatRouteDuration(route.duration),
      operationHref: 'schedule/operation.html',
      bookingHref: 'https://island.theksa.co.kr/'
    };
  }

  function getDefaultRoute(routes = [], regionId = '') {
    return routes.find((route) => regionId === 'jeju' && route.destination === '완도') || routes[0];
  }

  function applySelectedRouteView(root, route = {}, regionId = '') {
    if (!root) return;
    const view = buildSelectedRouteView(route);
    const summary = root.querySelector?.('.portal-v2-summary') || root;
    const panel = root.querySelector?.('[data-v2-selected-route]');
    if (!panel || !view.origin || !view.destination) return;
    const setText = (selector, value) => {
      const element = root.querySelector?.(selector);
      if (element) element.textContent = value;
    };
    const operationLink = root.querySelector?.('[data-v2-selected-route-operation]');
    const bookingLink = root.querySelector?.('[data-v2-selected-route-booking]');
    setText('[data-v2-selected-route-origin]', view.origin);
    setText('[data-v2-selected-route-destination]', view.destination);
    setText('[data-v2-selected-route-duration]', view.duration || '운항정보 확인');
    if (operationLink) operationLink.href = view.operationHref;
    if (bookingLink) bookingLink.href = view.bookingHref;
    panel.dataset.regionId = regionId;
    panel.style?.setProperty('--portal-v2-selected-route-image', `url("${regionImages[regionId] || regionImages.jeju}")`);
    panel.hidden = false;
    summary.classList?.add('is-route-selected');
    root.querySelectorAll?.('[data-v2-route-name]').forEach((control) => {
      const selected = control.dataset.routeName === route.name;
      control.classList?.toggle('is-selected', selected);
      control.setAttribute?.('aria-pressed', String(selected));
    });
  }

  function resetSelectedRouteView(root) {
    if (!root) return;
    const summary = root.querySelector?.('.portal-v2-summary') || root;
    const panel = root.querySelector?.('[data-v2-selected-route]');
    if (panel) panel.hidden = true;
    summary.classList?.remove('is-route-selected');
    root.querySelectorAll?.('[data-v2-route-name]').forEach((control) => {
      control.classList?.remove?.('is-selected');
      control.setAttribute?.('aria-pressed', 'false');
    });
  }

  function toggleSelectedRouteView(root, route = {}, regionId = '') {
    if (!root) return;
    applySelectedRouteView(root, route, regionId);
  }

  function buildWeatherView(regionId, weatherData = {}, routeIndex = 0) {
    const areas = weatherData.areas || [];
    const fallbackAreaId = weatherAreaFallbacks[regionId];
    const area = areas.find((item) => item.id === regionId)
      || areas.find((item) => item.id === fallbackAreaId);
    const routes = area?.routes || [];
    const route = routes.length ? routes[routeIndex % routes.length] : null;
    const routeCycle = routes.length ? Math.floor(routeIndex / routes.length) : 0;
    const currentForecast = route?.forecast?.[0];
    const visibility = route?.observation?.visibility;
    const advisory = route?.advisories?.[0];

    if (!route) return null;
    const baseCondition = routes[0]?.forecast?.[0]?.condition;
    const baseConditionIndex = terminalWeatherConditions.indexOf(baseCondition);
    const conditionStartIndex = baseConditionIndex < 0 ? 0 : baseConditionIndex;
    const condition = terminalWeatherConditions[
      (conditionStartIndex + routeIndex) % terminalWeatherConditions.length
    ];
    const direction = route.current?.direction || '-';
    const vary = (value, adjustment) => {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) return '-';
      return Math.round((numericValue + adjustment * routeCycle) * 10) / 10;
    };
    const temperature = vary(route.current?.temperature, 0.4);
    const wind = vary(route.current?.wind, 0.6);
    const waveMin = vary(currentForecast?.waveMin, 0.2);
    const waveMax = vary(currentForecast?.waveMax, 0.2);
    const variedVisibility = Number.isFinite(visibility)
      ? Math.max(1000, visibility - routeCycle * 1000)
      : null;
    const windSpeed = `${wind}m/s`;
    return {
      area: route.label || area.label || '',
      condition,
      temperature: `${temperature}℃`,
      direction,
      windSpeed,
      wind: `${direction} ${windSpeed}`,
      wave: `${waveMin}~${waveMax}m`,
      visibility: Number.isFinite(variedVisibility) ? `${variedVisibility / 1000}km` : '-',
      statusLevel: route.status?.level || 'success',
      statusLabel: weatherStatusLabels[route.status?.level] || '운항 확인',
      ...(advisory ? {
        advisory: {
          level: advisory.level || 'warning',
          title: advisory.title || '기상특보',
          area: advisory.area || route.label || area.label || '',
          message: advisory.note || ''
        }
      } : {}),
      updatedAt: weatherData.updatedAt || ''
    };
  }

  function buildRegionView(regionId, portalData = {}, registry = [], weatherData = {}) {
    const region = portalData.regions?.[regionId] || {};
    const definition = registry.find((item) => item.key === regionId) || {};
    const terminal = region.terminals?.[0] || {};
    const regionName = localize(region.label) || definition.portalLabelKo || definition.nameKo || '';
    const folder = terminal.folder || definition.folder;
    const terminalOrder = terminalTypeOrders[regionId] || [];
    const mapTerminals = (region.terminals || []).map((item) => ({
      id: item.id || item.type || '',
      type: item.type || '',
      name: localize(item.name),
      description: localize(item.description) || localize(item.hoursNote),
      address: localize(item.address),
      phone: item.phone || region.phone || '1544-1114',
      coords: item.coords,
      href: (item.folder || definition.folder) ? paths.region(item.folder || definition.folder) : paths.portal('terminal/map.html'),
      routes: (item.routes || []).map((route) => localize(route.name)).filter(Boolean).slice(0, 3),
      routeDetails: (item.routes || []).map((route) => ({
        name: localize(route.name),
        duration: localize(route.duration),
        frequency: localize(route.frequency)
      })).filter((route) => route.name).slice(0, 3)
    })).sort((a, b) => {
      const aIndex = terminalOrder.indexOf(a.type);
      const bIndex = terminalOrder.indexOf(b.type);
      return (aIndex < 0 ? terminalOrder.length : aIndex) - (bIndex < 0 ? terminalOrder.length : bIndex);
    });
    const terminalWeather = mapTerminals.map((_, index) => buildWeatherView(regionId, weatherData, index));

    return {
      regionId,
      regionName,
      province: localize(region.region),
      terminalName: formatTerminalDisplayName(
        regionName,
        localize(terminal.name) || localize(region.summaryName)
      ),
      description: localize(terminal.description),
      phone: region.phone || '1544-1114',
      href: folder ? paths.region(folder) : paths.portal('terminal/map.html'),
      image: regionImages[regionId] || regionImages.incheon,
      imageAlt: `${regionName} 여객선터미널과 바다 풍경`,
      weather: terminalWeather[0] || buildWeatherView(regionId, weatherData),
      terminalWeather,
      mapTerminals
    };
  }

  function setText(root, selector, value) {
    const element = root.querySelector(selector);
    if (element) element.textContent = value || '';
    root.querySelectorAll(selector).forEach((matchingElement) => {
      matchingElement.textContent = value || '';
    });
  }

  function getTerminalGuideHref(href = '') {
    const value = String(href || '');
    return /\/index\.html(?:[?#].*)?$/.test(value)
      ? value.replace(/\/index\.html(?=([?#].*)?$)/, '/guide.html')
      : value || 'terminal/map.html';
  }

  function applyTerminalGuideLinks(root, href) {
    const guideHref = getTerminalGuideHref(href);
    root.querySelectorAll('[data-v2-terminal-guide-link]').forEach((guideLink) => {
      guideLink.href = guideHref;
    });
  }

  function applyWeatherView(root, weather) {
    if (!root || !weather) return;
    const weatherStatus = root.querySelector('[data-v2-weather-status]');
    const weatherAdvisory = root.querySelector('[data-v2-weather-advisory]');
    const weatherIcon = root.querySelector('[data-v2-weather-icon]');
    setText(root, '[data-v2-weather-area]', weather.area);
    setText(root, '[data-v2-weather-condition]', weather.condition);
    setText(root, '[data-v2-weather-temperature]', weather.temperature);
    setText(root, '[data-v2-weather-updated]', weather.updatedAt);
    setText(root, '[data-v2-weather-direction]', weather.direction);
    setText(root, '[data-v2-weather-speed]', weather.windSpeed);
    setText(root, '[data-v2-weather-wind]', weather.wind);
    setText(root, '[data-v2-weather-wave]', weather.wave);
    setText(root, '[data-v2-weather-visibility]', weather.visibility);
    setText(root, '[data-v2-weather-status]', weather.statusLabel);
    if (weatherStatus) weatherStatus.dataset.level = weather.statusLevel;
    if (weatherAdvisory) {
      const advisory = weather.advisory;
      const advisoryTitle = root.querySelector('[data-v2-weather-advisory-title]');
      const advisoryMessage = root.querySelector('[data-v2-weather-advisory-message]');
      const title = String(advisory?.title || '');
      const area = String(advisory?.area || '');
      const displayTitle = area && /주의보(?:·[^ ]+주의보)? 발표$/.test(title)
        ? `${area}에 ${title.replace(/ 발표$/, '')}가 발효 중입니다.`
        : [area, title].filter(Boolean).join(' · ');
      if (advisoryTitle) advisoryTitle.textContent = displayTitle;
      if (advisoryMessage) advisoryMessage.textContent = advisory?.message || '';
      weatherAdvisory.hidden = !advisory;
      if (advisory) weatherAdvisory.dataset.level = advisory.level;
      else delete weatherAdvisory.dataset.level;
    }
    if (weatherIcon) {
      weatherIcon.src = resolveWeatherIcon(weather.condition);
      weatherIcon.alt = `${weather.condition} 날씨 아이콘`;
    }
  }

  function formatMapTerminalLabel(name = '', type = '') {
    if (terminalTypeLabels[type]) return terminalTypeLabels[type];
    const harborEnd = name.indexOf('항');
    if (harborEnd >= 0) return name.slice(0, harborEnd + 1).trim();
    return name.replace(/\s*(?:연안|국제)?\s*여객선?\s*터미널.*$/, '').trim();
  }

  function projectTerminalCoordinate(coords = {}) {
    const latitude = Number(coords.lat);
    const longitude = Number(coords.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    const semiMajorAxis = 6378137;
    const flattening = 1 / 298.257222101;
    const eccentricitySquared = flattening * (2 - flattening);
    const secondEccentricitySquared = eccentricitySquared / (1 - eccentricitySquared);
    const scaleFactor = 0.9996;
    const falseEasting = 1000000;
    const falseNorthing = 2000000;
    const latitudeOfOrigin = 38 * Math.PI / 180;
    const centralMeridian = 127.5 * Math.PI / 180;
    const phi = latitude * Math.PI / 180;
    const lambda = longitude * Math.PI / 180;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const tanPhi = Math.tan(phi);
    const n = semiMajorAxis / Math.sqrt(1 - eccentricitySquared * sinPhi * sinPhi);
    const t = tanPhi * tanPhi;
    const c = secondEccentricitySquared * cosPhi * cosPhi;
    const a = (lambda - centralMeridian) * cosPhi;
    const meridionalArc = (angle) => semiMajorAxis * (
      (1 - eccentricitySquared / 4 - 3 * eccentricitySquared ** 2 / 64 - 5 * eccentricitySquared ** 3 / 256) * angle
      - (3 * eccentricitySquared / 8 + 3 * eccentricitySquared ** 2 / 32 + 45 * eccentricitySquared ** 3 / 1024) * Math.sin(2 * angle)
      + (15 * eccentricitySquared ** 2 / 256 + 45 * eccentricitySquared ** 3 / 1024) * Math.sin(4 * angle)
      - (35 * eccentricitySquared ** 3 / 3072) * Math.sin(6 * angle)
    );
    const x = falseEasting + scaleFactor * n * (
      a + (1 - t + c) * a ** 3 / 6
      + (5 - 18 * t + t ** 2 + 72 * c - 58 * secondEccentricitySquared) * a ** 5 / 120
    );
    const y = falseNorthing + scaleFactor * (
      meridionalArc(phi) - meridionalArc(latitudeOfOrigin)
      + n * tanPhi * (
        a ** 2 / 2
        + (5 - t + 9 * c + 4 * c ** 2) * a ** 4 / 24
        + (61 - 58 * t + t ** 2 + 600 * c - 330 * secondEccentricitySquared) * a ** 6 / 720
      )
    );
    const sourceWidth = koreaMapBounds.maxX - koreaMapBounds.minX;
    const sourceHeight = koreaMapBounds.maxY - koreaMapBounds.minY;
    const scale = Math.min(
      (koreaMapBounds.width - koreaMapBounds.padding * 2) / sourceWidth,
      (koreaMapBounds.height - koreaMapBounds.padding * 2) / sourceHeight
    );
    const offsetX = (koreaMapBounds.width - sourceWidth * scale) / 2;
    const offsetY = (koreaMapBounds.height - sourceHeight * scale) / 2;
    return {
      x: (offsetX + (x - koreaMapBounds.minX) * scale) / koreaMapBounds.width * 100,
      y: (offsetY + (koreaMapBounds.maxY - y) * scale) / koreaMapBounds.height * 100
    };
  }

  function getIndexMapTerminalPosition(regionId, terminalType) {
    const position = indexMapTerminalPositions[regionId]?.[terminalType];
    return position ? { x: position[0], y: position[1] } : null;
  }

  function renderMapTerminals(root, terminals = [], onSelect, regionId = '') {
    const layer = root.querySelector('[data-v2-terminal-markers]');
    const ownerDocument = root.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (!layer || !ownerDocument) return;

    const markers = terminals.map((terminal) => ({
      terminal,
      position: getIndexMapTerminalPosition(regionId, terminal.type)
    })).filter(({ terminal, position }) => terminal.name && position).map(({ terminal, position }, index) => {
      const marker = ownerDocument.createElement('button');
      const pin = ownerDocument.createElement('i');
      const label = ownerDocument.createElement('b');
      marker.className = 'portal-v2-terminal-marker';
      marker.setAttribute('type', 'button');
      marker.setAttribute('data-terminal-id', terminal.id);
      marker.setAttribute('data-terminal-type', terminal.type);
      marker.setAttribute('data-terminal-name', terminal.name);
      marker.setAttribute('aria-label', terminal.name);
      marker.setAttribute('aria-pressed', String(index === 0));
      marker.style.setProperty('--terminal-x', `${position.x}%`);
      marker.style.setProperty('--terminal-y', `${position.y}%`);
      pin.setAttribute('aria-hidden', 'true');
      label.textContent = formatMapTerminalLabel(terminal.name, terminal.type);
      marker.append(pin, label);
      if (typeof onSelect === 'function') {
        marker.addEventListener('click', () => onSelect(terminal));
      }
      return marker;
    });

    layer.replaceChildren(...markers);
  }

  function renderTerminalRoutes(root, routeDetails = [], regionId = '') {
    const container = root?.querySelector('[data-v2-terminal-routes]');
    const originElement = root?.querySelector('[data-v2-route-origin]');
    const destinationsElement = root?.querySelector('[data-v2-route-destinations]');
    if (!container && !originElement && !destinationsElement) return;
    const details = routeDetails.map((route) => (
      typeof route === 'string' ? { name: route, duration: '', frequency: '' } : route
    )).filter((route) => route?.name);
    const emptyText = window.i18n?.t('portalV2.routesEmpty') || '주요 항로 정보 준비 중';
    const parsedRoutes = details.map((route) => {
      const segments = route.name.split(/→|↔/).map((segment) => segment.trim()).filter(Boolean);
      return {
        name: route.name,
        origin: segments.length > 1 ? segments[0] : '',
        destination: segments.length > 1 ? segments[segments.length - 1] : route.name,
        duration: formatRouteDuration(route.duration) || '소요시간 확인',
        frequency: formatRouteFrequency(route.frequency)
      };
    });
    const origins = [...new Set(parsedRoutes.map((route) => route.origin).filter(Boolean))];
    const destinations = parsedRoutes.map((route) => route.destination).filter(Boolean);
    const hasSharedOrigin = origins.length === 1;
    const displayText = hasSharedOrigin
      ? `${origins[0]} → ${destinations.join(', ')}`
      : (parsedRoutes.map((route) => route.name).join(' · ') || emptyText);
    if (container) {
      const ownerDocument = root.ownerDocument || (typeof document !== 'undefined' ? document : null);
      if (ownerDocument && typeof container.replaceChildren === 'function' && parsedRoutes.length) {
        if (hasSharedOrigin) {
          const destinationGrid = ownerDocument.createElement('div');
          destinationGrid.className = 'portal-v2-route-destination-grid';
          parsedRoutes.forEach((route) => {
            const card = ownerDocument.createElement('article');
            const path = ownerDocument.createElement('div');
            const origin = ownerDocument.createElement('strong');
            const arrow = ownerDocument.createElement('span');
            const destination = ownerDocument.createElement('strong');
            const meta = ownerDocument.createElement('div');
            const duration = ownerDocument.createElement('span');
            const durationLabel = ownerDocument.createElement('span');
            const durationValue = ownerDocument.createElement('strong');
            const actions = ownerDocument.createElement('div');
            const operation = ownerDocument.createElement('a');
            const booking = ownerDocument.createElement('a');
            card.className = 'portal-v2-route-destination-card';
            path.className = 'portal-v2-route-card__path';
            origin.className = 'portal-v2-route-card__origin';
            origin.textContent = route.origin;
            arrow.className = 'portal-v2-route-card__arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = '→';
            destination.className = 'portal-v2-route-card__destination';
            destination.textContent = route.destination;
            path.append(origin, arrow, destination);
            meta.className = 'portal-v2-route-card__meta';
            duration.className = 'portal-v2-route-card__duration';
            durationLabel.className = 'portal-v2-route-card__duration-label';
            durationLabel.textContent = '소요시간';
            durationValue.className = 'portal-v2-route-card__duration-value';
            durationValue.textContent = route.duration;
            duration.append(durationLabel, durationValue);
            meta.append(duration);
            actions.className = 'portal-v2-route-card__actions';
            operation.className = 'btn btn--sm btn--outline portal-v2-route-card__operation';
            operation.setAttribute('href', 'schedule/operation.html');
            operation.setAttribute('aria-label', `${route.destination} 항로 운항정보 보기`);
            operation.textContent = '운항정보';
            booking.className = 'btn btn--sm btn--outline portal-v2-route-card__booking';
            booking.setAttribute('href', 'https://island.theksa.co.kr/');
            booking.setAttribute('target', '_blank');
            booking.setAttribute('rel', 'noopener');
            booking.setAttribute('aria-label', `${route.destination} 항로 예매 사이트 새 창 열림`);
            booking.textContent = '예매하기';
            actions.append(operation, booking);
            card.append(path, meta, actions);
            destinationGrid.append(card);
          });
          container.replaceChildren(destinationGrid);
        } else {
          const chips = parsedRoutes.map((route) => {
            const chip = ownerDocument.createElement('a');
            chip.className = 'portal-v2-route-chip';
            chip.setAttribute('href', 'schedule/operation.html');
            chip.textContent = route.name;
            return chip;
          });
          container.replaceChildren(...chips);
        }
      } else {
        container.textContent = displayText;
      }
    }
    if (originElement) originElement.textContent = hasSharedOrigin ? origins[0] : '';
    if (destinationsElement) destinationsElement.textContent = hasSharedOrigin
      ? destinations.join(', ')
      : displayText;
  }

  function transitionHeroImage(image, nextSrc, nextAlt, options = {}) {
    if (!image || !nextSrc) return;
    const currentSrc = image.getAttribute?.('src') || image.src;
    if (currentSrc === nextSrc) {
      image.alt = nextAlt || '';
      return;
    }

    const prefersReducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const createImage = options.createImage
      || (typeof window.Image === 'function' ? () => new window.Image() : null);
    const schedule = options.schedule
      || (typeof window.setTimeout === 'function' ? window.setTimeout.bind(window) : null);

    if (prefersReducedMotion || !createImage || !schedule) {
      image.src = nextSrc;
      image.alt = nextAlt || '';
      return;
    }

    const requestId = (heroImageRequestIds.get(image) || 0) + 1;
    heroImageRequestIds.set(image, requestId);
    const preload = createImage();
    const isCurrentRequest = () => heroImageRequestIds.get(image) === requestId;
    const stage = image.parentElement;
    const clearTransitionBackdrop = () => {
      if (!stage) return;
      stage.classList?.remove('is-hero-transitioning');
      if (stage.style) stage.style.backgroundImage = '';
    };
    const applyImmediately = () => {
      if (!isCurrentRequest()) return;
      image.src = nextSrc;
      image.alt = nextAlt || '';
      image.classList?.remove('is-switching');
      clearTransitionBackdrop();
    };

    preload.onload = () => {
      if (!isCurrentRequest()) return;
      if (stage?.style) {
        stage.style.backgroundImage = `url(${JSON.stringify(currentSrc)})`;
        stage.classList?.add('is-hero-transitioning');
      }
      image.classList?.add('is-switching');
      schedule(() => {
        if (!isCurrentRequest()) return;
        image.src = nextSrc;
        image.alt = nextAlt || '';
        schedule(() => {
          if (!isCurrentRequest()) return;
          image.classList?.remove('is-switching');
          schedule(() => {
            if (isCurrentRequest()) clearTransitionBackdrop();
          }, 600);
        }, 40);
      }, 180);
    };
    preload.onerror = applyImmediately;
    preload.src = nextSrc;
  }

  function applyTerminalView(root, terminal, regionName = '', weather = null, regionId = '') {
    if (!root || !terminal) return;
    const phone = root.querySelector('[data-v2-region-phone]');
    const link = root.querySelector('[data-v2-region-link]');
    setText(root, '[data-v2-terminal-name]', formatTerminalDisplayName(regionName, terminal.name));
    renderTerminalRoutes(root, terminal.routeDetails?.length ? terminal.routeDetails : terminal.routes, regionId);
    setText(root, '[data-v2-terminal-address]', terminal.address);
    if (phone) {
      phone.textContent = terminal.phone || '';
      phone.href = `tel:${String(terminal.phone || '').replace(/[^0-9]/g, '')}`;
    }
    if (link) link.href = terminal.href || 'terminal/map.html';
    applyTerminalGuideLinks(root, terminal.href);
    applyWeatherView(root, weather);
    root.querySelectorAll('[data-terminal-id]').forEach((marker) => {
      marker.setAttribute('aria-pressed', String(marker.dataset.terminalId === terminal.id));
    });
  }

  function applyRegionView(root, view, onTerminalSelect) {
    const image = root.querySelector('[data-v2-region-image]');
    const phone = root.querySelector('[data-v2-region-phone]');
    const link = root.querySelector('[data-v2-region-link]');

    if (image) {
      transitionHeroImage(image, view.image, view.imageAlt);
    }
    setText(root, '[data-v2-region-name]', view.regionName);
    setText(root, '[data-v2-province]', view.province);
    setText(root, '[data-v2-terminal-name]', view.terminalName);
    renderTerminalRoutes(
      root,
      view.mapTerminals?.[0]?.routeDetails?.length
        ? view.mapTerminals[0].routeDetails
        : view.mapTerminals?.[0]?.routes,
      view.regionId
    );
    setText(root, '[data-v2-terminal-address]', view.mapTerminals?.[0]?.address);
    if (phone) {
      phone.textContent = view.phone;
      phone.href = `tel:${view.phone.replace(/[^0-9]/g, '')}`;
    }
    if (link) link.href = view.href;
    applyTerminalGuideLinks(root, view.href);
    applyWeatherView(root, view.weather);
    renderMapTerminals(root, view.mapTerminals, onTerminalSelect, view.regionId);
    root.querySelectorAll('[data-region-id]').forEach((control) => {
      const isSelected = control.dataset.regionId === view.regionId;
      control.setAttribute('aria-pressed', String(isSelected));
      if (isSelected) {
        control.dataset.selectedTerminalName = view.terminalName || view.mapTerminals?.[0]?.name || '';
      } else {
        delete control.dataset.selectedTerminalName;
      }
    });
  }

  function toggleMapZoom(root, regionId) {
    const map = root?.querySelector('.portal-v2-map');
    if (!map) return;

    if (!regionId) {
      map.classList.remove('is-region-zoomed');
      map.removeAttribute('data-zoom-region');
      return;
    }

    map.dataset.zoomRegion = regionId;
    map.classList.add('is-region-zoomed');
  }

  function handleMapCanvasClick(root, event) {
    const map = root?.querySelector('.portal-v2-map');
    if (!map?.classList.contains('is-region-zoomed')) return;
    if (event?.target?.closest?.('.portal-v2-terminal-marker')) return;
    if (event?.target?.closest?.('.portal-v2-map__marker')) return;
    toggleMapZoom(root);
  }

  function filterRegionControls(root, query = '') {
    if (!root) return;
    const normalizedQuery = String(query).trim().toLocaleLowerCase('ko-KR');
    const controls = Array.from(root.querySelectorAll('.portal-v2-region-list [data-region-id]'));
    let visibleCount = 0;

    controls.forEach((control) => {
      const searchTerms = String(control.dataset?.searchTerms || control.textContent || '')
        .trim()
        .toLocaleLowerCase('ko-KR');
      const isVisible = !normalizedQuery || searchTerms.includes(normalizedQuery);
      control.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    root.querySelectorAll('.portal-v2-region-group').forEach((group) => {
      if (typeof group.querySelectorAll !== 'function') return;
      const groupControls = Array.from(group.querySelectorAll('[data-region-id]'));
      group.hidden = groupControls.length > 0 && groupControls.every((control) => control.hidden);
    });

    const emptyMessage = root.querySelector('[data-v2-region-search-empty]');
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
  }

  function getQuickMenuPage(currentPage, direction, itemCount, visibleCount) {
    const pageCount = Math.max(1, Math.ceil(itemCount / visibleCount));
    return (currentPage + direction + pageCount) % pageCount;
  }

  function getQuickMenuVisibleCount(viewportWidth, itemCount = 6) {
    const responsiveCount = viewportWidth <= 700 ? 1 : viewportWidth <= 1023 ? 3 : 6;
    return Math.min(responsiveCount, itemCount);
  }

  function getNearestHelpQuestionIndex(containerCenter, itemCenters = []) {
    if (!itemCenters.length) return 0;
    return itemCenters.reduce((nearestIndex, itemCenter, index) => (
      Math.abs(itemCenter - containerCenter) < Math.abs(itemCenters[nearestIndex] - containerCenter)
        ? index
        : nearestIndex
    ), 0);
  }

  function getHelpQuestionWheelTargetIndex(currentIndex, direction, itemCount) {
    if (!itemCount) return 0;
    return Math.min(itemCount - 1, Math.max(0, currentIndex + Math.sign(direction)));
  }

  function getInitialHelpQuestionIndex(itemCount) {
    return Math.min(2, Math.max(0, itemCount - 1));
  }

  function getHelpQuestionLoopOffset(cloneGroup, cycleHeight) {
    if (!cycleHeight) return 0;
    if (cloneGroup === 'before') return cycleHeight;
    if (cloneGroup === 'after') return -cycleHeight;
    return 0;
  }

  function applyHelpQuestionLoopOffset(questionList, loopOffset, requestFrame = window.requestAnimationFrame) {
    if (!questionList || !loopOffset) return;
    const previousScrollBehavior = questionList.style.scrollBehavior;
    const previousScrollSnapType = questionList.style.scrollSnapType;
    questionList.classList.add('is-loop-resetting');
    questionList.style.scrollBehavior = 'auto';
    questionList.style.scrollSnapType = 'none';
    questionList.scrollTop += loopOffset;
    requestFrame(() => {
      questionList.style.scrollBehavior = previousScrollBehavior;
      questionList.style.scrollSnapType = previousScrollSnapType;
      questionList.classList.remove('is-loop-resetting');
    });
  }

  function scheduleHelpQuestionLoopReset(currentTimer, clearTimer, setTimer, callback) {
    if (currentTimer) clearTimer(currentTimer);
    return setTimer(callback, 140);
  }

  function getHelpQuestionVisualState(containerCenter, containerHeight, itemCenter) {
    if (!containerHeight) return { opacity: 1, scale: 1.04, blur: 0 };
    const distanceRatio = Math.min(Math.abs(itemCenter - containerCenter) / (containerHeight / 2), 1);
    const stops = [
      { ratio: 0, opacity: 1, scale: 1.04, blur: 0 },
      { ratio: 0.325, opacity: 0.74, scale: 0.96, blur: 0.3 },
      { ratio: 0.65, opacity: 0.42, scale: 0.91, blur: 0.7 },
      { ratio: 1, opacity: 0.08, scale: 0.86, blur: 1.2 }
    ];
    const upperIndex = stops.findIndex((stop) => distanceRatio <= stop.ratio);
    const upper = stops[upperIndex < 0 ? stops.length - 1 : upperIndex];
    const lower = stops[Math.max(0, (upperIndex < 0 ? stops.length - 1 : upperIndex) - 1)];
    const progress = upper.ratio === lower.ratio
      ? 0
      : (distanceRatio - lower.ratio) / (upper.ratio - lower.ratio);
    const interpolate = (start, end) => Math.round((start + ((end - start) * progress)) * 100) / 100;
    return {
      opacity: interpolate(lower.opacity, upper.opacity),
      scale: interpolate(lower.scale, upper.scale),
      blur: interpolate(lower.blur, upper.blur)
    };
  }

  function initHelpQuestionWheel(root) {
    const questionList = root?.querySelector?.('[data-v2-help-questions]');
    if (!questionList) return;
    const questions = Array.from(questionList.querySelectorAll('[data-v2-help-question]'));
    if (!questions.length) return;
    const createLoopClone = (question, cloneGroup) => {
      const clone = question.cloneNode(true);
      clone.removeAttribute('data-v2-help-question');
      clone.setAttribute('data-v2-help-wheel-clone', cloneGroup);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      return clone;
    };
    const beforeClones = questions.map((question) => createLoopClone(question, 'before'));
    const afterClones = questions.map((question) => createLoopClone(question, 'after'));
    beforeClones.forEach((clone) => questionList.insertBefore(clone, questions[0]));
    afterClones.forEach((clone) => questionList.append(clone));
    const wheelQuestions = [...beforeClones, ...questions, ...afterClones];
    let scrollFrame = 0;
    let loopResetTimer = 0;
    let wheelUnlockTimer = 0;
    let wheelInputLocked = false;
    let cycleHeight = 0;

    const render = () => {
      let listRect = questionList.getBoundingClientRect();
      let containerCenter = listRect.top + (listRect.height / 2);
      let itemCenters = wheelQuestions.map((question) => {
        const questionRect = question.getBoundingClientRect();
        return questionRect.top + (questionRect.height / 2);
      });
      const currentIndex = getNearestHelpQuestionIndex(containerCenter, itemCenters);
      wheelQuestions.forEach((question, index) => {
        const distance = Math.abs(index - currentIndex);
        const visualState = getHelpQuestionVisualState(containerCenter, listRect.height, itemCenters[index]);
        question.style.setProperty('--portal-v2-help-question-opacity', String(visualState.opacity));
        question.style.setProperty('--portal-v2-help-question-scale', String(visualState.scale));
        question.style.setProperty('--portal-v2-help-question-blur', String(visualState.blur));
        question.classList.toggle('is-current', distance === 0);
        question.classList.toggle('is-nearby', distance === 1);
        if (distance === 0) question.setAttribute('aria-current', 'true');
        else question.removeAttribute('aria-current');
      });
    };

    const resetLoopPosition = () => {
      const listRect = questionList.getBoundingClientRect();
      const containerCenter = listRect.top + (listRect.height / 2);
      const itemCenters = wheelQuestions.map((question) => {
        const questionRect = question.getBoundingClientRect();
        return questionRect.top + (questionRect.height / 2);
      });
      const currentIndex = getNearestHelpQuestionIndex(containerCenter, itemCenters);
      const loopOffset = getHelpQuestionLoopOffset(
        wheelQuestions[currentIndex].getAttribute('data-v2-help-wheel-clone') || '',
        cycleHeight
      );
      if (!loopOffset) return;
      applyHelpQuestionLoopOffset(questionList, loopOffset);
      render();
    };

    const scheduleRender = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        render();
      });
    };

    const getQuestionTargetTop = (question) => {
      const listRect = questionList.getBoundingClientRect();
      const questionRect = question.getBoundingClientRect();
      return questionList.scrollTop
        + (questionRect.top + (questionRect.height / 2))
        - (listRect.top + (listRect.height / 2));
    };

    questionList.addEventListener('wheel', (event) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      if (wheelUnlockTimer) window.clearTimeout(wheelUnlockTimer);
      wheelUnlockTimer = window.setTimeout(() => {
        wheelInputLocked = false;
        wheelUnlockTimer = 0;
      }, 160);
      if (wheelInputLocked) return;
      wheelInputLocked = true;

      const listRect = questionList.getBoundingClientRect();
      const containerCenter = listRect.top + (listRect.height / 2);
      const itemCenters = wheelQuestions.map((question) => {
        const questionRect = question.getBoundingClientRect();
        return questionRect.top + (questionRect.height / 2);
      });
      const currentIndex = getNearestHelpQuestionIndex(containerCenter, itemCenters);
      const targetIndex = getHelpQuestionWheelTargetIndex(
        currentIndex,
        event.deltaY > 0 ? 1 : -1,
        wheelQuestions.length
      );
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      questionList.scrollTo({
        top: getQuestionTargetTop(wheelQuestions[targetIndex]),
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    }, { passive: false });

    questionList.addEventListener('scroll', () => {
      scheduleRender();
      loopResetTimer = scheduleHelpQuestionLoopReset(
        loopResetTimer,
        window.clearTimeout,
        window.setTimeout,
        resetLoopPosition
      );
    });
    window.addEventListener('resize', scheduleRender);
    questions.forEach((question) => {
      question.addEventListener('focus', () => {
        const targetTop = getQuestionTargetTop(question);
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (typeof questionList.scrollTo === 'function') {
          questionList.scrollTo({ top: targetTop, behavior: reducedMotion ? 'auto' : 'smooth' });
        } else {
          questionList.scrollTop = targetTop;
        }
      });
    });
    window.requestAnimationFrame(() => {
      cycleHeight = afterClones[0].getBoundingClientRect().top
        - questions[0].getBoundingClientRect().top;
      const initialQuestion = questions[getInitialHelpQuestionIndex(questions.length)];
      questionList.scrollTop = getQuestionTargetTop(initialQuestion);
      render();
    });
  }

  function initQuickMenu(root) {
    const quick = root?.querySelector?.('[data-v2-quick]');
    const track = quick?.querySelector?.('[data-v2-quick-track]');
    if (!quick || !track) return;

    const cards = Array.from(track.children);
    const pagination = quick.querySelector('[data-v2-quick-pagination]');
    let currentPage = 0;

    const visibleCount = () => getQuickMenuVisibleCount(window.innerWidth, cards.length);
    const render = () => {
      const visible = visibleCount();
      const pageCount = Math.max(1, Math.ceil(cards.length / visible));
      currentPage = Math.min(currentPage, pageCount - 1);
      track.style.setProperty('--portal-v2-quick-page', String(currentPage));
      track.style.setProperty('--portal-v2-quick-visible', String(visible));
      quick.querySelector('[data-v2-quick-prev]').hidden = pageCount === 1;
      quick.querySelector('[data-v2-quick-next]').hidden = pageCount === 1;
      pagination.hidden = pageCount === 1;
      pagination.replaceChildren(...Array.from({ length: pageCount }, (_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${index + 1}번째 빠른 서비스 페이지`);
        dot.setAttribute('aria-current', index === currentPage ? 'true' : 'false');
        dot.addEventListener('click', () => { currentPage = index; render(); });
        return dot;
      }));
    };
    const move = (direction) => {
      currentPage = getQuickMenuPage(currentPage, direction, cards.length, visibleCount());
      render();
    };

    quick.querySelector('[data-v2-quick-prev]')?.addEventListener('click', () => move(-1));
    quick.querySelector('[data-v2-quick-next]')?.addEventListener('click', () => move(1));
    window.addEventListener('resize', render);
    render();
  }

  function init(root, portalData = {}, registry = [], weatherData = {}) {
    if (!root) return;
    initQuickMenu(root);
    initHelpQuestionWheel(root);
    const selectRegion = (regionId) => {
      const view = buildRegionView(regionId, portalData, registry, weatherData);
      applyRegionView(root, view, (terminal) => {
        const terminalIndex = view.mapTerminals.findIndex((item) => item.id === terminal.id);
        applyTerminalView(
          root,
          terminal,
          view.regionName,
          view.terminalWeather[terminalIndex] || view.weather,
          view.regionId
        );
      });
    };
    root.querySelectorAll('.portal-v2-region-list [data-region-id]').forEach((control) => {
      const region = portalData.regions?.[control.dataset.regionId] || {};
      control.dataset.searchTerms = [
        localize(region.label),
        ...(region.terminals || []).map((terminal) => localize(terminal.name))
      ].filter(Boolean).join(' ');
    });
    root.querySelectorAll('[data-region-id]').forEach((control) => {
      control.setAttribute('aria-pressed', 'false');
      if (control.dataset) delete control.dataset.selectedTerminalName;
      control.addEventListener('click', () => {
        selectRegion(control.dataset.regionId);
        toggleMapZoom(root, control.dataset.regionId);
      });
    });
    root.querySelector('[data-v2-map-reset]')?.addEventListener('click', () => toggleMapZoom(root));
    root.querySelector('.portal-v2-map__canvas')?.addEventListener('click', (event) => {
      handleMapCanvasClick(root, event);
    });
    const searchInput = root.querySelector('[data-v2-region-search]');
    const applyRegionFilter = () => filterRegionControls(root, searchInput?.value || '');
    searchInput?.addEventListener('input', applyRegionFilter);
    if (searchInput) applyRegionFilter();
    const initialRegionId = root.dataset?.initialRegionId
      || portalData.initialRegionId;
    if (initialRegionId) selectRegion(initialRegionId);
  }

  window.PortalV2 = Object.freeze({ buildRegionView, resolveWeatherIcon, formatRouteDuration, formatRouteFrequency, buildSelectedRouteView, getDefaultRoute, applySelectedRouteView, toggleSelectedRouteView, formatMapTerminalLabel, projectTerminalCoordinate, getIndexMapTerminalPosition, renderMapTerminals, renderTerminalRoutes, getTerminalGuideHref, transitionHeroImage, applyTerminalView, applyRegionView, toggleMapZoom, handleMapCanvasClick, filterRegionControls, getQuickMenuPage, getQuickMenuVisibleCount, getNearestHelpQuestionIndex, getHelpQuestionWheelTargetIndex, getInitialHelpQuestionIndex, getHelpQuestionLoopOffset, applyHelpQuestionLoopOffset, scheduleHelpQuestionLoopReset, getHelpQuestionVisualState, initQuickMenu, initHelpQuestionWheel, init });

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      init(
        document.querySelector('[data-portal-v2]'),
        window.PORTAL_DATA,
        window.PORTAL_REGION_REGISTRY || [],
        window.PORTAL_WEATHER_FALLBACK_DATA
      );
    });
  }
}());
