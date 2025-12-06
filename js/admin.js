// --- PROTEKSI HALAMAN ADMIN ---
// Cek apakah user punya "tiket" login di localStorage
if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
    alert("Eits! Login dulu bos!");
    window.location.href = 'login.html'; // Tendang ke halaman login
}

// --- FUNGSI LOGOUT (Tambahan) ---
function logout() {
    localStorage.removeItem('isAdminLoggedIn'); // Robek tiketnya
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
});

async function loadMessages() {
    const tableBody = document.getElementById('messageTableBody');
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading...</td></tr>';

    try {
        // Tembak API GET yang baru kita buat
        const response = await fetch('http://localhost:3000/api/messages');
        const data = await response.json();

        // Bersihkan tabel
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 font-bold">Belum ada pesan masuk.</td></tr>';
            return;
        }

        // Looping data dan masukkan ke tabel
        data.forEach(msg => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

            // Format Tanggal biar cantik
            const date = new Date(msg.date).toLocaleString('id-ID', { 
                day: 'numeric', month: 'short', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });

            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap font-medium">${date}</td>
                <td class="py-3 px-6 text-left font-bold text-[#0f2820]">${msg.name}</td>
                <td class="py-3 px-6 text-left text-blue-600">${msg.email}</td>
                <td class="py-3 px-6 text-left italic">"${msg.message}"</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500 font-bold">Gagal mengambil data: ${error.message} <br> Pastikan Server (Port 3000) Nyala!</td></tr>`;
    }
}