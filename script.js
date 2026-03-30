// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');

// ===== Initialize EmailJS =====
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('7MLw7966JN9SHx0qy');
})();

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ===== Smooth Scrolling for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form Handling =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Prepare email parameters
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Webly'
    };
    
    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
    emailjs.send('service_2vmh78k', 'template_c4552km', templateParams)
        .then(function(response) {
            showNotification('Message sent successfully! I will contact you shortly.', 'success');
            contactForm.reset();
        }, function(error) {
            showNotification('Failed to send message. Please try again or contact via WhatsApp.', 'error');
            console.error('EmailJS Error:', error);
        });
});

// ===== Email Validation =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#25d366' : type === 'error' ? '#ef4444' : '#8b5cf6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .project-card, .feature-card, .testimonial-card, .highlight-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ===== Active Navigation Link Highlight =====
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveNavLink);

// Add active link styles
const activeLinkStyles = document.createElement('style');
activeLinkStyles.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
    }
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyles);

// ===== Typing Effect for Hero (Optional Enhancement) =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Parallax Effect for Hero Background =====
function handleParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}

window.addEventListener('scroll', handleParallax);

// ===== Review System =====
function initStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

function saveReview(name, rating, comment) {
    const reviews = JSON.parse(localStorage.getItem('weblyReviews')) || [];
    
    const newReview = {
        id: Date.now(),
        name: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString()
    };
    
    reviews.unshift(newReview); // Add to beginning
    localStorage.setItem('weblyReviews', JSON.stringify(reviews));
    
    return newReview;
}

// Load reviews from JSON file (for shared reviews)
async function loadReviewsFromJSON() {
    try {
        const response = await fetch('reviews.json');
        if (!response.ok) {
            throw new Error('Failed to load reviews');
        }
        const data = await response.json();
        return data.reviews || [];
    } catch (error) {
        console.log('Could not load reviews from JSON, using localStorage:', error);
        return null;
    }
}

async function displayReviews() {
    const container = document.getElementById('reviewsContainer');
    const noReviewsMsg = document.getElementById('noReviews');
    
    // Try to load reviews from JSON file first (shared reviews)
    let reviews = await loadReviewsFromJSON();
    
    // If JSON load fails, fall back to localStorage
    if (reviews === null) {
        reviews = JSON.parse(localStorage.getItem('weblyReviews')) || [];
    }
    
    if (reviews.length === 0) {
        container.innerHTML = '';
        noReviewsMsg.style.display = 'block';
        return;
    }
    
    noReviewsMsg.style.display = 'none';
    container.innerHTML = reviews.map(review => `
        <div class="testimonial-card">
            <div class="testimonial-stars">
                ${generateStars(review.rating)}
            </div>
            <p class="testimonial-text">"${escapeHtml(review.comment)}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="author-info">
                    <h4>${escapeHtml(review.name)}</h4>
                    <p>${formatDate(review.date)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function initReviewForm() {
    const form = document.getElementById('reviewForm');
    
    // Formspree endpoint - Replace with your actual Formspree form URL
    // Get your free form at: https://formspree.io/
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoprqqd';
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reviewerName').value.trim();
        const rating = document.getElementById('ratingValue').value;
        const comment = document.getElementById('reviewComment').value.trim();
        
        if (!rating) {
            showNotification('Please select a rating', 'error');
            return;
        }
        
        // Save to localStorage for immediate display
        saveReview(name, rating, comment);
        
        // Submit to Formspree for storage
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    rating: rating,
                    comment: comment,
                    date: new Date().toISOString(),
                    _subject: `New Review from ${name} - ${rating} Stars`
                })
            });
            
            if (response.ok) {
                showNotification('Thank you for your review! It will be visible after approval.', 'success');
            } else {
                showNotification('Review saved locally. Thank you!', 'success');
            }
        } catch (error) {
            console.log('Formspree submission error:', error);
            showNotification('Review saved locally. Thank you!', 'success');
        }
        
        // Refresh reviews display
        displayReviews();
        
        // Reset form
        form.reset();
        document.querySelectorAll('#starRating i').forEach(s => s.classList.remove('active'));
        document.getElementById('ratingValue').value = '';
    });
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    // Set initial navbar state
    handleNavbarScroll();
    
    // Set initial active nav link
    highlightActiveNavLink();
    
    // Initialize review system
    initStarRating();
    initReviewForm();
    displayReviews();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Add loaded class to body for potential loading animations
    document.body.classList.add('loaded');
    
    console.log('Webly website loaded successfully!');
});

// ===== Prevent FOUC (Flash of Unstyled Content) =====
document.documentElement.style.visibility = 'visible';
