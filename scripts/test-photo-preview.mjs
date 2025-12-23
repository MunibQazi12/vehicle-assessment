/**
 * Test script to check photo_preview in SRP API response
 */

const API_URL = 'https://api.dealertower.com/public/www.tonkin.com/v2/inventory/vehicles/srp/rows';

const requestBody = {
  condition: ['new'],
  page: 1,
  items_per_page: 3
};

console.log('🔍 Testing SRP API response for photo_preview...\n');
console.log('Request:', JSON.stringify(requestBody, null, 2));
console.log('\n---\n');

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
  
  console.log('✅ Response received successfully\n');
  console.log(`Total vehicles: ${data.data?.vehicles?.length || 0}\n`);
  
  if (data.data?.vehicles?.length > 0) {
    const firstVehicle = data.data.vehicles[0];
    
    console.log('First Vehicle Data:');
    console.log('-------------------');
    console.log(`Title: ${firstVehicle.title}`);
    console.log(`Photo: ${firstVehicle.photo || 'N/A'}`);
    console.log(`Photo Preview: ${firstVehicle.photo_preview || 'N/A'}`);
    console.log(`Photo Preview Type: ${typeof firstVehicle.photo_preview}`);
    console.log(`Photo Preview Length: ${firstVehicle.photo_preview?.length || 0}`);
    
    if (firstVehicle.photo_preview) {
      const previewStart = firstVehicle.photo_preview.substring(0, 100);
      console.log(`\nPhoto Preview Start: ${previewStart}...`);
      
      // Check if it's a valid data URL
      if (firstVehicle.photo_preview.startsWith('data:')) {
        console.log('✅ Photo preview is a valid data URL');
      } else {
        console.log('❌ Photo preview is NOT a data URL');
      }
    } else {
      console.log('\n❌ Photo preview is missing or null');
    }
    
    console.log('\n---\n');
    console.log('Full vehicle object keys:', Object.keys(firstVehicle).sort());
  } else {
    console.log('❌ No vehicles in response');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.cause) {
    console.error('Cause:', error.cause);
  }
}
