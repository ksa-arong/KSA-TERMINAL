const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadRegionMenuContext() {
  const context = vm.createContext({ window: {} });
  for (const file of ['common/menu-data.js', 'regions/mokpo/terminal-data.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  return context;
}

const loadRegionMenu = () => loadRegionMenuContext().window.REGION_MENU;

test('터미널 운항정보 GNB에서 운임 안내를 제공하지 않는다', () => {
  const operationGroup = loadRegionMenu().find((group) => group.id === 'operation');

  assert.equal(operationGroup.children.some((item) => item.page === 'fares'), false);
});

test('목포 터미널 운임 안내 페이지를 제공하지 않는다', () => {
  assert.equal(fs.existsSync(path.join(root, 'regions', 'mokpo', 'fares.html')), false);
});

test('터미널 운항정보 메뉴와 페이지 이름은 운항 스케쥴로 표시한다', () => {
  const operationGroup = loadRegionMenu().find((group) => group.id === 'operation');
  const timetableItem = operationGroup.children.find((item) => item.page === 'timetable');
  const timetableHtml = fs.readFileSync(path.join(root, 'regions', 'mokpo', 'timetable.html'), 'utf8');

  assert.equal(timetableItem.label, '운항 스케쥴');
  assert.match(timetableHtml, /<title>운항 스케쥴 \| 목포항 여객터미널<\/title>/);
});

test('터미널 운항정보 GNB에서 항로 안내를 제공하지 않는다', () => {
  const operationGroup = loadRegionMenu().find((group) => group.id === 'operation');

  assert.equal(operationGroup.children.some((item) => item.page === 'routes'), false);
});

test('목포 터미널 항로 안내 페이지를 제공하지 않는다', () => {
  assert.equal(fs.existsSync(path.join(root, 'regions', 'mokpo', 'routes.html')), false);
});

test('터미널 승선안내 GNB는 요청한 다섯 개 메뉴를 같은 순서로 제공한다', () => {
  const boardingGroup = loadRegionMenu().find((group) => group.id === 'boarding');

  assert.deepEqual(Array.from(boardingGroup.children, (item) => ({
    page: item.page,
    label: item.label,
    href: item.href
  })), [
    { page: 'boarding-procedure', label: '승선 절차', href: 'boarding-procedure.html' },
    { page: 'identity', label: '신분증 안내', href: 'identity.html' },
    { page: 'baggage', label: '수화물 안내', href: 'baggage.html' },
    { page: 'vehicle-shipping', label: '차량 선적 안내', href: 'vehicle-shipping.html' },
    { page: 'safety', label: '안전 수칙', href: 'safety.html' }
  ]);
});

test('목포 GNB의 모든 내부 메뉴는 실제 페이지 파일에 연결된다', () => {
  const menu = loadRegionMenu();
  const internalItems = menu.flatMap((group) => group.children)
    .filter((item) => !item.external);

  assert.ok(internalItems.length > 0);
  internalItems.forEach((item) => {
    const pagePath = path.join(root, 'regions', 'mokpo', item.href.split('#')[0]);
    assert.equal(
      fs.existsSync(pagePath),
      true,
      `${item.label} 메뉴의 ${item.href} 파일이 없습니다.`
    );
    assert.match(
      fs.readFileSync(pagePath, 'utf8'),
      new RegExp(`data-region-page=["']${item.page}["']`),
      `${item.label} 페이지의 data-region-page 값이 메뉴 키와 다릅니다.`
    );
  });
});

test('현재 페이지와 준비 중 페이지도 GNB에서 클릭 가능한 링크로 렌더링한다', () => {
  const source = fs.readFileSync(path.join(root, 'common/layout.js'), 'utf8');

  assert.doesNotMatch(source, /if \(status === 'preparing'\) return `<span class="region-menu-disabled"/);
  assert.doesNotMatch(source, /if \(current\) return `<span class="region-menu-current"/);
  assert.doesNotMatch(source, /\? `<span class="gnb-link current"/);
  assert.match(source, /aria-current="page"/);
});

test('터미널 안내 GNB는 터미널별 소개 화면으로 연결된다', () => {
  const context = loadRegionMenuContext();
  const terminalGroup = context.window.REGION_MENU.find((group) => group.id === 'terminal');
  const links = Array.from(context.window.getRegionMenuChildren(terminalGroup, context.window.terminalData), (item) => ({
    label: item.label,
    href: item.href
  }));

  assert.deepEqual(links, [
    { label: '연안터미널', href: 'terminal-introduction.html#mokpo-coastal' },
    { label: '국제터미널', href: 'terminal-introduction.html#mokpo-international' },
    { label: '홍도터미널', href: 'terminal-introduction.html#hongdo' },
    { label: '흑산도터미널', href: 'terminal-introduction.html#heuksando' }
  ]);
});
