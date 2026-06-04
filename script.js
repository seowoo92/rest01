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
