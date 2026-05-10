'use client';

import ShapeGrid from '@/components/ShapeGrid';
import CopyKiller from '@/components/CopyKiller';
import Link from 'next/link';
import { ArrowLeft, EyeOff, ShieldAlert, FileWarning, Cpu, Image } from 'lucide-react';

export default function CopyKillerPage() {
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
                  <EyeOff size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">COPY KILLER</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Make your PDF text impossible to copy, select, or search.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <CopyKiller />
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Image size={80} />
              </div>
              <ShieldAlert className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">The Burn Protocol</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                This utility uses "Image Burning" to convert every page of your PDF into a high-fidelity raster image. The result looks identical to the original but contains absolutely zero selectable text.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Select Proof</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">By converting text to images, you break all standard selection and OCR tools used by common readers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Visual Integrity</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">Maintain the exact look, layout, and fonts of your document while stripping away the data layer.</p>
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
                        <p className="text-xs font-black text-white uppercase mb-2">Rasterization</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Each page is rendered to an HTML5 canvas at high resolution, then re-embedded into a new PDF as a full-page image.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Metadata Stripping</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            The process effectively wipes all hidden metadata and text mapping tables from the original file.
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
