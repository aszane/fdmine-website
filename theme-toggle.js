// ─── ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ───
(function () {
  const STORAGE_KEY = 'fdmine-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Применяем сохранённую тему сразу при загрузке (до рендера)
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyTheme(saved);

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  };
})();
