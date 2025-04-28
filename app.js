const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Konstanta langsung dari .env
const DB_HOST = 'ecommerce-db.crcwoe0wydln.ap-southeast-2.rds.amazonaws.com';
const DB_USER = 'admin';
const DB_PASSWORD = 'paris364';
const DB_NAME = 'ecommerce';
const S3_BUCKET_URL = 'https://uts-bucket-ecommerce-product-images.s3.ap-southeast-2.amazonaws.com/';

// Static files (kalau kamu butuh, tapi sekarang gambar dari S3)
app.use('/images', express.static('public/images'));

// Koneksi Database
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
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
      const imageUrl = `${S3_BUCKET_URL}${product.image}`;
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
