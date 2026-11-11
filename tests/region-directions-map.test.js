const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadScript(context, relativePath) {
  if (relativePath === 'common/region-page.js' && !context.window.KsaPathResolver) {
    loadScript(context, 'common/path-resolver.js');
  }
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(source, context, { filename: relativePath });
}

function createPageContext() {
  const document = {
    title: '',
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const window = {
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
    }
  };
  return vm.createContext({ console, document, window });
}

test('목포 연안·국제·홍도·흑산도터미널 오시는 길에 위치 지도를 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'common/region-page.js');

  const coastal = context.window.terminalData.terminalProfiles
    .find((terminal) => terminal.id === 'mokpo-coastal');
  const international = context.window.terminalData.terminalProfiles
    .find((terminal) => terminal.id === 'mokpo-international');
  const hongdo = context.window.terminalData.terminalProfiles
    .find((terminal) => terminal.id === 'hongdo');
  const heuksando = context.window.terminalData.terminalProfiles
    .find((terminal) => terminal.id === 'heuksando');
  assert.equal(coastal.coords.lat, 34.781939);
  assert.equal(coastal.coords.lng, 126.384216);
  assert.equal(coastal.transit.routes, undefined);
  assert.equal(international.coords.lat, 34.780118);
  assert.equal(international.coords.lng, 126.382181);
  assert.equal(hongdo.address, '전남광주통합특별시 신안군 흑산면 홍도리 94-8');
  assert.equal(hongdo.coords.lat, 34.682726947546975);
  assert.equal(hongdo.coords.lng, 125.19275630676516);
  assert.deepEqual(JSON.parse(JSON.stringify(hongdo.transit.shipRoutes)), [
    { from: '홍도', to: '목포', times: ['10:30', '15:10'] },
    { from: '목포', to: '홍도', times: ['07:50', '12:30'] }
  ]);
  assert.equal(heuksando.address, '전남광주통합특별시 신안군 흑산면 예리1길 41-19');
  assert.equal(heuksando.coords.lat, 34.68455549121842);
  assert.equal(heuksando.coords.lng, 125.44243730078597);
  assert.deepEqual(JSON.parse(JSON.stringify(heuksando.transit.shipRoutes)), [
    { from: '흑산', to: '목포', times: ['09:00', '11:10', '15:50'] },
    { from: '목포', to: '흑산', times: ['07:50', '12:30', '16:00'] }
  ]);

  const html = context.window.RegionPage.renderMain({
    pageKey: 'directions',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });

  assert.doesNotMatch(html, /<iframe/);
  assert.doesNotMatch(html, /region-terminal-map-frame/);
  assert.match(html, /data-kakao-map/);
  assert.match(html, /data-map-lat="34\.781939"/);
  assert.match(html, /data-map-lng="126\.384216"/);
  assert.match(html, /data-map-lat="34\.780118"/);
  assert.match(html, /data-map-lng="126\.382181"/);
  assert.match(html, /data-map-lat="34\.682727"/);
  assert.match(html, /data-map-lng="125\.192756"/);
  assert.match(html, /data-map-lat="34\.684555"/);
  assert.match(html, /data-map-lng="125\.442437"/);
  assert.equal((html.match(/data-kakao-map/g) || []).length, 4);
  assert.match(html, /class="region-terminal-map-canvas"/);
  assert.doesNotMatch(html, /content-info-panel|대표번호|운영시간/);
  assert.match(html, /class="content-guide-section content-guide-section--prominent"/);
  assert.match(html, /class="content-feature-list region-directions-feature-list"/);
  assert.doesNotMatch(html, /region-terminal-(?:map-meta|access|transit)/);
  assert.doesNotMatch(html, /region-terminal-ship-access|선박으로만 접근할 수 있습니다|출항시각은 운항 시간표에서 확인하세요/);
  assert.doesNotMatch(html, /region-terminal-source|출처:/);
  assert.doesNotMatch(html, /openstreetmap/);
  assert.match(html, /aria-label="목포연안여객선터미널 위치 지도"/);
  assert.match(html, /aria-label="홍도여객선터미널 위치 지도"/);
  assert.match(html, /전남광주통합특별시 신안군 흑산면 홍도리 94-8/);
  assert.match(html, /aria-label="흑산도여객선터미널 위치 지도"/);
  assert.match(html, /전남광주통합특별시 신안군 흑산면 예리1길 41-19/);
  assert.match(html, /href="https:\/\/map\.kakao\.com\/link\/to\/[^\"]+" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /data-terminal-section-tabs[\s\S]+<div class="content-heading"><h2 id="directions-content-title">오시는 길<\/h2><\/div>[\s\S]+id="directions-panel-mokpo-coastal"[\s\S]+data-kakao-map[\s\S]+content-heading content-heading--with-action[\s\S]+목포연안여객선터미널[\s\S]+전남 목포시 해안로 182[\s\S]+카카오맵에서 보기/);
  assert.doesNotMatch(html, /data-address-copy|주소 복사|주소가 복사되었습니다/);
  assert.doesNotMatch(html, /자가용 이용 시/);
  assert.doesNotMatch(html, /승차 정류장|이용 버스|하차 정류장|소요시간/);
  assert.match(html, /버스터미널에서 이용 시[\s\S]+1번 버스[\s\S]+KT\(한솔엘레콤\) 터미널점 앞 버스정류장 \(21031\)[\s\S]+승차[\s\S]+여객선터미널 정류장 \(13017\)[\s\S]+하차/);
  assert.match(html, /기차역에서 이용 시[\s\S]+1번 버스[\s\S]+MBC 앞 버스정류장 \(14022\)[\s\S]+승차[\s\S]+여객선터미널 정류장 \(13017\)[\s\S]+하차/);
  assert.doesNotMatch(html, /<h3>자가용<\/h3>|서울IC → 목포|양재IC → 서영암|광양IC → 장흥IC|여수 → 순천 → 목포/);
  assert.match(html, /content-guide-section content-guide-section--prominent"><h3>기차<\/h3>[\s\S]+KTX[\s\S]+서울 용산 <span aria-hidden="true">↔<\/span> 목포[\s\S]+약 2시간 20분[\s\S]+1일 왕복 18회[\s\S]+SRT[\s\S]+서울 수서 <span aria-hidden="true">↔<\/span> 목포[\s\S]+1일 왕복 9회/);
  assert.match(html, /<h3>기차<\/h3>[\s\S]+class="content-feature-badge">KTX<\/span>[\s\S]+class="content-feature-badge">SRT<\/span>/);
  assert.doesNotMatch(html, /ARS 1688-4700|ARS 1588-7788|ARS 1800-1472|무궁화·새마을호/);
  assert.match(html, /content-guide-section content-guide-section--prominent"><h3>고속버스<\/h3>[\s\S]+서울 <span aria-hidden="true">↔<\/span> 목포[\s\S]+약 4시간[\s\S]+1일 왕복 24회[\s\S]+부산 <span aria-hidden="true">↔<\/span> 목포[\s\S]+약 4시간 30분[\s\S]+1일 7회 운행/);
  assert.doesNotMatch(html, /<h3>광역교통 이용<\/h3>/);
  assert.match(html, /운행 횟수와 소요 시간은 교통 상황 및 운행 일정에 따라 달라질 수 있습니다\. 이용 전 해당 운영기관에서 최신 정보를 확인해 주세요\./);
  assert.match(html, /TODO: 열차 예매 공식 URL 확인 후 버튼 연결/);
  assert.match(html, /TODO: 고속버스 예매 공식 URL 확인 후 버튼 연결/);
  assert.match(html, /TODO: 대중교통 길찾기 공식 URL 확인 후 버튼 연결/);
  assert.match(html, /aria-label="선박이용"[\s\S]+선박 이용 시[\s\S]+홍도 → 목포[\s\S]+10:30, 15:10[\s\S]+목포 → 홍도[\s\S]+07:50, 12:30/);
  assert.match(html, /aria-label="선박이용"[\s\S]+선박 이용 시[\s\S]+흑산 → 목포[\s\S]+09:00, 11:10, 15:50[\s\S]+목포 → 흑산[\s\S]+07:50, 12:30, 16:00/);
  assert.equal((html.match(/class="content-feature-badge">선박 이용 시/g) || []).length, 2);
  assert.doesNotMatch(html, /class="content-feature-title">선박이용/);
  assert.doesNotMatch(html, /약 24분|약 12분|도보 2분|도보 6분/);
  assert.doesNotMatch(html, /여객선 운항정보 ARS/);
  assert.doesNotMatch(html, /주차 요금|할인 안내|유료 주차장 요금 안내/);
  assert.doesNotMatch(html, /출차 시 요금 정산/);
  assert.equal((html.match(/content-heading--with-action/g) || []).length, 4);
});

test('터미널 소개는 탭 다음에 선택된 터미널 제목과 주소를 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'terminal-introduction',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });

  assert.match(html, /data-terminal-section-tabs[\s\S]+id="terminal-introduction-panel-mokpo-coastal"/);
  assert.match(html, /data-terminal-section-tabs[\s\S]+<div class="content-heading"><h2 id="terminal-introduction-content-title">터미널 소개<\/h2><\/div>[\s\S]+id="terminal-introduction-panel-mokpo-coastal"/);
  assert.doesNotMatch(html, /data-terminal-heading/);
  assert.doesNotMatch(html, /region-terminal-summary/);
  assert.doesNotMatch(html, /우편번호|운항정보 ARS/);
  assert.doesNotMatch(html, /<h3>입주기관<\/h3>|입주기관 연락처 안내|href="tel:0612406051"/);
  assert.doesNotMatch(html, /region-terminal-contact-list/);
  assert.match(html, /terminal-mokpo-coastal-waterfront\.jpg[\s\S]+terminal-mokpo-coastal-front\.jpg/);
  assert.match(html, /region-terminal-introduction-copy">목포에서 섬으로 향하는 여정이 시작되는 곳입니다/);
  assert.match(html, /region-terminal-introduction-copy">목포에서 더 넓은 바다로 이어지는 여정을 준비하는 곳입니다/);
  assert.match(html, /region-terminal-introduction-copy">붉은 노을과 기암절벽이 아름다운 홍도/);
  assert.match(html, /region-terminal-introduction-copy">짙푸른 바다와 섬의 일상이 가까워지는 곳입니다/);
  assert.doesNotMatch(html, /terminal-introduction-location-title-/);
  assert.match(html, /class="content-info-panel content-info-panel--outlined region-terminal-introduction-info"[\s\S]+명칭[\s\S]+목포연안여객선터미널[\s\S]+운영시간[\s\S]+06:00 ~ 18:00[\s\S]+주소[\s\S]+전남 목포시 해안로 182[\s\S]+대표 전화번호[\s\S]+href="tel:16660910"[\s\S]+1666-0910[\s\S]+class="region-terminal-scale"/);
  assert.doesNotMatch(html, /terminal-introduction-location-title-mokpo-coastal[\s\S]+카카오맵에서 보기/);
  assert.match(html, /terminal-mokpo-international\.jpg/);
  assert.match(html, /terminal-hongdo\.jpg/);
  assert.match(html, /terminal-heuksando\.jpg/);
  assert.equal((html.match(/class="region-terminal-photo"/g) || []).length, 5);
  assert.match(html, /data-terminal-photo-slider[\s\S]+data-photo-prev[\s\S]+data-photo-status[\s\S]+data-photo-next/);
  assert.doesNotMatch(html, /<figcaption>|사진 제공:/);
});

test('선사 안내는 선사별 로고와 기본 연락처를 정보 블록으로 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'regions/mokpo/schedule-data.js');
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'operators',
    terminalData: context.window.terminalData,
    scheduleData: context.window.scheduleData
  });

  assert.match(html, /<h2 id="operators-content-title">선사 안내<\/h2>/);
  assert.match(html, /\(주\)남해고속[\s\S]+href="tel:0612449915"/);
  assert.match(html, /\(주\)동양훼리[\s\S]+href="tel:0612432111"/);
  assert.match(html, /\(주\)씨월드[\s\S]+href="tel:0612431927"[\s\S]+061-243-1927~8/);
  assert.match(html, /\(유\)신진해운[\s\S]+href="tel:0612440522"/);
  assert.match(html, /\(재\)신안교통재단[\s\S]+href="tel:0612420888"/);
  assert.match(html, /\(주\)해광운수[\s\S]+href="tel:0612839915"/);
  assert.match(html, /<article class="region-operator-section">[\s\S]+<h3>\(주\)남해고속<\/h3>[\s\S]+<strong>TEL<\/strong><span><a class="region-operator-phone" href="tel:0612449915"/);
  assert.equal((html.match(/<strong>매표소 위치<\/strong><span>연안 여객선 터미널 1F<\/span>/g) || []).length, 5);
  assert.match(html, /\(주\)씨월드[\s\S]+<strong>매표소 위치<\/strong><span>국제항 여객터미널 1F<\/span>/);
  assert.match(html, /<strong>주요 항로<\/strong><span>비금, 도초, 홍도, 흑산도, 가거도<\/span>[\s\S]+<strong>매표소 위치<\/strong>/);
  assert.match(html, /\(주\)씨월드[\s\S]+<strong>주요 항로<\/strong><span>제주도<\/span>/);
  assert.match(html, /\(유\)신진해운[\s\S]+<strong>주요 항로<\/strong><span>달리도, 장좌도, 눌도\(율도\), 외달도 · 장산, 하의도, 신의도<\/span>/);
  assert.match(html, /\(재\)신안교통재단[\s\S]+<strong>주요 항로<\/strong><span>장산, 하의도, 신의도<\/span>/);
  assert.match(html, /\(주\)해광운수[\s\S]+<strong>주요 항로<\/strong><span>조도, 우이도<\/span>/);
  assert.match(html, /<a class="btn btn--md btn--outline" href="https:\/\/www\.seaferry\.co\.kr\/" target="_blank" rel="noopener noreferrer"><svg class="line-icon"[\s\S]+<span>선사 홈페이지<\/span><\/a>/);
  assert.match(html, /<header class="region-operator-heading"><h3>\(주\)남해고속<\/h3><a class="btn btn--md btn--outline" href="http:\/\/www\.namhaegosok\.co\.kr\/"/);
  assert.match(html, /<header class="region-operator-heading"><h3>\(주\)동양훼리<\/h3><a class="btn btn--md btn--outline" href="http:\/\/www\.ihongdo\.co\.kr\/"/);
  assert.match(html, /<header class="region-operator-heading"><h3>\(유\)신진해운<\/h3><a class="btn btn--md btn--outline" href="https:\/\/shjin\.kr\/"/);
  assert.match(html, /<header class="region-operator-heading"><h3>\(재\)신안교통재단<\/h3><a class="btn btn--md btn--outline" href="http:\/\/www\.baetaja\.kr\/"/);
  assert.match(html, /<header class="region-operator-heading"><h3>\(주\)해광운수<\/h3><a class="btn btn--md btn--outline" href="http:\/\/www\.xn--wk0br4bw3g3rj\.kr\/main\/main\.php"/);
  assert.equal((html.match(/class="btn btn--md btn--outline"/g) || []).length, 6);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/namhae-express\.png" alt=""><\/div>/);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/dongyang-ferry\.png" alt=""><\/div>/);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/seaworld-express-ferry\.png" alt=""><\/div>/);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/shinjin-shipping\.png" alt=""><\/div>/);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/shinan-transport-foundation\.png" alt=""><\/div>/);
  assert.match(html, /<div class="region-operator-logo" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/operators\/haegwang-shipping\.png" alt=""><\/div>/);
  assert.equal((html.match(/class="region-operator-logo"/g) || []).length, 6);
  assert.equal((html.match(/class="region-operator-profile"/g) || []).length, 6);
  assert.doesNotMatch(html, /<span class="region-operator-status">정보 준비 중<\/span>/);
  assert.equal((html.match(/class="region-operator-section"/g) || []).length, 6);
  assert.doesNotMatch(html, /region-operator-vessel-table|data-operator-vessel-row|<table/);
  assert.doesNotMatch(html, /region-page-grid region-page-grid--three/);
});

test('선박 안내는 PDF 103·104페이지의 목포지역 선박 현황을 선명 우선 표로 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'regions/mokpo/schedule-data.js');
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'vessels',
    terminalData: context.window.terminalData,
    scheduleData: context.window.scheduleData
  });

  assert.equal(context.window.terminalData.vesselDetails.length, 23);
  assert.equal(context.window.terminalData.vesselDetails.filter((vessel) => vessel.image).length, 23);
  assert.match(html, /<table class="portal-data-table region-vessel-table mobile-table--stacked">/);
  assert.match(html, /<th scope="col">사진<\/th><th scope="col">선명<\/th><th scope="col">선사명<\/th><th scope="col">항로<\/th><th scope="col">선종<\/th><th scope="col">정원<\/th>/);
  assert.equal((html.match(/data-vessel-row/g) || []).length, 23);
  assert.match(html, /data-label="선명" class="region-vessel-cell--primary">/);
  assert.match(html, /data-label="선사명">씨월드고속훼리\(주\)<\/td>/);
  assert.match(html, /<button class="region-vessel-spec-trigger" type="button" aria-label="퀸제누비아 제원 정보 보기" aria-describedby="region-vessel-spec-0">/);
  assert.match(html, /id="region-vessel-spec-0" class="region-vessel-spec-tooltip" role="tooltip">[\s\S]+<dt>속력<\/dt><dd>22노트<\/dd>[\s\S]+<dt>총톤수<\/dt><dd>27,391G\/T<\/dd>[\s\S]+<dt>정원<\/dt><dd>1,284명<\/dd>[\s\S]+<dt>항로거리<\/dt><dd>177\.8km<\/dd>/);
  assert.match(html, /data-label="항로" class="region-vessel-cell--emphasis">/);
  assert.match(html, /<button class="region-vessel-route-trigger" type="button" aria-label="퀸제누비아 기항지 보기" aria-describedby="region-vessel-route-0"><span>목포-제주<\/span><svg[\s\S]+aria-hidden="true">[\s\S]+<\/svg><\/button>/);
  assert.match(html, /id="region-vessel-route-0" class="region-vessel-route-tooltip" role="tooltip"><span class="region-vessel-route-stop"><span>목포-제주<\/span><span class="region-vessel-route-duration">\(05:00\)<\/span><\/span><\/span>/);
  assert.match(html, /data-label="선종" class="region-vessel-cell--details">/);
  assert.match(html, /data-label="사진"><div class="region-vessel-identity"><button class="region-vessel-photo-trigger" type="button" aria-label="퀸제누비아 선박 사진 크게 보기"><img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/queen-jenuvia\.jpg" alt="퀸제누비아 선박 사진"><span class="region-vessel-photo-preview" aria-hidden="true"><img src="\.\.\/\.\.\/common\/images\/vessels\/queen-jenuvia\.jpg" alt=""><span>퀸제누비아<\/span><\/span><\/button><\/div><\/td>/);
  assert.match(html, /data-vessel-row[\s\S]+data-label="사진"><div class="region-vessel-identity"><button class="region-vessel-photo-trigger"[\s\S]+<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/queen-jenuvia\.jpg" alt="퀸제누비아 선박 사진">[\s\S]+<\/button><\/div><\/td>[\s\S]+data-label="선명" class="region-vessel-cell--primary">[\s\S]+<strong class="region-vessel-name">퀸제누비아<\/strong>[\s\S]+data-label="선사명">씨월드고속훼리\(주\)<\/td>[\s\S]+data-label="항로" class="region-vessel-cell--emphasis">[\s\S]+region-vessel-route-trigger[\s\S]+목포-제주/);
  assert.match(html, /data-label="선종" class="region-vessel-cell--details"><span class="region-vessel-value region-vessel-value--type"><span class="region-vessel-type-line"><span>카페리<\/span>[\s\S]+region-vessel-spec-trigger[\s\S]+<\/span><\/span><\/td>/);
  assert.match(html, /data-label="정원">1,284명<\/td>/);
  assert.doesNotMatch(html, /data-label="운항시간"/);
  assert.doesNotMatch(html, /region-vessel-duration/);
  assert.doesNotMatch(html, /상세 제원|region-vessel-specs|data-label="속력"|data-label="총톤수"|data-label="항로거리"/);
  assert.doesNotMatch(html, /data-label="항로">[\s\S]*?<span class="region-vessel-subtext">일반<\/span>/);
  assert.match(html, /퀸제누비아[\s\S]+목포-제주[\s\S]+05:00[\s\S]+카페리/);
  assert.match(html, /동양골드[\s\S]+id="region-vessel-route-7" class="region-vessel-route-tooltip" role="tooltip"><span class="region-vessel-route-stop"><span>① 목포-비금\/도초-흑산-홍도<\/span><span class="region-vessel-route-duration">\(02:30\)<\/span><\/span><span class="region-vessel-route-stop"><span>② 목포-비금\/도초-흑산-다물도\(다촌\)-상중태-하태-만재-가거도<\/span><span class="region-vessel-route-duration">\(04:30\)<\/span><\/span>/);
  assert.doesNotMatch(html, /data-label="기항지"/);
  assert.doesNotMatch(html, /①02:30 · ②04:30|① 목포-비금\/도초-흑산-홍도 · ② 목포-비금\/도초/);
  assert.match(html, /슬로아일랜드[\s\S]+목포-외달[\s\S]+목포-율도-장좌-달리-외달[\s\S]+00:54/);
  assert.match(html, /영광사랑[\s\S]+향화-송이[\s\S]+01:30/);
  const queenJenuvia = context.window.terminalData.vesselDetails.find((vessel) => vessel.name === '퀸제누비아');
  assert.deepEqual(
    { speed: queenJenuvia.speed, tonnage: queenJenuvia.tonnage, capacity: queenJenuvia.capacity, distance: queenJenuvia.distance },
    { speed: '22노트', tonnage: '27,391G/T', capacity: '1,284명', distance: '177.8km' }
  );
  assert.match(html, /<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/new-dolphin\.jpg" alt="뉴돌핀 선박 사진">[\s\S]+<strong class="region-vessel-name">뉴돌핀<\/strong>/);
  assert.match(html, /<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/doche-kahweori\.jpg" alt="도초카훼리 선박 사진">[\s\S]+<strong class="region-vessel-name">도초카훼리<\/strong>/);
  assert.match(html, /<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/queen-jenuvia\.jpg" alt="퀸제누비아 선박 사진">[\s\S]+<strong class="region-vessel-name">퀸제누비아<\/strong>/);
  assert.match(html, /<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/saeseom-dure\.jpg" alt="새섬두레 선박 사진">[\s\S]+<strong class="region-vessel-name">새섬두레<\/strong>/);
  assert.match(html, /<img class="region-vessel-photo" src="\.\.\/\.\.\/common\/images\/vessels\/haejin-high-speed-car-ferry\.jpg" alt="해진고속카페리 선박 사진">[\s\S]+<strong class="region-vessel-name">해진고속카페리<\/strong>/);
  assert.doesNotMatch(html, /정보 준비 중/);
  assert.doesNotMatch(html, /region-page-grid region-page-grid--three|region-page-card-index/);
});

test('목포 운항 시간표는 2026년 10월과 8월 안내자료를 월별로 제공한다', () => {
  const context = createPageContext();
  loadScript(context, 'regions/mokpo/schedule-data.js');

  const periods = context.window.scheduleData.timetablePeriods;
  assert.deepEqual(JSON.parse(JSON.stringify(periods.map((period) => period.id))), ['2026-10', '2026-08']);
  assert.deepEqual(JSON.parse(JSON.stringify(periods.map((period) => period.groups.reduce((count, group) => count + group.rows.length, 0)))), [21, 20]);

  const octoberIsland = periods[0].groups.find((group) => group.name === '흑산·홍도·가거도');
  const augustIsland = periods[1].groups.find((group) => group.name === '흑산·홍도·가거도');
  assert.ok(octoberIsland.rows.some((row) => row.departure === '08:10'));
  assert.ok(!augustIsland.rows.some((row) => row.departure === '08:10'));

  const octoberOuter = periods[0].groups.find((group) => group.name === '도초·우이·외달도');
  const augustOuter = periods[1].groups.find((group) => group.name === '도초·우이·외달도');
  assert.equal(octoberOuter.rows[0].vessel, '우도랜드1호');
  assert.equal(augustOuter.rows[0].vessel, '슬로아일랜드호');
});

test('목포 운항 시간표는 기준 월과 검색어에 따라 표를 갱신한다', () => {
  const context = createPageContext();
  const makeControl = (value = '') => ({
    value,
    innerHTML: '',
    textContent: '',
    hidden: false,
    listeners: {},
    addEventListener(name, listener) { this.listeners[name] = listener; }
  });
  const period = makeControl('2026-10');
  const query = makeControl('');
  const reset = makeControl();
  const group = makeControl('전체');
  const results = makeControl();
  const heading = makeControl();
  const count = makeControl();
  const notes = makeControl();
  const source = makeControl();
  const pagination = makeControl();
  const controls = {
    '#region-timetable-period': period,
    '#region-timetable-query': query,
    '[data-timetable-reset]': reset,
    '#region-timetable-group': group,
    '[data-timetable-results]': results,
    '[data-timetable-heading]': heading,
    '[data-timetable-count]': count,
    '[data-timetable-notes]': notes,
    '[data-timetable-source]': source,
    '[data-timetable-pagination]': pagination
  };
  const section = {
    innerHTML: '',
    classList: { contains: () => true },
    querySelector(selector) { return controls[selector] || null; }
  };
  context.document.getElementById = (id) => id === 'schedule' ? section : null;
  context.window.SectionTitle = {};
  context.window.i18n.t = (key) => key;
  context.window.PortalPagination = {
    renderPagination(element, currentPage, totalPages, onPageChange) {
      element.hidden = totalPages <= 1;
      element.currentPage = currentPage;
      element.totalPages = totalPages;
      element.onPageChange = onPageChange;
    }
  };

  loadScript(context, 'regions/mokpo/schedule-data.js');
  loadScript(context, 'common/schedule.js');

  assert.match(section.innerHTML, /data-region-timetable/);
  assert.equal((results.innerHTML.match(/data-timetable-row/g) || []).length, 10);
  assert.equal(count.textContent, '총 21편');
  assert.equal(pagination.totalPages, 3);

  pagination.onPageChange(2);
  assert.equal((results.innerHTML.match(/data-timetable-row/g) || []).length, 10);
  assert.equal(pagination.currentPage, 2);

  group.value = '제주도';
  group.listeners.change();
  assert.equal((results.innerHTML.match(/data-timetable-row/g) || []).length, 2);
  assert.equal(count.textContent, '총 2편');

  group.value = '전체';
  group.listeners.change();

  query.value = '퍼스트엔젤';
  query.listeners.input();
  assert.equal((results.innerHTML.match(/data-timetable-row/g) || []).length, 2);
  assert.equal(count.textContent, '총 2편');
  assert.equal(pagination.currentPage, 1);
  assert.equal(pagination.hidden, true);

  query.value = '';
  period.value = '2026-08';
  period.listeners.change();
  assert.equal((results.innerHTML.match(/data-timetable-row/g) || []).length, 10);
  assert.equal(pagination.totalPages, 2);
  assert.match(source.textContent, /2026년 8월/);
});

test('여러 장의 터미널 사진은 이전·다음 버튼으로 한 장씩 전환한다', () => {
  const context = createPageContext();
  const slides = [{ hidden: false }, { hidden: false }];
  const status = { textContent: '' };
  const previous = { addEventListener(name, listener) { this[name] = listener; } };
  const next = { addEventListener(name, listener) { this[name] = listener; } };
  const slider = {
    querySelectorAll: (selector) => selector === '[data-photo-slide]' ? slides : [],
    querySelector(selector) {
      if (selector === '[data-photo-prev]') return previous;
      if (selector === '[data-photo-next]') return next;
      if (selector === '[data-photo-status]') return status;
      return null;
    }
  };
  context.document.querySelectorAll = (selector) => selector === '[data-terminal-photo-slider]' ? [slider] : [];
  context.window.location = { hash: '' };
  context.window.addEventListener = () => {};

  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'common/region-page.js');
  context.window.RegionPage.initialize();

  assert.deepEqual(slides.map((slide) => slide.hidden), [false, true]);
  assert.equal(status.textContent, '1 / 2');
  next.click();
  assert.deepEqual(slides.map((slide) => slide.hidden), [true, false]);
  assert.equal(status.textContent, '2 / 2');
  previous.click();
  assert.deepEqual(slides.map((slide) => slide.hidden), [false, true]);
});

test('시설 안내는 상단 탭 다음에 선택된 터미널 제목과 주소를 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'facilities',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });

  assert.match(html, /data-terminal-section-tabs[\s\S]+href="terminal-introduction\.html#mokpo-coastal"[\s\S]+href="directions\.html#mokpo-coastal"[\s\S]+href="facilities\.html#mokpo-coastal" aria-current="page"[\s\S]+href="parking\.html#mokpo-coastal"/);
  assert.match(html, /region-breadcrumb-selected-terminal[\s\S]+data-breadcrumb-terminal-name>연안터미널<[\s\S]+href="facilities\.html#mokpo-international"[\s\S]+국제터미널/);
  assert.doesNotMatch(html, /region-breadcrumb-page-menu/);
  assert.match(html, /<h1 id="page-title" data-terminal-page-title>목포연안여객선터미널<\/h1>/);
  assert.doesNotMatch(html, /data-terminal-tabs/);
  assert.match(html, /data-terminal-section-tabs[\s\S]+id="facilities-panel-mokpo-coastal"/);
  assert.match(html, /data-terminal-section-tabs[\s\S]+<div class="content-heading"><h2 id="facilities-content-title">시설 안내<\/h2><\/div>[\s\S]+id="facilities-panel-mokpo-coastal"/);
  assert.doesNotMatch(html, /data-terminal-heading|content-heading--with-action/);
  assert.doesNotMatch(html, /class="region-terminal-panel-title"/);
  assert.match(html, /terminal-mokpo-coastal-floor-1\.png[\s\S]+terminal-mokpo-coastal-floor-2\.png[\s\S]+terminal-mokpo-coastal-floor-3\.png[\s\S]+terminal-mokpo-coastal-floor-4\.png[\s\S]+terminal-mokpo-coastal-annex\.png/);
  assert.match(html, /1층[\s\S]+2층[\s\S]+3층[\s\S]+4층[\s\S]+별관/);
  assert.match(html, /주차 사전무인정산기[\s\S]+해양안전문화센터[\s\S]+301호[\s\S]+목포 종합문화예술 갤러리[\s\S]+여객대합실/);
  assert.match(html, /data-terminal-floor-browser[\s\S]+role="tablist" aria-label="목포연안여객선터미널 층 선택"/);
  assert.equal((html.match(/data-floor-tab="mokpo-coastal-/g) || []).length, 5);
  assert.equal((html.match(/data-floor-panel="mokpo-coastal-/g) || []).length, 5);
  assert.match(html, /id="facilities-panel-mokpo-international"[\s\S]+terminal-mokpo-international-floor-1\.png[\s\S]+terminal-mokpo-international-floor-2\.png/);
  assert.match(html, /목포국제여객선터미널 층별 시설 안내[\s\S]+여객지원[\s\S]+매표소, 무인민원발급기, VIP 라운지[\s\S]+편의시설[\s\S]+문화시설[\s\S]+해양안전체험관[\s\S]+입주기관[\s\S]+\(유\)CMS서비스/);
  assert.match(html, /data-floor-tab="mokpo-international-1"[\s\S]+2F[\s\S]+사무실[\s\S]+입주기관[\s\S]+씨월드 고속훼리\(주\), 한국어촌어항공단/);
  assert.match(html, /id="facilities-panel-hongdo"[\s\S]+terminal-hongdo-floor-1\.png[\s\S]+terminal-hongdo-floor-2\.png/);
  assert.match(html, /data-floor-tab="hongdo-1"[\s\S]+2F[\s\S]+사무실, 전망대/);
  assert.match(html, /홍도여객선터미널 층별 시설 안내[\s\S]+여객지원[\s\S]+매표소 A, 매표소 B, 대합실[\s\S]+편의시설[\s\S]+화장실, 매점, 무인 휴대폰 충전함[\s\S]+2층[\s\S]+편의시설[\s\S]+전망대[\s\S]+입주기관[\s\S]+한국해운조합 목포지부/);
  assert.match(html, /id="facilities-panel-heuksando"[\s\S]+terminal-heuksando-floor-1\.png[\s\S]+terminal-heuksando-floor-2\.png/);
  assert.match(html, /data-floor-tab="heuksando-1"[\s\S]+2F[\s\S]+사무실/);
  assert.match(html, /흑산도여객선터미널 층별 시설 안내[\s\S]+여객지원[\s\S]+매표소, 대합실, 무인민원발급기[\s\S]+편의시설[\s\S]+화장실, 자판기, 정수기, 휴대폰 무인충전함, 수유실[\s\S]+입주기관[\s\S]+\(주\)동양훼리, \(주\)남해고속, \(유\)해진해운[\s\S]+2층[\s\S]+편의시설[\s\S]+화장실, 정수기[\s\S]+입주기관[\s\S]+한국해운조합 목포지부, 운항관리센터\(KST\)/);
    assert.match(html, /<div class="content-heading"><h2>층별 안내<\/h2><\/div>[\s\S]+<th scope="col">구분<\/th><th scope="col">주요 시설<\/th>/);
    assert.match(html, /<th class="portal-table-cell--centered" scope="row">2층<\/th>[\s\S]+여객지원[\s\S]+편의시설[\s\S]+문화시설[\s\S]+입주기관[\s\S]+한국해운조합 목포지부[\s\S]+운항관리센터\(KOMSA\)/);
    assert.doesNotMatch(html, /휴게·편의|판매·금융|문화·홍보/);
    assert.match(html, /<th class="portal-table-cell--centered" scope="row">3층<\/th>[\s\S]+301호[\s\S]+\(유\)해진해운[\s\S]+316~318호[\s\S]+한국선급 목포지부/);
    assert.doesNotMatch(html, /<strong>입주업체<\/strong>/);
    assert.match(html, /<th class="portal-table-cell--centered" scope="row">별관<\/th>[\s\S]+여객지원[\s\S]+여객대합실, 매표소[\s\S]+편의시설[\s\S]+화장실, 자판기, 휴대폰 무인충전함/);
    assert.match(html, /<h2>주요 편의시설<\/h2>[\s\S]+수유실[\s\S]+쉼터·안마의자[\s\S]+휴대폰 무인충전함/);
    assert.match(html, /수유실[\s\S]+class="region-terminal-amenity-location">위치 2층<\/span>[\s\S]+영유아 동반 승객/);
    assert.match(html, /terminal-mokpo-amenity-nursing-room\.jpg[\s\S]+terminal-mokpo-amenity-rest-area\.jpg[\s\S]+terminal-mokpo-amenity-phone-charging\.jpg/);
    assert.doesNotMatch(html, /사진은 시설 구성을 이해하기 위한 예시 이미지입니다\./);
    assert.doesNotMatch(html, /<h2>주차 요금<\/h2>|<h2>할인 안내<\/h2>/);
});

test('층 선택 버튼을 누르면 해당 층 배치도만 표시한다', () => {
  const context = createPageContext();
  const makeButton = (id, selected) => {
    const listeners = {};
    const attributes = { 'aria-selected': String(selected) };
    return {
      dataset: { floorTab: id },
      listeners,
      tabIndex: selected ? 0 : -1,
      getAttribute: (name) => attributes[name],
      setAttribute: (name, value) => { attributes[name] = value; },
      addEventListener: (name, listener) => { listeners[name] = listener; },
      focus() {}
    };
  };
  const buttons = [makeButton('floor-1', true), makeButton('floor-2', false)];
  const panels = [
    { dataset: { floorPanel: 'floor-1' }, hidden: false },
    { dataset: { floorPanel: 'floor-2' }, hidden: false }
  ];
  const browser = {
    querySelectorAll(selector) {
      if (selector === '[role="tab"][data-floor-tab]') return buttons;
      if (selector === '[data-floor-panel]') return panels;
      return [];
    }
  };
  context.document.querySelectorAll = (selector) => selector === '[data-terminal-floor-browser]' ? [browser] : [];
  context.window.location = { hash: '' };
  context.window.addEventListener = () => {};

  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'common/region-page.js');
  context.window.RegionPage.initialize();

  assert.deepEqual(panels.map((panel) => panel.hidden), [false, true]);
  buttons[1].listeners.click();
  assert.deepEqual(panels.map((panel) => panel.hidden), [true, false]);
  assert.equal(buttons[0].getAttribute('aria-selected'), 'false');
  assert.equal(buttons[1].getAttribute('aria-selected'), 'true');
});

test('주차 안내는 기존 주차 요금·할인 표를 사용한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'parking',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });

  assert.match(html, /<h2>주차 요금<\/h2>[\s\S]+<table class="portal-data-table region-parking-table">/);
  assert.match(html, /<thead><tr><th scope="col">구분<\/th><th scope="col">기준<\/th><th scope="col">안내<\/th><\/tr><\/thead>/);
  assert.match(html, /<h2>할인 안내<\/h2>[\s\S]+유료 주차장 할인 안내/);
  assert.doesNotMatch(html, /할인 대상과 적용 조건을 확인해 주세요/);
  assert.match(html, /장애우, 유공자[\s\S]+50% 할인 · 관련 증빙시 할인/);
  assert.match(html, /경차[\s\S]+50% 할인 · 자동할인/);
  assert.match(html, /친환경 차량[\s\S]+50% 할인 · 등록차량 여부 확인 후 할인/);
  assert.doesNotMatch(html, /content-guide-section--parking|content-parking-discounts|content-parking-discount-table/);
  assert.match(html, /유료 주차장 할인 안내[\s\S]+<p class="content-guide-note">요금 및 요율은 목포지방해양수산청 제2021-67호 『목포연안 및 국제여객터미널 부설주차장 주차요금 징수에 관한 고시』의 규정에 따릅니다\.<\/p>/);
  assert.match(html, /<th scope="row">하루 요금<\/th><td>24시간<\/td><td>5,000원<\/td>/);
  assert.match(html, /<th scope="row">추가 요금<\/th><td>매 10분<\/td><td>10분 200원<\/td>/);
  assert.doesNotMatch(html, /일 최대|320분 초과|일별 최대요금, 24시까지/);
  assert.doesNotMatch(html, /기본 구간 이후|이후 매 10분마다 200원 추가/);
  assert.doesNotMatch(html, /<th[^>]*>근거<\/th>|주차요금 기준/);
  assert.doesNotMatch(html, /id="parking-content-title">주차 안내/);
  assert.match(html, /data-terminal-section-tabs[\s\S]+id="parking-panel-mokpo-coastal"[\s\S]+<h2>주차 요금<\/h2>/);
  assert.doesNotMatch(html, /data-terminal-heading|content-heading--with-action/);
});

test('주차 안내는 오시는 길과 분리된 탭에서 터미널별 주차 정보를 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'common/region-page.js');

  const parkingHtml = context.window.RegionPage.renderMain({
    pageKey: 'parking',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });
  const directionsHtml = context.window.RegionPage.renderMain({
    pageKey: 'directions',
    terminalData: context.window.terminalData,
    scheduleData: { routes: [] }
  });

  assert.match(parkingHtml, /href="parking\.html#mokpo-coastal" aria-current="page"/);
  assert.match(parkingHtml, /목포연안여객선터미널[\s\S]+주차 요금[\s\S]+할인 안내/);
  assert.match(parkingHtml, /id="parking-panel-mokpo-international"[\s\S]+유료 주차장 요금 안내/);
  assert.match(parkingHtml, /id="parking-panel-heuksando"[\s\S]+무료 주차장 안내[\s\S]+<th scope="row">주차장 규모<\/th><td>1,182㎡<\/td><td>소형 30대 · 대형 0대<\/td>/);
  assert.match(parkingHtml, /id="parking-panel-heuksando"[\s\S]+<th scope="row">기본 요금<\/th><td>무료<\/td><td>-<\/td>/);
  assert.doesNotMatch(parkingHtml, /주차장 전체 면적|차종별 수용 규모/);
  assert.doesNotMatch(directionsHtml, /<h2>주차 요금<\/h2>|<h2>할인 안내<\/h2>/);
});

test('국제터미널 URL로 진입하면 지도 크기와 중심을 다시 맞춘다', async () => {
  const context = createPageContext();
  const mapInstances = [];
  const infoWindowInstances = [];
  const makeViewport = (lat, lng, name) => ({
    dataset: { mapLat: lat, mapLng: lng, mapName: name },
    classList: { add() {} },
    querySelector: (selector) => selector === '.region-terminal-map-canvas' ? {} : null
  });
  const viewports = [
    makeViewport('34.781939', '126.384216', '목포연안여객선터미널'),
    makeViewport('34.780118', '126.382181', '목포국제여객선터미널')
  ];
  const panels = [
    { id: 'directions-panel-mokpo-coastal', dataset: { terminalPanel: 'mokpo-coastal', terminalName: '목포연안여객선터미널', terminalShortName: '연안터미널', terminalAddress: '', terminalMapUrl: '' }, hidden: false, querySelector: () => viewports[0] },
    { id: 'directions-panel-mokpo-international', dataset: { terminalPanel: 'mokpo-international', terminalName: '목포국제여객선터미널', terminalShortName: '국제터미널', terminalAddress: '', terminalMapUrl: '' }, hidden: true, querySelector: () => viewports[1] }
  ];
  const links = ['terminal-introduction.html', 'facilities.html', 'directions.html', 'parking.html'].map((pageHref) => ({ dataset: { pageHref }, href: '' }));
  const tablist = { querySelectorAll: () => links, setAttribute() {} };
  const pageTitle = { textContent: '' };

  context.document.querySelectorAll = (selector) => {
    if (selector === '[data-kakao-map]') return viewports;
    if (selector === '.tab-list[data-terminal-section-tabs]') return [tablist];
    if (selector === '[data-terminal-panel]') return panels;
    return [];
  };
  context.document.querySelector = (selector) => selector === '[data-terminal-page-title]' ? pageTitle : null;
  context.window.location = { hash: '#mokpo-international' };
  context.window.addEventListener = () => {};
  context.window.kakao = { maps: {
    LatLng: class LatLng { constructor(lat, lng) { this.lat = lat; this.lng = lng; } },
    Map: class Map {
      constructor() { this.relayoutCalls = 0; this.setCenterCalls = []; mapInstances.push(this); }
      addControl() {}
      relayout() { this.relayoutCalls += 1; }
      setCenter(center) { this.setCenterCalls.push(center); }
    },
    ZoomControl: class ZoomControl {},
    Marker: class Marker {},
    InfoWindow: class InfoWindow {
      constructor() {
        this.openCalls = [];
        this.closeCalls = 0;
        infoWindowInstances.push(this);
      }
      open(map, marker) { this.openCalls.push({ map, marker }); }
      close() { this.closeCalls += 1; }
    },
    ControlPosition: { RIGHT: 'RIGHT' }
  } };

  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'common/region-page.js');
  context.window.RegionPage.initialize();
  await Promise.resolve();

  assert.equal(panels[0].hidden, true);
  assert.equal(panels[1].hidden, false);
  assert.equal(links[1].href, 'facilities.html#mokpo-international');
  assert.equal(pageTitle.textContent, '목포국제여객선터미널');
  assert.equal(mapInstances[1].relayoutCalls, 1);
  assert.equal(mapInstances[1].setCenterCalls[0].lat, 34.780118);
  assert.equal(mapInstances[1].setCenterCalls[0].lng, 126.382181);
  assert.equal(infoWindowInstances[1].closeCalls, 1);
  assert.equal(infoWindowInstances[1].openCalls.length, 2);
});

test('카카오 SDK가 준비되면 기본 지도와 마커, 정보창, 줌 컨트롤을 생성한다', () => {
  const context = createPageContext();
  const calls = {};
  const canvas = {};
  const viewport = {
    dataset: {
      mapLat: '34.781939',
      mapLng: '126.384216',
      mapName: '목포연안여객선터미널'
    },
    classList: { add: (name) => { calls.className = name; } },
    querySelector: (selector) => selector === '.region-terminal-map-canvas' ? canvas : null
  };

  class LatLng {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
  }
  class KakaoMap {
    constructor(node, options) {
      calls.map = { node, options };
    }
    addControl(control, position) {
      calls.control = { control, position };
    }
  }
  class ZoomControl {}
  class Marker {
    constructor(options) {
      calls.marker = options;
      calls.markerInstance = this;
    }
  }
  class InfoWindow {
    constructor(options) {
      calls.infoWindow = options;
    }
    open(map, marker) {
      calls.infoWindowOpen = { map, marker };
    }
  }

  context.window.kakao = {
    maps: {
      LatLng,
      Map: KakaoMap,
      ZoomControl,
      Marker,
      InfoWindow,
      ControlPosition: { RIGHT: 'RIGHT' }
    }
  };
  context.document.querySelectorAll = (selector) => selector === '[data-kakao-map]' ? [viewport] : [];

  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'common/region-page.js');
  context.window.RegionPage.initialize();

  assert.equal(calls.map.node, canvas);
  assert.equal(calls.map.options.level, 3);
  assert.equal(calls.map.options.center.lat, 34.781939);
  assert.equal(calls.map.options.center.lng, 126.384216);
  assert.equal(calls.control.position, 'RIGHT');
  assert.equal(calls.marker.position.lat, 34.781939);
  assert.equal(calls.marker.position.lng, 126.384216);
  assert.equal(calls.infoWindowOpen.marker, calls.markerInstance);
  assert.equal(calls.className, 'is-kakao-map-ready');
});

test('카카오 SDK를 불러오지 못하면 지도 오류 안내를 표시한다', async () => {
  const context = createPageContext();
  const classes = [];
  const status = { textContent: '' };
  const viewport = {
    dataset: {},
    classList: { add: (name) => classes.push(name) },
    querySelector: (selector) => selector === '.region-terminal-map-status' ? status : null
  };
  context.document.querySelectorAll = (selector) => selector === '[data-kakao-map]' ? [viewport] : [];

  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'common/region-page.js');
  context.window.RegionPage.initialize();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(classes, ['is-kakao-map-error']);
  assert.equal(status.textContent, '지도를 불러오지 못했습니다. 카카오맵에서 위치를 확인해 주세요.');
});

test('준비 중인 지역 페이지도 명시된 공통 본문이 있으면 그 본문을 표시한다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'regions/mokpo/schedule-data.js');
  context.window.PORTAL_SUBPAGE_DATA = {
    content: '<div id="operation-table-body">운항정보</div>'
  };
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'arrivals',
    terminalData: context.window.terminalData,
    scheduleData: context.window.scheduleData
  });

  assert.match(html, /id="operation-table-body">운항정보/);
  assert.doesNotMatch(html, /출도착 조회는 준비 중입니다/);
});

test('완성된 공통 본문이 있는 차량 선적 안내에는 일부 정보 제공 상태를 표시하지 않는다', () => {
  const context = createPageContext();
  loadScript(context, 'common/menu-data.js');
  loadScript(context, 'regions/mokpo/terminal-data.js');
  loadScript(context, 'regions/mokpo/schedule-data.js');
  context.window.PORTAL_SUBPAGE_DATA = {
    content: '<section>차량 선적 절차</section>'
  };
  loadScript(context, 'common/region-page.js');

  const html = context.window.RegionPage.renderMain({
    pageKey: 'vehicle-shipping',
    terminalData: context.window.terminalData,
    scheduleData: context.window.scheduleData
  });

  assert.match(html, /차량 선적 절차/);
  assert.doesNotMatch(html, /region-page-status|일부 정보 제공/);
});

test('목포 운항정보 표는 지역을 제외하고 출항시각을 첫 열로 표시한다', () => {
  const context = createPageContext();
  const makeControl = (value = '') => ({
    value,
    innerHTML: '',
    hidden: false,
    options: [],
    listeners: {},
    attributes: {},
    addEventListener(name, listener) { this.listeners[name] = listener; },
    append(option) {
      this.options.push(option);
      if (!this.value) this.value = option.value;
    },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; }
  });
  const tableBody = makeControl();
  const periodSelect = makeControl();
  const routeSelect = makeControl();
  const searchForm = makeControl();
  const searchInput = makeControl();
  const empty = makeControl();
  const tableWrap = makeControl();
  const groupList = makeControl();
  const cardList = makeControl();
  const pagination = makeControl();
  const byId = {
    'operation-table-body': tableBody,
    'operation-period-select': periodSelect,
    'operation-route-select': routeSelect,
    'operation-search-form': searchForm,
    'operation-search-input': searchInput,
    'operation-empty': empty,
    'operation-group-list': groupList,
    'operation-card-list': cardList,
    'operation-pagination': pagination
  };
  context.document.getElementById = (id) => byId[id] || null;
  context.document.querySelector = (selector) => selector === '.portal-operation-table-wrap' ? tableWrap : null;
  context.document.createElement = () => ({ value: '', textContent: '' });
  context.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  let paginationRenderCount = 0;
  context.window.PortalPagination = { renderPagination() { paginationRenderCount += 1; } };
  context.window.PORTAL_OPERATION_OPTIONS = {
    fixedRegion: '목포',
    showRegionColumn: false,
    timeFirst: true,
    contactTimetable: true,
    groupedContactTimetable: true,
    defaultPeriod: '2026-10'
  };
  context.window.PORTAL_OPERATION_ROWS = [
    { region: '목포', period: '2026-10', group: '제주도 방면', groupNoteTitle: '운항안내', groupNote: '퀸제누비아호 선박 검사로 인하여 운항 스케줄 및 선박(선명)이 변경될 수 있으니 참고해 주시길 바랍니다.', time: '0830', ship: '퀸메리', shipType: '카훼리여객선', route: '제주도', operator: '씨월드 고속훼리', contact: '061-243-1927' },
    { region: '목포', period: '2026-10', group: '흑산 방면', time: '0750', ship: '쾌속선', shipType: '쾌속선', route: '흑산도', operator: '남해고속 · 동양훼리', operatorSchedules: [{ name: '남해고속', schedule: '홀수일' }, { name: '동양훼리', schedule: '짝수일' }], contact: '061-244-9915 · 061-243-2111', duration: '2시간 30분', suspension: '토·일 휴항' },
    ...Array.from({ length: 9 }, (_, index) => ({ region: '목포', period: '2026-10', group: '흑산 방면', time: `1${String(index).padStart(3, '0')}`, ship: `추가선${index + 1}`, shipType: '쾌속선', route: '흑산도', operator: '남해고속', contact: '061-244-9915' })),
    { region: '목포', period: '2026-08', group: '제주도 방면', time: '0100', ship: '8월선', shipType: '카훼리여객선', route: '제주도', operator: '씨월드 고속훼리', contact: '061-243-1927' },
    { region: '완도', period: '2026-10', group: '완도 방면', time: '0900', ship: '완도선', shipType: '차도선', route: '완도-청산', operator: '완도선사', contact: '061-000-0000' }
  ];

  loadScript(context, 'common/operation-info.js');

  assert.equal((groupList.innerHTML.match(/class="content-heading"/g) || []).length, 2);
  assert.equal((groupList.innerHTML.match(/class="portal-data-table portal-operation-table mokpo-timetable-table"/g) || []).length, 2);
  assert.match(groupList.innerHTML, /<h2[^>]*>제주도 방면<\/h2>[\s\S]*<h2[^>]*>흑산 방면<\/h2>/);
  assert.match(groupList.innerHTML, /<h2[^>]*>제주도 방면<\/h2>[\s\S]*class="mokpo-timetable-group-note"[\s\S]*퀸제누비아호 선박 검사[\s\S]*<h2[^>]*>흑산 방면<\/h2>/);
  assert.match(groupList.innerHTML, /class="mokpo-timetable-group-note__title"><svg class="mokpo-timetable-group-note__icon"[^>]*aria-hidden="true"[^>]*>[\s\S]*<span>운항안내<\/span><\/strong>/);
  assert.doesNotMatch(groupList.innerHTML, /aria-hidden="true">※/);
  assert.equal((groupList.innerHTML.match(/class="mokpo-timetable-group-note"/g) || []).length, 1);
  assert.match(groupList.innerHTML, /data-label="출항시각"[\s\S]*data-label="기항지"[\s\S]*data-label="선명"[\s\S]*data-label="소요시간"[\s\S]*data-label="선종"/);
  assert.doesNotMatch(groupList.innerHTML, /data-label="지역"|완도선/);
  assert.match(groupList.innerHTML, /data-label="선명">퀸메리/);
  assert.match(groupList.innerHTML, /data-label="선종">카훼리여객선/);
  assert.match(groupList.innerHTML, /data-label="기항지">제주도/);
  assert.match(groupList.innerHTML, /data-label="선사명">씨월드 고속훼리/);
  assert.match(groupList.innerHTML, /data-label="연락처">061-243-1927/);
  assert.match(groupList.innerHTML, /<th scope="col">소요시간<\/th>/);
  assert.match(groupList.innerHTML, /<th scope="col">선명<\/th><th scope="col">소요시간<\/th><th scope="col">선종<\/th>/);
  assert.match(groupList.innerHTML, /data-label="출항시각">[\s\S]*class="mokpo-timetable-suspension-badge">토·일 휴항<\/span>/);
  assert.match(groupList.innerHTML, /data-label="소요시간">2시간 30분<\/td>/);
  assert.match(groupList.innerHTML, /data-label="선사명">[\s\S]*남해고속[\s\S]*class="mokpo-timetable-operator-schedule-badge">홀수일<\/span>[\s\S]*동양훼리[\s\S]*class="mokpo-timetable-operator-schedule-badge">짝수일<\/span>/);
  assert.match(groupList.innerHTML, /data-label="연락처"><span class="mokpo-timetable-contact-list"><span>061-244-9915<\/span><span>061-243-2111<\/span><\/span><\/td>/);
  assert.doesNotMatch(groupList.innerHTML, /061-244-9915\s*·\s*061-243-2111/);
  assert.match(cardList.innerHTML, /<span>소요시간<\/span>[\s\S]*<span>선종<\/span>[\s\S]*카훼리여객선/);
  assert.match(cardList.innerHTML, /<span>선사명<\/span>[\s\S]*씨월드 고속훼리/);
  assert.match(cardList.innerHTML, /class="mokpo-timetable-suspension-badge">토·일 휴항<\/span>/);
  assert.match(cardList.innerHTML, /<span>소요시간<\/span>[\s\S]*2시간 30분/);
  assert.match(cardList.innerHTML, /<span>선사명<\/span>[\s\S]*남해고속[\s\S]*홀수일[\s\S]*동양훼리[\s\S]*짝수일/);
  assert.match(cardList.innerHTML, /<span>연락처<\/span>[\s\S]*class="mokpo-timetable-contact-list"><span>061-244-9915<\/span><span>061-243-2111<\/span>/);
  assert.equal((groupList.innerHTML.match(/<td /g) || []).length, 77);
  assert.match(groupList.innerHTML, /추가선9/);
  assert.equal(paginationRenderCount, 0);
  assert.equal(pagination.hidden, true);

  assert.deepEqual(routeSelect.options.map((option) => option.textContent), ['전체 항로', '제주도 방면', '흑산 방면']);
  assert.equal(routeSelect.value, 'all');
  routeSelect.value = '흑산 방면';
  routeSelect.listeners.change();
  assert.match(groupList.innerHTML, /<h2[^>]*>흑산 방면<\/h2>/);
  assert.doesNotMatch(groupList.innerHTML, /제주도 방면|퀸메리/);
  routeSelect.value = 'all';
  routeSelect.listeners.change();

  assert.equal(periodSelect.value, '2026-10');
  periodSelect.value = '2026-08';
  periodSelect.listeners.change();
  assert.match(groupList.innerHTML, /8월선/);
  assert.doesNotMatch(groupList.innerHTML, /퀸메리|쾌속선/);
  assert.equal((groupList.innerHTML.match(/class="content-heading"/g) || []).length, 1);
});
