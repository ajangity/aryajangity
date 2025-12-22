// Fade-in animation on scroll
const elements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = "0.1s";
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

elements.forEach(el => observer.observe(el));


// Mobile-friendly flip cards
document.querySelectorAll('.flip-card').forEach(card => {
  let startX = 0;
  let startY = 0;

  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  card.addEventListener('touchend', e => {
    const dx = Math.abs(e.changedTouches[0].clientX - startX);
    const dy = Math.abs(e.changedTouches[0].clientY - startY);

    // Only flip if it was a tap, not a scroll
    if (dx < 10 && dy < 10) {
      card.classList.toggle('is-flipped');
    }
  });
});

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('touchend', () => {
    document.querySelectorAll('.flip-card').forEach(c => {
      if (c !== card) c.classList.remove('is-flipped');
    });
  });
});
