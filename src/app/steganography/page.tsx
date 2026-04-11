import ShapeGrid from '@/components/ShapeGrid';
import Steganography from '@/components/Steganography';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, AlertCircle, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function SteganographyPage() {
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
                  <ShieldAlert size={20} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic underline decoration-brand/30 underline-offset-8">SECRET EMBEDDER</h1>
              </div>
              <p className="text-zinc-500 text-lg">
                Hide secret messages inside any PDF. Extract them with a password — or without.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2">
            <Steganography />
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <ShieldAlert size={80} />
              </div>
              <AlertCircle className="text-brand mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Messages are injected as invisible structural data inside the PDF. The file opens and renders identically — no visual difference whatsoever.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <Lock className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Encrypted Mode</p>
                    <p className="text-zinc-500 text-[11px] leading-tight text-white/60">Uses AES-256-GCM with PBKDF2 key derivation (100k iterations). Military-grade encryption — without the password, the message is mathematically unrecoverable.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <Unlock className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Open Mode</p>
                    <p className="text-zinc-500 text-[11px] leading-tight text-white/60">Base64 encoded without encryption. Anyone with this tool can extract the message. Best for non-sensitive dead drops.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <Eye className="text-brand shrink-0" size={18} />
                  <div>
                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Extraction</p>
                    <p className="text-zinc-500 text-[11px] leading-tight text-white/60">Switch to the Extract tab and drop a suspect PDF. The scanner will locate hidden payloads and attempt decryption.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-gradient-to-br from-brand to-red-950/80 font-black text-white flex items-center justify-between group overflow-hidden relative border border-white/10 shadow-[0_20px_40px_rgba(230,25,25,0.2)]">
              <div className="relative z-10">
                <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Encryption Standard</p>
                <p className="text-3xl italic">AES-256-GCM</p>
              </div>
              <Lock className="h-20 w-20 opacity-20 absolute -right-6 -bottom-6 rotate-12 group-hover:-rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
