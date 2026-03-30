/* FinanzSchweiz.ch — Main JS */
document.addEventListener('DOMContentLoaded', () => {

  // NAV SCROLL
  const nav = document.querySelector('.nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

  // MOBILE MENU
  const burger = document.querySelector('.nav-hamburger');
  const mMenu = document.querySelector('.mobile-menu');
  const mClose = document.querySelector('.mobile-menu-close');
  if (burger && mMenu) burger.addEventListener('click', () => { mMenu.classList.add('open'); document.body.style.overflow = 'hidden'; });
  if (mClose) mClose.addEventListener('click', () => { mMenu.classList.remove('open'); document.body.style.overflow = ''; });
  if (mMenu) mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mMenu.classList.remove('open'); document.body.style.overflow = ''; }));

  // SCROLL REVEAL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // ACTIVE NAV
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if ((a.getAttribute('href') || '').includes(page)) a.classList.add('active');
  });

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // FAQ
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open'));
  });

  // BLOG FILTER
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.art-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
      });
    });
  });
});

