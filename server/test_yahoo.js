const mysql = require('mysql2/promise');
require('dotenv').config();

async function searchImage(query) {
  try {
    const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query + ' medicine pharmacy india')}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    
    if (response.status !== 200) return null;
    
    const html = await response.text();
    const match = html.match(/https:\/\/tse[0-9]\.mm\.bing\.net\/th\?id=[a-zA-Z0-9_.-]+/);
    if (match) {
      return match[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const newUrl = await searchImage('Dolo 650 Tablet');
  console.log('Result:', newUrl);
}

run().catch(console.error);
