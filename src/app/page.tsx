import ShapeGrid from '@/components/ShapeGrid';
import { HoverCard } from '@/components/HoverCard';
import LaserFlow from '@/components/LaserFlow';
import FuzzyText from '@/components/FuzzyText';
import { FileWarning, Maximize2, ShieldAlert, Cpu, Briefcase, Globe, MessageSquare, Mail, Fingerprint, Clock, Bomb, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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


      <main className="relative z-10 flex min-h-screen flex-col items-center">

        {/* Hero -- LaserFlow beam falls onto the box below */}
        <section
          style={{ height: '75vh', position: 'relative', overflow: 'hidden' }}
          className=""
        >
          {/* LaserFlow fills the entire section */}
          <LaserFlow
            color="#e61919"
            horizontalBeamOffset={0}
            verticalBeamOffset={0.0}
            wispDensity={2}
            wispSpeed={15}
            wispIntensity={5}
            flowSpeed={0.35}
            flowStrength={0.25}
            verticalSizing={2}
            horizontalSizing={0.5}
            fogIntensity={0.45}
            fogScale={0.3}
            fogFallSpeed={0.6}
            decay={1.1}
            falloffStart={1.2}
          />

          {/* The box the laser lands on -- centered in section */}
          <div style={{
            position: 'absolute',
            top: '74%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '86%',
            maxWidth: '900px',
            height: '48%',
            backgroundColor: '#050005',
            borderRadius: '24px',
            border: '2px solid rgba(230,25,25,0.4)',
            borderTop: '2.5px solid #e61919',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: 'white',
            zIndex: 6,
          }}>
            {/* Glow at top edge where beam hits */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              height: '50px',
              background: 'radial-gradient(ellipse, rgba(230,25,25,0.5) 0%, transparent 70%)',
              filter: 'blur(15px)',
              pointerEvents: 'none',
            }} />

            {/* Hero heading */}
            <h1 style={{
              textAlign: 'center',
              lineHeight: 1.1,
              margin: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                display: 'block',
                margin: '0.5rem',
              }}>
                completely
              </span>
              <span style={{
                fontFamily: 'var(--font-instrument), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(3.5rem, 11vw, 7.5rem)',
                color: '#e61919',
                display: 'block',
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
              }}>
                Ruin
              </span>
              <span style={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                display: 'block',
                marginTop: '0.4rem',
              }}>
                your PDFs.
              </span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)',
              color: 'rgba(255,255,255,0.3)',
              maxWidth: '420px',
              textAlign: 'center',
              lineHeight: 1.6,
              marginTop: '1.5rem',
              marginBottom: 0,
            }}>
              Client-side document destruction. No uploads. No servers. No survivors.
            </p>
          </div>

          {/* Bottom gradient fade */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, var(--bg-color), transparent)',
            zIndex: 7,
            pointerEvents: 'none',
          }} />
        </section>

        <div className="max-w-7xl w-full px-6 py-24 space-y-32">

          {/* Utilities Section */}
          <section id="utilities" className="scroll-mt-32">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-sm font-bold text-brand uppercase tracking-widest">01. The Platform</h2>
              <div className="h-px w-full flex-1 bg-gradient-to-r from-brand/20 to-transparent"></div>
            </div>

            <h3 className="text-4xl font-bold text-white mb-10">Available Utilities</h3>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/corruptor" className="flex h-full block outline-none">
                <HoverCard
                  title="PDF Corruptor"
                  description="Irreversibly mangles the file header and nullifies structural XREF tables."
                  icon={<FileWarning size={28} />}
                  isActive={true}
                />
              </Link>

              <Link href="/spoofer" className="flex h-full block outline-none">
                <HoverCard 
                  title="Metadata Spoofer" 
                  description="Wipes or replaces internal document history to create a plausible digital trail."
                  icon={<Fingerprint size={28} />}
                  isActive={true}
                />
              </Link>

              <Link href="/timebomb" className="flex h-full block outline-none">
                <HoverCard 
                  title="The Time-Bomb" 
                  description="Sets a self-destruct date. Document becomes unreadable or displays a warning after the deadline."
                  icon={<Clock size={28} />}
                  isActive={true}
                />
              </Link>

              <Link href="/inflator" className="flex h-full block outline-none">
                <HoverCard
                  title="Payload Data Inflator"
                  description="Injects massive quantities of invisible null-bytes to inflate file payloads by 500x."
                  icon={<Maximize2 size={28} />}
                  isActive={true}
                />
              </Link>

              <Link href="/copykiller" className="flex h-full block outline-none">
                <HoverCard
                  title="Copy Killer"
                  description="Makes PDF text impossible to copy — burn it to image or poison it with invisible Unicode homoglyphs."
                  icon={<EyeOff size={28} />}
                  isActive={true}
                />
              </Link>

              <Link href="/steganography" className="flex h-full block outline-none">
                <HoverCard
                  title="Secret Embedder"
                  description="Hide encrypted messages inside any PDF. Extract them with a password — or without."
                  icon={<ShieldAlert size={28} />}
                  isActive={true}
                />
              </Link>
            </div>
          </section>

          {/* SaaS Glassmorphism Sections */}

          {/* The Difference > */}
          <section id="difference" className="scroll-mt-32 relative">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-sm font-bold text-brand uppercase tracking-widest">02. The Difference &gt;</h2>
              <div className="h-px w-full flex-1 bg-gradient-to-r from-brand/20 to-transparent"></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 lg:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 lg:w-2/3">
                <ShieldAlert className="text-brand w-12 h-12 mb-6" />
                <h3 className="text-3xl sm:text-5xl font-bold text-white mb-6">Built for plausibility.</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Unlike amateurs who simply rename a `.jpg` to `.pdf`—a technique instantly identifiable by any IT department—ihatepdf utilizes cryptographic byte-scrambling. We preserve valid file sizes and convincing metadata while utterly annihilating the payload.
                </p>
                <div className="flex items-center gap-4 text-white font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand"></div> 100% Undetectable
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand"></div> Client-side Only
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Under the Hood > */}
          <section id="under-the-hood" className="scroll-mt-32 relative">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-sm font-bold text-brand uppercase tracking-widest">03. Under the Hood &gt;</h2>
              <div className="h-px w-full flex-1 bg-gradient-to-r from-brand/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-10 hover:bg-white/10 transition-colors">
                <Cpu className="text-zinc-300 w-8 h-8 mb-6" />
                <h4 className="text-xl font-bold text-white mb-4">Zero-Server Architecture</h4>
                <p className="text-zinc-400 leading-relaxed">
                  Every byte manipulation happens directly within your local client memory via sophisticated ArrayBuffer mutations. Your files never leave your browser, ensuring absolute privacy for your corporate sabotage.
                </p>
              </div>
              <div className="rounded-3xl border border-brand/20 bg-[#140000]/40 backdrop-blur-md p-10 shadow-[inset_0_0_40px_rgba(230,25,25,0.05)]">
                <FileWarning className="text-brand w-8 h-8 mb-6" />
                <h4 className="text-xl font-bold text-white mb-4">Header Dropping</h4>
                <p className="text-zinc-400 leading-relaxed">
                  We don't just break the PDF format—we systematically target the `%PDF-` magic bytes and XREF pointers, tricking any Adobe or Preview software into catastrophic rendering failures.
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section id="use-cases" className="scroll-mt-32 relative">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-sm font-bold text-brand uppercase tracking-widest">04. Use Cases</h2>
              <div className="h-px w-full flex-1 bg-gradient-to-r from-brand/20 to-transparent"></div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-black/60 to-[#0a0000]/80 backdrop-blur-2xl p-12 text-center max-w-4xl mx-auto">
              <Briefcase className="text-brand w-12 h-12 mb-6 mx-auto" />
              <h3 className="text-3xl font-bold text-white mb-8">When do you need us?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                <div>
                  <h5 className="text-white font-bold mb-2">College Deadlines</h5>
                  <p className="text-sm text-zinc-500">Buy yourself an extra 24 hours while the professor emails you saying the file "won't open on their machine."</p>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-2">Corporate Reports</h5>
                  <p className="text-sm text-zinc-500">Need more time to fudge the quarterly numbers? Send a corrupted 5MB payload to management.</p>
                </div>
                <div>
                  <h5 className="text-white font-bold mb-2">Passive Aggression</h5>
                  <p className="text-sm text-zinc-500">Perfect for dealing with bureaucratic entities requesting unnecessary documentation.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>


    </>
  );
}
