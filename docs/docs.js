// ─── ПРОГРЕСС-БАР СКРОЛЛА ───
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// ─── ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ДОКУМЕНТАЦИИ ───
const DOC_DEFAULT = 'info';
const DOC_FADE_MS = 180;

let docSwitching = false;

function showDocPage(id, opts = {}) {
  const instant = !!opts.instant;
  let target = document.getElementById('page-' + id);

  if (!target) {
    id = DOC_DEFAULT;
    target = document.getElementById('page-' + id);
  }

  const current = document.querySelector('.doc-page.active');

  // Уже на этой странице — ничего не делаем
  if (current === target) return;

  const links = document.querySelectorAll('.doc-nav-link');
  links.forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector('.doc-nav-link[data-page="' + id + '"]');
  if (activeLink) activeLink.classList.add('active');

  // Первая загрузка — без анимации
  if (!current || instant) {
    document.querySelectorAll('.doc-page').forEach(p => p.classList.remove('active', 'fading'));
    target.classList.add('active');
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
    return;
  }

  if (docSwitching) return;
  docSwitching = true;

  current.classList.add('fading');
  setTimeout(() => {
    current.classList.remove('active', 'fading');
    target.classList.add('active');
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    docSwitching = false;
  }, DOC_FADE_MS);
}

function closeMobileSidebar() {
  // ФИКС: исправлены ID элементов на правильные (с дефисами), как в index.html
  const sidebar = document.getElementById('doc-sidebar');
  const toggle = document.getElementById('doc-sidebar-toggle');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    if (toggle) toggle.classList.remove('open');
  }
}

function getHashId() {
  return (location.hash || '').replace('#', '') || DOC_DEFAULT;
}

window.addEventListener('hashchange', () => showDocPage(getHashId()));
document.addEventListener('DOMContentLoaded', () => showDocPage(getHashId(), { instant: true }));

// ─── МОБИЛЬНЫЙ САЙДБАР ───
function toggleDocSidebar() {
  // ФИКС: исправлены ID элементов на правильные (с дефисами), как в index.html
  const sidebar = document.getElementById('doc-sidebar');
  const toggle = document.getElementById('doc-sidebar-toggle');
  if (sidebar) sidebar.classList.toggle('open');
  if (toggle) toggle.classList.toggle('open');
}

// ─── АККОРДЕОН (FAQ) ───
// ФИКС: убрана дублирующая реализация toggleAcc.
// Она переопределяла функцию из script.js (тот файл подключён на странице раньше)
// и работала с классом .open на .acc-item, а не на .acc-q/.acc-a — а под это
// заточен весь CSS в style.css (.acc-q.open, .acc-a.open). Из-за переопределения
// ответы в FAQ документации физически не открывались при клике.
// Используем общую функцию из script.js — она уже подключена в index.html.

// copyIP() — общая функция, определена в script.js (подключён раньше)
// ─── МОБИЛЬНЫЙ BREADCRUMB ───
function updateBreadcrumb(id) {
  const breadcrumb = document.getElementById('doc-breadcrumb');
  if (!breadcrumb) return;
  const link = document.querySelector('.doc-nav-link[data-page="' + id + '"]');
  if (!link) { breadcrumb.innerHTML = ''; return; }
  const icon = link.querySelector('.doc-nav-icon') ? link.querySelector('.doc-nav-icon').textContent : '';
  const label = link.textContent.replace(icon, '').trim();
  const group = link.closest('.doc-nav-group');
  const groupTitle = group ? group.querySelector('.doc-nav-group-title').textContent : '';
  breadcrumb.innerHTML =
    '<span class="doc-bc-group">' + groupTitle + '</span>' +
    '<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M5 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '<span class="doc-bc-page">' + icon + ' ' + label + '</span>';
}

// Патчим showDocPage чтобы он обновлял breadcrumb
const _origShowDocPage = showDocPage;
showDocPage = function(id, opts) {
  _origShowDocPage(id, opts);
  // Небольшая задержка чтобы active-класс уже проставился
  setTimeout(() => updateBreadcrumb(id), 10);
  setTimeout(() => moveNavIndicator(id), 10);
};

// ─── СКОЛЬЗЯЩИЙ ИНДИКАТОР АКТИВНОГО РАЗДЕЛА ───
let navIndicatorEl = null;

function ensureNavIndicator() {
  if (navIndicatorEl) return navIndicatorEl;
  const sidebar = document.getElementById('doc-sidebar');
  if (!sidebar) return null;
  navIndicatorEl = document.createElement('div');
  navIndicatorEl.className = 'doc-nav-indicator';
  sidebar.prepend(navIndicatorEl);
  return navIndicatorEl;
}

function moveNavIndicator(id) {
  const indicator = ensureNavIndicator();
  if (!indicator) return;

  const link = document.querySelector('.doc-nav-link[data-page="' + id + '"]');
  if (!link || link.offsetParent === null) {
    indicator.style.opacity = '0';
    return;
  }

  indicator.style.transform = 'translate(' + link.offsetLeft + 'px, ' + link.offsetTop + 'px)';
  indicator.style.width = link.offsetWidth + 'px';
  indicator.style.height = link.offsetHeight + 'px';
  indicator.style.opacity = '1';
}

window.addEventListener('resize', () => {
  const active = document.querySelector('.doc-nav-link.active');
  if (active) moveNavIndicator(active.dataset.page);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    const active = document.querySelector('.doc-nav-link.active');
    if (active) moveNavIndicator(active.dataset.page);
  });
}

// ─── ПОИСК ПО ДОКУМЕНТАЦИИ ───
function searchDocs(query) {
  const results = document.getElementById('doc-search-results');
  const navGroups = document.querySelectorAll('.doc-nav-group');
  const clearBtn = document.getElementById('doc-search-clear');

  query = query.trim().toLowerCase();

  if (clearBtn) clearBtn.style.display = query ? 'flex' : 'none';

  if (!query) {
    results.innerHTML = '';
    results.style.display = 'none';
    navGroups.forEach(g => g.style.display = '');
    const active = document.querySelector('.doc-nav-link.active');
    if (active) setTimeout(() => moveNavIndicator(active.dataset.page), 10);
    return;
  }

  // Скрываем обычную навигацию
  navGroups.forEach(g => g.style.display = 'none');
  if (navIndicatorEl) navIndicatorEl.style.opacity = '0';

  // Ищем по всем страницам
  const pages = document.querySelectorAll('.doc-page');
  const hits = [];

  pages.forEach(page => {
    const id = page.id.replace('page-', '');
    const link = document.querySelector('.doc-nav-link[data-page="' + id + '"]');
    if (!link) return;

    // Ищем по тексту страницы (без HTML-тегов)
    const text = page.textContent || '';
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return;

    const icon = link.querySelector('.doc-nav-icon') ? link.querySelector('.doc-nav-icon').textContent : '';
    const label = link.textContent.replace(icon, '').trim();

    // Контекст вокруг найденного слова
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 60);
    let snippet = (start > 0 ? '…' : '') + text.slice(start, end).replace(/\s+/g, ' ').trim() + (end < text.length ? '…' : '');

    // Подсвечиваем найденное слово
    const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    snippet = snippet.replace(re, '<mark>$1</mark>');

    hits.push({ id, icon, label, snippet });
  });

  if (hits.length === 0) {
    results.innerHTML = '<div class="doc-search-empty">Ничего не найдено</div>';
  } else {
    results.innerHTML = hits.map(h =>
      '<a class="doc-search-hit" href="#' + h.id + '" onclick="clearDocSearch()">' +
        '<span class="doc-search-hit-title">' + h.icon + ' ' + h.label + '</span>' +
        '<span class="doc-search-hit-snippet">' + h.snippet + '</span>' +
      '</a>'
    ).join('');
  }

  results.style.display = 'block';
}

function clearDocSearch() {
  const input = document.getElementById('doc-search');
  if (input) { input.value = ''; searchDocs(''); }
}