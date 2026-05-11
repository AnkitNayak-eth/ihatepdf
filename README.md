# IHatePDF 😈

**Client-side document destruction. No uploads. No servers.**

IHatePDF is an open-source suite of "hostile productivity" tools designed to legitimately break, obfuscate, and mangle PDF files entirely in the browser. 

https://github.com/user-attachments/assets/75807b10-61b7-467a-b249-ed49af818452

## Philosophy

Built for fun and because I am bored. This project exists on the boundary of utility and digital sabotage. Every operation produces mathematically valid, yet entirely useless documents to establish the perfect alibi for missed deadlines and bureaucratic filings.

## Features

- **Metadata Spoofer**: Edit hidden XMP properties and rewrite document history.
- **PDF Corruptor**: Cryptographic byte-scrambling. Keeps the file size convincing but permanently unreadable.
- **Copy Killer**: Burns text into flat, rasterized PNG layers to kill copy-paste and text extraction.
- **Dyslexia Inducer**: Slices high-res pages into shifted strips, making documents physically painful to read.
- **Payload Data Inflator**: Absurdly inflates file sizes to crash upload portal limits.
- **Self-Destruct (Timebomb)**: Injects logic causing the PDF to "expire" after a set date.
- **Page Shuffler**: Randomly reorders every page in a structured report.
- **Laggy PDF**: Injects invisible geometry designed to choke the renderer and stutter scrolling.

## Architecture & Tech Stack

This project is built for performance and absolute privacy.

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Core Processing**:
  - `pdf-lib`: For low-level binary manipulation and rebuilding PDF trees.
  - `pdfjs-dist`: Utilized for rasterizing pages via a client-side Web Worker.
- **WebGL**: `ogl` + `three.js` (for background visual effects).

**100% Client-Side:** Everything executes directly in the user's browser. There is no backend. Files never leave the machine.


*Made with hate by Ankit 😈*
