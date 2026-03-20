/* =========================
   main.js — Arya Jangity
========================= */

/* ── Scroll Progress Bar ─────────────────── */
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ── Navbar Compact on Scroll ────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('compact', window.scrollY > 60);
  }, { passive: true });
}

/* ── Active Nav Link ─────────────────────── */
(function markActiveLink() {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Normalize both to lowercase, strip leading slashes for comparison
    const linkPath = href.replace(/^(\.\.\/)+/, '/').replace(/^\//, '');
    const curPath  = path.replace(/^\//, '');
    if (
      curPath === linkPath ||
      (linkPath.includes('projects') && curPath.includes('projects')) ||
      (linkPath.includes('experience') && curPath.includes('experience')) ||
      (linkPath.includes('education') && curPath.includes('education'))
    ) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll-Triggered Reveal ─────────────── */
const animClasses = ['.fade-in', '.anim-up', '.anim-left', '.anim-right', '.anim-scale'];
const animEls = document.querySelectorAll(animClasses.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => revealObserver.observe(el));

/* ── Staggered Skill Tag Reveal ─────────── */
const tagGroups = document.querySelectorAll('.skill-tags');
tagGroups.forEach(group => {
  const tags = group.querySelectorAll('.tag');
  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('visible'), i * 60);
        });
        groupObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  groupObserver.observe(group);
});

/* ── Typewriter Effect ───────────────────── */
function typewriter(el, phrases, speed = 68, pause = 2000, deleteSpeed = 35) {
  if (!el) return;
  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;

  // Insert cursor span after element
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : speed);
  }
  tick();
}

const subtitleEl = document.getElementById('typewriter-text');
if (subtitleEl) {
  typewriter(subtitleEl, [
    'Robotics Engineering Student',
    'Embedded Systems Developer',
    'Assistive Tech Builder',
    'Co-Founder of BananaBots',
    'Humanoid Robotics Researcher',
  ]);
}

/* ── Animated Counters ───────────────────── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const decimals = (el.dataset.target.includes('.')) ? 1 : 0;
  const duration = 1600;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = eased * target;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-number[data-target]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

/* ── Timeline Line Draw + Dot Ping ──────── */
const timeline = document.querySelector('.timeline');
if (timeline) {
  // Draw the line
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('line-drawn');
        lineObserver.unobserve(timeline);
      }
    });
  }, { threshold: 0.05 });
  lineObserver.observe(timeline);

  // Ping each dot as it enters view
  const timelineItems = document.querySelectorAll('.timeline-item');
  const dotObserver   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        dotObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  timelineItems.forEach(item => dotObserver.observe(item));
}

/* ── 3D Tilt on Project Cards ────────────── */
function initTilt(card) {
  const MAX  = 8;   // max tilt degrees
  const LIFT = 20;  // translateZ on hover

  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotateY =  dx * MAX;
    const rotateX = -dy * MAX;
    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${LIFT}px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
    card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.12s ease';
  });
}

// Apply tilt only on non-touch devices
if (!('ontouchstart' in window)) {
  document.querySelectorAll('.project-card').forEach(initTilt);
}

/* ── Mobile Flip Cards (tap to flip) ────── */
document.querySelectorAll('.flip-card').forEach(card => {
  // Only on touch devices
  if (!('ontouchstart' in window)) return;

  let startX = 0;
  let startY = 0;

  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  // On mobile, card-back is hidden via CSS; instead toggle mobile-card-content
  card.addEventListener('touchend', e => {
    const dx = Math.abs(e.changedTouches[0].clientX - startX);
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (dx < 12 && dy < 12) {
      const mobileContent = card.querySelector('.mobile-card-content');
      if (mobileContent) {
        mobileContent.style.display =
          mobileContent.style.display === 'block' ? 'none' : 'block';
      }
    }
  }, { passive: true });
});

/* ── Page Transition (fade-out on navigate) ─ */
(function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Fade in on load
  overlay.style.opacity = '1';
  overlay.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { overlay.style.opacity = '0'; });
  });

  // Fade out on internal link click
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only handle same-origin, non-hash, non-external links
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || link.target === '_blank') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
})();
