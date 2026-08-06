import Replicate from "replicate";
import { PDFDocument, rgb } from 'pdf-lib';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { subject, topic } = req.body;
  
  try {
    // Step 1: Generate questions with AI
    const output = await replicate.run(
      "meta/meta-llama-3-70b-instruct",
      { input: { prompt: `Create 10 important exam questions for ${subject} on topic: ${topic}. Format as a numbered list.` } }
    );
    const paperText = output.join('\n');

    // Step 2: Convert to PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    page.drawText(`${subject} - AI Generated Paper\n${paperText}`, { x: 50, y: 750, size: 12, color: rgb(0,0,0), lineHeight: 18 });
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    const pdfUrl = `data:application/pdf;base64,${pdfBase64}`;

    res.status(200).json({ pdfUrl: pdfUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
