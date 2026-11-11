const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('통합 메인은 히어로부터 푸터까지 강제 스냅 없이 일반 문서 스크롤을 사용한다', () => {
  const styles = fs.readFileSync(path.join(root, 'common', 'style.css'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'common', 'portal-v2.js'), 'utf8');

  assert.doesNotMatch(
    styles,
    /html\.portal-v2-scroll\s*\{[^}]*scroll-snap-type:/s
  );
  assert.doesNotMatch(
    styles,
    /\.(?:portal-v2-hero|portal-v2-content|portal-v2-guide|portal-v2-snap-section(?:\.portal-v2-snap-section--notices)?)\s*\{[^}]*(?:scroll-snap-align|scroll-snap-stop):/s
  );
  assert.doesNotMatch(
    script,
    /(?:window|document)\.addEventListener\(\s*['"](?:wheel|mousewheel|touchmove)['"]/
  );
});

test('SCROLL DOWN 링크는 헤더 높이를 한 번만 보정해 두 번째 섹션으로 이동한다', () => {
  const styles = fs.readFileSync(path.join(root, 'common', 'style.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(
    styles,
    /html\.portal-v2-scroll\s*\{[^}]*scroll-padding-top:\s*var\(--portal-v2-header-height\);/s
  );
  assert.doesNotMatch(styles, /\.portal-v2-guide\s*\{[^}]*scroll-margin-top:/s);
  assert.match(html, /class="portal-v2-scroll-cue"\s+href="#portal-v2-content"/);
  assert.match(html, /id="portal-v2-content"/);
});

function loadPortalV2() {
  const window = {};
  const context = vm.createContext({ window });
  const resolverFile = path.join(root, 'common', 'path-resolver.js');
  const file = path.join(root, 'common', 'portal-v2.js');

  if (fs.existsSync(file)) {
    vm.runInContext(fs.readFileSync(resolverFile, 'utf8'), context, { filename: 'common/path-resolver.js' });
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: 'common/portal-v2.js' });
  }

  return context.window.PortalV2;
}

function loadWeatherData() {
  const window = {};
  const context = vm.createContext({ window });
  const file = path.join(root, 'common', 'weather-data.js');

  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: 'common/weather-data.js' });
  return context.window.PORTAL_WEATHER_FALLBACK_DATA;
}

function loadPortalData() {
  const window = {};
  const context = vm.createContext({ window, console });

  ['menu-data.js', 'portal-data.js'].forEach((name) => {
    const file = path.join(root, 'common', name);
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: `common/${name}` });
  });

  return context.window.PORTAL_DATA;
}

test('목포 연안여객선터미널은 포털 상세 패널에 표시할 주소를 제공한다', () => {
  const portalData = loadPortalData();
  const terminal = portalData.regions.mokpo.terminals.find((item) => item.id === 'mokpo-coastal');

  assert.equal(terminal.address.ko, '전남광주통합특별시 목포시 해안로 182');
});

test('터미널 편의 정보 링크는 선택 지역의 공통 안내 페이지를 사용한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(
    portalV2.getTerminalGuideHref('regions/jeju/index.html'),
    'regions/jeju/guide.html'
  );
  assert.equal(
    portalV2.getTerminalGuideHref('terminal/map.html'),
    'terminal/map.html'
  );
});

test('퀵메뉴 페이지 이동은 표시 카드 수에 맞춰 처음과 끝을 순환한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getQuickMenuPage(0, 1, 6, 3), 1);
  assert.equal(portalV2.getQuickMenuPage(1, 1, 6, 3), 0);
  assert.equal(portalV2.getQuickMenuPage(0, -1, 6, 3), 1);
  assert.equal(portalV2.getQuickMenuPage(0, 1, 6, 1), 1);
});

test('퀵메뉴는 데스크톱 한 줄에 모든 카드를 표시하고 작은 화면에서 열 수를 줄인다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getQuickMenuVisibleCount(1280), 6);
  assert.equal(portalV2.getQuickMenuVisibleCount(900), 3);
  assert.equal(portalV2.getQuickMenuVisibleCount(600), 1);
  assert.equal(portalV2.getQuickMenuVisibleCount(1280, 5), 5);
});

test('퀵메뉴 이동 화살표는 초기화 전에는 노출되지 않는다', () => {
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(indexHtml, /<button[^>]*data-v2-quick-prev[^>]*hidden[^>]*>/);
  assert.match(indexHtml, /<button[^>]*data-v2-quick-next[^>]*hidden[^>]*>/);
});

test('메인 FAQ 영역은 대표 질문 10개를 해당 답변 앵커로 연결한다', () => {
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const faqHtml = fs.readFileSync(path.join(root, 'customer', 'faq.html'), 'utf8');
  const anchors = [
    'faq-booking-ticket',
    'faq-boarding-status',
    'faq-booking-vehicle',
    'faq-boarding-id',
    'faq-booking-refund',
    'faq-terminal-location',
    'faq-boarding-arrival',
    'faq-boarding-baggage',
    'faq-boarding-pet',
    'faq-lost-found-contact'
  ];

  anchors.forEach((anchor) => {
    assert.match(indexHtml, new RegExp(`customer/faq\\.html#${anchor}`));
    assert.match(faqHtml, new RegExp(`id=["']${anchor}["']`));
  });
  assert.equal((indexHtml.match(/data-v2-help-question(?=[\s>])/g) || []).length, 10);
});

test('FAQ 휠은 스크롤 영역 중앙에 가장 가까운 질문을 강조한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getNearestHelpQuestionIndex(160, [48, 112, 176, 240]), 2);
  assert.equal(portalV2.getNearestHelpQuestionIndex(50, [48, 112, 176]), 0);
  assert.equal(portalV2.getNearestHelpQuestionIndex(160, []), 0);
});

test('FAQ 휠 입력 한 번은 현재 질문의 바로 위나 아래 한 항목만 선택한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getHelpQuestionWheelTargetIndex(12, 1, 30), 13);
  assert.equal(portalV2.getHelpQuestionWheelTargetIndex(12, -1, 30), 11);
  assert.equal(portalV2.getHelpQuestionWheelTargetIndex(0, -1, 30), 0);
  assert.equal(portalV2.getHelpQuestionWheelTargetIndex(29, 1, 30), 29);
});

test('FAQ 휠은 시작할 때 위아래 질문이 함께 보이도록 세 번째 질문을 중앙에 배치한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getInitialHelpQuestionIndex(10), 2);
  assert.equal(portalV2.getInitialHelpQuestionIndex(2), 1);
  assert.equal(portalV2.getInitialHelpQuestionIndex(1), 0);
  assert.equal(portalV2.getInitialHelpQuestionIndex(0), 0);
});

test('FAQ 휠은 복제 목록 경계에서 같은 원본 질문 위치로 순환한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getHelpQuestionLoopOffset('before', 520), 520);
  assert.equal(portalV2.getHelpQuestionLoopOffset('after', 520), -520);
  assert.equal(portalV2.getHelpQuestionLoopOffset('', 520), 0);
  assert.equal(portalV2.getHelpQuestionLoopOffset('before', 0), 0);
});

test('FAQ 휠은 순환 위치를 보정하는 한 프레임 동안 smooth·snap·transition을 중지한다', () => {
  const portalV2 = loadPortalV2();
  const classes = new Set();
  const frames = [];
  const questionList = {
    scrollTop: 120,
    style: { scrollBehavior: '', scrollSnapType: '' },
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); }
    }
  };

  portalV2.applyHelpQuestionLoopOffset(questionList, 520, (callback) => frames.push(callback));

  assert.equal(questionList.scrollTop, 640);
  assert.equal(questionList.style.scrollBehavior, 'auto');
  assert.equal(questionList.style.scrollSnapType, 'none');
  assert.equal(classes.has('is-loop-resetting'), true);

  frames[0]();

  assert.equal(questionList.style.scrollBehavior, '');
  assert.equal(questionList.style.scrollSnapType, '');
  assert.equal(classes.has('is-loop-resetting'), false);
});

test('FAQ 휠은 스크롤이 멈춘 뒤에만 기존 순환 보정을 한 번 실행한다', () => {
  const portalV2 = loadPortalV2();
  const cleared = [];
  const scheduled = [];
  const callback = () => {};

  const timerId = portalV2.scheduleHelpQuestionLoopReset(
    17,
    (id) => cleared.push(id),
    (handler, delay) => {
      scheduled.push({ handler, delay });
      return 23;
    },
    callback
  );

  assert.deepEqual(cleared, [17]);
  assert.equal(timerId, 23);
  assert.equal(scheduled.length, 1);
  assert.equal(scheduled[0].handler, callback);
  assert.equal(scheduled[0].delay, 140);
});

test('FAQ 휠은 중앙 거리 단계에 따라 투명도·크기·흐림을 대칭적으로 감쇠한다', () => {
  const portalV2 = loadPortalV2();

  assert.deepEqual(
    JSON.parse(JSON.stringify(portalV2.getHelpQuestionVisualState(160, 320, 160))),
    { opacity: 1, scale: 1.04, blur: 0 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(portalV2.getHelpQuestionVisualState(160, 320, 108))),
    { opacity: 0.74, scale: 0.96, blur: 0.3 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(portalV2.getHelpQuestionVisualState(160, 320, 56))),
    { opacity: 0.42, scale: 0.91, blur: 0.7 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(portalV2.getHelpQuestionVisualState(160, 320, 212))),
    { opacity: 0.74, scale: 0.96, blur: 0.3 }
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(portalV2.getHelpQuestionVisualState(160, 320, 264))),
    { opacity: 0.42, scale: 0.91, blur: 0.7 }
  );
});

test('FAQ 휠은 마스크와 부드러운 스냅을 사용하고 별도 하단 화살표를 표시하지 않는다', () => {
  const styles = fs.readFileSync(path.join(root, 'common', 'style.css'), 'utf8');

  assert.match(styles, /\.portal-v2-help__questions\s*\{[^}]*mask-image:\s*linear-gradient\(/s);
  assert.match(styles, /\.portal-v2-help__questions\s*\{[^}]*scroll-snap-type:\s*y proximity;/s);
  assert.match(styles, /\.portal-v2-help__questions a\s*\{[^}]*scroll-snap-align:\s*center;/s);
  assert.doesNotMatch(styles, /\.portal-v2-help__card\.has-more-questions::after/);
});

test('날씨 상태 문구를 준비된 Meteocons 아이콘 경로로 변환한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.resolveWeatherIcon('맑음'), 'common/images/weather/clear-day.svg');
  assert.equal(portalV2.resolveWeatherIcon('구름 조금'), 'common/images/weather/partly-cloudy-day.svg');
  assert.equal(portalV2.resolveWeatherIcon('구름 많음'), 'common/images/weather/cloudy.svg');
  assert.equal(portalV2.resolveWeatherIcon('흐림'), 'common/images/weather/overcast.svg');
  assert.equal(portalV2.resolveWeatherIcon('흐리고 한때 비'), 'common/images/weather/overcast-rain.svg');
  assert.equal(portalV2.resolveWeatherIcon('뇌우'), 'common/images/weather/extreme-thunderstorms.svg');
  assert.equal(portalV2.resolveWeatherIcon('눈'), 'common/images/weather/snow.svg');
  assert.equal(portalV2.resolveWeatherIcon('안개'), 'common/images/weather/fog-day.svg');
  assert.equal(portalV2.resolveWeatherIcon('황사'), 'common/images/weather/dust-day.svg');
});

test('지역별 대표 해역은 서로 다른 현재 날씨 상태를 제공한다', () => {
  const weatherData = loadWeatherData();
  const conditions = weatherData.areas.map((area) => area.routes[0].forecast[0].condition);

  assert.ok(new Set(conditions).size > 1);
});

test('항로 소요시간의 시분 형식을 읽기 쉬운 한글로 표시한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.formatRouteDuration('04:30'), '4시간 30분');
  assert.equal(portalV2.formatRouteDuration('02:00'), '2시간');
  assert.equal(portalV2.formatRouteDuration('일정별 상이'), '일정별 상이');
});

test('항로 운항 횟수를 일일 운항 정보로 표시한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.formatRouteFrequency('2회'), '1일 2회 운항');
  assert.equal(portalV2.formatRouteFrequency('1일 2회 운항'), '1일 2회 운항');
  assert.equal(portalV2.formatRouteFrequency(''), '운항 일정 확인');
});

test('지역을 선택하면 해당 지역의 히어로 이미지와 터미널 요약을 제공한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(typeof portalV2?.buildRegionView, 'function');

  const view = portalV2.buildRegionView('mokpo', {
    regions: {
      mokpo: {
        id: 'mokpo',
        region: { ko: '전라남도' },
        label: { ko: '목포' },
        summaryName: { ko: '목포 여객선 터미널' },
        phone: '1666-0910',
        terminals: [{
          name: { ko: '목포항 연안여객선터미널' },
          description: { ko: '서남해 섬 여행을 시작하는 관문입니다.' },
          folder: 'mokpo'
        }]
      }
    }
  }, [{ key: 'mokpo', folder: 'mokpo', nameKo: '목포' }]);

  assert.equal(view.regionId, 'mokpo');
  assert.equal(view.regionName, '목포');
  assert.equal(view.province, '전라남도');
  assert.equal(view.terminalName, '목포항 연안여객선터미널');
  assert.equal(view.description, '서남해 섬 여행을 시작하는 관문입니다.');
  assert.equal(view.phone, '1666-0910');
  assert.equal(view.href, 'regions/mokpo/index.html');
  assert.equal(view.image, 'common/images/portal-hero-mokpo-coastal-aerial.png');
});

test('터미널 제목은 이름 앞에 선택 지역명을 함께 표시한다', () => {
  const portalV2 = loadPortalV2();

  const view = portalV2.buildRegionView('jeju', {
    regions: {
      jeju: {
        label: { ko: '제주' },
        terminals: [{
          id: 'jeju-coastal',
          type: 'coastal',
          name: { ko: '연안여객터미널' },
          folder: 'jeju'
        }]
      }
    }
  }, [{ key: 'jeju', folder: 'jeju' }]);

  assert.equal(view.terminalName, '제주 연안여객터미널');
});

test('선택한 지역을 화면에 적용하고 지도와 지역 버튼의 선택 상태를 동기화한다', () => {
  const portalV2 = loadPortalV2();
  const elements = {
    '[data-v2-region-image]': { src: '', alt: '' },
    '[data-v2-region-name]': { textContent: '' },
    '[data-v2-province]': { textContent: '' },
    '[data-v2-terminal-name]': { textContent: '' },
    '[data-v2-region-phone]': { textContent: '', href: '' },
    '[data-v2-region-link]': { href: '' }
  };
  const controls = ['incheon', 'mokpo'].map((regionId) => ({
    dataset: { regionId },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; }
  }));
  const rootElement = {
    querySelector(selector) { return elements[selector] || null; },
    querySelectorAll() { return controls; }
  };
  const view = {
    regionId: 'mokpo',
    regionName: '목포',
    province: '전라남도',
    terminalName: '목포항 연안여객선터미널',
    description: '서남해 섬 여행을 시작하는 관문입니다.',
    phone: '1666-0910',
    href: 'regions/mokpo/index.html',
    image: 'common/images/portal-hero-mokpo-coastal-aerial.png',
    imageAlt: '목포 여객선터미널과 바다 풍경'
  };

  portalV2.applyRegionView(rootElement, view);

  assert.equal(elements['[data-v2-region-image]'].src, view.image);
  assert.equal(elements['[data-v2-region-image]'].alt, view.imageAlt);
  assert.equal(elements['[data-v2-region-name]'].textContent, '목포');
  assert.equal(elements['[data-v2-terminal-name]'].textContent, '목포항 연안여객선터미널');
  assert.equal(elements['[data-v2-region-phone]'].href, 'tel:16660910');
  assert.equal(elements['[data-v2-region-link]'].href, 'regions/mokpo/index.html');
  assert.equal(controls[0].attributes['aria-pressed'], 'false');
  assert.equal(controls[1].attributes['aria-pressed'], 'true');
  assert.equal(controls[0].dataset.selectedTerminalName, undefined);
  assert.equal(controls[1].dataset.selectedTerminalName, '목포항 연안여객선터미널');
});

test('히어로 이미지는 새 이미지를 준비한 뒤 기존 이미지 위로 자연스럽게 교체한다', () => {
  const portalV2 = loadPortalV2();
  const classes = new Set();
  const stageClasses = new Set();
  const scheduled = [];
  const preload = {};
  const stage = {
    style: {},
    classList: {
      add(name) { stageClasses.add(name); },
      remove(name) { stageClasses.delete(name); }
    }
  };
  const image = {
    src: 'old.jpg',
    alt: '기존 이미지',
    parentElement: stage,
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); }
    }
  };

  portalV2.transitionHeroImage(image, 'next.jpg', '새 이미지', {
    createImage: () => preload,
    schedule(callback) { scheduled.push(callback); }
  });

  assert.equal(preload.src, 'next.jpg');
  assert.equal(image.src, 'old.jpg');

  preload.onload();
  assert.equal(classes.has('is-switching'), true);
  assert.equal(stageClasses.has('is-hero-transitioning'), true);
  assert.equal(stage.style.backgroundImage, 'url("old.jpg")');

  scheduled.shift()();
  assert.equal(image.src, 'next.jpg');
  assert.equal(image.alt, '새 이미지');

  scheduled.shift()();
  assert.equal(classes.has('is-switching'), false);

  scheduled.shift()();
  assert.equal(stageClasses.has('is-hero-transitioning'), false);
  assert.equal(stage.style.backgroundImage, '');
});

test('최초에는 전국 지도를 유지하고 지역을 누르면 상세 정보와 지도 확대를 함께 적용한다', () => {
  const portalV2 = loadPortalV2();
  const listeners = {};
  const mapClasses = new Set();
  const map = {
    dataset: {},
    classList: {
      add(name) { mapClasses.add(name); },
      remove(name) { mapClasses.delete(name); },
      contains(name) { return mapClasses.has(name); }
    },
    removeAttribute(name) {
      if (name === 'data-zoom-region') delete this.dataset.zoomRegion;
    }
  };
  const controls = ['incheon', 'jeju'].map((regionId) => ({
    dataset: { regionId },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(type, listener) { listeners[regionId] = listener; }
  }));
  const fields = new Map([
    ['[data-v2-region-image]', { src: '', alt: '' }],
    ['[data-v2-region-name]', { textContent: '' }],
    ['[data-v2-province]', { textContent: '' }],
    ['[data-v2-terminal-name]', { textContent: '' }],
    ['[data-v2-region-phone]', { textContent: '', href: '' }],
    ['[data-v2-region-link]', { href: '' }]
  ]);
  const rootElement = {
    querySelector(selector) {
      if (selector === '.portal-v2-map') return map;
      return fields.get(selector) || null;
    },
    querySelectorAll() { return controls; }
  };
  const portalData = {
    regions: {
      incheon: { label: { ko: '인천' }, terminals: [{ name: { ko: '인천항' }, folder: 'incheon' }] },
      jeju: { label: { ko: '제주' }, terminals: [{ name: { ko: '제주항' }, folder: 'jeju' }] }
    }
  };
  const registry = [
    { key: 'incheon', folder: 'incheon', isDefault: true },
    { key: 'jeju', folder: 'jeju' }
  ];

  portalV2.init(rootElement, portalData, registry);
  assert.equal(fields.get('[data-v2-region-name]').textContent, '');
  assert.equal(controls[0].attributes['aria-pressed'], 'false');
  assert.equal(controls[1].attributes['aria-pressed'], 'false');
  assert.equal(mapClasses.has('is-region-zoomed'), false);

  listeners.jeju();
  assert.equal(fields.get('[data-v2-region-name]').textContent, '제주');
  assert.equal(controls[0].attributes['aria-pressed'], 'false');
  assert.equal(controls[1].attributes['aria-pressed'], 'true');
  assert.equal(mapClasses.has('is-region-zoomed'), true);
  assert.equal(map.dataset.zoomRegion, 'jeju');
});

test('같은 지역 정보가 여러 위치에 표시되면 모든 위치를 함께 갱신한다', () => {
  const portalV2 = loadPortalV2();
  const regionNames = [{ textContent: '' }, { textContent: '' }];
  const rootElement = {
    querySelector() { return null; },
    querySelectorAll(selector) {
      if (selector === '[data-v2-region-name]') return regionNames;
      return [];
    }
  };

  portalV2.applyRegionView(rootElement, {
    regionId: 'jeju',
    regionName: '제주',
    province: '',
    terminalName: '',
    description: '',
    phone: '',
    href: '',
    image: '',
    imageAlt: ''
  });

  assert.deepEqual(regionNames.map((element) => element.textContent), ['제주', '제주']);
});

test('선택 지역의 해상 날씨를 대표 항로 기준으로 제공한다', () => {
  const portalV2 = loadPortalV2();
  const view = portalV2.buildRegionView('mokpo', {
    regions: {
      mokpo: {
        label: { ko: '목포' },
        terminals: [{ name: { ko: '목포항' }, folder: 'mokpo' }]
      }
    }
  }, [{ key: 'mokpo', folder: 'mokpo' }], {
    updatedAt: '2026년 9월 2일 13:37 기준',
    areas: [{
      id: 'mokpo',
      routes: [{
        label: '서해남부앞바다',
        current: { temperature: 22.7, wind: 8.6, direction: '남동' },
        observation: { visibility: 20000 },
        status: { level: 'success', label: '비교적 안정' },
        advisories: [{
          level: 'warning',
          title: '풍랑주의보 발표',
          note: '출항 전 운항정보를 확인하세요.'
        }],
        forecast: [{ condition: '구름 많음', waveMin: 0.9, waveMax: 1.8 }]
      }]
    }]
  });

  assert.deepEqual(JSON.parse(JSON.stringify(view.weather)), {
    area: '서해남부앞바다',
    condition: '구름 많음',
    temperature: '22.7℃',
    direction: '남동',
    windSpeed: '8.6m/s',
    wind: '남동 8.6m/s',
    wave: '0.9~1.8m',
    visibility: '20km',
    statusLevel: 'success',
    statusLabel: '운항 정상',
    advisory: {
      level: 'warning',
      title: '풍랑주의보 발표',
      message: '출항 전 운항정보를 확인하세요.'
    },
    updatedAt: '2026년 9월 2일 13:37 기준'
  });
});

test('지역별 날씨 데이터가 있으면 인접 지역 fallback보다 해당 지역을 우선한다', () => {
  const portalV2 = loadPortalV2();
  const weatherData = {
    areas: [
      {
        id: 'incheon',
        routes: [{
          label: '인천·경기앞바다',
          current: { temperature: 21.4, wind: 7.1, direction: '서' },
          forecast: [{ condition: '맑음', waveMin: 0.7, waveMax: 1.2 }]
        }]
      },
      {
        id: 'boryeong',
        routes: [{
          label: '충남북부앞바다',
          current: { temperature: 23.2, wind: 5.4, direction: '남동' },
          forecast: [{ condition: '구름 많음', waveMin: 0.5, waveMax: 0.9 }]
        }]
      }
    ]
  };
  const view = portalV2.buildRegionView('incheon', {
    regions: {
      incheon: {
        label: { ko: '인천' },
        terminals: [{ name: { ko: '연안여객터미널' } }]
      }
    }
  }, [{ key: 'incheon', folder: 'incheon' }], weatherData);

  assert.equal(view.weather.area, '인천·경기앞바다');
  assert.equal(view.weather.temperature, '21.4℃');
  assert.equal(view.weather.direction, '서');
});

test('같은 지역의 터미널마다 등록된 해역 예보를 순서대로 연결한다', () => {
  const portalV2 = loadPortalV2();
  const view = portalV2.buildRegionView('jeju', {
    regions: {
      jeju: {
        label: { ko: '제주' },
        terminals: [
          { id: 'jeju-coastal', type: 'coastal', name: { ko: '연안여객터미널' } },
          { id: 'jeju-international', type: 'international', name: { ko: '국제여객터미널' } }
        ]
      }
    }
  }, [{ key: 'jeju', folder: 'jeju' }], {
    updatedAt: '2026년 9월 2일 13:37 기준',
    areas: [{
      id: 'jeju',
      routes: [
        { label: '제주도북부앞바다', current: { temperature: 22.8, wind: 8.2, direction: '동' }, observation: { visibility: 20000 }, forecast: [{ condition: '구름 많음', waveMin: 0.6, waveMax: 1.5 }] },
        { label: '제주도동부앞바다', current: { temperature: 21.9, wind: 11.3, direction: '동-남동' }, observation: { visibility: 16000 }, forecast: [{ condition: '흐리고 한때 비', waveMin: 1.7, waveMax: 2.6 }] }
      ]
    }]
  });

  assert.equal(view.terminalWeather[0].area, '제주도북부앞바다');
  assert.equal(view.terminalWeather[1].area, '제주도동부앞바다');
});

test('해역 예보 수보다 터미널이 많아도 모든 터미널의 날씨 표시값은 서로 다르다', () => {
  const portalV2 = loadPortalV2();
  const terminals = ['coastal', 'international', 'seogwipo', 'extra'].map((type, index) => ({
    id: `jeju-${type}`,
    type,
    name: { ko: `제주 터미널 ${index + 1}` }
  }));
  const view = portalV2.buildRegionView('jeju', {
    regions: { jeju: { label: { ko: '제주' }, terminals } }
  }, [{ key: 'jeju', folder: 'jeju' }], {
    areas: [{
      id: 'jeju',
      routes: [
        { label: '제주도북부앞바다', current: { temperature: 22.8, wind: 8.2, direction: '동' }, observation: { visibility: 20000 }, forecast: [{ condition: '구름 조금', waveMin: 0.6, waveMax: 1.5 }] },
        { label: '제주도동부앞바다', current: { temperature: 21.9, wind: 11.3, direction: '동-남동' }, observation: { visibility: 16000 }, forecast: [{ condition: '흐림', waveMin: 1.7, waveMax: 2.6 }] }
      ]
    }]
  });
  const signatures = view.terminalWeather.map((weather) => [
    weather.temperature,
    weather.windSpeed,
    weather.wave,
    weather.visibility
  ].join('|'));

  assert.equal(new Set(signatures).size, terminals.length);
  assert.equal(new Set(view.terminalWeather.map((weather) => weather.condition)).size, terminals.length);
});

test('지역 변경 시 날씨 상태와 관측값을 화면에 함께 반영한다', () => {
  const portalV2 = loadPortalV2();
  const weatherFields = {
    '[data-v2-weather-area]': { textContent: '' },
    '[data-v2-weather-condition]': { textContent: '' },
    '[data-v2-weather-temperature]': { textContent: '' },
    '[data-v2-weather-updated]': { textContent: '' },
    '[data-v2-weather-direction]': { textContent: '' },
    '[data-v2-weather-speed]': { textContent: '' },
    '[data-v2-weather-wind]': { textContent: '' },
    '[data-v2-weather-wave]': { textContent: '' },
    '[data-v2-weather-visibility]': { textContent: '' },
    '[data-v2-weather-status]': { textContent: '', dataset: {} },
    '[data-v2-weather-advisory]': { textContent: '', dataset: {}, hidden: true },
    '[data-v2-weather-icon]': { src: '', alt: '' }
  };
  const rootElement = {
    querySelector(selector) { return weatherFields[selector] || null; },
    querySelectorAll() { return []; }
  };

  portalV2.applyRegionView(rootElement, {
    regionId: 'mokpo',
    regionName: '목포',
    province: '',
    terminalName: '',
    description: '',
    phone: '',
    href: '',
    image: '',
    imageAlt: '',
    weather: {
      area: '서해남부앞바다',
      condition: '구름 많음',
      temperature: '22.7℃',
      direction: '남동',
      windSpeed: '8.6m/s',
      wind: '남동 8.6m/s',
      wave: '0.9~1.8m',
      visibility: '20km',
      statusLevel: 'success',
      statusLabel: '운항 정상',
      advisory: {
        level: 'warning',
        title: '풍랑주의보 발표',
        message: '출항 전 운항정보를 확인하세요.'
      },
      updatedAt: '2026년 9월 2일 13:37 기준'
    }
  });

  assert.equal(weatherFields['[data-v2-weather-area]'].textContent, '서해남부앞바다');
  assert.equal(weatherFields['[data-v2-weather-temperature]'].textContent, '22.7℃');
  assert.equal(weatherFields['[data-v2-weather-direction]'].textContent, '남동');
  assert.equal(weatherFields['[data-v2-weather-speed]'].textContent, '8.6m/s');
  assert.equal(weatherFields['[data-v2-weather-wind]'].textContent, '남동 8.6m/s');
  assert.equal(weatherFields['[data-v2-weather-wave]'].textContent, '0.9~1.8m');
  assert.equal(weatherFields['[data-v2-weather-visibility]'].textContent, '20km');
  assert.equal(weatherFields['[data-v2-weather-status]'].textContent, '운항 정상');
  assert.equal(weatherFields['[data-v2-weather-status]'].dataset.level, 'success');
  assert.equal(weatherFields['[data-v2-weather-advisory]'].textContent, '풍랑주의보 발표 · 출항 전 운항정보를 확인하세요.');
  assert.equal(weatherFields['[data-v2-weather-advisory]'].dataset.level, 'warning');
  assert.equal(weatherFields['[data-v2-weather-advisory]'].hidden, false);
  assert.equal(weatherFields['[data-v2-weather-icon]'].src, 'common/images/weather/cloudy.svg');
  assert.equal(weatherFields['[data-v2-weather-icon]'].alt, '구름 많음 날씨 아이콘');
});

test('시안 페이지가 지정한 지역을 기본 선택으로 우선한다', () => {
  const portalV2 = loadPortalV2();
  const regionName = { textContent: '' };
  const controls = ['incheon', 'jeju'].map((regionId) => ({
    dataset: { regionId },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener() {}
  }));
  const rootElement = {
    dataset: { initialRegionId: 'jeju' },
    querySelector(selector) {
      if (selector === '[data-v2-region-name]') return regionName;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-region-id]') return controls;
      return [];
    }
  };
  const portalData = {
    regions: {
      incheon: { label: { ko: '인천' }, terminals: [{ name: { ko: '인천항' } }] },
      jeju: { label: { ko: '제주' }, terminals: [{ name: { ko: '제주항' } }] }
    }
  };

  portalV2.init(rootElement, portalData, [
    { key: 'incheon', isDefault: true },
    { key: 'jeju' }
  ]);

  assert.equal(regionName.textContent, '제주');
  assert.equal(controls[0].attributes['aria-pressed'], 'false');
  assert.equal(controls[1].attributes['aria-pressed'], 'true');
});

test('같은 지역을 다시 선택해도 확대를 유지하고 전국 지도 명령으로만 초기화한다', () => {
  const portalV2 = loadPortalV2();
  const classes = new Set();
  const map = {
    dataset: {},
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); }
    },
    removeAttribute(name) {
      if (name === 'data-zoom-region') delete this.dataset.zoomRegion;
    }
  };
  const rootElement = {
    querySelector(selector) { return selector === '.portal-v2-map' ? map : null; }
  };

  portalV2.toggleMapZoom(rootElement, 'mokpo');
  assert.equal(classes.has('is-region-zoomed'), true);
  assert.equal(map.dataset.zoomRegion, 'mokpo');

  portalV2.toggleMapZoom(rootElement, 'mokpo');
  assert.equal(classes.has('is-region-zoomed'), true);
  assert.equal(map.dataset.zoomRegion, 'mokpo');

  portalV2.toggleMapZoom(rootElement);
  assert.equal(classes.has('is-region-zoomed'), false);
  assert.equal(map.dataset.zoomRegion, undefined);
});

test('확대 지도의 지역·터미널 마커는 확대를 유지하고 빈 영역만 전국 지도로 돌아간다', () => {
  const portalV2 = loadPortalV2();
  const classes = new Set(['is-region-zoomed']);
  const map = {
    dataset: { zoomRegion: 'mokpo' },
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); }
    },
    removeAttribute(name) {
      if (name === 'data-zoom-region') delete this.dataset.zoomRegion;
    }
  };
  const rootElement = {
    querySelector(selector) { return selector === '.portal-v2-map' ? map : null; }
  };

  portalV2.handleMapCanvasClick(rootElement, {
    target: { closest(selector) { return selector === '.portal-v2-terminal-marker' ? {} : null; } }
  });
  assert.equal(classes.has('is-region-zoomed'), true);

  portalV2.handleMapCanvasClick(rootElement, {
    target: { closest(selector) { return selector === '.portal-v2-map__marker' ? {} : null; } }
  });
  assert.equal(classes.has('is-region-zoomed'), true);

  portalV2.handleMapCanvasClick(rootElement, {
    target: { closest() { return null; } }
  });
  assert.equal(classes.has('is-region-zoomed'), false);
  assert.equal(map.dataset.zoomRegion, undefined);
});

test('선택 지역에 속한 모든 터미널을 확대 지도용 마커 정보로 제공한다', () => {
  const portalV2 = loadPortalV2();
  const view = portalV2.buildRegionView('mokpo', {
    regions: {
      mokpo: {
        label: { ko: '목포' },
        phone: '1666-0910',
        terminals: [
          { id: 'mokpo-coastal', type: 'coastal', name: { ko: '목포항 연안여객선터미널' }, description: { ko: '서남해 섬 여행의 관문입니다.' }, address: { ko: '전라남도 목포시 해안로 182' }, routes: [{ name: { ko: '목포 → 제주' } }, { name: { ko: '목포 → 홍도' } }], folder: 'mokpo' },
          { id: 'mokpo-intl', type: 'international', name: { ko: '목포항 국제여객터미널' } },
          { id: 'hongdo', type: 'hongdo', name: { ko: '홍도항여객선터미널' } }
        ]
      }
    }
  }, [{ key: 'mokpo', folder: 'mokpo' }]);

  assert.deepEqual(JSON.parse(JSON.stringify(view.mapTerminals)), [
    { id: 'mokpo-coastal', type: 'coastal', name: '목포항 연안여객선터미널', description: '서남해 섬 여행의 관문입니다.', address: '전라남도 목포시 해안로 182', phone: '1666-0910', href: 'regions/mokpo/index.html', routes: ['목포 → 제주', '목포 → 홍도'], routeDetails: [{ name: '목포 → 제주', duration: '', frequency: '' }, { name: '목포 → 홍도', duration: '', frequency: '' }] },
    { id: 'mokpo-intl', type: 'international', name: '목포항 국제여객터미널', description: '', address: '', phone: '1666-0910', href: 'regions/mokpo/index.html', routes: [], routeDetails: [] },
    { id: 'hongdo', type: 'hongdo', name: '홍도항여객선터미널', description: '', address: '', phone: '1666-0910', href: 'regions/mokpo/index.html', routes: [], routeDetails: [] }
  ]);
});

test('주요 항로는 출발지·화살표·목적지를 첫 줄에, 소요시간을 다음 줄에 표시한다', () => {
  const portalV2 = loadPortalV2();
  const routeList = {
    children: [],
    replaceChildren(...children) { this.children = children; }
  };
  const routeOrigin = { textContent: '' };
  const routeDestinations = { textContent: '' };
  const createElement = (tagName) => ({
    tagName,
    className: '',
    textContent: '',
    dataset: {},
    attributes: {},
    children: [],
    setAttribute(name, value) { this.attributes[name] = value; },
    append(...children) { this.children.push(...children); }
  });
  const rootElement = {
    ownerDocument: { createElement },
    querySelector(selector) {
      if (selector === '[data-v2-terminal-routes]') return routeList;
      if (selector === '[data-v2-route-origin]') return routeOrigin;
      if (selector === '[data-v2-route-destinations]') return routeDestinations;
      return null;
    }
  };
  const view = portalV2.buildRegionView('jeju', {
    regions: {
      jeju: {
        label: { ko: '제주' },
        terminals: [{
          id: 'jeju-coastal',
          type: 'coastal',
          name: { ko: '연안여객터미널' },
          routes: [
            { name: { ko: '제주 → 목포' }, duration: { ko: '4시간' }, frequency: { ko: '2회' } },
            { name: { ko: '제주 → 완도' }, duration: { ko: '2시간 30분' }, frequency: { ko: '4회' } }
          ]
        }]
      }
    }
  }, [{ key: 'jeju', folder: 'jeju' }]);

  portalV2.renderTerminalRoutes(rootElement, view.mapTerminals[0].routeDetails, 'jeju');

  assert.equal(routeList.children.length, 1);
  assert.equal(routeList.children[0].className, 'portal-v2-route-destination-grid');
  assert.equal(routeList.children[0].children[0].tagName, 'article');
  assert.deepEqual(
    routeList.children[0].children.map((card) => ({
      pathClass: card.children[0].className,
      path: card.children[0].children.map((item) => item.textContent),
      durationLabel: card.children[1].children[0].children[0].textContent,
      durationValue: card.children[1].children[0].children[1].textContent,
      actionsClass: card.children[2].className,
      operation: card.children[2].children[0].textContent,
      operationClass: card.children[2].children[0].className,
      operationHref: card.children[2].children[0].attributes.href,
      booking: card.children[2].children[1].textContent,
      bookingClass: card.children[2].children[1].className,
      bookingHref: card.children[2].children[1].attributes.href
    })),
    [
      { pathClass: 'portal-v2-route-card__path', path: ['제주', '→', '목포'], durationLabel: '소요시간', durationValue: '4시간', actionsClass: 'portal-v2-route-card__actions', operation: '운항정보', operationClass: 'btn btn--sm btn--outline portal-v2-route-card__operation', operationHref: 'schedule/operation.html', booking: '예매하기', bookingClass: 'btn btn--sm btn--outline portal-v2-route-card__booking', bookingHref: 'https://island.theksa.co.kr/' },
      { pathClass: 'portal-v2-route-card__path', path: ['제주', '→', '완도'], durationLabel: '소요시간', durationValue: '2시간 30분', actionsClass: 'portal-v2-route-card__actions', operation: '운항정보', operationClass: 'btn btn--sm btn--outline portal-v2-route-card__operation', operationHref: 'schedule/operation.html', booking: '예매하기', bookingClass: 'btn btn--sm btn--outline portal-v2-route-card__booking', bookingHref: 'https://island.theksa.co.kr/' }
    ]
  );
  assert.equal(routeOrigin.textContent, '제주');
  assert.equal(routeDestinations.textContent, '목포, 완도');
});

test('선택한 항로는 출발지와 목적지 및 운항정보·공식 예매 행동을 제공한다', () => {
  const portalV2 = loadPortalV2();

  assert.deepEqual(JSON.parse(JSON.stringify(portalV2.buildSelectedRouteView({
    name: '제주 → 목포',
    duration: '04:30'
  }))), {
    origin: '제주',
    destination: '목포',
    duration: '4시간 30분',
    operationHref: 'schedule/operation.html',
    bookingHref: 'https://island.theksa.co.kr/'
  });
});

test('제주 주요 항로는 완도 항로를 기본 서비스 정보로 선택한다', () => {
  const portalV2 = loadPortalV2();
  const routes = [
    { name: '제주 → 목포', destination: '목포', duration: '4시간 30분' },
    { name: '제주 → 완도', destination: '완도', duration: '2시간 40분' },
    { name: '제주 → 추자', destination: '추자', duration: '1시간' }
  ];

  assert.equal(portalV2.getDefaultRoute(routes, 'jeju'), routes[1]);
});

test('항로를 선택하면 터미널·날씨 정보와 함께 하단 서비스 패널을 표시한다', () => {
  const portalV2 = loadPortalV2();
  const fields = {
    '[data-v2-selected-route]': { hidden: true, dataset: {} },
    '[data-v2-selected-route-origin]': { textContent: '' },
    '[data-v2-selected-route-destination]': { textContent: '' },
    '[data-v2-selected-route-duration]': { textContent: '' },
    '[data-v2-selected-route-operation]': { href: '' },
    '[data-v2-selected-route-booking]': { href: '' }
  };
  const classes = new Set();
  const rootElement = {
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); }
    },
    querySelector(selector) { return fields[selector] || null; },
    querySelectorAll() { return []; }
  };

  portalV2.applySelectedRouteView(rootElement, { name: '제주 → 목포', duration: '04:30' }, 'jeju');

  assert.equal(fields['[data-v2-selected-route]'].hidden, false);
  assert.equal(fields['[data-v2-selected-route]'].dataset.regionId, 'jeju');
  assert.equal(fields['[data-v2-selected-route-origin]'].textContent, '제주');
  assert.equal(fields['[data-v2-selected-route-destination]'].textContent, '목포');
  assert.equal(fields['[data-v2-selected-route-duration]'].textContent, '4시간 30분');
  assert.equal(fields['[data-v2-selected-route-operation]'].href, 'schedule/operation.html');
  assert.equal(fields['[data-v2-selected-route-booking]'].href, 'https://island.theksa.co.kr/');
  assert.equal(classes.has('is-route-selected'), true);
});

test('선택한 항로 버튼을 다시 눌러도 하단 서비스 패널을 계속 표시한다', () => {
  const portalV2 = loadPortalV2();
  const panel = { hidden: false, dataset: { regionId: 'jeju' } };
  const classes = new Set(['is-route-selected']);
  const controls = [
    {
      dataset: { routeName: '제주 → 목포' },
      attributes: { 'aria-pressed': 'true' },
      classList: { toggle() {} },
      getAttribute(name) { return this.attributes[name]; },
      setAttribute(name, value) { this.attributes[name] = value; }
    },
    {
      dataset: { routeName: '제주 → 완도' },
      attributes: { 'aria-pressed': 'false' },
      classList: { toggle() {} },
      getAttribute(name) { return this.attributes[name]; },
      setAttribute(name, value) { this.attributes[name] = value; }
    }
  ];
  const rootElement = {
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); }
    },
    querySelector(selector) {
      if (selector === '[data-v2-selected-route]') return panel;
      if (selector === '.portal-v2-summary') return null;
      return null;
    },
    querySelectorAll(selector) {
      return selector === '[data-v2-route-name]' ? controls : [];
    }
  };

  portalV2.toggleSelectedRouteView(rootElement, { name: '제주 → 목포', duration: '04:30' }, 'jeju');

  assert.equal(panel.hidden, false);
  assert.equal(classes.has('is-route-selected'), true);
  assert.deepEqual(controls.map((control) => control.attributes['aria-pressed']), ['true', 'false']);
});

test('터미널 주요 항로는 실제 데이터 기준 최대 세 개까지 제공한다', () => {
  const portalV2 = loadPortalV2();
  const routes = Array.from({ length: 7 }, (_, index) => ({
    name: { ko: `제주 → 목적지${index + 1}` },
    duration: { ko: `0${index + 1}:00` }
  }));
  const view = portalV2.buildRegionView('jeju', {
    regions: {
      jeju: {
        label: { ko: '제주' },
        terminals: [{ id: 'jeju-coastal', type: 'coastal', name: { ko: '연안여객터미널' }, routes }]
      }
    }
  }, [{ key: 'jeju', folder: 'jeju' }]);

  assert.equal(view.mapTerminals[0].routeDetails.length, 3);
  assert.equal(view.mapTerminals[0].routeDetails[2].name, '제주 → 목적지3');
});

test('확대 지도 터미널 라벨은 전체 터미널명 대신 항구 이름까지만 표시한다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.formatMapTerminalLabel('목포연안여객선터미널', 'coastal'), '연안');
  assert.equal(portalV2.formatMapTerminalLabel('목포항 국제여객터미널', 'international'), '국제');
  assert.equal(portalV2.formatMapTerminalLabel('울릉(도동) 여객터미널', 'ulleungDodong'), '도동');
  assert.equal(portalV2.formatMapTerminalLabel('운진항여객터미널', 'seogwipo'), '서귀포');
  assert.equal(portalV2.formatMapTerminalLabel('홍도항여객선터미널', 'hongdo'), '홍도항');
});

test('지역별 확대 지도 터미널은 지정된 유형 순서로 제공한다', () => {
  const portalV2 = loadPortalV2();
  const view = portalV2.buildRegionView('yeosu', {
    regions: {
      yeosu: {
        label: { ko: '여수' },
        terminals: [
          { id: 'expo', type: 'expo', name: { ko: '엑스포여객터미널' } },
          { id: 'coastal', type: 'coastal', name: { ko: '연안여객터미널' } },
          { id: 'geomundo', type: 'geomundo', name: { ko: '거문도항여객선터미널' } },
          { id: 'international', type: 'international', name: { ko: '여수항 국제여객터미널' } },
          { id: 'nokdong', type: 'nokdong', name: { ko: '녹동신항여객선터미널' } },
          { id: 'narodo', type: 'narodo', name: { ko: '나로도항여객선터미널' } }
        ]
      }
    }
  }, [{ key: 'yeosu', folder: 'yeosu' }]);

  assert.deepEqual(Array.from(view.mapTerminals, (terminal) => terminal.type), [
    'coastal', 'international', 'expo', 'nokdong', 'narodo', 'geomundo'
  ]);
});

test('터미널 검색어와 일치하는 지역 선택 버튼만 표시한다', () => {
  const portalV2 = loadPortalV2();
  const controls = ['제주', '인천', '여수'].map((label) => ({
    textContent: label,
    hidden: false
  }));
  const emptyMessage = { hidden: true };
  const rootElement = {
    querySelector(selector) {
      return selector === '[data-v2-region-search-empty]' ? emptyMessage : null;
    },
    querySelectorAll(selector) {
      if (selector === '.portal-v2-region-list [data-region-id]') return controls;
      if (selector === '.portal-v2-region-group') return [];
      return [];
    }
  };

  portalV2.filterRegionControls(rootElement, '여');

  assert.deepEqual(controls.map((control) => control.hidden), [true, true, false]);
  assert.equal(emptyMessage.hidden, true);

  portalV2.filterRegionControls(rootElement, '없는 지역');
  assert.equal(controls.every((control) => control.hidden), true);
  assert.equal(emptyMessage.hidden, false);
});

test('지역명 또는 터미널명으로 지역을 검색한다', () => {
  const portalV2 = loadPortalV2();
  const controls = [
    { textContent: '인천', dataset: { searchTerms: '인천 인천항연안여객터미널' }, hidden: false },
    { textContent: '제주', dataset: { searchTerms: '제주 연안여객터미널 국제여객터미널' }, hidden: false }
  ];
  const emptyMessage = { hidden: true };
  const rootElement = {
    querySelector(selector) {
      if (selector === '[data-v2-region-search-empty]') return emptyMessage;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.portal-v2-region-list [data-region-id]') return controls;
      if (selector === '.portal-v2-region-group') return [];
      return [];
    }
  };

  portalV2.filterRegionControls(rootElement, '국제여객터미널');

  assert.deepEqual(controls.map((control) => control.hidden), [true, false]);
  assert.equal(emptyMessage.hidden, true);

  portalV2.filterRegionControls(rootElement, '없는 터미널');
  assert.equal(controls.every((control) => control.hidden), true);
  assert.equal(emptyMessage.hidden, false);
});

test('확대 지도 터미널을 선택하면 오른쪽 영역에 해당 터미널 정보를 표시한다', () => {
  const portalV2 = loadPortalV2();
  const fields = {
    '[data-v2-terminal-name]': { textContent: '' },
    '[data-v2-terminal-routes]': { textContent: '' },
    '[data-v2-terminal-address]': { textContent: '' },
    '[data-v2-region-phone]': { textContent: '', href: '' },
    '[data-v2-region-link]': { href: '' },
    '[data-v2-weather-condition]': { textContent: '' },
    '[data-v2-weather-temperature]': { textContent: '' },
    '[data-v2-weather-updated]': { textContent: '' },
    '[data-v2-weather-direction]': { textContent: '' },
    '[data-v2-weather-speed]': { textContent: '' },
    '[data-v2-weather-wind]': { textContent: '' },
    '[data-v2-weather-wave]': { textContent: '' },
    '[data-v2-weather-visibility]': { textContent: '' },
    '[data-v2-weather-icon]': { src: '', alt: '' }
  };
  const markers = ['mokpo-coastal', 'mokpo-intl'].map((terminalId) => ({
    dataset: { terminalId },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; }
  }));
  const guideLinks = [{ href: '' }, { href: '' }, { href: '' }];
  const rootElement = {
    querySelector(selector) { return fields[selector] || null; },
    querySelectorAll(selector) {
      if (selector === '[data-terminal-id]') return markers;
      if (selector === '[data-v2-terminal-guide-link]') return guideLinks;
      return [];
    }
  };

  portalV2.applyTerminalView(rootElement, {
    id: 'mokpo-intl',
    name: '목포항 국제여객터미널',
    description: '국제 항로를 이용하는 여객 터미널입니다.',
    routes: ['목포 → 스다오', '목포 → 국제 크루즈 기항지'],
    address: '전라남도 목포시 해안로148번길 14',
    phone: '1666-0910',
    href: 'regions/mokpo/index.html'
  }, '목포', {
    condition: '흐리고 한때 비',
    temperature: '21.9℃',
    direction: '동-남동',
    windSpeed: '11.3m/s',
    wind: '동-남동 11.3m/s',
    wave: '1.7~2.6m',
    visibility: '16km',
    updatedAt: '2026년 9월 2일 13:37 기준'
  });

  assert.equal(fields['[data-v2-terminal-name]'].textContent, '목포항 국제여객터미널');
  assert.equal(fields['[data-v2-terminal-routes]'].textContent, '목포 → 스다오, 국제 크루즈 기항지');
  assert.equal(fields['[data-v2-terminal-address]'].textContent, '전라남도 목포시 해안로148번길 14');
  assert.equal(fields['[data-v2-region-phone]'].href, 'tel:16660910');
  assert.equal(fields['[data-v2-region-link]'].href, 'regions/mokpo/index.html');
  assert.deepEqual(guideLinks.map((item) => item.href), [
    'regions/mokpo/guide.html',
    'regions/mokpo/guide.html',
    'regions/mokpo/guide.html'
  ]);
  assert.equal(fields['[data-v2-weather-temperature]'].textContent, '21.9℃');
  assert.equal(fields['[data-v2-weather-direction]'].textContent, '동-남동');
  assert.equal(fields['[data-v2-weather-speed]'].textContent, '11.3m/s');
  assert.equal(fields['[data-v2-weather-wind]'].textContent, '동-남동 11.3m/s');
  assert.equal(fields['[data-v2-weather-icon]'].src, 'common/images/weather/overcast-rain.svg');
  assert.equal(markers[0].attributes['aria-pressed'], 'false');
  assert.equal(markers[1].attributes['aria-pressed'], 'true');
});

test('확대 지도 터미널 마커를 누르면 선택 콜백을 실행한다', () => {
  const portalV2 = loadPortalV2();
  const layer = {
    children: [],
    replaceChildren(...children) { this.children = children; }
  };
  const createElement = (tagName) => ({
    tagName,
    style: { setProperty() {} },
    attributes: {},
    children: [],
    listeners: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(type, listener) { this.listeners[type] = listener; },
    append(...children) { this.children.push(...children); }
  });
  const rootElement = {
    ownerDocument: { createElement },
    querySelector(selector) {
      return selector === '[data-v2-terminal-markers]' ? layer : null;
    }
  };
  let selectedTerminal = null;
  const terminal = {
    id: 'mokpo-coastal',
    type: 'coastal',
    name: '목포항 연안여객선터미널'
  };

  portalV2.renderMapTerminals(rootElement, [terminal], (selected) => {
    selectedTerminal = selected;
  }, 'mokpo');
  layer.children[0].listeners.click();

  assert.equal(layer.children[0].tagName, 'button');
  assert.equal(layer.children[0].attributes.type, 'button');
  assert.equal(layer.children[0].attributes['data-terminal-name'], '목포항 연안여객선터미널');
  assert.equal(selectedTerminal.id, 'mokpo-coastal');
});

test('지역 변경 시 확대 지도 위 터미널 마커를 모두 교체한다', () => {
  const portalV2 = loadPortalV2();
  const layer = {
    children: [],
    replaceChildren(...children) { this.children = children; }
  };
  const createElement = (tagName) => ({
    tagName,
    className: '',
    textContent: '',
    style: { setProperty() {} },
    attributes: {},
    children: [],
    setAttribute(name, value) { this.attributes[name] = value; },
    append(...children) { this.children.push(...children); }
  });
  const rootElement = {
    ownerDocument: { createElement },
    querySelector(selector) {
      return selector === '[data-v2-terminal-markers]' ? layer : null;
    },
    querySelectorAll() { return []; }
  };

  portalV2.applyRegionView(rootElement, {
    regionId: 'mokpo',
    regionName: '목포',
    province: '',
    terminalName: '',
    description: '',
    phone: '',
    href: '',
    image: '',
    imageAlt: '',
    weather: null,
    mapTerminals: [
      { id: 'mokpo-coastal', type: 'coastal', name: '목포항 연안여객선터미널', coords: { lat: 34.781939, lng: 126.384216 } },
      { id: 'mokpo-intl', type: 'international', name: '목포항 국제여객터미널', coords: { lat: 34.780118, lng: 126.382181 } }
    ]
  });

  assert.equal(layer.children.length, 2);
  assert.equal(layer.children[0].attributes['data-terminal-id'], 'mokpo-coastal');
  assert.equal(layer.children[0].children[1].textContent, '연안');
  assert.equal(layer.children[1].attributes['data-terminal-id'], 'mokpo-intl');
});

test('실제 위경도를 Korea 2000 지도 좌표 비율로 변환한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.projectTerminalCoordinate({ lat: 34.781939, lng: 126.384216 });

  assert.ok(position.x > 20 && position.x < 30);
  assert.ok(position.y > 65 && position.y < 75);
});

test('index 지도에 정의된 터미널은 실측 좌표가 없어도 기존 확대 배치를 재사용한다', () => {
  const portalV2 = loadPortalV2();
  const layer = {
    children: [],
    replaceChildren(...children) { this.children = children; }
  };
  const rootElement = {
    ownerDocument: {
      createElement() {
        return {
          style: {
            values: {},
            setProperty(name, value) { this.values[name] = value; }
          },
          setAttribute() {},
          addEventListener() {},
          append() {}
        };
      }
    },
    querySelector(selector) {
      return selector === '[data-v2-terminal-markers]' ? layer : null;
    }
  };

  portalV2.renderMapTerminals(rootElement, [{ id: 'jeju-intl', type: 'international', name: '제주항 국제여객터미널' }], null, 'jeju');

  assert.equal(layer.children.length, 1);
  assert.equal(layer.children[0].style.values['--terminal-x'], '47%');
  assert.equal(layer.children[0].style.values['--terminal-y'], '73%');
});

test('군산 연안여객터미널은 조정된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('gunsan', 'coastal');

  assert.equal(position.x, 40);
  assert.equal(position.y, 52);
});

test('군산 국제여객터미널은 해안의 표시 위치를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const internationalPosition = portalV2.getIndexMapTerminalPosition('gunsan', 'international');

  assert.equal(internationalPosition.x, 35.3);
  assert.equal(internationalPosition.y, 53);
});

test('인천 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('incheon', 'coastal');

  assert.equal(position.x, 33.1);
  assert.equal(position.y, 49.3);
});

test('인천 국제여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('incheon', 'international');

  assert.equal(position.x, 34.1);
  assert.equal(position.y, 52.7);
});

test('통영 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('tongyeong', 'coastal');

  assert.equal(position.x, 52.4);
  assert.equal(position.y, 59.2);
});

test('삼천포신항은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('tongyeong', 'samcheonpo');

  assert.equal(position.x, 30.7);
  assert.equal(position.y, 54.4);
});

test('대천 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('boryeong', 'coastal');

  assert.equal(position.x, 41.5);
  assert.equal(position.y, 65.6);
});

test('오천항은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('boryeong', 'ocheon');

  assert.equal(position.x, 42.4);
  assert.equal(position.y, 60.6);
});

test('대천 확대 지도에는 국제여객터미널 마커를 표시하지 않는다', () => {
  const portalV2 = loadPortalV2();

  assert.equal(portalV2.getIndexMapTerminalPosition('boryeong', 'international'), null);
});

test('동해 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('donghae', 'coastal');

  assert.equal(position.x, 59.2);
  assert.equal(position.y, 40.6);
});

test('동해 국제여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('donghae', 'international');

  assert.equal(position.x, 62.6);
  assert.equal(position.y, 42.7);
});

test('속초항은 표시된 동해 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('donghae', 'sokcho');

  assert.equal(position.x, 36.5);
  assert.equal(position.y, 18.9);
});

test('부산 국제여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('busan', 'international');

  assert.equal(position.x, 54.8);
  assert.equal(position.y, 63.4);
});

test('부산 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('busan', 'coastal');

  assert.equal(position.x, 52.7);
  assert.equal(position.y, 64.3);
});

test('영도 크루즈는 표시된 부산 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('busan', 'yeongdoCruise');

  assert.equal(position.x, 61.9);
  assert.equal(position.y, 66.1);
});

test('목포 국제여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('mokpo', 'international');

  assert.equal(position.x, 57.9);
  assert.equal(position.y, 63.8);
});

test('목포 연안여객터미널은 표시된 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('mokpo', 'coastal');

  assert.equal(position.x, 57.6);
  assert.equal(position.y, 67.4);
});

test('흑산도항은 표시된 목포 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('mokpo', 'heuksando');

  assert.equal(position.x, 44.5);
  assert.equal(position.y, 67.4);
});

test('홍도항은 표시된 목포 확대 지도 좌표를 사용한다', () => {
  const portalV2 = loadPortalV2();
  const position = portalV2.getIndexMapTerminalPosition('mokpo', 'hongdo');

  assert.equal(position.x, 30.2);
  assert.equal(position.y, 69);
});
