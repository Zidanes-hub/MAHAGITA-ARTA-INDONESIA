
// Force deployment update
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
                const response = await fetch('/api/contact', {
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
// Data Paket (Bisa kamu edit harganya di sini)
const packageData = {
    // SERVICE 1: Event Organizer
    'eo': {
        title: 'EVENT ORGANIZER',
        desc: 'Jasa penyelenggara acara profesional untuk berbagai kebutuhan event Anda.',
        prices: [
            { item: 'Corporate Gathering', price: 'Mulai Rp 50.000.000' },
            { item: 'Product Launching', price: 'Mulai Rp 75.000.000' },
            { item: 'Wedding Organizer', price: 'Mulai Rp 45.000.000' },
            { item: 'Birthday Party', price: 'Mulai Rp 15.000.000' }
        ]
    },
    // SERVICE 2: Travel Management
    'travel': {
        title: 'TRAVEL MANAGEMENT',
        desc: 'Layanan perjalanan bisnis dan wisata yang nyaman dan terencana.',
        prices: [
            { item: 'Tiket Pesawat Domestik/Intl', price: 'Harga Maskapai' },
            { item: 'Reservasi Hotel', price: 'Corporate Rate' },
            { item: 'Paket Tour Domestik (3D2N)', price: 'Mulai Rp 3.500.000/pax' },
            { item: 'Sewa Bus Pariwisata', price: 'Mulai Rp 2.500.000/hari' }
        ]
    },
    // SERVICE 3: Konsultasi SDA
    'sda': {
        title: 'KONSULTASI SDA',
        desc: 'Solusi teknis dan perizinan terkait Sumber Daya Air.',
        prices: [
            { item: 'Studi Kelayakan (FS)', price: 'Call for Price' },
            { item: 'Perizinan SIPA', price: 'Mulai Rp 15.000.000' },
            { item: 'Kajian Hidrologi', price: 'Mulai Rp 25.000.000' }
        ]
    },
    // SERVICE 4: Sertifikasi
    'sertifikasi': {
        title: 'SERTIFIKASI',
        desc: 'Pendampingan sertifikasi profesi dan ISO perusahaan.',
        prices: [
            { item: 'Pelatihan & Uji Kompetensi BNSP', price: 'Mulai Rp 3.500.000/pax' },
            { item: 'Pendampingan ISO 9001', price: 'Mulai Rp 45.000.000' },
            { item: 'Pendampingan ISO 14001', price: 'Mulai Rp 45.000.000' }
        ]
    },
    // SERVICE 5: Public Training
    'training': {
        title: 'PUBLIC TRAINING',
        desc: 'Program pelatihan terbuka untuk umum dengan materi terkini.',
        prices: [
            { item: 'Online Training (Webinar)', price: 'Rp 500.000/pax' },
            { item: 'Offline Training (2 Hari)', price: 'Rp 4.500.000/pax' },
            { item: 'Sertifikasi BNSP', price: 'Bundling + Rp 2.500.000' }
        ]
    },
    // SERVICE 6: In House Training
    'inhouse': {
        title: 'IN HOUSE TRAINING',
        desc: 'Pelatihan eksklusif di lokasi perusahaan Anda.',
        prices: [
            { item: 'Paket Basic (Max 20 Pax)', price: 'Rp 25.000.000' },
            { item: 'Paket Premium (Custom Materi)', price: 'Rp 35.000.000' },
            { item: 'Lokasi Luar Kota', price: '+ Akomodasi Tim' }
        ]
    },
    // SERVICE 7: Laboratorium
    'lab': {
        title: 'LABORATORIUM & LINGKUNGAN',
        desc: 'Jasa pengambilan dan pengujian sampel lingkungan.',
        prices: [
            { item: 'Uji Kualitas Air Bersih', price: 'Mulai Rp 750.000/titik' },
            { item: 'Uji Kualitas Udara Ambien', price: 'Mulai Rp 2.500.000/titik' },
            { item: 'Sampling Tanah', price: 'Mulai Rp 1.500.000/sampel' }
        ]
    },
    // SERVICE 8: Konsultasi Teknis
    'consulting': {
        title: 'KONSULTASI TEKNIS',
        desc: 'Konsultasi engineering dan manajemen proyek.',
        prices: [
            { item: 'Konsultasi Per Jam', price: 'Rp 1.500.000' },
            { item: 'Supervisi Proyek (Bulanan)', price: 'Nego' },
            { item: 'Penyusunan DED', price: 'Call for Price' }
        ]
    },
    // EXISTING PACKAGES (KEEPING FOR COMPATIBILITY)
    'A': {
        title: 'PAKET A - TRAINING',
        desc: 'Solusi lengkap untuk meningkatkan kompetensi tim Anda.',
        prices: [{ item: 'Public Training (per pax)', price: 'Rp 4.500.000' }, { item: 'In-House Training', price: 'Rp 25.000.000' }]
    },
    'B': {
        title: 'PAKET B - GATHERING',
        desc: 'Bangun kekompakan tim dengan kegiatan seru dan berkesan.',
        prices: [{ item: 'One Day Trip', price: 'Mulai Rp 350.000' }, { item: '2D1N Gathering', price: 'Mulai Rp 850.000' }]
    },
    'C': {
        title: 'PAKET C - KONSULTASI',
        desc: 'Pendampingan ahli untuk solusi teknis dan manajemen perusahaan.',
        prices: [{ item: 'Konsultasi Per Jam', price: 'Rp 1.500.000' }, { item: 'Pendampingan Proyek', price: 'Nego' }]
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
        // REMOVE state awal animasi (hidden state)
        panel.classList.remove('opacity-0', 'scale-50', 'translate-y-12');
    }, 10);
};

// Fungsi Tutup Modal
window.closePricingModal = () => {
    const modal = document.getElementById('pricingModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');

    // Animasi Keluar (ADD state hidden animation)
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'scale-50', 'translate-y-12');

    // Tunggu animasi selesai baru hide
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500); // 500ms sesuai durasi transition di HTML
};

// Fungsi Lanjut ke WhatsApp (dari dalam modal)
const whatsappBtn = document.getElementById('btnWhatsapp');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = "6282264195559"; // UPDATE NUMBER HERE
        const message = `Halo Admin, saya tertarik dengan *${currentPackage}* dan ingin diskusi harga lebih lanjut. Mohon infonya.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

        closePricingModal();
    });
}

// --- LOGIKA POP-UP PORTFOLIO ---

const portfolioData = {
    'training': {
        title: 'Dokumentasi Training',
        date: '20 Desember 2024',
        desc: 'Berikut adalah dokumentasi kegiatan training yang telah kami laksanakan. Kami berkomitmen untuk memberikan pelatihan berkualitas tinggi dengan materi yang relevan dan instruktur yang berpengalaman. Peserta mendapatkan pengalaman belajar yang interaktif dan aplikatif.',
        imagesKey: 'training' // Key di siteImages.portfolioDetails
    },
    'workshop': {
        title: 'Workshop Teknis',
        date: '15 November 2024',
        desc: 'Dokumentasi kegiatan Workshop Teknis yang mendalam dan komprehensif. Kami menghadirkan praktisi ahli untuk berbagi wawasan teknis terkini, memastikan peserta tidak hanya memahami teori tetapi juga mampu menerapkannya di lapangan.',
        imagesKey: 'workshop'
    },
    'akreditasi': {
        title: 'Pendampingan Akreditasi',
        date: '10 Oktober 2024',
        desc: 'Proses pendampingan akreditasi laboratorium dan lembaga inspeksi. Mulai dari penyusunan dokumen, audit internal, hingga persiapan asesmen eksternal. Kami memastikan klien siap 100% menghadapi proses akreditasi.',
        imagesKey: 'akreditasi'
    },
    'survei': {
        title: 'Survei Lapangan',
        date: '5 September 2024',
        desc: 'Kegiatan survei lapangan untuk pengambilan data teknis sumber daya air dan lingkungan. Dilakukan oleh tim tenaga ahli yang kompeten dengan menggunakan peralatan survei modern untuk memastikan akurasi data.',
        imagesKey: 'survei'
    },
    'sampling': {
        title: 'Sampling Lingkungan',
        date: '28 Agustus 2024',
        desc: 'Proses pengambilan sampel lingkungan yang sesuai dengan standar SNI dan regulasi yang berlaku. Cakupan sampling meliputi air, udara, dan tanah untuk keperluan analisis laboratorium dan pemantauan lingkungan.',
        imagesKey: 'sampling'
    },
    'kreatif': {
        title: 'Pelatihan Kreatif',
        date: '12 Juli 2024',
        desc: 'Workshop interaktif yang dirancang untuk mengasah kreativitas dan inovasi tim. Menggabungkan metode belajar yang fun dengan materi yang berbobot, pelatihan ini cocok untuk fresh graduate hingga level manajerial.',
        imagesKey: 'kreatif'
    }
};

window.openPortfolioModal = (type) => {
    const data = portfolioData[type];
    if (!data) return;

    // Populate Data
    document.getElementById('portfolioTitle').innerText = data.title;
    document.getElementById('portfolioDate').innerText = data.date;
    document.getElementById('portfolioDesc').innerText = data.desc;

    // Populate Images
    const imgContainer = document.getElementById('portfolioImages');
    imgContainer.innerHTML = ''; // Reset

    const images = siteImages.portfolioDetails[data.imagesKey];
    if (images) {
        images.forEach(imgSrc => {
            // Kita bisa bikin element img atau div bg
            const div = document.createElement('div');
            // Aspect ratio box
            div.className = 'aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-md bg-gray-100 hover:scale-105 transition-transform duration-300';
            div.innerHTML = `<img src="${imgSrc}" class="w-full h-full object-cover">`;
            imgContainer.appendChild(div);
        });
    }

    // Show Modal
    const modal = document.getElementById('portfolioModal');
    const backdrop = document.getElementById('portfolioBackdrop');
    const panel = document.getElementById('portfolioPanel');

    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'scale-95');
    }, 10);
};

window.closePortfolioModal = () => {
    const modal = document.getElementById('portfolioModal');
    const backdrop = document.getElementById('portfolioBackdrop');
    const panel = document.getElementById('portfolioPanel');

    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};