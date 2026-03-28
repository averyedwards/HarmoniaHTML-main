# Visual Design Patch: p2p.html

## What this is

This prompt transforms the existing p2p.html from a horizontal sliding card system into a vertical card stack with premium visual treatment. The page architecture (headline, context line, top bar, three cards with two expansion levels, email capture, declaration, footer) is unchanged. The prose content is unchanged. What changes is the layout direction, the visual depth of every surface, the icon animations, the expand/collapse choreography, and the visual hierarchy between active and inactive cards.

## Before you begin

Read these files from the repository:

1. **p2p.html** (the current working build you will modify)
2. **team.html** (your visual reference for card treatment: study the team-card background `rgba(45, 26, 28, 0.6)`, the animated SVG radar avatars with `symbolRotate` at 20s and `symbolPulse` at 4s, the hover lift `translateY(-5px)` with gold box-shadow, and the `border: 1px solid var(--gold-light)`)
3. **why-harmonia.html** (your visual reference for icon animations: study the eye-open animation, the personality triangle, the genetic helix, and the synthesis knot. Also study the science-card component structure.)
4. **assets/css/styles.css** (study the keyframes: `symbolRotate`, `symbolPulse`, `float`, the `.fade-in` and `.delay-*` classes, and the colour variables especially `--gold`, `--gold-light`, `--gold-champagne`, `--maroon`, `--maroon-deep`, `--rose`, `--slate`, `--cream`, `--card-bg`, `--dark-surface`)

Then search Google using Chrome for:

1. **"vertical accordion card stack expand center scroll CSS"**: how vertical card stacks handle expansion with smooth centering of the active card
2. **"CSS clip-path inset content reveal curtain animation"**: how clip-path unveil transitions work for progressive disclosure
3. **"premium dark mode card depth gradient border glow CSS"**: depth techniques for rich dark card surfaces

---

## Layout change: horizontal slider to vertical stack

The current p2p.html uses a horizontal `.card-track` at `width: 300%` with `translateX` to slide between cards. Only one card is visible at a time. This is being replaced with a vertical stack where all three cards are visible simultaneously, stacked in a column with gold connector lines between them.

### HTML changes

**Remove** the `.card-viewport` wrapper (the one with `clip-path: inset(-9999px 0)`) and the `.card-track` wrapper (the flex container at `width: 300%`). The three `.phase-card` elements go directly inside `.card-section` as vertical children.

**Remove** the `.phase-dots-row` (pagination dots) entirely. All three cards are visible; dots serve no purpose.

**Add** between each pair of cards a connector element:

```html
<div class="phase-connector" aria-hidden="true">
    <div class="connector-line"></div>
</div>
```

Place one between Card 1 and Card 2, and one between Card 2 and Card 3. These are purely decorative.

The resulting structure inside `.card-section` is:

```
.card-section
    .phase-card#card-0  (Calibration)
    .phase-connector
    .phase-card#card-1  (Resonance)
    .phase-connector
    .phase-card#card-2  (Chemistry)
```

**Do not change** any content inside the cards. All prose, all SVG icon containers, all card-row elements, all card-method-wrap elements, all buttons stay exactly where they are. The only SVG change is upgrading the icon animations (described in section 4 below).

### CSS changes for layout

Replace the horizontal `.card-track` and `.card-viewport` styles with a vertical flex column:

```css
.card-section {
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;  /* connectors handle spacing */
}
```

Each `.phase-card` gets `width: 100%` and sits in the natural vertical flow. No `translateX`. No `flex-shrink: 0`. No `width: calc(100% / 3)`.

### JS changes for layout

**Remove:** `setTrackPosition()`, `setTrackPositionInstant()`, the `updateActiveIndicators()` dot logic (keep the tab logic), the entire touch/swipe event handler block (`touchstart`, `touchend`).

**Keep:** All expand/collapse logic (`collapseCard`, `expandToFirst`, `toggleSecondExpansion`), all more-info button handlers, the copy-link button handler, tab click handlers (repurposed below).

**Repurpose tab clicks:** When a tab is clicked, instead of sliding the track, it: (1) collapses any currently expanded card, (2) expands the target card to first expansion, (3) scrolls the target card to center in the viewport via `card.scrollIntoView({ behavior: 'smooth', block: 'center' })`. The tab active state still updates to match the expanded card.

**Add:** When any card expands (via clicking the collapsed card or via a tab click), add a CSS class `.has-active` to the `.card-section` container and `.is-active` to the expanded card. When all cards are collapsed, remove `.has-active`. This drives the active/inactive visual hierarchy via CSS (section 3 below).

**Add:** After expanding, call `card.scrollIntoView({ behavior: 'smooth', block: 'center' })` with a short delay (100ms) to allow the expansion animation to begin before scrolling.

---

## 1. Card surface depth

Replace the flat card backgrounds with a layered depth system.

### Dark mode card surface

```css
[data-theme="dark"] .phase-card {
    background: linear-gradient(
        165deg,
        rgba(114, 47, 55, 0.12) 0%,
        rgba(26, 18, 20, 0.95) 40%,
        rgba(18, 9, 10, 1) 70%,
        rgba(212, 168, 83, 0.04) 100%
    );
    border: 1px solid transparent;
    border-radius: 12px;
    background-clip: padding-box;
}
```

Gradient border via a wrapper or the `background` layering technique:

```css
[data-theme="dark"] .phase-card {
    border: 1px solid transparent;
    background:
        linear-gradient(165deg, rgba(26, 18, 20, 1), rgba(18, 9, 10, 1)) padding-box,
        linear-gradient(135deg,
            rgba(114, 47, 55, 0.5),
            rgba(212, 168, 83, 0.3),
            rgba(114, 47, 55, 0.5)
        ) border-box;
}
```

Four-layer box-shadow:

```css
[data-theme="dark"] .phase-card {
    box-shadow:
        inset 0 1px 0 rgba(212, 168, 83, 0.06),
        0 0 0 1px rgba(212, 168, 83, 0.08),
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 8px 16px rgba(0, 0, 0, 0.15);
}
```

Noise texture overlay via `::after` pseudo-element at 3% opacity (using inline SVG feTurbulence filter or a small PNG). This is optional; if it adds complexity without visible benefit at this card size, skip it.

### Light mode card surface

Light mode cards use a cream-to-blush directional gradient, maroon border accents at low opacity, and softer shadows. Adapt the dark mode treatment with appropriate lightened values. The gradient border in light mode uses maroon at 0.2 opacity instead of 0.5.

### Hover treatment on collapsed cards

Collapsed cards lift on hover like team cards:

```css
.phase-card[data-state="collapsed"]:hover {
    transform: translateY(-4px);
    box-shadow:
        inset 0 1px 0 rgba(212, 168, 83, 0.1),
        0 0 0 1px rgba(212, 168, 83, 0.15),
        0 4px 8px rgba(0, 0, 0, 0.3),
        0 16px 32px rgba(0, 0, 0, 0.15);
}
```

Border-radius: increase from 8px to 12px across all cards for a softer, more premium feel.

---

## 2. Active card / inactive card hierarchy

When a card is expanded (`.is-active` class), it visually dominates. All other collapsed cards recede.

### Active card treatment

```css
.phase-card.is-active {
    border-color: rgba(212, 168, 83, 0.4);
    box-shadow:
        inset 0 1px 0 rgba(212, 168, 83, 0.1),
        0 0 0 1px rgba(212, 168, 83, 0.2),
        0 0 10px rgba(212, 168, 83, 0.15),
        0 0 30px rgba(212, 168, 83, 0.08),
        0 0 60px rgba(212, 168, 83, 0.04);
    animation: goldPulse 4s ease-in-out infinite;
}

@keyframes goldPulse {
    0%, 100% {
        box-shadow:
            inset 0 1px 0 rgba(212, 168, 83, 0.1),
            0 0 0 1px rgba(212, 168, 83, 0.2),
            0 0 10px rgba(212, 168, 83, 0.15),
            0 0 30px rgba(212, 168, 83, 0.08),
            0 0 60px rgba(212, 168, 83, 0.04);
    }
    50% {
        box-shadow:
            inset 0 1px 0 rgba(212, 168, 83, 0.15),
            0 0 0 1px rgba(212, 168, 83, 0.3),
            0 0 15px rgba(212, 168, 83, 0.2),
            0 0 40px rgba(212, 168, 83, 0.12),
            0 0 80px rgba(212, 168, 83, 0.06);
    }
}
```

### Inactive card treatment

```css
.card-section.has-active .phase-card:not(.is-active) {
    opacity: 0.55;
    transform: scale(0.98);
    filter: brightness(0.7) saturate(0.5);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-section.has-active .phase-card:not(.is-active):hover {
    opacity: 0.75;
    filter: brightness(0.85) saturate(0.7);
}
```

Connectors between cards also dim when a card is active:

```css
.card-section.has-active .phase-connector {
    opacity: 0.4;
}
```

---

## 3. Living SVG icons

Replace the current static SVGs with continuously animated versions. Keep the same icon containers and the same `data-dash` stroke-dashoffset draw animation that fires on expansion. The new breathing animations run underneath as a continuous base.

### Eye icon (Phase 1: Calibration)

The eye should feel watchful and alive. Three layered animations:

**Blink:** Every 5 seconds, the lid group `scaleY` drops to 0.05 for approximately 7% of the cycle, then returns. Use a keyframe that is mostly static with a brief dip.

**Iris pulse:** The iris circle gently scales from 1.0 to 1.15 and back over 4 seconds. Use `cubic-bezier(0.5, 0, 0.5, 1)` for organic breathing.

**Iris drift:** The iris translates horizontally by +/- 2px over 6 seconds, as if scanning. Subtle and slow.

**Gold glow:** The entire SVG has a `filter: drop-shadow(0 0 4px rgba(212, 168, 83, 0.3))` that pulses in sync with the iris.

Structure the SVG so the lid paths are in a `<g class="eye-lid-group">`, the iris is in a `<g class="eye-iris-group">`, and the glow is on the outer `<svg>` or its container.

### Overlapping circles icon (Phase 2: Resonance)

The circles should breathe apart and together like the Apple Watch Breathe animation.

**Breathing:** Left circle translates `+4px` while right circle translates `-4px` over 4 seconds, then they drift back. The movement is gentle and continuous.

**Overlap glow:** The vesica piscis (lens/intersection shape) pulses in gold fill-opacity from 0.15 to 0.5, brightest at maximum overlap (when circles are closest). Use `cubic-bezier(0.5, 0, 0.5, 1)`.

**Centre dot:** The maroon dot at the intersection pulses scale 1.0 to 1.2 in sync with the overlap glow.

### DNA helix icon (Phase 3: Chemistry)

The helix should feel like it is slowly rotating in 3D space.

**Rung rotation:** Each horizontal rung line gets a CSS animation that modulates its `scaleX` and `opacity` to simulate Y-axis rotation. Each successive rung has a `-0.8s` animation delay offset, creating the characteristic spiral wave. Use `8s linear infinite` for smooth continuous rotation.

**Travelling gold highlight:** Each rung's maroon accent dot pulses to gold in a staggered wave: `animation-delay: calc(var(--rung-index) * 0.5s)`. The gold pulse travels up the helix, suggesting energy flow.

**Strand sway:** The two main helix strand paths gently translate `+/- 1.5px` horizontally over 6 seconds, creating a subtle swaying effect.

### Shared icon properties

All three icons:
- `filter: drop-shadow(0 0 3px rgba(212, 168, 83, 0.25)) drop-shadow(0 0 8px rgba(212, 168, 83, 0.12))` as baseline glow
- Glow intensifies when card is expanded (`.is-active .card-icon svg { filter: drop-shadow(0 0 6px rgba(212, 168, 83, 0.5)) drop-shadow(0 0 16px rgba(212, 168, 83, 0.25)) }`)
- `prefers-reduced-motion` media query sets all animation to `none` while retaining static glow
- Icon size increases slightly from 90px to 100px for more visual presence

---

## 4. Gold connector lines between cards

Each `.phase-connector` is approximately 32px tall, centred horizontally, containing a 1px-wide gold gradient line:

```css
.phase-connector {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    position: relative;
}

.connector-line {
    width: 1px;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(212, 168, 83, 0.35),
        rgba(212, 168, 83, 0.08)
    );
    position: relative;
}
```

Add a travelling shimmer via `::after` pseudo-element: a bright gold highlight (4px tall, full opacity) that translates from top to bottom over 3 seconds, pauses for 2 seconds, then repeats:

```css
.connector-line::after {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    width: 3px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 6px rgba(212, 168, 83, 0.6);
    animation: connectorShimmer 5s ease-in-out infinite;
}

@keyframes connectorShimmer {
    0%, 100% { transform: translateY(0); opacity: 0; }
    10% { opacity: 1; }
    60% { transform: translateY(28px); opacity: 1; }
    70% { opacity: 0; }
}
```

---

## 5. Expand/collapse choreography with curtain unveil

Replace the current instant content appearance with a staggered reveal using `clip-path` curtain unveil.

### On expansion (collapsed to first expansion):

**Phase 1 (0ms):** Card height begins expanding. Border and glow treatment transitions to active state. The `.card-body-wrap` max-height transitions from 0 to its scroll height with easing `cubic-bezier(0.19, 1, 0.22, 1)` over 500ms.

**Phase 2 (50ms):** Icon transforms: rotates 10 degrees, scales up 1.08x, glow intensifies. Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring overshoot).

**Phase 3 (150ms):** Content rows reveal with curtain unveil and stagger. Each `.card-row` has a CSS custom property `--i` (0, 1, 2) set inline in the HTML. On expansion, rows transition from `clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(8px)` to `clip-path: inset(0); opacity: 1; transform: translateY(0)`. Transition delay per row: `calc(150ms + var(--i) * 80ms)`. Duration: 400ms.

**Add the `--i` custom property to each card row in the HTML:**

```html
<div class="card-row" style="--i: 0">...</div>
<div class="card-row" style="--i: 1">...</div>
<div class="card-row" style="--i: 2">...</div>
```

Also add `--i: 3` to the `.tell-friends` block in Card 3 and `--i: 3` (or 4) to the `.more-info-btn`.

**Phase 4 (400ms):** The "More information" trigger fades in from `opacity: 0` and `translateY(4px)`.

### On collapse:

Reverse the stagger. The "More information" trigger disappears first, then rows fade out in reverse order (row 2 first, then row 1, then row 0), then the card height collapses. The easiest implementation: add a `.collapsing` class that reverses the delay order using `calc((3 - var(--i)) * 60ms)`, remove the class after the collapse transition completes.

### Second expansion (More information to Show less):

The methodology content uses the same curtain unveil. Each `.method-para` gets a `--j` custom property (0, 1, 2, 3...) and reveals with the same `clip-path` stagger at `calc(var(--j) * 60ms)` delay.

Add `--j` to each method paragraph in the HTML:

```html
<p class="method-para" style="--j: 0">...</p>
<p class="method-para" style="--j: 1">...</p>
...
```

---

## 6. Gold glow and ambient treatment

### Phase name text shimmer

The `.card-phase-name` in Cormorant Garamond gets a slow gold shimmer via `background-clip: text`:

```css
.card-phase-name {
    background: linear-gradient(
        110deg,
        var(--gold) 0%,
        var(--gold) 40%,
        #E8C878 50%,
        var(--gold) 60%,
        var(--gold) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textShimmer 8s ease-in-out infinite;
}

@keyframes textShimmer {
    0%, 100% { background-position: 200% center; }
    50% { background-position: 0% center; }
}
```

Only apply in dark mode. In light mode, keep the standard `color: var(--navy)`.

### Active card ambient light

Behind the active card, add a radial gold glow via a `::before` pseudo-element on `.phase-card.is-active`:

```css
.phase-card.is-active::before {
    content: '';
    position: absolute;
    inset: -20px;
    border-radius: 24px;
    background: radial-gradient(
        ellipse at center,
        rgba(212, 168, 83, 0.08) 0%,
        transparent 70%
    );
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
}

.phase-card.is-active::before {
    opacity: 1;
}
```

### Row label gold treatment

The `.row-label` elements ("WHAT YOU DO", "HOW IT WORKS", "WHAT YOU GET") already use `color: var(--gold)`. Add a subtle text-shadow for warmth in dark mode:

```css
[data-theme="dark"] .row-label {
    text-shadow: 0 0 12px rgba(212, 168, 83, 0.2);
}
```

---

## 7. Premium easing curves

Replace all `ease` and `ease-out` timing functions throughout the page-specific CSS with:

- Primary state changes (expand/collapse, active/inactive transitions): `cubic-bezier(0.19, 1, 0.22, 1)`
- Hover effects and dimming: `cubic-bezier(0.4, 0, 0.2, 1)`
- Icon transformations and spring effects: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Organic breathing animations (icons, glow): `cubic-bezier(0.5, 0, 0.5, 1)`

Do not use `linear` or default `ease` for any visible transition.

---

## 8. Responsive and accessibility

All visual enhancements must work at 375px mobile width. At narrow viewports:
- Gold glow spread values reduce (60px ambient becomes 30px)
- Box-shadow layers thin out to two layers instead of four
- Connector line height reduces to 20px
- Card padding reduces proportionally

`prefers-reduced-motion` media query:
- Disable all continuous animations (icon breathing, connector shimmer, gold pulse, text shimmer)
- Retain static visual depth (gradients, borders, shadows, glow)
- Expand/collapse still works but transitions become instant (duration: 0s)
- The card system must be fully functional and visually appealing in a static state

---

## What you do NOT change

- **No prose changes.** Every word of card content, headline, context line, and declaration stays verbatim.
- **No nav or footer changes.**
- **No email capture changes** (beyond the existing styles).
- **No top bar tab changes** (structure stays; JS behaviour repurposed for scroll-and-expand).
- **No em dashes anywhere.**
- **No internal terminology.**
- **No references to harmonia-preview/.**
- **No modifications to shared.js, styles.css, or app.js.**
- **Keep the page title:** "Harmonia - Join Our Testing Pool"

---

## After building

Update `p2p-changelog.md` documenting:
- Layout changed from horizontal slider to vertical card stack
- Pagination dots removed
- Swipe navigation removed
- Gold connector lines added between cards
- Card surface depth upgraded (gradient backgrounds, gradient borders, layered shadows)
- Active/inactive card hierarchy added
- Living SVG icon animations added (blinking eye, breathing circles, spiralling helix)
- Staggered content reveal with clip-path curtain unveil
- Gold glow system added (ambient light, text shimmer, row label glow)
- Premium easing curves applied throughout
- prefers-reduced-motion support added

Commit:

```
git add p2p.html p2p-changelog.md
git commit -m "style: vertical card stack with premium visual treatment"
git push origin main
```

---

## Verification checklist

- [ ] All three cards visible vertically on page load, all collapsed
- [ ] Clicking a collapsed card expands it and scrolls it to center
- [ ] Expanded card has gold glow; siblings recede (opacity, scale, brightness, saturation)
- [ ] Clicking another card collapses the first and expands the new one
- [ ] Top bar tabs scroll to and expand the corresponding card
- [ ] "More information" opens second expansion with staggered curtain unveil
- [ ] "Show less" collapses second expansion with reversed stagger
- [ ] Eye icon blinks and scans continuously
- [ ] Overlapping circles breathe apart and together continuously
- [ ] DNA helix rungs create spiral wave animation
- [ ] Icon glow intensifies when card is expanded
- [ ] Gold connector lines visible between cards with travelling shimmer
- [ ] Content rows stagger in on expansion (not all at once)
- [ ] Phase name text has gold shimmer in dark mode
- [ ] Copy-link button in Card 3 still works (copies URL, changes label to "Copied!")
- [ ] Dark mode renders correctly on all elements
- [ ] Light mode renders correctly on all elements
- [ ] Mobile 375px: all enhancements render without overflow or bleed
- [ ] prefers-reduced-motion disables continuous animations but retains depth
- [ ] No em dashes anywhere in the file
- [ ] All prose matches previous build verbatim
- [ ] Nav and footer match other pages exactly
- [ ] Theme toggle works
- [ ] No references to harmonia-preview/
- [ ] Email capture styled correctly in both modes
- [ ] Declaration appears below email capture and inside Card 2 second expansion
