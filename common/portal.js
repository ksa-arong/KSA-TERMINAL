(function () {
  'use strict';

  const hero = document.querySelector('.portal-hero');
  const heroSlides = [...document.querySelectorAll('.portal-hero-slide')];
  const heroButtons = [...document.querySelectorAll('[data-hero-slide]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      region: '인천광역시',
      name: '인천항 연안여객터미널',
      shortName: '인천항',
      description: '서해 5도와 수도권을 잇는 섬 여행의 출발점입니다.',
      address: '인천광역시 중구 연안부두로 70',
      routes: ['백령도', '덕적도', '대연평도'],
      hours: '운항일 기준 06:00–21:00 · 기상에 따라 변동',
      folder: 'incheon'
    },
    boryeong: {
      region: '충청남도',
      name: '대천항여객선터미널',
      shortName: '대천항',
      description: '', // TODO: 한 줄 설명
      address: '', // TODO: 정확한 주소 확인 필요
      routes: ['원산도', '삽시도', '장고도', '외연도'], // TODO: 실제 운항 노선 확인
      hours: '', // TODO: 운영시간 확인
      folder: 'boryeong'
    },
    gunsan: {
      region: '전북특별자치도',
      name: '군산항여객터미널',
      shortName: '군산항',
      description: '고군산군도와 서해 섬을 연결하는 군산의 해상교통 거점입니다.',
      address: '전북특별자치도 군산시 군산항 일대',
      routes: ['어청도', '개야도', '선유도'],
      hours: '운항일 기준 06:00–20:00 · 노선별 상이',
      folder: 'gunsan'
    },
    mokpo: {
      region: '전라남도',
      name: '목포연안여객선터미널',
      shortName: '목포항',
      description: '', // TODO
      address: '', // TODO
      routes: ['제주', '홍도·흑산도', '비금·도초'], // TODO: 확인
      hours: '', // TODO
      folder: 'mokpo'
    },
    wando: {
      region: '전라남도',
      name: '완도항여객터미널',
      shortName: '완도항',
      description: '청정 다도해와 제주를 잇는 전남 서남해안의 여객 관문입니다.',
      address: '전라남도 완도군 완도항 일대',
      routes: ['제주', '청산도', '노화도'],
      hours: '운항일 기준 05:30–20:00 · 노선별 상이',
      folder: 'wando'
    },
    yeosu: {
      region: '전라남도',
      name: '여수항여객터미널',
      shortName: '여수항',
      description: '아름다운 다도해 섬을 연결하는 남해안의 여객 관문입니다.',
      address: '전라남도 여수시 여수항 일대',
      routes: ['거문도', '금오도', '개도'],
      hours: '운항일 기준 06:00–20:00 · 노선별 상이',
      folder: 'yeosu'
    },
    tongyeong: {
      region: '경상남도',
      name: '통영항여객터미널',
      shortName: '통영항',
      description: '한려수도의 여러 섬으로 향하는 통영의 대표 여객터미널입니다.',
      address: '경상남도 통영시 통영항 일대',
      routes: ['욕지도', '한산도', '사량도'],
      hours: '운항일 기준 06:00–20:00 · 노선별 상이',
      folder: 'tongyeong'
    },
    busan: {
      region: '부산광역시',
      name: '부산항연안여객터미널',
      shortName: '부산항',
      description: '', // TODO
      address: '', // TODO
      routes: ['제주'], // TODO: 확인
      hours: '', // TODO
      folder: 'busan'
    },
    pohang: {
      region: '경상북도',
      name: '포항항여객터미널',
      shortName: '포항항',
      description: '동해와 울릉도를 연결하는 경북 동해안의 바닷길 관문입니다.',
      address: '경상북도 포항시 포항항 일대',
      routes: ['울릉도'],
      hours: '운항일 기준 06:00–21:00 · 기상에 따라 변동',
      folder: 'pohang'
    },
    jeju: {
      region: '제주특별자치도',
      name: '제주항여객터미널',
      shortName: '제주항',
      description: '제주와 육지를 연결하는 대표적인 해상교통 관문입니다.',
      address: '제주특별자치도 제주시 임항로 111',
      routes: ['목포', '완도', '추자', '녹동'],
      hours: '매일 05:30–21:00 · 운항 일정에 따라 변동',
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

  function renderRoutes(routes) {
    fields.routes.replaceChildren();
    routes.forEach((route) => {
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
    fields.region.textContent = terminal.region;
    fields.name.textContent = terminal.name;
    fields.description.textContent = terminal.description;
    fields.address.textContent = terminal.address;
    fields.hours.textContent = terminal.hours;
    renderRoutes(terminal.routes);

    const base = terminal.folder;
    fields.detail.href = base + '/index.html';
    fields.detailText.textContent = terminal.shortName + ' 홈페이지 바로가기';
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
  fields.select.addEventListener('change', () => selectTerminal(fields.select.value));
  selectTerminal(fields.select.value || 'jeju');
}());
