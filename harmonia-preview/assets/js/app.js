/**
 * app.js — Harmonia Preview
 *
 * Feature modules (in order):
 *   1. Theme toggle
 *   2. Toast notifications
 *   3. Bottom-sheet modal
 *   4. Face generator (Face Set v9 — replaces genAv)
 *   5. Sign-up form validation
 *   6. Photo grid
 *   7. Visual calibration (MetaFBP face rater)
 *   8. Psychometric questionnaire (PIIP)
 *   9. HLA upload simulation
 *  10. Swipe deck
 *  11. Match list & chat
 *  12. Profile view + radar chart
 *  13. Admin dashboard
 *  14. DOMContentLoaded bootstrap
 *
 * Depends on: data.js  animations.js  GSAP + ScrollTrigger
 */


/* ─────────────────────────────────────────────────────────────
   1. THEME TOGGLE
   ───────────────────────────────────────────────────────────── */
function togTheme() {
  const html    = document.documentElement;
  const newMode = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = newMode;
  document.getElementById('thbtn').innerHTML =
    `<svg><use href="#i-${newMode === 'dark' ? 'moon' : 'sun'}"/></svg>`;
  toast(newMode.charAt(0).toUpperCase() + newMode.slice(1) + ' mode', 'tg');
}


/* ─────────────────────────────────────────────────────────────
   2. TOAST NOTIFICATIONS
   ───────────────────────────────────────────────────────────── */
function toast(message, variant = 'tg') {
  const container = document.getElementById('toasts');
  const el        = document.createElement('div');
  el.className    = `toast ${variant}`;
  el.textContent  = message;
  container.appendChild(el);

  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 3000);

  // Keep max 3 toasts visible
  while (container.children.length > 3) container.firstChild.remove();
}


/* ─────────────────────────────────────────────────────────────
   3. BOTTOM-SHEET MODAL
   ───────────────────────────────────────────────────────────── */
function openSheet(html) {
  document.getElementById('mcontent').innerHTML = html;
  document.getElementById('mbg').classList.add('open');
  document.getElementById('msheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('mbg').classList.remove('open');
  document.getElementById('msheet').classList.remove('open');
}


/* ─────────────────────────────────────────────────────────────
   4. FACE GENERATOR — Face Set v9
   Replaces the old genAv() / mub() functions.
   genFaceV9(seed, size, mode) picks a face from the RAW pool
   deterministically by seed, renders it at the given pixel size.
   ───────────────────────────────────────────────────────────── */

// ── Path builder ──────────────────────────────────────────────
function makeFacePath(g) {
  const cx = 50;
  const { topY, crownW, widestY, widestW, jawY, jawW, chinY, chinW } = g;

  const crownSideY = topY + (widestY - topY) * 0.42;
  const mx = x => 100 - x;

  const R = {
    crownSide: [cx + crownW,  crownSideY],
    widest:    [cx + widestW, widestY],
    jaw:       [cx + jawW,    jawY],
    chin:      [cx + chinW,   chinY],
  };

  const dome_r_cp1 = [cx + crownW,        topY + (crownSideY - topY) * 0.05];
  const dome_r_cp2 = [cx + crownW * 0.30, topY];
  const dome_l_cp1 = [cx - crownW * 0.30, topY];
  const dome_l_cp2 = [cx - crownW,        topY + (crownSideY - topY) * 0.05];

  const cp_cw1 = [cx + crownW,         crownSideY + (widestY - crownSideY) * 0.50];
  const cp_cw2 = [cx + widestW,        widestY    - (widestY - crownSideY) * 0.20];
  const cp_wj1 = [cx + widestW * 0.95, widestY + (jawY - widestY) * 0.45];
  const cp_wj2 = [cx + jawW   * 1.08,  jawY    - (jawY - widestY) * 0.12];
  const cp_jc1 = [cx + jawW   * 0.88,  jawY  + (chinY - jawY) * 0.45];
  const cp_jc2 = [cx + chinW  * 1.10,  chinY - (chinY - jawY) * 0.10];
  const chinMidY = chinY + (chinW > 5 ? 2.0 : 1.2);
  const apex = [cx, topY];

  return [
    `M ${R.crownSide[0]} ${R.crownSide[1]}`,
    `C ${dome_r_cp1[0]} ${dome_r_cp1[1]}, ${dome_r_cp2[0]} ${dome_r_cp2[1]}, ${apex[0]} ${apex[1]}`,
    `C ${dome_l_cp1[0]} ${dome_l_cp1[1]}, ${dome_l_cp2[0]} ${dome_l_cp2[1]}, ${mx(R.crownSide[0])} ${R.crownSide[1]}`,
    `C ${mx(cp_cw1[0])} ${cp_cw1[1]}, ${mx(cp_cw2[0])} ${cp_cw2[1]}, ${mx(R.widest[0])} ${R.widest[1]}`,
    `C ${mx(cp_wj1[0])} ${cp_wj1[1]}, ${mx(cp_wj2[0])} ${cp_wj2[1]}, ${mx(R.jaw[0])} ${R.jaw[1]}`,
    `C ${mx(cp_jc1[0])} ${cp_jc1[1]}, ${mx(cp_jc2[0])} ${cp_jc2[1]}, ${mx(R.chin[0])} ${R.chin[1]}`,
    `Q ${cx} ${chinMidY} ${R.chin[0]} ${R.chin[1]}`,
    `C ${cp_jc2[0]} ${cp_jc2[1]}, ${cp_jc1[0]} ${cp_jc1[1]}, ${R.jaw[0]} ${R.jaw[1]}`,
    `C ${cp_wj2[0]} ${cp_wj2[1]}, ${cp_wj1[0]} ${cp_wj1[1]}, ${R.widest[0]} ${R.widest[1]}`,
    `C ${cp_cw2[0]} ${cp_cw2[1]}, ${cp_cw1[0]} ${cp_cw1[1]}, ${R.crownSide[0]} ${R.crownSide[1]}`,
    `Z`
  ].join(' ');
}

// ── Feature derivation ────────────────────────────────────────
function deriveFeatures(g) {
  const faceH  = g.chinY - g.topY;
  const faceW  = g.widestW * 2;

  const eyeY   = g.topY + faceH * 0.47;
  const ipd    = Math.max(faceW / 2.1, 15.5);
  const eyeLX  = 50 - ipd / 2;
  const eyeRX  = 50 + ipd / 2;
  const eyeW   = Math.max(faceW / 5.6, 4.8);
  const eyeH   = eyeW * 0.38;
  const irisR  = eyeW * 0.28;

  const browY  = eyeY - faceH * 0.068;
  const browW  = eyeW * 1.05;

  const noseTY = g.topY + faceH * 0.63;
  const noseBY = browY + faceH * 0.04;
  const noseW  = Math.max(eyeW * 0.40, 1.8);

  const mouthY = g.topY + faceH * 0.77;
  const mouthW = Math.max(ipd * 0.78 / 2, 6.0);

  return {
    eyes:  { y: eyeY,  lx: eyeLX, rx: eyeRX, w: eyeW,  h: eyeH,  ir: irisR },
    brows: { y: browY, lx: eyeLX, rx: eyeRX, w: browW, a: 1.3,   th: 1.0   },
    nose:  { by: noseBY, ty: noseTY, w: noseW                               },
    lips:  { y: mouthY, w: mouthW, h: eyeW * 0.44, c: eyeW * 0.17          },
  };
}

// ── Ears + neck ───────────────────────────────────────────────
function deriveEarsNeck(g) {
  const earY = (g.widestY + g.jawY) / 2;
  const earH = (g.chinY - g.topY) * 0.13;
  return {
    ears: { y: earY, h: earH, lx: 50 - g.widestW, rx: 50 + g.widestW },
    neck: { w: g.jawW * 0.44, t: g.chinY + 1, b: g.chinY + (g.chinY - g.topY) * 0.22 },
  };
}

// ── Interior SVG elements ──────────────────────────────────────
function faceInterior(f) {
  const sk = f.stroke;
  const { eyes: e, brows: b, nose: n, lips: l } = f.feat;
  const er = f.ears, nk = f.neck;

  function eyePath(ox, cy, w, h) {
    return [
      `M ${ox - w} ${cy}`,
      `C ${ox - w*0.5} ${cy - h*1.1}, ${ox + w*0.5} ${cy - h*1.1}, ${ox + w} ${cy}`,
      `C ${ox + w*0.5} ${cy + h*0.65}, ${ox - w*0.5} ${cy + h*0.65}, ${ox - w} ${cy}`,
      `Z`
    ].join(' ');
  }

  function browPath(ox, cy, w, arch, side) {
    const medX  = side === 'L' ? ox + w*0.85  : ox - w*0.85;
    const latX  = side === 'L' ? ox - w*0.85  : ox + w*0.85;
    const peakX = side === 'L' ? ox - w*0.1   : ox + w*0.1;
    const medY  = cy + arch*0.35;
    const latY  = cy + arch*0.20;
    const peakY = cy - arch;
    return `M ${medX} ${medY} C ${medX+(peakX-medX)*0.5} ${peakY+arch*0.3}, ${peakX} ${peakY}, ${latX} ${latY}`;
  }

  const bridge = `M 50 ${n.by} C ${50+n.w*0.25} ${n.by+(n.ty-n.by)*0.55}, ${50+n.w*0.4} ${n.ty-(n.ty-n.by)*0.1}, 50 ${n.ty}`;
  const nDot   = n.w * 1.55;
  const nDotY  = n.ty + 1.0;

  const { y:lY, w:lW, h:lH, c:cup } = l;
  const midY  = lY + cup*0.45;
  const botY  = lY + lH + cup*0.9;
  const upper = `M ${50-lW} ${midY} C ${50-lW*0.55} ${lY-cup*0.15}, ${50-lW*0.18} ${lY}, 50 ${lY+cup*0.95} C ${50+lW*0.18} ${lY}, ${50+lW*0.55} ${lY-cup*0.15}, ${50+lW} ${midY}`;
  const lower = `M ${50-lW} ${midY} Q 50 ${botY} ${50+lW} ${midY}`;
  const mline = `M ${50-lW*0.82} ${midY+0.4} Q 50 ${midY+0.85} ${50+lW*0.82} ${midY+0.4}`;

  function earPath(ex, ey, eh, side) {
    const outX = side === 'L' ? ex - eh*0.62 : ex + eh*0.62;
    return `M ${ex} ${ey-eh*0.48} C ${outX} ${ey-eh*0.24}, ${outX} ${ey+eh*0.24}, ${ex} ${ey+eh*0.48}`;
  }

  const nkMid  = (nk.t + nk.b) / 2;
  const nkPath = [
    `M ${50-nk.w} ${nk.t} C ${50-nk.w*1.04} ${nkMid}, ${50-nk.w*1.10} ${nk.b}, ${50-nk.w*1.52} ${nk.b}`,
    `M ${50+nk.w} ${nk.t} C ${50+nk.w*1.04} ${nkMid}, ${50+nk.w*1.10} ${nk.b}, ${50+nk.w*1.52} ${nk.b}`,
  ].join(' ');

  return `
    <path d="${nkPath}" fill="none" stroke="${sk}" stroke-width=".55" stroke-linecap="round" opacity=".45"/>
    <path d="${earPath(er.lx,er.y,er.h,'L')}" fill="none" stroke="${sk}" stroke-width=".6" stroke-linecap="round" opacity=".55"/>
    <path d="${earPath(er.rx,er.y,er.h,'R')}" fill="none" stroke="${sk}" stroke-width=".6" stroke-linecap="round" opacity=".55"/>
    <path d="${f.path}" fill="none" stroke="${sk}" stroke-width="1.05" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${browPath(b.lx,b.y,b.w,b.a,'L')}" fill="none" stroke="${sk}" stroke-width="${(0.58*b.th).toFixed(2)}" stroke-linecap="round" opacity=".86"/>
    <path d="${browPath(b.rx,b.y,b.w,b.a,'R')}" fill="none" stroke="${sk}" stroke-width="${(0.58*b.th).toFixed(2)}" stroke-linecap="round" opacity=".86"/>
    <path d="${eyePath(e.lx,e.y,e.w,e.h)}" fill="none" stroke="${sk}" stroke-width=".65" stroke-linejoin="round"/>
    <path d="${eyePath(e.rx,e.y,e.w,e.h)}" fill="none" stroke="${sk}" stroke-width=".65" stroke-linejoin="round"/>
    <circle cx="${e.lx}" cy="${e.y-e.h*0.12}" r="${e.ir}" fill="${sk}" opacity=".45"/>
    <circle cx="${e.rx}" cy="${e.y-e.h*0.12}" r="${e.ir}" fill="${sk}" opacity=".45"/>
    <path d="${bridge}" fill="none" stroke="${sk}" stroke-width=".45" stroke-linecap="round" opacity=".46"/>
    <circle cx="${50-nDot}" cy="${nDotY}" r=".72" fill="${sk}" opacity=".40"/>
    <circle cx="${50+nDot}" cy="${nDotY}" r=".72" fill="${sk}" opacity=".40"/>
    <path d="${upper}" fill="none" stroke="${sk}" stroke-width=".62" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${lower}" fill="none" stroke="${sk}" stroke-width=".62" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${mline}" fill="none" stroke="${sk}" stroke-width=".36" stroke-linecap="round" opacity=".54"/>`;
}

// ── Face pool (v9 geometry + site-matched colors) ─────────────
// Backgrounds stay within the site's deep red-black to maroon range.
// Strokes cycle through warm gold, rose-gold, dusty amber and muted crimson
// — all tones that exist in the --gold / --mar / --t2 CSS variables.
const FACE_POOL = [
  { id:1,  bg:['#0f0507','#1e0c10'], stroke:'hsl(32,52%,66%)',
    geo:{ topY:15, crownW:17, widestY:51, widestW:20, jawY:65, jawW:15, chinY:78, chinW:6 } },
  { id:2,  bg:['#150a09','#261210'], stroke:'hsl(18,50%,63%)',
    geo:{ topY:15, crownW:18, widestY:49, widestW:21, jawY:63, jawW:19, chinY:76, chinW:8 } },
  { id:3,  bg:['#0d0608','#1c0d0f'], stroke:'hsl(40,55%,68%)',
    geo:{ topY:13, crownW:16, widestY:52, widestW:18, jawY:67, jawW:13, chinY:83, chinW:5 } },
  { id:4,  bg:['#100608','#200d10'], stroke:'hsl(28,48%,64%)',
    geo:{ topY:17, crownW:18, widestY:47, widestW:22, jawY:60, jawW:18, chinY:73, chinW:7 } },
  { id:5,  bg:['#190b0d','#2d1518'], stroke:'hsl(350,44%,65%)',
    geo:{ topY:14, crownW:16, widestY:51, widestW:20, jawY:65, jawW:13, chinY:80, chinW:5 } },
  { id:6,  bg:['#0c0507','#1a0b0e'], stroke:'hsl(36,54%,67%)',
    geo:{ topY:15, crownW:19, widestY:47, widestW:22, jawY:61, jawW:19, chinY:74, chinW:8 } },
  { id:7,  bg:['#160a0b','#280f11'], stroke:'hsl(22,52%,62%)',
    geo:{ topY:15, crownW:16, widestY:50, widestW:19, jawY:64, jawW:12, chinY:78, chinW:5 } },
  { id:8,  bg:['#110708','#200e10'], stroke:'hsl(44,58%,70%)',
    geo:{ topY:13, crownW:19, widestY:47, widestW:20, jawY:61, jawW:14, chinY:75, chinW:5 } },
  { id:9,  bg:['#0e0608','#1c0c0f'], stroke:'hsl(14,48%,62%)',
    geo:{ topY:13, crownW:16, widestY:52, widestW:18, jawY:68, jawW:13, chinY:85, chinW:5 } },
  { id:10, bg:['#1a0c0d','#2e1618'], stroke:'hsl(38,50%,66%)',
    geo:{ topY:14, crownW:17, widestY:49, widestW:20, jawY:63, jawW:17, chinY:76, chinW:6 } },
  { id:11, bg:['#130809','#221011'], stroke:'hsl(355,42%,63%)',
    geo:{ topY:18, crownW:16, widestY:46, widestW:19, jawY:58, jawW:14, chinY:71, chinW:5 } },
  { id:12, bg:['#0b0507','#180b0d'], stroke:'hsl(30,56%,65%)',
    geo:{ topY:14, crownW:19, widestY:47, widestW:22, jawY:61, jawW:19, chinY:74, chinW:8 } },
  { id:13, bg:['#170a0c','#2a1114'], stroke:'hsl(48,55%,68%)',
    geo:{ topY:15, crownW:16, widestY:54, widestW:20, jawY:66, jawW:18, chinY:79, chinW:7 } },
  { id:14, bg:['#100608','#1e0d0f'], stroke:'hsl(20,50%,64%)',
    geo:{ topY:13, crownW:19, widestY:44, widestW:20, jawY:59, jawW:13, chinY:73, chinW:5 } },
  { id:15, bg:['#1c0e10','#301618'], stroke:'hsl(36,58%,70%)',
    geo:{ topY:15, crownW:17, widestY:50, widestW:20, jawY:64, jawW:15, chinY:82, chinW:6 } },
  { id:16, bg:['#0d0608','#1b0c0f'], stroke:'hsl(343,44%,64%)',
    geo:{ topY:14, crownW:15, widestY:50, widestW:18, jawY:64, jawW:12, chinY:79, chinW:5 } },
  { id:17, bg:['#120709','#200d10'], stroke:'hsl(42,52%,67%)',
    geo:{ topY:17, crownW:19, widestY:45, widestW:23, jawY:58, jawW:20, chinY:71, chinW:8 } },
  { id:18, bg:['#160b0c','#261214'], stroke:'hsl(26,48%,63%)',
    geo:{ topY:16, crownW:16, widestY:49, widestW:19, jawY:63, jawW:13, chinY:77, chinW:5 } },
  { id:19, bg:['#0f0607','#1d0c0e'], stroke:'hsl(50,56%,68%)',
    geo:{ topY:13, crownW:16, widestY:50, widestW:19, jawY:65, jawW:14, chinY:81, chinW:5 } },
  { id:20, bg:['#1a0c0e','#2d1417'], stroke:'hsl(32,54%,66%)',
    geo:{ topY:15, crownW:18, widestY:50, widestW:21, jawY:64, jawW:17, chinY:78, chinW:7 } },
];

// Pre-build all faces once
FACE_POOL.forEach(f => {
  f.path = makeFacePath(f.geo);
  f.feat = deriveFeatures(f.geo);
  const en = deriveEarsNeck(f.geo);
  f.ears = en.ears;
  f.neck = en.neck;
});

/**
 * genFaceV9(seed, size, mode)
 * mode='card'   (default) full 100×120 viewBox, rounded-rect clip, explicit px size
 * mode='circle' square-cropped viewBox (0 8 100 100) for circular av containers — fills 100%
 * mode='slot'   full 100×120 viewBox, no clip, fills container via width/height 100%
 */
function genFaceV9(seed, size, mode) {
  const sz  = size || 80;
  const f   = FACE_POOL[Math.abs(seed) % FACE_POOL.length];
  const uid = `f${seed}_${sz}_${mode||'c'}`;

  if (mode === 'circle') {
    // Square crop centred on the face (y=8..108 of the 120-tall viewBox)
    return `<svg width="100%" height="100%" viewBox="0 8 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <defs>
    <radialGradient id="bg${uid}" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${f.bg[0]}"/>
      <stop offset="100%" stop-color="${f.bg[1]}"/>
    </radialGradient>
  </defs>
  <rect x="0" y="8" width="100" height="100" fill="url(#bg${uid})"/>
  ${faceInterior({ ...f, stroke: f.stroke })}
</svg>`;
  }

  if (mode === 'slot' || mode === 'fill') {
    // Full-bleed into container — preserveAspectRatio slice covers all edges
    return `<svg width="100%" height="100%" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="display:block;position:absolute;inset:0">
  <defs>
    <radialGradient id="bg${uid}" cx="50%" cy="28%" r="62%">
      <stop offset="0%" stop-color="${f.bg[0]}"/>
      <stop offset="100%" stop-color="${f.bg[1]}"/>
    </radialGradient>
  </defs>
  <rect width="100" height="120" fill="url(#bg${uid})"/>
  ${faceInterior({ ...f, stroke: f.stroke })}
</svg>`;
  }

  // Default 'card' mode — explicit px size with rounded-rect clip
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <defs>
    <radialGradient id="bg${uid}" cx="50%" cy="28%" r="62%">
      <stop offset="0%" stop-color="${f.bg[0]}"/>
      <stop offset="100%" stop-color="${f.bg[1]}"/>
    </radialGradient>
    <clipPath id="cl${uid}"><rect width="100" height="120" rx="13"/></clipPath>
  </defs>
  <g clip-path="url(#cl${uid})">
    <rect width="100" height="120" fill="url(#bg${uid})"/>
    ${faceInterior({ ...f, stroke: f.stroke })}
  </g>
</svg>`;
}


/* ─────────────────────────────────────────────────────────────
   5. SIGN-UP FORM
   ───────────────────────────────────────────────────────────── */
function doSignup() {
  const name    = document.getElementById('fn').value.trim();
  const age     = +document.getElementById('fa').value;
  const email   = document.getElementById('fe').value.trim();
  const consent = document.getElementById('fc').checked;
  let valid = true;

  // Name
  if (name.length < 2) {
    document.getElementById('efn').style.display = 'block'; valid = false;
  } else {
    document.getElementById('efn').style.display = 'none';
  }

  // Age
  if (isNaN(age) || age < 18 || age > 99) {
    document.getElementById('efa').style.display = 'block'; valid = false;
  } else {
    document.getElementById('efa').style.display = 'none';
  }

  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('efe').style.display = 'block'; valid = false;
  } else {
    document.getElementById('efe').style.display = 'none';
  }

  if (valid && consent) {
    U.fn  = name;
    U.age = age;
    toast('Profile created!', 'tg');
    flash();
    scrollToSection(2);
  } else if (!consent) {
    toast('Accept consent', 'tm');
  }
}


/* ─────────────────────────────────────────────────────────────
   6. PHOTO GRID
   ───────────────────────────────────────────────────────────── */
let photoN = 0;

function initPhotos() {
  const grid = document.getElementById('pgrid');
  grid.innerHTML = '';
  photoN = 0;

  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = `pslot${i === 0 ? ' main' : ''}`;
    slot.innerHTML = `
      <span class="plus"><svg><use href="#i-${i === 0 ? 'cam' : 'plus'}"/></svg></span>
      ${i === 0 ? '<span class="slbl">Main</span>' : ''}
      <button class="dbtn" onclick="event.stopPropagation();rmPh(this.parentElement)">×</button>`;
    slot.onclick = () => fillPh(slot, i);
    grid.appendChild(slot);
  }
  updPh();
}

function fillPh(slot, i) {
  if (slot.classList.contains('on')) return;
  slot.classList.add('on');
  slot.querySelector('.plus').style.display = 'none';
  const lbl = slot.querySelector('.slbl');
  if (lbl) lbl.style.display = 'none';
  const avatar = document.createElement('div');
  avatar.className = 'sav';
  avatar.innerHTML = genFaceV9(60 + i * 7, 0, 'fill');
  slot.appendChild(avatar);
  gsap.from(slot, { scale: .8, opacity: 0, duration: .4, ease: 'back.out(1.7)' });
  photoN++;
  updPh();
  flash();
}

function rmPh(slot) {
  slot.classList.remove('on');
  slot.style.background = '';
  const av = slot.querySelector('.sav');
  if (av) av.remove();
  slot.querySelector('.plus').style.display = '';
  const lbl = slot.querySelector('.slbl');
  if (lbl) lbl.style.display = '';
  photoN--;
  updPh();
}

function updPh() {
  document.getElementById('pcount').textContent = `${photoN}/6 photos`;
  document.getElementById('photobtn').disabled  = photoN < 1;
}


/* ─────────────────────────────────────────────────────────────
   7. VISUAL CALIBRATION (MetaFBP face rater)
   ───────────────────────────────────────────────────────────── */
let calN = 0;

function initCal() {
  calN = 0;
  updCal();
  showFace();
  setupFSwipe();
}

function showFace() {
  if (calN >= 50) {
    toast('Learning preferences...', 'tg');
    setTimeout(() => scrollToSection(4), 1200);
    return;
  }
  document.getElementById('fsvg').innerHTML = genFaceV9(calN * 17 + 42, 130);
  gsap.fromTo('#fcard',
    { y: 24, opacity: 0, scale: .96 },
    { y:  0, opacity: 1, scale:  1,  duration: .35, ease: 'back.out(1.7)' }
  );
}

function rateFace(rating) {
  calN++;
  updCal();
  flash();
  const dir = rating >= 4 ? 'right' : rating <= 2 ? 'left' : 'up';
  const tx  = dir === 'right' ? 350 : dir === 'left' ? -350 : 0;
  gsap.to('#fcard', {
    x: tx, y: dir === 'up' ? -250 : 0,
    rotation: tx * .04, opacity: 0,
    duration: .3, ease: 'power3.in',
    onComplete() { gsap.set('#fcard', { x: 0, y: 0, rotation: 0 }); showFace(); },
  });
}

function updCal() {
  const offset = 188.5 - (calN / 50) * 188.5;
  gsap.to('#calring', { attr: { 'stroke-dashoffset': offset }, duration: .4, ease: 'power2.out' });
  document.getElementById('calnum').textContent = `${calN}/50`;
}

function setupFSwipe() {
  const wrap = document.getElementById('fcwrap');
  let startX = 0, dragging = 0;

  wrap.addEventListener('pointerdown', e => { startX = e.clientX; dragging = 1; });

  document.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx   = e.clientX - startX;
    const card = document.getElementById('fcard');
    card.style.transform = `translateX(${dx}px) rotate(${dx * .1}deg)`;
    card.querySelector('.st-like').style.opacity = Math.min(Math.max( dx / 130, 0), 1);
    card.querySelector('.st-nope').style.opacity = Math.min(Math.max(-dx / 130, 0), 1);
  });

  document.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = 0;
    const dx   = e.clientX - startX;
    const card = document.getElementById('fcard');
    card.querySelector('.st-like').style.opacity = 0;
    card.querySelector('.st-nope').style.opacity = 0;
    if (Math.abs(dx) > 110) {
      rateFace(dx > 0 ? 4 : 2);
    } else {
      gsap.to(card, { x: 0, rotation: 0, duration: .5, ease: 'elastic.out(1,.5)' });
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   8. PSYCHOMETRIC QUESTIONNAIRE (PIIP)
   ───────────────────────────────────────────────────────────── */
let qI = 0;

function initQ() { qI = 0; showQ(0); }

function showQ(i) {
  if (i >= FQ.length) { startGem(); return; }

  document.getElementById('qctr').textContent  = `Q${i + 1} of 6`;
  document.getElementById('qtxt').textContent  = FQ[i];
  document.getElementById('qta').value         = '';
  document.getElementById('qbtn').disabled     = true;
  document.getElementById('wcnt').textContent  = '0 / 25 word minimum';
  document.getElementById('wcnt').className    = 'wcount bad';

  gsap.fromTo('#qwrap',
    { x: 50, opacity: 0 },
    { x:  0, opacity: 1, duration: .35, ease: 'expo.out' }
  );
}

function onQInput() {
  const text    = document.getElementById('qta').value.trim();
  const words   = text ? text.split(/\s+/).length : 0;
  const counter = document.getElementById('wcnt');
  const btn     = document.getElementById('qbtn');

  if (words < 25) {
    counter.textContent = `${words} / 25 word minimum`;
    counter.className   = 'wcount bad';
    btn.disabled        = true;
  } else if (words <= 150) {
    counter.textContent = `${words} words ✓`;
    counter.className   = 'wcount ok';
    btn.disabled        = false;
  } else {
    counter.textContent = `${words} — 150 max`;
    counter.className   = 'wcount bad';
    btn.disabled        = true;
  }

  // Live neural-net stats
  document.getElementById('nnn').textContent = 40  + Math.floor(words / 10);
  document.getElementById('nnc').textContent = 156 + Math.floor(words / 25) * 20;
  document.getElementById('nns').textContent = Math.min(.45 + words * .005, .99).toFixed(2);
}

function submitQ() {
  flash();
  qI++;
  gsap.to('#qwrap', {
    x: -50, opacity: 0, duration: .25, ease: 'power3.in',
    onComplete() { showQ(qI); },
  });
}

function startGem() {
  const overlay = document.getElementById('govl');
  overlay.classList.add('on');

  const label = document.getElementById('gtxt');
  const bar   = document.getElementById('gfill');

  const phases = [
    { t: 'Extracting linguistic signals...',   p: 20,  d: 0     },
    { t: 'Mapping personality dimensions...',  p: 50,  d: 2000  },
    { t: 'Calculating confidence scores...',   p: 80,  d: 4500  },
    { t: 'Building your profile...',           p: 100, d: 7000  },
  ];

  phases.forEach(ph => setTimeout(() => {
    label.textContent  = ph.t;
    bar.style.width    = ph.p + '%';
  }, ph.d));

  setTimeout(() => {
    label.textContent = 'Profile Complete!';
    gsap.to('#gres', { opacity: 1, duration: .5 });
  }, 8500);

  setTimeout(() => {
    overlay.classList.remove('on');
    scrollToSection(5);
  }, 10500);
}


/* ─────────────────────────────────────────────────────────────
   9. HLA UPLOAD SIMULATION
   ───────────────────────────────────────────────────────────── */
let hlaUp = false;

function simUpload() {
  if (hlaUp) return;
  const bar  = document.getElementById('upbar');
  const fill = document.getElementById('upfill');
  bar.style.display = 'block';

  gsap.to(fill, {
    width: '100%', duration: 2, ease: 'power2.inOut',
    onComplete() {
      hlaUp = true;
      const loci = [
        { el: 'la', v: 'A*02:01',    d: 0   },
        { el: 'lb', v: 'B*07:02',    d: 300 },
        { el: 'lc', v: 'DRB1*15:01', d: 600 },
      ];
      loci.forEach(l => setTimeout(() => {
        const cell = document.getElementById(l.el);
        cell.classList.add('act');
        cell.querySelector('.lv').textContent = l.v;
        gsap.from(cell, { scale: .8, duration: .4, ease: 'back.out(1.7)' });
      }, l.d));

      toast('Genetic data encrypted', 'tg');

      const bioRow = document.getElementById('biock');
      if (bioRow) {
        bioRow.innerHTML = '<span class="ck done"><svg><use href="#i-check"/></svg></span>Biological data uploaded — 3 HLA loci';
      }
    },
  });
}


/* ─────────────────────────────────────────────────────────────
   10. SWIPE DECK
   ───────────────────────────────────────────────────────────── */
let cardI = 0, swpN = 0, rtN = 0;

function initDeck() { cardI = 0; swpN = 0; rtN = 0; renderDeck(); }

function renderDeck() {
  const deck  = document.getElementById('deck');
  const empty = document.getElementById('edeck');
  deck.innerHTML = '';

  if (cardI >= CANDS.length) {
    deck.style.display  = 'none';
    empty.style.display = 'block';
    return;
  }

  deck.style.display  = '';
  empty.style.display = 'none';

  // Stack: back → front (off = 2..0)
  for (let off = 2; off >= 0; off--) {
    const idx  = cardI + off;
    if (idx >= CANDS.length) continue;

    const c    = CANDS[idx];
    const card = document.createElement('div');
    card.className   = 'scard';
    card.style.zIndex = 3 - off;
    card.style.transform = `scale(${1 - off * .05}) translateY(${off * 10}px)`;
    if (off > 0) card.style.pointerEvents = 'none';

    card.innerHTML = `
      <div class="stamp st-l">LIKE</div>
      <div class="stamp st-n">NOPE</div>
      <div class="stamp st-s">SUPER</div>
      <div class="cphoto">
        ${genFaceV9(idx * 31 + 100, 110)}
        <div class="dots">
          ${Array(c.ph).fill(0).map((_, i) => `<div class="dot${i === 0 ? ' on' : ''}"></div>`).join('')}
        </div>
      </div>
      <div class="cinfo">
        <div class="cname">${c.n}, ${c.a}</div>
        <div class="cloc"><svg><use href="#i-pin"/></svg>${c.l}</div>
        <div class="ctags">${c.t.map(t => `<span class="bdg bdg-g">${t}</span>`).join('')}</div>
      </div>`;

    deck.appendChild(card);
    if (off === 0) setupSwipe(card);
  }
}

function setupSwipe(card) {
  let sx = 0, sy = 0, dragging = 0;

  card.addEventListener('pointerdown', e => {
    sx = e.clientX; sy = e.clientY; dragging = 1;
    card.style.transition = 'none';
  });

  const onMove = e => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    card.style.transform = `translateX(${dx}px) translateY(${dy}px) rotate(${dx * .08}deg)`;
    card.querySelector('.st-l').style.opacity = Math.min(Math.max( dx / 130, 0), 1);
    card.querySelector('.st-n').style.opacity = Math.min(Math.max(-dx / 130, 0), 1);
    card.querySelector('.st-s').style.opacity = Math.min(Math.max(-dy /  90, 0), 1);
  };

  const onUp = e => {
    if (!dragging) return;
    dragging = 0;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    ['st-l','st-n','st-s'].forEach(cls => { card.querySelector(`.${cls}`).style.opacity = 0; });

    if      (Math.abs(dx) > 120) commitSwipe(dx > 0 ? 'right' : 'left');
    else if (dy < -90)           commitSwipe('up');
    else gsap.to(card, { x: 0, y: 0, rotation: 0, duration: .5, ease: 'elastic.out(1,.5)' });
  };

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup',   onUp);
}

function commitSwipe(dir) {
  const deck = document.getElementById('deck');
  const card = deck.lastElementChild;
  if (!card) return;

  const tx = dir === 'right' ? 650 : dir === 'left' ? -650 : 0;
  const ty = dir === 'up'    ? -450 : 0;

  if (dir === 'right') rtN++;
  swpN++;
  flash();

  gsap.to(card, {
    x: tx, y: ty, rotation: tx ? tx * .04 : 0, opacity: 0,
    duration: .3, ease: 'power3.in',
    onComplete() {
      cardI++;
      if (rtN === 3 && dir === 'right') setTimeout(trigMR, 300);
      renderDeck();
    },
  });
}


/* ─────────────────────────────────────────────────────────────
   11. MATCH LIST & CHAT
   ───────────────────────────────────────────────────────────── */
function initMatches() {
  const list = document.getElementById('mlist');
  list.innerHTML = '';

  MATCHES.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'mcard';
    card.onclick   = () => openChat(i);
    const circ  = 2 * Math.PI * 13;
    const score = circ * (1 - m.wtm / 100);

    card.innerHTML = `
      <div class="av av-m av-face">${genFaceV9(i * 23 + 5, 44, 'circle')}</div>
      <div class="mi">
        <div class="mn">${m.n}, ${m.a}</div>
        <div class="mb"><span class="${m.bc}">${m.bg}</span></div>
        ${m.lm
          ? `<div class="ml">${m.lm}</div>`
          : `<div class="ml" style="opacity:.4;font-style:italic">No messages yet</div>`}
      </div>
      <div style="flex-shrink:0;text-align:center">
        <svg width="34" height="34">
          <circle cx="17" cy="17" r="13" fill="none" stroke="var(--bdr)" stroke-width="2.5"/>
          <circle cx="17" cy="17" r="13" fill="none" stroke="var(--gold)" stroke-width="2.5"
            stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${score}"
            style="transform:rotate(-90deg);transform-origin:center"/>
        </svg>
        <div style="font-size:.55rem;font-weight:700;margin-top:-24px;position:relative">${m.wtm}</div>
      </div>`;

    list.appendChild(card);
  });
}

function openChat(i) {
  const m   = MATCHES[i];
  const ch  = document.getElementById('chatarea');
  const ph  = document.getElementById('chatplaceholder');
  ph.style.display = 'none';
  ch.style.display = 'flex';

  document.getElementById('chatav').innerHTML        = genFaceV9(i * 23 + 5, 32, 'circle');
  document.getElementById('chatav').style.background = 'none';
  document.getElementById('chatname').textContent    = m.n;

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = m.msgs.map(msg =>
    `<div class="bub ${msg.f === 'you' ? 'you' : 'them'}">${msg.t}<div class="btime">${msg.tm}</div></div>`
  ).join('') + '<div class="typi" id="typi"><i></i><i></i><i></i></div>';

  setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
}

function closeChat() {
  document.getElementById('chatarea').style.display = 'none';
  document.getElementById('chatplaceholder').style.display = '';
}

function sendMsg() {
  const input = document.getElementById('chinp');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  const msgs  = document.getElementById('msgs');
  const typi  = document.getElementById('typi');
  const now   = new Date();
  const ts    = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const outBub = document.createElement('div');
  outBub.className = 'bub you';
  outBub.innerHTML = `${text}<div class="btime">${ts}</div>`;
  msgs.insertBefore(outBub, typi);
  msgs.scrollTop = msgs.scrollHeight;

  // Typing indicator then auto-reply
  setTimeout(() => { typi.classList.add('on'); msgs.scrollTop = msgs.scrollHeight; }, 500);
  setTimeout(() => {
    typi.classList.remove('on');
    const reply  = document.createElement('div');
    reply.className = 'bub them';
    const tsNext = `${now.getHours()}:${String(now.getMinutes() + 1).padStart(2, '0')}`;
    reply.innerHTML = `${AREPLIES[Math.random() * AREPLIES.length | 0]}<div class="btime">${tsNext}</div>`;
    msgs.insertBefore(reply, typi);
    msgs.scrollTop = msgs.scrollHeight;
  }, 2500);
}


/* ─────────────────────────────────────────────────────────────
   12. PROFILE VIEW + RADAR CHART
   ───────────────────────────────────────────────────────────── */
function initProfile() {
  const container = document.getElementById('profcontent');
  const sins      = U.sins;

  container.innerHTML = `
    <div class="profhdr">
      <div class="av av-xl av-ring av-face" style="background:none">${genFaceV9(U.fn.charCodeAt(0) || 65, 88, 'circle')}</div>
      <h2>${U.fn}</h2>
      <p class="pm">${U.age} · ${U.loc}</p>
      <div class="qbadge" style="margin-top:8px">
        <svg style="width:12px;height:12px;fill:var(--gold)"><use href="#i-diamond"/></svg>
        Profile Quality: High
      </div>
    </div>
    <div class="pgal">
      ${[0,1,2,3].map(i =>
        `<div style="background:none;position:relative;">${genFaceV9(i * 13 + 50, 0, 'slot')}</div>`
      ).join('')}
      <div style="border:2px dashed var(--goldd);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center" onclick="toast('Photo picker','ti')">
        <svg style="width:16px;height:16px;fill:var(--gold)"><use href="#i-plus"/></svg>
      </div>
    </div>
    <div class="stitle">Personality Breakdown</div>
    ${Object.entries(sins).map(([, v]) => {
      const pct = Math.abs(v.s) / 5 * 50;
      return `<div class="pbrow">
        <div class="pblbl">${v.f}</div>
        <div class="pbbar">
          <div class="pbctr"></div>
          <div class="pbfill ${v.s > 0 ? 'vice' : 'virtue'}" style="width:${pct}%"></div>
        </div>
        <div class="pbsc">${v.s > 0 ? '+' : ''}${v.s}</div>
        <div class="pbwt">${v.w}×</div>
      </div>`;
    }).join('')}`;

  // Animate bars
  setTimeout(() => {
    gsap.from('.pbfill', { scaleX: 0, transformOrigin: '50% 50%', duration: .8, stagger: .1, ease: 'expo.out' });
  }, 200);

  drawRadar();
}

function drawRadar() {
  const cv = document.getElementById('radar');
  if (!cv) return;

  const ctx  = cv.getContext('2d');
  const W    = cv.width;
  const H    = cv.height;
  const cx   = W / 2;
  const cy   = H / 2;
  const R    = 110;
  const sins = U.sins;
  const lbl  = Object.values(sins).map(v => v.f);
  const vals = Object.values(sins).map(v => (v.s + 5) / 10);
  const n    = 7;
  const step = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, W, H);

  // Background rings
  for (let ring = 1; ring <= 4; ring++) {
    const r = (ring / 4) * R;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = i * step - Math.PI / 2;
      i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
              : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(240,200,110,.08)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  // Spoke lines
  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = 'rgba(240,200,110,.05)';
    ctx.stroke();
  }

  // Filled polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const a   = idx * step - Math.PI / 2;
    const r   = vals[idx] * R;
    i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
            : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle   = 'rgba(240,200,110,.12)';
  ctx.fill();
  ctx.strokeStyle = '#F0C86E';
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Data-point dots
  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2;
    const r = vals[i] * R;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3, 0, 6.28);
    ctx.fillStyle = '#F0C86E';
    ctx.fill();
  }

  // Labels
  ctx.font         = '10px DM Sans,sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = getComputedStyle(document.documentElement).getPropertyValue('--t2').trim() || '#C4B8B0';

  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2;
    ctx.fillText(lbl[i], cx + Math.cos(a) * (R + 20), cy + Math.sin(a) * (R + 20));
  }
}

function openSettings() {
  openSheet(`
    <div style="margin-bottom:16px">
      <h4 style="font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:10px">Account</h4>
      ${[['Name', U.fn], ['Email', U.email], ['Location', U.loc]].map(([label, val]) => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);font-size:.82rem">
        <span style="color:var(--t2)">${label}</span><span style="color:var(--t3)">${val}</span>
      </div>`).join('')}
    </div>
    <div style="margin-bottom:16px">
      <h4 style="font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:10px">Preferences</h4>
      ${[['Age Range', '22–34'], ['Distance', '15 km']].map(([label, val]) => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);font-size:.82rem">
        <span style="color:var(--t2)">${label}</span><span style="color:var(--t3)">${val}</span>
      </div>`).join('')}
    </div>
    <div style="margin-bottom:16px">
      <h4 style="font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:10px">Actions</h4>
      <button style="color:var(--gold);background:none;border:none;cursor:pointer;font-size:.82rem;text-decoration:underline"
        onclick="toast('Would restart questionnaire','ti')">Retake Questionnaire</button><br>
      <button style="color:var(--gold);background:none;border:none;cursor:pointer;font-size:.82rem;text-decoration:underline;margin-top:6px"
        onclick="toast('Would open upload','ti')">Add DNA Data</button>
    </div>
    <button style="width:100%;padding:10px;background:transparent;border:1.5px solid var(--mar);color:var(--marl);border-radius:10px;font-weight:600;cursor:pointer;font-size:.85rem"
      onclick="toast('Requires confirmation','tm')">Delete Account</button>`);
}


/* ─────────────────────────────────────────────────────────────
   13. ADMIN DASHBOARD
   ───────────────────────────────────────────────────────────── */
function initAdmin() {
  const container = document.getElementById('admincontent');

  container.innerHTML = `
    <div class="astats">
      ${[['total','Total'],['pend','Pending'],['appr','Approved'],['corr','Corrected'],['rej','Rejected']].map(([k, label]) => `
      <div class="astat">
        <div class="an" data-t="${STATS[k]}">0</div>
        <div class="al">${label}</div>
      </div>`).join('')}
    </div>

    <div class="stitle">Coverage Heatmap</div>
    <div style="font-size:.78rem;margin-bottom:6px">134/210 validated — 63.8%</div>
    <div style="height:4px;background:var(--bdr);border-radius:2px;overflow:hidden;margin-bottom:10px">
      <div style="height:100%;width:63.8%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:2px;box-shadow:0 0 6px var(--golds)"></div>
    </div>

    <div class="hmgrid">
      <div class="hmhdr"></div>
      ${['Q1','Q2','Q3','Q4','Q5','Q6'].map(q => `<div class="hmhdr">${q}</div>`).join('')}
      ${SINS.map((sin, ri) =>
        `<div class="hmrl">${sin}</div>` +
        HM[ri].map(v => `<div class="hmc ${v >= 5 ? 'hg' : v >= 2 ? 'hs' : 'hm'}">${v}</div>`).join('')
      ).join('')}
    </div>

    <div class="stitle">Review Queue</div>
    ${CALDATA.map((ex, i) => `
    <div class="rcard" id="rc${i}">
      <div class="rh">
        <span class="bdg bdg-g">Q${ex.qn}</span>
        <span class="bdg bdg-m">${ex.sin}</span>
      </div>
      <div class="rt">${ex.txt}</div>
      <div class="rm">
        <span>Score: <b>${ex.sc}</b></span>
        <span>Confidence: <b>${ex.co}</b></span>
      </div>
      <div class="re">"${ex.ev}"</div>
      <div class="racts">
        <button class="ra" onclick="revAct(${i},'a')">✓ Approve</button>
        <button class="rc" onclick="document.getElementById('cp${i}').classList.toggle('on')">✎ Correct</button>
        <button class="rr" onclick="revAct(${i},'r')">✕ Reject</button>
      </div>
      <div class="cpanel" id="cp${i}">
        <div class="cv" id="cv${i}">${ex.sc}</div>
        <input type="range" min="-50" max="50" value="${ex.sc * 10}"
          oninput="document.getElementById('cv${i}').textContent=(this.value/10).toFixed(1)">
        <button class="btn-g" style="width:100%;margin-top:6px;padding:7px" onclick="revAct(${i},'c')">Submit</button>
      </div>
    </div>`).join('')}

    <div class="stitle" style="margin-top:16px">Gemini Drift</div>
    <canvas id="effch" width="400" height="180" style="width:100%;max-height:180px;border-radius:12px"></canvas>`;

  // Animate stat counters
  setTimeout(() => {
    container.querySelectorAll('.an[data-t]').forEach(el => {
      gsap.to({ v: 0 }, {
        v: +el.dataset.t, duration: 1, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); },
      });
    });
    gsap.from('.hmc', { opacity: 0, duration: .2, stagger: .015 });
  }, 100);

  setTimeout(drawEff, 200);
}

function revAct(i, action) {
  const card = document.getElementById(`rc${i}`);
  gsap.to(card, {
    x: action === 'r' ? -250 : 250,
    opacity: 0, height: 0, padding: 0, margin: 0,
    duration: .35, ease: 'power2.in',
    onComplete() { card.remove(); },
  });
  toast({ a: 'Approved', c: 'Corrected', r: 'Rejected' }[action], action === 'r' ? 'tm' : 'tg');
}

function drawEff() {
  const cv = document.getElementById('effch');
  if (!cv) return;

  const ctx  = cv.getContext('2d');
  const W    = cv.width;
  const H    = cv.height;
  const pad  = { t: 16, r: 14, b: 24, l: 34 };
  const pW   = W - pad.l - pad.r;
  const pH   = H - pad.t - pad.b;
  const maxY = 2.5;
  const xS   = pW / (EFF.length - 1);

  ctx.clearRect(0, 0, W, H);

  // Y-axis labels + grid lines
  ctx.font      = '9px JetBrains Mono,monospace';
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--t3').trim() || '#7A6E68';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 5; i++) {
    const val = (maxY / 5 * i).toFixed(1);
    const y   = pad.t + pH - (i / 5) * pH;
    ctx.fillText(val, pad.l - 4, y + 3);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.strokeStyle = 'rgba(122,110,104,.08)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  // X-axis labels
  ctx.textAlign = 'center';
  EFF.forEach((d, i) => ctx.fillText(`B${d.b}`, pad.l + i * xS, H - 5));

  // Fill area
  ctx.beginPath();
  EFF.forEach((d, i) => {
    const x = pad.l + i * xS;
    const y = pad.t + pH - (d.d / maxY) * pH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.l + (EFF.length - 1) * xS, pad.t + pH);
  ctx.lineTo(pad.l, pad.t + pH);
  ctx.closePath();
  ctx.fillStyle = 'rgba(240,200,110,.06)';
  ctx.fill();

  // Line
  const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#F0C86E';
  ctx.beginPath();
  EFF.forEach((d, i) => {
    const x = pad.l + i * xS;
    const y = pad.t + pH - (d.d / maxY) * pH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = gold;
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Data-point dots
  EFF.forEach((d, i) => {
    const x = pad.l + i * xS;
    const y = pad.t + pH - (d.d / maxY) * pH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 6.28);
    ctx.fillStyle = gold;
    ctx.fill();
  });

  // Annotation
  ctx.font      = '9px DM Sans';
  ctx.fillStyle = gold;
  ctx.textAlign = 'center';
  ctx.fillText('↓ 62.9% improvement', W / 2, pad.t + 5);
}


/* ─────────────────────────────────────────────────────────────
   14. BOOTSTRAP
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Ambient effects
  initDust();
  initDots();

  // Sync theme button icon with initial theme
  const initTheme = document.documentElement.dataset.theme;
  document.getElementById('thbtn').innerHTML =
    `<svg><use href="#i-${initTheme === 'dark' ? 'moon' : 'sun'}"/></svg>`;

  // Staggered sign-up form entrance
  gsap.from('#signupform .fgroup', {
    y: 18, opacity: 0, duration: .45, stagger: .07, ease: 'expo.out', delay: .3,
  });

  // Feature modules
  initPhotos();
  initCal();
  initQ();
  showQ(0);
  initDeck();
  initMatches();
  initProfile();
  initAdmin();

  // Confetti on completion section enter
  ScrollTrigger.create({
    trigger: '#s6',
    start: 'top center',
    onEnter: () => boom(),
    once: true,
  });

  // ScrollTrigger entrance animations + dot sync
  setTimeout(initScroll, 100);

  console.log('Harmonia Preview v9.0 — Face Set v9 integrated');
});
