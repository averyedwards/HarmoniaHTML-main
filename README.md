# Harmonia Engine — Codebase Guide
### For Augustine & Joles (Design & Brand)

---

## Table of Contents

1. [Project Schema & File Structure](#1-project-schema--file-structure)
2. [The harmonia-preview Folder](#2-the-harmonia-preview-folder)
3. [Quick-Start: Making Design Changes](#3-quick-start-making-design-changes)
4. [HTML Fundamentals](#4-html-fundamentals)
5. [CSS Fundamentals](#5-css-fundamentals)
6. [JavaScript Fundamentals](#6-javascript-fundamentals)
7. [Animations & Interactions Deep Dive](#7-animations--interactions-deep-dive)
8. [Line-by-Line: What Does What](#8-line-by-line-what-does-what)
9. [Using AI Tools to Make Edits](#9-using-ai-tools-to-make-edits)
10. [Inspiration & Research Resources](#10-inspiration--research-resources)
11. [Animation Ideas for p2p / Preview Page](#11-animation-ideas-for-p2p--preview-page)
12. [Merging Preview → Production](#12-merging-preview--production)

---

## 1. Project Schema & File Structure

```
HarmoniaHTML/
│
├── index.html              ← Home page
├── why-harmonia.html       ← Why Harmonia page
├── partnerships.html       ← "Ignite Your Platform" page
├── team.html               ← Team page
├── local-network.html      ← Local Matching Engine (demo)
├── p2p.html                ← PRODUCTION copy of Join Our Testing Pool
├── contact.html            ← Contact page
│
├── assets/
│   ├── css/
│   │   └── styles.css      ← ALL visual styling for the main site
│   ├── js/
│   │   ├── shared.js       ← Theme toggle, mobile nav, active link, knot gradient
│   │   └── app.js          ← All page interactivity (sliders, forms, animations)
│   └── images/
│       └── harmonia-logo.png  ← The Celtic knot logo (PNG with transparency)
│
└── harmonia-preview/       ← DESIGN SANDBOX — your playground
    ├── index.html          ← The full app preview (12 phases)
    └── assets/
        ├── css/
        │   └── styles.css  ← Styles for preview ONLY
        ├── js/
        │   ├── app.js      ← Preview app logic
        │   ├── animations.js ← Preview animations
        │   └── data.js     ← Preview mock data (profiles, matches)
        └── icons/
            └── symbols.svg ← SVG icon library for preview
```

**Key rule:** `harmonia-preview/` is NOT linked from the main site nav. It's your private design lab. `p2p.html` is the live production page that gets shown to users. When you're happy with preview changes, tell Claude to "merge harmonia-preview into p2p.html".

---

## 2. The harmonia-preview Folder

### What it is
`harmonia-preview/index.html` is a **full interactive demo** of the Harmonia app — 12 phases taking a user through the complete journey:

| Phase | Section ID | What it shows |
|-------|-----------|---------------|
| 0 | `s0` | Hero / intro screen |
| 1 | `s1` | Visual preferences (face rating) |
| 2 | `s2` | Personality quiz (7 sins) |
| 3 | `s3` | Genetic / DNA upload |
| 4 | `s4` | Calibration (AI analysis) |
| 5 | `s5` | Composite formula |
| 6 | `s6` | Profile complete |
| 7 | `s7` | Discovery / swipe deck |
| 8–9 | `s9` | Matches list + chat |
| 10 | `s10` | User profile + radar |
| 11 | `s11` | Admin dashboard |

### How to open it
Simply open `harmonia-preview/index.html` in your browser. No server needed.

### What you can change safely
- **Colours** → edit `harmonia-preview/assets/css/styles.css`
- **Text / copy** → edit `harmonia-preview/index.html` directly
- **Data (names, bios, scores)** → edit `harmonia-preview/assets/js/data.js`
- **Animations** → edit `harmonia-preview/assets/js/animations.js`
- **Interactions** → edit `harmonia-preview/assets/js/app.js`

### What NOT to touch
- The SVG symbols in `index.html` (lines 21–43) — these power all icons
- The canvas elements `#dust` and `#confetti` — these are particle systems
- The overlay divs at the top (`.mrovl`, `.govl`, `.mbg`, `.msheet`) — these are UI overlays controlled by JS

---

## 3. Quick-Start: Making Design Changes

### Step 1 — Open your files
Use **VS Code** (free): https://code.visualstudio.com  
Install the **Live Server** extension to preview changes instantly in your browser.

### Step 2 — Change a colour
Open `assets/css/styles.css`. Press `Ctrl+F` (Find) and search for `:root`. You'll see all colour variables:

```css
:root {
    --maroon: #722F37;   /* The deep red */
    --gold: #D4A853;     /* The gold accent */
    --cream: #F5F0E8;    /* Off-white background */
    /* ... */
}
```

Change a hex code and save — your browser refreshes instantly with Live Server.

### Step 3 — Change text
Open the relevant `.html` file. Press `Ctrl+F` to find the text you want to change. Edit it. Save.

### Step 4 — Upload changes
When you're done editing, tell Claude what you changed and ask it to "review and polish".

---

## 4. HTML Fundamentals

HTML is the **skeleton** of a webpage — it defines what content exists.

### Basic structure of every page
```html
<!DOCTYPE html>        ← Tells the browser "this is HTML5"
<html lang="en">       ← Root element, lang="en" means English
<head>                 ← Invisible setup: title, CSS links, fonts
    <title>Page Title</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>                 ← Everything visible goes here
    <nav>...</nav>     ← Navigation bar
    <section>...</section>   ← A page section
    <footer>...</footer>     ← Footer
</body>
</html>
```

### Elements you'll see constantly

| Tag | What it is | Example |
|-----|-----------|---------|
| `<h1>` to `<h6>` | Headings (h1 = biggest) | `<h1>Dating is broken.</h1>` |
| `<p>` | Paragraph of text | `<p>Attraction isn't random.</p>` |
| `<a href="url">` | Clickable link | `<a href="contact.html">Contact</a>` |
| `<img src="path">` | Image | `<img src="assets/images/harmonia-logo.png">` |
| `<div>` | Generic container (no meaning) | `<div class="card">...</div>` |
| `<section>` | A thematic section | `<section class="hero">` |
| `<button>` | Clickable button | `<button onclick="fn()">Click me</button>` |
| `<input>` | Text field | `<input type="email" placeholder="email">` |
| `<span>` | Inline container | `<span class="gold-text">Chemistry</span>` |
| `<svg>` | Scalable vector graphic | Used for icons and charts |

### Classes and IDs
```html
<div class="stat-card">   ← class = reusable style name (multiple elements can share)
<div id="radar">          ← id = unique identifier (only one element per page)
```

Classes are targeted in CSS with `.stat-card { ... }`  
IDs are targeted with `#radar { ... }`

### Attributes
```html
<img src="logo.png" alt="Logo" style="height:40px">
<!-- src = where the image is, alt = screen reader text, style = inline CSS -->

<a href="page.html" target="_blank">Open in new tab</a>
<!-- target="_blank" opens link in new tab -->

data-harmonia-logo   ← Custom attribute — tells JS to use this as a logo target
data-index="0"       ← Custom attribute — slider uses this to track position
```

---

## 5. CSS Fundamentals

CSS is the **skin** of a webpage — it controls everything visual.

### The colour/variable system
All Harmonia's colours are defined as **CSS custom properties** (variables) at the top of `styles.css`:

```css
:root {                          /* Light theme defaults */
    --maroon: #722F37;
    --maroon-light: #8B3A3A;
    --gold: #D4A853;
    --gold-soft: #C49040;
    --cream: #F5F0E8;
    --bg: #FAFAF7;               /* Page background */
    --text: #1A1008;             /* Main text colour */
    --border: rgba(114,47,55,0.2);
}

[data-theme="dark"] :root {      /* Dark theme overrides */
    --bg: #0D0A07;
    --text: #F0EAE0;
    /* ... */
}
```

To change the main gold colour sitewide, just change `--gold: #D4A853;` to your preferred hex.

### Selectors
```css
.btn-primary { }        ← All elements with class="btn-primary"
#radar-status { }       ← The one element with id="radar-status"
nav a { }               ← All <a> tags inside a <nav>
.card:hover { }         ← .card only when mouse is hovering
.card:first-child { }   ← The first .card inside its parent
```

### The Box Model
Every element is a box with:
```css
.element {
    margin: 20px;        /* Space OUTSIDE the element (pushes others away) */
    padding: 16px;       /* Space INSIDE the element (between border and content) */
    border: 1px solid;   /* The border line */
    width: 300px;        /* Width of content area */
}
```

### Flexbox — how layouts work in Harmonia
Almost all layouts use **flexbox**:
```css
.container {
    display: flex;              /* Enable flexbox */
    justify-content: center;    /* Horizontal alignment (center, space-between, flex-start) */
    align-items: center;        /* Vertical alignment */
    gap: 24px;                  /* Space between children */
    flex-wrap: wrap;            /* Wrap to next line if too wide */
    flex-direction: column;     /* Stack vertically instead of horizontally */
}
```

### Responsive design with media queries
Harmonia uses these breakpoints:
```css
@media (max-width: 768px) {
    /* Styles for mobile phones */
}

@media (max-width: 1024px) {
    /* Styles for tablets */
}
```

### Common visual tricks
```css
/* Gradient text */
.tagline .compatibility {
    background: linear-gradient(135deg, var(--maroon), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Glass/frosted effect */
.card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Box shadow */
.card {
    box-shadow: 0 8px 32px rgba(114, 47, 55, 0.15);
}

/* Transition (smooth hover change) */
.btn {
    transition: all 0.3s ease;
}
.btn:hover {
    transform: translateY(-2px);   /* Lifts up on hover */
    box-shadow: 0 12px 40px rgba(114, 47, 55, 0.3);
}
```

---

## 6. JavaScript Fundamentals

JavaScript is the **nervous system** — it makes things interactive.

### You don't need to write JS from scratch — just understand how to edit it

### Variables
```js
const gold = '#D4A853';           // const = never changes
let currentIndex = 0;             // let = can change
var oldWay = 'avoid this';        // var = old style, avoid
```

### Functions
```js
// Define a function
function scrollToSection(n) {
    // ... code that scrolls to section n
}

// Arrow function (same thing, shorter syntax)
const scrollToSection = (n) => {
    // ...
}

// Call a function
scrollToSection(3);
```

### Selecting HTML elements
```js
document.getElementById('radar-status')        // By ID (returns one element)
document.querySelector('.stat-card')           // By CSS selector (returns first match)
document.querySelectorAll('.stat-card')        // By CSS selector (returns all matches)
```

### Changing things
```js
const el = document.getElementById('radar-status');

el.textContent = 'MATCH FOUND';               // Change text
el.innerHTML = '<span class="gold">85%</span>'; // Change HTML inside element
el.style.opacity = '0';                        // Change a CSS property
el.classList.add('active');                    // Add a CSS class
el.classList.remove('active');                 // Remove a CSS class
el.classList.toggle('active');                 // Toggle (add if missing, remove if present)
```

### Events (responding to user actions)
```js
// When button is clicked
button.addEventListener('click', function() {
    // do something
});

// When input changes
input.addEventListener('input', function() {
    console.log(this.value);
});

// On DOM ready (page loaded)
document.addEventListener('DOMContentLoaded', function() {
    // safe to interact with elements now
});
```

### Timers
```js
setTimeout(() => {
    // runs once after 2000ms (2 seconds)
}, 2000);

setInterval(() => {
    // runs every 3000ms (3 seconds) forever
}, 3000);
```

### The data.js file (preview only)
This is where mock user profiles live. To change a profile:
```js
// Find this in harmonia-preview/assets/js/data.js
const PROFILES = [
    {
        name: 'Amara',
        age: 26,
        bio: 'Architect...',
        visual: 87,         // Visual score (0-100)
        psych: 79,          // Personality score
        bio_score: 84,      // Genetic chemistry score
        traits: ['Creative', 'Ambitious', 'Empathetic']
    },
    // ... more profiles
];
```

---

## 7. Animations & Interactions Deep Dive

### CSS Transitions (simple hover effects)
```css
/* The element starts here */
.card {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* On hover, it smoothly moves to this state */
.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(114, 47, 55, 0.25);
}
```

### CSS Keyframe Animations (continuous looping)
```css
/* Define the animation */
@keyframes pulse {
    0%   { opacity: 1; transform: scale(1); }
    50%  { opacity: 0.6; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
}

/* Apply it */
.status-dot {
    animation: pulse 2s ease-in-out infinite;
}
```

Common animation properties:
```css
animation-name: pulse;
animation-duration: 2s;
animation-timing-function: ease-in-out; /* ease, linear, ease-in, ease-out, cubic-bezier() */
animation-delay: 0.5s;                  /* Wait before starting */
animation-iteration-count: infinite;    /* Or a number like 3 */
animation-direction: alternate;         /* Goes forward then backward */
animation-fill-mode: forwards;          /* Keeps final state after ending */
```

### GSAP (used in harmonia-preview)
The preview uses GSAP — a professional animation library. It's loaded from CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

Basic GSAP usage:
```js
// Animate an element
gsap.to('.card', {
    duration: 1,         // 1 second
    opacity: 1,
    y: 0,                // Move to y=0 (translateY)
    ease: 'power2.out',  // Easing curve
    stagger: 0.1,        // If multiple elements, stagger them 0.1s apart
});

// Animate FROM a state
gsap.from('.card', {
    duration: 0.8,
    opacity: 0,
    y: 40,               // Starts 40px below, moves to natural position
});

// Timeline (sequence of animations)
const tl = gsap.timeline();
tl.from('.title', { opacity: 0, y: -20, duration: 0.6 })
  .from('.subtitle', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2');
  //                                                         ↑ starts 0.2s before previous ends
```

GSAP ScrollTrigger (animate on scroll):
```js
gsap.registerPlugin(ScrollTrigger);

gsap.from('.card', {
    scrollTrigger: {
        trigger: '.card',     // Watch this element
        start: 'top 80%',     // When top of element hits 80% of viewport
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8
});
```

### SVG Animations
The Why Harmonia page has animated SVG icons. SVG paths are animated by changing their `d` attribute or using CSS:

```css
/* CSS approach — animate SVG path */
.eye-pupil {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    transition: stroke-dashoffset 1.5s ease;
}
.eye-open .eye-pupil {
    stroke-dashoffset: 0;  /* Draws the line */
}
```

```js
// JS approach — morph an SVG path
upperLid.setAttribute('d', 'M30 40 Q50 20 70 40');  // New path data
```

### Particle Systems (canvas)
The preview has two canvas layers (`#dust` and `#confetti`). These are drawn using `requestAnimationFrame`:

```js
const canvas = document.getElementById('dust');
const ctx = canvas.getContext('2d');

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;  // Move particle upward
    });
    requestAnimationFrame(draw);  // Loop
}
draw();
```

---

## 8. Line-by-Line: What Does What

### In `assets/js/shared.js`

```js
// THEME SYSTEM
(function initTheme() {
    const saved = localStorage.getItem('harmonia-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();
// → Runs immediately on load. Reads saved theme from browser storage.
//   Applies it to <html data-theme="..."> which CSS uses to switch colours.

function toggleTheme() { ... }
// → Called when user clicks the sun/moon button in nav.

// MOBILE NAV
function toggleMobileNav() { ... }
// → Called when hamburger (≡) button is clicked. Adds/removes 'mobile-open' class.

// ACTIVE NAV LINK
(function setActiveNavLink() { ... })();
// → Reads current page filename from URL (e.g. "why-harmonia.html")
//   and adds class="active" to the matching nav link.

// SYNTHESIS KNOT GRADIENT
window.applyKnotGradient = function() { ... }
// → Injects SVG gradient definitions and applies them to the animated knot icon
//   in the Why Harmonia slider. Re-runs on theme change.
```

### In `assets/js/app.js`

```js
// HOME PAGE
function animateRadar() { ... }
// → Animates the radar polygon on the home hero every 2s.
//   Changes the polygon points randomly to create a "scanning" effect.

// WHY HARMONIA PAGE
function initWhySlider() { ... }
// → Sets up the 4-card science slider (Visual/Personality/Genetic/Synthesis).
//   Handles: prev/next buttons, pagination dots, auto-rotation, scroll detection.

function initVisualCardAnimation() { ... }
function triggerVisualCardAnimation(shouldOpen) { ... }
// → Controls the animated eye SVG on the Visual card.
//   Eye opens when the card scrolls into view for the first time.

function initPersonalityCardAnimation() { ... }
// → Controls the triangle animation on the Personality card.

function initGeneticCardAnimation() { ... }
// → Controls the DNA helix animation on the Genetic card.

function initSynthesisCardAnimation() { ... }
// → Controls the animated Celtic knot on the Synthesis card.
//   Most complex animation — traces the knot paths progressively.

// TEAM PAGE
function initTeamSlider() { ... }
// → Sets up the team member card slider with mobile/tablet responsive dots.

// FORMS
function initForms() { ... }
// → Attaches submit handlers to: integration form, contact form, waitlist form.
//   Shows "Processing..." then success message.

function selectContactType(card, type) { ... }
// → Called when user clicks a contact type card (Platform/Individual/Other).
//   Highlights the card and pre-fills the dropdown.

// PARTNERSHIPS PAGE
function initPartnerships() { ... }
// → Sets up the dynamic tier system (Pilot/API/Core).
//   Content changes based on dropdown/tab selection.

function updatePartnershipsContent(tier) { ... }
// → Swaps in the relevant text/boxes when a tier is selected.

function renderPartnershipsBoxes(boxes) { ... }
// → Renders the 3 feature boxes for the selected tier.

function openPartnershipsModal(key) { ... }
// → Opens the detail modal when a feature box is clicked.
```

### In `harmonia-preview/assets/js/data.js`

```js
const PROFILES = [ ... ]
// → Array of 12 mock dating profiles with: name, age, bio, scores, traits, initials.
//   EDIT THIS to change the people shown in the swipe deck and matches list.

const PERSONALITY_DIM = [ ... ]
// → The 7 dimensions (Wrath, Sloth, etc.) with descriptions.
//   Used by the personality quiz in Section 2.

const QUIZ_QUESTIONS = [ ... ]
// → 14 questions for the personality assessment.
//   Each has: text, and 4 options with score modifiers.
```

### In `harmonia-preview/assets/js/animations.js`

```js
function initDust() { ... }
// → Creates the floating gold particle background on the canvas.
//   Particles drift upward slowly, fade in and out.

function launchConfetti() { ... }
// → Fires coloured confetti on the match reveal screen.

function initRadarChart(canvas, data) { ... }
// → Draws the 7-axis personality radar chart using raw Canvas 2D API.
```

### Key CSS classes in `assets/css/styles.css`

| Class | What it controls |
|-------|-----------------|
| `.hero` | Home page hero section layout |
| `.radar-container` | The rotating radar on the home page |
| `.science-card` | The 4 cards in the Why Harmonia slider |
| `.eye-open` | Toggled by JS to open/close the animated eye |
| `.team-card` | Individual team member cards |
| `.regal-form` | The contact/partnerships forms |
| `.coming-soon-badge` | The "Testing Pool Open" badge pill |
| `.free-dna-banner` | The DNA kit offer box on the p2p page |
| `.fade-in` | Fade-in animation on scroll |
| `.delay-1` to `.delay-4` | Staggered animation delays |

---

## 9. Using AI Tools to Make Edits

### Claude (claude.ai) — Best for complex changes

**How to use Claude effectively:**

1. **Give context:** Always start with "I'm working on the Harmonia website. Here's the current code for [section]:"

2. **Be specific:** Instead of "make it prettier", say "change the stat cards to have a dark glass effect with gold border glow on hover"

3. **Paste the relevant code:** Copy the specific CSS rule or HTML block you want changed

4. **Ask for explanations:** "Please explain what each line does" if you want to learn

5. **Ask for alternatives:** "Give me 3 different versions of this animation"

**Effective prompts:**
```
"Here's the current CSS for .stat-card in styles.css:
[paste code]
I want to add a subtle pulsing glow effect on hover using the gold colour variable.
Keep all other styles the same. Show me only the changed CSS."
```

```
"I want to add a neuron-firing background animation to the personality quiz section
in harmonia-preview/index.html. The neurons should appear when the user is typing
their answer. Give me the CSS and JS I need to add."
```

```
"In harmonia-preview/assets/js/app.js, what does this function do?
[paste function]"
```

### Google AI Studio (aistudio.google.com) — Best for image/visual analysis

**How to use it:**
1. Go to https://aistudio.google.com
2. Use Gemini 2.0 Flash (free tier is generous)
3. You can upload screenshots and ask "How would I recreate this effect in CSS?"
4. Upload your current page screenshot + a reference design and ask "What changes would make mine look more like this?"

**Effective prompts for AI Studio:**
```
[Upload screenshot of your page + a screenshot from a site you like]
"The first image is my current design. The second is what I want it to feel like.
What specific CSS changes would transform mine toward that aesthetic?"
```

```
[Upload a screenshot of an animation you want to replicate]
"Describe exactly how this animation works so I can implement it in CSS/JS."
```

**Getting code from other websites:**
1. Right-click any element on any website → Inspect
2. Find the CSS in the Styles panel on the right
3. Copy what you want, adapt the class names to Harmonia's variables
4. Ask Claude to clean it up: "Adapt this CSS to use Harmonia's CSS variables (--gold, --maroon, etc.)"

---

## 10. Inspiration & Research Resources

### Design Inspiration
| Site | What it's good for |
|------|-------------------|
| https://www.awwwards.com | Award-winning web designs |
| https://dribbble.com | UI design mockups |
| https://codepen.io | Live code experiments you can fork |
| https://uiverse.io | Ready-made CSS components |
| https://neumorphism.io | Soft UI generator |
| https://cssgradient.io | Gradient builder |
| https://animista.net | CSS animation library with live preview |
| https://tobiasahlin.com/spinkit/ | Loading spinners |
| https://lottiefiles.com | JSON animations (Lottie) |

### CSS References
| Site | What it's good for |
|------|-------------------|
| https://css-tricks.com | Tutorials and guides |
| https://developer.mozilla.org/en-US/docs/Web/CSS | Definitive reference |
| https://flexboxfroggy.com | Learn flexbox via game |
| https://grid.layoutit.com | Visual CSS Grid builder |
| https://cubic-bezier.com | Custom easing curve visualiser |

### Animation Libraries (add to any page via CDN link)
```html
<!-- GSAP — professional animations (already in preview) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- Three.js — 3D WebGL (for advanced backgrounds) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Particles.js — particle systems -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js"></script>

<!-- AOS — Animate On Scroll -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
```

### Typography Resources
Harmonia uses **Cormorant Garamond** (serif, elegant) + **DM Sans** (clean, modern).

Finding new fonts: https://fonts.google.com  
Pairing suggestions: https://fontpair.co

To change fonts, edit the Google Fonts link in `<head>`:
```html
<!-- Current -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```
Then update the CSS variables:
```css
--font-display: 'Cormorant Garamond', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;
```

---

## 11. Animation Ideas for p2p / Preview Page

These are advanced ideas for enhancing the preview experience, especially during quiz/input phases. All of these can be implemented in `harmonia-preview/assets/js/animations.js` and triggered from `app.js`.

### Idea 1 — Neural Network Firing During Typing
When the user types their quiz answer, neurons fire across a canvas background.

**Implementation sketch:**
```js
// In animations.js — add neural network canvas
function initNeuralCanvas(container) {
    const canvas = document.createElement('canvas');
    canvas.className = 'neural-bg';
    container.prepend(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create nodes
    const nodes = Array.from({length: 40}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        firing: false,
        fireOpacity: 0
    }));
    
    // On keypress → trigger a random cascade
    function triggerFire(sourceNode) {
        sourceNode.firing = true;
        sourceNode.fireOpacity = 1;
        setTimeout(() => {
            sourceNode.connections.forEach(target => {
                setTimeout(() => triggerFire(target), Math.random() * 200 + 100);
            });
        }, 80);
    }
    
    return { triggerFire, nodes };
}

// In app.js — hook to input event
const quizInput = document.querySelector('.quiz-text-input');
const neural = initNeuralCanvas(quizInput.parentElement);

quizInput.addEventListener('input', () => {
    neural.triggerFire(neural.nodes[Math.floor(Math.random() * neural.nodes.length)]);
});
```

**CSS to add:**
```css
.neural-bg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    opacity: 0.3;
    z-index: 0;
}
```

### Idea 2 — DNA Helix Loading State
When the compatibility score is calculating, show a rotating double helix instead of a plain spinner.

```css
@keyframes helix-strand {
    0%   { transform: scaleX(1); }
    25%  { transform: scaleX(0.1); }
    50%  { transform: scaleX(-1); }
    75%  { transform: scaleX(-0.1); }
    100% { transform: scaleX(1); }
}

.dna-rung {
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--maroon), var(--gold));
    animation: helix-strand 1.2s ease-in-out infinite;
}

/* Each rung gets a delay to create the twisting effect */
.dna-rung:nth-child(1) { animation-delay: 0s; }
.dna-rung:nth-child(2) { animation-delay: 0.1s; }
.dna-rung:nth-child(3) { animation-delay: 0.2s; }
/* ... */
```

### Idea 3 — Compatibility Score Orbit
When the match reveal triggers, show the two profiles orbiting a central diamond as score rings fill.

```js
// GSAP timeline for match reveal
const tl = gsap.timeline();

// Profiles orbit inward
tl.from('.mrav', {
    duration: 1.2,
    x: (i) => i === 0 ? -200 : 200,
    rotation: 360,
    ease: 'power3.out'
});

// Diamond pulses
tl.from('.mrheart', {
    duration: 0.4,
    scale: 0,
    ease: 'back.out(3)'
}, '-=0.3');

// Score rings animate in
tl.to('#rv', { strokeDashoffset: 515 * (1 - 0.85), duration: 1.5, ease: 'power2.out' }, '-=0.2');
```

### Idea 4 — Face Rating Glow Effect
When swiping a face right (attracted), the card emits a warm gold glow. When swiping left, a cool desaturating effect.

```css
.swipe-card {
    transition: box-shadow 0.2s ease, filter 0.2s ease;
}

.swipe-card.swiping-right {
    box-shadow: 0 0 40px rgba(212, 168, 83, 0.6),
                0 0 80px rgba(212, 168, 83, 0.3);
}

.swipe-card.swiping-left {
    filter: grayscale(60%) brightness(0.8);
    box-shadow: 0 0 40px rgba(100, 100, 120, 0.4);
}
```

### Idea 5 — Personality Trait Constellation
After completing the quiz, display personality traits as interconnected stars — a constellation unique to each user.

```js
// Each trait is a star, lines connect related traits
function drawConstellation(traits, canvas) {
    const ctx = canvas.getContext('2d');
    const stars = traits.map((t, i) => ({
        x: /* position based on trait type */,
        y: /* position based on score */,
        label: t.name,
        size: t.score / 10
    }));
    
    // Draw connection lines
    stars.forEach((star, i) => {
        stars.forEach((other, j) => {
            if (i < j && areTraitsRelated(star.label, other.label)) {
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = 'rgba(212, 168, 83, 0.15)';
                ctx.stroke();
            }
        });
    });
    
    // Draw stars (animated in one by one)
    stars.forEach((star, i) => {
        setTimeout(() => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--gold)';
            ctx.fill();
        }, i * 200);
    });
}
```

### Idea 6 — Typing Indicator with Personality Signal
In the chat section, instead of "..." show animated brain wave signal as the match "thinks" their reply.

```css
@keyframes brain-wave {
    0%, 100% { height: 4px; }
    25% { height: 16px; }
    50% { height: 8px; }
    75% { height: 22px; }
}

.typing-indicator span {
    display: inline-block;
    width: 4px;
    background: var(--gold);
    border-radius: 2px;
    animation: brain-wave 1s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
.typing-indicator span:nth-child(4) { animation-delay: 0.45s; }
.typing-indicator span:nth-child(5) { animation-delay: 0.6s; }
```

---

## 12. Merging Preview → Production

When you've made changes to `harmonia-preview/index.html` and you're happy with how they look, tell Claude:

> "Merge the current state of `harmonia-preview/index.html` into `p2p.html`. Keep the asset paths pointing to `harmonia-preview/assets/`. Here's the current p2p.html: [paste it]. Here's the updated preview: [paste it]."

Claude will produce a new `p2p.html` with your changes applied.

**What Claude will do:**
- Update HTML structure and content
- Preserve the `harmonia-preview/assets/` path references
- Keep the page title as "Join Our Testing Pool" (not "V3 App Preview")
- Flag any conflicts if the base p2p.html has since been updated differently

---

*README generated for Harmonia Engine · March 2026*  
*For questions: contact Avery via the team Slack or email*
