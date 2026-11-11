const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const generatorPath = path.join(__dirname, '..', 'map-data', 'generate-korea-map.js');

test('Korea 2000 통합좌표계의 범위를 SVG 좌표로 비율에 맞게 변환한다', () => {
  const { createViewportProjector } = require(generatorPath);
  const project = createViewportProjector({
    minX: 746111,
    minY: 1458603,
    maxX: 1387949,
    maxY: 2068444
  }, { width: 720, height: 684, padding: 16 });

  assert.deepEqual(project(746111, 2068444), [16.9, 16]);
  assert.deepEqual(project(1387949, 1458603), [703.1, 668]);
});

test('폐합된 해안선은 단순화 후에도 닫힌 SVG 경로를 유지한다', () => {
  const { simplifyClosedRing, ringToPath } = require(generatorPath);
  const ring = [[0, 0], [1, 0.01], [2, 0], [2, 2], [0, 2], [0, 0]];
  const simplified = simplifyClosedRing(ring, 0.1);

  assert.deepEqual(simplified[0], simplified.at(-1));
  assert.match(ringToPath(simplified), /^M.*Z$/);
});

test('전국 지도는 시도 내부 경계선 없이 하나의 육지 실루엣으로 출력한다', () => {
  const { createSvg } = require(generatorPath);
  const svg = createSvg({
    bounds: { minX: 0, minY: 0, maxX: 10, maxY: 10 },
    records: [{
      properties: { SIDO_CD: '50', SIDO_NM: '제주특별자치도' },
      rings: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
    }]
  });

  assert.doesNotMatch(svg, /stroke="#FFFFFF"/);
  assert.match(svg, /fill="#E5F1FB"[^>]*filter="url\(#land-shadow\)"/);
});
