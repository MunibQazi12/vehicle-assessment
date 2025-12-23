/**
 * Test double-base64 decoding with real API data
 */

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

console.log('🔍 Testing double-base64 decoding...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ condition: ['new'], page: 1, items_per_page: 1 }),
  });

  const data = await response.json();
  const vehicle = data.data.vehicles[0];
  const photoPreview = vehicle.photo_preview;
  
  console.log('Vehicle:', vehicle.title);
  console.log('Original (double-encoded):', photoPreview.substring(0, 50) + '...');
  console.log('Length:', photoPreview.length);
  
  // Decode once
  const decoded = Buffer.from(photoPreview, 'base64').toString('ascii');
  console.log('\nDecoded once:', decoded.substring(0, 50) + '...');
  console.log('Decoded length:', decoded.length);
  console.log('Starts with UklGR?', decoded.startsWith('UklGR'), '✓');
  
  // Create data URL
  const blurDataURL = `data:image/webp;base64,${decoded}`;
  console.log('\nFinal data URL prefix:', blurDataURL.substring(0, 80));
  
  // Verify the WebP is valid
  const webpBytes = Buffer.from(decoded, 'base64');
  console.log('\nWebP validation:');
  console.log('  Size:', webpBytes.length, 'bytes');
  console.log('  RIFF:', webpBytes.toString('ascii', 0, 4));
  console.log('  WEBP:', webpBytes.toString('ascii', 8, 12));
  
  if (webpBytes.toString('ascii', 0, 4) === 'RIFF' && webpBytes.toString('ascii', 8, 12) === 'WEBP') {
    console.log('  ✅ Valid WebP file!');
    
    // Create test HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>✅ FIXED - Blur Test</title>
  <style>
    body { padding: 40px; background: #1a1a1a; color: white; font-family: sans-serif; }
    .success { background: #2d5016; padding: 30px; border-radius: 12px; margin: 30px 0; border: 3px solid #4caf50; }
    .test { background: #2a2a2a; padding: 30px; margin: 30px 0; border-radius: 12px; }
    img { border: 3px solid #4caf50; margin: 15px 0; display: block; background: #333; }
    h1 { color: #4caf50; }
    h3 { color: #aaa; margin-top: 0; }
  </style>
</head>
<body>
  <h1>✅ BLUR PREVIEW FIXED!</h1>
  
  <div class="success">
    <h2>Success Details</h2>
    <p><strong>Vehicle:</strong> ${vehicle.title}</p>
    <p><strong>Original Photo:</strong> <a href="${vehicle.photo}" style="color: #4caf50;">${vehicle.photo}</a></p>
    <p><strong>Thumbnail:</strong> ${webpBytes.length} bytes (16x9 pixels)</p>
    <p><strong>Status:</strong> Double-base64 encoding detected and corrected ✓</p>
  </div>

  <div class="test">
    <h3>1. Native Size (Actual 16x9 pixels)</h3>
    <img src="${blurDataURL}" alt="Tiny original" />
    <p>^ This tiny image proves the WebP is valid</p>
  </div>

  <div class="test">
    <h3>2. Scaled 100x67 (Blur Placeholder Size)</h3>
    <img src="${blurDataURL}" alt="100x67" style="width: 100px; height: 67px;" />
  </div>

  <div class="test">
    <h3>3. Next.js Style Blur (200x133 with CSS blur filter)</h3>
    <div style="
      width: 200px; 
      height: 133px; 
      background-image: url('${blurDataURL}'); 
      background-size: cover;
      background-position: center;
      filter: blur(20px) brightness(0.95);
      border: 3px solid #4caf50;
      transform: scale(1.1);
    "></div>
    <p>^ This is how it will appear during image loading</p>
  </div>

  <div class="test">
    <h3>4. Large Pixelated (400x267 - Shows thumbnail structure)</h3>
    <img src="${blurDataURL}" alt="Large" style="width: 400px; height: 267px; image-rendering: pixelated;" />
  </div>

  <h2 style="color: #4caf50; text-align: center; padding: 40px 0;">
    🎉 The blur placeholder now works correctly!<br>
    Deploy to production to see smooth loading on slow connections.
  </h2>
</body>
</html>`;

    import('fs').then(fs => {
      fs.default.mkdirSync('scripts/output', { recursive: true });
      fs.default.writeFileSync('scripts/output/blur-fixed.html', html);
      console.log('\n✅ Test file created: scripts/output/blur-fixed.html');
      console.log('   Open this in a browser to see the working blur!');
    });
    
  } else {
    console.log('  ❌ Invalid WebP structure');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
