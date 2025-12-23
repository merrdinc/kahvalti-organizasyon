// ===== SMOOTH SCROLL & NAVBAR =====
const navbar = document.querySelector('.navbar');
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Burger animation
    burger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burger.classList.remove('active');
    });
});

// ===== REVEAL ANIMATIONS (Arkadan Gelen Efekt) =====
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing after animation
            // observer.unobserve(entry.target);
        }
    });
}, revealOptions);

// Select all elements with reveal classes
const revealElements = document.querySelectorAll(
    '.reveal-from-back, .reveal-fade, .reveal-from-left, .reveal-from-right'
);

// Observe each element
revealElements.forEach(element => {
    revealOnScroll.observe(element);
});

// ===== GALLERY SLIDER =====
let currentSlide = 0;
let totalSlides = 0;
let autoPlayInterval;
let galleryInitialized = false;

// Function to initialize gallery slider
window.initializeGallerySlider = function() {
    // Clear previous interval if exists
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }

    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');

    if (!galleryTrack || !galleryItems.length) return;

    currentSlide = 0;
    totalSlides = galleryItems.length;

    // Function to update slider position
    function updateSlider() {
        const slideWidth = galleryItems[0]?.clientWidth || 0;
        if (galleryTrack) {
            galleryTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        }
    }

    // Remove old event listeners by cloning
    if (!galleryInitialized) {
        // Next slide
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            });
        }

        // Previous slide
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            });
        }

        // Pause autoplay on hover
        const gallerySlider = document.querySelector('.gallery-slider');
        if (gallerySlider) {
            gallerySlider.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });

            gallerySlider.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    updateSlider();
                }, 5000);
            });
        }

        // Update slider on window resize
        window.addEventListener('resize', updateSlider);

        galleryInitialized = true;
    }

    // Auto play slider
    autoPlayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
}

// Initialize on page load
window.initializeGallerySlider();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(contactForm);

    // Show success message (you can customize this)
    alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');

    // Reset form
    contactForm.reset();

    // In a real application, you would send this data to a server
    // Example:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     body: formData
    // }).then(response => response.json())
    //   .then(data => console.log(data));
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
    }
});

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('img[data-src]');

const imageOptions = {
    threshold: 0,
    rootMargin: "0px 0px 200px 0px"
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, imageOptions);

images.forEach(image => {
    imageObserver.observe(image);
});

// ===== SERVICE CARDS STAGGER ANIMATION =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== COUNTER ANIMATION (Optional - can be added to stats section) =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('active');
        }, 300);
    }
});

// ===== ADD ACTIVE CLASS TO CURRENT SECTION IN NAV =====
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ===== CURSOR TRAIL EFFECT (Optional Enhancement) =====
// Uncomment if you want a cursor trail effect
/*
const cursorTrail = document.createElement('div');
cursorTrail.className = 'cursor-trail';
document.body.appendChild(cursorTrail);

document.addEventListener('mousemove', (e) => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top = e.clientY + 'px';
});
*/

// ===== CONSOLE MESSAGE =====
console.log('%c🍴 Kahvaltı & Organizasyon', 'color: #d4694f; font-size: 24px; font-weight: bold;');
console.log('%cLezzet dolu anlarınıza eşlik ediyoruz!', 'color: #b36c05; font-size: 14px;');
