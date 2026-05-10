'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, Terminal, Activity, MousePointerClick, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILLER_SENTENCES = [
  'The quarterly earnings report exceeded all projected benchmarks for the fiscal year.',
  'Please review the attached compliance documentation before the deadline.',
  'All personnel are required to submit their timesheets by end of business Friday.',
  'The committee has approved the revised budget allocation for Q3 operations.',
  'Confidential: This document contains proprietary information not for distribution.',
  'As per our previous discussion, the merger timeline has been accelerated.',
  'The board of directors has unanimously approved the strategic restructuring plan.',
  'Refer to Appendix B for the complete breakdown of operational expenditures.',
  'This memorandum supersedes all prior communications regarding the project scope.',
  'Final approval pending review by the legal department and external auditors.',
  'The infrastructure assessment revealed critical vulnerabilities in the network architecture.',
  'Stakeholder engagement metrics indicate a significant improvement over last quarter.',
  'All intellectual property rights are reserved under applicable international treaties.',
  'The vendor contract renewal includes updated service level agreement terms.',
  'Environmental impact assessment results are summarized in the following sections.',
  'Risk mitigation strategies have been implemented across all operational divisions.',
  'The performance benchmarking data correlates with industry standard methodologies.',
  'Regulatory compliance requires immediate attention to the outlined action items.',
  'Cross-functional team collaboration has yielded measurable productivity improvements.',
  'The due diligence process has identified several areas requiring further investigation.',
];

export default function PDFScrollChoker() {
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
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      addLog('Loading target document...');
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = srcDoc.getPages();
      const font = await srcDoc.embedFont(StandardFonts.Helvetica);

      addLog('Injecting maximum chaos protocols...');

      pages.forEach((page, index) => {
        addLog(`Swamping page ${index + 1}...`);
        const width = page.getWidth();
        const height = page.getHeight();
        
        // Fixed high intensity (75%)
        const intensity = 75;

        // 1. Vector Spaghetti
        const vectorCount = Math.floor(10000 * (intensity / 100));
        let path = `M ${Math.random() * width} ${Math.random() * height} `;
        for (let i = 0; i < vectorCount; i++) {
          path += `C ${Math.random() * width} ${Math.random() * height}, ${Math.random() * width} ${Math.random() * height}, ${Math.random() * width} ${Math.random() * height} `;
        }
        page.drawSvgPath(path, {
          borderColor: rgb(0.5, 0.5, 0.5),
          borderWidth: 2,
          opacity: 0.01
        });

        // 2. Text Swamp
        const textCount = Math.floor(8000 * (intensity / 100));
        for(let i = 0; i < textCount; i++) {
          page.drawText(FILLER_SENTENCES[Math.floor(Math.random() * FILLER_SENTENCES.length)], {
            x: Math.random() * width,
            y: Math.random() * height,
            size: 8 + Math.random() * 15,
            font: font,
            color: rgb(0,0,0),
            opacity: 0.01,
            rotate: degrees(Math.random() * 360)
          });
        }
      });

      addLog('Rendering sluggish payload...');
      const resultBytes = await srcDoc.save();
      const resultBlob = new Blob([resultBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(resultBlob);

      setResultUrl(url);
      setProcessing(false);
      addLog('Lag protocols active. Ready to frustrate.');
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
                <MousePointerClick className="text-brand w-8 h-8" /> LAGGY PDF
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto">Turn any smooth PDF into a stuttering, frustrating mess with one click.</p>
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
                  <MousePointerClick className={cn("h-8 w-8 text-white/20", file ? "text-brand" : "")} />
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
                  <div className="text-zinc-700 italic">Awaiting target parameters...</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex items-start gap-3">
                <Zap className="text-brand shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Injects thousands of invisible rendering obstacles. The document will look perfect but feel incredibly heavy and stuttery. <span className="text-brand font-bold uppercase italic">Maximum lag guaranteed.</span>
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
                    Injecting Chaos...
                  </>
                ) : (
                  <>
                    <Activity className="h-7 w-7" />
                    Create Lag Now
                  </>
                )}
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
            <div className="w-24 h-24 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_50px_rgba(230,25,25,0.4)]">
              <Activity size={48} className="text-brand animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">
              Lag Deployed
            </h3>
            <p className="text-zinc-400 mb-10 max-w-md">
              The document is now filled with invisible rendering obstacles. Anyone who opens it will experience extreme frustration.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={resultUrl}
                download={`laggy_${file?.name}`}
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
