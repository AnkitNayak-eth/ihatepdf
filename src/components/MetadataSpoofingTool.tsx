'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Fingerprint, RefreshCw, Save, ShieldAlert, History, Clock, Monitor, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

interface SpoofData {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
}

const DEFAULT_SPOOFS = [
  { 
    label: 'Muted Professional', 
    data: { 
      creator: 'Microsoft Word 2019', 
      producer: 'PDF-XChange 7.0', 
      author: 'Office Administrator' 
    } 
  },
  { 
    label: 'Mac Native', 
    data: { 
      creator: 'Pages', 
      producer: 'Mac OS X 10.15.7 Quartz PDFContext', 
      author: '' 
    } 
  },
  { 
    label: 'Mobile Internal', 
    data: { 
      creator: 'iOS 14.8.1', 
      producer: 'Apple PDFKit', 
      author: 'iPhone' 
    } 
  }
];

export default function MetadataSpoofingTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [spoofedUrl, setSpoofedUrl] = useState<string | null>(null);
  
  const [spoof, setSpoof] = useState<SpoofData>({
    title: '',
    author: '',
    subject: '',
    keywords: [],
    creator: 'Microsoft Office Word',
    producer: 'Acrobat PDFMaker 15 for Word',
    creationDate: new Date().toISOString().slice(0, 16),
    modificationDate: new Date().toISOString().slice(0, 16),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setSpoofedUrl(null);
    }
  };

  const applySpoof = async () => {
    if (!file) return;
    setProcessing(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);

      // Apply the user-controlled spoof data
      pdfDoc.setTitle(spoof.title);
      pdfDoc.setAuthor(spoof.author);
      pdfDoc.setSubject(spoof.subject);
      pdfDoc.setKeywords(spoof.keywords);
      pdfDoc.setCreator(spoof.creator);
      pdfDoc.setProducer(spoof.producer);
      
      const cDate = new Date(spoof.creationDate);
      const mDate = new Date(spoof.modificationDate);
      
      pdfDoc.setCreationDate(cDate);
      pdfDoc.setModificationDate(mDate);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setTimeout(() => {
        setSpoofedUrl(url);
        setProcessing(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Spoofing failed. Some PDFs have protected internal streams.");
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!spoofedUrl ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                <Fingerprint className="text-brand w-8 h-8" /> Metadata Spoofer
              </h2>
              <p className="text-zinc-500">Edit the digital fingerprint and history of your document.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Left Column: File & Education */}
              <div className="flex flex-col gap-6">
                <div 
                  className={cn(
                    "relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                    isHovering ? "border-brand bg-brand/5" : "hover:border-white/20",
                    file ? "border-brand/40 bg-brand/5" : ""
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                  onDragLeave={() => setIsHovering(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                  <FileUp className={cn("h-10 w-10 mx-auto mb-4 text-white/20", file ? "text-brand" : "")} />
                  <p className="text-white/80 font-bold">{file ? file.name : "Drop target PDF"}</p>
                </div>

                <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-brand font-bold mb-3">
                    <ShieldAlert size={18} /> Why Spoofer?
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Submission portals use "XMP Metadata" to check if you're lying about when you finished a project. A file created 5 minutes ago but claimed as "due yesterday" is a red flag. This tool synchronizes the internal clock to your narrative.
                  </p>
                </div>
              </div>

              {/* Right Column: Controls */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-5 border border-white/5">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Quick Prototypes</label>
                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_SPOOFS.map((p) => (
                                <button 
                                    key={p.label}
                                    onClick={() => setSpoof(prev => ({ ...prev, ...p.data }))}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                        <Clock size={10} /> Created At
                      </label>
                      <input 
                        type="datetime-local" 
                        value={spoof.creationDate} 
                        onChange={(e) => setSpoof({ ...spoof, creationDate: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                        <RefreshCw size={10} /> Modified At
                      </label>
                      <input 
                        type="datetime-local" 
                        value={spoof.modificationDate} 
                        onChange={(e) => setSpoof({ ...spoof, modificationDate: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                      <Monitor size={10} /> Producing Software (Creator)
                    </label>
                    <input 
                      type="text" 
                      value={spoof.creator} 
                      onChange={(e) => setSpoof({ ...spoof, creator: e.target.value })}
                      placeholder="e.g. Microsoft Word"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                      <User size={10} /> Author Name
                    </label>
                    <input 
                      type="text" 
                      value={spoof.author} 
                      onChange={(e) => setSpoof({ ...spoof, author: e.target.value })}
                      placeholder="Leave blank for anonymity"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={applySpoof}
              disabled={!file || processing}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                {processing ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Injecting Plausibility...
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-6 w-6" />
                    Spoof Fingerprint
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mb-8 border border-brand/50">
              <History size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4">Protocol Synchronized</h3>
            <p className="text-zinc-400 mb-10 max-w-md">Your history has been rewritten. The document now carries the specified digital trail.</p>
            
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a 
                href={spoofedUrl} 
                download={`spoofed_${file?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                Download Spoofed PDF
              </a>
              <button 
                onClick={() => { setFile(null); setSpoofedUrl(null); }}
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
