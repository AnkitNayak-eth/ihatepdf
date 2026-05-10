# IHatePDF 😈

**Client-side document destruction. No uploads. No servers.**

IHatePDF is an open-source suite of "hostile productivity" tools designed to legitimately break, obfuscate, and mangle PDF files entirely in the browser. 

## ⚠️ Philosophy

Built for fun and because I am bored. This project exists on the boundary of utility and digital sabotage. Every operation produces mathematically valid, yet entirely useless documents to establish the perfect alibi.

## 🏗 Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Core Processing**:
  - `pdf-lib`: For low-level binary manipulation and rebuilding PDF trees.
  - `pdfjs-dist`: Utilized for rasterizing pages via a client-side Web Worker.
- **WebGL**: `ogl` + `three.js` (for background effects).

**100% Client-Side:** Everything executes directly in the user's browser. There is no backend.

## 💻 Developer Setup

```bash
git clone https://github.com/yourusername/ihatepdf.git
npm install
npm run dev
```

---

*Made with hate by Ankit 😈*
