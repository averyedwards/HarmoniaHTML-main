/**
 * shared.js — Harmonia Engine
 * Common functionality used across all pages:
 *   - Theme initialisation & toggle
 *   - Mobile nav toggle
 *   - Active nav-link detection (based on current filename)
 *   - Celtic knot gradient application (SVG gradient overlay)
 *
 * Load order: shared.js → app.js
 */

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cookies are shared across all file:// pages in Firefox (unlike localStorage
 * which is partitioned per file by Total Cookie Protection).
 */
function _getThemePref() {
    try {
        const m = document.cookie.match(/(?:^|;\s*)harmonia-theme=(dark|light)/);
        if (m) return m[1];
    } catch (e) {}
    try {
        const v = localStorage.getItem('harmonia-theme');
        if (v) return v;
    } catch (e) {}
    return null;
}

function _saveThemePref(theme) {
    try { document.cookie = 'harmonia-theme=' + theme + '; path=/; max-age=31536000'; } catch (e) {}
    try { localStorage.setItem('harmonia-theme', theme); } catch (e) {}
}

(function initTheme() {
    const saved = _getThemePref() || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    _saveThemePref(next);
    if (typeof applyKnotGradient === 'function') applyKnotGradient();
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE NAV
// ─────────────────────────────────────────────────────────────────────────────

function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks) navLinks.classList.toggle('mobile-open');
    if (hamburger) hamburger.classList.toggle('active');
}

// Close mobile nav when a link is clicked
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks) navLinks.classList.remove('mobile-open');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE NAV LINK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the current page filename from the URL and adds the .active class
 * to the matching nav link.
 *
 * Page → nav-id mapping:
 *   index.html          → nav-home
 *   why-harmonia.html   → nav-why-harmonia
 *   partnerships.html   → nav-partnerships
 *   team.html           → nav-team
 *   local-network.html  → nav-local-network
 *   p2p.html            → nav-p2p
 *   contact.html        → nav-contact
 */
(function setActiveNavLink() {
    var pathname = window.location.pathname;
    var filename = pathname.split('/').pop() || 'index.html';

    // Normalise — treat empty string and trailing slash as home
    if (!filename || filename === '') filename = 'index.html';

    var pageMap = {
        'index.html':         'nav-home',
        'why-harmonia.html':  'nav-why-harmonia',
        'partnerships.html':  'nav-partnerships',
        'team.html':          'nav-team',
        'local-network.html': 'nav-local-network',
        'p2p.html':           'nav-p2p',
        'contact.html':       'nav-contact'
    };

    var navId = pageMap[filename];
    if (navId) {
        // May be called before DOMContentLoaded; defer if needed
        function applyActive() {
            var el = document.getElementById(navId);
            if (el) el.classList.add('active');
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyActive);
        } else {
            applyActive();
        }
    }
})();

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL LOCK DURING PAGE ENTRANCE ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
// pageFadeIn begins at translateY(15px), pushing the page 15px below the
// viewport and triggering a momentary scrollbar.  Lock overflow-y for the
// animation duration (0.5 s) then release.
(function () {
    document.body.style.overflowY = 'hidden';
    setTimeout(function () { document.body.style.overflowY = ''; }, 520);
}());

// ─────────────────────────────────────────────────────────────────────────────
// SYNTHESIS KNOT — SVG GRADIENT OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Injects hidden SVG gradient defs into <body> and applies them to all
 * .synthesis-knot-icon path elements.  Re-runs when the theme changes.
 */
(function () {
    var GRAD_LIGHT = [
        '<linearGradient id="knotGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
        '<stop offset="0%"   stop-color="#722F37"/>',
        '<stop offset="40%"  stop-color="#8B3A3A"/>',
        '<stop offset="60%"  stop-color="#C49040"/>',
        '<stop offset="100%" stop-color="#D4A853"/>',
        '</linearGradient>'
    ].join('');

    var GRAD_DARK = [
        '<linearGradient id="knotGradDark" x1="0%" y1="0%" x2="100%" y2="100%">',
        '<stop offset="0%"   stop-color="#a04558"/>',
        '<stop offset="40%"  stop-color="#b05060"/>',
        '<stop offset="60%"  stop-color="#d4a040"/>',
        '<stop offset="100%" stop-color="#F0C86E"/>',
        '</linearGradient>'
    ].join('');

    function ensureDefs() {
        if (document.getElementById('knotGrad')) return;
        var ns  = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
        svg.innerHTML = '<defs>' + GRAD_LIGHT + GRAD_DARK + '</defs>';
        document.body.insertBefore(svg, document.body.firstChild);
    }

    window.applyKnotGradient = function applyKnotGradient() {
        ensureDefs();
        var isDark  = document.documentElement.getAttribute('data-theme') === 'dark';
        var gradId  = isDark ? 'knotGradDark' : 'knotGrad';
        var paths   = document.querySelectorAll('.synthesis-knot-icon path');
        for (var i = 0; i < paths.length; i++) {
            paths[i].setAttribute('fill', 'url(#' + gradId + ')');
            paths[i].style.fill = '';
        }
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.applyKnotGradient);
    } else {
        window.applyKnotGradient();
    }

    // Re-run on theme toggle (MutationObserver on html[data-theme])
    var obs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
            if (muts[i].attributeName === 'data-theme') {
                window.applyKnotGradient();
                break;
            }
        }
    });
    obs.observe(document.documentElement, { attributes: true });

    // Re-apply over the synthesis card fade-in (~3 s)
    var ticks = 0;
    var iv = setInterval(function () {
        window.applyKnotGradient();
        if (++ticks >= 40) clearInterval(iv);
    }, 300);

    // Expose for app.js animation hooks
    window._applyKnotGradient = window.applyKnotGradient;
})();
