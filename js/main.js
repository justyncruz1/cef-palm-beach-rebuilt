/* ============================================
   CEF Palm Beach & Treasure Coast
   Core JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Animation Observer ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve stagger parents until all children are visible
        if (!entry.target.classList.contains('stagger')) {
          observer.unobserve(entry.target);
        } else {
          setTimeout(() => observer.unobserve(entry.target), 800);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-in, .stagger, .text-highlight').forEach(el => {
    observer.observe(el);
  });

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('mobile-menu--open');
      if (isOpen) {
        mobileMenu.classList.remove('mobile-menu--open');
        menuToggle.classList.remove('menu-toggle--open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('mobile-menu--open');
        menuToggle.classList.add('menu-toggle--open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Mobile submenu toggles
    mobileMenu.querySelectorAll('.mobile-menu__toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = toggle.nextElementSibling;
        if (sub) {
          sub.classList.toggle('mobile-menu__sub--open');
          const arrow = toggle.querySelector('svg');
          if (arrow) {
            arrow.style.transform = sub.classList.contains('mobile-menu__sub--open')
              ? 'rotate(180deg)' : '';
          }
        }
      });
    });
  }

  // --- Count Up Animation ---
  const countUpElements = document.querySelectorAll('.count-up');
  if (countUpElements.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countUpElements.forEach(el => countObserver.observe(el));
  }

  // --- Accordion ---
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all siblings
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion__item--open').forEach(openItem => {
        openItem.classList.remove('accordion__item--open');
        const openContent = openItem.querySelector('.accordion__content');
        openContent.style.maxHeight = '0';
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('accordion__item--open');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Testimonial Carousel ---
  const carousels = document.querySelectorAll('.testimonial-carousel');
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.testimonial');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let autoplayTimer;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
        slide.setAttribute('aria-hidden', i !== index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('carousel-dot--active', i === index);
        dot.setAttribute('aria-selected', i === index);
      });
      currentSlide = index;
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        resetAutoplay();
      });
    });

    const nextSlide = () => {
      showSlide((currentSlide + 1) % slides.length);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, 6000);
    };

    if (slides.length > 0) {
      showSlide(0);
      resetAutoplay();
    }
  });

  // --- Spotlight Card Effect ---
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spot-x', x + 'px');
      card.style.setProperty('--spot-y', y + 'px');
      if (card.querySelector('::before')) {
        card.style.setProperty('--spot-x', x + 'px');
        card.style.setProperty('--spot-y', y + 'px');
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Close mobile menu on link click ---
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a:not(.mobile-menu__toggle)').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu--open');
        menuToggle.classList.remove('menu-toggle--open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

});
