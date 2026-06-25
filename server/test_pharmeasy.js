const mysql = require('mysql2/promise');

async function testPharmeasy() {
  const url = `https://pharmeasy.in/api/search/search/?intent_id=1686895311234&q=dolo%20650%20tablet&page=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    if (data && data.data && data.data.products && data.data.products.length > 0) {
      console.log('Image:', data.data.products[0].images[0]);
    } else {
      console.log('No products found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testPharmeasy();
