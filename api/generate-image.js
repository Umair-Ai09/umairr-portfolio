import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({error: "Method not allowed"});
  const { prompt } = req.body;
  try {
    const output = await replicate.run("black-forest-labs/flux-schnell", { input: { prompt } });
    res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
