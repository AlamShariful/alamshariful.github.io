/**
 * Main JavaScript - Midnight Aurora Theme
 * Shariful Alam - Personal Website
 */

(function() {
    'use strict';

    // =========================================================================
    // Theme Toggle (Dark/Light Mode)
    // =========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });
        }
    }

    // =========================================================================
    // Mobile Menu
    // =========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    function initMobileMenu() {
        if (!mobileMenuToggle || !mainNav) return;

        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.contains('open');
            mainNav.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // =========================================================================
    // Header Scroll Effect
    // =========================================================================
    const header = document.getElementById('site-header');

    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =========================================================================
    // Smooth Scroll for Anchor Links
    // =========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#top' || href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // =========================================================================
    // Fade-in Animation on Scroll
    // =========================================================================
    function initFadeInAnimation() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (!fadeElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // =========================================================================
    // Active Navigation Highlighting
    // =========================================================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id || 
                            link.getAttribute('href') === '/#' + id ||
                            link.getAttribute('href').endsWith('#' + id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // =========================================================================
    // Table of Contents (for blog posts)
    // =========================================================================
    function initTableOfContents() {
        const toc = document.getElementById('toc');
        const postContent = document.getElementById('post-content');

        if (!toc || !postContent) return;

        const headings = postContent.querySelectorAll('h2, h3');
        
        if (headings.length < 2) {
            const tocWidget = document.getElementById('toc-widget');
            if (tocWidget) tocWidget.style.display = 'none';
            return;
        }

        let tocHTML = '<ul>';
        
        headings.forEach(function(heading, index) {
            // Add ID if not present
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }

            const level = heading.tagName.toLowerCase() === 'h2' ? '' : ' style="padding-left: 1.5rem;"';
            tocHTML += '<li><a href="#' + heading.id + '"' + level + '>' + heading.textContent + '</a></li>';
        });
        
        tocHTML += '</ul>';
        toc.innerHTML = tocHTML;

        // Highlight active TOC item on scroll
        const tocLinks = toc.querySelectorAll('a');
        
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    tocLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        headings.forEach(function(heading) {
            observer.observe(heading);
        });
    }

    // =========================================================================
    // Reading Progress Bar (for blog posts)
    // =========================================================================
    function initReadingProgress() {
        const postContent = document.getElementById('post-content');
        if (!postContent) return;

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #7c3aed, #06b6d4);
            z-index: 1001;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const postRect = postContent.getBoundingClientRect();
            const postTop = postRect.top + window.pageYOffset;
            const postHeight = postRect.height;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.pageYOffset;

            let progress = 0;
            
            if (scrollPosition > postTop - windowHeight) {
                progress = ((scrollPosition - postTop + windowHeight) / (postHeight + windowHeight)) * 100;
            }
            
            progress = Math.min(Math.max(progress, 0), 100);
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }

    // =========================================================================
    // Back to Top Button
    // =========================================================================
    function initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================================================
    // Code Block Copy Button
    // =========================================================================
    function initCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(code) {
            const pre = code.parentElement;
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            copyBtn.style.cssText = `
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                padding: 0.5rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-secondary);
                cursor: pointer;
                opacity: 0;
                transition: all 0.2s ease;
            `;
            copyBtn.setAttribute('aria-label', 'Copy code');
            wrapper.appendChild(copyBtn);
            
            // Show on hover
            wrapper.addEventListener('mouseenter', function() {
                copyBtn.style.opacity = '1';
            });
            wrapper.addEventListener('mouseleave', function() {
                copyBtn.style.opacity = '0';
            });
            
            // Copy functionality
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(code.textContent).then(function() {
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    copyBtn.style.color = '#22c55e';
                    
                    setTimeout(function() {
                        copyBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
                        copyBtn.style.color = '';
                    }, 2000);
                });
            });
        });
    }

    // =========================================================================
    // External Links - Open in New Tab
    // =========================================================================
    function initExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // =========================================================================
    // Initialize Everything
    // =========================================================================
    function init() {
        initTheme();
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initFadeInAnimation();
        initActiveNav();
        initTableOfContents();
        initReadingProgress();
        initBackToTop();
        initCodeCopy();
        initExternalLinks();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();