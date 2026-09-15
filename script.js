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
