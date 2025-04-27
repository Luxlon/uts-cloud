require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Static file untuk gambar (sementara)
app.use('/images', express.static('public/images'));

// Koneksi Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to database');
});

// Route utama
app.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.send('Error');
    }
    let html = '<h1>Product List</h1>';
    results.forEach(product => {
      html += `
        <div>
          <h2>${product.name}</h2>
          <img src="${process.env.S3_BUCKET_URL}${product.image}" width="200">
          <p>Price: $${product.price}</p>
        </div>
      `;
    });
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
