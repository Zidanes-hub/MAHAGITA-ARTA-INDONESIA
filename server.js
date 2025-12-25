// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (Biar bisa baca JSON dan diakses dari frontend)
app.use(cors());
app.use(express.json());

// --- 1. KONEKSI KE DATABASE (MongoDB) ---
// Nanti URL-nya kita taruh di .env biar aman
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahagitaDB')
    .then(() => console.log("🔥 Database MongoDB Konek, Bos!"))
    .catch(err => console.log("❌ Gagal Konek Database:", err));

// --- 2. BIKIN SCHEMA (Struktur Data) ---
// Kita mau simpan pesan dari form Contact Us
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// --- 3. BIKIN API ENDPOINT (Jalur Masuk) ---

const path = require('path');

// --- Middleware Static Files ---
app.use(express.static(path.join(__dirname, 'public'))); // Serve folder public (images, documents, etc.)
app.use('/css', express.static(path.join(__dirname, 'css'))); // Tetap serve CSS dari root (bisa dipindah ke public kalau mau)
app.use('/js', express.static(path.join(__dirname, 'js'))); // Tetap serve JS dari root

// --- 3. BIKIN API ENDPOINT (Jalur Masuk) ---

// Route Utama (Landing Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route Login Page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route Admin Page
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route buat nerima pesan dari form (POST)
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Simpan ke database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: 'Pesan berhasil disimpan!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Route buat AMBIL semua pesan (GET) - Khusus Admin ---
app.get('/api/messages', async (req, res) => {
    try {
        // Ambil semua data dari MongoDB, urutkan dari yang paling baru (date: -1)
        const messages = await Message.find().sort({ date: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Route LOGIN (POST) ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // KITA SETTING USERNAME & PASSWORD ADMIN DI SINI
    // Nanti bisa diganti logic database kalau mau lebih canggih
    const adminUser = "admin";
    const adminPass = "mahagita2025"; // Password rahasia

    if (username === adminUser && password === adminPass) {
        res.json({ success: true, message: "Login Berhasil!" });
    } else {
        res.status(401).json({ success: false, message: "Username atau Password Salah!" });
    }
});

// Jalankan Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});