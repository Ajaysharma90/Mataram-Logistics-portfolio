document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contact-form');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number, .stat-counter');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });
            }
        });
    }, observerOptions);

    const heroSection = document.querySelector('.hero');
    const aboutSection = document.querySelector('.about');

    if (heroSection) observer.observe(heroSection);
    if (aboutSection) observer.observe(aboutSection);

    const fadeElements = document.querySelectorAll('.service-card, .feature-card, .testimonial-card');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            clearErrors();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            let isValid = true;

            if (name === '' || name.length < 2) {
                showError('name', 'Please enter a valid name (at least 2 characters)');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '' || !emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (phone === '' || !phoneRegex.test(phone)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }

            if (service === '') {
                showError('service', 'Please select a service type');
                isValid = false;
            }

            if (message === '' || message.length < 10) {
                showError('message', 'Please enter a message (at least 10 characters)');
                isValid = false;
            }

            if (isValid) {
                const formMessage = document.getElementById('form-message');

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    formMessage.textContent = 'Thank you for your message! We will get back to you within 24 hours.';
                    formMessage.className = 'form-message success';

                    setTimeout(() => {
                        formMessage.className = 'form-message';
                        formMessage.textContent = '';
                    }, 5000);
                }, 1500);
            }
        });
    }

    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);

        input.style.borderColor = 'var(--error)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearErrors() {
        const inputs = contactForm.querySelectorAll('.form-input');
        const errors = contactForm.querySelectorAll('.form-error');

        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
        });

        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    const clientsTrack = document.querySelector('.clients-track');
    if (clientsTrack) {
        const clientLogos = clientsTrack.innerHTML;
        clientsTrack.innerHTML += clientLogos;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.form-label').style.color = 'var(--primary-color)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.querySelector('.form-label').style.color = 'var(--text-dark)';
        });
    });

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
        alert('Please fill all fields');
        return;
    }

    // Get submit button
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    try {
        // Send email
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            document.getElementById('form-message').className = 'form-message success';
            document.getElementById('form-message').textContent = 'Message sent successfully! We will contact you soon.';
            document.getElementById('form-message').style.display = 'block';
            
            // Reset form
            document.getElementById('contact-form').reset();
        } else {
            throw new Error(result.error || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form-message').className = 'form-message error';
        document.getElementById('form-message').textContent = 'Failed to send message. Please try again.';
        document.getElementById('form-message').style.display = 'block';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});
