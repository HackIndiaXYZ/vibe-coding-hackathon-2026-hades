import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a UI generator for "Fluid". 
Given a user's natural language request, output ONLY a raw React 
functional component — no imports, no export statement, no markdown 
fences, no explanation. Just the function body starting with:
  function MicroUI({ onDismiss }) {

Rules:
- Use React.createElement for all rendering/markup (do NOT use JSX syntax like <div className="..."> as the browser cannot parse it natively)
- Use ONLY Tailwind CSS classes for all styling (passed via className attributes in createElement)
- Use ONLY React hooks available as globals: useState, useEffect, useRef
- NO external imports or libraries whatsoever
- The component MUST include a dismiss button that calls onDismiss()
- Make it fully functional and interactive
- Include a small muted title at the top describing the task
- Keep it focused — one task, done beautifully`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    }
  );

  const data = await response.json();

  // 1. Check if the API returned an HTTP error
  if (!response.ok) {
    console.error("Gemini API Error:", data);
    return new NextResponse(`API Error: ${data.error?.message || 'Unknown error'}`, { status: 500 });
  }

  // 2. Extract the text safely
  let code = data.candidates?.[0]?.content?.parts?.[0]?.text;

  // 3. Check if the text is missing (e.g., safety block)
  if (!code) {
    console.error("Gemini returned no code. Full response:", JSON.stringify(data));
    return new NextResponse("Error: Gemini returned an empty response. Check console logs.", { status: 500 });
  }

  // Strip markdown fences
  code = code.replace(/```(tsx|jsx|typescript|javascript|react)?\n?/gi, '').replace(/```/g, '').trim();

  console.log("Gemini Raw Response:", code);

  return new NextResponse(code, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
