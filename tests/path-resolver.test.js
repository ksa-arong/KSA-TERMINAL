const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadResolver() {
  const context = vm.createContext({ window: {} });
  const source = fs.readFileSync(path.join(root, 'common/path-resolver.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'common/path-resolver.js' });
  return context.window.KsaPathResolver;
}

test('통합 홈페이지 루트에서 포털 페이지와 공통 자산 경로를 만든다', () => {
  const paths = loadResolver().create({ location: 'portal-root' });

  assert.equal(paths.portal(), 'index.html');
  assert.equal(paths.portal('customer/notice.html'), 'customer/notice.html');
  assert.equal(paths.common('style.css'), 'common/style.css');
  assert.equal(paths.asset('images/logo.png'), 'common/images/logo.png');
});

test('통합 홈페이지 하위 페이지에서 루트까지 한 단계 상대경로를 사용한다', () => {
  const paths = loadResolver().create({ location: 'portal-subpage' });

  assert.equal(paths.portal(), '../index.html');
  assert.equal(paths.portal('boarding/id.html'), '../boarding/id.html');
  assert.equal(paths.common('layout.js'), '../common/layout.js');
  assert.equal(paths.region('jeju'), '../regions/jeju/index.html');
});

test('지역 홈페이지에서 포털과 공통 자산은 두 단계 위에서 찾는다', () => {
  const paths = loadResolver().create({ location: 'region', regionId: 'mokpo' });

  assert.equal(paths.portal(), '../../index.html');
  assert.equal(paths.portal('customer/faq.html'), '../../customer/faq.html');
  assert.equal(paths.common('region-page.js'), '../../common/region-page.js');
  assert.equal(paths.asset('images/vessels/queen-jenuvia.jpg'), '../../common/images/vessels/queen-jenuvia.jpg');
});

test('지역 식별자와 regions 폴더 경로를 분리해 지역 간 및 지역 내부 링크를 만든다', () => {
  const paths = loadResolver().create({ location: 'region', regionId: 'mokpo' });

  assert.equal(paths.region('mokpo'), 'index.html');
  assert.equal(paths.region('jeju'), '../jeju/index.html');
  assert.equal(paths.region('제주'), '../%EC%A0%9C%EC%A3%BC/index.html');
  assert.equal(paths.regionPage('directions.html'), 'directions.html');
  assert.equal(paths.regionPage('terminal-introduction.html', 'jeju'), '../jeju/terminal-introduction.html');
});

test('상대경로가 필요 없는 외부 URL과 fragment는 변경하지 않는다', () => {
  const paths = loadResolver().create({ location: 'region', regionId: 'mokpo' });

  assert.equal(paths.portal('https://example.com/booking'), 'https://example.com/booking');
  assert.equal(paths.portal('tel:1544-1114'), 'tel:1544-1114');
  assert.equal(paths.regionPage('#schedule'), '#schedule');
});

test('file 및 정적 서버 프로토콜과 무관하게 동일한 문서 상대경로를 만든다', () => {
  const resolver = loadResolver();
  const filePaths = resolver.create({ location: 'region', regionId: 'mokpo', protocol: 'file:' });
  const serverPaths = resolver.create({ location: 'region', regionId: 'mokpo', protocol: 'https:' });

  assert.equal(filePaths.common('style.css'), serverPaths.common('style.css'));
  assert.equal(filePaths.region('jeju'), serverPaths.region('jeju'));
  assert.equal(filePaths.portal('schedule/operation.html'), serverPaths.portal('schedule/operation.html'));
});

test('지원하지 않는 위치나 지역 식별자 누락을 조용히 잘못된 URL로 만들지 않는다', () => {
  const resolver = loadResolver();

  assert.throws(() => resolver.create({ location: 'unknown' }), /location/);
  assert.throws(() => resolver.create({ location: 'region' }), /regionId/);
  assert.throws(() => resolver.create({ location: 'region', regionId: '../mokpo' }), /regionId/);
});
