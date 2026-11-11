const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('루트 index.html은 portal-v2 화면과 공통 경로 Resolver를 정식 메인으로 로드한다', () => {
  const html = read('index.html');

  assert.match(html, /<html[^>]+class="portal-v2-scroll"/);
  assert.match(html, /<body[^>]+portal-v2-page/);
  assert.match(html, /<main[^>]+data-portal-v2/);
  assert.match(html, /data-v2-region-search/);
  assert.match(html, /data-v2-region-link/);
  assert.match(html, /src="common\/path-resolver\.js"/);
  assert.match(html, /src="common\/portal-v2\.js/);
});

test('legacy-portal-index.html은 기존 포털 디자인과 기능 진입점을 보존한다', () => {
  const html = read('legacy-portal-index.html');

  assert.match(html, /<section class="portal-hero"/);
  assert.match(html, /data-portal-map-root/);
  assert.match(html, /id="portal-guide"/);
  assert.match(html, /src="common\/path-resolver\.js"/);
  assert.match(html, /src="common\/portal\.js/);
  assert.doesNotMatch(html, /<body[^>]+portal-v2-page/);
});

test('기존 portal-v2.html URL은 쿼리나 fragment 없이 새 index.html로 호환 이동한다', () => {
  const html = read('portal-v2.html');

  assert.match(html, /<meta[^>]+http-equiv="refresh"[^>]+content="0; url=index\.html"/i);
  assert.match(html, /<link[^>]+rel="canonical"[^>]+href="index\.html"/i);
  assert.match(html, /<a[^>]+href="index\.html"[^>]*>[^<]*통합 홈페이지/);
  assert.doesNotMatch(html, /data-portal-v2/);
});
