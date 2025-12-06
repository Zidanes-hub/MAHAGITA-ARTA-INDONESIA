document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const navTitle = document.getElementById('nav-title');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-primary', 'shadow-lg', 'py-2');
            navbar.classList.remove('bg-transparent', 'py-4');
            navTitle.classList.remove('opacity-90');
            navTitle.classList.add('opacity-100');
        } else {
            navbar.classList.remove('bg-primary', 'shadow-lg', 'py-2');
            navbar.classList.add('bg-transparent', 'py-4');
            navTitle.classList.add('opacity-90');
            navTitle.classList.remove('opacity-100');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Simple icon toggle logic can go here (hamburger vs close X)
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Image Injector System ---
    // This allows you to keep image URLs centralized in js/images.js
    // Usage: <img data-img-src="key.path.to.image" /> or <div data-img-bg="key.path"></div>

    function getNestedValue(obj, path) {
        return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
    }

    const imgElements = document.querySelectorAll('[data-img-src]');
    imgElements.forEach(el => {
        const key = el.getAttribute('data-img-src');
        const suffix = el.getAttribute('data-suffix') || ''; // For randomizing partners
        let src = getNestedValue(siteImages, key);
        
        if (src) {
             if (suffix) src += suffix;
             el.src = src;
        } else {
             console.warn('Image key not found:', key);
        }
    });

    const bgElements = document.querySelectorAll('[data-img-bg]');
    bgElements.forEach(el => {
        const key = el.getAttribute('data-img-bg');
        const src = getNestedValue(siteImages, key);
        if (src) {
            el.style.backgroundImage = `url("${src}")`;
        } else {
             console.warn('Background image key not found:', key);
        }
    });

    // --- Document Link Injector System ---
    const docElements = document.querySelectorAll('[data-doc-href]');
    docElements.forEach(el => {
        const key = el.getAttribute('data-doc-href');
        const href = getNestedValue(siteImages, key);
        if (href) {
            el.href = href;
        } else {
            console.warn('Document key not found:', key);
        }
    });

    // --- Contact Form Handling (Connect to Database) ---
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Biar gak refresh halaman
            
            // Ambil data dari input
            const name = document.getElementById('inputName').value;
            const email = document.getElementById('inputEmail').value;
            const message = document.getElementById('inputMessage').value;
            
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            
            try {
                // Tembak API Backend kita
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (result.success) {
                    alert('Terima kasih! Pesan Anda sudah tersimpan di Database.');
                    contactForm.reset(); // Kosongin form
                } else {
                    alert('Gagal mengirim pesan.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Server error! Pastikan backend nyala.');
            } finally {
                submitBtn.innerText = originalText;
            }
        });
    }
});