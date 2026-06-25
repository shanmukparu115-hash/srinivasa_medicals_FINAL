const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function exportProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'srinivasa_medicals'
  });

  console.log('Exporting products...');
  const [rows] = await connection.execute('SELECT * FROM products');
  
  fs.writeFileSync('products_backup.json', JSON.stringify(rows, null, 2));
  console.log(`Successfully saved ${rows.length} products to products_backup.json!`);

  await connection.end();
}

exportProducts().catch(console.error);
