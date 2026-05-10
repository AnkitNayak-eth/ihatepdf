'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, Terminal, Type, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

async function initPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}

/**
 * Apply extreme "dyslexia" distortion to a canvas.
 * Multi-layer chaos: blur, ghost overlays, strip displacement, vertical squish.
 */
function applyDyslexiaDistortion(sourceCanvas: HTMLCanvasElement, intensity: number): HTMLCanvasElement {
  const normalized = intensity / 10;
  
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  const destCanvas = document.createElement('canvas');
  destCanvas.width = w;
  destCanvas.height = h;
  const ctx = destCanvas.getContext('2d')!;

  // 1. White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw the base page with a slight blur to soften text
  ctx.filter = `blur(${0.4 + normalized * 0.6}px)`;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.filter = 'none';

  // 3. Ghost / double-vision overlays — draw the page again at slight offsets
  //    with reduced opacity to create overlapping text effect
  const baseOpacity = 0.15 + (normalized * 0.2);
  const ghosts = [
    { x: 3 * normalized * 1.5, y: 1.5 * normalized * 1.5, opacity: baseOpacity },
    { x: -2 * normalized * 1.5, y: -1 * normalized * 1.5, opacity: baseOpacity * 0.8 },
    { x: 1 * normalized * 1.5, y: -2 * normalized * 1.5, opacity: baseOpacity * 0.5 },
  ];
  for (const g of ghosts) {
    ctx.globalAlpha = g.opacity;
    ctx.drawImage(sourceCanvas, g.x, g.y);
  }
  ctx.globalAlpha = 1.0;

  // 4. Horizontal strip displacement — slice the result into thin strips
  //    and shift each one randomly to create jittery, misaligned text
  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = w;
  stripCanvas.height = h;
  const stripCtx = stripCanvas.getContext('2d')!;
  stripCtx.fillStyle = '#FFFFFF';
  stripCtx.fillRect(0, 0, w, h);

  const stripHeight = Math.max(1, Math.round(6 - (normalized * 5))); // 6 down to 1
  const maxShiftX = Math.round(2 + (normalized * 10)); // 2 to 12
  const maxShiftY = Math.round(normalized * 3); // 0 to 3
  const squishProb = 0.05 + (normalized * 0.15); // 0.05 to 0.2

  for (let y = 0; y < h; y += stripHeight) {
    const sh = Math.min(stripHeight, h - y);
    const dx = Math.round((Math.random() - 0.5) * 2 * maxShiftX);
    const dy = Math.round((Math.random() - 0.5) * 2 * maxShiftY);

    // Occasionally squish or stretch a strip vertically to break line spacing
    const scaleY = Math.random() < squishProb ? (0.6 + Math.random() * 0.8) : 1;

    stripCtx.drawImage(
      destCanvas,
      0, y, w, sh,
      dx, y + dy, w, sh * scaleY
    );
  }

  // 5. Final compositing pass — add a very faint blurred ghost on top
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = w;
  finalCanvas.height = h;
  const finalCtx = finalCanvas.getContext('2d')!;
  finalCtx.drawImage(stripCanvas, 0, 0);

  // Heavy blur ghost overlay for that "can't focus my eyes" feeling
  finalCtx.filter = `blur(${1 + normalized}px)`;
  finalCtx.globalAlpha = 0.1 + (normalized * 0.15);
  finalCtx.drawImage(sourceCanvas, 2 * normalized * 2, -1 * normalized * 2);
  finalCtx.filter = 'none';
  finalCtx.globalAlpha = 1.0;

  return finalCanvas;
}

export default function PDFDyslexia() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
        setFile(f);
        setResultUrl(null);
        setLogs([]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
      setLogs([]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setProcessing(true);
    setLogs([]);

    try {
      const { PDFDocument } = await import('pdf-lib');

      addLog('Loading source document...');
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const srcPages = srcDoc.getPages();
      const totalPages = srcPages.length;

      addLog(`Found ${totalPages} page(s). Rendering...`);

      const pdfjsLib = await initPdfJs();
      const pdfDoc = await pdfjsLib.getDocument({ 
        data: new Uint8Array(arrayBuffer),
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
      }).promise;

      const newDoc = await PDFDocument.create();
      const renderScale = 150 / 72; // 150 DPI

      for (let i = 0; i < totalPages; i++) {
        addLog(`Distorting page ${i + 1}/${totalPages}...`);

        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: renderScale });

        // Render the page to a canvas
        const renderCanvas = document.createElement('canvas');
        renderCanvas.width = Math.floor(viewport.width);
        renderCanvas.height = Math.floor(viewport.height);
        const renderCtx = renderCanvas.getContext('2d')!;
        renderCtx.fillStyle = '#FFFFFF';
        renderCtx.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
        await page.render({ canvasContext: renderCtx, viewport } as any).promise;

        // Apply the dyslexia distortion
        const distortedCanvas = applyDyslexiaDistortion(renderCanvas, intensity);

        // Convert distorted canvas to PNG
        const blob = await new Promise<Blob>((resolve) => {
          distortedCanvas.toBlob((b) => resolve(b!), 'image/png');
        });
        const imgBytes = new Uint8Array(await blob.arrayBuffer());

        // Embed into the new PDF
        const img = await newDoc.embedPng(imgBytes);
        const pageW = srcPages[i].getWidth();
        const pageH = srcPages[i].getHeight();
        const newPage = newDoc.addPage([pageW, pageH]);
        newPage.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH });
      }

      addLog('Assembling dyslexic document...');
      const resultBytes = await newDoc.save();
      const resultBlob = new Blob([resultBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(resultBlob);

      setResultUrl(url);
      setProcessing(false);
      addLog('Visual chaos deployed.');
    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />

      <AnimatePresence mode="wait">
        {!resultUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <Type className="text-brand w-8 h-8" /> DYSLEXIA INDUCER
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto">Makes text jitter, overlap, and become physically painful to read.</p>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className={cn(
                  "relative border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center",
                  isHovering ? "border-brand bg-brand/5 scale-[1.01]" : "hover:border-white/20 hover:bg-white/5",
                  file ? "border-brand/40 bg-brand/5" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Type className={cn("h-8 w-8 text-white/20", file ? "text-brand" : "")} />
                </div>
                <p className="text-xl font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                {file && <p className="text-xs text-zinc-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
              </div>

              <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[100px] overflow-hidden">
                <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                  <Terminal size={10} /> Execution Log
                </div>
                {logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                )) : (
                  <div className="text-zinc-700 italic">Awaiting target document...</div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Severity</label>
                  <span className="text-xl font-black text-brand italic">{intensity} / 10</span>
                </div>
                <input
                  type="range" min="1" max="10" step="1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                  <span>Mild Nausea</span>
                  <span>Total Stroke</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex items-start gap-3">
                <Zap className="text-brand shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Renders each page at high resolution, then slices the image into thin horizontal strips and randomly shifts each one. The result is text that <span className="text-brand font-bold uppercase italic">visually jitters and overlaps</span>, making the document a cognitive nightmare to read.
                </p>
              </div>
            </div>

            <button
              onClick={processFile}
              disabled={!file || processing}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-6 text-2xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)]"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {processing ? (
                  <>
                    <RefreshCw className="h-7 w-7 animate-spin" />
                    Distorting Pages...
                  </>
                ) : (
                  <>
                    <Type className="h-7 w-7" />
                    Induce Dyslexia Now
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-24 h-24 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_50px_rgba(230,25,25,0.4)]">
              <Type size={48} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">
              Madness Inducted
            </h3>
            <p className="text-zinc-400 mb-10 max-w-md">
              Every line of text has been sliced and shifted. The document is now physically painful to read.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={resultUrl}
                download={`gaslit_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <FileDown className="h-6 w-6" />
                Download
              </a>
              <button
                onClick={() => { setFile(null); setResultUrl(null); setLogs([]); }}
                className="flex-1 py-5 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
