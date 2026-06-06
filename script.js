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
  const ip = '5.83.140.202:25784';
  const element = document.getElementById('playerCount');
  if (!element) return;
  fetch(`https://api.mcsrvstat.us/3/${ip}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.online === true) {
        const playersOnline = data.players ? data.players.online : 0;
        element.textContent = playersOnline;
        element.style.color = '';
      } else {
        element.textContent = 'OFF';
        element.style.color = '#ff3cac';
      }
    })
    .catch(error => {
      console.error('Ошибка получения онлайна:', error);
      element.textContent = '?';
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
  if (links.style.display === 'flex') {
    links.style.display = '';
    links.style.position = '';
    links.style.top = '';
    links.style.left = '';
    links.style.right = '';
    links.style.background = '';
    links.style.padding = '';
    links.style.borderRadius = '';
    links.style.flexDirection = '';
    links.style.border = '';
  } else {
    links.style.display = 'flex';
    links.style.position = 'fixed';
    links.style.top = '80px';
    links.style.left = '20px';
    links.style.right = '20px';
    links.style.background = 'rgba(6,8,16,0.95)';
    links.style.backdropFilter = 'blur(20px)';
    links.style.padding = '20px';
    links.style.borderRadius = '20px';
    links.style.flexDirection = 'column';
    links.style.border = '1px solid rgba(255,255,255,0.10)';
    links.style.gap = '4px';
  }
}

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