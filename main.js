// Remember an explicit language choice so the English page does not send Turkish browsers back to /tr/.
for (const a of document.querySelectorAll('a[hreflang]')) {
  a.addEventListener('click', () => {
    try { localStorage.setItem('lumoza-lang', a.getAttribute('hreflang')); } catch {}
  });
}

// The only script: each game's two screens can be swapped for the next pair.
// Without it the page shows the first two screens and everything else works.
for (const game of document.querySelectorAll('.game[data-screens]')) {
  const screens = JSON.parse(game.dataset.screens);
  const shots = [...game.querySelectorAll('[data-shot]')];
  const button = game.querySelector('[data-next]');
  if (!button || shots.length < 2 || screens.length < 3) continue;
  let index = 0;
  const live = document.createElement('p');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  game.querySelector('.actions').append(live);
  const pair = () => {
    const shown = shots.map((_, i) => ((index + i) % screens.length) + 1);
    const list = shown.slice(0, -1).join(', ') + (document.documentElement.lang === 'tr' ? ' ve ' : ' and ') + shown.at(-1);
    return document.documentElement.lang === 'tr' ? `${list}. ekran, toplam ${screens.length}` : `Screens ${list} of ${screens.length}`;
  };
  // Fetch the other screens only when someone shows interest in the button.
  const warm = () => { for (const s of screens) new Image().src = s.src; };
  button.addEventListener('pointerenter', warm, { once: true });
  button.addEventListener('focus', warm, { once: true });
  button.addEventListener('click', () => {
    index = (index + 1) % screens.length;
    shots.forEach((img, i) => {
      const next = screens[(index + i) % screens.length];
      img.classList.add('is-out');
      setTimeout(() => {
        img.src = next.src;
        img.alt = next.alt;
        img.classList.remove('is-out');
      }, 180);
    });
    live.textContent = pair();
  });
}

// ---------------------------------------------------------------------------
// Motion layer. Every part checks its library and reduced motion first, so the page
// still works, unchanged, when a script fails to load or the visitor prefers less motion.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The one moving picture (Hearthwalker being played) stays on its first frame for visitors who prefer less motion.
if (calm) for (const v of document.querySelectorAll('video[autoplay]')) { v.removeAttribute('autoplay'); v.pause(); }
const finePointer = matchMedia('(pointer: fine)').matches;

// Smooth wheel scrolling on desktop (Lenis). Touch scrolling stays native.
let lenis = null;
if (!calm && finePointer && window.Lenis) {
  lenis = new window.Lenis({ anchors: { offset: 0 }, lerp: 0.12, wheelMultiplier: 0.9 });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

// GSAP: the torn game titles where the browser has no CSS scroll timelines
// (Chrome and Safari 26 do them in CSS; this covers Firefox).
if (!calm && window.gsap && window.ScrollTrigger) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on('scroll', ScrollTrigger.update);
  if (!CSS.supports('animation-timeline', 'view()')) {
    for (const game of document.querySelectorAll('.exhibit')) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: game, start: 'top bottom', end: 'bottom top', scrub: true } });
      tl.fromTo(game.querySelector('.tear-a'), { x: '-4vw' }, { x: 0, ease: 'none', duration: 0.45 }, 0)
        .to(game.querySelector('.tear-a'), { x: '-4vw', ease: 'none', duration: 0.45 }, 0.55)
        .fromTo(game.querySelector('.tear-b'), { x: '4vw' }, { x: 0, ease: 'none', duration: 0.45 }, 0)
        .to(game.querySelector('.tear-b'), { x: '4vw', ease: 'none', duration: 0.45 }, 0.55);
      [...game.querySelectorAll('.media > *')].forEach((el, i) => {
        const fall = -(12 + i * 10) * innerHeight / 100;
        tl.fromTo(el, { y: fall }, { y: 0, ease: 'none', duration: 0.45 }, 0).to(el, { y: fall * -0.35, ease: 'none', duration: 0.45 }, 0.55);
      });
    }
  }
}

// The hanging card is a real pendulum (Matter.js): it swings on its own and can be grabbed and thrown.
const stage = document.querySelector('.hero-stage');
const badge = stage && stage.querySelector('.badge');
if (!calm && window.Matter && stage && badge) {
  const { Engine, Bodies, Body, Composite, Constraint, Vector } = window.Matter;
  const card = badge.querySelector('.card');
  const cordLength = () => badge.querySelector('.cord').offsetHeight + badge.querySelector('.clip').offsetHeight;
  const svgNS = 'http://www.w3.org/2000/svg';
  const line = document.createElementNS(svgNS, 'svg');
  line.setAttribute('class', 'cord-line');
  line.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svgNS, 'line');
  line.append(path);
  let engine, body, grab = null, w, h, anchor, running = false, last = 0;

  const build = () => {
    stage.classList.remove('is-physics');
    const rect = stage.getBoundingClientRect();
    w = card.offsetWidth; h = card.offsetHeight;
    const length = cordLength();
    anchor = { x: rect.width / 2, y: 0 };
    engine = Engine.create({ gravity: { y: 1 } });
    body = Bodies.rectangle(anchor.x, length + h / 2, w, h, { frictionAir: 0.012, density: 0.002, chamfer: { radius: 20 } });
    const rope = Constraint.create({ pointA: anchor, bodyB: body, pointB: { x: 0, y: -h / 2 }, length, stiffness: 0.9, damping: 0.05 });
    Composite.add(engine.world, [body, rope]);
    Body.setVelocity(body, { x: 7, y: 0 });
    card.style.width = w + 'px';
    stage.classList.add('is-physics');
    if (!line.isConnected) stage.append(line);
  };

  const draw = () => {
    const { x, y } = body.position;
    card.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${body.angle}rad)`;
    const top = Vector.add(body.position, Vector.rotate({ x: 0, y: -h / 2 }, body.angle));
    path.setAttribute('x1', anchor.x); path.setAttribute('y1', anchor.y);
    path.setAttribute('x2', top.x); path.setAttribute('y2', top.y);
  };

  const step = (time) => {
    if (!running) return;
    const dt = Math.min(32, time - (last || time)); last = time;
    Engine.update(engine, dt || 16);
    draw();
    requestAnimationFrame(step);
  };

  const local = (e) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  card.addEventListener('pointerdown', (e) => {
    const p = local(e);
    grab = Constraint.create({ pointA: p, bodyB: body, pointB: Vector.rotate(Vector.sub(p, body.position), -body.angle), stiffness: 0.2, damping: 0.1, length: 0 });
    Composite.add(engine.world, grab);
    card.setPointerCapture(e.pointerId);
    card.classList.add('is-grabbed');
  });
  card.addEventListener('pointermove', (e) => { if (grab) grab.pointA = local(e); });
  const release = () => { if (grab) { Composite.remove(engine.world, grab); grab = null; card.classList.remove('is-grabbed'); } };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);

  // Measure only once styles and fonts are in, so the card is sized by the stylesheet, not the bare markup.
  const start = () => {
    build();
    if (w > stage.clientWidth * 0.8) { stage.classList.remove('is-physics'); card.style.width = ''; return setTimeout(start, 300); }
    draw();
    observer.observe(stage);
  };
  const observer = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    if (running) { last = 0; requestAnimationFrame(step); }
  });
  const ready = () => (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true });
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (!body) return; card.style.width = ''; build(); draw(); }, 200); });
}
