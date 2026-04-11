'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] mt-4 px-4 md:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto">
        
        {/* Left: Logo */}
        <div className="flex items-center pointer-events-auto">
          <Link href="/" className="flex items-center gap-1.5 group outline-none">
            <span className="text-3xl font-black tracking-tight uppercase font-outfit hidden sm:block">
              <span className="text-white">I</span><span className="inline-block mx-1 text-4xl group-hover:scale-125 transition-transform duration-300">😈</span><span className="text-brand">PDF</span>
            </span>
          </Link>
        </div>



        {/* Right: Actions */}
        <div className="flex items-center gap-6 pointer-events-auto">
          <a href="https://github.com/AnkitNayak-eth/ihatepdf" target="_blank" rel="noreferrer" className="hidden sm:flex text-sm font-medium text-zinc-500 hover:text-white transition-colors items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span className="hidden lg:block">GitHub</span>
          </a>
          <Link href="/#utilities" className="bg-brand hover:bg-brand-hover text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(230,25,25,0.3)] hover:shadow-[0_0_30px_rgba(230,25,25,0.5)]">
            Start Destroying
          </Link>
        </div>

      </div>
    </header>
  );
}
