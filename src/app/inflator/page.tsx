'use client';

import ShapeGrid from '@/components/ShapeGrid';
import PayloadInflator from '@/components/PayloadInflator';
import Link from 'next/link';
import { ArrowLeft, Maximize2, Database, LayoutGrid, FileWarning, Cpu } from 'lucide-react';

export default function InflatorPage() {
  return (
    <>
      <div className="fixed inset-0 z-[-2]">
        <ShapeGrid 
          direction="diagonal"
          borderColor="#1a0f0f"
          hoverFillColor="#2b0000"
          squareSize={40}
          shape="square"
          speed={0.1}
        />
      </div>
      
      <main className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-32 pb-20">
        <div className="w-full max-w-7xl mb-12">
          <Link 
            href="/#utilities" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Utilities
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-brand/20 p-2 rounded-lg text-brand">
                  <Maximize2 size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">PAYLOAD INFLATOR</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Artificially expand PDF volumes to bypass processing systems.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <PayloadInflator />
          </div>
          
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Database size={80} />
              </div>
              <LayoutGrid className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">Massive File Size</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Adds invisible padding to expand the file size dramatically, making it impossible to email or upload.
              </p>
              
              <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-brand/30 transition-colors">
                      <FileWarning className="text-brand shrink-0" size={18} />
                      <div>
                          <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Best Used For</p>
                          <p className="text-zinc-300 text-xs leading-relaxed">Bypassing upload portals with strict "maximum 10MB" limitations by making your file 1GB.</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-brand/30 transition-colors">
                      <FileWarning className="text-brand shrink-0" size={18} />
                      <div>
                          <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">The Excuse</p>
                          <p className="text-zinc-300 text-xs leading-relaxed">"The file is too large to attach, I guess my images were too high resolution. Want me to try compressing it later?"</p>
                      </div>
                  </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-brand h-6 w-6" />
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Under the Hood</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Zero-Byte Padding</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            The inflator appends raw null bytes to the end of the PDF binary. This is invisible to readers but drastically increases the file size reported by the filesystem.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Browser-Only Processing</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Your file never leaves your computer. The entire inflation process runs in your browser's memory using JavaScript ArrayBuffers, then produces a downloadable blob.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
