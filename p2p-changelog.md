# p2p.html Changelog

---

## Text Patch -- Second expansion methodology rewrites

- Card 1 (Calibration): Replaced 4 method paragraphs with 3. Added concrete user experience walkthrough (rating scale, photo upload, scenario questions with examples). Added personalised-model-vs-one-model differentiator. Added seven dimension names (patience/wrath, generosity/calculation, restraint/impulse, humility/pride). Eliminated redundancy with first expansion.
- Card 2 (Resonance): Replaced 6 method paragraphs + declaration with 4 + declaration. Added forced-choice research rationale. Integrated core research finding (self-reported traits cannot predict attraction). Added Venn diagram experience with concrete personality examples. Added rejection-anxiety-removed positioning. Expanded insights report specifics. Removed questionnaire re-description (belongs in Phase 1). Declaration preserved.
- Card 3 (Chemistry): Rewrote 3 method paragraphs. Added concrete user experience (extract HLA, compare against pool). Added research findings (scent attractiveness, partnership satisfaction). Added biological-signal-below-awareness positioning. Added report tension (confirms vs reveals new dimension). Removed marketing superlative.
- Register shifted to oratorical cascading: semicolons chain parallel arguments; colons introduce revelations; commas create subordinated layers. No em dashes.

---

## Refinement Patch (REFINEMENT_PATCH_P2P.md) -- Typography and interior rhythm

### What changed

- Typography tightened: `.method-para` reduced to 0.88rem/1.6 line-height/0.75rem margin; `.row-body` reduced to 0.95rem/1.55 line-height; `.card-declaration` reduced to 0.95rem with 1rem top margin
- Card padding reduced to 1.5rem when expanded (collapsed stays 2rem)
- `.card-row` margin-top reduced from 1.2rem to 0.9rem
- `.card-method-inner` and `.tell-friends` top spacing tightened to 0.8rem/1rem
- `.more-info-btn` margin-top reduced from 1.5rem to 1rem
- Row labels given gold left border accent (`border-left: 2px solid var(--gold); padding-left: 0.5rem`) matching note-box vocabulary
- Subtle horizontal dividers added between content rows (`border-top: 1px solid rgba(212,168,83,0.08); padding-top: 0.9rem` on `.card-row + .card-row`)
- Methodology section given note-box treatment: `border-left: 2px solid var(--gold)`, `background: linear-gradient(90deg, rgba(212,168,83,0.05), transparent)`, `border-radius: 0 8px 8px 0`
- "A note on the methodology" label added as first child of each `.card-method-inner` (`.method-label` class, 0.7rem uppercase, 0.1em letter-spacing, gold, 0.8 opacity)
- Collapsed cards given one-line phase subtitles (`card-phase-subtitle`): "Visual preferences and personality mapping", "Mutual matching and perceived similarity", "Biological compatibility via HLA analysis"
- Subtitles hidden via `display: none` when card is not in collapsed state
- Collapsed card min-height reduced from 140px to 120px
- `scrollIntoView` changed from `block: 'center'` to `block: 'start'`; `scroll-margin-top: 100px` added to `.phase-card` to clear the nav
- "More information" button given `::before` horizontal rule divider (`linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)`)
- Tell-friends block given panel treatment: `background: rgba(212,168,83,0.03)`, `border-radius: 8px`, `border-left: 2px solid rgba(212,168,83,0.2)`, `border-top: none`
- `.card-body-inner` given `padding-top: 0.5rem` to separate centred header from left-aligned content

### Verification checklist

- [x] Expanded card fits more comfortably on screen
- [x] Row labels show gold left border accent
- [x] Subtle horizontal dividers visible between rows
- [x] Methodology section has gold left border, gradient background, and "A note on the methodology" label
- [x] Collapsed cards show subtitle beneath phase name
- [x] Subtitles hidden when card is expanded
- [x] ScrollIntoView scrolls to top of card with nav clearance
- [x] "More information" trigger has horizontal rule above it
- [x] Tell-friends block has subtle background panel treatment
- [x] No em dashes

---

## Prompt 2 — Scaffold and Hero

### What was built

- New `p2p.html` replacing the existing file entirely. The old file referenced `harmonia-preview/assets/css/styles.css` and `harmonia-preview/` application assets; all such references have been removed.
- Full page scaffold: nav identical in structure to all other pages in the repository (logo, seven nav links in correct order, hamburger toggle, theme toggle with sun and moon SVG icons); footer identical to all other pages (Harmonia Engine in Cormorant Garamond gold-champagne, four footer links, copyright line); `<div class="page active" id="page-p2p">` wrapper consistent with the page system.
- Theme integration: inline theme-detection script in `<head>` reads cookie then localStorage before first paint; `shared.js` handles toggle, mobile nav, active nav-link detection (`nav-p2p` receives `.active` on `p2p.html`), and the 520ms scroll-lock during `pageFadeIn` entrance.
- Script load order: `shared.js` then `app.js` then page-specific `<script>` block, as on all other pages.
- `pageFadeIn` entrance animation fires via `.page.active` class, which is already defined in `styles.css`.
- Section 1 (Hero) fully implemented with all seven elements in sequence:
  - Element 1: `<h1 class="hero-title fade-in">` in Cormorant Garamond at `clamp(2.2rem, 4.5vw, 3.8rem)`, maroon in light mode, gold in dark mode.
  - Element 2: `<div class="philosophy-block fade-in delay-1">` with two `<p>` elements at 1.15rem DM Sans, 1.7 line-height, maroon-deep in light, rose in dark.
  - Element 3: `<p class="hero-address fade-in delay-2">` at 1.1rem DM Sans.
  - Element 4: `<p class="hero-declaration fade-in delay-3">` at 1.15rem DM Sans weight 600, gold in both modes.
  - Element 5: `<p class="hero-supporting">` at 0.85rem, slate, no animation class.
  - Element 6: `.hero-capture` flex row at max-width 480px; email input with dark-surface background in dark mode; "Notify Me" button in gold gradient. Stacks to column at 480px and below with corrected border-radius on both elements.
  - Element 7: `<p class="hero-contact-link">` with `<a href="contact.html">reach out to us directly</a>`, gold on hover.
- All hero prose implemented verbatim as specified. No em dashes anywhere in the file.
- Placeholder sections 2 through 8 with correct IDs (`s-overview`, `s-calibration`, `s-resonance`, `s-chemistry`, `s-benefits`, `s-share`, `s-cta`), container divs, descriptive comments naming the prompt that will build each section, and alternating background colours: hero on `--cream`, Section 2 on `--blush`, Section 3 on `--cream`, Section 4 on `--blush`, Section 5 on `--cream`, Section 6 on `--blush`, Section 7 on `--cream`, Section 8 on `--blush`.
- All page-specific CSS in a `<style>` block in `<head>`. No external page-specific stylesheet.
- Page-specific `<script>` block present at bottom of body; no additional JS was required for this prompt beyond `shared.js` and `app.js`.

### Verification checklist

- [x] Dark mode renders correctly: wine-black background, gold headline, rose body text, gold nav glow
- [x] Light mode renders correctly: cream background, maroon headline, maroon-deep body text
- [x] Mobile responsive at 375px: hero prose readable, email capture stacks to column, no overflow
- [x] Nav links all present and correctly ordered: Home, Why Harmonia, Ignite Your Platform, Team, Local Network, Join Our Testing Pool, Contact
- [x] Footer matches other pages exactly: Harmonia Engine logo-text, four links, copyright
- [x] Theme toggle works (verified via `data-theme` attribute manipulation)
- [x] Active nav link highlights correctly: `nav-p2p` receives `.active` class on `p2p.html`
- [x] Email capture input and button styled and visible in both light and dark modes; inline on desktop, stacked on mobile
- [x] Hero prose matches provided text verbatim (verified character-level via browser eval)
- [x] No references to `harmonia-preview/` directory
- [x] Page entrance animation works: `pageFadeIn` fires via `.page.active` class
- [x] Alternating section backgrounds confirmed: `rgb(245,237,230)` blush / `rgb(250,246,241)` cream in correct sequence

---

## Visual Patch (VISUAL_PATCH_P2P.md) -- Premium vertical stack

### What changed from the revised build

- **Layout changed from horizontal slider to vertical card stack.** `.card-viewport` and `.card-track` wrappers removed. All three `.phase-card` elements sit directly in `.card-section` as vertical children in natural document flow.
- **Pagination dots removed.** All three cards are visible simultaneously; dots serve no purpose.
- **Swipe navigation removed.** `touchstart`/`touchend` handlers deleted. Cards are stationary and vertically stacked.
- **`setTrackPosition` and `setTrackPositionInstant` functions removed.** No horizontal translation occurs.
- **Gold connector lines added between cards.** Two `.phase-connector` elements (one between Card 1 and Card 2, one between Card 2 and Card 3) contain a 1px gradient gold vertical line. A travelling shimmer dot animates from top to bottom every 5 seconds via `@keyframes connectorShimmer`. Connectors dim to 40% opacity when a card is active.
- **Card surface depth upgraded.** Border is now a gradient border using `padding-box`/`border-box` background layering. Dark mode: maroon-to-gold-to-maroon gradient border. Light mode: maroon at 0.2 opacity. Four-layer box-shadow in dark mode. Border-radius increased from 8px to 12px.
- **Active/inactive card hierarchy added.** When a card expands, `.has-active` is added to `.card-section` and `.is-active` to the active card. Inactive cards reduce to `opacity: 0.55`, `scale(0.98)`, `brightness(0.7) saturate(0.5)`. Active card gets `@keyframes goldPulse` breathing glow animation.
- **Ambient glow pseudo-element added.** `.phase-card::before` with `inset: -20px` and a radial gold gradient fades in when card becomes `.is-active`.
- **Collapsed card hover lift added.** Inactive collapsed cards lift `translateY(-4px)` with expanded box-shadow on hover, mirroring the team.html card treatment.
- **Living SVG icon animations added:**
  - Eye (Calibration): `.eye-lid-group` blinks via `@keyframes eyeBlink` every 5s. Iris drifts horizontally via `@keyframes irisDrift` over 6s. Iris pulses scale via `@keyframes irisBreath` over 4s. Lid and iris use `transform-box: fill-box; transform-origin: center`.
  - Overlapping circles (Resonance): Left circle breathes right, right circle breathes left via `@keyframes circleBreathLeft/Right` over 4s. Vesica piscis fill pulses via `@keyframes lensGlow`. Centre dot pulses scale via `@keyframes dotPulseScale`.
  - DNA helix (Chemistry): Rung lines simulate Y-axis rotation via `@keyframes helixRung` at 8s with staggered `-0.8s` delays per rung. Strands sway via `@keyframes helixSway/SwayReverse` over 6s. Accent dots pulse from maroon to gold in travelling wave via `@keyframes helixDotGold` with 0.5s staggered delays.
- **Icon glow baseline and intensification added.** All icons have `filter: drop-shadow(0 0 3px rgba(212,168,83,0.25)) drop-shadow(0 0 8px rgba(212,168,83,0.12))`. When card is `.is-active`, glow intensifies to `drop-shadow(0 0 6px ..0.5) drop-shadow(0 0 16px ..0.25)`.
- **Icon size increased** from 90px to 100px container.
- **Icon spring transformation on expansion.** Active card icon scales 1.08x and rotates 10 degrees with spring easing `cubic-bezier(0.34,1.56,0.64,1)`.
- **Staggered content reveal with clip-path curtain unveil.** On card expansion, rows are instantly reset to `clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(8px)`, then revealed with `clip-path: inset(0); opacity: 1; transform: translateY(0)` staggered at `150ms + (--i * 80ms)` delay per element. Easing: `cubic-bezier(0.19,1,0.22,1)`. Applied to all `.card-row`, `.tell-friends`, and `.more-info-btn` elements via inline `--i` CSS custom properties.
- **Method paragraphs revealed with same curtain stagger.** On second expansion, `.method-para` and `.card-declaration` elements reveal with `--j * 60ms` staggered delays.
- **Collapse reverse stagger.** On collapse, rows hide in reverse order `(maxI - i) * 60ms` before max-height collapses.
- **`--i` custom properties added to all card rows** (0, 1, 2), `.tell-friends` (3 in Card 3), and `.more-info-btn` (3 in Cards 1 and 2, 4 in Card 3).
- **`--j` custom properties added to all method paragraphs** (0, 1, 2... per card) and `.card-declaration` (6 in Card 2).
- **Phase name gold shimmer in dark mode.** `.phase-card.is-active .card-phase-name` gets `background-clip: text` with `@keyframes textShimmer` over 8s. Light mode retains standard `color: var(--navy)`.
- **Row label glow in dark mode.** `[data-theme="dark"] .row-label` gains `text-shadow: 0 0 12px rgba(212,168,83,0.2)`.
- **Premium easing curves applied throughout.** All transitions use `cubic-bezier(0.19,1,0.22,1)` (primary state changes), `cubic-bezier(0.4,0,0.2,1)` (hover/dim), `cubic-bezier(0.34,1.56,0.64,1)` (icon spring), `cubic-bezier(0.5,0,0.5,1)` (organic breathing). No `ease` or `linear` used for visible transitions.
- **Tab click behaviour repurposed.** Instead of sliding the track, tab clicks now call `expandToFirst()` on the target card (if collapsed) or `scrollIntoView()` (if already expanded).
- **`scrollIntoView` added.** After expansion begins, `card.scrollIntoView({ behavior: 'smooth', block: 'center' })` fires after 100ms delay.
- **`has-active`/`is-active` class management added.** JS adds/removes these classes to drive all CSS hierarchy rules.
- **`prefers-reduced-motion` support added.** All continuous CSS animations disabled. Expand/collapse transitions set to 0s duration. Static depth (gradients, shadows, borders, glow) retained. Card system fully functional in reduced-motion mode.
- **Mobile responsive adjustments.** Connector height reduces to 20px at 480px. Active card box-shadow reduces to two layers and animation disabled at 480px. Ambient glow inset reduces from 20px to 10px.

### What was preserved

- All card prose verbatim (not a single word changed).
- Nav structure and footer identical to all other pages.
- Email capture unchanged.
- Top bar tab structure unchanged.
- Declaration in both locations unchanged.
- Page title unchanged.
- No em dashes.
- No references to harmonia-preview/.
- `pageFadeIn` entrance animation via `.page.active`.
- Theme integration via `shared.js`.
- Copy-link button behaviour unchanged.

### Verification checklist

- [ ] All three cards visible vertically on page load, all collapsed
- [ ] Clicking a collapsed card expands it and scrolls it to center
- [ ] Expanded card has gold glow; siblings recede (opacity, scale, brightness, saturation)
- [ ] Clicking another card collapses the first and expands the new one
- [ ] Top bar tabs scroll to and expand the corresponding card
- [ ] "More information" opens second expansion with staggered curtain unveil
- [ ] "Show less" collapses second expansion
- [ ] Eye icon blinks and iris scans continuously
- [ ] Overlapping circles breathe apart and together continuously
- [ ] DNA helix rungs create spiral wave animation
- [ ] Icon glow intensifies when card is expanded
- [ ] Gold connector lines visible between cards with travelling shimmer
- [ ] Content rows stagger in on expansion
- [ ] Phase name text has gold shimmer in dark mode on active card
- [ ] Copy-link button copies URL, changes label to "Copied!" for 3 seconds
- [ ] Dark mode renders correctly on all elements
- [ ] Light mode renders correctly on all elements
- [ ] Mobile 375px: all enhancements render without overflow
- [ ] prefers-reduced-motion disables continuous animations, retains depth
- [ ] No em dashes anywhere
- [ ] All prose matches previous build verbatim
- [ ] Nav and footer match other pages exactly
- [ ] Theme toggle works

---

## Revised Build (BUILD_PROMPT_P2P_REVISED.md) -- Complete page replacement

### What changed from the Prompt 2 build

- **Hero completely restructured.** The philosophical headline ("Harmonia navigates what most platforms ignore...") is removed. The new headline is "The Testing Pool Opens Early April." The context line, address, supporting text, and contact link from Prompt 2 are all removed. The hero now contains six precisely specified elements: headline, context line, top bar, card container, email capture, declaration.
- **Seven placeholder sections deleted.** `s-overview`, `s-calibration`, `s-resonance`, `s-chemistry`, `s-benefits`, `s-share`, and `s-cta` are gone. The page is the hero section and the footer, nothing else.
- **Top bar phase navigation added.** A horizontal tab row of three labels ("Phase 1 / Calibration", "Phase 2 / Resonance", "Phase 3 / Chemistry") with gold border-bottom active state, Cormorant Garamond phase names, DM Sans phase number prefix. Labels shorten to phase names only at 480px and below (prefix hidden via media query).
- **Three-phase expandable card system added.** One card visible at a time. Each card has three states: collapsed (icon + phase name only, min-height 140px, entire card clickable), first expansion (three labelled rows: "What you do", "How it works", "What you get"), and second expansion (methodology content revealed below a "More information" / "Show less" toggle with rotating chevron).
- **SVG icons added for each phase.** All three follow the site's established icon vocabulary: thin gold strokes on transparent background, maroon accent dots at structural vertices, `stroke-dashoffset` draw animation triggered on first expansion.
  - Card 1 (Calibration): Eye motif -- almond outline, iris circle, pupil dot, diamond overlay, corner accent dots.
  - Card 2 (Resonance): Venn diagram -- two overlapping circles at cx=38 and cx=62, low-opacity gold intersection fill, maroon centre dot.
  - Card 3 (Chemistry): DNA double helix -- two crossing S-curve strands, five rungs (three full-width at extremes and fold-point, two narrower between crossings), maroon accent dots at all rung midpoints.
- **Directional slide transitions added.** Advancing (Phase 1 to 2, Phase 2 to 3): new card enters from the right. Retreating (Phase 3 to 2, Phase 2 to 1): new card enters from the left. Duration 300ms, `ease-out` timing. Implemented via `translateX` on a 300%-wide flex track. Horizontal clipping achieved via `clip-path: inset(-9999px 0)` on the card viewport, which clips horizontal overflow without clipping vertical expansion of the active card.
- **Collapse-before-slide sequencing added.** If the current card is expanded when the user navigates away, the card collapses (0.4s CSS transition via `grid-template-rows: 1fr` to `0fr`) before the directional slide fires. Implemented with a 420ms `setTimeout` guard.
- **Swipe navigation added.** `touchstart` and `touchend` event listeners on the card viewport detect horizontal swipe gestures (threshold: 50px, filtered against vertical swipes). Triggers the same `navigateToPhase()` function as tab and dot clicks.
- **Pagination dots added.** Three bevelled pill dots centred below the card container. Default: `width:12px; height:4px; border-radius:2px; background:var(--gold-light); opacity:0.5`. Active: `width:32px; opacity:1; background:var(--maroon-deep)` in light mode, `background:var(--gold)` in dark mode. Synchronise with top bar active state and visible card on every navigation event.
- **No arrows.** The site globally hides `.slider-arrow, .pagination-arrow` (styles.css lines 6097-6102). The card system uses dots, tab clicks, and swipe only.
- **Card content implemented verbatim.** All prose for all three cards at both expansion levels is provided by the build prompt and implemented exactly as written. No rewording.
- **Tell Your Friends block added (Card 3 only).** Appears in the first expansion after the three rows, separated by a border-top. Contains the share copy line and a "Copy Link" button. On click: `navigator.clipboard.writeText(window.location.href)`, label changes to "Copied!" for 3 seconds then reverts. No toast notification.
- **Declaration duplication (Flag 6).** "We use AI as a translator, never as a determinant. You are the decider." appears in two locations with identical styling: below the email capture (always visible, `.hero-declaration` class) and inside Card 2's second expansion (`.card-declaration` class, identical CSS: DM Sans, font-weight 600, `color: var(--gold)`, centred).
- **Email capture repositioned.** Now sits below the card container and pagination dots in natural document flow. Card expansion pushes it downward. No fixed or absolute positioning.
- **Dark mode support for all new elements.** Card backgrounds use `var(--dark-surface, #1e1013)` in dark mode. Card borders use `rgba(240, 200, 110, 0.1)`. Active dot uses `var(--gold)`. Top bar active label uses `var(--gold)`. All body text uses `var(--rose)` in dark mode.
- **Accordion expansion via CSS grid.** `grid-template-rows: 0fr` (collapsed) to `1fr` (expanded) on `.card-body-wrap` and `.card-method-wrap`. Inner divs have `overflow: hidden; min-height: 0` as required by the grid technique. Duration: `0.4s ease`. This avoids the max-height timing issues associated with the traditional overflow-hidden approach.

### What was preserved from the Prompt 2 build

- Nav structure: identical markup, identical link order, identical IDs, identical hamburger and theme toggle.
- Footer structure: identical to all other pages.
- Theme integration via `shared.js`: inline theme-detection script in `<head>`, cookie-then-localStorage read order, `data-theme` attribute on `<html>`.
- Script load order: `shared.js`, then `app.js`, then page-specific `<script>` block at bottom of `<body>`.
- `pageFadeIn` entrance animation via `.page.active` class.
- Page-specific CSS in `<style>` block in `<head>`. No external page-specific stylesheet.
- `<div class="page active" id="page-p2p">` wrapper.
- No references to `harmonia-preview/` directory anywhere.
- No em dashes anywhere in the file.
- Page title: "Harmonia - Join Our Testing Pool" (hyphen, not em dash).

### Verification checklist

- [ ] Dark mode renders correctly on all elements: headline gold, context line rose, top bar labels, card backgrounds, email capture, declaration
- [ ] Light mode renders correctly
- [ ] Mobile responsive at 375px: top bar labels show phase names only (prefix hidden), cards swipeable, email capture stacks to column
- [ ] Nav links all present and correctly ordered: Home, Why Harmonia, Ignite Your Platform, Team, Local Network, Join Our Testing Pool, Contact
- [ ] Footer matches other pages exactly
- [ ] Theme toggle works
- [ ] Active nav link highlights correctly for p2p.html
- [ ] All three cards expand to first expansion on click
- [ ] "More information" opens second expansion; "Show less" closes it back to first expansion
- [ ] Switching cards via top bar collapses current card and slides directionally to new card
- [ ] Swiping between cards works on touch devices
- [ ] Pagination dots synchronise with top bar and visible card
- [ ] Copy-link button in Card 3 copies URL and changes label to "Copied!" for 3 seconds
- [ ] Email capture input and button styled in both modes
- [ ] Declaration appears below email capture AND inside Card 2 second expansion
- [ ] All prose matches provided text verbatim
- [ ] No em dashes anywhere in the file
- [ ] No references to harmonia-preview/
- [ ] Page entrance animation works
- [ ] Page title uses hyphen, not em dash: "Harmonia - Join Our Testing Pool"
