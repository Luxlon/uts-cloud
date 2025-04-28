const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables (optional kalau mau lebih rapi pakai dotenv package)
// require('dotenv').config();

// Konstanta langsung
const DB_HOST = 'ecommerce-db.crcwoe0wydln.ap-southeast-2.rds.amazonaws.com';
const DB_USER = 'admin';
const DB_PASSWORD = 'paris364';
const DB_NAME = 'ecommerce';
const S3_BUCKET_URL = 'https://uts-bucket-ecommerce-product-images.s3.ap-southeast-2.amazonaws.com/';

// Setup koneksi database
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terkoneksi ke database RDS!');
});

// Endpoint API JSON (opsional kalau kamu masih mau /products JSON)
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint tampilan katalog
app.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.send('Error fetching products');
    }

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Product Catalog</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { padding: 40px; background: #f8f9fa; }
          .card-img-top { height: 200px; object-fit: cover; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="mb-4 text-center">🛒 Product Catalog</h1>
          <div class="row g-4">
    `;

    results.forEach(product => {
      // Menambahkan .png kalau perlu
      const imageUrl = `${S3_BUCKET_URL}${product.image}.png`;
      html += `
        <div class="col-md-4">
          <div class="card shadow-sm">
            <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">Price: $${product.price}</p>
            </div>
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di http://3.26.228.237:${port}`);
});
