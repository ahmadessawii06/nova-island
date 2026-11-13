function clean(value, max = 10000) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function reminderText(item = {}) {
  const text = clean(item.text).trim();
  const ref = clean(item.ref, 1000).trim();
  const quranText = text.replace(/(^|\s)([٠-٩]{1,3})(?=\s|$)/g, '$1۝$2');
  const displayed = item.quran && text ? `﴿${quranText}﴾` : text;
  return ref ? `${displayed}\n${ref}` : displayed;
}

function shareUrl(provider, text) {
  const encoded = encodeURIComponent(clean(text));
  if (provider === 'whatsapp') return `https://wa.me/?text=${encoded}`;
  if (provider === 'telegram') return `https://t.me/share/url?url=&text=${encoded}`;
  return null;
}

module.exports = { reminderText, shareUrl };
