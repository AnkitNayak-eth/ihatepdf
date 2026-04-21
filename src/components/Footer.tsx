'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] pt-24 overflow-hidden border-t border-white/5">
      
      {/* Subtle bottom glow like Mogra */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-brand/10 blur-[120px] pointer-events-none rounded-[100%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-8 mb-24">
          
          {/* Col 1: Logo & Tagline */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-1.5 group outline-none mb-6">
              <span className="text-3xl font-black tracking-tight uppercase font-outfit">
                <span className="text-white">I</span><span className="inline-block mx-1 text-4xl group-hover:scale-125 transition-transform duration-300">😈</span><span className="text-brand">PDF</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
              The world&apos;s premier platform for digital document destruction.
            </p>
          </div>

          {/* Col 2: Arsenal (Spans 2 columns, internal 2-column grid) */}
          <div className="col-span-1 md:col-span-2 md:mx-auto">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Arsenal</h4>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm text-zinc-500">
              <li><Link href="/corruptor" className="hover:text-brand transition-colors">PDF Corruptor</Link></li>
              <li><Link href="/timebomb" className="hover:text-brand transition-colors">PDF Time-Bomb</Link></li>
              <li><Link href="/inflator" className="hover:text-brand transition-colors">Payload Inflator</Link></li>
              <li><Link href="/copykiller" className="hover:text-brand transition-colors">Copy Killer</Link></li>
              <li><Link href="/spoofer" className="hover:text-brand transition-colors">Metadata Spoofer</Link></li>
              <li><Link href="/steganography" className="hover:text-brand transition-colors">Secret Embedder</Link></li>
            </ul>
          </div>

          {/* Col 3: Connect (Aligned to the end symmetrically) */}
          <div className="col-span-1 md:flex md:justify-end">
            <div>
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="https://github.com/AnkitNayak-eth" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors flex items-center gap-2">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Watermark Text - Striped like Mogra */}
        <div className="w-full relative flex justify-center pb-4 select-none pointer-events-none">
          <span 
            className="text-[15vw] leading-none font-black tracking-tighter"
            style={{
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-outfit), sans-serif'
            }}
          >
            IHATEPDF
          </span>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs gap-4">
          <p className="flex items-center gap-1.5">Made with <span className="text-brand font-bold">hate</span> by <a href="https://github.com/AnkitNayak-eth" target="_blank" rel="noreferrer" className="text-white hover:text-brand transition-colors font-bold inline-flex items-center gap-1">Ankit 😈</a></p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
             All systems hostile
          </div>
        </div>

      </div>
    </footer>
  );
}
