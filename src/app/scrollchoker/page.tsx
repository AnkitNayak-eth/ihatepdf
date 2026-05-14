import type { Metadata } from 'next';
import ShapeGrid from '@/components/ShapeGrid';
import PDFScrollChoker from '@/components/PDFScrollChoker';
import Link from 'next/link';
import { ArrowLeft, MousePointerClick, ShieldAlert, FileWarning, Activity, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: "Laggy PDF — Make PDFs Incredibly Slow",
  description: "Make any PDF incredibly slow and frustrating to scroll through. Invisible junk clogs the rendering engine. Free client-side tool from ihatepdf.",
  keywords: ["make pdf slow", "laggy pdf", "pdf performance killer", "slow pdf scroll", "i hate pdf"],
  openGraph: {
    title: "Laggy PDF — i hate pdf",
    description: "Make the PDF incredibly slow and frustrating to scroll through. Invisible junk clogs the rendering engine.",
    url: "https://ihate-pdf.vercel.app/scrollchoker",
  },
};

export default function ScrollChokerPage() {
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
                  <MousePointerClick size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">LAGGY PDF</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Make any PDF incredibly slow and frustrating to scroll through.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <PDFScrollChoker />
          </div>
          
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Activity size={80} />
              </div>
              <ShieldAlert className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">The Lag Engine</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                This tool turns a smooth reading experience into a stuttering nightmare. By injecting thousands of invisible rendering obstacles, it forces PDF viewers to work overtime on every scroll and zoom.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">User Frustration</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">The heavy rendering load makes careful reading or searching almost impossible for the recipient.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <FileWarning className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Invisible Sabotage</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">All injected data is invisible. The document looks perfect, it just performs terribly.</p>
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
                        <p className="text-xs font-black text-white uppercase mb-2">Vector Chaos</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Injects complex SVG paths with thousands of points that are mathematically expensive for browsers to render.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase mb-2">Text Overload</p>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            Adds hidden text layers with randomized rotations to defeat subpixel caching and force re-renders on every interaction.
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
