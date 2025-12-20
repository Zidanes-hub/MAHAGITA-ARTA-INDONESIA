
import siteImages from './images.js';
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

// --- LOGIKA POP-UP HARGA ---

// Data Paket (Bisa kamu edit harganya di sini)
const packageData = {
    'A': {
        title: 'PAKET A - TRAINING',
        desc: 'Solusi lengkap untuk meningkatkan kompetensi tim Anda.',
        prices: [
            { item: 'Public Training (per pax)', price: 'Rp 4.500.000' },
            { item: 'In-House Training (up to 20 pax)', price: 'Rp 25.000.000' },
            { item: 'Sertifikasi BNSP', price: 'Hubungi Kami' }
        ]
    },
    'B': {
        title: 'PAKET B - GATHERING',
        desc: 'Bangun kekompakan tim dengan kegiatan seru dan berkesan.',
        prices: [
            { item: 'One Day Trip (per pax)', price: 'Mulai Rp 350.000' },
            { item: '2D1N Gathering (per pax)', price: 'Mulai Rp 850.000' },
            { item: 'Outbound Facility', price: 'Included' }
        ]
    },
    'C': {
        title: 'PAKET C - KONSULTASI',
        desc: 'Pendampingan ahli untuk solusi teknis dan manajemen perusahaan.',
        prices: [
            { item: 'Konsultasi Per Jam', price: 'Rp 1.500.000' },
            { item: 'Pendampingan Proyek (Bulan)', price: 'Nego' },
            { item: 'Pembuatan Dokumen', price: 'Call for Price' }
        ]
    }
};

let currentPackage = '';

// Fungsi Buka Modal
window.openPricingModal = (type) => {
    const data = packageData[type];
    if (!data) return;

    currentPackage = data.title;

    // Isi Konten Modal
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalDescription').innerText = data.desc;

    // Generate List Harga
    const listContainer = document.getElementById('modalPriceList');
    listContainer.innerHTML = ''; // Reset isi lama

    data.prices.forEach(p => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center border-b border-gray-200 pb-1 last:border-0';
        li.innerHTML = `
            <span>${p.item}</span>
            <span class="font-bold text-gray-900">${p.price}</span>
        `;
        listContainer.appendChild(li);
    });

    // Tampilkan Modal (Hapus class hidden)
    const modal = document.getElementById('pricingModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');

    modal.classList.remove('hidden');

    // Animasi Masuk (sedikit delay biar transition jalan)
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'scale-95');
    }, 10);
};

// Fungsi Tutup Modal
window.closePricingModal = () => {
    const modal = document.getElementById('pricingModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');

    // Animasi Keluar
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'scale-95');

    // Tunggu animasi selesai baru hide
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // 300ms sesuai durasi transition default tailwind
};

// Fungsi Lanjut ke WhatsApp (dari dalam modal)
const whatsappBtn = document.getElementById('btnWhatsapp');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = "62881027445498";
        const message = `Halo Admin, saya tertarik dengan *${currentPackage}* dan ingin diskusi harga lebih lanjut. Mohon infonya.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

        closePricingModal(); // Tutup modal setelah klik
    });
}