document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. SCROLL REVEAL ENGINE (Preserves HTML Tags & Layout Structures)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  revealElements.forEach(el => {
    // Process text nodes directly to avoid destroying inline HTML tags (<br>, <span>)
    const processNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/); // Keep spaces intact to protect typography layout
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          if (word.trim().length > 0) {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'word';
            fragment.appendChild(span);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursive loop to step inside spans or highlights safely
        Array.from(node.childNodes).forEach(processNodes);
      }
    };

    Array.from(el.childNodes).forEach(processNodes);
  });

  // Trigger reveal animations smoothly using intersection offsets
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const spans = el.querySelectorAll('span.word');
        spans.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add('visible');
          }, idx * 45); // Snappier stagger timing (45ms instead of 60ms)
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.05 });

  revealElements.forEach(el => observer.observe(el));

  // ==========================================================================
  // 2. MOBILE NAVIGATION OVERLAY SYSTEM (Single Clean Event Loop)
  // ==========================================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav');

  if (menuToggle && navMenu) {
    const toggleMenu = (e) => {
      // Stop the browser from triggering both touchstart AND click sequentially
      e.preventDefault();
      e.stopPropagation();

      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    // Bind to both native mobile touch start and standard pointer clicks
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu view context when an anchor routing link jumps down the page
    navMenu.querySelectorAll('a').forEach(link => {
      // Handle rapid mobile link selection tap
      link.addEventListener('touchstart', () => {
        if (navMenu.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, { passive: true });

      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ==========================================================================
  // 3. POSTHOG ANALYTICS CAPTURE LAYER
  // ==========================================================================
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