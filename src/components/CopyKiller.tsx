'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, Terminal, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

async function initPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  // Disable worker — use main-thread fallback.
  // The CDN doesn't have v5.x worker files, and this works fine for our use case.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  return pdfjsLib;
}

export default function CopyKiller() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(150);
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

      addLog(`Found ${totalPages} page(s). Converting text to images...`);

      const pdfjsLib = await initPdfJs();
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

      const newDoc = await PDFDocument.create();
      const scale = quality / 72;

      for (let i = 0; i < totalPages; i++) {
        addLog(`Burning page ${i + 1}/${totalPages}...`);

        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport } as any).promise;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
        const imgBytes = new Uint8Array(await blob.arrayBuffer());

        const img = await newDoc.embedPng(imgBytes);
        const pageW = srcPages[i].getWidth();
        const pageH = srcPages[i].getHeight();
        const newPage = newDoc.addPage([pageW, pageH]);
        newPage.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH });
      }

      addLog('Assembling protected document...');
      const resultBytes = await newDoc.save();
      const resultBlob = new Blob([resultBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(resultBlob);

      setResultUrl(url);
      setProcessing(false);
      addLog(`Done. ${totalPages} page(s) converted to images.`);

    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />

      <AnimatePresence mode="wait">
        {!resultUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <EyeOff className="text-brand w-8 h-8" /> COPY KILLER
              </h2>
              <p className="text-zinc-500">Convert all text into flat images. Nobody can select, copy, or extract anything.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Left: File Drop + Logs */}
              <div className="flex flex-col gap-6">
                <div
                  className={cn(
                    "relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer transition-all h-[230px] flex flex-col items-center justify-center",
                    isHovering ? "border-brand bg-brand/5 scale-[1.01]" : "hover:border-white/20 hover:bg-white/5",
                    file ? "border-brand/40 bg-brand/5" : ""
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                  onDragLeave={() => setIsHovering(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    <EyeOff className={cn("h-7 w-7 text-white/20", file ? "text-brand" : "")} />
                  </div>
                  <p className="text-lg font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                  {file && <p className="text-xs text-zinc-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
                </div>

                <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[180px] overflow-hidden">
                  <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                    <Terminal size={10} /> Execution Log
                  </div>
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                  )) : (
                    <div className="text-zinc-700 italic">Waiting for execution...</div>
                  )}
                </div>
              </div>

              {/* Right: Controls */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Image Quality (DPI)</label>
                      <span className="text-xl font-black text-brand italic">{quality}</span>
                    </div>
                    <input
                      type="range" min="72" max="300" step="1"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-600">
                      <span>72 — Fast / Small file</span>
                      <span>300 — Crisp / Large file</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      ⚡ Every page is converted into a flat image. All text layers, annotations, and form fields are permanently removed. The document looks identical but contains zero selectable or copyable text.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={processFile}
              disabled={!file || processing}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {processing ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Converting to images...
                  </>
                ) : (
                  <>
                    <EyeOff className="h-6 w-6" />
                    Kill Copy-Paste
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <EyeOff size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">Copy-Paste Killed</h3>
            <p className="text-zinc-400 mb-10 max-w-md">
              All text has been burned into flat images. Zero selectable content remains.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={resultUrl}
                download={`protected_${file?.name}`}
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
