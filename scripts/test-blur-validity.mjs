/**
 * Test if blur data URL is valid by trying to decode it
 */

const base64String = 'VWtsR1JtUUFBQUJYUlVKUVZsQTRJRmdBQUFBd0FnQ2RBU29NQUFrQUFVQW1KWndDZElFeEdFUjZqaW5MQUFEaUJFR3g2ZW9YTFhhVkE4WGFnSENiNlhXa295K0IwU3AyU0xoUi9zVVkyL0Z2cHh0VDNJUTdBa2U3cER1Sk1wSXBXTTJqc0xCajNKU09BQUFB';

// Detect format
let mimeType = 'image/webp'; // Default
if (base64String.startsWith('/9j/')) {
  mimeType = 'image/jpeg';
} else if (base64String.startsWith('iVBOR')) {
  mimeType = 'image/png';
} else if (base64String.startsWith('UklGR')) {
  mimeType = 'image/webp';
}

// Test 1: Create data URL with correct MIME type
const dataURL = `data:${mimeType};base64,${base64String}`;
console.log('Detected MIME type:', mimeType);
console.log('Data URL length:', dataURL.length);
console.log('Data URL prefix:', dataURL.substring(0, 50));

// Test 2: Try to decode base64 to verify it's valid
try {
  const decoded = Buffer.from(base64String, 'base64');
  console.log('✅ Base64 decodes successfully');
  console.log('Decoded size:', decoded.length, 'bytes');
  
  // Check format signatures
  const firstBytes = decoded.slice(0, 4).toString('hex');
  console.log('First 4 bytes (hex):', firstBytes);
  
  // RIFF = WebP
  if (decoded.toString('ascii', 0, 4) === 'RIFF') {
    console.log('✅ Data is WebP format (RIFF header detected)');
    const webpType = decoded.toString('ascii', 8, 12);
    console.log('   WebP type:', webpType);
  } else if (decoded[0] === 0xFF && decoded[1] === 0xD8) {
    console.log('✅ Data is JPEG format');
  } else if (decoded[0] === 0x89 && decoded[1] === 0x50) {
    console.log('✅ Data is PNG format');
  } else {
    console.log('❌ Unknown image format');
  }
} catch (error) {
  console.error('❌ Failed to decode base64:', error.message);
}

// Test 3: Create a small HTML to visually test the blur
console.log('\n--- Test HTML ---');
console.log(`
<img 
  src="${dataURL}" 
  alt="Test blur" 
  style="width: 200px; height: 200px; image-rendering: pixelated; border: 2px solid red;" 
/>
`);

console.log('\n✅ Copy the HTML above and open in a browser to see if the blur image renders');
console.log('   It should show a pixelated blur placeholder image.');

