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
  navigator.clipboard.writeText(ip).then(() => {
    const btn = document.getElementById('copyBtn');
    const icon = document.getElementById('ipIcon');
    const text = document.getElementById('ipText');
    btn.classList.add('copied');
    icon.textContent = '✓';
    text.textContent = 'Скопировано!';
    showToast();
    setTimeout(() => {
      btn.classList.remove('copied');
      icon.textContent = '⬡';
      text.textContent = ip;
    }, 2500);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = ip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast();
  });
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}


// ─── РЕАЛЬНЫЙ ТИКЕР ОНЛАЙНА С СЕРВЕРА ───
function updateRealPlayerCount() {
  const domain = 'mc.fdmine.ru'; // Используем домен вместо голого IP с портом
  const element = document.getElementById('playerCount');
  const navCount = document.getElementById('navCount');
  
  if (!element && !navCount) return;
  
  fetch(`https://api.mcsrvstat.us/3/${domain}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.online === true) {
        const playersOnline = data.players ? data.players.online : 0;
        
        if (element) {
          element.textContent = playersOnline;
          element.style.color = '';
        }
        if (navCount) {
          navCount.textContent = playersOnline;
        }
      } else {
        if (element) {
          element.textContent = 'OFF';
          element.style.color = '#ff3cac';
        }
        if (navCount) {
          navCount.textContent = 'OFF';
        }
      }
    })
    .catch(error => {
      console.error('Ошибка получения онлайна:', error);
      if (element) element.textContent = '?';
      if (navCount) navCount.textContent = '?';
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

// ─── ДВИЖЕНИЕ ШАРОВ ЗА МЫШКОЙ ───
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

(function animateBlobs() {
  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;

  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((b, i) => {
    const strength = (i + 1) * 18;
    b.style.setProperty('--mx', `${currentX * strength}px`);
    b.style.setProperty('--my', `${currentY * strength}px`);
  });

  requestAnimationFrame(animateBlobs);
})();