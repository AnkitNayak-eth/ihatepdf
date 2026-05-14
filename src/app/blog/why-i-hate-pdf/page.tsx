import type { Metadata } from 'next';
import Link from 'next/link';
import ShapeGrid from '@/components/ShapeGrid';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "Why I Hate PDF — And You Should Too",
  description: "PDF was supposed to be a universal document format. Instead, it became the most frustrating file format in computing history. A complete breakdown of everything wrong with PDFs.",
  keywords: ["i hate pdf", "why pdf is bad", "pdf problems", "pdf frustration", "worst file format", "pdf sucks", "ihatepdf"],
  openGraph: {
    title: "Why I Hate PDF — And You Should Too",
    description: "A complete breakdown of everything wrong with the PDF format. From ihatepdf.com.",
    url: "https://ihate-pdf.vercel.app/blog/why-i-hate-pdf",
  },
};

export default function WhyIHatePdf() {
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
        <article className="w-full max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
              <time dateTime="2026-05-10">May 10, 2026</time>
              <span>·</span>
              <span>8 min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Why I Hate PDF — And You Should Too
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              PDF was supposed to be a universal document format. Instead, it became the most frustrating file format in computing history.
            </p>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Promise vs. The Reality</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                When Adobe released the Portable Document Format in 1993, the pitch was simple: a file that looks the same everywhere. On every screen, every printer, every operating system. A universal document.
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Thirty-three years later, PDF has become the digital equivalent of a fax machine — technically functional, universally despised, and impossible to kill. If you&apos;ve ever tried to edit a PDF, copy text from a PDF, or fill out a PDF form, you know exactly why <strong className="text-white">I hate PDF</strong>.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                That&apos;s why we built <Link href="/" className="text-brand hover:underline">ihatepdf</Link> — a suite of free tools for people who share our frustration with this ancient, bloated, infuriating file format.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">PDF Is a Printed Page Pretending to Be Digital</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                The fundamental problem with PDF is philosophical. A PDF is not a document — it&apos;s a <em>picture</em> of a document. It preserves the layout of a printed page, which sounds great until you realize that digital documents shouldn&apos;t behave like printed pages.
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Try reading a PDF on your phone. The text is microscopic because the document was designed for an A4 sheet, not a 6-inch screen. You can pinch to zoom, but then you&apos;re scrolling horizontally on every single line. This is not a bug — it&apos;s the core design philosophy of PDF. And it&apos;s terrible.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                HTML solved this problem decades ago with responsive layouts. EPUB solved it for books. PDF stubbornly refuses to adapt, because adapting would mean admitting that the &ldquo;portable&rdquo; in Portable Document Format was always a lie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Editing a PDF Is a War Crime</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Have you ever received a PDF form and tried to fill it out? Half the time the form fields don&apos;t work. The other half, they work but the text doesn&apos;t fit in the box. And when you finally submit it, the recipient says &ldquo;can you send it as a Word document instead?&rdquo;
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Editing the actual content of a PDF is even worse. Adobe charges $240/year for Acrobat Pro, and even then, the editing experience feels like performing surgery with oven mitts. Text reflows incorrectly. Images shift. Fonts get substituted. Every edit feels like defusing a bomb.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                At <Link href="/" className="text-brand hover:underline">ihatepdf</Link>, we don&apos;t pretend to fix PDF editing. Instead, we lean into the chaos. Our <Link href="/corruptor" className="text-brand hover:underline">PDF Corruptor</Link> embraces what PDFs do best — breaking in spectacular, unexplainable ways.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Metadata Problem Nobody Talks About</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Every PDF you create secretly records your name, your operating system, the software you used, and the exact timestamp of creation. Most people have no idea this hidden data exists. HR departments, universities, and legal teams use it to verify (or invalidate) documents.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Our <Link href="/spoofer" className="text-brand hover:underline">Metadata Spoofer</Link> lets you see and edit this hidden information. Because you should control what your documents say about you — even the parts you can&apos;t see.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why &ldquo;I Hate PDF&rdquo; Is a Universal Feeling</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Search &ldquo;I hate PDF&rdquo; on any platform — Reddit, Twitter, Hacker News — and you&apos;ll find thousands of people who share the frustration. Students hate PDFs because professors love sending uneditable, unprintable assignments. Office workers hate PDFs because every government form, every legal contract, every corporate report is locked inside this rigid, uncooperative format.
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                The common complaints are always the same:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>&ldquo;I can&apos;t copy text from this PDF&rdquo; — use our <Link href="/copykiller" className="text-brand hover:underline">Copy Killer</Link> to understand why</li>
                <li>&ldquo;This PDF is too large to email&rdquo; — our <Link href="/inflator" className="text-brand hover:underline">Payload Inflator</Link> makes this problem worse, on purpose</li>
                <li>&ldquo;The pages are in the wrong order&rdquo; — our <Link href="/shuffler" className="text-brand hover:underline">Page Shuffler</Link> can do that to any PDF</li>
                <li>&ldquo;The text looks garbled&rdquo; — try our <Link href="/dyslexia" className="text-brand hover:underline">Dyslexia Inducer</Link> to see real text sabotage</li>
                <li>&ldquo;This PDF won&apos;t open&rdquo; — that&apos;s our <Link href="/corruptor" className="text-brand hover:underline">PDF Corruptor</Link> at work</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The ihatepdf Philosophy</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We didn&apos;t build ihatepdf because we enjoy destruction (well, maybe a little). We built it because the PDF format has been inflicted on the world for over three decades without meaningful improvement, and sometimes the best response to a bad system is to expose exactly how fragile it is.
              </p>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Every tool on ihatepdf runs 100% in your browser. Your files never leave your computer. There are no accounts, no uploads, no subscriptions. Just pure, client-side document chaos.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Because when you really, truly <strong className="text-white">hate PDFs</strong> — you deserve tools that feel the same way.
              </p>
            </section>

            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-zinc-500 text-sm">
                Ready to ruin some PDFs? <Link href="/" className="text-brand hover:underline">Try our free tools →</Link>
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
