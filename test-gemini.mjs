// Test Gemini API
const API_KEY = 'AIzaSyB4Av96vcoOvo9lBr6sqFj09qUmVyt9UwI';

async function testGemini() {
  const models = ['gemini-2.5-flash', 'gemma-3-4b-it', 'gemini-flash-latest'];
  
  for (const model of models) {
    console.log(`\nTesting ${model}...`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'What is Infosys? Answer briefly.' }] }]
        })
      });
      const data = await response.json();
      console.log('Status:', response.status);
      if (response.ok) {
        console.log('✓ SUCCESS with', model);
        console.log('Response:', data.candidates?.[0]?.content?.parts?.[0]?.text);
        return model;
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
  console.log('\nAll models rate limited :(');
}

testGemini();
