document.addEventListener('DOMContentLoaded', () => {


      const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.classList.remove('active');
      });
    });

    const pingBackends = () => {
    const urls = [
      "https://plumber-emergency.gentlemansolutions.com",
      "https://plumber-backend-fnh6.onrender.com"
    ];

    urls.forEach(url => {
      // Use fetch with 'no-cors' mode so security policies don't block the drop ping
      fetch(url, { 
        method: 'GET', 
        mode: 'no-cors',
        cache: 'no-cache'
      }).catch(err => console.log(`Ping to ${url} sent.`)); 
    });
  };

  pingBackends();
    
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



  const toggleViews = () => {
    const isFounders = window.location.hash === '#founders';
    const landingView = document.getElementById('landing-view');
    const foundersSection = document.getElementById('founders-section');
    
    if (isFounders) {
      if (landingView) landingView.classList.add('hidden');
      if (foundersSection) foundersSection.classList.remove('hidden');
      
      // Hide all standard header navigation links
      document.querySelectorAll('.landing-nav-link').forEach(el => el.classList.add('hidden'));
      
      // Add/Show back link in nav if not exists
      let backLink = document.getElementById('nav-back-home');
      if (!backLink) {
        backLink = document.createElement('a');
        backLink.id = 'nav-back-home';
        backLink.href = '#';
        backLink.className = 'nav-back-home-link';
        backLink.innerHTML = '&larr; Back to Home';
        const nav = document.querySelector('nav');
        if (nav) {
          nav.insertBefore(backLink, nav.firstChild);
        }
      } else {
        backLink.classList.remove('hidden');
      }
      
      window.scrollTo(0, 0);
    } else {
      if (landingView) landingView.classList.remove('hidden');
      if (foundersSection) foundersSection.classList.add('hidden');
      
      // Show standard header navigation links
      document.querySelectorAll('.landing-nav-link').forEach(el => el.classList.remove('hidden'));
      
      const backLink = document.getElementById('nav-back-home');
      if (backLink) {
        backLink.classList.add('hidden');
      }
      
      // Handle scrolling to landing sections when routing back
      if (window.location.hash && window.location.hash !== '#') {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }
    }
  };

  window.addEventListener('hashchange', toggleViews);
  toggleViews();

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

// ==========================================================================
// 6. GENTLE PLUMBING-THEMED BACKGROUND CANVAS SYSTEM
// ==========================================================================
const initBgCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  // Keep particle count low for high performance and professional subtlety
  const particleCount = Math.min(30, Math.floor((width * height) / 50000));

  class Bubble {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute vertically at start
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.radius = Math.random() * 12 + 4; // Subtly sized bubbles
      this.speed = Math.random() * 0.35 + 0.15; // Slow, calm motion
      this.opacity = Math.random() * 0.08 + 0.03; // Extremely faint opacity
      this.wobbleSpeed = Math.random() * 0.015 + 0.005;
      this.wobbleRange = Math.random() * 8 + 2;
      this.wobbleAngle = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speed;
      this.wobbleAngle += this.wobbleSpeed;
      this.xOffset = Math.sin(this.wobbleAngle) * this.wobbleRange;
      if (this.y + this.radius < 0) {
        this.reset();
      }
    }
    draw() {
      const currentX = this.x + (this.xOffset || 0);
      
      // Outer bubble ring
      ctx.beginPath();
      ctx.arc(currentX, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`; // Soft sky/water blue
      ctx.fill();
      
      // Inside highlight spot for liquid feel
      ctx.beginPath();
      ctx.arc(currentX - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.8})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Bubble());
  }

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  
  // Throttle resize event slightly
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  });

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  };
  animate();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBgCanvas);
} else {
  initBgCanvas();
}