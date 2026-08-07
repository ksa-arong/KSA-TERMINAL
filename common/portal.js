(function () {
  'use strict';

  const hero = document.querySelector('.portal-hero');
  const heroSlides = [...document.querySelectorAll('.portal-hero-slide')];
  const heroButtons = [...document.querySelectorAll('[data-hero-slide]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const t = window.i18n.t;
  const localize = window.i18n.localize;
  let currentHeroSlide = 0;
  let heroTimer = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentHeroSlide));
    heroButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === currentHeroSlide;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function stopHeroRotation() {
    if (heroTimer) window.clearInterval(heroTimer);
    heroTimer = null;
  }

  function startHeroRotation() {
    stopHeroRotation();
    if (reducedMotion.matches || heroSlides.length < 2 || document.hidden) return;
    heroTimer = window.setInterval(() => showHeroSlide(currentHeroSlide + 1), 6500);
  }

  if (hero && heroSlides.length) {
    heroButtons.forEach((button) => button.addEventListener('click', () => {
      showHeroSlide(Number(button.dataset.heroSlide));
      startHeroRotation();
    }));
    hero.addEventListener('mouseenter', stopHeroRotation);
    hero.addEventListener('mouseleave', startHeroRotation);
    hero.addEventListener('focusin', stopHeroRotation);
    hero.addEventListener('focusout', () => window.setTimeout(() => {
      if (!hero.contains(document.activeElement)) startHeroRotation();
    }, 0));
    document.addEventListener('visibilitychange', startHeroRotation);
    reducedMotion.addEventListener('change', startHeroRotation);
    showHeroSlide(0);
    startHeroRotation();
  }

  const terminals = {
    incheon: {
      markerName: { ko: '인천', en: '' }, region: { ko: '인천광역시', en: '' }, name: { ko: '인천항 연안여객터미널', en: '' }, shortName: { ko: '인천항', en: '' },
      description: { ko: '서해 5도와 수도권을 잇는 섬 여행의 출발점입니다.', en: '' }, address: { ko: '인천광역시 중구 연안부두로 70', en: '' }, routes: { ko: ['백령도', '덕적도', '대연평도'], en: [] }, hours: { ko: '운항일 기준 06:00–21:00 · 기상에 따라 변동', en: '' },
      folder: 'incheon'
    },
    boryeong: {
      markerName: { ko: '보령', en: '' }, region: { ko: '충청남도', en: '' }, name: { ko: '대천항여객선터미널', en: '' }, shortName: { ko: '대천항', en: '' },
      description: { ko: '', en: '' }, address: { ko: '', en: '' }, routes: { ko: ['원산도', '삽시도', '장고도', '외연도'], en: [] }, hours: { ko: '', en: '' }, // TODO: 정보 확인 필요
      folder: 'boryeong'
    },
    gunsan: {
      markerName: { ko: '군산', en: '' }, region: { ko: '전북특별자치도', en: '' }, name: { ko: '군산항여객터미널', en: '' }, shortName: { ko: '군산항', en: '' },
      description: { ko: '고군산군도와 서해 섬을 연결하는 군산의 해상교통 거점입니다.', en: '' }, address: { ko: '전북특별자치도 군산시 군산항 일대', en: '' }, routes: { ko: ['어청도', '개야도', '선유도'], en: [] }, hours: { ko: '운항일 기준 06:00–20:00 · 노선별 상이', en: '' },
      folder: 'gunsan'
    },
    mokpo: {
      markerName: { ko: '목포', en: '' }, region: { ko: '전라남도', en: '' }, name: { ko: '목포연안여객선터미널', en: '' }, shortName: { ko: '목포항', en: '' },
      description: { ko: '', en: '' }, address: { ko: '', en: '' }, routes: { ko: ['제주', '홍도·흑산도', '비금·도초'], en: [] }, hours: { ko: '', en: '' }, // TODO: 정보 확인 필요
      folder: 'mokpo'
    },
    wando: {
      markerName: { ko: '완도', en: '' }, region: { ko: '전라남도', en: '' }, name: { ko: '완도항여객터미널', en: '' }, shortName: { ko: '완도항', en: '' },
      description: { ko: '청정 다도해와 제주를 잇는 전남 서남해안의 여객 관문입니다.', en: '' }, address: { ko: '전라남도 완도군 완도항 일대', en: '' }, routes: { ko: ['제주', '청산도', '노화도'], en: [] }, hours: { ko: '운항일 기준 05:30–20:00 · 노선별 상이', en: '' },
      folder: 'wando'
    },
    yeosu: {
      markerName: { ko: '여수', en: '' }, region: { ko: '전라남도', en: '' }, name: { ko: '여수항여객터미널', en: '' }, shortName: { ko: '여수항', en: '' },
      description: { ko: '아름다운 다도해 섬을 연결하는 남해안의 여객 관문입니다.', en: '' }, address: { ko: '전라남도 여수시 여수항 일대', en: '' }, routes: { ko: ['거문도', '금오도', '개도'], en: [] }, hours: { ko: '운항일 기준 06:00–20:00 · 노선별 상이', en: '' },
      folder: 'yeosu'
    },
    tongyeong: {
      markerName: { ko: '통영', en: '' }, region: { ko: '경상남도', en: '' }, name: { ko: '통영항여객터미널', en: '' }, shortName: { ko: '통영항', en: '' },
      description: { ko: '한려수도의 여러 섬으로 향하는 통영의 대표 여객터미널입니다.', en: '' }, address: { ko: '경상남도 통영시 통영항 일대', en: '' }, routes: { ko: ['욕지도', '한산도', '사량도'], en: [] }, hours: { ko: '운항일 기준 06:00–20:00 · 노선별 상이', en: '' },
      folder: 'tongyeong'
    },
    busan: {
      markerName: { ko: '부산', en: '' }, region: { ko: '부산광역시', en: '' }, name: { ko: '부산항연안여객터미널', en: '' }, shortName: { ko: '부산항', en: '' },
      description: { ko: '', en: '' }, address: { ko: '', en: '' }, routes: { ko: ['제주'], en: [] }, hours: { ko: '', en: '' }, // TODO: 정보 확인 필요
      folder: 'busan'
    },
    pohang: {
      markerName: { ko: '포항', en: '' }, region: { ko: '경상북도', en: '' }, name: { ko: '포항항여객터미널', en: '' }, shortName: { ko: '포항항', en: '' },
      description: { ko: '동해와 울릉도를 연결하는 경북 동해안의 바닷길 관문입니다.', en: '' }, address: { ko: '경상북도 포항시 포항항 일대', en: '' }, routes: { ko: ['울릉도'], en: [] }, hours: { ko: '운항일 기준 06:00–21:00 · 기상에 따라 변동', en: '' },
      folder: 'pohang'
    },
    jeju: {
      markerName: { ko: '제주', en: '' }, region: { ko: '제주특별자치도', en: '' }, name: { ko: '제주항여객터미널', en: '' }, shortName: { ko: '제주항', en: '' },
      description: { ko: '제주와 육지를 연결하는 대표적인 해상교통 관문입니다.', en: '' }, address: { ko: '제주특별자치도 제주시 임항로 111', en: '' }, routes: { ko: ['목포', '완도', '추자', '녹동'], en: [] }, hours: { ko: '매일 05:30–21:00 · 운항 일정에 따라 변동', en: '' },
      folder: 'jeju'
    }
  };

  const markers = [...document.querySelectorAll('.terminal-marker[data-terminal]')];
  if (!markers.length) return;

  const fields = {
    summary: document.getElementById('terminal-summary'),
    region: document.getElementById('terminal-region'),
    name: document.getElementById('terminal-name'),
    description: document.getElementById('terminal-description'),
    address: document.getElementById('terminal-address'),
    routes: document.getElementById('terminal-routes'),
    hours: document.getElementById('terminal-hours'),
    select: document.getElementById('terminal-select'),
    detail: document.getElementById('terminal-detail-link'),
    detailText: document.getElementById('terminal-detail-text'),
    schedule: document.getElementById('terminal-schedule-link'),
    guide: document.getElementById('terminal-guide-link'),
    directions: document.getElementById('terminal-directions-link'),
    facilities: document.getElementById('terminal-facilities-link')
  };

  function renderTerminalControls() {
    fields.select.replaceChildren();
    Object.entries(terminals).forEach(([id, terminal]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = localize(terminal.shortName);
      option.selected = id === 'jeju';
      fields.select.append(option);
    });
    markers.forEach((marker) => {
      const terminal = terminals[marker.dataset.terminal];
      if (terminal) marker.querySelector('span').textContent = localize(terminal.markerName);
    });
  }

  function renderRoutes(routes) {
    fields.routes.replaceChildren();
    (localize(routes) || []).forEach((route) => {
      const item = document.createElement('li');
      item.textContent = route;
      fields.routes.append(item);
    });
  }

  function selectTerminal(id) {
    const terminal = terminals[id];
    if (!terminal) return;

    markers.forEach((marker) => {
      const selected = marker.dataset.terminal === id;
      marker.classList.toggle('active', selected);
      marker.setAttribute('aria-pressed', String(selected));
    });

    fields.select.value = id;
    fields.region.textContent = localize(terminal.region);
    fields.name.textContent = localize(terminal.name);
    fields.description.textContent = localize(terminal.description);
    fields.address.textContent = localize(terminal.address);
    fields.hours.textContent = localize(terminal.hours);
    renderRoutes(terminal.routes);

    const base = terminal.folder;
    fields.detail.href = base + '/index.html';
    fields.detailText.textContent = t('portal.homepage', { name: localize(terminal.shortName) });
    fields.schedule.href = base + '/index.html#schedule';
    fields.guide.href = base + '/guide.html';
    fields.directions.href = base + '/guide.html#directions';
    fields.facilities.href = base + '/guide.html#facilities';
    fields.summary.hidden = false;
    fields.summary.setAttribute('aria-busy', 'false');
  }

  markers.forEach((marker) => {
    marker.addEventListener('click', () => selectTerminal(marker.dataset.terminal));
  });
  renderTerminalControls();
  fields.select.addEventListener('change', () => selectTerminal(fields.select.value));
  selectTerminal(fields.select.value || 'jeju');
}());
