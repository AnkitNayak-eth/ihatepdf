'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, FileWarning, RefreshCw, Hammer, ShieldX, Terminal, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PDFCorruptor() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [corrupting, setCorrupting] = useState(false);
  const [corruptedUrl, setCorruptedUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setCorruptedUrl(null);
      setLogs([]);
    }
  };

  const corruptFile = async () => {
    if (!file) return;
    setCorrupting(true);
    setLogs([]);

    try {
      addLog("Initializing corruption engine...");
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Fixed high-impact intensity (approx 5% is enough to totally ruin it)
      const targetIntensity = 0.05;

      addLog("Scrambling file signature...");
      for (let i = 0; i < Math.min(512, uint8Array.length); i++) {
        uint8Array[i] = Math.floor(Math.random() * 256);
      }

      addLog("Injecting entropy into content streams...");
      const numEdits = Math.floor(uint8Array.length * targetIntensity);
      for (let i = 0; i < numEdits; i++) {
        const idx = Math.floor(Math.random() * uint8Array.length);
        uint8Array[idx] = Math.floor(Math.random() * 256);
      }

      const corruptedBlob = new Blob([uint8Array as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(corruptedBlob);

      setTimeout(() => {
        setCorruptedUrl(url);
        setCorrupting(false);
        addLog("Done. File is completely destroyed.");
      }, 2000);

    } catch (err) {
      console.error(err);
      setCorrupting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />

      <AnimatePresence mode="wait">
        {!corruptedUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <Hammer className="text-brand w-8 h-8" /> PDF CORRUPTOR
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto">Make any PDF completely unreadable and impossible to open with one click.</p>
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
                <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <FileWarning className={cn("h-8 w-8 text-white/20", file ? "text-brand" : "")} />
                </div>
                <p className="text-xl font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                {file && <p className="text-xs text-zinc-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
              </div>

              <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[100px] overflow-hidden">
                <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                  <Terminal size={10} /> Status
                </div>
                {logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                )) : (
                  <div className="text-zinc-700 italic">Waiting for execution...</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex items-start gap-3">
                <Zap className="text-brand shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  This process permanently destroys the file's internal structure. It will produce a "File Corrupted" error in all PDF readers. <span className="text-brand font-bold uppercase italic">This cannot be undone.</span>
                </p>
              </div>
            </div>

            <button
              onClick={corruptFile}
              disabled={!file || corrupting}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-6 text-2xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)]"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {corrupting ? (
                  <>
                    <RefreshCw className="h-7 w-7 animate-spin" />
                    Destroying File...
                  </>
                ) : (
                  <>
                    <ShieldX className="h-7 w-7" />
                    Corrupt PDF Now
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-24 h-24 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_50px_rgba(230,25,25,0.4)]">
              <ShieldX size={48} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">PDF Ruined</h3>
            <p className="text-zinc-400 mb-10 max-w-md">The file has been successfully corrupted. It is now completely unusable.</p>

            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={corruptedUrl}
                download={`ruined_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <FileDown className="h-6 w-6" />
                Download
              </a>
              <button
                onClick={() => { setFile(null); setCorruptedUrl(null); setLogs([]); }}
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
