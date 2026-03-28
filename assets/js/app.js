
        // Apply logo to all elements with data-harmonia-logo attribute
        function initHarmoniaLogos() {
            document.querySelectorAll('[data-harmonia-logo]').forEach(img => {
                img.src = HARMONIA_LOGO;
            });
        }

        // Mobile Navigation Toggle
        function toggleMobileNav() {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            navLinks.classList.toggle('mobile-open');
            hamburger.classList.toggle('active');
        }

        // Home radar animation
        const statusTexts = ['SYNTHESIZING...', 'ANALYZING HLA...', 'CHECKING RESONANCE...', 'CALCULATING...', 'MATCHING...'];
        let statusIndex = 0;
        function animateRadar() {
            const radarA = document.getElementById('radarA');
            const radarB = document.getElementById('radarB');
            const status = document.getElementById('radar-status');
            if (!radarA || !radarB) return;

            setInterval(() => {
                const rand = () => Math.random() * 30 - 15;
                radarA.setAttribute('points', [
                    `200,${50+rand()}`, `${340+rand()},${125+rand()}`, `${330+rand()},${275+rand()}`,
                    `200,${345+rand()}`, `${60+rand()},${270+rand()}`, `${70+rand()},${130+rand()}`
                ].join(' '));
                radarB.setAttribute('points', [
                    `200,${70+rand()}`, `${320+rand()},${140+rand()}`, `${325+rand()},${265+rand()}`,
                    `200,${330+rand()}`, `${80+rand()},${260+rand()}`, `${75+rand()},${135+rand()}`
                ].join(' '));
            }, 2000);

            if (status) {
                setInterval(() => {
                    status.style.opacity = '0';
                    setTimeout(() => {
                        statusIndex = (statusIndex + 1) % statusTexts.length;
                        status.textContent = statusTexts[statusIndex];
                        status.style.opacity = '1';
                    }, 300);
                }, 3000);
            }
        }

        // Why Harmonia slider
        function initWhySlider() {
            const slider = document.getElementById('scienceSlider');
            if (!slider) return;
            const cards = slider.querySelectorAll('.science-card');
            const dots = document.querySelectorAll('.pagination-dot');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            let currentIndex = 0;
            let autoRotateInterval = null;

            function updateDots(i) {
                dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
                currentIndex = i;
            }

            function triggerCardAnimations(i) {
                if (window.triggerVisualCardAnimation) {
                    window.triggerVisualCardAnimation(i === 0);
                }
                if (window.triggerPersonalityCardAnimation) {
                    window.triggerPersonalityCardAnimation(i === 1);
                }
                if (window.triggerGeneticCardAnimation) {
                    window.triggerGeneticCardAnimation(i === 2);
                }
                if (window.triggerSynthesisCardAnimation && i === 3) {
                    window.triggerSynthesisCardAnimation(true);
                }
            }
            
            function scrollToCard(i) {
                i = Math.max(0, Math.min(i, cards.length - 1));
                cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                updateDots(i);
                // Fallback: trigger animation directly after scroll settles.
                // scrollIntoView does not reliably fire scroll events on the container
                // in all browsers, so this guarantees the animation fires.
                setTimeout(() => triggerCardAnimations(i), 500);
            }

            // Auto-rotate every 20 seconds
            function startAutoRotate() {
                stopAutoRotate();
                autoRotateInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % cards.length;
                    scrollToCard(nextIndex);
                }, 20000);
            }
            
            function stopAutoRotate() {
                if (autoRotateInterval) {
                    clearInterval(autoRotateInterval);
                    autoRotateInterval = null;
                }
            }
            
            // Restart auto-rotate after user interaction
            function resetAutoRotate() {
                stopAutoRotate();
                startAutoRotate();
            }

            if (prevBtn) prevBtn.onclick = () => { scrollToCard(currentIndex - 1); resetAutoRotate(); };
            if (nextBtn) nextBtn.onclick = () => { scrollToCard(currentIndex + 1); resetAutoRotate(); };
            dots.forEach((d, i) => d.onclick = () => { scrollToCard(i); resetAutoRotate(); });
            
            // Click on card to center it
            cards.forEach((card, i) => {
                card.style.cursor = 'pointer';
                card.onclick = () => { scrollToCard(i); resetAutoRotate(); };
            });

            let scrollTimeout;
            slider.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const rect = slider.getBoundingClientRect();
                    const center = rect.left + rect.width / 2;
                    let closest = 0, minDist = Infinity;
                    cards.forEach((c, i) => {
                        const cr = c.getBoundingClientRect();
                        const dist = Math.abs(center - (cr.left + cr.width / 2));
                        if (dist < minDist) { minDist = dist; closest = i; }
                    });
                    updateDots(closest);
                    // Only trigger animations once scroll has fully settled
                    triggerCardAnimations(closest);
                }, 50);
            });
            
            // Trigger card 0 animation when slider first enters the viewport.
            // The scroll listener only fires on internal slider scroll, so card 0
            // (the default visible card) would never get its animation triggered
            // without this observer.
            const sliderObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    triggerCardAnimations(currentIndex);
                    sliderObserver.disconnect();
                }
            }, { threshold: 0.2 });
            sliderObserver.observe(slider);

            // Start auto-rotate
            startAutoRotate();

            // Pause on hover, resume on leave
            slider.addEventListener('mouseenter', stopAutoRotate);
            slider.addEventListener('mouseleave', startAutoRotate);
        }

        // Team slider
        function initTeamSlider() {
            const slider = document.getElementById('teamSlider');
            if (!slider) return;
            const prevBtn = document.querySelector('.slider-arrow.prev');
            const nextBtn = document.querySelector('.slider-arrow.next');
            const dotsContainer = document.querySelector('.slider-dots');
            const cards = slider.querySelectorAll('.team-card');
            const totalCards = cards.length; // 6
            
            function getCardWidth() {
                const card = cards[0];
                if (!card) return 300;
                const gap = parseFloat(getComputedStyle(slider).gap) || 16;
                return card.offsetWidth + gap;
            }

            function isTablet() {
                const w = window.innerWidth;
                return w >= 768 && w <= 1024;
            }

            function getVisibleCount() {
                const w = window.innerWidth;
                // Tablet (768-1024): 3 visible = 2 pages
                // Mobile (<768): 1 visible = 6 pages
                if (w >= 768 && w <= 1024) return 3;
                return 1;
            }

            function getDotsCount() {
                const visible = getVisibleCount();
                return Math.ceil(totalCards / visible);
            }

            function getCurrentCardIndex() {
                const sliderRect = slider.getBoundingClientRect();
                const sliderCenter = sliderRect.left + sliderRect.width / 2;
                
                let closestIndex = 0;
                let closestDistance = Infinity;
                
                cards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = cardRect.left + cardRect.width / 2;
                    const distance = Math.abs(sliderCenter - cardCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });
                
                return closestIndex;
            }

            function createDots() {
                if (!dotsContainer) return;
                // Hide dots on tablet
                if (isTablet()) {
                    dotsContainer.style.display = 'none';
                    return;
                }
                dotsContainer.style.display = '';
                const count = getDotsCount();
                dotsContainer.innerHTML = '';
                for (let i = 0; i < count; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'dot' + (i === 0 ? ' active' : '');
                    dot.dataset.index = i;
                    dotsContainer.appendChild(dot);
                }
                attachDotListeners();
            }

            function updateDots() {
                if (isTablet()) return;
                const dots = dotsContainer.querySelectorAll('.dot');
                const cardIndex = getCurrentCardIndex();
                const visible = getVisibleCount();
                const pageIndex = Math.floor(cardIndex / visible);
                
                dots.forEach((d, i) => {
                    d.classList.toggle('active', i === pageIndex);
                });
            }

            function scrollToPage(pageIndex) {
                const visible = getVisibleCount();
                const cardIndex = pageIndex * visible;
                const card = cards[cardIndex];
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }

            function attachDotListeners() {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((d) => {
                    d.onclick = () => {
                        const pageIndex = parseInt(d.dataset.index);
                        scrollToPage(pageIndex);
                    };
                });
            }

            // Tablet: click card to center it
            cards.forEach((card) => {
                card.addEventListener('click', () => {
                    if (isTablet()) {
                        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                });
            });

            if (nextBtn) nextBtn.onclick = () => slider.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
            if (prevBtn) prevBtn.onclick = () => slider.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });

            slider.addEventListener('scroll', updateDots);
            
            // Recreate dots on resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    createDots();
                    updateDots();
                }, 150);
            });

            slider.style.cursor = 'grab';
            
            // Initial setup
            createDots();
            updateDots();
        }

        // Forms
        function initForms() {
            const intForm = document.getElementById('integrationForm');
            if (intForm) {
                intForm.onsubmit = (e) => {
                    e.preventDefault();
                    const btn = intForm.querySelector('.btn-regal-submit');
                    const msg = document.getElementById('integrationMessage');
                    const orig = btn ? btn.innerHTML : '';
                    if (btn) { btn.style.opacity = '0.6'; btn.innerHTML = 'Processing...'; }
                    setTimeout(() => {
                        intForm.reset();
                        if (btn) { btn.style.opacity = '1'; btn.innerHTML = 'Request Sent'; }
                        if (msg) { msg.innerHTML = '<span style="color:var(--gold)">Request received. We will be in touch shortly.</span>'; msg.style.display = 'block'; }
                        setTimeout(() => { if (btn) btn.innerHTML = orig; }, 3000);
                    }, 1500);
                };
            }

            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.onsubmit = (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('submitBtn');
                    const txt = btn ? btn.querySelector('.btn-text') : null;
                    const suc = document.getElementById('formSuccess');
                    if (btn) btn.classList.add('processing');
                    if (txt) txt.textContent = 'Processing...';
                    setTimeout(() => {
                        contactForm.reset();
                        document.querySelectorAll('.contact-card').forEach(c => c.classList.remove('active'));
                        if (suc) suc.classList.add('visible');
                        if (btn) btn.classList.remove('processing');
                        if (txt) txt.textContent = 'Send Message';
                        setTimeout(() => { if (suc) suc.classList.remove('visible'); }, 3000);
                    }, 1500);
                };
            }

            const waitForm = document.getElementById('waitlistForm');
            if (waitForm) {
                waitForm.onsubmit = (e) => {
                    e.preventDefault();
                    const msg = document.getElementById('waitlistMessage');
                    setTimeout(() => {
                        waitForm.reset();
                        if (msg) { msg.innerHTML = '<span style="color:var(--gold)">You\'re on the list! We\'ll be in touch soon.</span>'; msg.style.display = 'block'; }
                    }, 1000);
                };
            }
        }

        function selectContactType(card, type) {
            document.querySelectorAll('.contact-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const dd = document.getElementById('contact-type');
            if (dd) dd.value = type;
            const msg = document.getElementById('contact-message');
            if (msg) msg.focus();
        }

        // =============================================
        // PARTNERSHIPS PAGE - DYNAMIC TIER SYSTEM
        // =============================================
        
        // Abstract SVG Icons for Partnerships
        const partnershipsAbstractIcons = {
            layers: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <circle cx="50" cy="50" r="45" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
                <circle cx="50" cy="50" r="30" stroke="var(--gold)" stroke-width="1.5" fill="none" opacity="0.5"/>
                <circle cx="50" cy="50" r="15" stroke="var(--maroon)" stroke-width="2" fill="none"/>
                <line x1="50" y1="5" x2="50" y2="20" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <line x1="50" y1="80" x2="50" y2="95" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <line x1="5" y1="50" x2="20" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <line x1="80" y1="50" x2="95" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
            </svg>`,
            shield: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <path d="M50 10 L85 25 L85 50 Q85 75 50 90 Q15 75 15 50 L15 25 Z" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <path d="M50 25 L70 35 L70 50 Q70 65 50 75 Q30 65 30 50 L30 35 Z" stroke="var(--maroon)" stroke-width="1" fill="none" opacity="0.6"/>
                <circle cx="50" cy="50" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
            </svg>`,
            platform: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <circle cx="50" cy="20" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <circle cx="20" cy="70" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <circle cx="80" cy="70" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <line x1="50" y1="28" x2="25" y2="63" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
                <line x1="50" y1="28" x2="75" y2="63" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
                <line x1="28" y1="70" x2="72" y2="70" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
                <circle cx="50" cy="50" r="25" stroke="var(--gold)" stroke-width="0.5" fill="none" stroke-dasharray="4 4"/>
            </svg>`,
            validation: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <circle cx="50" cy="50" r="40" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
                <circle cx="50" cy="50" r="30" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <path d="M30 50 L45 65 L70 35" stroke="var(--maroon)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            metrics: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <rect x="15" y="60" width="15" height="30" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="42" y="40" width="15" height="50" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="69" y="20" width="15" height="70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <line x1="10" y1="90" x2="90" y2="90" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <path d="M20 55 L50 35 L77 15" stroke="var(--gold)" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
            </svg>`,
            support: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <path d="M20 50 Q20 20 50 20 Q80 20 80 50" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="15" y="50" width="15" height="25" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="70" y="50" width="15" height="25" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <path d="M30 75 L30 80 Q30 85 40 85 L55 85" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <circle cx="60" cy="85" r="5" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
            </svg>`,
            deploy: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <path d="M50 15 Q70 30 70 50 L50 70 L30 50 Q30 30 50 15" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <circle cx="50" cy="40" r="8" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <path d="M30 55 L20 70 L35 65" stroke="var(--gold)" stroke-width="1" fill="none"/>
                <path d="M70 55 L80 70 L65 65" stroke="var(--gold)" stroke-width="1" fill="none"/>
                <path d="M45 70 L50 85 L55 70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
            </svg>`,
            realtime: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <circle cx="50" cy="50" r="40" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <circle cx="50" cy="50" r="10" stroke="var(--maroon)" stroke-width="2" fill="none"/>
                <line x1="50" y1="10" x2="50" y2="25" stroke="var(--gold)" stroke-width="1.5"/>
                <line x1="50" y1="75" x2="50" y2="90" stroke="var(--gold)" stroke-width="1.5"/>
                <line x1="10" y1="50" x2="25" y2="50" stroke="var(--gold)" stroke-width="1.5"/>
                <line x1="75" y1="50" x2="90" y2="50" stroke="var(--gold)" stroke-width="1.5"/>
            </svg>`,
            uptime: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <rect x="20" y="15" width="60" height="20" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="20" y="40" width="60" height="20" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <rect x="20" y="65" width="60" height="20" rx="3" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <circle cx="30" cy="25" r="3" fill="var(--gold)"/>
                <circle cx="30" cy="50" r="3" fill="var(--gold)"/>
                <circle cx="30" cy="75" r="3" fill="var(--maroon)"/>
            </svg>`,
            custom: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <line x1="20" y1="25" x2="80" y2="25" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <line x1="20" y1="50" x2="80" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <line x1="20" y1="75" x2="80" y2="75" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
                <circle cx="35" cy="25" r="8" stroke="var(--gold)" stroke-width="1.5" fill="var(--cream)"/>
                <circle cx="60" cy="50" r="8" stroke="var(--maroon)" stroke-width="1.5" fill="var(--cream)"/>
                <circle cx="45" cy="75" r="8" stroke="var(--gold)" stroke-width="1.5" fill="var(--cream)"/>
            </svg>`,
            audits: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <rect x="15" y="20" width="70" height="65" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <line x1="15" y1="35" x2="85" y2="35" stroke="var(--gold)" stroke-width="1"/>
                <line x1="35" y1="20" x2="35" y2="28" stroke="var(--maroon)" stroke-width="2"/>
                <line x1="65" y1="20" x2="65" y2="28" stroke="var(--maroon)" stroke-width="2"/>
                <path d="M25 55 L32 62 L45 48" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
                <path d="M55 55 L62 62 L75 48" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
            </svg>`,
            team: `<svg viewBox="0 0 100 100" class="abstract-icon">
                <circle cx="50" cy="25" r="12" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <path d="M30 70 Q30 50 50 50 Q70 50 70 70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
                <circle cx="20" cy="40" r="8" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
                <path d="M5 75 Q5 60 20 60 Q35 60 35 75" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
                <circle cx="80" cy="40" r="8" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
                <path d="M65 75 Q65 60 80 60 Q95 60 95 75" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
            </svg>`
        };

        // Tier Data for Partnerships
        const partnershipsTierData = {
            default: {
                title: "The Matching Layer You're Missing",
                intro: "Industry retention rates have stalled at <a href='https://www.businessofapps.com/data/dating-app-benchmarks/' target='_blank' class='stat-link'>3.3%</a>. Over <a href='https://www.businessofapps.com/data/dating-app-market/' target='_blank' class='stat-link'>half the market's revenue</a> sits with one conglomerate. Harmonia exists for independent platforms ready to compete differently. Shared engine. Individual identity. A dating market where quality determines who wins.",
                boxes: [
                    { key: 'layers', title: '3-Layer Matching', desc: 'Bio, Psychological, and Neural compatibility.', icon: 'layers',
                      modal: { desc: 'Our proprietary algorithm analyzes compatibility across three distinct dimensions, creating a holistic view of potential connections.', bullets: ['Visual attraction analysis using advanced neural networks', 'Personality compatibility through psychometric assessment', 'HLA genetic markers for biological chemistry signals'] } },
                    { key: 'privacy', title: 'Privacy-First Architecture', desc: 'GDPR/CCPA compliant by design.', icon: 'shield',
                      modal: { desc: 'We process genetic data client-side, extract only HLA markers, then permanently delete raw files.', bullets: ['Zero raw genetic data stored on our servers', 'Full GDPR and CCPA compliance built-in', 'SOC 2 Type II certification in progress'] } },
                    { key: 'platform', title: 'Platform Agnostic', desc: 'Works with any tech stack (iOS, Android, Web).', icon: 'platform',
                      modal: { desc: 'RESTful API design means Harmonia integrates seamlessly with your existing infrastructure.', bullets: ['SDKs available for Swift, Kotlin, and JavaScript', 'Webhook support for real-time score updates', 'Comprehensive documentation and sandbox environment'] } }
                ],
                placeholder: 'Tell us about your platform...',
                cta: 'Request Access'
            },
            pilot: {
                title: "Prove ROI First",
                intro: "Bumble spends <a href='https://www.aircfo.com/resources/bumble-s-1-teardown' target='_blank' class='stat-link'>$56</a> to acquire a single user. Everyone else doesn't have that runway. Harmonia runs a 30-day pilot. Real cohort. Measured lift. ROI before contract.",
                boxes: [
                    { key: 'validation', title: 'Zero-Risk Validation', desc: 'Test retention lift on a specific cohort.', icon: 'validation',
                      modal: { desc: 'Run a controlled experiment with a segment of your user base with statistical rigor.', bullets: ['A/B testing framework included', 'Statistically significant sample sizing guidance', 'No long-term commitment required'] } },
                    { key: 'metrics', title: 'Success Metrics Dashboard', desc: 'Real-time view of match quality improvements.', icon: 'metrics',
                      modal: { desc: 'Track the metrics that matter: retention lift, session length, match-to-message conversion.', bullets: ['Day 1, 7, and 30 retention comparisons', 'Match success rate tracking', 'Exportable reports for stakeholder presentations'] } },
                    { key: 'support', title: 'Dedicated Support', desc: 'Integration guidance during your 30-day trial.', icon: 'support',
                      modal: { desc: 'Our partnership team is with you from kickoff to final analysis.', bullets: ['Named integration specialist assigned', 'Weekly check-in calls during pilot', 'Post-pilot strategy session included'] } }
                ],
                placeholder: "I'm interested in the 30-day pilot to test retention lift...",
                cta: 'Start 30-Day Pilot'
            },
            api: {
                title: "Live in Weeks, Not Months",
                intro: "Only <a href='https://measuringu.com/online-dating-benchmark-2024/' target='_blank' class='stat-link'>11%</a> of dating app users think their algorithm actually matches them well. Harmonia exists to fix that. Deploy our compatibility engine in weeks. Battle-tested. Fully documented. 99.9% uptime.",
                boxes: [
                    { key: 'deploy', title: 'Quick Deployment', desc: 'Live in weeks with comprehensive docs.', icon: 'deploy',
                      modal: { desc: 'Our integration team has refined the onboarding process to get you from contract to production in 2-4 weeks.', bullets: ['Step-by-step integration guides', 'Sandbox environment for development', 'Migration support from existing systems'] } },
                    { key: 'realtime', title: 'Real-Time Scoring', desc: 'Instant compatibility results during swiping.', icon: 'realtime',
                      modal: { desc: 'Our algorithm calculates compatibility scores in milliseconds, enabling seamless integration into your swipe experience.', bullets: ['Sub-100ms response times globally', 'Batch scoring for feed optimization', 'Webhook support for async workflows'] } },
                    { key: 'uptime', title: '99.9% Uptime SLA', desc: 'Enterprise reliability you don\'t have to build.', icon: 'uptime',
                      modal: { desc: 'We run on Google Cloud infrastructure with multi-region redundancy.', bullets: ['Service Level Agreement with credits', '24/7 monitoring and incident response', 'Transparent status page and incident history'] } }
                ],
                placeholder: "We're ready to integrate the Harmonia API...",
                cta: 'Request Integration Docs'
            },
            core: {
                title: "Your Retention Engine, Built Together",
                intro: "Users are <a href='https://befriend.cc/2025/12/29/great-deceleration-dating-apps-losing-trust/' target='_blank' class='stat-link'>42%</a> more likely to find meaningful connections on platforms built for their community. Harmonia co-develops custom weights tailored to your user base. Your match engine evolves as fast as your market.",
                boxes: [
                    { key: 'custom', title: 'Custom Algorithm Tuning', desc: 'Bespoke weighting models trained on your engagement data.', icon: 'custom',
                      modal: { desc: 'We analyze your user behavior patterns and optimize the three-layer weights specifically for your audience.', bullets: ['Deep-dive analysis of your user engagement data', 'Custom weight optimization for your niche', 'Continuous model retraining as your user base evolves'] } },
                    { key: 'audits', title: 'Strategic Quarterly Audits', desc: 'Data-driven reviews to optimize match success rates.', icon: 'audits',
                      modal: { desc: 'Every quarter, our data science team reviews your performance metrics and recommends optimizations.', bullets: ['Comprehensive performance review presentation', 'Actionable optimization recommendations', 'Roadmap alignment for upcoming features'] } },
                    { key: 'team', title: 'Dedicated Implementation Team', desc: 'Direct Slack access to our engineers.', icon: 'team',
                      modal: { desc: 'Core Engine partners get a private Slack channel with direct access to our engineering team.', bullets: ['Private Slack channel with Harmonia engineers', 'Named account manager and technical lead', 'Priority incident response and feature requests'] } }
                ],
                placeholder: "We are looking for a custom integration to solve specific churn issues...",
                cta: 'Inquire About Partnership'
            }
        };

        let partnershipsCurrentTier = 'default';

        function initPartnerships() {
            renderPartnershipsBoxes(partnershipsTierData.default.boxes);
            
            const interestDropdown = document.getElementById('partnershipInterest');
            if (interestDropdown) {
                interestDropdown.addEventListener('change', function() {
                    const value = this.value;
                    if (value === 'default') {
                        this.classList.remove('tier-selected');
                        updatePartnershipsContent('default');
                    } else {
                        this.classList.add('tier-selected');
                        updatePartnershipsContent(value);
                    }
                });
            }

            // Tier tab click handlers (mobile/tablet)
            const tierTabs = document.querySelectorAll('.partnerships-tier-tabs .tier-tab');
            tierTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tier = this.dataset.tier;
                    
                    // Update active tab
                    tierTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update content
                    updatePartnershipsContent(tier);
                    
                    // Sync dropdown value (for form submission)
                    if (interestDropdown) {
                        interestDropdown.value = tier;
                        if (tier === 'default') {
                            interestDropdown.classList.remove('tier-selected');
                        } else {
                            interestDropdown.classList.add('tier-selected');
                        }
                    }
                });
            });

            const form = document.getElementById('partnershipsIntegrationForm');
            if (form) {
                form.addEventListener('submit', handlePartnershipsSubmit);
            }

            const modalOverlay = document.getElementById('partnershipsModalOverlay');
            if (modalOverlay) {
                modalOverlay.addEventListener('click', function(e) {
                    if (e.target === this) closePartnershipsModal();
                });
            }
        }

        function updatePartnershipsContent(tier) {
            const wrapper = document.getElementById('partnershipsContentWrapper');
            const data = partnershipsTierData[tier];
            if (!wrapper || !data) return;
            
            partnershipsCurrentTier = tier;
            wrapper.classList.add('fading');

            // Sync tier tabs (for mobile/tablet)
            const tierTabs = document.querySelectorAll('.partnerships-tier-tabs .tier-tab');
            tierTabs.forEach(tab => {
                if (tab.dataset.tier === tier) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            setTimeout(() => {
                document.getElementById('partnershipsDynamicTitle').textContent = data.title;
                document.getElementById('partnershipsDynamicIntro').innerHTML = data.intro;
                renderPartnershipsBoxes(data.boxes);
                document.getElementById('partnershipInquiry').placeholder = data.placeholder;
                const btnText = document.querySelector('#partnershipsSubmitBtn .btn-text');
                if (btnText) btnText.textContent = data.cta;
                wrapper.classList.remove('fading');
            }, 300);
        }

        function renderPartnershipsBoxes(boxes) {
            const container = document.getElementById('partnershipsFeatureBoxes');
            if (!container) return;
            container.innerHTML = boxes.map((box, i) => `
                <div class="feature-box fade-in" style="animation-delay:${0.5 + i * 0.1}s;animation-duration:0.3s" onclick="openPartnershipsModal('${box.key}')">
                    <div class="card-visual">${partnershipsAbstractIcons[box.icon]}</div>
                    <div class="box-content">
                        <h4 class="box-title">${box.title}</h4>
                        <p class="box-desc">${box.desc}</p>
                        <span class="tap-hint">Tap for details</span>
                        <div class="box-bullets">
                            <ul>
                                ${box.modal.bullets.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function openPartnershipsModal(key) {
            const data = partnershipsTierData[partnershipsCurrentTier];
            const box = data.boxes.find(b => b.key === key);
            if (!box) return;

            document.getElementById('partnershipsModalIcon').innerHTML = partnershipsAbstractIcons[box.icon];
            document.getElementById('partnershipsModalTitle').textContent = box.title;
            document.getElementById('partnershipsModalDesc').textContent = box.modal.desc;
            document.getElementById('partnershipsModalList').innerHTML = box.modal.bullets.map(b => `<li>${b}</li>`).join('');

            document.getElementById('partnershipsModalOverlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closePartnershipsModal() {
            document.getElementById('partnershipsModalOverlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        function handlePartnershipsSubmit(e) {
            e.preventDefault();
            const btn = document.getElementById('partnershipsSubmitBtn');
            const btnText = btn ? btn.querySelector('.btn-text') : null;
            const arrow = btn ? btn.querySelector('.arrow') : null;
            const message = document.getElementById('partnershipsFormMessage');

            if (btn) btn.classList.add('processing');
            if (btnText) btnText.textContent = 'Processing...';
            if (arrow) arrow.style.display = 'none';

            setTimeout(() => {
                document.getElementById('partnershipsIntegrationForm').reset();
                document.getElementById('partnershipInterest').value = 'default';
                document.getElementById('partnershipInterest').classList.remove('tier-selected');
                
                if (message) {
                    message.innerHTML = '<span style="color:var(--gold)">Request received. We will be in touch shortly.</span>';
                    message.style.display = 'block';
                }

                if (btn) btn.classList.remove('processing');
                if (btnText) btnText.textContent = 'Request Access';
                if (arrow) arrow.style.display = '';

                updatePartnershipsContent('default');

                setTimeout(() => {
                    if (message) message.style.display = 'none';
                }, 4000);
            }, 1500);
        }

        document.addEventListener('DOMContentLoaded', () => {
            animateRadar();
            initVisualCardAnimation(); // Must init before slider
            initPersonalityCardAnimation(); // Init personality animation
            initGeneticCardAnimation(); // Init genetic animation
            initSynthesisCardAnimation(); // Init synthesis animation
            initWhySlider();
            initTeamSlider();
            initForms();
            initPartnerships();
        });

        // =============================================
        // GLOBAL ANIMATION PAUSE STATE
        // =============================================
        let globalAnimationsPaused = false;

        // =============================================
        // VISUAL CARD EYE ANIMATION
        // =============================================
        let visualEyeState = {
            card: null,
            upperLid: null,
            lowerLid: null,
            isOpen: false,
            animating: false,
            hasTriggeredOnce: false,  // Track if this is the first time ever
            hasTriggeredThisVisit: false  // Track if triggered during this page visit
        };

        function initVisualCardAnimation() {
            const card = document.querySelector('.science-card.visual-card');
            if (!card) return;

            visualEyeState.card = card;
            visualEyeState.upperLid = card.querySelector('.upper-lid');
            visualEyeState.lowerLid = card.querySelector('.lower-lid');
            
            // Set up scroll listener for Why Harmonia section
            let scrollHandler = () => {
                if (!visualEyeState.hasTriggeredThisVisit && visualEyeState.card) {
                    // Check if Visual card is in view
                    const rect = visualEyeState.card.getBoundingClientRect();
                    const inView = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (inView) {
                        visualEyeState.hasTriggeredThisVisit = true;
                        window.triggerVisualCardAnimation(true);
                    }
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
            // Also trigger after short delay in case card is immediately visible
            setTimeout(scrollHandler, 300);
        }

        function triggerVisualCardAnimation(shouldOpen) {
            const { card, upperLid, lowerLid, isOpen, animating } = visualEyeState;
            const hasTriggeredOnce = visualEyeState.hasTriggeredOnce;
            
            if (!card || !upperLid || !lowerLid) return;
            if (globalAnimationsPaused) return; // Don't animate if paused
            if (shouldOpen && hasTriggeredOnce) return;
            if (shouldOpen === isOpen && !animating) return;

            visualEyeState.animating = true;

            // First time opening = 3 seconds, otherwise 1.5 seconds
            const isFirstTime = shouldOpen && !hasTriggeredOnce;
            const duration = isFirstTime ? 3000 : 1500;
            const durationCSS = isFirstTime ? '3s' : '1.5s';
            
            // Set CSS custom property for transitions
            card.style.setProperty('--eye-duration', durationCSS);

            // Closed: eyelids form an almond/circle shape (curves meeting at center)
            // Upper curves slightly up (control y=35), Lower curves slightly down (control y=65)
            const closedY = { 
                upper: [50, 35, 50],  // M30 50 Q50 35 70 50
                lower: [50, 65, 50]   // M35 50 Q50 65 65 50
            };
            
            // Open: eyelids separated wide to show pupil
            // Upper curves up (control y=20), Lower curves down (control y=85)
            const openY = { 
                upper: [40, 20, 40],  // M30 40 Q50 20 70 40
                lower: [70, 85, 70]   // M35 70 Q50 85 65 70
            };

            const startUpper = upperLid.getAttribute('d').match(/M\d+\s+(\d+)\s+Q\d+\s+(\d+)\s+\d+\s+(\d+)/);
            const startLower = lowerLid.getAttribute('d').match(/M\d+\s+(\d+)\s+Q\d+\s+(\d+)\s+\d+\s+(\d+)/);
            
            if (!startUpper || !startLower) return;

            const startUpperY = [parseFloat(startUpper[1]), parseFloat(startUpper[2]), parseFloat(startUpper[3])];
            const startLowerY = [parseFloat(startLower[1]), parseFloat(startLower[2]), parseFloat(startLower[3])];
            
            const targetUpperY = shouldOpen ? openY.upper : closedY.upper;
            const targetLowerY = shouldOpen ? openY.lower : closedY.lower;

            // Toggle CSS class for other transitions (position, opacity)
            if (shouldOpen) {
                card.classList.add('eye-open');
            } else {
                card.classList.remove('eye-open');
            }

            // Mark that we've triggered at least once
            if (isFirstTime) {
                visualEyeState.hasTriggeredOnce = true;
            }
            
            const startTime = performance.now();

            function animate(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease in-out
                const t = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                const uY1 = startUpperY[0] + (targetUpperY[0] - startUpperY[0]) * t;
                const uY2 = startUpperY[1] + (targetUpperY[1] - startUpperY[1]) * t;
                const uY3 = startUpperY[2] + (targetUpperY[2] - startUpperY[2]) * t;
                
                const lY1 = startLowerY[0] + (targetLowerY[0] - startLowerY[0]) * t;
                const lY2 = startLowerY[1] + (targetLowerY[1] - startLowerY[1]) * t;
                const lY3 = startLowerY[2] + (targetLowerY[2] - startLowerY[2]) * t;

                upperLid.setAttribute('d', `M30 ${uY1} Q50 ${uY2} 70 ${uY3}`);
                lowerLid.setAttribute('d', `M35 ${lY1} Q50 ${lY2} 65 ${lY3}`);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    visualEyeState.isOpen = shouldOpen;
                    visualEyeState.animating = false;
                }
            }

            requestAnimationFrame(animate);
        }
        
        // Reset the trigger state when navigating away from Why Harmonia
        // This resets the eye to closed state so it can animate again next visit
        function resetVisualCardAnimation() {
            visualEyeState.hasTriggeredThisVisit = false;
            visualEyeState.isOpen = false;
            
            // Reset to closed state immediately (no animation)
            if (visualEyeState.upperLid && visualEyeState.lowerLid && visualEyeState.card) {
                visualEyeState.upperLid.setAttribute('d', 'M30 50 Q50 35 70 50');
                visualEyeState.lowerLid.setAttribute('d', 'M35 50 Q50 65 65 50');
                visualEyeState.card.classList.remove('eye-open');
            }
        }

        // Make it globally accessible
        window.triggerVisualCardAnimation = triggerVisualCardAnimation;
        window.resetVisualCardAnimation = resetVisualCardAnimation;

        // =============================================
        // PERSONALITY CARD ANIMATION
        // =============================================
        let personalityState = {
            card: null,
            isOpen: false,
            animating: false,
            hasAnimatedOnce: false,
            timeouts: []
        };

        function initPersonalityCardAnimation() {
            personalityState.card = document.querySelector('.science-card.personality-card');
        }

        function clearPersonalityTimeouts() {
            personalityState.timeouts.forEach(t => clearTimeout(t));
            personalityState.timeouts = [];
        }

        function triggerPersonalityCardAnimation(shouldOpen) {
            const { card, isOpen, animating, hasAnimatedOnce } = personalityState;
            
            if (!card) return;
            if (globalAnimationsPaused) return; // Don't animate if paused
            if (shouldOpen && hasAnimatedOnce) return;
            if (shouldOpen === isOpen && !animating) return;

            personalityState.animating = true;
            clearPersonalityTimeouts();

            // First time plays at normal speed, subsequent slightly faster
            const isFirstTime = shouldOpen && !hasAnimatedOnce;
            const duration = isFirstTime ? 3000 : 2500;
            card.style.setProperty('--personality-duration', isFirstTime ? '3s' : '2.5s');

            if (shouldOpen) {
                if (isFirstTime) {
                    personalityState.hasAnimatedOnce = true;
                    card.classList.add('animated-once');
                }

                // Time multiplier: 1.0 for first run, 0.85 for subsequent
                const t = isFirstTime ? 1 : 0.85;

                // --- ANIMATION SEQUENCE ---

                // 1. Line 1 draws immediately -> Science Box appears
                card.classList.add('line-1-visible');
                personalityState.timeouts.push(setTimeout(() => card.classList.add('science-box-visible', 'science-box-glow'), 300 * t));
                personalityState.timeouts.push(setTimeout(() => card.classList.remove('science-box-glow'), 700 * t));

                // 2. Line 2 draws -> Apps Box appears
                personalityState.timeouts.push(setTimeout(() => card.classList.add('line-2-visible'), 500 * t));
                personalityState.timeouts.push(setTimeout(() => card.classList.add('apps-box-visible', 'apps-box-glow'), 900 * t));
                personalityState.timeouts.push(setTimeout(() => card.classList.remove('apps-box-glow'), 1300 * t));

                // 3. Line 3 draws -> Center Circle pops
                personalityState.timeouts.push(setTimeout(() => card.classList.add('line-3-visible'), 1000 * t));
                personalityState.timeouts.push(setTimeout(() => card.classList.add('center-visible'), 1400 * t));

                // 4. Outer arcs draw -> Harmonia Box glows
                personalityState.timeouts.push(setTimeout(() => card.classList.add('outer-circle-animating'), 1550 * t));

                // 5. Harmonia box appears with glow
                personalityState.timeouts.push(setTimeout(() => card.classList.add('harmonia-box-visible', 'harmonia-glow'), 2200 * t));

                // 6. Icon moves to corner
                const moveStartTime = 2400 * t;
                personalityState.timeouts.push(setTimeout(() => {
                    card.classList.add('icon-moving');
                }, moveStartTime));

                // 7. Animation complete
                personalityState.timeouts.push(setTimeout(() => {
                    card.classList.add('animation-complete');
                    setTimeout(() => card.classList.remove('harmonia-glow'), 500);
                    personalityState.isOpen = true;
                    personalityState.animating = false;
                }, moveStartTime + 800));

            } else {
                // Reset/Close
                card.classList.remove(
                    'animation-complete', 'icon-arrived', 'icon-moving',
                    'harmonia-glow', 'outer-circle-animating',
                    'harmonia-box-visible', 'center-visible', 'line-3-visible',
                    'apps-box-visible', 'apps-box-glow', 'line-2-visible',
                    'science-box-visible', 'science-box-glow', 'line-1-visible'
                );
                personalityState.isOpen = false;
                personalityState.animating = false;
            }
        }

        function resetPersonalityCardAnimation() {
            const { card } = personalityState;
            if (!card) return;

            clearPersonalityTimeouts();
            
            card.classList.remove(
                'animation-complete', 'icon-arrived', 'icon-moving',
                'harmonia-glow', 'outer-circle-animating',
                'harmonia-box-visible', 'center-visible', 'line-3-visible',
                'apps-box-visible', 'apps-box-glow', 'line-2-visible',
                'science-box-visible', 'science-box-glow', 'line-1-visible'
            );

            personalityState.isOpen = false;
            personalityState.animating = false;
        }

        window.triggerPersonalityCardAnimation = triggerPersonalityCardAnimation;
        window.resetPersonalityCardAnimation = resetPersonalityCardAnimation;

        // =============================================
        // GENETIC CARD ANIMATION
        // =============================================
        let geneticState = {
            card: null,
            isOpen: false,
            animating: false,
            hasAnimatedOnce: false,
            timeouts: []
        };

        function initGeneticCardAnimation() {
            geneticState.card = document.querySelector('.science-card.genetic-card');
        }

        function clearGeneticTimeouts() {
            geneticState.timeouts.forEach(t => clearTimeout(t));
            geneticState.timeouts = [];
        }

        function triggerGeneticCardAnimation(shouldOpen) {
            const { card, isOpen, animating, hasAnimatedOnce } = geneticState;
            
            if (!card) return;
            if (globalAnimationsPaused) return; // Don't animate if paused
            if (shouldOpen && hasAnimatedOnce) return;
            if (shouldOpen === isOpen && !animating) return;

            geneticState.animating = true;
            clearGeneticTimeouts();

            // First time: 3s, subsequent: 1.5s
            const isFirstTime = shouldOpen && !hasAnimatedOnce;
            const duration = isFirstTime ? 3000 : 1500;
            card.style.setProperty('--genetic-duration', isFirstTime ? '3s' : '1.5s');

            if (shouldOpen) {
                if (isFirstTime) {
                    geneticState.hasAnimatedOnce = true;
                    card.classList.add('animated-once');
                }

                if (isFirstTime) {
                    // === FIRST TIME ANIMATION (3s) ===
                    
                    // Phase 1: Electric crackle on rungs only (0-500ms)
                    card.classList.add('crackling');
                    
                    // Phase 2: Crackle ends, warp effect (500ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.remove('crackling');
                        card.classList.add('helix-warping');
                    }, 500));

                    // Boxes + subtitle start fading in (700ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('boxes-fading', 'subtitle-visible');
                    }, 700));

                    // Stop warping
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.remove('helix-warping');
                    }, 900));

                    // Phase 3: DNA moves + rolls + helix draws + particles travel along (1200-2300ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('dna-moving', 'helix-forming');
                    }, 1200));

                    // Phase 4: Energy wave + final glow (2300-2700ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('energy-wave-active', 'final-glow');
                    }, 2300));

                    // Phase 5: Harmonia + title appear (2700ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('harmonia-visible', 'harmonia-glow');
                    }, 2700));

                    // Complete (3000ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.remove('final-glow', 'energy-wave-active', 'harmonia-glow');
                        card.classList.add('animation-complete');
                        geneticState.isOpen = true;
                        geneticState.animating = false;
                    }, 3000));

                } else {
                    // === SUBSEQUENT ANIMATION (1.5s) - Simplified ===
                    
                    // Skip crackle, start with warp
                    card.classList.add('helix-warping');
                    
                    // Boxes + subtitle fade in (200ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('boxes-fading', 'subtitle-visible');
                    }, 200));

                    // Stop warping
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.remove('helix-warping');
                    }, 300));

                    // DNA moves + rolls + helix draws + particles travel (400-1000ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('dna-moving', 'helix-forming');
                    }, 400));

                    // Energy wave + glow (1100ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('energy-wave-active', 'final-glow');
                    }, 1100));

                    // Harmonia + title (1300ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.add('harmonia-visible', 'harmonia-glow');
                    }, 1300));

                    // Complete (1500ms)
                    geneticState.timeouts.push(setTimeout(() => {
                        card.classList.remove('final-glow', 'energy-wave-active', 'harmonia-glow');
                        card.classList.add('animation-complete');
                        geneticState.isOpen = true;
                        geneticState.animating = false;
                    }, 1500));
                }

            } else {
                // Reset/Close
                card.classList.remove(
                    'animation-complete', 'harmonia-visible', 'harmonia-glow',
                    'final-glow', 'energy-wave-active', 'dna-moving',
                    'boxes-fading', 'subtitle-visible', 'particles-active',
                    'helix-warping', 'helix-forming', 'crackling'
                );
                geneticState.isOpen = false;
                geneticState.animating = false;
            }
        }

        function resetGeneticCardAnimation() {
            const { card } = geneticState;
            if (!card) return;

            clearGeneticTimeouts();
            
            card.classList.remove(
                'animation-complete', 'harmonia-visible', 'harmonia-glow',
                'final-glow', 'energy-wave-active', 'dna-moving',
                'boxes-fading', 'subtitle-visible', 'particles-active',
                'helix-warping', 'helix-forming', 'crackling'
            );

            geneticState.isOpen = false;
            geneticState.animating = false;
        }

        window.triggerGeneticCardAnimation = triggerGeneticCardAnimation;
        window.resetGeneticCardAnimation = resetGeneticCardAnimation;

        // =============================================
        // SYNTHESIS CARD ANIMATION
        // =============================================
        let synthesisState = {
            card: null,
            isOpen: false,
            animating: false,
            hasAnimatedOnce: false,
            timeouts: []
        };

        function initSynthesisCardAnimation() {
            synthesisState.card = document.querySelector('.science-card.synthesis-card');
        }

        function clearSynthesisTimeouts() {
            synthesisState.timeouts.forEach(t => clearTimeout(t));
            synthesisState.timeouts = [];
        }

        function triggerSynthesisCardAnimation(shouldOpen) {
            const { card, isOpen, animating, hasAnimatedOnce } = synthesisState;
            
            if (!card) return;
            if (globalAnimationsPaused) return;
            // Once the animation has started for open, don't restart it mid-flight
            if (shouldOpen && (animating || isOpen)) return;
            if (!shouldOpen && !isOpen && !animating) return;

            synthesisState.animating = true;
            clearSynthesisTimeouts();

            if (shouldOpen) {
                if (!hasAnimatedOnce) {
                    synthesisState.hasAnimatedOnce = true;
                    card.classList.add('animated-once');
                }

                // Phase 1: Icons rush + impact (0ms)
                card.classList.add('icons-rushing');

                // Phase 2: Impact flash + sparks (500ms)
                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.add('impact', 'sparks-active', 'fog-building');
                }, 500));

                // Phase 3: Logo draws itself in at center (900ms)
                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.remove('fog-building');
                    card.classList.add('fog-fading', 'logo-drawing', 'title-visible');
                }, 900));

                // Phase 4: Logo travels to corner (1750ms — after strokes finish ~0.9s)
                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.remove('logo-drawing');
                    card.classList.add('logo-in-header');
                }, 1750));

                // Phase 5: Text cascade (1900ms)
                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.add('boxes-tracing');
                }, 1900));

                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.remove('boxes-tracing');
                    card.classList.add('text-science');
                }, 2100));

                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.add('text-apps');
                }, 2300));

                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.add('text-harmonia');
                }, 2500));

                // Phase 6: Complete (2800ms)
                synthesisState.timeouts.push(setTimeout(() => {
                    card.classList.remove('fog-fading', 'impact', 'sparks-active');
                    card.classList.add('animation-complete');
                    synthesisState.isOpen = true;
                    synthesisState.animating = false;
                    showAllCardsCompleted();
                }, 2800));

            } else {
                // Reset — kill transitions, snap back, re-enable
                const logoEl = card.querySelector('.harmonia-logo-center');
                if (logoEl) logoEl.classList.add('no-transition');
                card.classList.remove(
                    'animation-complete', 'text-harmonia', 'text-apps', 'text-science',
                    'boxes-tracing', 'title-visible',
                    'logo-drawing', 'logo-in-header', 'fog-fading', 'fog-building',
                    'sparks-active', 'impact', 'icons-rushing'
                );
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (logoEl) logoEl.classList.remove('no-transition');
                }));
                synthesisState.isOpen = false;
                synthesisState.animating = false;
            }
        }

        function resetSynthesisCardAnimation() {
            const { card } = synthesisState;
            if (!card) return;

            clearSynthesisTimeouts();

            const logoEl = card.querySelector('.harmonia-logo-center');
            if (logoEl) logoEl.classList.add('no-transition');
            card.classList.remove(
                'animation-complete', 'text-harmonia', 'text-apps', 'text-science',
                'boxes-tracing', 'title-visible',
                'logo-drawing', 'logo-in-header', 'fog-fading', 'fog-building',
                'sparks-active', 'impact', 'icons-rushing'
            );
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (logoEl) logoEl.classList.remove('no-transition');
            }));

            synthesisState.isOpen = false;
            synthesisState.animating = false;
        }

        // Show all cards in completed state
        function showAllCardsCompleted() {
            // Visual card - set eye to open state
            const visualCard = document.querySelector('.science-card.visual-card');
            if (visualCard && !visualCard.classList.contains('eye-open')) {
                visualCard.classList.add('eye-open');
                // Set the SVG paths to open state
                const upperLid = visualCard.querySelector('.upper-lid');
                const lowerLid = visualCard.querySelector('.lower-lid');
                if (upperLid) upperLid.setAttribute('d', 'M30 40 Q50 20 70 40');
                if (lowerLid) lowerLid.setAttribute('d', 'M35 70 Q50 85 65 70');
            }

            // Personality card
            const personalityCard = document.querySelector('.science-card.personality-card');
            if (personalityCard) {
                personalityCard.classList.add('animation-complete', 'icon-moving', 'center-visible', 'outer-circle-animating', 'line-1-visible', 'line-2-visible', 'line-3-visible', 'science-box-visible', 'apps-box-visible', 'harmonia-box-visible');
            }

            // Genetic card
            const geneticCard = document.querySelector('.science-card.genetic-card');
            if (geneticCard) {
                geneticCard.classList.add('animation-complete', 'dna-moving', 'helix-forming', 'boxes-fading', 'subtitle-visible', 'harmonia-visible');
            }

            // Synthesis card
            const synthesisCard = document.querySelector('.science-card.synthesis-card');
            if (synthesisCard) {
                synthesisCard.classList.add('animation-complete', 'logo-drawing', 'logo-in-header', 'title-visible', 'text-science', 'text-apps', 'text-harmonia');
            }
        }

        // Hide all cards completed state (restore to silhouette)
        function hideAllCardsCompleted() {
            // Visual card - reset eye to closed state
            const visualCard = document.querySelector('.science-card.visual-card');
            if (visualCard) {
                visualCard.classList.remove('eye-open');
                // Reset the SVG paths to closed state
                const upperLid = visualCard.querySelector('.upper-lid');
                const lowerLid = visualCard.querySelector('.lower-lid');
                if (upperLid) upperLid.setAttribute('d', 'M30 50 Q50 35 70 50');
                if (lowerLid) lowerLid.setAttribute('d', 'M35 50 Q50 65 65 50');
            }

            // Personality card
            const personalityCard = document.querySelector('.science-card.personality-card');
            if (personalityCard) {
                personalityCard.classList.remove('animation-complete', 'icon-moving', 'center-visible', 'outer-circle-animating', 'line-1-visible', 'line-2-visible', 'line-3-visible', 'science-box-visible', 'apps-box-visible', 'harmonia-box-visible');
            }

            // Genetic card
            const geneticCard = document.querySelector('.science-card.genetic-card');
            if (geneticCard) {
                geneticCard.classList.remove('animation-complete', 'dna-moving', 'helix-forming', 'boxes-fading', 'subtitle-visible', 'harmonia-visible');
            }

            // Synthesis card - KEEP visible since pause/resume is on this card
            // Don't remove any classes - user expects to see the content
        }

        // Toggle pause/resume all animations
        function toggleAllAnimations() {
            const btnText = document.querySelector('.synthesis-pause-hint .pause-btn-text');
            
            globalAnimationsPaused = !globalAnimationsPaused;
            
            if (globalAnimationsPaused) {
                // Paused - show all cards completed
                document.body.classList.add('animations-paused');
                if (btnText) btnText.textContent = 'Resume';
                showAllCardsCompleted();
            } else {
                // Resumed - restore silhouette state
                document.body.classList.remove('animations-paused');
                if (btnText) btnText.textContent = 'Pause';
                hideAllCardsCompleted();
            }
        }

        window.triggerSynthesisCardAnimation = triggerSynthesisCardAnimation;
        window.resetSynthesisCardAnimation = resetSynthesisCardAnimation;
        window.toggleAllAnimations = toggleAllAnimations;
        
        // Spin logo on click

