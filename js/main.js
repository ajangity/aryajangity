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


// Subtle hover transition polish for links
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transition = "all 0.3s ease";
  });
});

// Enable flip cards on mobile (tap)
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});
