# p2p.html Changelog

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
