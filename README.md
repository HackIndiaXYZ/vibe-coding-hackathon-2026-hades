# 💧 Fluid — Intent-First, Just-In-Time UI Canvas

> **Software shouldn't be predefined. It should be fluid.**

<img width="1307" height="577" alt="image" src="https://github.com/user-attachments/assets/cb8cce90-4e22-4640-819e-a972f596b533" />


Fluid dissolves the barrier between human thought and digital interfaces. Instead of forcing users into rigid, pre-built applications, Fluid uses generative computing to synthesize, compile, and render functional React micro-applications on-demand—creating bespoke software the exact second a user requests it.

Built in 24 hours for the **Vibe Coding Hackathon 2026**.

Live Demo: [fluid-hades.vercel.app](https://fluid-hades.vercel.app)

---

## ⚡ The Core Problem

We have been trained to adapt to our software, rather than our software adapting to us. Every app on your device is a rigid "digital room" designed by someone else. If a user needs a specific, highly contextual tool—like a custom logic calculator or a highly tailored data converter—they are forced to compromise with generic off-the-shelf tools or spend hours building a spreadsheet from scratch.

Current AI tools have accelerated development speed, but they haven't changed the delivery model: developers are still generating static code, pushing it to repositories, and deploying fixed components. 

**Fluid fixes this latency by moving the entire compilation pipeline to the moment of user intent.**

---

## ✨ Features

* **Just-In-Time Compilation:** Skips the entire deployment pipeline. Type a requirement, and watch a native React component compile in under 2 seconds.
* **Liquid UI Aesthetics:** A premium, fluid layout complete with interactive spring physics, glassmorphic inputs, and responsive, dynamic state tracking.
* **Zero Static Dependencies:** Every interface generated is fully interactive, isolated, and responsive right inside your browser canvas.

---

## 🧠 Tech Stack & Architecture

Fluid leverages a high-performance, lightweight modern web stack optimized for sub-second generation cycles:

* **Framework:** Next.js (App Router) & TypeScript
* **Styling:** Tailwind CSS & Framer Motion (Spring Physics Mechanics)
* **AI Engine:** Official Google Gen AI SDK integration running **Gemini 2.5 Flash** for ultra-low latency, complex frontend engineering tasks.
* **Deployment:** Vercel Edge Network

```text
[User Intent Prompt] 
       │
       ▼
[Next.js Serverless Route] ──► [Google Gen AI SDK / Gemini 2.5 Flash]
                                              │
                                              ▼ (Raw String Synthesis)
[Dynamic Virtual Transpiler] ◄────────────────┘
       │
       ▼
[Live Rendered Interactive React MicroUI Component]
