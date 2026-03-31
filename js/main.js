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

/* Client-side PDF delivery (no external API) */
document.addEventListener('DOMContentLoaded', function(){
  function isValidEmail(e){ return /\S+@\S+\.\S+/.test(e); }
  const form = document.getElementById('download-form');
  if (!form) return;

  function loadHtml2Pdf(cb){
    if (window.html2pdf) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
    s.onload = cb; s.onerror = cb;
    document.head.appendChild(s);
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    const emailEl = document.getElementById('download-email');
    if (!emailEl) return;
    const email = emailEl.value.trim();
    if (!isValidEmail(email)) { alert('Bitte gib eine gültige E‑Mail‑Adresse ein.'); emailEl.focus(); return; }

    try{ const list = JSON.parse(localStorage.getItem('fs-signups')||'[]'); list.push({email:email,ts:Date.now()}); localStorage.setItem('fs-signups', JSON.stringify(list)); }catch(e){}

    loadHtml2Pdf(function(){
      fetch('finanzstart-guide.html').then(function(r){ if(!r.ok) throw new Error('network'); return r.text(); }).then(function(html){
        const buf = document.getElementById('pdf-buffer');
        if (!buf) {
          alert('Fehler: PDF-Puffer nicht gefunden.');
          return;
        }
        buf.innerHTML = html;
        buf.style.display = 'block';
        // sanitize links
        Array.from(buf.querySelectorAll('a')).forEach(function(a){ a.removeAttribute('href'); });
        var opt = { margin:10, filename: 'FinanzStart-Guide.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} };
        html2pdf().from(buf).set(opt).save().then(function(){ buf.style.display='none'; try{ alert('Der Guide wurde heruntergeladen. Viel Erfolg beim Start!'); }catch(e){} }).catch(function(){ buf.style.display='none'; alert('Download fehlgeschlagen — bitte versuche die Seite erneut.'); });
      }).catch(function(){ alert('Fehler beim Laden des Guides. Bitte versuche es später erneut.'); });
    });
  });
});

