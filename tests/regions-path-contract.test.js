const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const regions = ['incheon', 'gunsan', 'mokpo', 'wando', 'yeosu', 'tongyeong', 'pohang', 'jeju'];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function htmlReferences(html) {
  return [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
}

function isLocalReference(reference) {
  return !reference.startsWith('#')
    && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference);
}

test('통합 홈페이지의 지역 링크는 regions/{region}/index.html을 사용한다', () => {
  const portal = read('common/portal.js');
  const portalV2 = read('common/portal-v2.js');
  const layout = read('common/layout.js');

  assert.match(portal, /paths\.region\(region\.folder\)/);
  assert.match(portalV2, /paths\.region\(item\.folder \|\| definition\.folder\)/);
  assert.match(portalV2, /paths\.region\(folder\)/);
  assert.match(layout, /paths\.region\(region\.folder\)/);
});

test('지역 공통 레이아웃은 통합 홈페이지로 두 단계 올라가고 다른 지역은 같은 regions 아래에서 찾는다', () => {
  const layout = read('common/layout.js');
  const regionPage = read('common/region-page.js');

  assert.match(layout, /rootPrefix:\s*'\.\.\/\.\.\/'/);
  assert.match(layout, /sharedSiteFooter\('\.\.\/\.\.\/', data\.regionId\)/);
  assert.match(regionPage, /paths\.region\(region\.folder\)/);
  assert.match(regionPage, /paths\.portal\(\)/);
});

test('지역 홈 공통 컴포넌트는 regions 깊이에 맞는 공통 이미지와 포털 루트를 사용한다', () => {
  const source = read('common/region-home.js');

  assert.match(source, /data-root-prefix="\.\.\/\.\.\/"/);
  assert.match(source, /paths\.asset\('images\/portal-guide-/);
  assert.doesNotMatch(source, /(?:data-root-prefix|src)="\.\.\/common\//);
});

test('모든 지역 진입점은 regions 아래에 있고 공통 CSS와 JS를 두 단계 상대경로로 참조한다', () => {
  for (const region of regions) {
    const regionDirectory = path.join(root, 'regions', region);
    const indexPath = path.join(regionDirectory, 'index.html');
    const guidePath = path.join(regionDirectory, 'guide.html');

    assert.ok(fs.existsSync(indexPath), `${region} index.html이 regions 아래에 있어야 한다`);
    assert.ok(fs.existsSync(guidePath), `${region} guide.html이 regions 아래에 있어야 한다`);

    for (const htmlPath of [indexPath, guidePath]) {
      const html = fs.readFileSync(htmlPath, 'utf8');
      assert.match(html, /href="\.\.\/\.\.\/common\/style\.css"/);
      assert.match(html, /src="\.\.\/\.\.\/common\/layout\.js"/);
      const resolverIndex = html.indexOf('../../common/path-resolver.js');
      const layoutIndex = html.indexOf('../../common/layout.js');
      assert.ok(resolverIndex >= 0, `${path.relative(root, htmlPath)}에 Path Resolver가 없다`);
      assert.ok(resolverIndex < layoutIndex, `${path.relative(root, htmlPath)}에서 Path Resolver가 layout.js보다 늦게 로드된다`);
    }
  }
});

test('regions 아래 지역 HTML의 모든 로컬 CSS JS 이미지 링크는 실제 파일로 해석된다', () => {
  for (const region of regions) {
    const regionDirectory = path.join(root, 'regions', region);
    assert.ok(fs.existsSync(regionDirectory), `${regionDirectory}가 있어야 한다`);

    for (const entry of fs.readdirSync(regionDirectory, { withFileTypes: true })) {
      if (!entry.isFile() || path.extname(entry.name) !== '.html') continue;
      const htmlPath = path.join(regionDirectory, entry.name);
      const references = htmlReferences(fs.readFileSync(htmlPath, 'utf8'));

      for (const reference of references.filter(isLocalReference)) {
        const pathname = reference.split(/[?#]/, 1)[0];
        if (!pathname || !/\.(?:css|js|png|jpe?g|svg|webp|woff2?|otf)$/i.test(pathname)) continue;
        const target = path.resolve(regionDirectory, pathname);
        assert.ok(fs.existsSync(target), `${path.relative(root, htmlPath)} -> ${reference}`);
      }
    }
  }
});

test('목포 상세 페이지는 regions/mokpo 안에서 내부 링크와 공통 자산을 유지한다', () => {
  const mokpoDirectory = path.join(root, 'regions', 'mokpo');
  const expectedPages = [
    'terminal-introduction.html',
    'directions.html',
    'facilities.html',
    'parking.html',
    'timetable.html',
    'boarding-procedure.html',
    'vehicle-shipping.html'
  ];

  for (const page of expectedPages) {
    assert.ok(fs.existsSync(path.join(mokpoDirectory, page)), `regions/mokpo/${page}가 있어야 한다`);
  }

  const menuData = read('common/menu-data.js');
  for (const page of expectedPages) {
    assert.match(menuData, new RegExp(`href:\\s*['"]${page.replace('.', '\\.')}['"]`));
  }

  const directions = fs.readFileSync(path.join(mokpoDirectory, 'directions.html'), 'utf8');
  assert.match(directions, /src="\.\.\/\.\.\/common\/region-page\.js"/);
  assert.match(directions, /src="\.\/terminal-data\.js"/);
});

test('보령·동해·부산은 지역 대표 페이지와 준비 상태 데이터를 제공한다', () => {
  const menuData = read('common/menu-data.js');

  for (const region of ['boryeong', 'donghae', 'busan']) {
    const regionDirectory = path.join(root, 'regions', region);
    const indexPath = path.join(regionDirectory, 'index.html');
    const guidePath = path.join(regionDirectory, 'guide.html');
    const terminalDataPath = path.join(regionDirectory, 'terminal-data.js');
    const scheduleDataPath = path.join(regionDirectory, 'schedule-data.js');

    assert.ok(fs.existsSync(indexPath), `regions/${region}/index.html이 있어야 한다`);
    assert.ok(fs.existsSync(guidePath), `regions/${region}/guide.html이 있어야 한다`);
    assert.ok(fs.existsSync(terminalDataPath), `regions/${region}/terminal-data.js가 있어야 한다`);
    assert.ok(fs.existsSync(scheduleDataPath), `regions/${region}/schedule-data.js가 있어야 한다`);

    const html = fs.readFileSync(indexPath, 'utf8');
    const terminalData = fs.readFileSync(terminalDataPath, 'utf8');
    assert.match(html, /href="\.\.\/\.\.\/common\/style\.css"/);
    assert.match(html, /src="\.\.\/\.\.\/common\/region-home\.js"/);
    assert.match(terminalData, new RegExp(`regionId:\\s*["']${region}["']`));
    assert.match(terminalData, /status:\s*["']preparing["']/);
    assert.match(menuData, new RegExp(`key:\\s*["']${region}["'][^\\n]+folder:\\s*["']${region}["'][^\\n]+hasPage:\\s*true`));
  }
});
