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


// ==========================================================================
// 1. TACTICAL TYPEWRITER ENGINE (Simulates Human Live Input Parsing)
// ==========================================================================
const typewriterElement = document.querySelector('.hero-center h1');

if (typewriterElement) {
  // Store original markup structured form
  const originalHTML = typewriterElement.innerHTML;
  typewriterElement.innerHTML = ''; // Clear canvas to prepare input loop

  // Create professional blinking terminal cursor tracker element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  typewriterElement.parentNode.insertBefore(cursor, typewriterElement.nextSibling);

  let index = 0;
  let currentHTML = '';
  let isInsideTag = false;

  const typeEngine = () => {
    if (index < originalHTML.length) {
      const char = originalHTML[index];

      // Ensure engine bypasses HTML tag syntax vectors instantly (<br>, <span> tags)
      if (char === '<') isInsideTag = true;
      if (char === '>') {
        isInsideTag = false;
        currentHTML += originalHTML[index];
        index++;
        typewriterElement.innerHTML = currentHTML;
        setTimeout(typeEngine, 20); // Fast snap catch up for tag closures
        return;
      }

      currentHTML += char;
      if (!isInsideTag) {
        typewriterElement.innerHTML = currentHTML;
        // Human-like speed variance: random delays simulate natural keystrokes
        const keystrokeDelay = Math.random() * (60 - 25) + 25;
        index++;
        setTimeout(typeEngine, keystrokeDelay);
      } else {
        index++;
        typeEngine();
      }
    } else {
      // Text is fully typed out: smoothly fade away the operational cursor line
      setTimeout(() => {
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 400);
      }, 1500);
    }
  };

  // Initialize layout typing loop using a 400ms buffer after load finishes
  setTimeout(typeEngine, 400);
}