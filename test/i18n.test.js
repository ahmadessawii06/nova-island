const assert = require('assert');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'prefs', 'i18n.js'), 'utf8');
const match = source.match(/const AR = (\{[\s\S]*?\n  \});/);
assert(match, 'Arabic dictionary is present');
const AR = Function(`return ${match[1]}`)();

for (const key of ['Language', 'Placement', 'Taskbar', 'Taskbar gap', 'Horizontal alignment', 'Left', 'Center', 'Right']) {
  assert(AR[key], `Arabic translation is present for ${key}`);
  assert(/[\u0600-\u06ff]/.test(AR[key]), `${key} is translated to Arabic`);
}
assert.strictEqual(require('../package.json').version, '1.8.6');
console.log('i18n tests passed');
