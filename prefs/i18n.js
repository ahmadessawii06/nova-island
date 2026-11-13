/* Settings localization. English remains the source text; Arabic is applied to text nodes and
   accessibility attributes so dynamically-created plugin and status rows are translated too. */
(function initI18n(root) {
  const AR = {
    'Nova Island Settings': 'إعدادات Nova Island', 'Pages': 'الصفحات', 'Search': 'بحث',
    'General': 'عام', 'Island': 'الجزيرة', 'Themes': 'السمات', 'Companion': 'الرفيق',
    'Prayer & Dhikr': 'الصلاة والذكر', 'Alerts & Privacy': 'التنبيهات والخصوصية',
    'Connections': 'الاتصالات', 'Plugins': 'الإضافات', 'Support': 'الدعم', 'More by Nova': 'المزيد من Nova',
    'Nova on Facebook': 'Nova على فيسبوك', 'opens the island': 'يفتح الجزيرة', 'No matching settings': 'لا توجد إعدادات مطابقة',
    'Show island': 'إظهار الجزيرة', 'Start with Windows': 'البدء مع Windows',
    'Managed by Windows for the Store version': 'يديره Windows في إصدار المتجر', 'Open startup apps': 'فتح تطبيقات بدء التشغيل',
    'Language': 'اللغة', 'Placement': 'الموضع', 'Choose where Nova Island lives': 'اختر مكان ظهور Nova Island',
    'Original': 'الأصلي', 'Taskbar': 'شريط المهام', 'Left': 'يسار', 'Center': 'وسط', 'Right': 'يمين',
    'Taskbar gap': 'المسافة عن شريط المهام', 'Distance above the taskbar': 'المسافة فوق شريط المهام',
    'Horizontal alignment': 'المحاذاة الأفقية', 'Taskbar horizontal alignment': 'المحاذاة الأفقية لشريط المهام',
    'In the browser': 'في المتصفح', 'Address bar': 'شريط العنوان', 'Stay in place': 'البقاء في المكان',
    'Moves into the address bar, from its default place at the top': 'ينتقل إلى شريط العنوان من موضعه الافتراضي في الأعلى',
    'Stays where it is; clicks go to the tabs below': 'يبقى في مكانه وتصل النقرات إلى علامات التبويب تحته',
    'Hide in full screen': 'الإخفاء في ملء الشاشة', 'Auto-update': 'التحديث التلقائي',
    'Reset placement': 'إعادة ضبط الموضع', 'Reset': 'إعادة ضبط', 'Performance': 'الأداء',
    'Remove blur': 'إزالة التمويه', 'A solid island; the screen is not captured': 'جزيرة مصمتة؛ لا يتم التقاط الشاشة',
    'Remove animations': 'إزالة الرسوم المتحركة', 'Freeze glass while closed': 'تجميد الزجاج عند الإغلاق',
    'The glass refreshes only while the island is open': 'يتجدد الزجاج فقط عندما تكون الجزيرة مفتوحة',
    'Battery saver': 'موفر البطارية', 'Turns all three on when the battery runs low': 'يفعّل الخيارات الثلاثة عند انخفاض البطارية',
    'No battery': 'لا توجد بطارية', 'Below': 'أقل من', 'Location': 'الموقع', 'City': 'المدينة', 'Auto': 'تلقائي',
    'Use auto': 'استخدام التلقائي', 'Search for a city': 'ابحث عن مدينة',
    'Tabs': 'علامات التبويب', 'Media': 'الوسائط', 'Apps': 'التطبيقات', 'Shelf': 'الرف', 'Prayer': 'الصلاة',
    'Timer': 'المؤقت', 'System': 'النظام', 'Keep at least one tab': 'أبقِ علامة تبويب واحدة على الأقل',
    'Collapsed': 'الوضع المطوي', 'Clock & weather': 'الساعة والطقس', 'CPU & memory': 'المعالج والذاكرة',
    'Next prayer': 'الصلاة القادمة', 'Now playing': 'قيد التشغيل', 'Show media': 'إظهار الوسائط', 'Title': 'العنوان',
    'New track card': 'بطاقة المقطع الجديد', 'Give the island a new look. Every theme is free, and none of them makes Nova heavier; solid themes are even lighter.': 'امنح الجزيرة مظهراً جديداً. كل السمات مجانية ولا تزيد Nova ثقلاً؛ والسمات المصمتة أخف أيضاً.',
    'Nova': 'Nova', 'Eyes': 'العيون', 'At the adhan': 'عند الأذان', 'Focus sessions': 'جلسات التركيز',
    'Celebrations': 'الاحتفالات', 'Moments': 'اللحظات', 'Morning brief': 'موجز الصباح', 'Welcome back': 'مرحباً بعودتك',
    'Break reminders': 'تذكيرات الاستراحة', 'Network': 'الشبكة', 'Smart clipboard': 'الحافظة الذكية', 'Links, colors, math': 'روابط وألوان وحسابات',
    'Water': 'الماء', 'Water reminder': 'تذكير شرب الماء', 'Every': 'كل', 'Daily goal': 'الهدف اليومي',
    'Prayer alerts': 'تنبيهات الصلاة', 'Hanafi Asr': 'العصر الحنفي', 'Hijri date': 'التاريخ الهجري', 'Match local moon sighting': 'مطابقة رؤية الهلال المحلية',
    "Dhikr, du'a & Qur'an": 'الذكر والدعاء والقرآن', 'Show reminders': 'إظهار التذكيرات', 'On screen for': 'مدة العرض',
    "Qur'an verses": 'آيات قرآنية', 'Dhikr': 'الذكر', "Du'a": 'الدعاء', 'Quiet hours': 'ساعات الهدوء',
    'From': 'من', 'To': 'إلى', 'Show one now': 'إظهار واحد الآن', 'Alerts': 'التنبيهات', 'Volume': 'مستوى الصوت',
    'Brightness': 'السطوع', 'Battery': 'البطارية', 'Keyboard language': 'لغة لوحة المفاتيح', 'Caps Lock': 'Caps Lock',
    'News from Nova': 'أخبار Nova', 'Plugins, updates and news from the Nova team. Nothing is sent from your PC.': 'إضافات وتحديثات وأخبار من فريق Nova. لا يُرسل شيء من جهازك.',
    'Screenshots': 'لقطات الشاشة', 'Save screenshots to Shelf': 'حفظ لقطات الشاشة في الرف',
    'The file stays where it was saved': 'يبقى الملف في مكان حفظه', 'Keep on Shelf': 'الإبقاء على الرف', 'Privacy': 'الخصوصية',
    'Mic & camera dots': 'مؤشرات الميكروفون والكاميرا', 'Clipboard history': 'سجل الحافظة', 'Kept in memory only': 'يُحفظ في الذاكرة فقط',
    'Calendar': 'التقويم', 'Upcoming meetings': 'الاجتماعات القادمة', 'Save': 'حفظ', 'Status': 'الحالة', 'Not linked': 'غير مرتبط',
    'How to get the link': 'كيفية الحصول على الرابط', 'Downloads': 'التنزيلات', 'IDM Nova downloads': 'تنزيلات IDM Nova',
    'Browser downloads': 'تنزيلات المتصفح', 'Chrome, Edge, Firefox and others': 'Chrome وEdge وFirefox وغيرها',
    'Download alerts': 'تنبيهات التنزيل', 'Download folders': 'مجلدات التنزيل', 'Where your browser saves files': 'حيث يحفظ المتصفح الملفات',
    'Add folder': 'إضافة مجلد', 'Troubleshooting': 'استكشاف الأخطاء', 'System helper': 'مساعد النظام', 'Error log': 'سجل الأخطاء',
    'Open': 'فتح', 'Copy report': 'نسخ التقرير', 'All settings': 'كل الإعدادات',
    'Extra features you add only if you want them. Every plugin is checked before it installs.': 'ميزات إضافية تضيفها فقط إن أردت. يتم فحص كل إضافة قبل تثبيتها.',
    'Show': 'إظهار', 'All': 'الكل', 'Installed': 'المثبتة', 'Loading…': 'جارٍ التحميل…', 'Install from a file…': 'تثبيت من ملف…',
    'Install': 'تثبيت', 'Installing…': 'جارٍ التثبيت…', 'Update': 'تحديث', 'Remove': 'إزالة', 'Free': 'مجاني', 'Open source': 'مفتوح المصدر',
    'Nova Island is free, with no ads, and always will be. If it makes your day a little better:': 'Nova Island مجاني وبدون إعلانات وسيبقى كذلك. إن جعل يومك أفضل قليلاً:',
    'Buy us a coffee': 'اشترِ لنا قهوة', 'Ko-fi · cards and PayPal': 'Ko-fi · بطاقات وPayPal', 'From Egypt': 'من مصر', 'Star on GitHub': 'أضف نجمة على GitHub',
    'Free, and it helps others find Nova': 'مجاني ويساعد الآخرين على العثور على Nova',
    'Other apps from the Nova team. Free and open source, like Nova Island.': 'تطبيقات أخرى من فريق Nova، مجانية ومفتوحة المصدر مثل Nova Island.',
    'Beautiful QR codes, in seconds. Links, PDFs, Wi-Fi, contacts and more.': 'رموز QR جميلة خلال ثوانٍ. روابط وملفات PDF وشبكات Wi-Fi وجهات اتصال والمزيد.',
    'Download': 'تنزيل', 'More apps are on the way.': 'المزيد من التطبيقات قادم.',
    'Original Nova': 'Nova الأصلي', 'Liquid glass': 'زجاج سائل', 'Deep green and gold': 'أخضر داكن وذهبي',
    'Glass with a clean line': 'زجاج بخط أنيق', 'Pure black': 'أسود خالص', 'Pine green': 'أخضر صنوبر',
    'Winter glass': 'زجاج شتوي', 'Little ears, paws for eyes': 'أذنان صغيرتان وكفوف مكان العينين',
    'Violet sky and stars': 'سماء بنفسجية ونجوم', 'Northern lights': 'الشفق القطبي', 'Deep blue waves': 'أمواج زرقاء عميقة',
    'Sakura pink, flowers for eyes': 'وردي الساكورا وزهور مكان العينين', 'Glowing embers': 'جمر متوهج',
    'Pixel green': 'أخضر بكسلي', 'Lighter': 'أخف',
    'Saved': 'تم الحفظ', 'Done': 'تم', 'Search': 'بحث', 'Less': 'أقل', 'More': 'أكثر', 'Earlier': 'أبكر', 'Later': 'لاحقاً',
    'Minimize': 'تصغير', 'Close': 'إغلاق', 'Remove folder': 'إزالة المجلد', 'Version': 'الإصدار'
  };
  let language = 'en';
  const originals = new WeakMap();
  const translate = (text) => AR[text] || text;
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed) return;
      if (!originals.has(node)) originals.set(node, raw);
      const source = originals.get(node);
      const sourceTrimmed = source.trim();
      node.nodeValue = language === 'ar' ? source.replace(sourceTrimmed, translate(sourceTrimmed)) : source;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || ['SCRIPT', 'STYLE'].includes(node.tagName)) return;
    ['placeholder', 'aria-label', 'title'].forEach((attr) => {
      if (node.hasAttribute(attr)) {
        const key = `${attr}:${node.getAttribute(attr)}`;
        if (!originals.has(node[`${attr}Node`] || node)) originals.set(node[`${attr}Node`] || node, key);
        const original = (node.dataset[`i18n${attr.replace('-', '')}`] ||= node.getAttribute(attr));
        node.setAttribute(attr, language === 'ar' ? translate(original) : original);
      }
    });
    node.childNodes.forEach(translateNode);
  }
  function setLanguage(next) {
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? AR['Nova Island Settings'] : 'Nova Island Settings';
    translateNode(document.body);
  }
  const api = { setLanguage, t: (text) => language === 'ar' ? translate(text) : text, get language() { return language; }, AR };
  root.prefsI18n = api;
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    new MutationObserver((changes) => changes.forEach((change) => change.addedNodes.forEach(translateNode)))
      .observe(document.body, { childList: true, subtree: true });
  }
  if (typeof module !== 'undefined') module.exports = { AR };
})(typeof window !== 'undefined' ? window : globalThis);
