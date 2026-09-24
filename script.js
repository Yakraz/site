// Simple micro-interaction for hero media trigger
const playBtn = document.getElementById('heroPlayTrigger');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    alert(
      'Демонстрация Med AI: Yakraz обрабатывает команды на естественном языке прямо на вашем устройстве с помощью локальных нейросетевых моделей, не передавая конфиденциальные медицинские данные во внешние облака.',
    );
  });
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
