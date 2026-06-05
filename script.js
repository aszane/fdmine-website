// ─── COPY IP ───
function copyIP() {
  const ip = 'mc.fdmine.ru'; // Временно заменили на цифровой IP для копирования
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
      text.textContent = ip; // Возвращаем цифровой IP обратно
    }, 2500);
  }).catch(() => {
    // Резервный вариант, если браузер блокирует буфер
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
  // Твой реальный IP и порт
  const ip = '5.83.140.202:25784'; 
  const element = document.getElementById('playerCount');

  // Если вдруг элемент не найден, прерываем функцию
  if (!element) return;

  // Используем API mcsrvstat.us
  fetch(`https://api.mcsrvstat.us/3/${ip}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.online === true) {
        // Сервер онлайн, берем количество игроков
        const playersOnline = data.players ? data.players.online : 0;
        element.textContent = playersOnline;
        element.style.color = ''; // Сбрасываем цвет на дефолтный (если меняли)
      } else {
        // Сервер выключен
        element.textContent = 'OFF';
        element.style.color = '#ff3cac'; // Делаем текст розовым/красным
      }
    })
    .catch(error => {
      console.error('Ошибка получения онлайна:', error);
      // Если API не отвечает, ставим знак вопроса
      element.textContent = '?';
    });
}

// Запускаем проверку сразу при загрузке страницы
updateRealPlayerCount();
// Обновляем каждую минуту (60000 миллисекунд)
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

// ─── ДВИЖЕНИЕ ШАРОВ ЗА МЫШКОЙ (Исправлено) ───
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((b, i) => {
    const factor = (i + 1) * 0.3;
    // Используем setProperty, чтобы не ломать дефолтные css-анимации
    b.style.left = `calc(${b.offsetLeft}px + ${x * factor}px)`;
    b.style.top = `calc(${b.offsetTop}px + ${y * factor}px)`;
  });
});