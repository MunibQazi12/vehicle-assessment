/**
 * Validate that the tiny WebP thumbnails are actually valid
 */

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

console.log('🔍 Validating WebP thumbnails...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ condition: ['new'], page: 1, items_per_page: 1 }),
  });

  const data = await response.json();
  const vehicle = data.data.vehicles[0];
  const preview = vehicle.photo_preview;

  console.log('Vehicle:', vehicle.title);
  console.log('Preview length:', preview.length, 'chars');
  
  const decoded = Buffer.from(preview, 'base64');
  console.log('Decoded size:', decoded.length, 'bytes');
  console.log('First 12 bytes (hex):', decoded.slice(0, 12).toString('hex'));
  console.log('First 12 bytes (ascii):', decoded.toString('ascii', 0, 12));
  
  // Proper WebP validation
  if (decoded.length >= 12) {
    const riff = decoded.toString('ascii', 0, 4);
    const fileSize = decoded.readUInt32LE(4);
    const webp = decoded.toString('ascii', 8, 12);
    
    console.log('\nWebP Structure:');
    console.log('  RIFF:', riff);
    console.log('  File size field:', fileSize, 'bytes');
    console.log('  File size field + 8:', fileSize + 8, 'bytes');
    console.log('  Actual size:', decoded.length, 'bytes');
    console.log('  WEBP marker:', webp);
    
    if (riff === 'RIFF' && webp === 'WEBP') {
      console.log('  ✅ Valid WebP header');
      
      // The RIFF size is the file size minus 8 (for RIFF header)
      // So actual file size should be fileSize + 8
      const expectedSize = fileSize + 8;
      if (decoded.length >= expectedSize) {
        console.log('  ✅ Complete WebP file');
      } else {
        console.log('  ❌ Truncated - expected', expectedSize, 'got', decoded.length);
      }
    } else {
      console.log('  ❌ Invalid WebP header');
    }
  }
  
  // Create test HTML with multiple rendering approaches
  const dataURL = `data:image/webp;base64,${preview}`;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>WebP Thumbnail Test - ${vehicle.title}</title>
  <style>
    body { 
      padding: 40px; 
      background: #f5f5f5; 
      font-family: system-ui, -apple-system, sans-serif;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #333; }
    .test-group { 
      background: white; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .test-item { 
      margin: 15px 0; 
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .test-item h3 { margin-top: 0; color: #666; font-size: 14px; }
    img { 
      border: 2px solid #e74c3c; 
      background: #ecf0f1;
      display: block;
      margin: 10px 0;
    }
    .info { 
      background: #fff3cd; 
      padding: 15px; 
      border-radius: 4px; 
      margin: 20px 0;
      border-left: 4px solid #ffc107;
    }
    .success { 
      background: #d4edda; 
      border-left-color: #28a745;
    }
    code { 
      background: #f8f9fa; 
      padding: 2px 6px; 
      border-radius: 3px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>WebP Thumbnail Validation Test</h1>
    
    <div class="info">
      <strong>Vehicle:</strong> ${vehicle.title}<br>
      <strong>Original Photo:</strong> <a href="${vehicle.photo}" target="_blank">${vehicle.photo}</a><br>
      <strong>Thumbnail Size:</strong> ${decoded.length} bytes (${preview.length} base64 chars)<br>
      <strong>Expected Dimensions:</strong> ~16x9 pixels
    </div>

    <div class="test-group">
      <h2>Test 1: Native Size (Let browser decide)</h2>
      <div class="test-item">
        <h3>No width/height specified</h3>
        <img src="${dataURL}" alt="Native size" />
        <p>If you see a tiny image, the WebP is valid but very small (16x9px)</p>
      </div>
    </div>

    <div class="test-group">
      <h2>Test 2: Scaled Versions</h2>
      
      <div class="test-item">
        <h3>50x50 (should be blurry)</h3>
        <img src="${dataURL}" alt="50x50" style="width: 50px; height: 50px;" />
      </div>
      
      <div class="test-item">
        <h3>100x100 pixelated</h3>
        <img src="${dataURL}" alt="100x100" style="width: 100px; height: 100px; image-rendering: pixelated;" />
      </div>
      
      <div class="test-item">
        <h3>200x133 (maintaining ~3:2 aspect ratio) - smooth</h3>
        <img src="${dataURL}" alt="200x133" style="width: 200px; height: 133px; image-rendering: auto;" />
      </div>
      
      <div class="test-item">
        <h3>300x200 - crisp-edges</h3>
        <img src="${dataURL}" alt="300x200" style="width: 300px; height: 200px; image-rendering: crisp-edges;" />
      </div>
    </div>

    <div class="test-group">
      <h2>Test 3: As CSS Background</h2>
      <div class="test-item">
        <h3>Background image with blur filter</h3>
        <div style="
          width: 300px; 
          height: 200px; 
          background-image: url('${dataURL}'); 
          background-size: cover; 
          background-position: center;
          filter: blur(10px);
          border: 2px solid #e74c3c;
        "></div>
        <p>This simulates Next.js Image blur effect</p>
      </div>
    </div>

    <div class="info success">
      <strong>Expected Result:</strong><br>
      - If images show above = ✅ WebP thumbnail is valid<br>
      - If broken image icon = ❌ WebP data is corrupted<br>
      - Tiny but visible = thumbnail is valid, just small (this is normal for blur placeholders)
    </div>

    <div class="test-group">
      <h2>Raw Data Info</h2>
      <div class="test-item">
        <h3>Base64 String (first 100 chars)</h3>
        <code>${preview.substring(0, 100)}...</code>
      </div>
      <div class="test-item">
        <h3>Data URL (first 150 chars)</h3>
        <code>${dataURL.substring(0, 150)}...</code>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Save test file
  const fs = await import('fs');
  fs.default.mkdirSync('scripts/output', { recursive: true });
  fs.default.writeFileSync('scripts/output/webp-validation.html', html);
  
  console.log('\n✅ Test HTML created: scripts/output/webp-validation.html');
  console.log('   Open this file in a browser to validate the WebP thumbnail');
  console.log('\n📋 Quick test: Copy this data URL and paste in browser address bar:');
  console.log(dataURL.substring(0, 200) + '...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
