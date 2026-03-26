/**
 * data.js — Harmonia Preview
 *
 * All static data constants used across the app:
 *   - U            Current user object
 *   - CANDS        Swipe-deck candidate profiles
 *   - MATCHES      Confirmed matches with chat history
 *   - CALDATA      Admin calibration review examples
 *   - STATS        Admin dashboard counters
 *   - EFF          Gemini drift / efficiency data points
 *   - FQ           Psychometric questionnaire prompts
 *   - HM           Coverage heatmap values (7 sins × 6 questions)
 *   - SINS         Seven Deadly Sins label array
 *   - AREPLIES     Auto-reply strings for chat simulation
 */

/* ── Current user ───────────────────────────────────────────── */
const U = {
  fn:    'Alex',
  age:   28,
  email: 'alex@example.com',
  loc:   'Central London',
  sins: {
    wrath:    { s: -2.1, c: .85, w: 1.5, f: 'Conflict Style' },
    sloth:    { s:  .1,  c: .99, w: 1.3, f: 'Drive'          },
    pride:    { s:  .95, c: .98, w: 1.0, f: 'Ego'            },
    lust:     { s:  .85, c: .75, w: 1.0, f: 'Spontaneity'    },
    greed:    { s: -1.2, c: .72, w: 1.0, f: 'Generosity'     },
    gluttony: { s:  .4,  c: .68, w:  .7, f: 'Moderation'     },
    envy:     { s: -.5,  c: .62, w:  .7, f: 'Contentment'    },
  },
};

/* ── Swipe-deck candidates ──────────────────────────────────── */
const CANDS = [
  { n: 'Sophia',   a: 26, l: 'Shoreditch',   ph: 3, t: ['Adventurous', 'Generous',   'Creative']    },
  { n: 'Isabella', a: 24, l: 'Camden',        ph: 4, t: ['Ambitious',   'Empathetic', 'Direct']      },
  { n: 'Olivia',   a: 29, l: 'Notting Hill',  ph: 2, t: ['Peacekeeper', 'Spontaneous','Curious']     },
  { n: 'Amara',    a: 27, l: 'Brixton',       ph: 3, t: ['Independent', 'Passionate', 'Loyal']       },
  { n: 'Chloe',    a: 25, l: 'Greenwich',     ph: 4, t: ['Witty',       'Generous',   'Adventurous'] },
  { n: 'Priya',    a: 28, l: 'Hackney',       ph: 3, t: ['Driven',      'Kind',       'Confident']   },
  { n: 'Mia',      a: 23, l: 'Islington',     ph: 2, t: ['Creative',    'Empathetic', 'Calm']        },
  { n: 'Elena',    a: 30, l: 'Kensington',    ph: 4, t: ['Intellectual','Spontaneous','Warm']        },
];

/* ── Confirmed matches ──────────────────────────────────────── */
const MATCHES = [
  {
    n: 'Priya S.', a: 28, i: 'P',
    tl: 'Warm communicator with strong values',
    wtm: 91, v: 88, p: 92, b: 94,
    t:  ['Conflict-avoidant', 'Generous', 'Spontaneous', 'Content'],
    bg: 'Instant Spark', bc: 'bdg-g',
    lm: 'That restaurant sounds amazing! When were you thinking?',
    msgs: [
      { f: 'them', t: 'Hey! I loved your profile. The peacekeeper trait resonated.',       tm: '2:14 PM' },
      { f: 'you',  t: "Thanks! I noticed we share the generous trait. Been to Borough Market?", tm: '2:18 PM' },
      { f: 'them', t: "Yes! Every Saturday. There's this incredible cheese stall...",      tm: '2:21 PM' },
      { f: 'you',  t: 'We should go together sometime. I know a great tapas place.',       tm: '2:25 PM' },
      { f: 'them', t: 'That restaurant sounds amazing! When were you thinking?',           tm: '2:28 PM' },
    ],
  },
  {
    n: 'Elena M.', a: 30, i: 'E',
    tl: 'Thoughtful intellectual with adventurous spirit',
    wtm: 82, v: 85, p: 78, b: 84,
    t:  ['Conflict-avoidant', 'Spontaneous', 'Generous'],
    bg: 'Strong Chemistry', bc: 'bdg-g',
    lm: 'Just finished the book you recommended!',
    msgs: [
      { f: 'them', t: 'Hi! Your profile is fascinating. What got you into personality science?', tm: '11:03 AM' },
      { f: 'you',  t: 'Always been curious about what makes people tick. You?',                  tm: '11:20 AM' },
      { f: 'them', t: 'Just finished the book you recommended!',                                 tm: '1:45 PM'  },
    ],
  },
  {
    n: 'Sarah K.', a: 25, i: 'S',
    tl: 'Creative problem-solver, deep connection',
    wtm: 75, v: 72, p: 81, b: 71,
    t:  ['Achievement-oriented', 'Empathetic', 'Direct'],
    bg: 'Deep Connection', bc: 'bdg-m',
    lm: null, msgs: [],
  },
  {
    n: 'Maya R.', a: 27, i: 'M',
    tl: 'Balance of ambition and leisure',
    wtm: 68, v: 79, p: 52, b: 74,
    t:  ['Independent', 'Curious', 'Reserved'],
    bg: 'Potential', bc: 'bdg-x',
    lm: null, msgs: [],
  },
];

/* ── Admin calibration review examples ─────────────────────── */
const CALDATA = [
  {
    qn: 3, sin: 'Wrath',
    txt: "I'd take a deep breath first. Getting angry won't fix it. I'd calmly explain we all committed to equal effort and ask what happened.",
    sc: -2.1, co: .85,
    ev: "Getting angry won't fix it",
  },
  {
    qn: 1, sin: 'Greed',
    txt: "I'd split it evenly. Life's too short to nitpick over who had extra chips. If someone ordered much more, I'd mention it casually.",
    sc: -1.8, co: .72,
    ev: "split it evenly. Life's too short",
  },
  {
    qn: 5, sin: 'Lust',
    txt: "I'd be torn. But my friend needs me — that comes first. I'd text the date, explain, and hope they understand.",
    sc: -.5, co: .64,
    ev: "my friend needs me — that comes first",
  },
];

/* ── Admin dashboard counters ───────────────────────────────── */
const STATS = { total: 147, pend: 23, appr: 89, corr: 31, rej: 4 };

/* ── Gemini drift / efficiency data points ──────────────────── */
const EFF = [
  { b: 1, d: 2.1 },
  { b: 2, d: 1.8 },
  { b: 3, d: 1.5 },
  { b: 4, d: 1.2 },
  { b: 5, d: 1.0 },
  { b: 6, d:  .9 },
  { b: 7, d: .85 },
  { b: 8, d: .78 },
];

/* ── Psychometric questionnaire prompts ─────────────────────── */
const FQ = [
  "The bill arrives at a group dinner. Everyone contributed differently. What's your approach to splitting it?",
  "Your car breaks down — repair quote £1,200. Walk me through how you handle it.",
  "Free weekend — no obligations. What does your ideal weekend look like?",
  "Group project, one person hasn't done their share. Deadline is tomorrow. What do you do?",
  "Best friend calls in tears, needing help — but you're about to leave for a date. What do you do?",
  "Someone you respect gives feedback about a blind spot in your personality. How do you react?",
];

/* ── Coverage heatmap (7 sins × 6 questions) ────────────────── */
const HM = [
  [6, 3, 7, 2, 5, 4],
  [3, 1, 4, 6, 2, 5],
  [5, 7, 3, 4, 6, 2],
  [4, 2, 6, 1, 3, 7],
  [2, 5, 1, 3, 7, 4],
  [7, 4, 2, 5, 1, 3],
  [1, 6, 5, 7, 4, 2],
];

/* ── Seven Deadly Sins labels ───────────────────────────────── */
const SINS = ['Wrath', 'Sloth', 'Pride', 'Lust', 'Greed', 'Gluttony', 'Envy'];

/* ── Chat auto-replies ──────────────────────────────────────── */
const AREPLIES = [
  "That's such a great point! Couldn't agree more.",
  "Haha so right! We should definitely do that.",
  "Interesting perspective! Tell me more.",
  "Just thinking the same thing! Great minds.",
];
