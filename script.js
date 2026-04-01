/* ============================================================
   rauldinho · Portfolio — script.js
   ============================================================ */

'use strict';

/* ---------- Navbar: scroll shadow + active link ---------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const toggle = document.querySelector('.nav-toggle');

  // Scroll shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile menu toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('menu-open');
    });

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => navbar.classList.remove('menu-open'));
    });
  }
})();

/* ---------- Scroll-reveal with IntersectionObserver ---------- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ---------- Dynamic footer year ---------- */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ---------- Contact form: client-side validation + UX ---------- */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    msg: 'Please enter your name.' },
    email:   { el: form.querySelector('#email'),   msg: 'Please enter a valid email address.' },
    message: { el: form.querySelector('#message'), msg: 'Please enter a message.' },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearError(field) {
    field.el.classList.remove('error');
    const existing = field.el.nextSibling;
    if (existing && existing.classList && existing.classList.contains('field-error')) {
      existing.remove();
    }
  }

  function showError(field) {
    field.el.classList.add('error');
    if (!field.el.nextSibling || !field.el.nextSibling.classList?.contains('field-error')) {
      const err = document.createElement('p');
      err.className = 'field-error';
      err.style.cssText = 'color:#ef4444;font-size:0.75rem;margin-top:4px;';
      err.textContent = field.msg;
      field.el.after(err);
    }
  }

  function validate() {
    let valid = true;

    Object.values(fields).forEach((f) => clearError(f));

    if (!fields.name.el.value.trim()) {
      showError(fields.name);
      valid = false;
    }
    if (!emailRegex.test(fields.email.el.value.trim())) {
      showError(fields.email);
      valid = false;
    }
    if (!fields.message.el.value.trim()) {
      showError(fields.message);
      valid = false;
    }

    return valid;
  }

  // Live clear errors on input
  Object.values(fields).forEach((f) => {
    f.el.addEventListener('input', () => clearError(f));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    /* -------------------------------------------------------
     * Formspree integration:
     *   1. Go to https://formspree.io and create a free form.
     *   2. Copy your endpoint (e.g. https://formspree.io/f/abcdefgh).
     *   3. Set: form.setAttribute('action', 'YOUR_ENDPOINT');
     *      OR change the FORMSPREE_ENDPOINT constant below.
     * ------------------------------------------------------ */
    const FORMSPREE_ENDPOINT = form.getAttribute('action') || '';

    if (!FORMSPREE_ENDPOINT) {
      // Dev mode: just simulate success after 1s
      await new Promise((r) => setTimeout(r, 1000));
      showSuccess();
      return;
    }

    try {
      const data = new FormData(form);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        showSuccess();
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      alert('Something went wrong. Please email me directly — the address is listed below.');
    }
  });

  function showSuccess() {
    // Replace form content with a success message
    form.innerHTML = `
      <div class="form-success" style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;text-align:center;">
        <i class="fas fa-circle-check" style="font-size:3rem;color:#22c55e;"></i>
        <strong style="font-size:1.15rem;color:var(--text);">Message sent!</strong>
        <p style="color:var(--text-muted);font-size:0.9rem;">Thanks for reaching out. I'll get back to you as soon as possible.</p>
      </div>
    `;
  }
})();

/* ---------- Smooth scroll for anchor links ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height buffer
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
