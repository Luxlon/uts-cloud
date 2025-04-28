require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Static files (kalau kamu butuh, tapi sekarang gambar dari S3)
app.use('/images', express.static('public/images'));

// Koneksi Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to database');
});

// Route utama '/'
app.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.send('Error fetching products');
    }

    let html = `
      <html>
        <head>
          <title>Product Catalog</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .product { margin-bottom: 30px; }
            img { max-width: 200px; height: auto; display: block; margin-bottom: 10px; }
            .products-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
          </style>
        </head>
        <body>
          <h1>Product Catalog</h1>
          <div class="products-container">
    `;

    results.forEach(product => {
      const imageUrl = `${process.env.S3_BUCKET_URL}${product.image}`;
      html += `
        <div class="product">
          <img src="${imageUrl}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Price: $${product.price}</p>
        </div>
      `;
    });

    html += `
          </div>
        </body>
      </html>
    `;

    res.send(html);
  });
});

// Jalankan server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
