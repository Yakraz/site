// i18n integrity test
// Validates that every data-i18n key in index.html has an entry in the
// en AND ru dictionaries in translations.js, and that language switching works.
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const translationsSrc = fs.readFileSync('translations.js', 'utf8');

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// --- Collect every data-i18n key from the HTML (multiline-safe regex) ---
const attrPattern = /data-i18n="(k\d{4})"/g;
const htmlKeys = [...html.matchAll(attrPattern)].map((m) => m[1]);
check(htmlKeys.length > 0, 'no data-i18n keys found in index.html');
check(
  new Set(htmlKeys).size === htmlKeys.length,
  'duplicate data-i18n keys in index.html: ' +
    [...new Set(htmlKeys.filter((k, i) => htmlKeys.indexOf(k) !== i))].join(
      ', ',
    ),
);

// --- Minimal DOM shim to run translations.js ---
class FakeEl {
  constructor(key) {
    this._attrs = { ['data-i18n']: key };
    this.nodeData = { key };
    this._text = '';
  }
  getAttribute(name) {
    return this._attrs[name] ?? null;
  }
  setAttribute(name, value) {
    this._attrs[name] = String(value);
  }
  get textContent() {
    return this._text;
  }
  set textContent(v) {
    this._text = String(v);
  }
  addEventListener() {}
}

const domEls = htmlKeys.map((k) => new FakeEl(k));
const fakeDocument = {
  documentElement: { lang: '' },
  querySelectorAll: (sel) => (sel === '[data-i18n]' ? domEls : []),
};
const fakeStorage = (() => {
  const s = {};
  return {
    getItem: (k) => (k in s ? s[k] : null),
    setItem: (k, v) => (s[k] = String(v)),
  };
})();

const context = {
  document: fakeDocument,
  localStorage: fakeStorage,
  navigator: { language: 'en-US' },
  console,
};
vm.createContext(context);
vm.runInContext(translationsSrc, context);
const i18n = vm.runInContext('i18n', context);

// --- Dictionaries must be complete and symmetric ---
check(i18n.en && i18n.ru, 'i18n.en / i18n.ru missing');
const enKeys = Object.keys(i18n.en || {});
const ruKeys = Object.keys(i18n.ru || {});
check(
  enKeys.length === ruKeys.length,
  `en/ru key count mismatch: ${enKeys.length} vs ${ruKeys.length}`,
);
check(
  JSON.stringify([...enKeys].sort()) === JSON.stringify([...ruKeys].sort()),
  'en/ru key sets differ',
);

// Every HTML key must exist in both dicts; every dict key must be used in HTML
const missing = htmlKeys.filter(
  (k) => !(k in (i18n.en || {})) || !(k in (i18n.ru || {})),
);
check(
  missing.length === 0,
  'keys missing from dictionaries: ' + [...new Set(missing)].join(', '),
);
const unused = enKeys.filter((k) => !htmlKeys.includes(k));
check(
  unused.length === 0,
  'dictionary keys not used in HTML: ' + unused.join(', '),
);

// --- Language switching must update texts + html lang ---
vm.runInContext("switchLanguage('ru')", context);
check(
  fakeDocument.documentElement.lang === 'ru',
  'html lang should be ru after switch',
);
const sample = domEls.find((e) => e.nodeData.key === 'k0008');
check(
  sample && sample.textContent === i18n.ru.k0008,
  'k0008 should show RU "Скачать приложение"',
);

vm.runInContext("switchLanguage('en')", context);
check(
  fakeDocument.documentElement.lang === 'en',
  'html lang should be en after switch',
);
const sampleEn = domEls.find((e) => e.nodeData.key === 'k0008');
check(
  sampleEn && sampleEn.textContent === i18n.en.k0008,
  'k0008 should show EN "Download App"',
);

if (errors.length) {
  console.error('i18n test FAILED:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('i18n test passed:');
console.log('  - ' + htmlKeys.length + ' data-i18n keys in HTML');
console.log(
  '  - ' +
    enKeys.length +
    ' en / ' +
    ruKeys.length +
    ' ru dictionary entries, complete & symmetric',
);
console.log('  - language switch ru<=>en works (html lang + element text)');
