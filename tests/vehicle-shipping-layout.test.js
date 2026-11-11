const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('차량 안내는 절차·장소·확인사항을 공통 간격이 적용되는 형제 섹션으로 배치한다', () => {
  const html = fs.readFileSync(path.join(__dirname, '../regions/mokpo/vehicle-shipping.html'), 'utf8');
  const content = html.split('content: `')[1].split('`')[0];
  const tags = content.match(/<\/?(?:section|div)\b[^>]*>/g);
  const stack = [];
  const sections = [];
  for (const tag of tags) {
    if (tag.startsWith('</')) { stack.pop(); continue; }
    if (!stack.length && tag.startsWith('<section')) {
      assert.match(tag, /class="[^"]*\bcontent-block\b/);
      sections.push(tag.match(/aria-(?:labelledby|label)="([^"]+)"/)[1]);
    }
    stack.push(tag);
  }
  assert.deepEqual(sections, ['vehicle-passenger-process-title', 'vehicle-location-title', 'vehicle-check-title']);
});
