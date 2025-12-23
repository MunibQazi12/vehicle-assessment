/**
 * Check multiple vehicles to see if photo_preview is consistently broken
 */

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

const requestBody = {
  condition: ['new'],
  page: 1,
  items_per_page: 10
};

console.log('🔍 Checking photo_preview across multiple vehicles...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  
  if (data.data?.vehicles?.length > 0) {
    console.log(`Found ${data.data.vehicles.length} vehicles\n`);
    
    for (let i = 0; i < Math.min(5, data.data.vehicles.length); i++) {
      const vehicle = data.data.vehicles[i];
      const preview = vehicle.photo_preview;
      
      console.log(`\n[${i + 1}] ${vehicle.title}`);
      console.log('  Photo:', vehicle.photo ? 'Present' : 'Missing');
      console.log('  Preview:', preview ? `${preview.length} chars` : 'Missing');
      
      if (preview) {
        const decoded = Buffer.from(preview, 'base64');
        console.log('  Decoded:', decoded.length, 'bytes');
        console.log('  First 20 chars:', preview.substring(0, 20));
        console.log('  Last 20 chars:', preview.substring(preview.length - 20));
        
        // Check if all previews are the same length
        if (preview.length === 192) {
          console.log('  ⚠️  Same length as others (192) - might be placeholder');
        }
        
        // Try to identify format
        const first4 = decoded.toString('hex', 0, 4);
        console.log('  First 4 bytes (hex):', first4);
      }
    }
    
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
