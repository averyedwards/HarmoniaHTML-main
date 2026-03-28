# Visual Refinement Patch: p2p.html

## What this is

This prompt refines the visual patch that was just applied. The vertical card stack, living icons, gold glow system, connector lines, and curtain unveil choreography are all staying. This patch tightens the typography, adds interior visual rhythm, improves the scroll behaviour, and addresses five specific problems visible in the current build.

## The five problems this patch fixes

1. **The fully expanded card is too tall.** The second expansion with four methodology paragraphs at 0.95rem/1.75 line-height makes the card taller than the viewport. The user has to scroll up to see where they are.

2. **The card interior is flat text on dark background.** Three gold labels and three text blocks with no visual separators, no rhythm, no distinction between the first expansion content and the second expansion methodology content.

3. **The collapsed cards have no context.** Just an icon and a word. The why-harmonia science cards have title + subtitle. The team cards have name + role. The phase cards need a one-line descriptor beneath the phase name to communicate what each phase is about before the user clicks.

4. **The scrollIntoView centres the card, but expanded cards are taller than the viewport.** Centering a card that is 150% of viewport height means the user sees the middle of the card, not the top. The scroll target should be the top of the card with enough offset to clear the nav.

5. **The methodology section has no visual identity.** It appears as anonymous paragraphs beneath the "Show less" trigger. The why-harmonia page has a `.note-box` component with a gold left border and gradient background. The methodology section should use this same treatment to distinguish it as a deeper layer of content.

## Before you begin

Read the current `p2p.html` (the file you will modify). Also reference `assets/css/styles.css` for two existing components you will adapt:

- **`.note-box`** (lines 3312-3339): `border-left: 2px solid var(--gold)`, `background: linear-gradient(90deg, rgba(212, 168, 83, 0.08), transparent)`, uppercase gold h4 label. This is the treatment for the methodology panel.

- **`.card-subtitle`** (lines 2574-2584): `font-size: 1rem`, `opacity: 0.6`, `max-width: 400px`. This is the treatment for collapsed card descriptors.

No Chrome research needed for this patch. All changes reference existing site patterns.

---

## Changes

### 1. Typography tightening (CSS only)

Replace these values in the `<style>` block:

**Method paragraphs (`.method-para`):**
- `font-size`: 0.95rem to `0.88rem`
- `line-height`: 1.75 to `1.6`
- `margin-bottom`: 1.1rem to `0.75rem`

**Row body text (`.row-body`):**
- `font-size`: 1rem to `0.95rem`
- `line-height`: 1.65 to `1.55`

**Card padding when expanded:**
Add a rule: `.phase-card:not([data-state="collapsed"]) { padding: 1.5rem; }`
Keep collapsed card padding at 2rem (more visual breathing room for the icon).

**Row spacing:**
- `.card-row` margin-top: 1.2rem to `0.9rem`

**Card-method-inner:**
- `margin-top`: 1.2rem to `0.8rem`
- `padding-top`: 1.2rem to `0.8rem`

**More-info-btn:**
- `margin-top`: 1.5rem to `1rem`

**Tell-friends:**
- `margin-top`: 1.5rem to `1rem`
- `padding-top`: 1.2rem to `0.8rem`

**Card declaration (inside Card 2):**
- `font-size`: 1.05rem to `0.95rem`
- Add `margin-top: 1rem` to separate it from the last paragraph

### 2. Row label visual accent (CSS only)

Add a gold left border to row labels, matching the note-box vocabulary:

```css
.row-label {
    border-left: 2px solid var(--gold);
    padding-left: 0.5rem;
}
```

This creates a visual tab-stop rhythm down the left edge of each row, breaking the "wall of text" feeling.

### 3. Row dividers (CSS only)

Add subtle horizontal separators between rows:

```css
.card-row + .card-row {
    border-top: 1px solid rgba(212, 168, 83, 0.08);
    padding-top: 0.9rem;
}

[data-theme="dark"] .card-row + .card-row {
    border-top-color: rgba(212, 168, 83, 0.06);
}
```

### 4. Methodology panel treatment (CSS + minimal HTML)

The `.card-method-inner` gets the note-box treatment: a gold left border, a gradient background, a border-radius, and a section label.

**CSS changes:**

```css
.card-method-inner {
    border-top: none;
    border-left: 2px solid var(--gold);
    background: linear-gradient(90deg, rgba(212, 168, 83, 0.05), transparent);
    border-radius: 0 8px 8px 0;
    margin-top: 0.8rem;
    padding: 0.8rem 1rem;
}

[data-theme="dark"] .card-method-inner {
    background: linear-gradient(90deg, rgba(212, 168, 83, 0.06), transparent);
    border-top: none;
}
```

**HTML addition:** Add a label at the top of each `.card-method-inner`:

Card 1 (Calibration):
```html
<span class="method-label">A note on the methodology</span>
```

Card 2 (Resonance):
```html
<span class="method-label">A note on the methodology</span>
```

Card 3 (Chemistry):
```html
<span class="method-label">A note on the methodology</span>
```

Place each `<span class="method-label">` as the first child inside `.card-method-inner`, before the first `.method-para`.

**CSS for the label:**

```css
.method-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--gold);
    margin-bottom: 0.6rem;
    opacity: 0.8;
}
```

### 5. Collapsed card subtitles (HTML + CSS)

Add a one-line descriptor beneath each `.card-phase-name` inside the `.card-header`. These are visible in the collapsed state and give the user context before clicking.

**HTML addition:** After each `<p class="card-phase-name">`, add:

Card 1 (Calibration):
```html
<span class="card-phase-subtitle">Visual preferences and personality mapping</span>
```

Card 2 (Resonance):
```html
<span class="card-phase-subtitle">Mutual matching and perceived similarity</span>
```

Card 3 (Chemistry):
```html
<span class="card-phase-subtitle">Biological compatibility via HLA analysis</span>
```

**CSS:**

```css
.card-phase-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    color: var(--slate);
    opacity: 0.6;
    margin-top: 0.15rem;
    line-height: 1.3;
}

[data-theme="dark"] .card-phase-subtitle {
    color: var(--rose);
    opacity: 0.5;
}

/* Hide subtitle when card is expanded (content speaks for itself) */
.phase-card:not([data-state="collapsed"]) .card-phase-subtitle {
    display: none;
}
```

### 6. Collapsed card min-height reduction (CSS only)

```css
.phase-card[data-state="collapsed"] {
    min-height: 120px;
}
```

Down from 140px.

### 7. ScrollIntoView fix (JS change)

In the `expandToFirst` function, change:

```javascript
card.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

to:

```javascript
card.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

And add this CSS rule so the card doesn't hide behind the nav:

```css
.phase-card {
    scroll-margin-top: 100px;
}
```

This ensures the top of the expanded card is visible with 100px clearance (the nav is 80px, plus 20px breathing room).

### 8. More information button enhancement (CSS only)

Give the "More information" / "Show less" trigger a gold horizontal rule that extends across the card width, making it feel like a section divider rather than a floating text link:

```css
.more-info-btn {
    position: relative;
    margin-top: 1rem;
    padding-top: 0.8rem;
}

.more-info-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(212, 168, 83, 0.15),
        transparent
    );
}
```

### 9. Tell-friends visual refinement (CSS only)

The tell-friends block in Card 3 should feel like a distinct call-to-action panel rather than another text block. Give it a subtle background treatment:

```css
.tell-friends {
    background: rgba(212, 168, 83, 0.03);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
    border-top: none;
    border-left: 2px solid rgba(212, 168, 83, 0.2);
}

[data-theme="dark"] .tell-friends {
    background: rgba(212, 168, 83, 0.04);
    border-top: none;
}
```

### 10. Expanded card body left alignment refinement (CSS only)

When the card is expanded, the card body text is left-aligned but the header (icon + phase name) remains centred. This is correct. However, add a subtle transition so the text alignment shift feels smooth:

```css
.card-body-inner {
    padding-top: 0.5rem;
}
```

This adds a small gap between the centred header and the left-aligned content, preventing the visual jump.

---

## What you do NOT change

- No prose changes in the card rows, methodology sections, headline, context line, or declaration. Every word stays verbatim.
- No structural changes to the card system (no removing cards, connectors, tabs, or email capture).
- No changes to the living SVG icon animations.
- No changes to the active/inactive card hierarchy.
- No changes to the curtain unveil choreography logic (only the scrollIntoView target changes in JS).
- No changes to the gold glow pulse, connector shimmer, or text shimmer animations.
- No changes to nav, footer, or theme toggle.
- No em dashes anywhere.
- No modifications to shared.js, styles.css, or app.js.

---

## After building

Update `p2p-changelog.md` appending:
- Typography tightened: method paragraphs 0.88rem/1.6, row body 0.95rem/1.55, card padding reduced when expanded
- Row labels given gold left border accent (note-box vocabulary)
- Row dividers added between content rows
- Methodology section given note-box treatment (gold left border, gradient background, section label)
- Collapsed cards given one-line subtitles (hidden on expansion)
- Collapsed card min-height reduced to 120px
- ScrollIntoView changed from center to start with 100px scroll-margin-top
- More-info button given horizontal rule divider
- Tell-friends block given background treatment
- Card body inner padding adjusted

Commit:

```
git add p2p.html p2p-changelog.md
git commit -m "style: typography tightening and interior visual rhythm"
git push origin main
```

---

## Verification checklist

- [ ] Expanded card fits more comfortably on screen (second expansion no longer requires excessive scrolling)
- [ ] Row labels show gold left border accent
- [ ] Subtle horizontal dividers visible between rows
- [ ] Methodology section has gold left border, gradient background, and "A note on the methodology" label
- [ ] Collapsed cards show subtitle beneath phase name ("Visual preferences and personality mapping", etc.)
- [ ] Subtitles hidden when card is expanded
- [ ] ScrollIntoView scrolls to top of card with nav clearance, not centre
- [ ] "More information" trigger has horizontal rule above it
- [ ] Tell-friends block has subtle background panel treatment
- [ ] All prose unchanged and verbatim
- [ ] No em dashes
- [ ] Dark mode and light mode both render correctly
- [ ] Mobile 375px: all refinements render without overflow
- [ ] Living icon animations still work
- [ ] Curtain unveil still works on expand/collapse
- [ ] Active/inactive hierarchy still works
- [ ] Gold glow pulse still works on active card
- [ ] Copy-link button still works
- [ ] Nav and footer unchanged
