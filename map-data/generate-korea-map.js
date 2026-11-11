const fs = require('node:fs');
const path = require('node:path');

const SVG_WIDTH = 720;
const SVG_HEIGHT = 684;
const SVG_PADDING = 16;
const MIN_RING_AREA_M2 = 50000;
const SIMPLIFY_TOLERANCE_PX = 0.18;

function round(value, precision = 2) {
  const scale = 10 ** precision;
  return Math.round(value * scale) / scale;
}

function createViewportProjector(bounds, viewport) {
  const sourceWidth = bounds.maxX - bounds.minX;
  const sourceHeight = bounds.maxY - bounds.minY;
  const availableWidth = viewport.width - viewport.padding * 2;
  const availableHeight = viewport.height - viewport.padding * 2;
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
  const offsetX = (viewport.width - sourceWidth * scale) / 2;
  const offsetY = (viewport.height - sourceHeight * scale) / 2;

  return (x, y) => [
    round(offsetX + (x - bounds.minX) * scale),
    round(offsetY + (bounds.maxY - y) * scale)
  ];
}

function squaredSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = end[0];
      y = end[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

function simplifyOpenLine(points, tolerance) {
  if (points.length <= 2) return points.slice();
  const sqTolerance = tolerance * tolerance;
  const kept = new Uint8Array(points.length);
  const stack = [[0, points.length - 1]];
  kept[0] = 1;
  kept[points.length - 1] = 1;

  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDistance = sqTolerance;
    let index = -1;
    for (let current = first + 1; current < last; current += 1) {
      const distance = squaredSegmentDistance(points[current], points[first], points[last]);
      if (distance > maxDistance) {
        index = current;
        maxDistance = distance;
      }
    }
    if (index > -1) {
      kept[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, index) => kept[index]);
}

function simplifyClosedRing(points, tolerance) {
  if (points.length < 4) return points.slice();
  const ring = points.slice();
  const first = ring[0];
  const last = ring.at(-1);
  if (first[0] === last[0] && first[1] === last[1]) ring.pop();
  if (ring.length < 3) return [...ring, ring[0]];

  let splitIndex = 1;
  let maxDistance = -1;
  for (let index = 1; index < ring.length; index += 1) {
    const dx = ring[index][0] - ring[0][0];
    const dy = ring[index][1] - ring[0][1];
    const distance = dx * dx + dy * dy;
    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }

  const firstHalf = simplifyOpenLine(ring.slice(0, splitIndex + 1), tolerance);
  const secondHalf = simplifyOpenLine([...ring.slice(splitIndex), ring[0]], tolerance);
  const simplified = [...firstHalf, ...secondHalf.slice(1, -1)];
  if (simplified.length < 3) return [ring[0], ring[splitIndex], ring.at(-1), ring[0]];
  simplified.push(simplified[0]);
  return simplified;
}

function ringArea(points) {
  let area = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    area += points[index][0] * points[index + 1][1] - points[index + 1][0] * points[index][1];
  }
  return Math.abs(area / 2);
}

function ringToPath(points) {
  if (!points.length) return '';
  return `M${points.map((point) => `${point[0]} ${point[1]}`).join('L')}Z`;
}

function readDbfRows(filePath) {
  const buffer = fs.readFileSync(filePath);
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);
  const fields = [];
  for (let offset = 32; buffer[offset] !== 13; offset += 32) {
    fields.push({
      name: buffer.subarray(offset, offset + 11).toString('ascii').replace(/\0.*$/, ''),
      length: buffer[offset + 16]
    });
  }

  return Array.from({ length: recordCount }, (_, recordIndex) => {
    const row = {};
    let offset = headerLength + recordIndex * recordLength + 1;
    fields.forEach((field) => {
      row[field.name] = buffer.subarray(offset, offset + field.length).toString('utf8').trim();
      offset += field.length;
    });
    return row;
  });
}

function readShapefile(filePath, rows) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.readInt32BE(0) !== 9994 || buffer.readInt32LE(32) !== 5) {
    throw new Error('Polygon SHP 형식만 지원합니다.');
  }
  const bounds = {
    minX: buffer.readDoubleLE(36),
    minY: buffer.readDoubleLE(44),
    maxX: buffer.readDoubleLE(52),
    maxY: buffer.readDoubleLE(60)
  };
  const records = [];
  let offset = 100;
  let recordIndex = 0;

  while (offset < buffer.length) {
    const contentLength = buffer.readInt32BE(offset + 4) * 2;
    const contentOffset = offset + 8;
    const partCount = buffer.readInt32LE(contentOffset + 36);
    const pointCount = buffer.readInt32LE(contentOffset + 40);
    const partsOffset = contentOffset + 44;
    const pointsOffset = partsOffset + partCount * 4;
    const partStarts = Array.from({ length: partCount }, (_, index) => buffer.readInt32LE(partsOffset + index * 4));
    const rings = [];

    for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
      const start = partStarts[partIndex];
      const end = partIndex + 1 < partCount ? partStarts[partIndex + 1] : pointCount;
      const points = Array.from({ length: end - start }, (_, pointIndex) => {
        const pointOffset = pointsOffset + (start + pointIndex) * 16;
        return [buffer.readDoubleLE(pointOffset), buffer.readDoubleLE(pointOffset + 8)];
      });
      if (points.length >= 4 && ringArea(points) >= MIN_RING_AREA_M2) rings.push(points);
    }

    records.push({ properties: rows[recordIndex] || {}, rings });
    offset += 8 + contentLength;
    recordIndex += 1;
  }
  return { bounds, records };
}

function createSvg(dataset) {
  const project = createViewportProjector(dataset.bounds, {
    width: SVG_WIDTH,
    height: SVG_HEIGHT,
    padding: SVG_PADDING
  });
  const paths = dataset.records.map((record) => {
    const pathData = record.rings.map((ring) => {
      const projected = ring.map(([x, y]) => project(x, y));
      return ringToPath(simplifyClosedRing(projected, SIMPLIFY_TOLERANCE_PX));
    }).join('');
    const code = record.properties.SIDO_CD || '';
    const name = record.properties.SIDO_NM || '';
    return `<path class="korea-region" data-sido-code="${code}" aria-label="${name}" d="${pathData}"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-labelledby="map-title map-desc">
<title id="map-title">대한민국 해안선 지도</title>
<desc id="map-desc">2025년 2분기 Korea 2000 통합좌표계 시도 데이터를 합성해 내부 경계 없이 표현한 대한민국 육지와 주요 섬 지도입니다.</desc>
<defs><filter id="land-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#174A7E" flood-opacity=".12"/></filter></defs>
<rect width="720" height="684" rx="16" fill="#F5FAFF"/>
<g fill="#E5F1FB" fill-rule="evenodd" filter="url(#land-shadow)">${paths}</g>
</svg>`;
}

function generate(options = {}) {
  const sourceBase = options.sourceBase || path.join(__dirname, 'bnd_sido_00_2025_2Q');
  const outputPath = options.outputPath || path.join(__dirname, '..', 'common', 'images', 'korea-administrative-map.svg');
  const rows = readDbfRows(`${sourceBase}.dbf`);
  const dataset = readShapefile(`${sourceBase}.shp`, rows);
  const svg = createSvg(dataset);
  fs.writeFileSync(outputPath, svg, 'utf8');
  return { outputPath, bytes: Buffer.byteLength(svg), regions: dataset.records.length };
}

module.exports = { createViewportProjector, simplifyClosedRing, ringToPath, createSvg, generate };

if (require.main === module) {
  const result = generate();
  console.log(`Generated ${result.outputPath} (${result.regions} regions, ${result.bytes} bytes)`);
}
