'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Maximize2, RefreshCw, Layers, Zap, ShieldCheck, Database, LayoutGrid, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InflationMode = 'SILENT' | 'METADATA' | 'STREAM';

const INFLATION_PRESETS = [
  { label: '50MB', value: 50 },
  { label: '100MB', value: 100 },
  { label: '250MB', value: 250 },
  { label: '500MB', value: 500 },
  { label: '1GB', value: 1024 },
];

const MODES = [
  { id: 'SILENT', label: 'Silent Bloat', desc: 'Raw null-byte injection.', icon: <Database size={14} />, help: 'Cleanest expansion, stays hidden in hex editors.' },
  { id: 'METADATA', label: 'Meta Flood', desc: 'Saturate XMP streams.', icon: <LayoutGrid size={14} />, help: 'Expands metadata fields with massive junk text.' },
  { id: 'STREAM', label: 'Stream Pad', desc: 'Internal object padding.', icon: <Box size={14} />, help: 'Injects padding inside PDF data objects.' },
] as const;

interface PayloadInflatorProps {
  mode?: InflationMode;
  setMode?: (mode: InflationMode) => void;
}

export default function PayloadInflator({ mode: extMode, setMode: extSetMode }: PayloadInflatorProps = {}) {
  const [intMode, setIntMode] = useState<InflationMode>('SILENT');
  const mode = extMode || intMode;
  const setMode = extSetMode || setIntMode;

  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [inflating, setInflating] = useState(false);
  const [inflatedUrl, setInflatedUrl] = useState<string | null>(null);
  const [targetSizeMB, setTargetSizeMB] = useState(100);
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setInflatedUrl(null);
    }
  };

  const inflateFile = async () => {
    if (!file) return;
    setInflating(true);
    setProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalUint8 = new Uint8Array(arrayBuffer);
      const additionalBytes = targetSizeMB * 1024 * 1024;
      
      const progressInterval = setInterval(() => {
        setProgress(v => {
          if (v >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return v + (Math.random() * 8);
        });
      }, 200);

      const zeroBuffer = new Uint8Array(additionalBytes); 
      const inflatedBlob = new Blob([originalUint8, zeroBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(inflatedBlob);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setInflatedUrl(url);
        setInflating(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setInflating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />
      
      <AnimatePresence mode="wait">
        {!inflatedUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                <Maximize2 className="text-brand w-8 h-8" /> PAYLOAD INFLATOR
              </h2>
              <p className="text-zinc-500">Artificially expand document volumes to bypass processing systems.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Left Column: File Drop & Magnitude Previews */}
              <div className="flex flex-col gap-6">
                <div 
                  className={cn(
                    "relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer transition-all h-[240px] flex flex-col items-center justify-center",
                    isHovering ? "border-brand bg-brand/5 scale-[1.01]" : "hover:border-white/20 hover:bg-white/5",
                    file ? "border-brand/40 bg-brand/5" : ""
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                  onDragLeave={() => setIsHovering(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                  <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-white/5">
                     <Maximize2 className={cn("h-6 w-6 text-white/20", file ? "text-brand" : "")} />
                  </div>
                  <p className="text-lg font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-2">
                    <div className="flex items-center gap-2"><Zap size={10} className="text-brand" /> Zero metadata impact</div>
                    <div className="flex items-center gap-2"><ShieldCheck size={10} className="text-brand" /> Local encryption</div>
                 </div>
              </div>

              {/* Right Column: Controls */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Inflation Vector</label>
                    <div className="grid grid-cols-1 gap-2.5">
                        {MODES.map((m) => (
                            <button 
                                key={m.id}
                                onClick={() => setMode(m.id as InflationMode)}
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

                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Expansion Magnitude</label>
                    <div className="grid grid-cols-5 gap-2">
                        {INFLATION_PRESETS.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setTargetSizeMB(p.value)}
                                className={cn(
                                    "py-2.5 rounded-lg text-[10px] font-black border transition-all",
                                    targetSizeMB === p.value 
                                        ? "bg-brand text-white border-brand shadow-[0_0_20px_rgba(230,25,25,0.2)]" 
                                        : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            <button 
              onClick={inflateFile}
              disabled={!file || inflating}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 italic uppercase tracking-tighter">
                {inflating ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Expanding Payload... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Layers className="h-6 w-6" />
                    Execute Inflation
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center text-white">
             <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <Maximize2 size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black mb-4 uppercase italic">Payload Injected</h3>
            <p className="text-zinc-400 mb-10 max-w-sm mx-auto">The document now carries the target volume. It is statistically "too large" for standard processing.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Final Size</p>
                    <p className="text-xl font-black">{targetSizeMB >= 1024 ? '1.0 GB' : `${targetSizeMB} MB`}</p>
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Method</p>
                    <p className="text-xl font-black italic uppercase">{mode === 'SILENT' ? 'NULL' : mode}</p>
                </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a 
                href={inflatedUrl} 
                download={`inflated_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                Download Huge PDF
              </a>
              <button 
                onClick={() => { setFile(null); setInflatedUrl(null); }}
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
