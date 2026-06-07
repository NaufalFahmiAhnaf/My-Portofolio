import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. THREE.JS BACKGROUND ANIMATION
// ==========================================
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const startTime = performance.now();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = (performance.now() - startTime) / 1000;

    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    particlesMesh.rotation.y += mouseX * 0.1;
    particlesMesh.rotation.x += mouseY * 0.1;

    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// 2. TYPING ANIMATION
// ==========================================
const typedNameEl = document.getElementById('typed-name');
const roleTextEl = document.getElementById('role-text');

const nameText = 'Naufal Fahmi Ahnaf';
const roles = [
    'AI Engineer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Machine Learning Enthusiast',
    'Software Engineer'
];

let nameIndex = 0;
let roleIndex = 0;
let roleCharIndex = 0;
let isDeleting = false;
let nameTyped = false;

function typeName() {
    if (nameIndex <= nameText.length) {
        typedNameEl.textContent = nameText.substring(0, nameIndex);
        nameIndex++;
        setTimeout(typeName, 80);
    } else {
        nameTyped = true;
        // Start role typing after name is done
        setTimeout(typeRole, 500);
    }
}

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleCharIndex--;
        roleTextEl.textContent = currentRole.substring(0, roleCharIndex);
        
        if (roleCharIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 300);
        } else {
            setTimeout(typeRole, 40);
        }
    } else {
        roleCharIndex++;
        roleTextEl.textContent = currentRole.substring(0, roleCharIndex);
        
        if (roleCharIndex === currentRole.length) {
            // Pause at end of word
            setTimeout(() => {
                isDeleting = true;
                typeRole();
            }, 2000);
        } else {
            setTimeout(typeRole, 80);
        }
    }
}

// Start typing after a brief delay
setTimeout(typeName, 800);


// ==========================================
// 3. GSAP ANIMATIONS
// ==========================================

// Hero Animation
const tl = gsap.timeline();

tl.from('.navbar', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
})
.from('.hero-greeting', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
}, "-=0.3")
.from('.title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
}, "-=0.4")
.from('.subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
}, "-=0.5")
.from('.description', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
}, "-=0.5")
.from('.hero-buttons', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
}, "-=0.6")
.from('.hero-socials', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
}, "-=0.4")
.from(container, {
    opacity: 0,
    duration: 2
}, "-=1.5");

// Scroll Animations for Sections
const sections = document.querySelectorAll('.section');

sections.forEach((section) => {
    // Animate individual content elements (NOT containers that also have animated children)
    const contentElements = section.querySelectorAll('.section-title, .section-subtitle, .about-text, .skills-container, .timeline-item, .project-card, .cert-card');
    if (contentElements.length) {
        gsap.from(contentElements, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: "all"
        });
    }

    // Animate container cards (social-links-card, contact-info-card) as a whole
    const containerCards = section.querySelectorAll('.social-links-card, .contact-info-card');
    if (containerCards.length) {
        gsap.from(containerCards, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2,
            clearProps: "all"
        });
    }
});


// ==========================================
// 4. HAMBURGER MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}


// ==========================================
// 5. COFFEETRACK BROWSER SLIDER LOGIC
// ==========================================
const ctMockup = document.getElementById('coffeetrack-mockup');
if (ctMockup) {
    const ctSlides = ctMockup.querySelectorAll('.slide');
    const ctDots = ctMockup.querySelectorAll('.slider-dots .dot');
    const ctPrevBtn = ctMockup.querySelector('.prev-btn');
    const ctNextBtn = ctMockup.querySelector('.next-btn');
    const ctSlider = ctMockup.querySelector('#coffeetrack-slider');
    
    let ctIndex = 0;
    let ctInterval;

    function showCtSlide(index) {
        if (!ctSlides.length) return;
        if (index >= ctSlides.length) ctIndex = 0;
        else if (index < 0) ctIndex = ctSlides.length - 1;
        else ctIndex = index;

        ctSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === ctIndex);
        });
        ctDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === ctIndex);
        });
    }

    function nextCtSlide() {
        showCtSlide(ctIndex + 1);
    }

    function prevCtSlide() {
        showCtSlide(ctIndex - 1);
    }

    function startCtSlider() {
        if (ctInterval) clearInterval(ctInterval);
        ctInterval = setInterval(nextCtSlide, 4000);
    }

    if (ctNextBtn && ctPrevBtn) {
        ctNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextCtSlide();
            startCtSlider();
        });
        ctPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevCtSlide();
            startCtSlider();
        });
    }

    ctDots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showCtSlide(i);
            startCtSlider();
        });
    });

    if (ctSlider) {
        ctSlider.addEventListener('click', () => {
            nextCtSlide();
            startCtSlider();
        });
    }

    startCtSlider();
}

// ==========================================
// 6. ROOM BOOKING PHONE SLIDER LOGIC
// ==========================================
const phoneSliderContainer = document.querySelector('.phone-slider-mockup');
if (phoneSliderContainer) {
    const phoneSlides = phoneSliderContainer.querySelectorAll('.phone-slide');
    const phoneDots = phoneSliderContainer.querySelectorAll('.phone-slider-dots .phone-dot');
    const phoneSlider = phoneSliderContainer.querySelector('#phone-slider');

    let phoneSlideIndex = 0;
    let phoneSlideInterval;

    function showPhoneSlide(index) {
        if (!phoneSlides.length) return;
        if (index >= phoneSlides.length) phoneSlideIndex = 0;
        else if (index < 0) phoneSlideIndex = phoneSlides.length - 1;
        else phoneSlideIndex = index;

        phoneSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === phoneSlideIndex);
        });
        phoneDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === phoneSlideIndex);
        });
    }

    function startPhoneSlideShow() {
        if (phoneSlideInterval) clearInterval(phoneSlideInterval);
        phoneSlideInterval = setInterval(() => {
            showPhoneSlide(phoneSlideIndex + 1);
        }, 3500);
    }

    phoneDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoneSlide(index);
            startPhoneSlideShow();
        });
    });

    if (phoneSlider) {
        phoneSlider.addEventListener('click', () => {
            showPhoneSlide(phoneSlideIndex + 1);
            startPhoneSlideShow();
        });
    }

    startPhoneSlideShow();
}

// ==========================================
// 7. NUTRISMART BROWSER SLIDER LOGIC
// ==========================================
const nsMockup = document.getElementById('nutrismart-mockup');
if (nsMockup) {
    const nsSlides = nsMockup.querySelectorAll('.slide');
    const nsDots = nsMockup.querySelectorAll('.slider-dots .dot');
    const nsPrevBtn = nsMockup.querySelector('.prev-btn');
    const nsNextBtn = nsMockup.querySelector('.next-btn');
    const nsSlider = nsMockup.querySelector('.browser-slider');

    let nsIndex = 0;
    let nsInterval;

    function showNsSlide(index) {
        if (!nsSlides.length) return;
        if (index >= nsSlides.length) nsIndex = 0;
        else if (index < 0) nsIndex = nsSlides.length - 1;
        else nsIndex = index;

        nsSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === nsIndex);
        });
        nsDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === nsIndex);
        });
    }

    function nextNsSlide() {
        showNsSlide(nsIndex + 1);
    }

    function prevNsSlide() {
        showNsSlide(nsIndex - 1);
    }

    function startNsSlider() {
        if (nsInterval) clearInterval(nsInterval);
        nsInterval = setInterval(nextNsSlide, 4000);
    }

    if (nsNextBtn && nsPrevBtn) {
        nsNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextNsSlide();
            startNsSlider();
        });
        nsPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevNsSlide();
            startNsSlider();
        });
    }

    nsDots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showNsSlide(i);
            startNsSlider();
        });
    });

    if (nsSlider) {
        nsSlider.addEventListener('click', () => {
            nextNsSlide();
            startNsSlider();
        });
    }

    startNsSlider();
}


// ==========================================
// 8. CV MODAL LOGIC
// ==========================================
const cvBtn = document.getElementById('cv-btn');
const cvModal = document.getElementById('cv-modal');
const closeCvModalBtn = document.getElementById('close-cv-modal');

function openModal(modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
}

if (cvBtn && cvModal && closeCvModalBtn) {
    cvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(cvModal);
    });

    closeCvModalBtn.addEventListener('click', () => {
        closeModal(cvModal);
    });

    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) {
            closeModal(cvModal);
        }
    });
}


// ==========================================
// 9. CERTIFICATE LIGHTBOX MODAL LOGIC
// ==========================================
const certCards = document.querySelectorAll('.cert-card');
const certModal = document.getElementById('cert-modal');
const closeCertModalBtn = document.getElementById('close-cert-modal');
const modalCertImg = document.getElementById('modal-cert-img');
const certActions = document.getElementById('cert-modal-actions');
const viewCertBtn = document.getElementById('view-cert-btn');
const viewScoreBtn = document.getElementById('view-score-btn');

let currentCertPath = '';
let currentScorePath = '';

if (certModal && closeCertModalBtn && modalCertImg) {
    certCards.forEach((card) => {
        card.addEventListener('click', () => {
            const certImg = card.querySelector('.cert-img');
            const scoreImg = card.querySelector('.cert-score-img');

            currentCertPath = certImg ? certImg.src : '';
            currentScorePath = scoreImg ? scoreImg.src : '';

            modalCertImg.src = currentCertPath;

            if (currentScorePath && certActions && viewCertBtn && viewScoreBtn) {
                certActions.style.display = 'flex';
                viewCertBtn.classList.add('active');
                viewScoreBtn.classList.remove('active');
            } else if (certActions) {
                certActions.style.display = 'none';
            }

            openModal(certModal);
        });
    });

    if (viewCertBtn && viewScoreBtn) {
        viewCertBtn.addEventListener('click', () => {
            modalCertImg.src = currentCertPath;
            viewCertBtn.classList.add('active');
            viewScoreBtn.classList.remove('active');
        });

        viewScoreBtn.addEventListener('click', () => {
            modalCertImg.src = currentScorePath;
            viewScoreBtn.classList.add('active');
            viewCertBtn.classList.remove('active');
        });
    }

    closeCertModalBtn.addEventListener('click', () => {
        closeModal(certModal);
    });

    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeModal(certModal);
        }
    });
}


// ==========================================
// 10. CLOSE MODALS WITH ESC KEY
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cvModal && cvModal.classList.contains('show')) {
            closeModal(cvModal);
        }
        if (certModal && certModal.classList.contains('show')) {
            closeModal(certModal);
        }
    }
});


// ==========================================
// 11. SMOOTH SCROLL FOR NAV LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ==========================================
// 12. NAVBAR SCROLL EFFECT
// ==========================================
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.padding = '1rem 10%';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '1.5rem 10%';
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});
