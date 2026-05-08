'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, Terminal, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PDFShuffler() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
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
      const totalPages = srcDoc.getPageCount();

      if (totalPages < 2) {
        throw new Error("Document needs at least 2 pages to shuffle.");
      }

      addLog(`Found ${totalPages} pages. Generating chaos sequence...`);
      
      const indices = Array.from({ length: totalPages }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      
      copiedPages.forEach((page) => {
        newDoc.addPage(page);
      });

      addLog(`Pages successfully reordered.`);
      addLog('Assembling chaotic document...');
      
      const resultBytes = await newDoc.save();
      const resultBlob = new Blob([resultBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(resultBlob);

      setResultUrl(url);
      setProcessing(false);
      addLog('Shuffle complete. Structure destroyed.');
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
                <Shuffle className="text-brand w-8 h-8" /> PAGE SHUFFLER
              </h2>
              <p className="text-zinc-500">Completely randomize the order of pages in the document.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
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
                    <Shuffle className={cn("h-7 w-7 text-white/20", file ? "text-brand" : "")} />
                  </div>
                  <p className="text-lg font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                  {file && <p className="text-xs text-zinc-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                 <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[230px] overflow-hidden">
                  <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                    <Terminal size={10} /> Operation Log
                  </div>
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                  )) : (
                    <div className="text-zinc-700 italic">Waiting for document...</div>
                  )}
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
                    Shuffling Pages...
                  </>
                ) : (
                  <>
                    <Shuffle className="h-6 w-6" />
                    Shuffle PDF
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <Shuffle size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">
              Chaos Ensued
            </h3>
            <p className="text-zinc-400 mb-10 max-w-md">
              The document's pages have been completely randomized. Any coherent structure has been eliminated.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={resultUrl}
                download={`shuffled_${file?.name}`}
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
