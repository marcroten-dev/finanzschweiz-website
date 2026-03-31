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

  // FAQ: delegated handler for .faq containers
  const faqContainer = document.querySelector('.faq');
  if (faqContainer) {
    faqContainer.addEventListener('click', function(e) {
      const q = e.target.closest('.faq-q');
      if (!q || !faqContainer.contains(q)) return;
      const item = q.parentElement;
      if (!item || !item.classList.contains('faq-item')) return;
      faqContainer.querySelectorAll('.faq-item.open').forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.toggle('open');
    });
  }
});

/* Client-side newsletter handler only (PDF removed) */
document.addEventListener('DOMContentLoaded', function(){
  function isValidEmail(e){ return /\S+@\S+\.\S+/.test(e); }

  // Newsletter form: client-side only, store emails locally
  const newsletter = document.getElementById('newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function(ev){
      ev.preventDefault();
      const emailInput = newsletter.querySelector('input[name="email"]');
      if (!emailInput) return;
      const emailVal = emailInput.value.trim();
      if (!isValidEmail(emailVal)) { alert('Bitte gib eine gültige E‑Mail‑Adresse ein.'); emailInput.focus(); return; }
      try{
        const list = JSON.parse(localStorage.getItem('fs-newsletter')||'[]');
        list.push({email:emailVal,ts:Date.now()});
        localStorage.setItem('fs-newsletter', JSON.stringify(list));
      }catch(e){}
      alert('Danke — du bist für den Newsletter angemeldet.');
      try{ newsletter.reset(); }catch(e){}
    });
  }

});

