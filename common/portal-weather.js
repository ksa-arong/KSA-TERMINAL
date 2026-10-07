(function initializePortalWeatherDashboard() {
  'use strict';

  const root = document.querySelector('[data-weather-root]');
  const fallbackData = window.PORTAL_WEATHER_FALLBACK_DATA;
  if (!root || !fallbackData || !Array.isArray(fallbackData.areas) || !fallbackData.areas.length) return;

  const apiConfig = window.PORTAL_WEATHER_API_CONFIG || {};
  const areaSelect = root.querySelector('[data-weather-area]');
  const updateLabel = root.querySelector('[data-weather-update]');
  const currentDirection = root.querySelector('[data-weather-current-direction]');
  const currentTemperature = root.querySelector('[data-weather-current-temperature]');
  const currentWind = root.querySelector('[data-weather-current-wind]');
  const currentRainfall = root.querySelector('[data-weather-current-rainfall]');
  const marineDirection = root.querySelector('[data-weather-marine-direction]');
  const marineWind = root.querySelector('[data-weather-marine-wind]');
  const marineMaxWave = root.querySelector('[data-weather-marine-max-wave]');
  const marineWave = root.querySelector('[data-weather-marine-wave]');
  const visibility = root.querySelector('[data-weather-visibility]');
  const observationWind = root.querySelector('[data-weather-observation-wind]');
  const observationTemperature = root.querySelector('[data-weather-observation-temperature]');
  const pressure = root.querySelector('[data-weather-pressure]');
  const advisoryList = root.querySelector('[data-weather-advisory-list]');

  if (!areaSelect || !updateLabel ||
      !currentDirection || !currentTemperature || !currentWind || !currentRainfall ||
      !marineDirection || !marineWind || !marineMaxWave || !marineWave || !visibility ||
      !observationWind || !observationTemperature || !pressure ||
      !advisoryList) return;

  let currentArea = fallbackData.areas[0];
  let currentRoute = currentArea.routes[0];
  let requestController = null;
  const weatherResponseCache = new Map();
  const weatherCacheTtlMs = 10 * 60 * 1000;
  const fallbackStatus = document.createElement('p');
  fallbackStatus.className = 'portal-weather-fallback-status';
  fallbackStatus.setAttribute('role', 'status');
  fallbackStatus.hidden = true;
  fallbackStatus.textContent = '실시간 정보를 불러오지 못해 이전 정보를 표시합니다.';
  (updateLabel.closest('p') || updateLabel).insertAdjacentElement('afterend', fallbackStatus);

  const number = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '-';
  };

  const average = (minimum, maximum) => (Number(minimum) + Number(maximum)) / 2;
  const cloneData = (data) => (typeof structuredClone === 'function'
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data)));
  const advisoryLevelLabels = {
    success: '해제',
    warning: '주의',
    danger: '발표'
  };

  function renderAdvisories(items) {
    advisoryList.replaceChildren();

    if (!Array.isArray(items) || !items.length) {
      const empty = document.createElement('p');
      empty.className = 'portal-weather-advisory-empty';
      empty.textContent = '현재 발표된 기상특보가 없습니다.';
      advisoryList.append(empty);
      return;
    }

    items.forEach((item) => {
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      const title = document.createElement('span');
      const levelBadge = document.createElement('span');
      const tableWrap = document.createElement('div');
      const table = document.createElement('table');
      const caption = document.createElement('caption');
      const tbody = document.createElement('tbody');
      const level = item.level || 'info';
      article.className = 'portal-weather-advisory-item';
      article.dataset.level = level;
      title.textContent = item.title || '기상특보';
      levelBadge.className = 'portal-weather-advisory-level';
      levelBadge.textContent = advisoryLevelLabels[level] || '안내';
      heading.append(title, levelBadge);
      tableWrap.className = 'portal-table-wrap';
      table.className = 'portal-data-table portal-info-table mobile-table--card';
      caption.className = 'sr-only';
      caption.textContent = title.textContent + ' 상세 정보';

      [
        ['발효시각', item.issuedAt],
        ['해당구역', item.area],
        ['특보내용', item.note]
      ].forEach(([term, description]) => {
        if (!description) return;
        const row = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');
        th.scope = 'row';
        th.textContent = term;
        td.textContent = description;
        row.append(th, td);
        tbody.append(row);
      });

      table.append(caption, tbody);
      tableWrap.append(table);
      article.append(heading, tableWrap);
      advisoryList.append(article);
    });
  }

  function renderDashboard(data) {
    const forecast = data.forecast || currentRoute.forecast || [];
    const currentForecast = forecast[0] || {};
    const current = { ...(currentRoute.current || {}), ...(data.current || {}) };
    const observation = { ...(currentRoute.observation || {}), ...(data.observation || {}) };
    const updatedAt = data.updatedAt || fallbackData.updatedAt;
    const windValue = Number.isFinite(Number(current.wind))
      ? Number(current.wind)
      : average(currentForecast.windMin, currentForecast.windMax);
    const significantWave = average(currentForecast.waveMin, currentForecast.waveMax);

    updateLabel.textContent = updatedAt.replace(/\s*기준\s*$/, '');
    currentDirection.textContent = current.direction || currentForecast.direction || '-';
    currentTemperature.textContent = number(current.temperature);
    currentWind.textContent = number(windValue);
    currentRainfall.textContent = number(current.rainfall);
    marineDirection.textContent = current.direction || currentForecast.direction || '-';
    marineWind.textContent = number(windValue);
    marineMaxWave.textContent = number(currentForecast.waveMax);
    marineWave.textContent = number(significantWave);
    visibility.textContent = Number.isFinite(Number(observation.visibility)) ? Math.round(Number(observation.visibility)) : '-';
    observationWind.textContent = number(observation.wind);
    observationTemperature.textContent = number(observation.temperature);
    pressure.textContent = number(observation.pressure);
    renderAdvisories(data.advisories || currentRoute.advisories);
  }

  function mergeApiData(payload) {
    const apiData = payload && payload.data ? payload.data : payload;
    if (!apiData || typeof apiData !== 'object') throw new Error('Invalid marine weather response');
    return {
      ...currentRoute,
      ...apiData,
      current: { ...(currentRoute.current || {}), ...(apiData.current || {}) },
      observation: { ...(currentRoute.observation || {}), ...(apiData.observation || {}) },
      forecast: Array.isArray(apiData.forecast) ? apiData.forecast : currentRoute.forecast,
      weekly: Array.isArray(apiData.weekly) ? apiData.weekly : currentRoute.weekly
    };
  }

  function requestUrl() {
    const url = new URL(apiConfig.endpoint, window.location.href);
    url.searchParams.set('area', currentArea.id);
    url.searchParams.set('route', currentRoute.id);
    url.searchParams.set('station', currentRoute.station || '');
    return url;
  }

  function cachedResponse(cacheKey) {
    const cached = weatherResponseCache.get(cacheKey);
    if (!cached) return null;
    if (Date.now() - cached.cachedAt > weatherCacheTtlMs) {
      weatherResponseCache.delete(cacheKey);
      return null;
    }
    return cloneData(cached.payload);
  }

  async function loadRouteData() {
    if (requestController) requestController.abort();
    requestController = null;
    renderDashboard(currentRoute);

    if (!apiConfig.endpoint) return;

    const url = requestUrl();
    const cacheKey = url.href;
    const cachedPayload = cachedResponse(cacheKey);
    if (cachedPayload) {
      renderDashboard(mergeApiData(cachedPayload));
      fallbackStatus.hidden = true;
      return;
    }

    requestController = new AbortController();
    root.classList.add('is-loading');
    root.setAttribute('aria-busy', 'true');
    updateLabel.textContent = '실시간 해상예보를 불러오는 중입니다.';

    try {
      const response = await fetch(url, {
        signal: requestController.signal,
        headers: { Accept: 'application/json', ...(apiConfig.headers || {}) }
      });
      if (!response.ok) throw new Error('Marine weather API ' + response.status);
      const payload = await response.json();
      weatherResponseCache.set(cacheKey, {
        cachedAt: Date.now(),
        payload: cloneData(payload)
      });
      renderDashboard(mergeApiData(payload));
      fallbackStatus.hidden = true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        renderDashboard(currentRoute);
        fallbackStatus.hidden = false;
      }
    } finally {
      root.classList.remove('is-loading');
      root.setAttribute('aria-busy', 'false');
    }
  }

  [...fallbackData.areas]
    .sort((a, b) => a.label.localeCompare(b.label, 'ko-KR'))
    .forEach((area) => {
      const option = document.createElement('option');
      option.value = area.id;
      option.textContent = area.label;
      areaSelect.append(option);
    });

  areaSelect.value = currentArea.id;
  areaSelect.addEventListener('change', () => {
    currentArea = fallbackData.areas.find((area) => area.id === areaSelect.value) || fallbackData.areas[0];
    currentRoute = currentArea.routes[0];
    loadRouteData();
  });

  loadRouteData();
}());
