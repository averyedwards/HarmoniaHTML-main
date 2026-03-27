# p2p.html Architecture: Flag Resolutions

These seven flags were raised by the comprehension review (`p2p-architecture-review.md`). Each one identified an ambiguity or unspecified implementation detail in the revised architecture. All seven are now resolved. These resolutions are binding for the build prompt. Where a resolution references an existing site pattern, the source file and line range are cited so you can verify directly.

---

## Flag 1: Navigation between cards (arrows vs no arrows)

**Resolution: No arrows.**

The site hides all slider arrows globally. In `assets/css/styles.css`, lines 6097-6102:

```css
/* --- HIDE ALL ARROWS GLOBALLY (True Minimalism) --- */
.slider-arrow,
.pagination-arrow {
    display: none !important;
}
```

This was a deliberate design decision. The p2p card system follows the same principle. Navigation between cards works through three mechanisms:

1. Clicking a label in the top bar (always available at all viewport sizes)
2. Swiping left/right (touch gesture, handled natively via CSS scroll-snap or equivalent JS)
3. Clicking pagination dots beneath the card container

The pagination dots follow the existing bevelled pill style defined in `styles.css` lines 6104-6114:

```css
.dot, 
.pagination-dot {
    width: 12px;
    height: 4px;
    border-radius: 2px;
    background: var(--gold-light);
    opacity: 0.5;
    transition: all 0.3s ease;
}
```

Active dot: `width: 32px; opacity: 1; background: var(--maroon-deep)` in light mode, `background: var(--gold)` in dark mode.

Three dots, one per phase, positioned centred beneath the card container. The active dot synchronises with both the top bar active label and the currently visible card. This is the same dot treatment used on the why-harmonia science slider and the team slider.

---

## Flag 2: Top bar label compression at narrow widths

**Resolution: Shortened labels at 480px and below.**

At desktop and tablet widths (above 480px), the three labels read: "Phase 1: Calibration", "Phase 2: Resonance", "Phase 3: Chemistry".

At 480px and below, the labels shorten to: "Calibration", "Resonance", "Chemistry". The "Phase 1/2/3:" prefix is dropped. The sequential numbering is redundant at mobile width because the user interacts with one card at a time and the order is implied by swipe direction and dot position.

The font size also reduces at this breakpoint. The existing site applies font-size reductions at 480px across multiple components (stat numbers, card titles, navigation links). The top bar labels follow the same pattern.

---

## Flag 3: Card container minimum height

**Resolution: Minimum height of 140px on the collapsed card.**

The collapsed card shows only the SVG icon and the phase name. Without a minimum height, this could render as a very short element (potentially 60-80px depending on icon size and padding), causing a jarring vertical layout shift when the card expands to the first expansion state.

The minimum height of 140px provides room for:
- The SVG icon at approximately 80-100px square (matching the icon container sizes used in the why-harmonia science cards, where the `.eye-container` and similar wrappers occupy roughly 100px)
- The phase name label beneath the icon
- Vertical padding above and below

This value is a target. If during the build the icon size or typography causes the collapsed card to naturally exceed 140px, no constraint is needed. If it falls below 140px, the minimum is enforced via `min-height: 140px` on the card container.

---

## Flag 4: Transition direction between cards

**Resolution: Directional slide.**

Advancing from a lower phase to a higher phase (Phase 1 to Phase 2, Phase 2 to Phase 3) slides the new card in from the right while the current card exits to the left. Retreating (Phase 3 to Phase 2, Phase 2 to Phase 1) reverses the direction: new card enters from the left, current card exits to the right.

This applies to all three navigation mechanisms:
- **Swipe:** Direction is inherent in the gesture (swipe left to advance, swipe right to retreat)
- **Top bar click:** Direction is determined by comparing the target phase number to the current phase number. If target > current, advance direction. If target < current, retreat direction.
- **Pagination dots:** Same logic as top bar click. Dot position determines direction.

Transition duration: approximately 300ms with `ease-out` timing. This matches the smooth, unhurried transitions used across the site (the `0.3s ease` on `.transition: all 0.3s ease` that appears on buttons, dots, cards, and other interactive elements throughout `styles.css`).

The card must complete its collapse-to-collapsed-state transition before the directional slide to the new card begins. The sequence is: current card collapses (if expanded) -> directional slide transition -> new card appears in collapsed state. If the current card is already collapsed, the directional slide fires immediately.

---

## Flag 5: Copy-link button feedback

**Resolution: Button label change, no toast.**

The site has no toast notification system. All user feedback is delivered through inline elements: form buttons temporarily change their label, and message divs appear below forms in gold text before auto-hiding. Examples:

- Partnerships form (`app.js` lines 635-658): button changes "Request Access" to "Processing..." to "Request Access", message div shows "Request received. We will be in touch shortly." in gold for 4 seconds.
- Contact form (`app.js` lines 310-319): button changes "Send Message" to "Processing..." to "Send Message", success div toggles `.visible` class for 3 seconds.

The copy-link button follows the same vocabulary:

1. User clicks the button labelled "Copy Link"
2. `navigator.clipboard.writeText(window.location.href)` copies the page URL
3. Button label changes to "Copied!" with `color: var(--gold)` for 3 seconds
4. Button label reverts to "Copy Link"

No toast. No overlay. No modal. The feedback is contained entirely within the button element itself.

---

## Flag 6: Declaration duplication styling

**Resolution: Confirmed intentional. Both instances styled identically.**

The declaration "We use AI as a translator, never as a determinant. You are the decider." appears in two locations:

1. Below the email capture (always visible as a static page element)
2. Inside Card 2's second expansion (contextual reinforcement at the point where the user is reading about how the system makes decisions)

Both instances use: DM Sans, `font-weight: 600`, `color: var(--gold)`, centred text alignment. No visual distinction between them. The duplication is deliberate; one serves as the page's closing philosophical anchor, the other serves as a contextual positioning statement within the methodology explanation.

No further decision needed. Implementation is straightforward.

---

## Flag 7: Email capture position relative to card expansion

**Resolution: Confirmed natural document flow.**

The email capture sits below the card container in the normal document flow. When a card expands (first or second expansion), the card container's height increases, and the email capture is pushed downward naturally. No fixed positioning, no absolute positioning, no overlap.

This means that when a card is in its second expansion state (the longest possible card height), the email capture may be below the viewport fold. This is acceptable. The user who has opened a card and clicked "More information" to reach the second expansion is engaged with the content; the email capture will be visible when they scroll past the card or when they collapse it.

No further decision needed. Standard CSS block flow handles this.

---

*All seven flags resolved. These resolutions are final and should be applied during the build prompt without further review.*
