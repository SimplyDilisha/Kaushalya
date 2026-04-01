// Gemini AI Service for Chatbot
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Send a message to Gemini AI and get a response
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} AI response text
 */
export const getGeminiResponse = async (userMessage) => {
  console.log('Gemini API Key exists:', !!GEMINI_API_KEY);
  
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    console.log('Gemini response status:', response.status);
    console.log('Gemini data:', data);

    if (!response.ok) {
      if (response.status === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
        console.warn('Gemini rate limit hit');
        return null;
      }
      console.error('Gemini API error:', response.status, data);
      return null;
    }
    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('No response text in Gemini response:', data);
      return null;
    }

    console.log('Gemini response text:', responseText);
    return responseText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};

/**
 * Check if Gemini API is configured
 * @returns {boolean}
 */
export const isGeminiConfigured = () => {
  const configured = !!GEMINI_API_KEY;
  console.log('isGeminiConfigured:', configured);
  return configured;
};
