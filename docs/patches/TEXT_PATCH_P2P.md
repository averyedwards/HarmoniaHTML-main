# Targeted Text Patch: Second Expansion Rewrites

## What this prompt does

This prompt replaces the second expansion text ("A note on the methodology" content) inside all three phase cards. Nothing else changes. No CSS changes. No JS changes. No HTML structural changes. No first expansion text changes. No icon, animation, connector, or interaction changes.

The only elements modified are the `.method-para` paragraphs inside each `.card-method-inner`, and the `.card-declaration` in Card 2.

## How to execute

For each card below:

1. Find the `.card-method-inner` element inside that card's `.card-method-wrap`.
2. Keep the `<span class="method-label">A note on the methodology</span>` as the first child. Do not change it.
3. Replace all existing `.method-para` elements with the new paragraphs provided below.
4. Each new paragraph must have `class="method-para"` and `style="--j: N"` where N increments from 0.
5. For Card 2 only: keep the `.card-declaration` as the last child, updating its `style="--j: N"` to follow the last paragraph.

All text below is verbatim. Implement exactly as written. Do not reword, do not add to, do not remove from. Every semicolon, every colon, every comma is deliberate.

---

## Card 1: Phase 1 Calibration

Replace the current 4 `.method-para` elements with these 3:

```
--j: 0
```
You rate faces on a scale of 1 to 5; each rating is a teaching signal. A 1 tells the system what you dismiss; a 5 tells it what arrests you; a 3, the ambiguous middle, tells it where your taste is uncertain and the model learns to navigate that uncertainty rather than ignore it. You upload your photos so others can rate you in return. Then you answer six scenario questions in your own words: how you handle a group dinner bill where everyone contributed differently; what you do with a free weekend; how you respond to criticism. Not scales, not tick-boxes; open responses to real situations, because when you are asked 'are you generous?' you answer the way you want to be seen, but when you are asked what you do when the bill arrives, your answer reveals how you actually behave.

```
--j: 1
```
Every platform you have used runs one model for all users; the same algorithm decides what is attractive for everyone. This system does the opposite: it learns what most people find attractive first, then learns where you differ. Your ratings build a predictor that belongs to you and no one else. The AI reads your language the same way: not just what you say but how you say it; the patterns in your phrasing; the contradictions between your claims and your tone.

```
--j: 2
```
Your personality profile maps you across seven dimensions: where you sit between patience and wrath; generosity and calculation; restraint and impulse; humility and pride. Each score is drawn from how you responded to real situations, not from how you rated yourself. Phase 1 is the foundation; everything that follows builds on what you give us here.

---

## Card 2: Phase 2 Resonance

Replace the current 6 `.method-para` elements and 1 `.card-declaration` with these 4 `.method-para` elements and 1 `.card-declaration`:

```
--j: 0
```
You see two people side by side; you choose one. This is deliberate. Evaluating two people against each other produces more consistent preference data than evaluating one person in isolation; a swipe has no reference point; a comparison forces genuine choice. Each person's card carries a Venn diagram of your shared personality: one might share your impulsiveness and your generosity; the other might share your patience and your ambition. You see only the overlap, never the differences.

```
--j: 1
```
Research has consistently demonstrated that no combination of self-reported traits can predict who you will be drawn to before you meet them. What predicts attraction is not how similar you actually are but how similar you feel; two people who share very few traits on paper can experience a powerful sense of connection when the right dimensions are highlighted. The system finds what you share and presents it.

```
--j: 2
```
The three-selection mechanic ensures your match is consistent, not impulsive; you must prefer the same person three times against different alternatives before a match is confirmed. Phase 1 built your visual model and personality profile as separate signals; Phase 2 is where they combine. The filtered pool means everyone you see already finds you attractive; the anxiety of rejection has been removed from the equation before you make a single choice.

```
--j: 3
```
The insights report will not flatter you. It shows the balance between visual attraction and personality in your decisions: how much each shaped who you chose; what personality type you gravitated toward across pairings; whether your revealed preferences match what you thought you wanted. If you consistently chose based on appearance and ignored personality, it will tell you that directly.

```
--j: 4 (card-declaration, not method-para)
```
We use AI as a translator, never as a determinant. You are the decider.

---

## Card 3: Phase 3 Chemistry

Replace the current 3 `.method-para` elements with these 3:

```
--j: 0
```
You swab, you send it back, and we analyse it. We extract your HLA profile and compare it against every other participant in the pool. Partners with complementary immune profiles tend to find each other's natural scent more attractive; couples with dissimilar HLA consistently report higher partnership satisfaction. This is not a new finding; the research spans decades across multiple populations. What is new is deploying it alongside visual and personality data in a system built for real decisions.

```
--j: 1
```
No other platform has combined these three signals. Phase 1 captured what you see; Phase 2 tested what you feel; Phase 3 adds what your biology recognises before your conscious mind does. Unlike visual attraction, which you perceive, and personality, which you sense, biological chemistry operates entirely below awareness; the only way to access it is through the science.

```
--j: 2
```
By participating, you contribute to proving whether this works at scale. The report you receive at the end of Phase 3 builds on everything from the first two phases; it shows whether your biological compatibility confirms what visual and personality signals already suggested, or whether it reveals a dimension of attraction that neither could capture.

---

## What you do NOT change

- No CSS modifications of any kind
- No JS modifications of any kind
- No HTML structural changes (no adding or removing elements beyond the method-para replacements)
- No first expansion text changes (the "What you do", "How it works", "What you get" rows are untouched)
- No `.method-label` changes ("A note on the methodology" stays in all three cards)
- No icon, animation, connector, or interaction changes
- No nav, footer, email capture, or page-level declaration changes
- No em dashes anywhere

## After replacing

Update `p2p-changelog.md` appending:

```
## Text Patch -- Second expansion methodology rewrites

- Card 1 (Calibration): Replaced 4 method paragraphs with 3. Added concrete user experience walkthrough (rating scale, photo upload, scenario questions with examples). Added personalised-model-vs-one-model differentiator. Added seven dimension names (patience/wrath, generosity/calculation, restraint/impulse, humility/pride). Eliminated redundancy with first expansion.
- Card 2 (Resonance): Replaced 6 method paragraphs + declaration with 4 + declaration. Added forced-choice research rationale. Integrated core research finding (self-reported traits cannot predict attraction). Added Venn diagram experience with concrete personality examples. Added rejection-anxiety-removed positioning. Expanded insights report specifics. Removed questionnaire re-description (belongs in Phase 1). Declaration preserved.
- Card 3 (Chemistry): Rewrote 3 method paragraphs. Added concrete user experience (extract HLA, compare against pool). Added research findings (scent attractiveness, partnership satisfaction). Added biological-signal-below-awareness positioning. Added report tension (confirms vs reveals new dimension). Removed marketing superlative.
- Register shifted to oratorical cascading: semicolons chain parallel arguments; colons introduce revelations; commas create subordinated layers. No em dashes.
```

Commit:

```
git add p2p.html p2p-changelog.md
git commit -m "content: rewrite second expansion methodology text across all three phases"
git push origin main
```

## Verification

- [ ] Card 1 second expansion shows 3 paragraphs (was 4)
- [ ] Card 2 second expansion shows 4 paragraphs + declaration (was 6 + declaration)
- [ ] Card 3 second expansion shows 3 paragraphs (was 3)
- [ ] All `--j` values are sequential starting from 0 in each card
- [ ] Card 2 `.card-declaration` has correct `--j` value (4)
- [ ] Curtain unveil stagger still works on second expansion
- [ ] "Show less" collapses correctly
- [ ] "A note on the methodology" label present in all three cards
- [ ] All prose matches verbatim text above
- [ ] No em dashes anywhere in the file
- [ ] No changes to first expansion text
- [ ] No CSS or JS changes
