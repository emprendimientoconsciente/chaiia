export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Call Flowise API
    const flowiseResponse = await fetch(
      'https://ecflowise.emprendimientoconsciente.info/api/v1/prediction/013004ef-002e-4951-baa1-bf9b88fab382',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mWY6mH4ukuYu3QqQnNreAmPuX_SDFEXGVNdDPc4fT7w',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: message })
      }
    );

    if (!flowiseResponse.ok) {
      throw new Error(`Flowise API error: ${flowiseResponse.status}`);
    }

    const data = await flowiseResponse.json();
    
    // Handle different response formats from Flowise
    let response = data;
    if (typeof data === 'string') {
      response = data;
    } else if (data.text) {
      response = data.text;
    } else if (data.response) {
      response = data.response;
    } else if (data.answer) {
      response = data.answer;
    }

    res.status(200).json({ response });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error processing message',
      response: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
    });
  }
}
