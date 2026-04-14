/* ============================================================
   JESSE BERNSTEIN HOMES — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     Navigation: transparent → solid on scroll
  ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero, .page-hero');

  function updateNav() {
    if (!nav) return;
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('nav--solid');
      nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('nav--solid');
      nav.classList.add('nav--transparent');
    }
  }

  if (nav) {
    if (hero) {
      nav.classList.add('nav--transparent');
    } else {
      nav.classList.add('nav--solid');
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ----------------------------------------------------------
     Active nav link
  ---------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     Mobile menu toggle
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     Hero Ken Burns effect
  ---------------------------------------------------------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    setTimeout(() => {
      document.querySelector('.hero')?.classList.add('loaded');
    }, 100);
  }

  /* ----------------------------------------------------------
     Scroll reveal
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     Stats counter animation
  ---------------------------------------------------------- */
  function animateCounter(el, target, suffix = '', duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNums = entry.target.querySelectorAll('[data-count]');
          statNums.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);
  }

  /* ----------------------------------------------------------
     Testimonials carousel (mobile)
  ---------------------------------------------------------- */
  const testiGrid = document.querySelector('.testimonials-grid');
  // On narrow screens, add swipe or show one at a time (optional)

  /* ----------------------------------------------------------
     Contact form submission (demo)
  ---------------------------------------------------------- */
  const forms = document.querySelectorAll('.js-contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.disabled = true;
      btn.style.background = '#4a7c59';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  });

  /* ----------------------------------------------------------
     Smooth anchor scroll
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----------------------------------------------------------
     Parallax hero on scroll (subtle)
  ---------------------------------------------------------- */
  const parallaxBg = document.querySelector('.hero__bg, .page-hero__bg');
  if (parallaxBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Listing card — "Request Info" hover action
  ---------------------------------------------------------- */
  document.querySelectorAll('.listing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.cursor = 'pointer';
    });
  });

  /* ----------------------------------------------------------
     Page transition fade-in
  ---------------------------------------------------------- */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  /* ----------------------------------------------------------
     Neighborhood card — keyboard accessibility
  ---------------------------------------------------------- */
  document.querySelectorAll('.nbhd-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });

});
