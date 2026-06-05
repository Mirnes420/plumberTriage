document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => {
    // Split text into words and wrap each in a span
    const words = el.textContent.split(/\s+/).filter(Boolean);
    el.innerHTML = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + (i < words.length - 1 ? ' ' : '');
      span.className = 'word';
      el.appendChild(span);
    });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const spans = el.querySelectorAll('span.word');
        spans.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add('visible');
          }, idx * 60); // stagger
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu dynamically when users click anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Menu Overlay Controllers
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // PostHog Explicit Custom Event Capture Engine
  document.body.addEventListener('click', (event) => {
    const trackTarget = event.target.closest('[data-track]');

    if (trackTarget && window.posthog) {
      const eventIdentifier = trackTarget.getAttribute('data-track');

      posthog.capture(eventIdentifier, {
        clicked_element_id: trackTarget.id || 'unassigned_id',
        destination_url: trackTarget.href || 'no_href',
        viewport_width: window.innerWidth
      });
    }
  });
});