export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Key missing" });
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY // This works for AQ keys
        },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: message }] }] 
        })
      }
    );
    const data = await response.json();
    
    if(data.error) return res.status(400).json({ error: data.error.message });
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
