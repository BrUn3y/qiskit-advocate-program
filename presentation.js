(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.querySelector('#progress');
  const indexGrid = document.querySelector('#index-grid');
  const indexDialog = document.querySelector('#index-dialog');
  const roadmapDialog = document.querySelector('#roadmap-dialog');
  const viewport = document.querySelector('.deck-viewport');
  let current = 0;

  slides.forEach((slide, i) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `${i + 1}. ${slide.dataset.title}`);
    button.title = slide.dataset.title;
    button.addEventListener('click', () => show(i));
    progress.append(button);
    const item = document.createElement('button');
    item.className = 'index-item';
    const number = document.createElement('span');
    number.textContent = String(i + 1).padStart(2, '0');
    item.append(number, document.createTextNode(slide.dataset.title));
    item.addEventListener('click', () => { indexDialog.close(); show(i); });
    indexGrid.append(item);
  });

  function show(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
      progress.children[i].classList.toggle('current', i === current);
      progress.children[i].classList.toggle('visited', i < current);
      if (i === current) progress.children[i].setAttribute('aria-current', 'step');
      else progress.children[i].removeAttribute('aria-current');
      indexGrid.children[i].setAttribute('aria-current', String(i === current));
    });
    document.querySelector('#previous').disabled = current === 0;
    document.querySelector('#next').disabled = current === slides.length - 1;
    document.querySelector('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    document.querySelector('#section-name').textContent = slides[current].dataset.section;
    document.title = `${slides[current].dataset.title} · Qiskit Advocate`;
    viewport.scrollTop = 0;
    if (updateHash && location.hash !== `#${slides[current].id}`) {
      // Hash links work when the file is opened directly, without a web server.
      try { history.replaceState(null, '', `#${slides[current].id}`); }
      catch { location.hash = slides[current].id; }
    }
    const focused = document.activeElement;
    if (focused && focused.closest('.slide') && focused.closest('.slide') !== slides[current]) focused.blur();
  }

  function fromHash() {
    const target = slides.findIndex(slide => `#${slide.id}` === location.hash);
    show(target < 0 ? 0 : target, false);
  }

  function resize() {
    const frame = document.querySelector('.stage-frame');
    const stage = document.querySelector('.stage');
    if (innerWidth <= 760) {
      frame.style.width = ''; frame.style.height = ''; stage.style.transform = '';
      return;
    }
    const scale = Math.min(viewport.clientWidth / 1440, viewport.clientHeight / 810);
    frame.style.width = `${1440 * scale}px`;
    frame.style.height = `${810 * scale}px`;
    stage.style.transform = `scale(${scale})`;
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else { document.body.classList.toggle('full-mode'); resize(); }
    } catch { document.body.classList.toggle('full-mode'); resize(); }
  }

  document.querySelector('#previous').addEventListener('click', () => show(current - 1));
  document.querySelector('#next').addEventListener('click', () => show(current + 1));
  document.querySelector('#open-index').addEventListener('click', () => indexDialog.showModal());
  document.querySelector('#show-roadmap').addEventListener('click', () => roadmapDialog.showModal());
  document.querySelector('#fullscreen').addEventListener('click', toggleFullscreen);
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => show(slides.findIndex(s => s.id === button.dataset.go))));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (document.querySelector('dialog[open]')) return;
    const isButton = event.target.closest('button,a');
    if (['ArrowRight', 'PageDown'].includes(event.key) || (event.key === ' ' && !isButton)) { event.preventDefault(); show(current + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(0); }
    else if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
    else if (event.key.toLowerCase() === 'o') indexDialog.showModal();
    else if (event.key.toLowerCase() === 'f') toggleFullscreen();
    else if (event.key === 'Escape' && document.body.classList.contains('full-mode')) { document.body.classList.remove('full-mode'); resize(); }
  });
  addEventListener('resize', resize);
  addEventListener('hashchange', fromHash);
  document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('full-mode', Boolean(document.fullscreenElement));
    document.querySelector('#fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Activar pantalla completa');
    resize();
  });

  const weights = {training: 1, seminars: 1, courses: 1, talks: 2, events: 4};
  function quantity(key) {
    const input = document.querySelector(`#qty-${key}`);
    const value = Number(input.value);
    const safe = Number.isFinite(value) ? Math.round(value) : 0;
    return Math.max(Number(input.min), Math.min(Number(input.max), safe));
  }
  function calculate() {
    let total = 0;
    Object.keys(weights).forEach(key => {
      const value = quantity(key);
      document.querySelector(`#qty-${key}`).value = String(value);
      total += value * weights[key];
      const input = document.querySelector(`#qty-${key}`);
      document.querySelector(`[data-step="${key}:-1"]`).disabled = value <= Number(input.min);
      document.querySelector(`[data-step="${key}:1"]`).disabled = value >= Number(input.max);
    });
    document.querySelector('#sim-total').textContent = String(total);
    document.querySelector('#sim-meter-fill').style.width = `${Math.min(100, total / 15 * 100)}%`;
    document.querySelector('.sim-meter').setAttribute('aria-valuenow', String(Math.min(total, 15)));
    document.querySelector('.sim-meter').setAttribute('aria-valuetext', `${total} puntos planificados de un umbral de 15`);
    const missing = [];
    if (total < 15) missing.push(`${15 - total} ${15 - total === 1 ? 'punto' : 'puntos'}`);
    if (!quantity('training')) missing.push('completar el training');
    if (!document.querySelector('#sim-cert').checked) missing.push('la certificación Qiskit v2.x');
    document.querySelector('#sim-status').textContent = missing.length ? `Para completar este plan te falta: ${missing.join('; ')}.` : 'Tu plan cubre puntos, training y certificación para Tier 1. El equipo debe validar tus actividades y confirmar el ascenso.';
  }
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    const [key, delta] = button.dataset.step.split(':');
    document.querySelector(`#qty-${key}`).value = String(quantity(key) + Number(delta));
    calculate();
  }));
  Object.keys(weights).forEach(key => document.querySelector(`#qty-${key}`).addEventListener('change', calculate));
  document.querySelector('#sim-cert').addEventListener('change', calculate);
  document.querySelector('#sim-example').addEventListener('click', () => {
    const example = {training:1, seminars:2, courses:4, talks:2, events:1};
    Object.entries(example).forEach(([key, value]) => { document.querySelector(`#qty-${key}`).value = String(value); });
    calculate();
  });
  document.querySelector('#sim-reset').addEventListener('click', () => {
    Object.keys(weights).forEach(key => { document.querySelector(`#qty-${key}`).value = '0'; });
    document.querySelector('#sim-cert').checked = false;
    calculate();
  });
  calculate(); fromHash(); resize();
})();
