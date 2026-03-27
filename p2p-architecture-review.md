# p2p-architecture-review.md

Comprehension document for the revised p2p.html architecture. Written to confirm understanding of every component and surface any ambiguity before the build prompt arrives. No code is written here. No HTML, no CSS, no JavaScript. This document is a restatement, not a copy.

---

## What is being replaced

The current `p2p.html` is a multi-section page: a hero with philosophical text, seven empty placeholder sections below it (`s-overview`, `s-calibration`, `s-resonance`, `s-chemistry`, `s-benefits`, `s-share`, `s-cta`), and a footer. All of that is being demolished. The new page has two structural regions and nothing else: a single hero section that contains everything, and the footer. The previous prompt architecture, the design brief, and the amendment are superseded by this document.

---

## 1. Navigation

The navigation bar is structurally identical to every other page in the repository. The logo in the top-left links to `index.html`. The seven nav links appear in this exact order: Home, Why Harmonia, Ignite Your Platform, Team, Local Network, Join Our Testing Pool, Contact. The hamburger button triggers `toggleMobileNav()` from `shared.js`; the theme toggle triggers `toggleTheme()`. The `id="nav-p2p"` attribute on the Join Our Testing Pool link allows `shared.js` to apply the `.active` class automatically by matching the current filename. No modification to `shared.js`, `styles.css`, or `app.js` is permitted.

---

## 2. Hero section

The hero is the entire page. It contains six elements in sequence: a headline, a context line, a top bar, a card container, an email capture, and a declaration. Each is described below.

### 2a. Headline

An `<h1>` in Cormorant Garamond. The text is: "The Testing Pool Opens Early April." This replaces the previous philosophical headline entirely. It is direct and factual, creating anticipation through specificity rather than abstraction.

### 2b. Context line

One to three sentences in DM Sans, positioned beneath the headline. The text is: "Harmonia is a compatibility engine, and by joining our testing pool you participate in the highest level of technological validation there is: real people, real decisions, real proof. Your data is never monetised. This is research." These sentences frame what Harmonia is, what joining means, and the non-commercial nature of the research. The text will be implemented verbatim in the build prompt.

### 2c. Top bar

Three labels displayed horizontally, always visible: "Phase 1: Calibration", "Phase 2: Resonance", "Phase 3: Chemistry". The top bar serves two simultaneous functions. First, it is a structural overview: the user sees all three phases at a glance without scrolling or interacting. Second, it is a navigation control: clicking any label switches the card below to the corresponding phase. The active phase is visually distinguished with a gold accent treatment; the exact treatment (underline, background tint, or border) will be determined during the build prompt via research into phase indicator and step navigation patterns. On page load, "Phase 1: Calibration" is the active label.

At narrow mobile widths the three labels may need to compress or reflow. The document specifies that the top bar "may need to compress at narrow widths" without prescribing the exact mechanism, so the build prompt will need to address this, likely via reduced font size or abbreviated label text at a defined breakpoint.

### 2d. Card container

One card is visible at a time. The visible card corresponds to the active phase in the top bar. On page load the card displayed is the Phase 1 Calibration card in its collapsed state.

Navigation between cards works through three mechanisms:
- Clicking a label in the top bar (always available)
- Swiping left or right on mobile (touch gesture)
- Clicking prev/next arrow buttons on desktop (following the `why-harmonia.html` slider arrow pattern: chevron SVGs inside `.pagination-arrow` buttons, positioned with a `.slider-pagination` row below the track)

**The breakpoint at which prev/next arrows appear versus disappear is not explicitly stated in the architecture document.** The why-harmonia slider shows arrows at all viewport sizes, but the card system here uses swipe on mobile. This will need a decision during the build prompt: either arrows always appear alongside swipe, or arrows appear only above a specific breakpoint (e.g., 768px) and are hidden below it where swipe takes over.

Each card has three states.

**Collapsed (default on page load):** The card shows only the animated SVG phase icon and the phase name. No content, no labels, no rows. The card is clickable; clicking it triggers the first expansion. The icon vocabulary follows the existing site language: thin gold strokes on transparent backgrounds, geometric forms that assemble from component parts, maroon accent dots at structural vertices. Calibration uses an eye motif (analogous to the eye-open animation in the Visual card on `why-harmonia.html`, where lid paths separate to reveal a pupil and a diamond). Resonance uses two overlapping circles converging into a Venn diagram configuration. Chemistry uses a DNA double-helix motif (analogous to the genetic card animation in `why-harmonia.html`).

**First expansion (user clicks the collapsed card):** The card grows to reveal three labelled rows in sequence: "What you do", "How it works", "What you get". Each row contains a short description; the text for all three rows across all three cards will be provided verbatim in the build prompt. At the bottom of the first expansion sits a "More information" trigger. This trigger follows the `partnerships.html` feature box pattern: in that page, each feature box displays a "Tap for details" hint and triggers `openPartnershipsModal()` on click. Here the trigger opens the second expansion in-place rather than opening an overlay modal, but the visual hint ("More information" text with a chevron or similar indicator) is inspired by the same interaction vocabulary. For Card 3 (Chemistry) only, the first expansion also contains the "Tell Your Friends" share mechanic: a brief line of copy describing how non-London users can contribute to regional Phase 3 expansion, accompanied by a copy-link button.

**Second expansion (user clicks "More information"):** The card grows further to reveal the deeper methodology content beneath the three rows. The height transition is smooth, implemented via CSS transition on `height` or `max-height`. The methodology content is different for each card and is detailed in the Card Content section below. Only one card can be open at a time: whether collapsed, first-expanded, or second-expanded, a card is always in exactly one state. When the user switches to a different phase via the top bar or via swipe, the currently open card collapses back to its collapsed state before the new card becomes visible.

### 2e. Email capture

Positioned below the card container. An `<input type="email">` with placeholder "your@email.com" paired with a "Notify Me" button styled with the gold gradient matching the existing `.btn-primary` treatment in `styles.css` (linear-gradient from `--gold` to `--gold-champagne`, `color: var(--maroon-deep)`). The email capture is non-functional: no form submission, no JavaScript handling, no backend. It must be visually complete in both light and dark modes. At 480px and below the input and button stack to a single column, each with `border-radius: 4px` and `0.5rem` gap between them.

### 2f. Declaration

A single line below the email capture: "We use AI as a translator, never as a determinant. You are the decider." DM Sans at `font-weight: 600`, colour `var(--gold)`. This statement also appears inside Card 2's second expansion for contextual reinforcement at the point where the user is reading about how the system makes decisions.

---

## 3. Footer

Identical to every other page. "Harmonia Engine" in Cormorant Garamond at `color: var(--gold-champagne)`, followed by four links (Why Harmonia, Ignite Your Platform, Team, Contact), followed by the copyright line "&#169; 2026 Harmonia Engine". The footer sits inside the `<div class="page active" id="page-p2p">` wrapper, as on every other page in the repository.

---

## 4. Card content

The exact text for all card rows will be provided verbatim in a later prompt. What follows is a structural and conceptual account of what each card carries at each expansion level, so that any misunderstanding of scope or sequencing becomes visible now.

### Card 1: Phase 1 Calibration

**Collapsed state:** Eye motif SVG icon. Phase name.

**First expansion:**
- What you do: Complete a six-question personality assessment. Upload photos. Rate faces 1 to 5.
- How it works: A personalised neural network, trained in two stages: first it learns the population-level aesthetic consensus (what most people find attractive); then it freezes that understanding and learns how the specific user's preferences deviate from that baseline. Every rating the user gives teaches the model something.
- What you get: A personalised map of the visual types the user is drawn to. A Seven Deadly Sins personality profile across seven dimensions.
- "More information" trigger at the bottom.

**Second expansion:**
- The two-stage visual neural network explained in layman terms. Why this is categorically different from other platforms that run a single model for all users.
- Lie detection and inconsistency detection: the AI notices when stated values contradict the behavioural signals in natural language.
- Response style detection: the system flags if the user rushes with extreme answers, or gives uniformly neutral midpoint answers, as distinct from genuine personality signals.
- This second expansion focuses on the visual system. Personality depth is reserved for Card 2.

### Card 2: Phase 2 Resonance

**Collapsed state:** Two overlapping circles (Venn diagram) SVG icon. Phase name.

**First expansion:**
- What you do: From Phase 1, the system has filtered for mutual visual attraction. From this batch, the user is shown two people at a time and chooses one. Each person's card carries a Venn diagram showing shared personality traits across the Seven Deadly Sins profiles. Choosing the same person three times across different pairings confirms a match.
- How it works: Perceived similarity. The system surfaces what the user and each candidate have in common; only the overlap is shown, not the differences. Personality and visual together determine who appears and who the user selects.
- What you get: A mutual match (bidirectional attraction plus shared personality). A personalised insights report on how visual versus personality signals shaped the user's decisions.
- "More information" trigger at the bottom.

**Second expansion:**
- The personality assessment system: six open-ended scenario questions, AI reads natural language, maps across seven dimensions. (No internal system names are exposed.)
- Perceived similarity: the research basis for surfacing overlap rather than difference, and why this predicts attraction more powerfully than actual trait similarity.
- The three-heart confirmation mechanic: the same person must be chosen three times across different pairings, ensuring consistency over impulse.
- How personality and visual together decide who appears in the user's batch.
- A recap connecting Phase 1 to Phase 2: Phase 1 built the visual preference model and personality profile; Phase 2 combines both signals for the first time, and everyone in the batch already finds the user attractive.
- The insights report: honest and non-pandering. If the user consistently ignored personality signals, the report surfaces that. If they gravitated toward a specific personality cluster, the report names it.
- The declaration: "We use AI as a translator, never as a determinant. You are the decider." This is a contextual repeat of the declaration that also appears below the email capture.

### Card 3: Phase 3 Chemistry

**Collapsed state:** DNA double-helix SVG icon. Phase name.

**First expansion:**
- What you do: London users receive a free DNA testing kit, swab, send it back.
- How it works: DNA is processed and HLA compatibility is determined.
- What you get: The full three-signal assessment combining visual attraction, personality, and biological compatibility. An elaborated version of the Phase 1 and Phase 2 results showing how insights evolved across all three phases.
- Tell your friends (also in first expansion): For non-London users, Phase 3 expands to a region if enough people join and contribute existing DNA results. A copy-link button sits here for sharing.
- "More information" trigger at the bottom.

**Second expansion:**
- HLA immunogenetics: research spanning decades demonstrates that people tend to be attracted to partners with different HLA profiles, a preference linked to scent perception and unconscious biological signals. No papers are cited by name, no authors referenced; the body of evidence is described as a body, not as individual publications.
- The evolution of insights from Phase 1 through Phase 3: how each phase added a signal, and what the final three-signal report reveals that earlier reports could not.

---

## 5. Technical requirements

Every technical constraint is understood as follows.

Light and dark mode must both work using the existing `data-theme` attribute system managed by `shared.js` and `styles.css`. No new theme mechanism is introduced. All page-specific CSS goes in a `<style>` block in `<head>`; all page-specific JS goes in a `<script>` block at the bottom of `<body>` after `shared.js` and `app.js` are loaded. No existing file in the repository is modified. No files from `harmonia-preview/` are referenced anywhere. No em dashes appear in any file: not in HTML, not in CSS, not in JS, not in comments. No startup jargon. No internal terminology: not "Elo", not "WtM", not "PIIP", not "MetaFBP", not "DeepFace", not "Gemini", not "calibration database".

The page is mobile-responsive. The card system is naturally single-column (one card at a time), which simplifies responsive layout significantly. The top bar may need treatment at narrow widths.

---

## 6. Interaction research deferred to the build prompt

Three searches are required before writing any code in the build prompt:
1. Dating app swipe card UI patterns, to inform the card-to-card navigation transitions.
2. Accordion expand and collapse with multiple depth levels, to inform the two-tier expansion mechanic.
3. Clickable phase or step indicator navigation bar patterns, to inform the top bar active state treatment.

These searches happen in the build prompt. Nothing is assumed or pre-decided here about the specific visual treatment of any of these patterns.

---

## 7. Flags and ambiguities

The following items in the architecture document are either unspecified or could produce inconsistent implementation choices if not addressed before the build prompt.

**Flag 1: Prev/next arrow visibility breakpoint.** The document specifies swipe on mobile and prev/next arrows on desktop but does not state the breakpoint at which arrows appear or disappear. The `why-harmonia.html` science slider shows arrows at all sizes; this card system may differ. A decision is needed: do arrows appear at all viewport sizes alongside swipe, or only above a specific width (e.g., 768px or 1024px)?

**Flag 2: Top bar label compression at narrow widths.** The document states that labels "may need to compress at narrow widths" without prescribing how. At 320px, three labels reading "Phase 1: Calibration / Phase 2: Resonance / Phase 3: Chemistry" will overflow or truncate. Options include: reduced font size, shortened labels ("Calibration / Resonance / Chemistry" without the phase numbers), or a scrollable horizontal row. The build prompt will need to decide based on the research into step indicator patterns.

**Flag 3: Card container minimum height.** In the collapsed state the card shows only an SVG icon and a phase name. Depending on icon size and font size, this could be very short on desktop. No minimum height or aspect ratio is specified for the collapsed card. This may need to be established during build to prevent jarring layout shifts when switching between states.

**Flag 4: Transition direction.** When the user switches from Phase 1 to Phase 2 via the top bar, the architecture specifies that the current card collapses before the new card becomes visible. It does not specify whether there is a slide direction (the new card slides in from the right when advancing, from the left when retreating), or whether the transition is purely a fade, or collapse-then-replace. The swipe gesture implies directional awareness; the top bar click does not inherently carry direction. The build prompt research into swipe card UI patterns will need to address this.

**Flag 5: "Tell Your Friends" copy-link button mechanics.** The architecture specifies a copy-link button inside Card 3's first expansion but does not specify what URL is copied (presumably `https://app.harmoniaengine.com/p2p.html` or similar), nor does it specify the visual confirmation feedback (a toast notification, a button label change, or something else). The partnerships page uses a toast-style message for form submission confirmation; that pattern is the closest existing analogue. The build prompt should adopt the same pattern for consistency.

**Flag 6: Card 2's second expansion "declaration" duplication.** The declaration "We use AI as a translator, never as a determinant. You are the decider." appears both below the email capture (always visible) and inside Card 2's second expansion. This is intentional per the architecture document. It is worth noting so that during implementation the two instances are styled consistently even though one is a static page element and one is inside an expandable card.

**Flag 7: Email capture position relative to card.** The document specifies that the email capture is "below the card container." When a card is in its second expansion state, it will be significantly taller than in its collapsed state. The email capture should remain below the card regardless of which expansion state the card is in; the card expanding pushes the email capture downward rather than overlapping it. This is the natural flow-based behaviour and is almost certainly the intent, but it is worth confirming explicitly.

---

*No code has been written. No HTML, CSS, or JavaScript has been produced. This document exists only to confirm understanding before the build prompt.*
