const mysql = require('mysql2/promise');
require('dotenv').config();

async function searchImage(query) {
  try {
    const url = `https://pharmeasy.in/api/search/search/?intent_id=1686895311234&q=${encodeURIComponent(query)}&page=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.status !== 200) return null;
    
    const data = await response.json();
    if (data && data.data && data.data.products && data.data.products.length > 0) {
      const product = data.data.products[0];
      if (product.damImages && product.damImages.length > 0) {
        return product.damImages[0].url;
      } else if (product.image) {
        // Strip out query params like ?dim=80x80 to get the original image
        return product.image.split('?')[0];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'srinivasa_medicals'
  });

  console.log('Fetching products from database...');
  const [rows] = await connection.execute('SELECT id, name, image_url FROM products');
  
  let updatedCount = 0;
  let sampleOldUrls = [];
  let sampleNewUrls = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let isBroken = false;
    
    try {
      const res = await fetch(row.image_url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        method: 'HEAD',
      });
      if (res.status >= 400) {
        isBroken = true;
      }
    } catch (e) {
      isBroken = true;
    }

    if (isBroken || row.image_url.includes('netmeds.com')) {
      // Force checking netmeds since we know they are broken
      const newUrl = await searchImage(row.name);
      if (newUrl) {
        await connection.execute('UPDATE products SET image_url = ? WHERE id = ?', [newUrl, row.id]);
        console.log(`[UPDATED] ${row.name} -> ${newUrl}`);
        
        updatedCount++;
        if (sampleOldUrls.length < 3) {
          sampleOldUrls.push(row.image_url);
          sampleNewUrls.push(newUrl);
        }
      } else {
        console.log(`[FAILED TO FIND IMAGE] ${row.name}`);
      }
    } else {
      console.log(`[OK] ${row.name}`);
    }
    
    // Add delay to avoid rate-limiting from Pharmeasy API
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('--- SUMMARY ---');
  console.log(`Total URLs updated: ${updatedCount}`);
  console.log(`Sample old URLs replaced:`, sampleOldUrls);
  console.log(`Sample new URLs added:`, sampleNewUrls);

  await connection.end();
}

run().catch(console.error);
