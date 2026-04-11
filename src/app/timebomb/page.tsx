'use client';

import ShapeGrid from '@/components/ShapeGrid';
import PDCTimeBomb from '@/components/PDCTimeBomb';
import Link from 'next/link';
import { ArrowLeft, Bomb, Clock, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function TimeBombPage() {
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
                  <Bomb size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">PDF TIME-BOMB</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Inject temporal self-destruction protocols into document DNA.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2 space-y-12">
            <PDCTimeBomb />
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-brand h-6 w-6" />
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Under the Hood</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Acrobat JS Injection</p>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                            The Time-Bomb utilizes the ISO-standardized <code>/JS</code> dictionary to inject script objects into the PDF's <code>Catalogs</code> object. This is a non-destructive process that preserves the original document's layout while adding a hidden logic layer.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Client-Side Verification</p>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                            All "Temporal Sabotage" happens locally on your machine. Your PDF is loaded into a WASM-powered environment, the JavaScript payload is injected, and the resulting "Armed" file is returned immediately.
                        </p>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Clock size={80} />
              </div>
              <ShieldAlert className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">Temporal Strategy</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Urgency is the ultimate closer. By setting a hard expiry on a proposal, offer, or confidential brief, you shift the psychological burden of action onto the recipient.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-brand/30 transition-colors">
                    <Zap className="text-brand shrink-0" size={18} />
                    <div>
                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Protocol: Deadline</p>
                        <p className="text-zinc-500 text-[11px] leading-tight text-white/60">Effectively invalidates stale pricing or limited-time offers automatically.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-brand/30 transition-colors">
                    <ShieldAlert className="text-brand shrink-0" size={18} />
                    <div>
                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Protocol: Leak Control</p>
                        <p className="text-zinc-500 text-[11px] leading-tight text-white/60">Limits the window of exposure for sensitive documents shared with third parties.</p>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-gradient-to-br from-brand to-red-950/80 font-black text-white flex items-center justify-between group overflow-hidden relative border border-white/10 shadow-[0_20px_40px_rgba(230,25,25,0.2)]">
               <div className="relative z-10 transition-transform group-hover:translate-x-2 duration-500 cursor-help">
                    <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Timing Protocol</p>
                    <p className="text-3xl italic">ARMED & SYNCED</p>
               </div>
               <Clock className="h-20 w-20 opacity-20 absolute -right-6 -bottom-6 rotate-12 group-hover:-rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
