import type { Metadata } from 'next';
import Link from 'next/link';
import ShapeGrid from '@/components/ShapeGrid';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "How to Corrupt a PDF File (And Why You Might Need To)",
  description: "A technical guide to PDF corruption. Learn how corrupted PDF files work at the binary level and how to create one instantly using free browser tools.",
  keywords: ["how to corrupt a pdf", "corrupt pdf file", "make pdf corrupted", "corrupted pdf generator", "fake corrupted file", "i hate pdf"],
  openGraph: {
    title: "How to Corrupt a PDF File — i hate pdf",
    description: "A technical deep-dive into PDF corruption. How it works, why you need it, and how to do it instantly.",
    url: "https://ihate-pdf.vercel.app/blog/how-to-corrupt-a-pdf",
  },
};

export default function HowToCorruptPdf() {
  return (
    <>
      <div className="fixed inset-0 z-[-2]">
        <ShapeGrid direction="diagonal" borderColor="#1a0f0f" hoverFillColor="#2b0000" squareSize={40} shape="square" speed={0.1} />
      </div>
      <main className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-32 pb-20">
        <article className="w-full max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <header className="mb-12">
            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
              <time dateTime="2026-05-08">May 8, 2026</time>
              <span>·</span>
              <span>6 min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">How to Corrupt a PDF File (And Why You Might Need To)</h1>
            <p className="text-xl text-zinc-400 leading-relaxed">Sometimes you need a corrupted PDF. Here&apos;s the technical breakdown of how it works — and a free tool that does it instantly.</p>
          </header>
          <div className="prose prose-invert prose-zinc max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why Would Anyone Want to Corrupt a PDF?</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">You probably have a deadline. The assignment isn&apos;t done. The report isn&apos;t ready. You need to buy yourself 24 to 48 hours of breathing room.</p>
              <p className="text-zinc-300 leading-relaxed mb-4">The classic move is to submit a &ldquo;corrupted&rdquo; file. When the professor or manager tries to open it and gets an error, they email you back saying the file &ldquo;won&apos;t open.&rdquo; You apologize, promise to resend, and use that extra time to actually finish.</p>
              <p className="text-zinc-300 leading-relaxed">This strategy is as old as email. But most people do it wrong — and get caught.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Wrong Way: Renaming File Extensions</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">The most common technique is embarrassingly simple: take a JPEG, rename it to <code className="text-brand bg-brand/10 px-1.5 py-0.5 rounded">.pdf</code>, and submit it. Any IT-literate person can check the file&apos;s hex signature and immediately see it&apos;s not a real PDF.</p>
              <p className="text-zinc-300 leading-relaxed">You need a file that is <em>actually</em> a PDF — with the right headers, structure, and file size — but is internally broken in a way that looks completely accidental.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How Real PDF Corruption Works</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">A PDF file contains interdependent structures: a header with magic bytes, a body with content objects, a cross-reference table (xref) indexing everything, and a trailer pointing back to the xref. Real corruption targets the <em>relationships</em> between these structures.</p>
              <p className="text-zinc-300 leading-relaxed">The key insight: <strong className="text-white">the file should still look like a PDF from the outside</strong>. The extension is correct, the header is present, the file size is realistic. But internally, the data structures are broken exactly like a genuine download interruption.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The ihatepdf Approach</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">Our <Link href="/corruptor" className="text-brand hover:underline">PDF Corruptor</Link> performs targeted binary surgery — preserving headers and file size while strategically mutating content streams and cross-reference tables. The result triggers genuine error messages in every PDF reader.</p>
              <p className="text-zinc-300 leading-relaxed">And because everything runs in your browser, your file never touches our servers. There&apos;s no upload, no log, no evidence.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Beyond Corruption: The Full Arsenal</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><Link href="/inflator" className="text-brand hover:underline">Payload Inflator</Link> — Make the PDF too large to upload</li>
                <li><Link href="/timebomb" className="text-brand hover:underline">PDF Self Destruct</Link> — Set an expiry date</li>
                <li><Link href="/spoofer" className="text-brand hover:underline">Metadata Spoofer</Link> — Backdate creation timestamps</li>
                <li><Link href="/dyslexia" className="text-brand hover:underline">Dyslexia Inducer</Link> — Subtle visual sabotage</li>
              </ul>
            </section>
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-zinc-500 text-sm">Ready to corrupt a PDF? <Link href="/corruptor" className="text-brand hover:underline">Use the PDF Corruptor →</Link></p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
