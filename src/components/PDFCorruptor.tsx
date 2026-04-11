'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, FileWarning, RefreshCw, Hammer, Zap, ShieldX, Terminal, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

type Strategy = 'HEADER' | 'ENTROPY' | 'XREF';

const STRATEGIES = [
  { id: 'HEADER', label: 'Header Saboteur', desc: 'Target magic numbers only.', icon: <Zap size={14} />, detail: 'Fastest, looks like an upload/transfer error.' },
  { id: 'ENTROPY', label: 'Entropy Injection', desc: 'Surgical random noise.', icon: <ShieldX size={14} />, detail: 'Hardest to repair, creates unrecoverable streams.' },
  { id: 'XREF', label: 'XREF Nullification', desc: 'Destroy the internal map.', icon: <Crosshair size={14} />, detail: 'Breaks document indexing and table of contents.' },
] as const;

export default function PDFCorruptor() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [corrupting, setCorrupting] = useState(false);
  const [corruptedUrl, setCorruptedUrl] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(15);
  const [strategy, setStrategy] = useState<Strategy>('ENTROPY');
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
      addLog("Initializing sabotage protocol...");
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const targetIntensity = intensity / 100;
      
      if (strategy === 'HEADER') {
          addLog("Targeting PDF magic headers...");
          for (let i = 0; i < Math.min(256, uint8Array.length); i++) {
              uint8Array[i] = Math.floor(Math.random() * 256);
          }
      } else if (strategy === 'ENTROPY') {
          addLog(`Injecting ${intensity}% entropy...`);
          const numEdits = Math.floor(uint8Array.length * targetIntensity);
          for (let i = 0; i < numEdits; i++) {
              const idx = Math.floor(Math.random() * uint8Array.length);
              uint8Array[idx] = Math.floor(Math.random() * 256);
          }
      } else if (strategy === 'XREF') {
          addLog("Scanning for XREF tables...");
          const text = new TextDecoder().decode(uint8Array.slice(-4096)); 
          const xrefIdx = text.lastIndexOf('xref');
          if (xrefIdx !== -1) {
              const absoluteIdx = uint8Array.length - 4096 + xrefIdx;
              for (let i = absoluteIdx; i < Math.min(absoluteIdx + 512, uint8Array.length); i++) {
                  uint8Array[i] = 0x00; 
              }
              addLog("XREF tables nullified.");
          } else {
              addLog("XREF not found. Falling back...");
              uint8Array[Math.floor(Math.random() * uint8Array.length)] = 0xAA;
          }
      }

      const corruptedBlob = new Blob([uint8Array], { type: 'application/pdf' });
      const url = URL.createObjectURL(corruptedBlob);
      
      setTimeout(() => {
        setCorruptedUrl(url);
        setCorrupting(false);
        addLog("Mission AccomplISHED.");
      }, 2000);

    } catch (err) {
      console.error(err);
      setCorrupting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />
      
      <AnimatePresence mode="wait">
        {!corruptedUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <Hammer className="text-brand w-8 h-8" /> PDF CORRUPTOR
              </h2>
              <p className="text-zinc-500">Irreversibly mangle document headers for plausible deniability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Left Column: File Drop & Sabotage Logs */}
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
                  <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    <FileWarning className={cn("h-7 w-7 text-white/20", file ? "text-brand" : "")} />
                  </div>
                  <p className="text-lg font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                </div>

                <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[140px] overflow-hidden">
                    <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                        <Terminal size={10} /> Active Sabotage Log
                    </div>
                    {logs.length > 0 ? logs.map((log, i) => (
                        <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                    )) : (
                        <div className="text-zinc-700 italic">Waiting for execution...</div>
                    )}
                </div>
              </div>

              {/* Right Column: Controls */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Corruption Strategy</label>
                    <div className="grid grid-cols-1 gap-2.5">
                        {STRATEGIES.map((s) => (
                            <button 
                                key={s.id}
                                onClick={() => setStrategy(s.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                                    strategy === s.id 
                                        ? "bg-brand/10 border-brand/50 ring-1 ring-brand/30" 
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                )}
                            >
                                <div className={cn("p-2 rounded-lg shrink-0", strategy === s.id ? "bg-brand text-white" : "bg-white/10 text-zinc-400")}>{s.icon}</div>
                                <div>
                                    <span className={cn("text-xs font-black uppercase block", strategy === s.id ? "text-white" : "text-zinc-500")}>{s.label}</span>
                                    <p className="text-[9px] text-zinc-500 leading-tight">{s.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Intensity Payload</label>
                      <span className="text-xl font-black text-brand italic">{intensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={intensity} 
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={corruptFile}
              disabled={!file || corrupting}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {corrupting ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Sabotage in progress...
                  </>
                ) : (
                  <>
                    <ShieldX className="h-6 w-6" />
                    Execute Protocol
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <ShieldX size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">Object Nullified</h3>
            <p className="text-zinc-400 mb-10 max-w-md">Your PDF is now structurally invalid and unreadable by any compliant reader.</p>
            
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a 
                href={corruptedUrl} 
                download={`ruined_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                Download Ruined PDF
              </a>
              <button 
                onClick={() => { setFile(null); setCorruptedUrl(null); }}
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
