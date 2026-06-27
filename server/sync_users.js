const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  rl.question('Enter Remote API Base URL (e.g., https://your-backend.up.railway.app): ', async (remoteUrl) => {
    try {
      remoteUrl = remoteUrl.trim().replace(/\/$/, '');
      if (!remoteUrl) throw new Error("URL is required");

      console.log('Connecting to local database...');
      const pool = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_password || process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
      });

      console.log('Fetching local users...');
      const [users] = await pool.query('SELECT * FROM users');
      
      const payload = users.map(u => ({
        ...u,
        created_at: new Date(u.created_at).toISOString().slice(0, 19).replace('T', ' ')
      }));

      console.log(`Found ${users.length} users. Syncing to remote...`);
      
      const res = await fetch(`${remoteUrl}/api/admin/sync-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to sync users: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log(`✅ Successfully synced ${data.synced} users!`);

      process.exit(0);
    } catch (e) {
      console.error('❌ Error:', e.message);
      process.exit(1);
    }
  });
}

main();
