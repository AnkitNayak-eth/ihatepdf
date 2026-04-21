'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, Terminal, Type, Image, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Mode = 'IMAGE_BURN' | 'UNICODE_POISON';

const MODES = [
  {
    id: 'IMAGE_BURN' as Mode,
    label: 'Text → Image Burn',
    desc: 'Flatten all text into raster images.',
    icon: <Image size={14} />,
    detail: 'Zero selectable text remains. Bulletproof against any copy attempt.',
  },
  {
    id: 'UNICODE_POISON' as Mode,
    label: 'Unicode Poison',
    desc: 'Swap characters with evil homoglyphs.',
    icon: <Type size={14} />,
    detail: 'Text looks identical but copies as unsearchable, unpasteable garbage.',
  },
] as const;

// Unicode homoglyph map — visually identical but different codepoints
const HOMOGLYPH_MAP: Record<string, string> = {
  'A': '\u0410', 'B': '\u0412', 'C': '\u0421', 'E': '\u0415',
  'H': '\u041D', 'I': '\u0406', 'K': '\u041A', 'M': '\u041C',
  'N': '\u039D', 'O': '\u041E', 'P': '\u0420', 'S': '\u0405',
  'T': '\u0422', 'X': '\u0425', 'Y': '\u04AE', 'Z': '\u0396',
  'a': '\u0430', 'c': '\u0441', 'e': '\u0435', 'i': '\u0456',
  'o': '\u043E', 'p': '\u0440', 's': '\u0455', 'x': '\u0445',
  'y': '\u0443', 'd': '\u0501', 'g': '\u0261', 'h': '\u04BB',
  'j': '\u0458', 'k': '\u03BA', 'l': '\u04CF', 'n': '\u0578',
  'q': '\u051B', 'u': '\u057D', 'v': '\u0475', 'w': '\u051D',
  'z': '\u0290',
};

function poisonText(text: string, intensityPct: number): string {
  return text.split('').map(ch => {
    const r = HOMOGLYPH_MAP[ch];
    if (r && Math.random() < intensityPct / 100) return r;
    return ch;
  }).join('');
}

async function initPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

interface CopyKillerProps {
  mode?: Mode;
  setMode?: (mode: Mode) => void;
}

export default function CopyKiller({ mode: extMode, setMode: extSetMode }: CopyKillerProps = {}) {
  const [intMode, setIntMode] = useState<Mode>('IMAGE_BURN');
  const mode = extMode || intMode;
  const setMode = extSetMode || setIntMode;

  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(85);
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

      if (mode === 'IMAGE_BURN') {
        addLog('Loading source document...');
        const arrayBuffer = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const srcPages = srcDoc.getPages();
        const totalPages = srcPages.length;

        addLog(`Found ${totalPages} page(s). Initializing rasterizer...`);

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

          await page.render({ canvasContext: ctx, viewport }).promise;

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

        addLog('Assembling scorched document...');
        const resultBytes = await newDoc.save();
        const resultBlob = new Blob([resultBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(resultBlob);

        setResultUrl(url);
        setProcessing(false);
        addLog(`Text annihilated. ${totalPages} page(s) burned to image.`);

      } else {
        // UNICODE_POISON
        addLog('Loading source document...');
        const arrayBuffer = await file.arrayBuffer();

        addLog('Scanning text content streams...');
        const textDecoder = new TextDecoder('latin1');
        let pdfText = textDecoder.decode(new Uint8Array(arrayBuffer));

        addLog(`Applying unicode poison at ${intensity}% intensity...`);

        let poisonCount = 0;

        // Replace text inside PDF string literals — ( ... ) before Tj/TJ operators
        pdfText = pdfText.replace(/\(([^)]{1,500})\)/g, (match, content) => {
          if (!/[a-zA-Z]{2,}/.test(content)) return match;
          const poisoned = poisonText(content, intensity);
          if (poisoned !== content) {
            poisonCount++;
            return `(${poisoned})`;
          }
          return match;
        });

        addLog(`Poisoned ${poisonCount} text string(s).`);

        // Encode back — use latin1-safe encoding to preserve binary parts
        const out = new Uint8Array(pdfText.length);
        for (let i = 0; i < pdfText.length; i++) {
          out[i] = pdfText.charCodeAt(i) & 0xFF;
        }

        const resultBlob = new Blob([out], { type: 'application/pdf' });
        const url = URL.createObjectURL(resultBlob);

        setResultUrl(url);
        setProcessing(false);
        addLog('Poison injection complete. Text looks normal, copies as garbage.');
      }
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
              <p className="text-zinc-500">Make your PDF text impossible to copy-paste. Two methods. Zero survivors.</p>
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
                    <Terminal size={10} /> Kill Log
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
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Kill Method</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          className={cn(
                            "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                            mode === m.id
                              ? "bg-brand/10 border-brand/50 ring-1 ring-brand/30"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className={cn("p-2 rounded-lg shrink-0", mode === m.id ? "bg-brand text-white" : "bg-white/10 text-zinc-400")}>{m.icon}</div>
                          <div>
                            <span className={cn("text-xs font-black uppercase block", mode === m.id ? "text-white" : "text-zinc-500")}>{m.label}</span>
                            <p className="text-[9px] text-zinc-500 leading-tight">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {mode === 'IMAGE_BURN' ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Render Quality (DPI)</label>
                        <span className="text-xl font-black text-brand italic">{quality}</span>
                      </div>
                      <input
                        type="range" min="72" max="300" step="1"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-600">
                        <span>72 — Fast / Small</span>
                        <span>300 — Crisp / Large</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Poison Intensity</label>
                        <span className="text-xl font-black text-brand italic">{intensity}%</span>
                      </div>
                      <input
                        type="range" min="10" max="100"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-600">
                        <span>10% — Subtle</span>
                        <span>100% — Maximum Carnage</span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      {mode === 'IMAGE_BURN'
                        ? '⚡ Every page is rasterized into a flat image. All text layers, annotations, and form fields are permanently destroyed. The document looks identical but contains zero selectable text.'
                        : '⚡ Characters are swapped with visually identical Unicode homoglyphs from Cyrillic & Greek alphabets. Text appears normal but copies as unsearchable, unpasteable garbage.'}
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
                    {mode === 'IMAGE_BURN' ? 'Burning text to ash...' : 'Injecting poison...'}
                  </>
                ) : (
                  <>
                    <EyeOff className="h-6 w-6" />
                    {mode === 'IMAGE_BURN' ? 'Burn All Text' : 'Poison Text'}
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
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">
              {mode === 'IMAGE_BURN' ? 'Text Incinerated' : 'Poison Deployed'}
            </h3>
            <p className="text-zinc-400 mb-10 max-w-md">
              {mode === 'IMAGE_BURN'
                ? 'All text has been burned into flat images. Zero selectable content remains.'
                : 'Text appears normal to the eye but copies as unintelligible garbage.'}
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={resultUrl}
                download={`killed_${file?.name}`}
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
