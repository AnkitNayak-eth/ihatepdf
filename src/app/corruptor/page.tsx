import type { Metadata } from 'next';
import ShapeGrid from '@/components/ShapeGrid';
import PDFCorruptor from '@/components/PDFCorruptor';
import Link from 'next/link';
import { ArrowLeft, Hammer, ShieldX, Cpu, FileWarning } from 'lucide-react';

export const metadata: Metadata = {
  title: "PDF Corruptor — Make Any PDF Unreadable",
  description: "Corrupt any PDF file instantly in your browser. Make PDFs completely unreadable and impossible to open. Free, client-side, no uploads. The perfect excuse for missing deadlines.",
  keywords: ["corrupt pdf", "pdf corruptor", "break pdf file", "make pdf unreadable", "i hate pdf", "corrupted pdf generator"],
  openGraph: {
    title: "PDF Corruptor — i hate pdf",
    description: "Make any PDF completely unreadable and impossible to open. 100% client-side, zero uploads.",
    url: "https://ihate-pdf.vercel.app/corruptor",
  },
};

export default function CorruptorPage() {
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
                Make any PDF completely unreadable and impossible to open.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <PDFCorruptor />
          </div>
          
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <ShieldX size={80} />
              </div>
              <ShieldX className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">Total Annihilation</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                This tool systematically destroys the document structure. It's not just a renamed file — it's a binary-level massacre that triggers catastrophic failures in any PDF reader.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">The Impact</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">The file will look completely normal on the outside, but will immediately crash or error when anyone tries to open it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Plausible Deniability</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">It produces the exact error signature of a "corrupted download" or "interrupted transfer."</p>
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
                        <p className="text-xs font-black text-white uppercase mb-2">Header Mashing</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Overwrites the magic byte signatures that identify the file as a PDF, causing instant rejection by all software.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Entropy Injection</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Randomly mutates the raw byte stream, ensuring the internal cross-reference tables and content streams are permanently unusable.
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
