// Simple micro-interaction for hero media trigger
const playBtn = document.getElementById('heroPlayTrigger');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    alert(
      'Med AI Demonstration: Yakraz processes natural language commands directly on your device using local neural models without transmitting sensitive medical data to external clouds.',
    );
  });
}

// Language toggle (EN / RU)
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
if (langToggle && langLabel && typeof switchLanguage === 'function') {
  const updateLabel = () => {
    langLabel.textContent = (currentLang || 'en').toUpperCase();
  };
  langToggle.addEventListener('click', () => {
    switchLanguage(currentLang === 'en' ? 'ru' : 'en');
    updateLabel();
  });
  // Ensure label reflects the initial (possibly persisted) language
  updateLabel();
}

// "Coming Soon" dialog — footer legal links (Privacy Policy, Terms of Service,
// Security Protocol). Interactions use event delegation on `document` because
// script.js is loaded before the footer and dialog markup exist in the DOM.
const openComingSoon = () => {
  const dialog = document.getElementById('comingSoonDialog');
  if (!dialog) return;
  dialog.classList.remove('hidden');
  dialog.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const panel = dialog.querySelector('[data-dialog-panel]');
  if (panel) panel.focus();
};

const closeComingSoon = () => {
  const dialog = document.getElementById('comingSoonDialog');
  if (!dialog) return;
  dialog.classList.add('hidden');
  dialog.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-coming-soon]')) {
    event.preventDefault();
    openComingSoon();
  } else if (event.target.closest('[data-dialog-close]')) {
    closeComingSoon();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeComingSoon();
});

// translations.js executes before the footer and dialog are parsed, so re-apply
// the active language once the full document is ready.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof switchLanguage === 'function') switchLanguage(currentLang);
});
