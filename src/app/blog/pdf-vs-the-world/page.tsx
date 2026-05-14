import type { Metadata } from 'next';
import Link from 'next/link';
import ShapeGrid from '@/components/ShapeGrid';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "PDF vs Every Other Format: Why PDF Always Loses",
  description: "Comparing PDF to HTML, DOCX, Markdown, and EPUB. Why PDF is a relic from 1993 that refuses to die, and why modern alternatives are better in every way.",
  keywords: ["pdf vs docx", "pdf vs html", "why pdf is bad", "pdf alternatives", "pdf problems", "i hate pdf", "worst file format"],
  openGraph: {
    title: "PDF vs Every Other Format — i hate pdf",
    description: "PDF was invented in 1993. It hasn't meaningfully improved since. Here's why every modern alternative is better.",
    url: "https://ihate-pdf.vercel.app/blog/pdf-vs-the-world",
  },
};

export default function PdfVsTheWorld() {
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
              <time dateTime="2026-05-05">May 5, 2026</time>
              <span>·</span>
              <span>7 min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">PDF vs Every Other Format: Why PDF Always Loses</h1>
            <p className="text-xl text-zinc-400 leading-relaxed">PDF was invented in 1993. It hasn&apos;t meaningfully improved since. Here&apos;s why every modern alternative is better.</p>
          </header>
          <div className="prose prose-invert prose-zinc max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">PDF: A File Format Frozen in Time</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">The Portable Document Format was created by Adobe in 1993. Bill Clinton was president. The web had just been born. Smartphones didn&apos;t exist. And yet, in 2026, we&apos;re still using this format for everything from tax forms to university assignments.</p>
              <p className="text-zinc-300 leading-relaxed">The PDF specification has grown from 200 pages to over 1,000 pages of arcane rules, but the core philosophy hasn&apos;t changed: a PDF is a frozen snapshot of a printed page. This is precisely why people <strong className="text-white">hate PDF</strong>.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">PDF vs HTML</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">HTML is responsive by default. It reflows text to fit any screen. It supports accessibility features, search indexing, and dynamic content. A web page looks perfect on a phone, a tablet, and a 4K monitor.</p>
              <p className="text-zinc-300 leading-relaxed">PDF does none of this. A PDF designed for A4 paper will always be an A4 page, whether you&apos;re viewing it on a 27-inch monitor or a 5-inch phone. The &ldquo;portable&rdquo; in PDF is a cruel joke.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">PDF vs DOCX</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">DOCX files are editable. You can change text, add comments, track changes, and collaborate in real-time via Google Docs or Microsoft 365. A DOCX is a living document.</p>
              <p className="text-zinc-300 leading-relaxed">A PDF is a dead document. Once exported, it resists all modification. Adobe charges $240/year for the privilege of editing PDFs poorly. Everyone else is stuck with the content exactly as it was exported.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">PDF vs Markdown</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">Markdown is plain text with formatting. It&apos;s readable without any special software. It converts to HTML, PDF, DOCX, or anything else. It&apos;s version-controllable with Git. It&apos;s the format of choice for developers, technical writers, and anyone who values simplicity.</p>
              <p className="text-zinc-300 leading-relaxed">PDF is the opposite of simplicity. The internal format is so complex that there are fewer than ten PDF rendering engines in existence, and none of them agree on how to render edge cases.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why PDF Refuses to Die</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">Despite being worse than every modern alternative, PDF persists for one reason: institutional inertia. Governments use PDF because they always have. Universities use PDF because professors don&apos;t know the alternatives. Corporations use PDF because their legal departments insist on it.</p>
              <p className="text-zinc-300 leading-relaxed mb-4">PDF has become the digital equivalent of a fax machine — nobody likes it, nobody defends it, but everyone still uses it because &ldquo;that&apos;s just how things work.&rdquo;</p>
              <p className="text-zinc-300 leading-relaxed">Until the world moves on, tools like <Link href="/" className="text-brand hover:underline">ihatepdf</Link> exist for those of us who refuse to suffer in silence. If we can&apos;t kill the format, we can at least have fun destroying individual files.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Scoreboard</h2>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 pr-4 text-white font-bold">Feature</th>
                      <th className="py-3 px-4 text-brand font-bold">PDF</th>
                      <th className="py-3 px-4 text-green-400 font-bold">HTML</th>
                      <th className="py-3 px-4 text-blue-400 font-bold">DOCX</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    <tr className="border-b border-white/5"><td className="py-2 pr-4">Mobile friendly</td><td className="py-2 px-4 text-brand">No</td><td className="py-2 px-4 text-green-400">Yes</td><td className="py-2 px-4 text-blue-400">Yes</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 pr-4">Editable</td><td className="py-2 px-4 text-brand">$240/yr</td><td className="py-2 px-4 text-green-400">Free</td><td className="py-2 px-4 text-blue-400">Free</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 pr-4">Accessible</td><td className="py-2 px-4 text-brand">Poorly</td><td className="py-2 px-4 text-green-400">Excellent</td><td className="py-2 px-4 text-blue-400">Good</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 pr-4">Searchable</td><td className="py-2 px-4 text-brand">Sometimes</td><td className="py-2 px-4 text-green-400">Always</td><td className="py-2 px-4 text-blue-400">Always</td></tr>
                    <tr><td className="py-2 pr-4">Responsive</td><td className="py-2 px-4 text-brand">Never</td><td className="py-2 px-4 text-green-400">Always</td><td className="py-2 px-4 text-blue-400">Varies</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-zinc-500 text-sm">Had enough of PDFs? <Link href="/" className="text-brand hover:underline">Destroy one with our free tools →</Link></p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
