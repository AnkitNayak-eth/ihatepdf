'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] pt-24 overflow-hidden border-t border-white/5">
      
      {/* Subtle bottom glow like Mogra */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-brand/10 blur-[120px] pointer-events-none rounded-[100%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-8 mb-24">
          
          {/* Col 1: Logo & Tagline */}
          <div className="col-span-2 md:col-span-1 md:mr-12">
            <Link href="/" className="flex items-center gap-1.5 group outline-none mb-6">
              <span className="text-3xl font-black tracking-tight uppercase font-outfit">
                <span className="text-white">I</span><span className="inline-block mx-1 text-4xl group-hover:scale-125 transition-transform duration-300">😈</span><span className="text-brand">PDF</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
              The world's premier platform for digital document destruction.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/corruptor" className="hover:text-white transition-colors">PDF Corruptor</Link></li>
              <li><Link href="/copykiller" className="hover:text-white transition-colors">Copy Killer</Link></li>
              <li><Link href="/steganography" className="hover:text-white transition-colors">Steganography</Link></li>
              <li><span className="cursor-not-allowed opacity-50">Data Inflator (Soon)</span></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-[10px] italic">No Liability Accepted</a></li>
            </ul>
          </div>

          {/* Col 5: Connect */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">X / Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Discord</a></li>
              <li><a href="https://github.com/shiva-codes/ihatepdf" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">GitHub</a></li>
            </ul>
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
          <p>© {new Date().getFullYear()} ihatepdf. All rights reserved.</p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
             All systems hostile
          </div>
        </div>

      </div>
    </footer>
  );
}
