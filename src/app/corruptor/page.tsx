'use client';

import ShapeGrid from '@/components/ShapeGrid';
import PDFCorruptor, { type Strategy } from '@/components/PDFCorruptor';
import Link from 'next/link';
import { ArrowLeft, Hammer, ShieldX, AlertCircle, FileWarning, Zap, Crosshair } from 'lucide-react';
import { useState } from 'react';

const STRATEGY_DETAILS = {
  'HEADER': {
    title: 'Header Saboteur',
    description: 'Quickly scrambles the beginning of the file.',
    icon: Zap,
    features: [
      { id: 'Best Used For', text: 'Making it look like your internet cut out or the file upload was unexpectedly interrupted.' },
      { id: 'Good To Know', text: 'This is the fastest method. The PDF will simply show up as an invalid file right away.' }
    ]
  },
  'ENTROPY': {
    title: 'Entropy Injection',
    description: 'Injects random scrambled data throughout the document.',
    icon: ShieldX,
    features: [
      { id: 'The Impact', text: 'Extremely difficult to fix. The contents inside are completely ruined and rendered completely unreadable.' },
      { id: 'Crucial Warning', text: 'Always keep a backup of your original document! This process cannot be undone.' }
    ]
  },
  'XREF': {
    title: 'XREF Nullification',
    description: 'Deletes the invisible map that readers use to show the PDF pages.',
    icon: Crosshair,
    features: [
      { id: 'How It Works', text: 'The file looks completely normal on the outside, but it will immediately crash or error when someone tries to open it.' },
      { id: 'The Result', text: 'Destroys the internal structure, deliberately breaking things like the table of contents and page tracking.' }
    ]
  }
};

export default function CorruptorPage() {
  const [strategy, setStrategy] = useState<Strategy>('ENTROPY');
  const details = STRATEGY_DETAILS[strategy];
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
                  <Hammer size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">PDF CORRUPTOR</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Irreversibly mangle document structures to achieve absolute unreadability.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <PDFCorruptor strategy={strategy} setStrategy={setStrategy} />
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
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                      <FileWarning className="text-brand shrink-0" size={18} />
                      <div>
                          <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">{feature.id}</p>
                          <p className="text-zinc-300 text-xs leading-relaxed">{feature.text}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-gradient-to-br from-brand to-red-950/80 font-black text-white flex items-center justify-between group overflow-hidden relative border border-white/10 shadow-[0_20px_40px_rgba(230,25,25,0.2)]">
               <div className="relative z-10">
                    <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Destruction Status</p>
                    <p className="text-3xl italic">TOTAL NULL</p>
               </div>
               <Hammer className="h-20 w-20 opacity-20 absolute -right-6 -bottom-6 rotate-12 group-hover:-rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
