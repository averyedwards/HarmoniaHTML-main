# Build Prompt: Revised p2p.html

## What this document is

This is the build prompt for the revised `p2p.html`. It replaces the current file entirely. The previous prompts (`PROMPT_1_DESIGN_RESEARCH.md`, `PROMPT_2_SCAFFOLD_AND_HERO.md`, `AMENDMENT_PROMPT.md`) and the design brief (`p2p-design-brief.md`) are superseded. Do not read them. Do not reference them. This document and the two companion files (`p2p-architecture-review.md` and `p2p-flag-resolutions.md`) are the sole sources of truth.

---

## Before you write any code

### Step 1: Read the existing site files

Read each of the following files in full. These are your design system references. Every colour, every typographic decision, every interaction pattern on the new page must feel like it belongs to this site.

- `why-harmonia.html`: your primary reference. Study the stat cards, the philosophy-block, the horizontal science slider with its four animated SVG icon cards, the pagination dots (bevelled pill style, no arrows), the fade-in scroll animation sequencing, and the overall section rhythm.
- `partnerships.html`: study the feature boxes that open modals on click, the "Tap for details" hint text, and the tier-tab navigation system. The expandable card mechanic on the new page draws from this interaction vocabulary.
- `assets/css/styles.css`: all CSS variables, typography, component styles, responsive breakpoints. Pay particular attention to: the `.btn-primary` gold gradient treatment (lines 650-654), the `.pagination-dot` bevelled pill style (lines 6104-6114), the global arrow hide rule (lines 6097-6102), and the `.philosophy-block` component (lines 1145-1163).
- `assets/js/shared.js`: theme toggle, mobile nav, active nav-link detection (`nav-p2p` for this page), scroll-lock during `pageFadeIn`. Your page must integrate with all of these without modification.
- `assets/js/app.js`: the `initWhySlider()` function (lines 51-145) for slider navigation via scroll-snap, pagination dots, and auto-rotation. The `renderPartnershipsBoxes()` and `openPartnershipsModal()` functions (lines 589-626) for the click-to-reveal pattern. Understand both interaction systems; the card system on the new page is a hybrid of the two.
- `index.html`: verify the exact nav link order and footer structure.

### Step 2: Read companion files

Read `p2p-architecture-review.md` and `p2p-flag-resolutions.md` in the repository root. These document the architectural decisions and resolve every ambiguity. They are binding.

### Step 3: Search Google using Chrome

Conduct three searches. For each one, extract the strongest interaction patterns and adapt them to the Harmonia design system. Do not copy code from any source.

1. **"dating app swipe card UI transition CSS"**: you are looking for how card-to-card transitions feel on touch devices, what easing and duration create the sense of physical cards sliding, and how the transition direction communicates forward versus backward movement.

2. **"accordion expand collapse two levels nested CSS JS"**: you are looking for how two-tier progressive disclosure is handled, how the second expansion nests inside the first without layout breakage, how "show less" triggers work, and what height transition approaches produce smooth expansion without jarring reflows.

3. **"step indicator navigation bar active state clickable CSS"**: you are looking for how horizontal phase/step indicators communicate the current position, what visual treatments mark the active step (underline, background tint, border, colour change), and how the indicator synchronises with content below it.

---

## Page structure

The page has two structural regions: a hero section containing everything, and the footer. Nothing else.

### Navigation

Identical to every other page. Same logo (`assets/images/harmonia-logo.png`), same seven nav links in the same order (Home, Why Harmonia, Ignite Your Platform, Team, Local Network, Join Our Testing Pool, Contact), same hamburger toggle, same theme toggle with sun and moon SVGs. The `p2p.html` link carries `id="nav-p2p"`.

### Hero section

The hero contains the following elements in sequence. All prose is provided verbatim. Implement it exactly as written. Do not reword, do not edit, do not add to, do not remove from. Every comma, every colon, every semicolon is deliberate.

---

#### Element 1: Headline

Tag: `<h1>` in Cormorant Garamond.
Size: `clamp(2.2rem, 4.5vw, 3.8rem)`.
Colour: `var(--maroon)` in light mode, `var(--gold)` in dark mode.
Animation: `fade-in` class.
Centred, with `margin-bottom: 1.5rem`.

Text (verbatim):

```
The Testing Pool Opens Early April
```

---

#### Element 2: Context line

Tag: `<p>` in DM Sans.
Size: `1.05rem`, `line-height: 1.7`.
Colour: `var(--maroon-deep)` in light mode, `var(--rose)` in dark mode.
Max-width: `680px`, centred.
Animation: `fade-in delay-1` class.
`margin-bottom: 2rem`.

Text (verbatim):

```
Harmonia is a compatibility engine, and by joining our testing pool you participate in the highest level of technological validation there is: real people, real decisions, real proof. Your data is never monetised. This is research.
```

---

#### Element 3: Top bar (phase navigation)

A horizontal row of three labels, centred, `max-width: 600px`, `margin: 0 auto 1.5rem`.
Animation: `fade-in delay-2` class on the container.

Each label contains:
- A small phase indicator ("Phase 1", "Phase 2", "Phase 3") in DM Sans at `0.7rem`, uppercase, `letter-spacing: 0.08em`, `var(--slate)`.
- The phase name ("Calibration", "Resonance", "Chemistry") in Cormorant Garamond at `1.1rem`, `var(--navy)` in light mode, `var(--rose)` in dark mode.

The active label carries a gold accent: `border-bottom: 2px solid var(--gold)` and the phase name colour shifts to `var(--maroon)` in light mode, `var(--gold)` in dark mode. Transition on colour and border: `0.3s ease`.

On page load, "Phase 1: Calibration" is active.

Clicking a label: switches the card below via directional slide transition (see card container), updates the active state on the top bar, and updates the pagination dots.

At 480px and below:
- Labels shorten: the "Phase 1/2/3:" prefix is hidden via a CSS class or media query. Only "Calibration", "Resonance", "Chemistry" are visible.
- Font size on phase names reduces to `0.95rem`.
- Gap between labels reduces.

---

#### Element 4: Card container

A container holding one card at a time, centred, `max-width: 700px`, `margin: 0 auto`.

**Navigation between cards:**
- Clicking a top bar label (see above)
- Swiping left/right (touch gesture; implement via CSS scroll-snap on the card track, or via JS touch event handling, whichever produces smoother results after your Chrome research)
- Clicking pagination dots

**Pagination dots:**
Three dots centred below the card container, `margin-top: 1rem`. Follow the existing bevelled pill style from `styles.css`:
- Default: `width: 12px; height: 4px; border-radius: 2px; background: var(--gold-light); opacity: 0.5`
- Active: `width: 32px; opacity: 1; background: var(--maroon-deep)` in light mode, `background: var(--gold)` in dark mode
- Transition: `all 0.3s ease`
- Dots synchronise with the top bar active state and the visible card.

**Directional slide transition:**
Advancing (Phase 1 to 2, or 2 to 3): new card enters from the right, current card exits to the left.
Retreating (Phase 3 to 2, or 2 to 1): new card enters from the left, current card exits to the right.
Duration: `300ms`, timing: `ease-out`.
Direction determined by comparing target phase number to current phase number. For swipe, direction is inherent in the gesture.

Before the slide, the current card collapses to its collapsed state (if expanded). The collapse animation completes before the slide begins.

**No arrows.** The site hides all arrows globally (`styles.css` lines 6097-6102). Do not add arrows.

---

#### Card states

Each card has three states: collapsed, first expansion, second expansion.

**Collapsed (default on page load):**

The card shows only the animated SVG phase icon (centred, approximately 80-100px) and the phase name in Cormorant Garamond at `1.3rem` below the icon.

Minimum height: `140px`.

The entire card is clickable; clicking it triggers the first expansion.

Card background: `var(--card-bg)` with `border: 1px solid rgba(212, 168, 83, 0.15)`, `border-radius: 8px`, `padding: 2rem`. In dark mode: `background: var(--dark-surface)`, `border-color: rgba(240, 200, 110, 0.1)`.

**First expansion (click the collapsed card):**

The card grows smoothly (CSS transition on `max-height` or `height`, duration `0.4s ease`). The three content rows appear beneath the icon and phase name:

Each row has:
- A label in DM Sans at `0.8rem`, uppercase, `letter-spacing: 0.06em`, `color: var(--gold)`, `margin-bottom: 0.3rem`
- Body text in DM Sans at `1rem`, `line-height: 1.65`, `color: var(--navy)` in light mode, `var(--rose)` in dark mode

Row labels (verbatim): "What you do", "How it works", "What you get"

Rows are separated by `margin-top: 1.2rem` between each.

For Card 3 only: after the three rows, a "Tell Your Friends" block appears with a brief line of text and a copy-link button. The copy-link button: `background: transparent`, `border: 1px solid var(--gold)`, `color: var(--gold)`, `border-radius: 4px`, `padding: 0.5rem 1.2rem`, `font-size: 0.85rem`, `cursor: pointer`. On click: copies `window.location.href` to clipboard, button label changes from "Copy Link" to "Copied!" with `color: var(--gold)` for 3 seconds, then reverts. No toast notification.

At the bottom of the first expansion: a "More information" trigger.
- Text: "More information" in DM Sans at `0.85rem`, `color: var(--gold)`, with a small downward chevron SVG beside it (inline, `0.6rem` wide, rotating 180 degrees when second expansion is open).
- `cursor: pointer`, `margin-top: 1.5rem`, centred.
- On hover: `opacity: 0.8`.

**Second expansion (click "More information"):**

The card grows further. Methodology content appears below the "More information" trigger. The chevron rotates 180 degrees to point upward. The trigger text changes to "Show less".

Clicking "Show less" collapses the second expansion back to the first expansion state. The card shrinks, the chevron rotates back, the text reverts to "More information". The three content rows remain visible.

Height transition: same `0.4s ease` as the first expansion.

**Interaction rules:**
- Only one card can be in a non-collapsed state at a time.
- Switching phase (via top bar, swipe, or dots) collapses the current card fully to collapsed state, then directional slide to the new card in collapsed state.
- Within a single card, the user can toggle between first expansion and second expansion via the "More information" / "Show less" trigger.
- Clicking the card when it is in first or second expansion does NOT collapse it. Only switching to a different card or swiping away collapses.

---

#### Card 1: Phase 1 Calibration

**SVG Icon: Eye motif**

A simplified calibration/eye icon following the existing site icon vocabulary: thin gold strokes on transparent background, maroon accent dots, geometric assembly. The icon draws itself on first expansion via `stroke-dashoffset` animation. Refer to the visual eye icon in `why-harmonia.html` (lines 103-114) for the vocabulary: outer circle, lid paths, pupil line, diamond overlay. Adapt and simplify for a card-scale icon at 80-100px.

**First expansion text (verbatim):**

What you do:
```
Complete a six-question personality assessment. Upload your photos. Rate faces on a scale of 1 to 5.
```

How it works:
```
A personalised neural network is shown the faces you rate. It first learns what most people find attractive: the consensus, the population-level baseline of aesthetic perception. Then it freezes that understanding and turns its attention to you specifically, learning how your preferences differ from everyone else's. Every rating teaches it something about your eye.
```

What you get:
```
A personalised map of the looks you are specifically drawn to: the features, the patterns, the qualities your eye returns to. Your Seven Deadly Sins personality profile: seven dimensions, each running from virtue to vice, capturing how you actually behave rather than how you describe yourself.
```

**Second expansion text (verbatim):**

```
The visual system operates in two stages. In the first stage, the model learns what most people find attractive. It studies how large numbers of people rate the same faces and identifies the patterns that emerge: the features and proportions and qualities that most people agree on. This is the foundation, an understanding of aesthetic commonality.

In the second stage, the model freezes that baseline understanding and turns its attention to you. It takes your individual ratings and learns how your preferences deviate from the consensus. Where do you diverge from what most people find attractive? What patterns are unique to your eye? The model builds a personalised layer on top of the frozen baseline that captures your aesthetic personality: the individual variation that makes your sense of attraction yours and no one else's.

Every rating you give teaches the model something. A 1 teaches it what you reject. A 5 teaches it what captivates you. A 3, the uncertain middle, teaches it where your preferences are ambiguous, and the model learns to navigate that ambiguity. No other platform does this. Every other system runs one model for all users, treating attraction as a population-level phenomenon with no room for individual taste. This system treats every user as a unique case.

The AI does not just read your questionnaire answers; it detects inconsistencies between what you say and how you say it. If you claim you never get angry but your language reveals frustration, impatience, or confrontation, we notice. If you rush through the questionnaire giving extreme answers to every question, the system detects that pattern and flags it as a response style rather than a genuine personality signal. If you give disengaged, neutral answers to everything, we detect that too. Your profile reflects who you actually are, not who you want to be.
```

---

#### Card 2: Phase 2 Resonance

**SVG Icon: Overlapping circles (Venn diagram) motif**

Two circles converging, thin gold strokes, a maroon dot at the overlap centre, a gold fill at low opacity in the intersection zone. The circles draw themselves and converge on first expansion via `stroke-dashoffset` and `cx` or `transform` animation. Refer to the Resonance icon concept in the design brief's Section 4 for the vocabulary.

**First expansion text (verbatim):**

What you do:
```
From Phase 1, the system filters for people who are attracted to you and you to them. From this filtered batch, you are shown two people at a time. You choose one. Their personality is attached to their card: a Venn diagram showing what you share, how your Seven Deadly Sins profiles overlap. If you choose the same person three times across different pairings, that is a confirmed match.
```

How it works:
```
Perceived similarity. The system finds what you and each person have in common and surfaces it. You see the overlap, never the differences. Personality and visual together shape who appears in front of you and who you choose.
```

What you get:
```
A match where the attraction runs both ways: someone drawn to you, and you to them, with shared personality to make it last. A personalised insights report showing how visual attraction versus personality shaped your decisions, what you prioritised, and what patterns emerged in your choices.
```

**Second expansion text (verbatim):**

```
The personality assessment consists of six open-ended scenario questions drawn from real life: how you handle a group dinner bill, what you do with a free weekend, how you respond to critical feedback. These are not multiple choice. You write your natural response in your own words. The AI reads your language and maps you across seven personality dimensions.

We chose scenario-based questions because research demonstrates that a significant proportion of people distort traditional self-report questionnaires. When you are asked "are you generous?" you answer the way you want to be seen. When you are asked what you do when the dinner bill arrives and everyone contributed differently, your answer reveals how you actually behave.

The system surfaces perceived similarity: the degree to which you and another person feel alike. Research has consistently shown that feeling similar to someone predicts attraction far more powerfully than actually being similar. Two people who share very few traits on paper can feel a profound sense of commonality when the right dimensions are highlighted. The system finds what you share and presents it; it never penalises where you differ.

The three-selection confirmation ensures consistency over impulse. It is not enough to choose someone once. You must prefer them repeatedly, across different pairings, against different alternatives. Each time you select the same person, a heart is confirmed. Three hearts across three separate pairings: that is a match.

In Phase 1, you built your visual preference model and your personality profile as separate signals. In Phase 2, those two signals combine for the first time. The filtered batch means everyone you see already finds you attractive. The question Phase 2 answers is whether personality changes who you choose from a pool where you already find everyone visually compelling.

The insights report is honest. It will not pander to you. If you consistently chose based on appearance and ignored personality signals, the report will tell you that. If you gravitated toward a specific personality type across every pairing, it will surface that pattern. No other platform offers this level of self-awareness about your own decision-making.

We use AI as a translator, never as a determinant. You are the decider.
```

---

#### Card 3: Phase 3 Chemistry

**SVG Icon: DNA helix motif**

A double helix in gold strokes with maroon accent dots at the rung midpoints. The helix draws itself via `stroke-dashoffset` on first expansion. Refer to the genetic card animation in `why-harmonia.html` for the vocabulary (helix curves, rung connectors, glow pulse).

**First expansion text (verbatim):**

What you do:
```
For London users: receive a free DNA testing kit. Swab, send it back. For everyone else: if you already have DNA results from a provider like 23andMe or AncestryDNA, you can send them to us.
```

How it works:
```
We process your DNA and determine HLA compatibility: the degree to which your immune system profiles complement each other, a signal linked to scent, attraction, and biological chemistry.
```

What you get:
```
The full three-signal assessment: visual attraction, personality, and biological compatibility combined. An elaborated version of your Phase 1 and Phase 2 results showing how your insights have evolved across all three phases and what the complete picture reveals that the earlier reports could not.
```

Tell your friends (verbatim):
```
Phase 3 requires critical mass. The genetic signal cannot operate in isolation; it requires a pool dense enough to produce meaningful matches. If you want Phase 3 in your region, the most powerful thing you can do is share this page with the people you know.
```

(Followed by the copy-link button.)

**Second expansion text (verbatim):**

```
HLA genes, the Human Leukocyte Antigen complex, are the part of your immune system responsible for identifying foreign molecules. Research spanning decades has demonstrated that people tend to be attracted to partners with different HLA profiles, a preference linked to scent perception and unconscious biological signals. Partners with complementary HLA types tend to report higher mutual attraction. We chose to implement this because it adds a dimension to compatibility that no questionnaire and no photograph can capture: the chemistry that exists before a word is spoken.

No other platform has deployed genetics commercially into how people meet. This is the first time the biological signal has been combined with visual and personality data in a system designed to surface compatibility, and by participating you contribute to proving whether it works.

Across the three phases, your profile has built itself in layers. Phase 1 captured your visual preferences and your personality. Phase 2 tested those signals against real people who found you attractive and measured how your decisions were shaped by what you saw and what you felt. Phase 3 adds the final dimension: the chemistry written into your biology, the invisible signal that operates below the level of conscious awareness. The report you receive at the end of Phase 3 is the most complete picture of compatibility that has ever been assembled for a single person. It shows not just who you are drawn to, but why, across every dimension that the research says matters.
```

---

#### Element 5: Email capture

Below the card container and pagination dots.
`max-width: 480px`, centred, `margin: 2rem auto 0`.

A flex row containing:
- `<input type="email">` with `placeholder="your@email.com"`, `flex: 1`, `background: var(--card-bg)`, `border: 1px solid rgba(212, 168, 83, 0.3)`, `border-radius: 4px 0 0 4px`, `padding: 0.85rem 1.2rem`, `font-size: 1rem`, `font-family: 'DM Sans', sans-serif`, `color: var(--navy)`.
- In dark mode: `background: var(--dark-surface)`, `color: var(--navy)` (which resolves to light cream in dark mode via CSS variable override), `border-color: rgba(240, 200, 110, 0.2)`.
- `<button class="btn-notify">` with text "Notify Me", `border-radius: 0 4px 4px 0`, `padding: 0.85rem 1.8rem`, `font-size: 1rem`, `font-weight: 600`, gold gradient matching `.btn-primary` (`linear-gradient(135deg, var(--gold), var(--gold-champagne))`), `color: var(--maroon-deep)`, `white-space: nowrap`, `cursor: pointer`.

At 480px and below:
- Flex direction changes to column.
- Input: `border-radius: 4px`, full width, bottom border restored.
- Button: `border-radius: 4px`, full width, `margin-top: 0.5rem`.

Non-functional. No form submission, no JavaScript handling.

Animation: `fade-in delay-3` class on the container.

---

#### Element 6: Declaration

Below the email capture.
`margin-top: 1.5rem`, centred.

Tag: `<p>` with class `hero-declaration`.
Font: DM Sans at `1.05rem`, `font-weight: 600`, `line-height: 1.6`.
Colour: `var(--gold)` in both light and dark mode.
Animation: `fade-in delay-3` class.

Text (verbatim):

```
We use AI as a translator, never as a determinant. You are the decider.
```

---

### Footer

Identical to every other page. Inside `<div class="page active" id="page-p2p">`. "Harmonia Engine" in Cormorant Garamond gold-champagne, four footer links (Why Harmonia, Ignite Your Platform, Team, Contact), copyright "© 2026 Harmonia Engine".

---

## Section backgrounds

The hero section: `background: var(--cream)` with the same subtle radial gradient float used on the current p2p.html hero:
```css
radial-gradient(ellipse at 30% 30%, rgba(212, 168, 83, 0.06) 0%, transparent 50%),
radial-gradient(ellipse at 70% 70%, rgba(139, 58, 58, 0.05) 0%, transparent 50%)
```
With the `@keyframes float` animation (already defined in `styles.css` line 481).

Dark mode variant:
```css
radial-gradient(ellipse at 30% 30%, rgba(240, 200, 110, 0.08) 0%, transparent 50%),
radial-gradient(ellipse at 70% 70%, rgba(139, 58, 58, 0.08) 0%, transparent 50%)
```

No alternating section backgrounds. There is only one section.

---

## Resolved flags (from p2p-flag-resolutions.md)

These are already documented in the companion file. The key decisions for quick reference:

1. **No arrows.** Pagination dots only, bevelled pill style.
2. **Labels shorten at 480px.** "Phase 1:" prefix hidden; only phase names visible.
3. **Card minimum height: 140px** in collapsed state.
4. **Directional slide transitions.** 300ms ease-out. Right-to-left advancing, left-to-right retreating.
5. **Copy-link feedback via button label change.** "Copy Link" becomes "Copied!" for 3 seconds.
6. **Declaration duplication intentional.** Styled identically in both locations.
7. **Email capture uses natural document flow.** Card expansion pushes it down.

---

## Technical requirements

1. All page-specific CSS in a `<style>` block in `<head>`. All page-specific JS in a `<script>` block at the bottom after `shared.js` and `app.js`.
2. No existing file in the repository is modified. Not `shared.js`, not `styles.css`, not `app.js`, not any HTML file.
3. No files from `harmonia-preview/` are referenced anywhere.
4. No em dashes anywhere: not in HTML, not in CSS, not in JS, not in comments.
5. No startup jargon: no "game-changing," no "revolutionary," no "cutting-edge," no "seamless."
6. No internal terminology: no WtM, no Elo, no Gemini, no PIIP, no MetaFBP, no DeepFace, no calibration databases.
7. Page title: `<title>Harmonia - Join Our Testing Pool</title>` (hyphen, not em dash, matching all other pages).
8. Dark mode must work correctly on all elements (cards, top bar, email capture, declaration, icons).
9. Mobile responsive at 375px: top bar labels compressed, cards swipeable, email capture stacked.
10. The page uses the same `pageFadeIn` entrance animation as every other page.
11. Load order in `<head>`: inline theme-detection script, `fonts.css`, `styles.css`, page-specific `<style>`.
12. Load order at bottom of `<body>`: `shared.js`, `app.js`, page-specific `<script>`.

---

## What you do NOT do

- You do not write any prose. Every word of the card text, the headline, the context line, and the declaration is provided above. Implement verbatim.
- You do not read or reference `PROMPT_1_DESIGN_RESEARCH.md`, `PROMPT_2_SCAFFOLD_AND_HERO.md`, `AMENDMENT_PROMPT.md`, or `p2p-design-brief.md`.
- You do not reference any files in `harmonia-preview/`.
- You do not add arrows to the card navigation.
- You do not use em dashes anywhere.
- You do not modify any existing file in the repository.
- You do not add sections below the hero. The page is the hero and the footer. Nothing else.

---

## After building

### Changelog

Create an updated `p2p-changelog.md` in the repository root. The changelog documents:

**What changed from the previous Prompt 2 build:**
- Hero completely restructured: philosophical headline removed, three-phase expandable card system added
- Seven placeholder sections (`s-overview`, `s-calibration`, `s-resonance`, `s-chemistry`, `s-benefits`, `s-share`, `s-cta`) deleted
- Top bar phase navigation added
- Two-tier card expansion system with "More information" / "Show less" toggle
- Swipe navigation and pagination dots added
- Copy-link share mechanic added inside Card 3
- Email capture repositioned below card container
- Declaration repositioned below email capture (also appears inside Card 2 second expansion)

**What was preserved from the previous build:**
- Nav structure (identical)
- Footer structure (identical)
- Theme integration via shared.js
- Script load order
- `pageFadeIn` entrance animation
- Page-specific CSS in style block, page-specific JS in script block

### Verification checklist

Confirm each of the following before committing:

- [ ] Dark mode renders correctly on all elements: headline gold, context line rose, top bar labels, card backgrounds, email capture, declaration
- [ ] Light mode renders correctly
- [ ] Mobile responsive at 375px: top bar labels show only phase names, cards swipeable, email capture stacks to column
- [ ] Nav links all present and correctly ordered
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
- [ ] No references to previous prompt files
- [ ] Page entrance animation works
- [ ] Page title uses hyphen, not em dash: "Harmonia - Join Our Testing Pool"

### Commit and push

```
git add p2p.html p2p-changelog.md
git commit -m "feat: p2p.html revised hero with expandable phase cards"
git push origin main
```
