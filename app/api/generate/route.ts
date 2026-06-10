import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the SDK with the key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Using the exact verified model name string from our API list
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert frontend React developer. Return ONLY valid, executable React code. The component MUST be named `MicroUI` and start with a plain `function MicroUI()`. Do NOT include the word 'export' anywhere in the response. Do NOT include any markdown formatting, backticks, or import statements."
    });

    const result = await model.generateContent(prompt);
    let code = result.response.text();

    // Strip markdown formatting fences if they exist
    code = code.replace(/```(?:jsx|js|javascript|tsx|ts|react)?\n?/gi, '').replace(/```/g, '').trim();

    // Strip any accidentally generated export keywords
    code = code.replace(/export\s+default\s+/g, '');

    return new NextResponse(code, {
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error: any) {
    console.error("Google SDK Error:", error);
    return new NextResponse(`API Error: ${error.message || 'Unknown SDK error'}`, { status: 500 });
  }
}
