/**
 * Video-BLADE Homepage Main JavaScript
 * Handles navigation, smooth scrolling, and general interactions
 * Updated for consistent commit history
 */

// ==========================================
// Global Variables and Configuration
// ==========================================
let isScrolling = false;
let currentSection = '';

// ==========================================
// DOM Content Loaded Event
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeCopyFunctionality();
    initializeAnimations();
    initializeTabSystem();
    initializePointCloudToggle();
    
    // Add smooth reveal animations
    revealElementsOnScroll();
    
    console.log('Video-BLADE Homepage initialized successfully');
});

// ==========================================
// Navigation Functions
// ==========================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navbar = document.querySelector('.navbar');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                return;
            }

            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                updateActiveNavLink(this);
            }
        });
    });
    
    // Handle navbar scroll effects
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavOnScroll();
    });
}

function smoothScrollTo(element) {
    if (isScrolling) return;
    
    isScrolling = true;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = element.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    if (isScrolling) return;
    
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 100;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.id;
        }
    });
    
    if (activeSection && activeSection !== currentSection) {
        currentSection = activeSection;
        const activeLink = document.querySelector(`.nav-links a[href="#${activeSection}"]`);
        if (activeLink) {
            updateActiveNavLink(activeLink);
        }
    }
}

// ==========================================
// Scroll Effects and Animations
// ==========================================
function initializeScrollEffects() {
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

function initializeAnimations() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.contribution-card, .result-item, .method-diagram, .gallery-img'
    );
    
    animateElements.forEach(element => {
        element.classList.add('animate-element');
        observer.observe(element);
    });
}

function revealElementsOnScroll() {
    // Add CSS for reveal animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Add stagger delays to contribution cards
    const contributionCards = document.querySelectorAll('.contribution-card');
    contributionCards.forEach((card, index) => {
        card.classList.add(`stagger-${(index % 3) + 1}`);
    });
}

// ==========================================
// Copy Functionality
// ==========================================
function initializeCopyFunctionality() {
    const copyBtn = document.querySelector('.copy-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyBibtex);
    }
}

function copyBibtex() {
    const bibtexText = document.getElementById('bibtex-text');
    const copyBtn = document.querySelector('.copy-btn');
    
    if (!bibtexText || !copyBtn) return;
    
    // Create a temporary textarea to copy the text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = bibtexText.textContent;
    document.body.appendChild(tempTextarea);
    
    try {
        tempTextarea.select();
        document.execCommand('copy');
        
        // Show success feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Show error feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
        copyBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } finally {
        document.body.removeChild(tempTextarea);
    }
}

// ==========================================
// Tab System for Gallery
// ==========================================
function initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add animation class for smooth transition
            if (targetContent) {
                targetContent.style.animation = 'none';
                setTimeout(() => {
                    targetContent.style.animation = 'fadeIn 0.5s ease';
                }, 10);
            }
        });
    });
}

// ==========================================
// Demonstration Point Cloud Toggle
// ==========================================
function initializePointCloudToggle() {
    const toggleButton = document.getElementById('point-cloud-toggle');
    const videoSection = document.getElementById('videos');

    if (!toggleButton || !videoSection) return;

    const glbPathMap = [
        {
            videoBase: 'assets/orbit_compare_inid_pack/orbit_videos_separate/',
            glbBase: 'assets/orbit_compare_inid_pack/glbs/',
            methods: {
                ours: 'ours',
                gagavatar: 'gagavatar',
                cvthead: 'cvthead',
                gpavatar: 'gpavatar',
                portrait4d_v2: 'portrait4d_v2'
            }
        },
        {
            videoBase: 'assets/orbit_compare_xid_pack/orbit_videos_separate/',
            glbBase: 'assets/orbit_compare_xid_pack/glbs/',
            methods: {
                ours: 'ours',
                gagavatar: 'gagavatar',
                cvthead: 'cvthead',
                gpavatar: 'gpavatar',
                portrait4d_v2: 'portrait4d_v2'
            }
        }
    ];

    videoSection.querySelectorAll('.demo-comparison-table td video').forEach(video => {
        const glbPath = getGlbPathForVideo(video.getAttribute('src'), glbPathMap);
        if (!glbPath) return;

        const cell = video.closest('td');
        if (!cell) return;

        const viewer = document.createElement('iframe');
        viewer.className = 'gltf-viewer-frame';
        viewer.dataset.modelUrl = window.location.protocol === 'file:'
            ? glbPath
            : new URL(glbPath, window.location.href).href;
        viewer.setAttribute('title', '3D Gaussian point cloud comparison');
        viewer.setAttribute('loading', 'lazy');
        viewer.setAttribute('allowfullscreen', '');
        viewer.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        viewer.setAttribute('role', 'img');
        viewer.setAttribute('aria-label', '3D Gaussian point cloud comparison');

        cell.classList.add('has-glb');
        cell.appendChild(viewer);
    });

    toggleButton.addEventListener('click', function() {
        const showingPointClouds = videoSection.classList.toggle('show-point-clouds');
        toggleButton.textContent = showingPointClouds ? 'Show Videos' : 'Show Point Cloud';

        if (showingPointClouds) {
            initializeExternalGltfViewers(videoSection);
        }
    });
}

function initializeExternalGltfViewers(root) {
    const frames = root.querySelectorAll('.gltf-viewer-frame:not([src])');

    if (!('IntersectionObserver' in window)) {
        frames.forEach(loadExternalGltfViewer);
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            loadExternalGltfViewer(entry.target);
        });
    }, {
        rootMargin: '80px 0px'
    });

    frames.forEach(frame => observer.observe(frame));
}

function loadExternalGltfViewer(frame) {
    const modelUrl = frame.dataset.modelUrl;
    if (!modelUrl) return;

    frame.src = `pointcloud_viewer.html?embed=1&v=20260525l&model=${encodeURIComponent(modelUrl)}`;
}

function getGlbPathForVideo(videoSrc, pathMap) {
    if (!videoSrc) return '';

    for (const group of pathMap) {
        if (!videoSrc.startsWith(group.videoBase)) continue;

        const relativePath = videoSrc.slice(group.videoBase.length);
        const pathParts = relativePath.split('/');
        const caseId = pathParts[0];
        const fileName = pathParts[1] || '';
        const method = fileName.replace('.mp4', '');
        const glbMethod = group.methods[method];

        if (!caseId || !glbMethod) return '';

        return `${group.glbBase}${glbMethod}/${caseId}.glb`;
    }

    return '';
}

// ==========================================
// Performance Optimization
// ==========================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    updateActiveNavOnScroll();
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// ==========================================
// Utility Functions
// ==========================================
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300, callback) {
    const start = performance.now();
    const startOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(animate);
}

// ==========================================
// Accessibility Enhancements
// ==========================================
document.addEventListener('keydown', function(e) {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // Handle Escape key for modal/overlay closing
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal);
        }
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ==========================================
// Error Handling and Fallbacks
// ==========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Fallback for browsers without Intersection Observer
if (!('IntersectionObserver' in window)) {
    // Simple fallback: show all elements immediately
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach(element => {
        element.classList.add('animate-in');
    });
}

// ==========================================
// Export functions for testing (if needed)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        smoothScrollTo,
        copyBibtex,
        throttle,
        debounce
    };
}
