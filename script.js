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
