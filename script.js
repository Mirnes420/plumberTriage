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
      e.stopPropagation();

      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    // Bind to standard pointer clicks (handles mobile and desktop instantly)
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu view context when an anchor routing link jumps down the page
    navMenu.querySelectorAll('a').forEach(link => {
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

  // ==========================================================================
  // 4. SCROLL FADE-IN & STAGGER ENGINE
  // ==========================================================================
  const fadeElements = document.querySelectorAll('.fade-in-scroll');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ==========================================================================
  // 5. STATS COUNTER ANIMATION ENGINE
  // ==========================================================================
  const counterElements = document.querySelectorAll('[data-counter]');
  
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1500; 
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;
      
      if (decimals > 0) {
        el.textContent = currentValue.toFixed(decimals);
      } else {
        el.textContent = Math.floor(currentValue);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (decimals > 0) {
          el.textContent = target.toFixed(decimals);
        } else {
          el.textContent = target;
        }
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  counterElements.forEach(el => counterObserver.observe(el));

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