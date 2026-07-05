// ─── ACCORDION ───
function toggleAcc(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Закрыть все в том же аккордионе
  const accordion = btn.closest('.accordion');
  accordion.querySelectorAll('.acc-q.open').forEach(openBtn => {
    openBtn.classList.remove('open');
    openBtn.nextElementSibling.classList.remove('open');
  });

  // Открыть текущий если был закрыт
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ─── FAQ TABS ───
function switchTab(id) {
  const currentPanel = document.querySelector('.faq-panel.active');
  const newPanel = document.getElementById('tab-' + id);

  // Не делаем ничего если таб уже активен
  if (currentPanel === newPanel) return;

  document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.faq-tab[onclick="switchTab('${id}')"]`).classList.add('active');

  // Fade out текущей панели, затем fade in новой
  currentPanel.classList.add('fading');
  setTimeout(() => {
    currentPanel.classList.remove('active', 'fading');
    newPanel.classList.add('active');
  }, 180);
}

// ─── COPY IP ───
function copyIP() {
  const ip = 'mc.fdmine.ru';

  function _onCopied() {
    if (typeof window._playClickSound === 'function') window._playClickSound();
    // Контекст главной страницы (#copyBtn)
    const btn = document.getElementById('copyBtn');
    const icon = document.getElementById('ipIcon');
    const text = document.getElementById('ipText');
    if (btn) {
      btn.classList.add('copied');
      if (icon) icon.textContent = '✓';
      if (text) text.textContent = 'Скопировано!';
      showToast();
      setTimeout(() => {
        btn.classList.remove('copied');
        if (icon) icon.textContent = '⬡';
        if (text) text.textContent = ip;
      }, 2500);
    }

    // Контекст документации (.footer-ip-btn)
    const docBtn = document.querySelector('.footer-ip-btn');
    if (docBtn) {
      const span = docBtn.querySelector('span:not(.footer-ip-dot)');
      const dot  = docBtn.querySelector('.footer-ip-dot');
      if (span) span.textContent = 'Скопировано!';
      if (dot)  dot.style.background = '#10ffa0';
      if (!btn) showToast(); // toast только если нет #copyBtn (т.е. мы в доках)
      setTimeout(() => {
        if (span) span.textContent = ip;
        if (dot)  dot.style.background = '';
      }, 2000);
    }
  }

  navigator.clipboard.writeText(ip).then(_onCopied).catch(() => {
    const el = document.createElement('textarea');
    el.value = ip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    _onCopied();
  });
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}


// ─── РЕАЛЬНЫЙ ТИКЕР ОНЛАЙНА С СЕРВЕРА ───
function updateRealPlayerCount() {
  const domain = 'mc.fdmine.ru';
  const element = document.getElementById('playerCount');
  const navCount = document.getElementById('navCount');

  if (!element && !navCount) return;

  // Показываем skeleton пока грузимся
  if (element) element.classList.add('skeleton');
  if (navCount) navCount.classList.add('skeleton');

  fetch(`https://api.mcsrvstat.us/3/${domain}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (element) { element.classList.remove('skeleton'); element.style.color = ''; }
      if (navCount) navCount.classList.remove('skeleton');

      if (data.online === true) {
        const playersOnline = data.players ? data.players.online : 0;
        if (element) element.textContent = playersOnline;
        if (navCount) navCount.textContent = playersOnline;
      } else {
        if (element) { element.textContent = 'OFF'; element.style.color = '#ff3cac'; }
        if (navCount) navCount.textContent = 'OFF';
      }
    })
    .catch(error => {
      console.error('Ошибка получения онлайна:', error);
      if (element) { element.classList.remove('skeleton'); element.textContent = '?'; }
      if (navCount) { navCount.classList.remove('skeleton'); navCount.textContent = '?'; }
    });
}

updateRealPlayerCount();
setInterval(updateRealPlayerCount, 60000);

// ─── ПРОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ───
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ─── SMOOTH SCROLL ДЛЯ ЯКОРЕЙ ───
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('nav')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});

// ─── МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ───
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const burger = document.querySelector('.nav-hamburger');
  links.classList.toggle('open');
  if (burger) burger.classList.toggle('open');
}

// Закрываем меню при клике по ссылке
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
      const burger = document.querySelector('.nav-hamburger');
      if (burger) burger.classList.remove('open');
    });
  });
});



// ─── КНОПКА "НАВЕРХ" ───
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
})();
// ─── ПОИСК ПО КРАТКИМ ПРАВИЛАМ (лендинг) ───
function filterRules(query) {
  const items = document.querySelectorAll('#rules-list .rule-item');
  const empty = document.getElementById('rules-empty');
  query = query.trim().toLowerCase();

  let visibleCount = 0;
  items.forEach(item => {
    const haystack = (item.dataset.text + ' ' + item.textContent).toLowerCase();
    const match = !query || haystack.includes(query);
    item.classList.toggle('hidden', !match);
    if (match) visibleCount++;
  });

  if (empty) empty.classList.toggle('visible', visibleCount === 0);
}