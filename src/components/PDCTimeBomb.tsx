'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Clock, AlertTriangle, RefreshCw, Zap, ShieldAlert, Timer, Bomb, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

const EXPIRY_SCRIPT = (date: string) => `var now = new Date(); var exp = new Date("${date}"); if (now > exp) { app.alert({ cMsg: "This document has expired and can no longer be viewed. Please contact the sender for a new copy.", cTitle: "Document Expired", nIcon: 0, nType: 0 }); }`;

export default function PDCTimeBomb() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [arming, setArming] = useState(false);
  const [armedUrl, setArmedUrl] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16)); // Tomorrow
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setArmedUrl(null);
    }
  };

  const armBomb = async () => {
    if (!file) return;
    setArming(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      
      const script = EXPIRY_SCRIPT(new Date(expiryDate).toISOString());
      pdfDoc.addJavaScript('timebomb', script);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setTimeout(() => {
        setArmedUrl(url);
        setArming(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to set expiry. The PDF may be protected.");
      setArming(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />
      
      <AnimatePresence mode="wait">
        {!armedUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <Bomb className="text-brand w-8 h-8" /> PDF SELF DESTRUCT
              </h2>
              <p className="text-zinc-500">Set an expiry date on any PDF. After the deadline, it shows a warning and refuses to display.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
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
                  <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-brand/10 transition-colors">
                     <Bomb className={cn("h-6 w-6 text-white/20 transition-colors", file ? "text-brand" : "")} />
                  </div>
                  <p className="text-lg font-bold text-white/80">{file ? file.name : "Drop target PDF"}</p>
                </div>

                <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-brand font-bold mb-3">
                    <ShieldAlert size={18} /> How It Works
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Embeds a hidden date check inside the PDF. Every time someone opens it, the file silently compares the current date against your deadline. Once it expires, a popup blocks the reader.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Expiry Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={expiryDate} 
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      ⚡ After this date, the PDF will display an "expired" warning every time someone tries to open it. Works best in Adobe Acrobat and other readers that support JavaScript.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={armBomb}
              disabled={!file || arming}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {arming ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Arming Self-Destruct...
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6" />
                    Set Expiry Date
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <Skull size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Expiry Date Set</h3>
            <p className="text-zinc-400 mb-10 max-w-sm mx-auto">The document will now show an expiry warning after the deadline passes.</p>
            
            <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Expires On</p>
                    <p className="text-sm font-black">{new Date(expiryDate).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a 
                href={armedUrl} 
                download={`armed_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                Download Self-Destruct PDF
              </a>
              <button 
                onClick={() => { setFile(null); setArmedUrl(null); }}
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
