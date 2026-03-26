/**
 * animations.js — Harmonia Preview
 *
 * Pure animation helpers — no DOM querying of app state.
 * Depends on: GSAP + ScrollTrigger (loaded before this file)
 *
 * Exports (globals):
 *   initDust()          — canvas particle field
 *   boom()              — confetti burst
 *   flash()             — gold edge flash
 *   initDots()          — build phase-nav dots
 *   initScroll()        — ScrollTrigger entrance + dot tracking
 *   setDot(i)           — activate dot at index i
 *   trigMR()            — match-reveal GSAP timeline
 *   closeMR()           — dismiss match-reveal overlay
 */


/* ── Section manifest (mirrors index.html IDs) ──────────────── */
const SECTS   = ['s0','s1','s2','s3','s4','s5','s6','s7','s9','s10','s11'];
const SLABELS = ['Hero','Sign Up','Photos','Calibrate','Questions','HLA','Complete','Discover','Matches','Profile','Admin'];


/* ── Smooth scroll helper ───────────────────────────────────── */
function scrollToSection(i) {
  const el = document.getElementById(`s${i}`);
  if (!el) {
    console.warn(`Section s${i} not found`);
    return;
  }
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


/* ── Phase nav dots ─────────────────────────────────────────── */
function initDots() {
  const container = document.getElementById('pdots');
  SECTS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'pdot';
    dot.dataset.label = SLABELS[i];
    dot.onclick = () => scrollToSection(i);
    container.appendChild(dot);
  });
}

function setDot(i) {
  document.querySelectorAll('.pdot').forEach((d, j) => d.classList.toggle('on', j === i));
}


/* ── ScrollTrigger — entrance animations + dot tracking ─────── */
function initScroll() {
  gsap.registerPlugin(ScrollTrigger);

  SECTS.forEach((id, i) => {
    const el = document.getElementById(id);

    // Staggered section entrance
    gsap.from(el.querySelector('.S-in'), {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 40, opacity: 0, duration: .8, ease: 'expo.out',
    });

    // Dot activation
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end:   'bottom center',
      onEnter:     () => setDot(i),
      onEnterBack: () => setDot(i),
    });
  });
}


/* ── Ambient dust particle canvas ───────────────────────────── */
function initDust() {
  const canvas = document.getElementById('dust');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  // Build particle pool
  const N    = 500;
  const orbs = [];
  for (let i = 0; i < N; i++) {
    orbs.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .12,
      vy: (Math.random() - .5) * .10,
      r:  Math.random() * 1 + .3,
      ph: Math.random() * 6.28,
      sp: Math.random() * .008 + .003,
      g:  Math.random() < .35,   // gold vs maroon
      ba: Math.random() * .25 + .12,
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const dark = document.documentElement.dataset.theme !== 'light';
    const t    = Date.now() * .001;

    for (const o of orbs) {
      // Drift + sine wobble
      o.x += o.vx + Math.sin(t * .5 + o.ph) * .07;
      o.y += o.vy + Math.cos(t * .3 + o.ph) * .05;
      if (o.x < -5)  o.x = W + 5;
      if (o.x > W+5) o.x = -5;
      if (o.y < -5)  o.y = H + 5;
      if (o.y > H+5) o.y = -5;

      const alpha = Math.max(.04, Math.min(o.ba + Math.sin(t * o.sp * 100 + o.ph) * .1, .5)) * (dark ? 1 : .55);

      // Glow halo
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 3);
      if (o.g) {
        grad.addColorStop(0,  `rgba(240,200,110,${alpha})`);
        grad.addColorStop(.4, `rgba(240,200,110,${alpha * .4})`);
        grad.addColorStop(1,  'rgba(240,200,110,0)');
      } else {
        grad.addColorStop(0,  `rgba(139,58,58,${alpha * .7})`);
        grad.addColorStop(.4, `rgba(114,47,55,${alpha * .3})`);
        grad.addColorStop(1,  'rgba(114,47,55,0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * 3, 0, 6.28);
      ctx.fill();

      // Core dot
      ctx.fillStyle = o.g
        ? `rgba(255,220,140,${alpha * 1.1})`
        : `rgba(160,80,80,${alpha * .8})`;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * .4, 0, 6.28);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }());
}


/* ── Edge flash on interaction ──────────────────────────────── */
function flash() {
  document.body.style.boxShadow = 'inset 0 0 50px var(--goldg)';
  setTimeout(() => { document.body.style.boxShadow = ''; }, 120);
}


/* ── Confetti burst ─────────────────────────────────────────── */
function boom() {
  const canvas = document.getElementById('confetti');
  const ctx    = canvas.getContext('2d');
  canvas.width  = innerWidth;
  canvas.height = innerHeight;

  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x:    canvas.width / 2,
      y:    canvas.height * .3,
      vx:   (Math.random() - .5) * 12,
      vy:   -(Math.random() * 10 + 4),
      sz:   Math.random() * 5 + 3,
      c:    i < 40 ? '#F0C86E' : '#722F37',
      rot:  Math.random() * 360,
      rs:   (Math.random() - .5) * 15,
      life: 1,
      sh:   Math.random() > .5,  // square vs circle
    });
  }

  let frame = 0;
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = 1;
      p.vy  += .15;
      p.vx  *= .99;
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rs;
      if (frame > 40) p.life -= .015;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.c;
      if (p.sh) {
        ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz * .6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.sz / 2, 0, 6.28);
        ctx.fill();
      }
      ctx.restore();
    }

    frame++;
    alive ? requestAnimationFrame(animate) : ctx.clearRect(0, 0, canvas.width, canvas.height);
  }());
}


/* ── Match reveal GSAP timeline ─────────────────────────────── */
function trigMR() {
  const overlay = document.getElementById('mrovl');
  overlay.classList.add('on');
  boom();

  gsap.timeline()
    .to(overlay, { background: 'rgba(10,5,6,.92)', duration: .3 })
    .from('#mravl', { x: -250, scale: .5, opacity: 0, duration: .6, ease: 'back.out(1.7)' }, .3)
    .from('#mravr', { x:  250, scale: .5, opacity: 0, duration: .6, ease: 'back.out(1.7)' }, .3)
    .from('#mrtitle', { scale: .8, opacity: 0, duration: .5, ease: 'back.out(2)' }, 1)

    // Score count-up
    .call(() => {
      const el = document.getElementById('mrscore');
      gsap.to({ v: 0 }, {
        v: 82, duration: 1, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); },
      });
    }, null, 1.3)

    // Ring reveals
    .to('#rv', { attr: { 'stroke-dashoffset': 515 * (1 - .85) }, duration: 1, ease: 'power2.out' }, 2.3)
    .to('#rp', { attr: { 'stroke-dashoffset': 402 * (1 - .78) }, duration: 1, ease: 'power2.out' }, 2.5)
    .to('#rb', { attr: { 'stroke-dashoffset': 289 * (1 - .84) }, duration: 1, ease: 'power2.out' }, 2.7)

    // Labels & traits
    .from('.rlbl',        { opacity: 0, y:  8,  stagger: .10, duration: .3 }, 3.2)
    .from('.shtrait .bdg',{ opacity: 0, x: -12, stagger: .08, duration: .3 }, 3.6)
    .from('.stcard',      { opacity: 0, y:  10, stagger: .10, duration: .3 }, 4.0)
    .from('.mrbtns',      { opacity: 0, y:  16,               duration: .35 }, 4.5);
}


/* ── Dismiss match reveal ────────────────────────────────────── */
function closeMR() {
  gsap.to('#mrovl', {
    opacity: 0, duration: .3,
    onComplete() {
      const o = document.getElementById('mrovl');
      o.classList.remove('on');
      o.style.opacity    = '';
      o.style.background = '';
      gsap.set('#rv', { attr: { 'stroke-dashoffset': 515 } });
      gsap.set('#rp', { attr: { 'stroke-dashoffset': 402 } });
      gsap.set('#rb', { attr: { 'stroke-dashoffset': 289 } });
      document.getElementById('mrscore').textContent = '0';
    },
  });
}
