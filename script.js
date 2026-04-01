/* ============================================================
   rauldinho · Portfolio — script.js
   ============================================================ */

'use strict';

/* ---------- Tab switching ---------- */
(function initTabs() {
  const pills = document.querySelectorAll('.tabpill[data-tab]');
  const views = document.querySelectorAll('.tab-view');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const target = pill.dataset.tab;

      // Update pills
      pills.forEach((p) => p.classList.toggle('active', p === pill));

      // Swap views with re-trigger animation
      views.forEach((view) => {
        const isTarget = view.id === `tab-${target}`;
        view.classList.remove('active');
        if (isTarget) {
          // Force reflow so animation re-triggers
          void view.offsetWidth;
          view.classList.add('active');
        }
      });
    });
  });
})();

/* ---------- Footer year ---------- */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ---------- Contact form ---------- */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    msg: 'Name is required.' },
    email:   { el: form.querySelector('#email'),   msg: 'A valid email is required.' },
    message: { el: form.querySelector('#message'), msg: 'Message cannot be empty.' },
  };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearErr(f) {
    f.el.classList.remove('error');
    const tip = f.el.nextSibling;
    if (tip?.classList?.contains('field-tip')) tip.remove();
  }

  function showErr(f) {
    f.el.classList.add('error');
    if (!f.el.nextSibling?.classList?.contains('field-tip')) {
      const t = document.createElement('p');
      t.className = 'field-tip';
      t.style.cssText = 'color:#ff5555;font-size:0.68rem;margin-top:3px;font-family:var(--font-mono);';
      t.textContent = f.msg;
      f.el.after(t);
    }
  }

  function validate() {
    let ok = true;
    Object.values(fields).forEach((f) => clearErr(f));
    if (!fields.name.el.value.trim())             { showErr(fields.name);    ok = false; }
    if (!emailRe.test(fields.email.el.value))     { showErr(fields.email);   ok = false; }
    if (!fields.message.el.value.trim())          { showErr(fields.message); ok = false; }
    return ok;
  }

  Object.values(fields).forEach((f) => f.el.addEventListener('input', () => clearErr(f)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn = form.querySelector('.btn-send');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING…';

    const ENDPOINT = form.getAttribute('action') || '';

    if (!ENDPOINT) {
      // Dev mode: simulate success
      await new Promise((r) => setTimeout(r, 900));
      showSuccess();
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        showSuccess();
      } else {
        throw new Error();
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = orig;
      alert('Something went wrong. Please reach out directly via the links on the left.');
    }
  });

  function showSuccess() {
    form.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:36px 20px;text-align:center;">
        <i class="fas fa-circle-check" style="font-size:2.5rem;color:var(--c-cyan);"></i>
        <strong style="font-family:var(--font-display);font-size:1.1rem;letter-spacing:0.1em;color:var(--text);">MESSAGE SENT</strong>
        <p style="color:var(--text-muted);font-size:0.82rem;">Thanks for reaching out — I'll get back to you soon.</p>
      </div>
    `;
  }
})();
