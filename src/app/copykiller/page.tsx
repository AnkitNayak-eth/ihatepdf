'use client';

import ShapeGrid from '@/components/ShapeGrid';
import CopyKiller, { type Mode } from '@/components/CopyKiller';
import Link from 'next/link';
import { ArrowLeft, EyeOff, ShieldAlert, AlertCircle, FileWarning, Type, Image, Cpu } from 'lucide-react';
import { useState } from 'react';

const KILLER_DETAILS = {
  'IMAGE_BURN': {
    title: 'Image Burn',
    description: 'Turns all text into flat, unselectable pictures.',
    icon: Image,
    features: [
      { id: 'Best Used For', text: 'Absolute copy protection. Zero actual text remains, making traditional OCR and copy tools useless.' },
      { id: 'How It Works', text: 'The document is cleanly flattened. They can look, but they cannot touch or extract the letters.' }
    ]
  },
  'UNICODE_POISON': {
    title: 'Unicode Poison',
    description: 'Swaps normal letters with visually identical characters from other languages.',
    icon: Type,
    features: [
      { id: 'How It Works', text: 'It looks perfectly normal to read on-screen, but copies and pastes as completely unintelligible garbage.' },
      { id: 'The Impact', text: 'Maximum deception. Victims won\'t realize the text is protected until they try to paste it.' }
    ]
  }
};

export default function CopyKillerPage() {
  const [mode, setMode] = useState<Mode>('IMAGE_BURN');
  const details = KILLER_DETAILS[mode];
  const Icon = details.icon;
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
                Eliminate the ability to copy-paste text from any PDF document.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <CopyKiller mode={mode} setMode={setMode} />
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Icon size={80} />
              </div>
              <AlertCircle className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">{details.title}</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {details.description}
              </p>

              <div className="space-y-5">
                {details.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-brand/30 transition-colors">
                      <FileWarning className="text-brand shrink-0" size={18} />
                      <div>
                          <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">{feature.id}</p>
                          <p className="text-zinc-300 text-xs leading-relaxed">{feature.text}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-brand h-6 w-6" />
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Under the Hood</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Page Rasterization</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Image Burn uses pdf.js to render every page to a canvas at your chosen DPI, then re-assembles the raster images into a brand new PDF with zero selectable text layers.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Homoglyph Mapping</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Unicode Poison swaps Latin characters with visually identical Cyrillic and Greek codepoints directly inside the PDF's text streams. The result passes visual inspection but fails every copy-paste and search operation.
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
