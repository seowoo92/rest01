// ── 다크모드 토글 ────────────────────────────
(function initTheme() {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)');

  function apply(dark) {
    html.dataset.theme = dark ? 'dark' : 'light';
    if (btn) btn.innerHTML = dark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

  apply(stored ? stored === 'dark' : system.matches);

  btn?.addEventListener('click', () => {
    const isDark = html.dataset.theme !== 'dark';
    apply(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  system.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) apply(e.matches);
  });
})();

// 네비게이션 스크롤 효과
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});

// 햄버거 메뉴
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-label', navLinks.classList.contains('open') ? '메뉴 닫기' : '메뉴 열기');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// 활성 링크 업데이트
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// 스크롤 페이드인 애니메이션
const fadeTargets = document.querySelectorAll(
  '.about-grid, .skill-category, .timeline-item, .project-card, .contact-grid, .hero-content'
);

fadeTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => observer.observe(el));

// 히어로 즉시 표시
document.querySelector('.hero-content')?.classList.add('visible');

// ── 수채화 그라디언트 오브 효과 ─────────────────
(function initOrbs() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PALETTE_LIGHT = [
    ['37,99,235',   '29,78,216'],
    ['236,72,153',  '190,24,93'],
    ['234,179,8',   '161,98,7'],
    ['96,165,250',  '59,130,246'],
    ['249,168,212', '244,114,182'],
    ['253,230,138', '251,191,36'],
  ];
  const PALETTE_DARK = [
    ['96,165,250',  '59,130,246'],
    ['244,114,182', '236,72,153'],
    ['253,224,71',  '234,179,8'],
    ['147,197,253', '96,165,250'],
    ['249,168,212', '244,114,182'],
    ['254,240,138', '253,224,71'],
  ];
  function getPalette() {
    return document.documentElement.dataset.theme === 'dark' ? PALETTE_DARK : PALETTE_LIGHT;
  }

  let orbs = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createOrb() {
    const pal = getPalette();
    const c = pal[Math.floor(Math.random() * pal.length)];
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      r:      Math.random() * 110 + 60,
      vx:     (Math.random() - 0.5) * 0.25,
      vy:     (Math.random() - 0.5) * 0.25,
      c0:     c[0],
      c1:     c[1],
      alpha:  Math.random() * 0.13 + 0.07,
      phase:  Math.random() * Math.PI * 2,
      pSpeed: Math.random() * 0.004 + 0.002,
    };
  }

  function buildOrbs() {
    orbs = Array.from({ length: 11 }, createOrb);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach(o => {
      o.phase += o.pSpeed;
      o.x += o.vx + Math.sin(o.phase) * 0.35;
      o.y += o.vy + Math.cos(o.phase * 0.8) * 0.25;

      if (o.x < -o.r) o.x = canvas.width  + o.r;
      if (o.x > canvas.width  + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;

      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0,   `rgba(${o.c0},${o.alpha})`);
      g.addColorStop(0.5, `rgba(${o.c1},${o.alpha * 0.5})`);
      g.addColorStop(1,   `rgba(${o.c1},0)`);

      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  buildOrbs();
  tick();

  window.addEventListener('resize', () => { resize(); buildOrbs(); });
})();

// 연락처 폼 (실제 전송은 백엔드 연동 필요)
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '전송되었습니다! ✓';
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '보내기 <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});
