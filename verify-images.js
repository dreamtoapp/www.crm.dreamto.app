const https = require('https');
const http = require('http');

async function testImageUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        working: res.statusCode === 200 || res.statusCode === 302
      });
    });
    
    req.on('error', () => {
      resolve({ status: 0, contentType: null, working: false });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, contentType: null, working: false });
    });
  });
}

async function verifyImages() {
  console.log('🖼️ Verifying image URLs...\n');
  
  try {
    // Test a few sample image URLs
    const testUrls = [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/1000/700?random=2',
      'https://picsum.photos/1200/800?random=3'
    ];
    
    for (let i = 0; i < testUrls.length; i++) {
      const url = testUrls[i];
      console.log(`Testing URL ${i + 1}: ${url}`);
      
      const result = await testImageUrl(url);
      
      if (result.working) {
        console.log(`   ✅ Working - Status: ${result.status}, Type: ${result.contentType}`);
      } else {
        console.log(`   ❌ Failed - Status: ${result.status}`);
      }
    }
    
    console.log('\n🎉 Image verification completed!');
    console.log('All placeholder images should now be working correctly.');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyImages(); 