const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke database RDS
const db = mysql.createConnection({
  host: 'ecommerce-db.crcwoe0wydln.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'paris364', // Ganti dengan password kamu
  database: 'ecommerce-db'
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal: ', err);
    return;
  }
  console.log('Terkoneksi ke database RDS!');
});

// Route untuk menampilkan semua produk
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Jalankan server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
