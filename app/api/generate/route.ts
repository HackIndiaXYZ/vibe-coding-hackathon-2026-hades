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
      systemInstruction: [
        "You are an expert frontend React developer.",
        "Your ONLY output must be a single, self-contained JavaScript function named exactly `MicroUI`.",
        "STRICT RULES — violating any rule will break the app:",
        "1. Start directly with: function MicroUI() {",
        "2. NEVER use JSX syntax (no angle-bracket tags). Use React.createElement() for all elements.",
        "3. NEVER include import or require statements.",
        "4. NEVER include the word 'export' anywhere.",
        "5. NEVER wrap your response in markdown code fences (no backticks, no ```jsx, no ```js).",
        "6. Do NOT include explanatory text, comments outside the function, or any other content.",
        "7. Use only React, useState, useEffect, and useRef — these are injected and available as globals.",
        "8. Inline all styles via the style prop using plain JS objects.",
        "9. Accept a single `onDismiss` prop for the dismiss button.",
      ].join(' ')
    });

    const result = await model.generateContent(prompt);
    let code = result.response.text();

    // ── Pass 1: Strip ALL markdown code fences (``` with any language tag) ──
    code = code.replace(/^```[\w]*\n?/gm, '').replace(/^```$/gm, '').trim();

    // ── Pass 2: Remove any stray import/require lines ──
    code = code.replace(/^\s*import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
    code = code.replace(/^\s*const\s+\{[^}]+\}\s*=\s*require\([^)]+\);?\s*$/gm, '');

    // ── Pass 3: Strip export keywords ──
    code = code.replace(/^\s*export\s+default\s+/gm, '');
    code = code.replace(/^\s*export\s+/gm, '');

    // ── Pass 4: Ensure the entry function is named MicroUI ──
    // If the model named it something else, rename the first function declaration.
    if (!/function\s+MicroUI\s*\(/.test(code)) {
      code = code.replace(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/, 'function MicroUI(');
    }

    // ── Pass 5: Final trim ──
    code = code.trim();

    return new NextResponse(code, {
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error: any) {
    console.error("Google SDK Error:", error);
    return new NextResponse(`API Error: ${error.message || 'Unknown SDK error'}`, { status: 500 });
  }
}
