export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ 
        model: "llama-3.1-8b-instant", // This is super fast and free
        messages: [{ role: "user", content: message }],
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if(data.error) {
      return res.status(400).json({ error: `Groq Error: ${data.error.message}` });
    }
    
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
