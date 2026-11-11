const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadRegionHome(overrides = {}) {
  const window = {
    terminalData: { regionId: 'mokpo' },
    PortalDomUtils: {
      escapeHtml(value) {
        return String(value)
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');
      }
    },
    i18n: {
      localize(value) {
        return typeof value === 'string' ? value : value?.ko || value?.en || '';
      }
    },
    REGION_MENU: overrides.REGION_MENU || [],
    getRegionPageState: overrides.getRegionPageState,
    PORTAL_NOTICE_DATA: overrides.PORTAL_NOTICE_DATA
  };
  const context = vm.createContext({ window });
  const resolverSource = fs.readFileSync(path.join(root, 'common/path-resolver.js'), 'utf8');
  const source = fs.readFileSync(path.join(root, 'common/region-home.js'), 'utf8');
  vm.runInContext(resolverSource, context, { filename: 'common/path-resolver.js' });
  vm.runInContext(source, context, { filename: 'common/region-home.js' });
  return context.window.RegionHome;
}

test('지역 메인 히어로는 통합 홈페이지와 같은 4개 서비스 카드 구조를 사용한다', () => {
  const html = loadRegionHome().renderHero({
    regionId: 'mokpo',
    name: { ko: '목포항 여객터미널' },
    hero: {
      eyebrow: { ko: 'MOKPO PORT' },
      title: { ko: '목포항 여객선 운항 안내' },
      description: { ko: '운항 정보를 확인하세요.' }
    },
    quickNav: [
      { icon: 'schedule', title: { ko: '운항 스케쥴' }, description: { ko: '출항시간 확인' }, href: '#schedule' }
    ]
  }, { source: '2026년 7월 기준' });

  assert.match(html, /<section class="portal-hero"/);
  assert.equal((html.match(/class="portal-hero-slide /g) || []).length, 5);
  assert.match(html, /data-hero-current/);
  assert.match(html, /data-hero-previous/);
  assert.match(html, /data-hero-playback/);
  assert.match(html, /data-hero-next/);
  assert.match(html, /class="portal-hero-quick portal-hero-quick--cards" id="portal-hero-quick"/);
  assert.match(html, /목포항 여객터미널/);
  assert.match(html, /목포항 여객선 운항 안내/);
  assert.doesNotMatch(html, /운항 정보를 확인하세요\./);
  assert.doesNotMatch(html, /2026년 7월 기준/);
  assert.doesNotMatch(html, /region-source/);
  assert.doesNotMatch(html, /<p>/);
  assert.doesNotMatch(html, /MOKPO PORT/);
  assert.doesNotMatch(html, /전국 여객선터미널이 함께합니다/);
  assert.equal((html.match(/class="portal-hero-service-card /g) || []).length, 4);
  assert.match(html, /터미널 찾기/);
  assert.match(html, /운항 및 기상정보/);
  assert.match(html, /승선권 예매/);
  assert.match(html, /고객센터/);
});

test('준비 중인 지역 히어로는 지역별 레거시 문구를 사용한다', () => {
  const html = loadRegionHome().renderHero({
    regionId: 'incheon',
    name: { ko: '인천항 연안여객터미널' },
    englishName: 'INCHEON COASTAL PASSENGER TERMINAL',
    _legacy: {
      heroTitle: '서해 5도로 떠나는 시작,\n인천항 연안여객터미널',
      heroDescription: '백령항로를 따라\n안전한 여행을 시작하세요.'
    }
  });

  assert.match(html, /인천항 연안여객터미널/);
  assert.match(html, /<strong>서해 5도로 떠나는 시작, 인천항 연안여객터미널<\/strong>/);
  assert.doesNotMatch(html, /서해 5도로 떠나는 시작,<br>/);
  assert.doesNotMatch(html, /백령항로를 따라/);
  assert.doesNotMatch(html, /안전한 여행을 시작하세요\./);
  assert.doesNotMatch(html, /<p>/);
  assert.doesNotMatch(html, /INCHEON COASTAL PASSENGER TERMINAL/);
});

test('선택 적용된 지역 히어로는 지역 문구와 지역 이미지만 렌더링한다', () => {
  const html = loadRegionHome().renderHero({
    regionId: 'mokpo',
    name: { ko: '목포항 여객터미널' },
    homePage: { regionalHero: true },
    hero: {
      eyebrow: { ko: 'MOKPO PORT' },
      title: { ko: '목포항 여객선 운항 안내' },
      description: { ko: '목포항의 출항시간과 터미널 정보를 확인하세요.' },
      images: [
        { src: '../../common/images/portal-hero-mokpo-coastal-aerial.png', alt: '목포항 여객터미널' },
        { src: '../../common/images/terminal-mokpo-coastal-waterfront.jpg', alt: '바다에서 본 목포항' }
      ]
    }
  });

  assert.match(html, /<section class="portal-hero portal-hero--regional"/);
  assert.match(html, /MOKPO PORT/);
  assert.match(html, /목포항 여객선 운항 안내/);
  assert.match(html, /목포항의 출항시간과 터미널 정보를 확인하세요\./);
  assert.equal((html.match(/portal-hero-slide--regional/g) || []).length, 2);
  assert.match(html, /src="\.\.\/\.\.\/common\/images\/portal-hero-mokpo-coastal-aerial\.png"/);
  assert.match(html, /src="\.\.\/\.\.\/common\/images\/terminal-mokpo-coastal-waterfront\.jpg"/);
  assert.doesNotMatch(html, /portal-hero-slide--jeju|portal-hero-slide--pohang|portal-hero-slide--hongdo|portal-hero-slide--gangjeong/);
  assert.match(html, /<strong data-hero-total>02<\/strong>/);
});

test('지역 히어로 이미지가 부족하면 터미널 사진을 사용하고 한 장일 때 이동 컨트롤을 숨긴다', () => {
  const html = loadRegionHome().renderHero({
    regionId: 'sample',
    name: { ko: '샘플항' },
    homePage: { regionalHero: true },
    hero: { title: { ko: '샘플항 안내' }, images: [] },
    terminalProfiles: [
      { photo: [{ src: '../../common/images/sample-terminal.jpg', alt: '샘플항 전경' }] }
    ]
  });

  assert.match(html, /src="\.\.\/\.\.\/common\/images\/sample-terminal\.jpg"/);
  assert.equal((html.match(/portal-hero-slide--regional/g) || []).length, 1);
  assert.match(html, /<strong data-hero-total>01<\/strong>/);
  assert.doesNotMatch(html, /data-hero-previous|data-hero-playback|data-hero-next/);
});

test('지역 사진이 전혀 없으면 공통 해양 이미지를 한 장만 사용한다', () => {
  const html = loadRegionHome().renderHero({
    regionId: 'sample',
    name: { ko: '샘플항' },
    homePage: { regionalHero: true },
    hero: { title: { ko: '샘플항 안내' } }
  });

  assert.match(html, /src="\.\.\/\.\.\/hero-ferry\.png"/);
  assert.equal((html.match(/portal-hero-slide--regional/g) || []).length, 1);
});

test('선택 적용된 주요 서비스는 quickNav를 우선하고 준비된 지역 메뉴로 네 장까지 보완한다', () => {
  const regionHome = loadRegionHome({
    REGION_MENU: [
      { id: 'terminal', pages: [{ page: 'terminal-introduction', label: '터미널 소개', href: 'terminal-introduction.html' }], children: [] },
      { id: 'operators', children: [{ page: 'operators', label: '선사 안내', href: 'operators.html' }] },
      { id: 'customer', children: [{ page: 'notices', label: '공지사항', href: 'notices.html' }] }
    ],
    getRegionPageState(page) {
      return page === 'notices' ? 'preparing' : 'ready';
    }
  });
  const html = regionHome.renderHero({
    regionId: 'mokpo',
    name: { ko: '목포항 여객터미널' },
    homePage: { dataDrivenQuickNav: true },
    hero: { title: { ko: '목포항 안내' } },
    quickNav: [
      { icon: 'schedule', title: { ko: '운항 스케쥴' }, description: { ko: '출항시간 확인' }, href: 'timetable.html' },
      { icon: 'booking', title: { ko: '차량 선적 안내' }, description: { ko: '차량 선적 절차' }, href: 'vehicle-shipping.html' }
    ]
  });

  assert.equal((html.match(/class="portal-hero-service-card /g) || []).length, 4);
  assert.match(html, /href="timetable\.html"/);
  assert.match(html, /href="vehicle-shipping\.html"/);
  assert.match(html, /href="terminal-introduction\.html"/);
  assert.match(html, /href="operators\.html"/);
  assert.doesNotMatch(html, /href="notices\.html"/);
});

test('목포 주요 서비스 데이터의 모든 내부 링크는 실제 상세 페이지를 가리킨다', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'regions/mokpo/terminal-data.js'), 'utf8'), context, {
    filename: 'regions/mokpo/terminal-data.js'
  });
  const data = context.window.terminalData;

  assert.equal(data.homePage?.regionalHero, true);
  assert.equal(data.homePage?.dataDrivenQuickNav, true);
  assert.equal(data.hero.description.ko, '목포항 여객선 운항정보와 터미널 이용안내를 확인하세요.');
  assert.doesNotMatch(data.hero.description.ko, /\d{4}년\s*\d{1,2}월\s*기준/);
  assert.ok(data.hero.images.length >= 1);
  data.quickNav.forEach((item) => {
    assert.ok(!item.href.startsWith('#'), `${item.title.ko}가 존재하지 않는 메인 fragment를 사용합니다.`);
    assert.ok(fs.existsSync(path.join(root, 'regions/mokpo', item.href)), `${item.href} 파일이 없습니다.`);
  });
});

test('지역 메인 하단은 통합 홈페이지와 같은 가이드와 빠른 안내 구조를 사용한다', () => {
  const regionHome = loadRegionHome();
  const terminalDirectory = regionHome.renderTerminalSection();
  const guide = regionHome.renderGuideSection();
  const bottom = regionHome.renderBottomInfo({
    notices: [{ ko: '운항 전 선사에 확인해 주세요.' }]
  });
  const floatingQuick = regionHome.renderFloatingQuick();

  assert.match(terminalDirectory, /<section class="portal-terminal-section" id="portal-terminals"/);
  assert.match(terminalDirectory, /data-portal-map-root data-root-prefix="\.\.\/\.\.\/"/);
  assert.match(guide, /<section class="portal-guide-section" id="portal-guide"/);
  assert.equal((guide.match(/class="portal-guide-item portal-guide-item--photo"/g) || []).length, 4);
  assert.match(bottom, /<section class="portal-guide-links portal-bottom-info" aria-labelledby=/);
  assert.match(bottom, /class="portal-home-notice-list" id="portal-latest-notice-list" aria-label="최신 공지사항 5건"/);
  assert.equal((bottom.match(/portal-quick-guide-card portal-quick-guide-card--feature/g) || []).length, 3);
  assert.match(floatingQuick, /class="portal-floating-quick" data-portal-floating-quick/);
  assert.equal((floatingQuick.match(/class="portal-floating-quick__link(?: |")/g) || []).length, 5);
  assert.match(floatingQuick, /data-portal-quick-toggle/);
});

test('선택 적용된 이용안내는 지역 상세 페이지를 우선하고 누락 항목은 통합 안내로 연결한다', () => {
  const html = loadRegionHome().renderGuideSection({
    guideTitle: { ko: '샘플항 여객터미널 이용안내' },
    homePage: {
      regionalGuide: true,
      guideCards: [
        { id: 'schedule', title: { ko: '운항정보 확인' }, description: { ko: '지역 운항표를 확인하세요.' }, href: 'timetable.html' },
        { id: 'procedure', title: { ko: '승선 절차' }, description: { ko: '지역 승선 절차를 확인하세요.' }, href: 'boarding-procedure.html' },
        { id: 'vehicle', title: { ko: '차량 선적 안내' }, description: { ko: '지역 차량 선적 절차를 확인하세요.' }, href: 'vehicle-shipping.html' }
      ]
    }
  });

  assert.match(html, /<section class="portal-guide-section" id="portal-guide"/);
  assert.match(html, /샘플항 여객터미널 이용안내/);
  assert.equal((html.match(/class="portal-guide-item portal-guide-item--photo"/g) || []).length, 4);
  assert.equal((html.match(/class="portal-guide-photo"/g) || []).length, 4);
  assert.match(html, /href="\.\.\/\.\.\/boarding\/id\.html"/);
  assert.match(html, /href="timetable\.html"/);
  assert.match(html, /href="boarding-procedure\.html"/);
  assert.match(html, /href="vehicle-shipping\.html"/);
  assert.match(html, /신분증 지참/);
  assert.match(html, /운항정보 확인/);
  assert.match(html, /승선 절차/);
  assert.match(html, /차량 선적 안내/);
  assert.match(html, /portal-guide-id-v4\.png/);
  assert.match(html, /portal-guide-status-v2\.jpg/);
  assert.match(html, /portal-guide-time-v2\.jpg/);
  assert.match(html, /portal-guide-vehicle-v1\.png/);
});

test('목포 이용안내 데이터의 네 지역 링크는 모두 실제 상세 페이지를 가리킨다', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'regions/mokpo/terminal-data.js'), 'utf8'), context, {
    filename: 'regions/mokpo/terminal-data.js'
  });
  const data = context.window.terminalData;

  assert.equal(data.homePage?.regionalGuide, true);
  assert.equal(data.homePage?.guideCards?.length, 4);
  data.homePage.guideCards.forEach((item) => {
    assert.ok(item.href, `${item.id} 이용안내 링크가 없습니다.`);
    assert.ok(!item.href.includes('#'), `${item.id}가 존재 여부를 확인하지 않은 앵커를 사용합니다.`);
    assert.ok(fs.existsSync(path.join(root, 'regions/mokpo', item.href)), `${item.href} 파일이 없습니다.`);
  });

  const html = loadRegionHome().renderGuideSection(data);
  assert.match(html, /href="identity\.html"/);
  assert.match(html, /href="timetable\.html"/);
  assert.match(html, /href="boarding-procedure\.html"/);
  assert.match(html, /href="vehicle-shipping\.html"/);
  assert.doesNotMatch(html, /href="\.\.\/\.\.\/boarding\/(?:id|procedure|vehicle)\.html"/);
});

test('선택 설정이 없는 다른 지역은 기존 통합 이용안내 카드 링크를 유지한다', () => {
  const regionHome = loadRegionHome();
  ['gunsan', 'incheon', 'jeju', 'pohang', 'tongyeong', 'wando', 'yeosu'].forEach((region) => {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, `regions/${region}/terminal-data.js`), 'utf8'), context);
    const html = regionHome.renderGuideSection(context.window.terminalData);
    assert.match(html, /href="\.\.\/\.\.\/boarding\/id\.html"/, `${region} 신분증 링크가 변경되었습니다.`);
    assert.match(html, /href="\.\.\/\.\.\/schedule\/operation\.html"/, `${region} 운항정보 링크가 변경되었습니다.`);
    assert.match(html, /href="\.\.\/\.\.\/boarding\/procedure\.html"/, `${region} 승선 절차 링크가 변경되었습니다.`);
    assert.match(html, /href="\.\.\/\.\.\/boarding\/vehicle\.html"/, `${region} 차량 선적 링크가 변경되었습니다.`);
  });
});

test('선택 적용된 지역 중앙 섹션은 터미널 프로필과 최신 기준 월 운항정보를 표시한다', () => {
  const regionHome = loadRegionHome();
  const html = regionHome.renderTerminalSection({
    regionId: 'mokpo',
    name: { ko: '목포항 여객터미널' },
    homePage: {
      regionalOverview: true,
      regionalOverviewTitle: { ko: '샘플 지역 터미널 안내' },
      scheduleSummaryTitle: { ko: '주요 운항정보' }
    },
    terminalProfiles: [
      {
        id: 'mokpo-coastal',
        name: '목포연안여객선터미널',
        address: '전남 목포시 해안로 182',
        tel: { ars: '1666-0910', main: null },
        photo: [{ src: '../../common/images/terminal-mokpo-coastal-waterfront.jpg', alt: '목포연안여객선터미널 전경' }]
      },
      { id: 'mokpo-international', name: '목포국제여객선터미널', address: '목포시 국제항', tel: { ars: '1666-0910' } },
      { id: 'hongdo', name: '홍도여객선터미널', address: '신안군 홍도리', tel: { ars: null, main: null } },
      { id: 'heuksando', name: '흑산도여객선터미널', address: '신안군 예리', tel: { ars: null, main: null } }
    ]
  }, {
    timetablePeriods: [
      { id: '2026-10', label: '2026년 10월', groups: [
        { rows: [{ departure: '08:30', vessel: '퀸메리', ports: '제주도' }] },
        { rows: [{ departure: '07:50', vessel: '쾌속선', ports: '도초(비금), 흑산도, 홍도' }] },
        { rows: [{ departure: '05:30', vessel: '천사 1호(2호)', ports: '안좌(복호), 장산(북강), 하의(웅곡)' }] },
        { rows: [{ departure: '08:30', vessel: '섬사랑 10,13호', ports: '조도 방면' }] },
        { rows: [{ departure: '07:00', vessel: '우도랜드1호', ports: '외달도' }] }
      ] },
      { id: '2026-08', label: '2026년 8월', groups: [{ rows: [{ departure: '09:00', ports: '이전 방면' }] }] },
      { id: '2027-01', label: '2027년 1월', groups: [] }
    ]
  });

  assert.match(html, /class="portal-terminal-section region-home-overview"/);
  assert.match(html, /샘플 지역 터미널 안내/);
  assert.doesNotMatch(html, /목포 지역 터미널 안내/);
  assert.match(html, /<h2 id="region-home-schedule-title">주요 운항정보<\/h2>/);
  assert.doesNotMatch(html, /여객선 운항정보 요약/);
  assert.doesNotMatch(html, /data-portal-map-root/);
  assert.equal((html.match(/class="region-home-terminal-card"/g) || []).length, 4);
  assert.match(html, /목포연안여객선터미널/);
  assert.match(html, /전남 목포시 해안로 182/);
  assert.match(html, /href="tel:16660910"/);
  assert.match(html, /src="\.\.\/\.\.\/common\/images\/terminal-mokpo-coastal-waterfront\.jpg"/);
  assert.match(html, /href="terminal-introduction\.html#mokpo-coastal"/);
  assert.match(html, /href="terminal-introduction\.html#heuksando"/);
  assert.match(html, /2026년 10월 기준/);
  assert.match(html, /제주도/);
  assert.match(html, /08:30/);
  assert.match(html, /퀸메리/);
  assert.match(html, /조도 방면/);
  assert.doesNotMatch(html, /이전 방면|2026년 8월|2027년 1월/);
  assert.equal((html.match(/class="region-home-schedule-item"/g) || []).length, 4);
  assert.match(html, /href="timetable\.html"/);
  assert.doesNotMatch(html, /실시간|현재 운항|다음 출항/);
});

test('지역 중앙 섹션은 유효한 운항 데이터가 없으면 준비 안내를 표시한다', () => {
  const html = loadRegionHome().renderTerminalSection({
    regionId: 'mokpo',
    homePage: { regionalOverview: true },
    terminalProfiles: []
  }, {
    timetablePeriods: [{ id: '2027-01', label: '2027년 1월', groups: [] }]
  });

  assert.match(html, /운항정보 준비 중/);
  assert.doesNotMatch(html, /2027년 1월 기준/);
  assert.match(html, /href="timetable\.html"/);
});

test('목포만 지역 중앙 섹션을 사용하고 다른 지역과 통합 홈페이지는 전국지도 계약을 유지한다', () => {
  const regionHome = loadRegionHome();
  const mokpoContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'regions/mokpo/terminal-data.js'), 'utf8'), mokpoContext);
  assert.equal(mokpoContext.window.terminalData.homePage?.regionalOverview, true);
  assert.equal(mokpoContext.window.terminalData.homePage?.scheduleSummaryTitle?.ko, '주요 운항정보');

  ['gunsan', 'incheon', 'jeju', 'pohang', 'tongyeong', 'wando', 'yeosu'].forEach((region) => {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, `regions/${region}/terminal-data.js`), 'utf8'), context);
    assert.notEqual(context.window.terminalData.homePage?.regionalOverview, true, `${region}에 지역 중앙 섹션이 활성화되었습니다.`);
    assert.match(regionHome.renderTerminalSection(context.window.terminalData, {}), /data-portal-map-root/);
  });

  const portalHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(portalHtml, /<main id="main" data-portal-v2/);
  assert.match(portalHtml, /class="portal-v2-map korea-map"/);
});

test('지역 공지는 현재 데이터와 준비 중 지역의 레거시 데이터를 모두 안전하게 표시한다', () => {
  const renderBottomInfo = loadRegionHome().renderBottomInfo;
  const current = renderBottomInfo({ notices: [{ ko: '<운항 변경>' }] });
  const preparing = renderBottomInfo({
    _legacy: {
      notices: [{ category: '중요', title: '기상 악화 안내', date: '2026.10.22' }]
    }
  });

  assert.match(current, /&lt;운항 변경&gt;/);
  assert.doesNotMatch(current, /<운항 변경>/);
  assert.match(preparing, /중요/);
  assert.match(preparing, /기상 악화 안내/);
  assert.match(preparing, /2026\.10\.22/);
});

test('선택 적용된 지역 공지는 해당 지역과 공통 공지만 표시한다', () => {
  const renderBottomInfo = loadRegionHome({
    PORTAL_NOTICE_DATA: {
      terminals: [
        { id: 'common', label: '공통', notices: [{ id: 'common-identity', title: '전국 신분증 안내', date: '2026.07.24' }] },
        { id: 'mokpo', label: '목포항', notices: [{ id: 'mokpo-weather', title: '목포 기상 안내', date: '2026.07.25' }] },
        { id: 'incheon', label: '인천항', notices: [{ id: 'incheon-route', title: '인천 항로 안내', date: '2026.07.26' }] }
      ]
    }
  }).renderBottomInfo;
  const html = renderBottomInfo({ regionId: 'mokpo', homePage: { regionalNotices: true } });

  assert.match(html, /목포 기상 안내/);
  assert.match(html, /전국 신분증 안내/);
  assert.doesNotMatch(html, /인천 항로 안내/);
});

test('지역 공지는 지역 우선과 유효 날짜 최신순을 적용하고 중복 제거 후 다섯 건으로 제한한다', () => {
  const renderBottomInfo = loadRegionHome({
    PORTAL_NOTICE_DATA: {
      terminals: [
        { id: 'common', label: '공통', notices: [
          { id: 'common-new', title: '공통 최신 안내', date: '2026.08.03' },
          { id: 'common-old', title: '공통 이전 안내', date: '2026.08.01' }
        ] },
        { id: 'mokpo', label: '목포항', notices: [
          { id: 'mokpo-old', title: '목포 이전 안내', date: '2026.09.01' },
          { id: 'mokpo-new', title: '목포 최신 안내', date: '2026.10.01' },
          { id: 'mokpo-duplicate', title: '중복 안내', date: '2026.09.15' }
        ] }
      ]
    }
  }).renderBottomInfo;
  const html = renderBottomInfo({
    regionId: 'mokpo',
    homePage: { regionalNotices: true },
    notices: [
      { title: { ko: '중복 안내' }, date: '2026.09.10', href: 'identity.html' },
      { title: { ko: '날짜 미확인 안내' }, date: '확인 중', href: 'guide.html' }
    ]
  });

  assert.equal((html.match(/<li>/g) || []).length, 5);
  assert.equal((html.match(/중복 안내/g) || []).length, 1);
  assert.ok(html.indexOf('목포 최신 안내') < html.indexOf('중복 안내'));
  assert.ok(html.indexOf('중복 안내') < html.indexOf('목포 이전 안내'));
  assert.ok(html.indexOf('목포 이전 안내') < html.indexOf('날짜 미확인 안내'));
  assert.ok(html.indexOf('날짜 미확인 안내') < html.indexOf('공통 최신 안내'));
  assert.doesNotMatch(html, /공통 이전 안내/);
});

test('지역 공지는 명시된 지역·외부 링크와 공통 상세 링크를 사용하고 빈 상태를 안내한다', () => {
  const regionHome = loadRegionHome({
    PORTAL_NOTICE_DATA: {
      terminals: [
        { id: 'common', label: '공통', notices: [{ id: 'common-1', title: '공통 공지', date: '2026.07.24' }] }
      ]
    }
  });
  const html = regionHome.renderBottomInfo({
    regionId: 'mokpo',
    homePage: { regionalNotices: true },
    notices: [
      { title: { ko: '지역 안내' }, href: 'identity.html' },
      { title: { ko: '외부 안내' }, href: 'https://example.com/notice' }
    ]
  });
  const empty = loadRegionHome({ PORTAL_NOTICE_DATA: { terminals: [] } }).renderBottomInfo({
    regionId: 'mokpo',
    homePage: { regionalNotices: true },
    notices: []
  });

  assert.match(html, /href="identity\.html"/);
  assert.match(html, /href="https:\/\/example\.com\/notice"/);
  assert.match(html, /href="\.\.\/\.\.\/customer\/notice-detail\.html\?id=common-1"/);
  assert.doesNotMatch(html, /href="#"/);
  assert.match(empty, /등록된 공지사항이 없습니다\./);
  assert.match(empty, /href="\.\.\/\.\.\/customer\/notice\.html"/);
});

test('목포만 지역 공지 선택을 활성화하고 다른 지역의 기존 전체 공지 동작은 유지한다', () => {
  const notices = {
    terminals: [
      { id: 'common', label: '공통', notices: [{ title: '공통 안내', date: '2026.07.24' }] },
      { id: 'incheon', label: '인천항', notices: [{ title: '인천 안내', date: '2026.07.25' }] }
    ]
  };
  const regionHome = loadRegionHome({ PORTAL_NOTICE_DATA: notices });
  const mokpoContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'regions/mokpo/terminal-data.js'), 'utf8'), mokpoContext);

  assert.equal(mokpoContext.window.terminalData.homePage?.regionalNotices, true);
  assert.equal(mokpoContext.window.terminalData.notices.length, 4);
  mokpoContext.window.terminalData.notices.forEach((notice) => {
    assert.ok(notice.title?.ko, '목포 지역 공지 제목은 기존 지역 문구를 유지해야 합니다.');
    assert.ok(notice.href, `${notice.title?.ko || '목포 공지'}의 안내 링크가 없습니다.`);
    assert.ok(fs.existsSync(path.join(root, 'regions/mokpo', notice.href)), `${notice.href} 파일이 없습니다.`);
  });
  for (const region of ['gunsan', 'incheon', 'jeju', 'pohang', 'tongyeong', 'wando', 'yeosu']) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, `regions/${region}/terminal-data.js`), 'utf8'), context);
    assert.notEqual(context.window.terminalData.homePage?.regionalNotices, true, `${region}에 지역 공지 선택이 활성화되었습니다.`);
    assert.match(regionHome.renderBottomInfo(context.window.terminalData), /인천 안내/, `${region}의 기존 전체 공지 동작이 변경되었습니다.`);
  }
});

test('선택 적용된 빠른 안내는 데이터 기반 카드 세 개와 올바른 링크 속성을 렌더링한다', () => {
  const html = loadRegionHome().renderBottomInfo({
    homePage: {
      dataDrivenQuickGuide: true,
      quickGuideCards: [
        { id: 'booking', title: { ko: '승선권 예매' }, description: { ko: '공식 예매 서비스로 이동하세요.' }, href: 'https://island.theksa.co.kr/' },
        { id: 'support', title: { ko: '유실물·고객문의' }, description: { ko: '지역 고객지원 정보를 확인하세요.' }, href: 'lost-found.html' },
        { id: 'contacts', title: { ko: '터미널 연락처' }, description: { ko: '터미널별 연락처를 확인하세요.' }, href: 'terminal-introduction.html' }
      ]
    }
  });

  assert.equal((html.match(/portal-quick-guide-card portal-quick-guide-card--feature/g) || []).length, 3);
  assert.match(html, /href="https:\/\/island\.theksa\.co\.kr\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="lost-found\.html"/);
  assert.match(html, /href="terminal-introduction\.html"/);
  assert.match(html, /유실물·고객문의/);
  assert.match(html, /터미널 연락처/);
  assert.doesNotMatch(html, /href="tel:15441114"/);
  assert.doesNotMatch(html, /여객선 운항안내 1544-1114 전화 연결/);
});

test('빠른 안내 지역 데이터가 일부 누락되면 해당 카드만 기존 공통 안내로 안전하게 대체한다', () => {
  const html = loadRegionHome().renderBottomInfo({
    homePage: {
      dataDrivenQuickGuide: true,
      quickGuideCards: [
        { id: 'booking', title: { ko: '지역 예매 안내' }, description: { ko: '지역 예매 설명' }, href: 'booking-guide.html' }
      ]
    }
  });

  assert.equal((html.match(/portal-quick-guide-card portal-quick-guide-card--feature/g) || []).length, 3);
  assert.match(html, /href="booking-guide\.html"/);
  assert.match(html, /지역 예매 안내/);
  assert.match(html, /href="\.\.\/\.\.\/customer\/lost-found\.html"/);
  assert.match(html, /href="tel:15441114"/);
});

test('목포 빠른 안내 데이터는 검증된 예매 URL과 실제 지역 안내 페이지만 사용한다', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'regions/mokpo/terminal-data.js'), 'utf8'), context, {
    filename: 'regions/mokpo/terminal-data.js'
  });
  const data = context.window.terminalData;
  const cards = data.homePage?.quickGuideCards || [];

  assert.equal(data.homePage?.dataDrivenQuickGuide, true);
  assert.equal(cards.length, 3);
  assert.equal(cards.find((card) => card.id === 'booking')?.href, 'https://island.theksa.co.kr/');
  cards.filter((card) => !/^https?:\/\//.test(card.href)).forEach((card) => {
    assert.ok(fs.existsSync(path.join(root, 'regions/mokpo', card.href)), `${card.href} 파일이 없습니다.`);
  });
  assert.equal(data.terminalProfiles.length, 4);
  assert.equal(data.terminalProfiles.filter((terminal) => terminal.tel?.main || terminal.tel?.ars).length, 2);
  const html = loadRegionHome().renderBottomInfo(data);
  assert.doesNotMatch(html, /tel:16660910|tel:15441114/);
});

test('다른 지역은 기존 빠른 안내 카드 제목과 공통 링크를 유지한다', () => {
  const regionHome = loadRegionHome();
  for (const region of ['gunsan', 'incheon', 'jeju', 'pohang', 'tongyeong', 'wando', 'yeosu']) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, `regions/${region}/terminal-data.js`), 'utf8'), context);
    const html = regionHome.renderBottomInfo(context.window.terminalData);
    assert.notEqual(context.window.terminalData.homePage?.dataDrivenQuickGuide, true, `${region}에 목포 빠른 안내가 활성화되었습니다.`);
    assert.match(html, /승선권 예매/);
    assert.match(html, /유실물 안내/);
    assert.match(html, /여객선 운항안내/);
    assert.match(html, /href="\.\.\/\.\.\/customer\/lost-found\.html"/);
    assert.match(html, /href="tel:15441114"/);
  }
});

test('모든 지역 메인 페이지는 공통 홈 컴포넌트를 레이아웃보다 먼저 불러온다', () => {
  const regions = ['incheon', 'gunsan', 'mokpo', 'wando', 'yeosu', 'tongyeong', 'pohang', 'jeju'];

  regions.forEach((region) => {
    const html = fs.readFileSync(path.join(root, 'regions', region, 'index.html'), 'utf8');
    const noticeDataIndex = html.indexOf('../../common/notice-data.js');
    const portalDataIndex = html.indexOf('../../common/portal-data.js');
    const componentIndex = html.indexOf('../../common/region-home.js');
    const layoutIndex = html.indexOf('../../common/layout.js');
    const portalMapIndex = html.indexOf('../../common/portal-map.js');
    const portalIndex = html.indexOf('../../common/portal.js');
    assert.match(html, /<body class="portal-page portal-home-page region-template-page"/);
    assert.ok(noticeDataIndex >= 0, `${region} 메인에 notice-data.js가 없습니다.`);
    assert.ok(portalDataIndex >= 0, `${region} 메인에 portal-data.js가 없습니다.`);
    assert.ok(portalMapIndex >= 0, `${region} 메인에 portal-map.js가 없습니다.`);
    assert.ok(componentIndex >= 0, `${region} 메인에 region-home.js가 없습니다.`);
    assert.ok(noticeDataIndex < componentIndex, `${region} 메인에서 공지 데이터가 홈 컴포넌트보다 늦게 로드됩니다.`);
    assert.ok(componentIndex < layoutIndex, `${region} 메인에서 region-home.js가 layout.js보다 늦게 로드됩니다.`);
    assert.ok(portalDataIndex < layoutIndex, `${region} 메인에서 portal-data.js가 layout.js보다 늦게 로드됩니다.`);
    assert.ok(portalMapIndex > layoutIndex, `${region} 메인에서 portal-map.js가 레이아웃보다 먼저 로드됩니다.`);
    assert.ok(portalMapIndex < portalIndex, `${region} 메인에서 portal-map.js가 portal.js보다 늦게 로드됩니다.`);
    assert.ok(portalIndex > layoutIndex, `${region} 메인에서 portal.js가 레이아웃보다 먼저 로드됩니다.`);
  });
});

test('일반 지역과 준비 중 지역 렌더러가 같은 히어로와 하단 컴포넌트를 사용한다', () => {
  const source = fs.readFileSync(path.join(root, 'common/layout.js'), 'utf8');

  assert.equal((source.match(/RegionHome\.renderHero\(data, scheduleConfig\)/g) || []).length, 2);
  assert.equal((source.match(/RegionHome\.renderTerminalSection\(data, scheduleConfig\)/g) || []).length, 2);
  assert.equal((source.match(/RegionHome\.renderGuideSection\(data\)/g) || []).length, 2);
  assert.equal((source.match(/RegionHome\.renderBottomInfo\(data\)/g) || []).length, 2);
  assert.equal((source.match(/RegionHome\.renderFloatingQuick\(\)/g) || []).length, 2);
});

test('지역 헤더는 통합 홈페이지로 돌아가는 공통 버튼을 제공한다', () => {
  const layoutSource = fs.readFileSync(path.join(root, 'common/layout.js'), 'utf8');
  const styleSource = fs.readFileSync(path.join(root, 'common/style.css'), 'utf8');

  assert.match(layoutSource, /const regionalSite = menuMode === 'region-v2' \|\| menuMode === 'terminal'/);
  assert.match(layoutSource, /data-integrated-home-link/);
  assert.match(layoutSource, /withRootPrefix\('index\.html', rootPrefix\)/);
  assert.match(layoutSource, />통합 홈페이지<\/a>/);
  assert.match(styleSource, /\.btn--portal-home/);
  assert.match(styleSource, /\.regional-portal-link/);
});

test('지역 히어로 반응형 보강은 지역 전용 범위에서 대비와 카드 줄바꿈을 제공한다', () => {
  const styleSource = fs.readFileSync(path.join(root, 'common/style.css'), 'utf8');

  assert.match(styleSource, /\.region-template-page \.portal-hero--regional \.portal-hero-slide--regional::after/);
  assert.match(styleSource, /\.region-template-page \.portal-hero--regional \.portal-hero-content>p[\s\S]*?text-shadow:/);
  assert.match(styleSource, /@media \(max-width: 480px\)[\s\S]*?\.region-template-page \.portal-hero--regional \.portal-hero-service-grid[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styleSource, /\.region-template-page \.portal-hero--regional \.portal-hero-service-card small[\s\S]*?white-space: normal/);
  assert.doesNotMatch(styleSource, /\.portal-v2-page[^\{]*portal-hero--regional/);
});

test('통합 지도 공지 링크는 지역 페이지의 루트 경로를 반영한다', () => {
  const source = fs.readFileSync(path.join(root, 'common/portal.js'), 'utf8');

  assert.match(source, /href="\$\{portalRootPrefix\}customer\/notice-detail\.html\?id=/);
});
