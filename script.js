/* ================== CONFIGURACIÓN ==================
   Si quieres cuenta regresiva para cuando se vean, pon la fecha aquí.
   Formato: 'AAAA-MM-DDTHH:MM'  (ejemplo: '2026-12-20T09:00'). Déjalo vacío para ocultarla. */
const REUNION_DATE = '';

const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

/* ---------- Iconos Lucide ---------- */
function renderIcons() { if (window.lucide) lucide.createIcons(); }

/* ---------- Corazones de fondo ---------- */
(function () {
  const bg = document.getElementById('heartsBg');
  const colors = ['#ff6b9d', '#ff4d8d', '#ffb3d1', '#c77dff', '#ffd1e8'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'heart-float';
    el.innerHTML = HEART;
    const s = 12 + Math.random() * 18;
    el.style.cssText =
      'left:' + Math.random() * 100 + '%;width:' + s + 'px;height:' + s + 'px;color:' + colors[i % colors.length] +
      ';animation-duration:' + (9 + Math.random() * 9) + 's;animation-delay:-' + Math.random() * 18 + 's';
    bg.appendChild(el);
  }
})();

/* ---------- Estrellitas que titilan ---------- */
(function () {
  const bg = document.getElementById('heartsBg');
  for (let i = 0; i < 16; i++) {
    const s = 6 + Math.random() * 10;
    bg.insertAdjacentHTML('beforeend', '<svg class="star-float" viewBox="0 0 24 24" style="left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (2 + Math.random() * 3) + 's;animation-delay:-' + Math.random() * 4 + 's"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>');
  }
})();

/* ---------- Navegación ---------- */
const TOTAL = document.querySelectorAll('.screen').length;
let current = 1;
const dots = document.getElementById('dots');
const backBtn = document.getElementById('backBtn');
for (let i = 1; i <= TOTAL; i++) dots.insertAdjacentHTML('beforeend', '<span class="dot"></span>');

function showScreen(n) {
  if (n < 1 || n > TOTAL || n === current && document.getElementById('screen' + n).classList.contains('active')) return;
  document.getElementById('screen' + current).classList.remove('active');
  current = n;
  const el = document.getElementById('screen' + n);
  el.classList.add('active');
  el.scrollTop = 0;
  [...dots.children].forEach((d, i) => d.classList.toggle('on', i === n - 1));
  backBtn.classList.toggle('show', n > 1);
  if (n === 2 || n === TOTAL) setTimeout(launchConfetti, 400);
  if (n === 3) updateCountdown();
}
function next() { showScreen(current + 1); }
function prev() { showScreen(current - 1); }
function restart() {
  document.querySelectorAll('.reason-card.flipped').forEach((c) => c.classList.remove('flipped', 'used'));
  showScreen(1);
}
dots.children[0].classList.add('on');

/* Deslizar con el dedo */
let tx = 0, ty = 0;
document.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 70 && Math.abs(dy) < 50) { dx < 0 ? next() : prev(); }
}, { passive: true });

/* ---------- Cuenta regresiva ---------- */
let cdTimer;
function updateCountdown() {
  const box = document.getElementById('countdown');
  const target = REUNION_DATE && new Date(REUNION_DATE).getTime();
  if (!target || target <= Date.now()) { box.hidden = true; return; }
  box.hidden = false;
  const tick = () => {
    const ms = Math.max(0, target - Date.now());
    document.getElementById('cdD').textContent = Math.floor(ms / 864e5);
    document.getElementById('cdH').textContent = Math.floor(ms % 864e5 / 36e5);
    document.getElementById('cdM').textContent = Math.floor(ms % 36e5 / 6e4);
  };
  tick(); clearInterval(cdTimer); cdTimer = setInterval(tick, 30000);
}

/* ---------- Confeti ---------- */
function launchConfetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.style.display = 'block';
  const colors = ['#ff6b9d', '#ffd700', '#ff4d8d', '#ffffff', '#c77dff', '#ffb3d1'];
  const ps = Array.from({ length: 130 }, () => ({
    x: Math.random() * W, y: -20 - Math.random() * H * .6,
    w: 5 + Math.random() * 7, h: 7 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: 1.5 + Math.random() * 3, vx: -1.2 + Math.random() * 2.4,
    rot: Math.random() * 6.28, vr: -.15 + Math.random() * .3, round: Math.random() > .5
  }));
  let f = 0;
  (function animate() {
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y += p.vy; p.x += p.vx; p.vy += .02; p.rot += p.vr;
      if (p.y > H + 24) { p.y = -20; p.x = Math.random() * W; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.28); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (++f < 260) requestAnimationFrame(animate);
    else { canvas.style.display = 'none'; ctx.clearRect(0, 0, W, H); }
  })();
}

/* ---------- Corazones al tocar ---------- */
function heartBurst(x, y) {
  const colors = ['#ff6b9d', '#ff4d8d', '#ffb3d1'];
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('div');
    const s = 14 + Math.random() * 14;
    h.innerHTML = HEART;
    h.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + s + 'px;height:' + s + 'px;fill:' + colors[i % 3] +
      ';pointer-events:none;z-index:200;opacity:1;transition:transform 1s ease-out,opacity 1s ease-out';
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      h.style.transform = 'translate(' + (Math.random() - .5) * 140 + 'px,' + (-60 - Math.random() * 80) + 'px) scale(.4)';
      h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 1100);
  }
}
document.querySelectorAll('.reason-card').forEach((c) =>
  c.addEventListener('click', (e) => { c.classList.toggle('flipped'); heartBurst(e.clientX, e.clientY); }));
renderIcons();