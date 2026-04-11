import ShapeGrid from '@/components/ShapeGrid';
import MetadataSpoofingTool from '@/components/MetadataSpoofingTool';
import Link from 'next/link';
import { ArrowLeft, Fingerprint, ShieldAlert, Cpu } from 'lucide-react';

export default function SpooferPage() {
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
                <div className="bg-brand/20 p-2 rounded-lg">
                  <Fingerprint className="text-brand w-5 h-5" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight text-white uppercase italic">Metadata Spoofer</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Manipulate internal XMP streams to rewrite document history.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <MetadataSpoofingTool />
          </div>
          
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <ShieldAlert className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">The Danger of Defaults</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                When you export a PDF, your computer secretly records your OS version, your user account name, and the exact millisecond of creation. Most people "Print to PDF" and assume the file is clean. It's not.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded bg-brand/20 flex items-center justify-center text-brand text-[10px] font-black mt-0.5">01</div>
                    <p className="text-zinc-400 text-xs">Portals flag uploads that have creation dates *after* the deadline.</p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded bg-brand/20 flex items-center justify-center text-brand text-[10px] font-black mt-0.5">02</div>
                    <p className="text-zinc-400 text-xs">IT departments can track the exact machine used via Producer tags.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-brand font-black text-white flex items-center justify-between group cursor-help overflow-hidden relative">
               <div className="relative z-10">
                    <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Status Protocol</p>
                    <p className="text-2xl italic">100% Plausible</p>
               </div>
               <Cpu className="h-16 w-16 opacity-20 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
