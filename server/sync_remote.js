const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BACKUP_FILE = path.join(__dirname, 'products_backup.json');
const MEDIA_DIR = path.join(__dirname, 'media', 'products');

async function syncProducts(remoteUrl) {
  if (!remoteUrl.endsWith('/api/products')) {
    remoteUrl = remoteUrl.replace(/\/$/, '') + '/api/products';
  }

  console.log(`\nStarting sync to: ${remoteUrl}\n`);
  
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error(`❌ Error: Backup file not found at ${BACKUP_FILE}`);
    return;
  }

  const localProducts = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
  console.log(`Loaded ${localProducts.length} products from local backup.\n`);

  try {
    // 1. Fetch remote products
    const res = await fetch(remoteUrl);
    if (!res.ok) throw new Error(`Failed to fetch remote products. Status: ${res.status}`);
    
    const remoteData = await res.json();
    const remoteProducts = Array.isArray(remoteData) ? remoteData : (remoteData.products || []);
    console.log(`Fetched ${remoteProducts.length} products from remote server.\n`);

    // Map by ID
    const remoteMap = new Map(remoteProducts.map(p => [p.id, p]));
    const localMap = new Map(localProducts.map(p => [p.id, p]));

    // 2. Delete remote products that are not in local
    for (const [id, rp] of remoteMap) {
      if (!localMap.has(id)) {
        console.log(`[DELETE] Removing remote product: ${rp.name} (${id})`);
        await fetch(`${remoteUrl}/${id}`, { method: 'DELETE' });
      }
    }

    // 3. Add or Update products from local to remote
    for (const lp of localProducts) {
      const rp = remoteMap.get(lp.id);
      
      const payload = {
        id: lp.id,
        sku: lp.sku,
        name: lp.name,
        category: lp.category_slug,
        description: lp.description,
        manufacturer: lp.manufacturer,
        price: lp.price,
        mrp: lp.mrp,
        stockQuantity: lp.stock_quantity,
        availabilityStatus: lp.availability_status,
        imageDataUrl: lp.image_url,
        imageSourceType: lp.image_source_type
      };

      if (!rp) {
        console.log(`[ADD] Creating remote product: ${lp.name} (${lp.id})`);
        const postRes = await fetch(remoteUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!postRes.ok) console.error(`   ❌ Failed to add ${lp.name}:`, await postRes.text());
        
        await handleImageUpload(lp, remoteUrl);
      } else {
        console.log(`[UPDATE] Updating remote product: ${lp.name} (${lp.id})`);
        const putRes = await fetch(`${remoteUrl}/${lp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!putRes.ok) console.error(`   ❌ Failed to update ${lp.name}:`, await putRes.text());
        
        await handleImageUpload(lp, remoteUrl);
      }
    }

    console.log('\n✅ Sync completed successfully!');

  } catch (err) {
    console.error('\n❌ Sync failed:', err.message);
  } finally {
    rl.close();
  }
}

async function handleImageUpload(lp, remoteUrl) {
  if (lp.image_source_type === 'UPLOAD' && lp.image_url && lp.image_url.startsWith('/media/')) {
    const filename = path.basename(lp.image_url);
    const filepath = path.join(MEDIA_DIR, filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`   -> Uploading local image for ${lp.name}...`);
      
      const buffer = fs.readFileSync(filepath);
      const blob = new Blob([buffer]);
      
      const form = new FormData();
      form.append('image', blob, filename);
      
      const imgRes = await fetch(`${remoteUrl}/${lp.id}/image`, {
        method: 'POST',
        body: form
      });
      if (!imgRes.ok) console.error(`   ❌ Failed to upload image for ${lp.name}`);
    } else {
      console.log(`   ⚠️ Warning: Local image file not found for ${lp.name} (${filepath})`);
    }
  }
}

console.log('================================================================');
console.log('Sri Srinivasa Medicals — Remote Database Sync Utility');
console.log('================================================================');
console.log('This script will synchronize your remote API database with the');
console.log('local products_backup.json file so the Vercel app shows exact data.\n');

rl.question('Enter your remote API Base URL (e.g., https://srinivasa-medicals-production.up.railway.app):\n> ', (url) => {
  if (!url) {
    console.log('No URL provided. Exiting.');
    rl.close();
    return;
  }
  syncProducts(url.trim());
});
