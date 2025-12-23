/**
 * Test the fixed getBlurDataURL with actual API data
 */

import { getBlurDataURL } from '../packages/lib/utils/image.ts';

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

console.log('🔍 Testing fixed blur data URL with real API data...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ condition: ['new'], page: 1, items_per_page: 1 }),
  });

  const data = await response.json();
  const vehicle = data.data.vehicles[0];
  
  console.log('Vehicle:', vehicle.title);
  console.log('Original photo_preview:', vehicle.photo_preview.substring(0, 50) + '...');
  console.log('Length:', vehicle.photo_preview.length);
  
  // Use the utility
  const blurDataURL = getBlurDataURL(vehicle.photo_preview);
  
  console.log('\n✅ Generated blur data URL:');
  console.log('Full length:', blurDataURL.length);
  console.log('Prefix:', blurDataURL.substring(0, 80));
  console.log('Should start with "UklGR" after base64, prefix:', blurDataURL.substring(23, 28));
  
  // Verify it's correct
  if (blurDataURL.startsWith('data:image/webp;base64,UklGR')) {
    console.log('\n✅ SUCCESS! Blur data URL is correctly decoded');
    console.log('   MIME type: image/webp ✓');
    console.log('   Starts with RIFF signature (UklGR) ✓');
    
    // Create test HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Fixed Blur Test - ${vehicle.title}</title>
  <style>
    body { padding: 40px; background: #f5f5f5; font-family: sans-serif; }
    .success { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
    .test { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h3 { color: #666; margin-top: 0; }
    img { border: 2px solid #28a745; margin: 10px 0; display: block; }
  </style>
</head>
<body>
  <h1>✅ Fixed Blur Preview Test</h1>
  
  <div class="success">
    <strong>Vehicle:</strong> ${vehicle.title}<br>
    <strong>Status:</strong> Blur data URL correctly decoded<br>
    <strong>Size:</strong> ${blurDataURL.length} chars
  </div>

  <div class="test">
    <h3>Original Size</h3>
    <img src="${blurDataURL}" alt="Original" />
    <p>This should show a tiny but valid image (16x9 pixels)</p>
  </div>

  <div class="test">
    <h3>Scaled 100x67 (Smooth)</h3>
    <img src="${blurDataURL}" alt="100x67" style="width: 100px; height: 67px;" />
  </div>

  <div class="test">
    <h3>Scaled 200x133 with Blur (Next.js Style)</h3>
    <div style="
      width: 200px; 
      height: 133px; 
      background-image: url('${blurDataURL}'); 
      background-size: cover;
      filter: blur(20px);
      border: 2px solid #28a745;
    "></div>
    <p>This simulates how Next.js Image displays the blur placeholder</p>
  </div>

  <div class="test">
    <h3>Large Scale 400x267 Pixelated</h3>
    <img src="${blurDataURL}" alt="400x267" style="width: 400px; height: 267px; image-rendering: pixelated;" />
    <p>Shows the actual thumbnail pixels clearly</p>
  </div>

  <h2>🎉 The blur placeholder should now work correctly in production!</h2>
</body>
</html>`;

    import('fs').then(fs => {
      fs.default.mkdirSync('scripts/output', { recursive: true });
      fs.default.writeFileSync('scripts/output/fixed-blur-test.html', html);
      console.log('\n✅ Test HTML saved: scripts/output/fixed-blur-test.html');
      console.log('   Open this to verify the blur works!');
    });
    
  } else {
    console.log('\n❌ ERROR: Blur data URL is incorrect');
    console.log('   Got:', blurDataURL.substring(0, 100));
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
