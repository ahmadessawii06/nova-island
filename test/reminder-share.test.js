const test = require('node:test');
const assert = require('node:assert/strict');
const { reminderText, shareUrl } = require('../reminder-share');

test('copies the exact Qur’an text, ornament, verse number, and reference', () => {
  const item = { text: 'فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا ٥', ref: 'الشرح ٥', quran: true };
  assert.equal(reminderText(item), '﴿فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا ۝٥﴾\nالشرح ٥');
});

test('dhikr and dua retain their exact text and source', () => {
  assert.equal(reminderText({ text: 'سُبْحَانَ اللَّهِ', ref: 'رواه مسلم' }), 'سُبْحَانَ اللَّهِ\nرواه مسلم');
});

test('WhatsApp and Telegram URLs safely encode all shared content', () => {
  const text = '﴿نصّ ٥﴾\nالمصدر ٥';
  for (const provider of ['whatsapp', 'telegram']) {
    const url = shareUrl(provider, text);
    assert.equal(url.startsWith('https://'), true);
    assert.equal(new URL(url).searchParams.get('text'), text);
  }
  assert.equal(shareUrl('unknown', text), null);
});
