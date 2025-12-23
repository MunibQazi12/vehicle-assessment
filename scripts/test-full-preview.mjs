/**
 * Test complete photo_preview from API
 */

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

const requestBody = {
  condition: ['new'],
  page: 1,
  items_per_page: 1
};

console.log('🔍 Fetching complete photo_preview from API...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.data?.vehicles?.length > 0) {
    const vehicle = data.data.vehicles[0];
    
    console.log('Vehicle:', vehicle.title);
    console.log('Photo:', vehicle.photo);
    console.log('\n--- Complete photo_preview ---');
    console.log(vehicle.photo_preview);
    console.log('\n--- Length:', vehicle.photo_preview?.length || 0);
    
    if (vehicle.photo_preview) {
      // Detect format
      let format = 'unknown';
      if (vehicle.photo_preview.startsWith('UklGR')) format = 'WebP (RIFF)';
      else if (vehicle.photo_preview.startsWith('/9j/')) format = 'JPEG';
      else if (vehicle.photo_preview.startsWith('iVBOR')) format = 'PNG';
      
      console.log('--- Detected format:', format);
      
      // Try to decode
      const decoded = Buffer.from(vehicle.photo_preview, 'base64');
      console.log('--- Decoded size:', decoded.length, 'bytes');
      
      // Check WebP structure
      if (decoded.length >= 12) {
        const riff = decoded.toString('ascii', 0, 4);
        const size = decoded.readUInt32LE(4);
        const webp = decoded.toString('ascii', 8, 12);
        
        console.log('--- RIFF header:', riff);
        console.log('--- File size in header:', size);
        console.log('--- WebP marker:', webp);
        console.log('--- Actual decoded size:', decoded.length);
        
        if (riff === 'RIFF' && webp === 'WEBP') {
          console.log('✅ Valid WebP structure detected');
          
          // Check if size matches
          if (size + 8 === decoded.length) {
            console.log('✅ Size matches - complete file');
          } else {
            console.log('⚠️  Size mismatch - may be truncated or have extra data');
            console.log('    Expected:', size + 8, 'Got:', decoded.length);
          }
        } else {
          console.log('❌ Invalid WebP structure');
        }
      }
      
      // Create data URL
      const dataURL = `data:image/webp;base64,${vehicle.photo_preview}`;
      
      console.log('\n--- Test HTML (complete) ---');
      console.log(`<img src="${dataURL}" alt="Blur test" style="width: 100px; height: 100px; border: 2px solid red;" />`);
      
      // Save to file for testing
      import('fs').then(fs => {
        fs.default.writeFileSync('scripts/output/test-preview.html', `
<!DOCTYPE html>
<html>
<head>
  <title>Blur Preview Test</title>
  <style>
    body { padding: 20px; background: #f0f0f0; }
    .test { margin: 20px 0; }
    img { border: 2px solid red; image-rendering: pixelated; }
  </style>
</head>
<body>
  <h1>Blur Preview Test</h1>
  <div class="test">
    <h2>Original Size (${decoded.length} bytes)</h2>
    <img src="${dataURL}" alt="Original" style="width: auto; height: auto;" />
  </div>
  <div class="test">
    <h2>Scaled 100x100</h2>
    <img src="${dataURL}" alt="Scaled 100x100" style="width: 100px; height: 100px;" />
  </div>
  <div class="test">
    <h2>Scaled 200x200 Pixelated</h2>
    <img src="${dataURL}" alt="Scaled 200x200" style="width: 200px; height: 200px; image-rendering: pixelated;" />
  </div>
  <div class="test">
    <h2>Vehicle Info</h2>
    <p><strong>Title:</strong> ${vehicle.title}</p>
    <p><strong>Photo URL:</strong> <a href="${vehicle.photo}">${vehicle.photo}</a></p>
    <p><strong>Preview size:</strong> ${decoded.length} bytes</p>
  </div>
</body>
</html>
        `);
        console.log('\n✅ Test HTML saved to: scripts/output/test-preview.html');
        console.log('   Open this file in a browser to see the actual render');
      });
      
    } else {
      console.log('❌ No photo_preview in response');
    }
    
  } else {
    console.log('❌ No vehicles in response');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
