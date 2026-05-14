import type { Metadata } from 'next';
import Link from 'next/link';
import ShapeGrid from '@/components/ShapeGrid';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Blog — Why Everyone Hates PDFs",
  description: "Articles, guides, and rants about why PDFs are terrible. Learn how to corrupt, ruin, and destroy PDF files. The ihatepdf blog.",
  keywords: ["i hate pdf", "why pdfs are bad", "pdf problems", "corrupt pdf", "pdf blog", "ihatepdf blog"],
  openGraph: {
    title: "Blog — i hate pdf",
    description: "Articles and guides about why PDFs are the worst file format ever invented.",
    url: "https://ihate-pdf.vercel.app/blog",
  },
};

const posts = [
  {
    slug: 'why-i-hate-pdf',
    title: 'Why I Hate PDF — And You Should Too',
    excerpt: 'PDF was supposed to be a universal document format. Instead, it became the most frustrating file format in computing history. Here\'s everything wrong with it.',
    date: '2026-05-10',
    readTime: '8 min',
  },
  {
    slug: 'how-to-corrupt-a-pdf',
    title: 'How to Corrupt a PDF File (And Why You Might Need To)',
    excerpt: 'Sometimes you need a corrupted PDF. Whether it\'s a deadline extension or a bureaucratic dodge, here\'s how document corruption actually works at the binary level.',
    date: '2026-05-08',
    readTime: '6 min',
  },
  {
    slug: 'pdf-vs-the-world',
    title: 'PDF vs Every Other Format: Why PDF Always Loses',
    excerpt: 'Comparing PDF to modern alternatives like HTML, DOCX, and Markdown. Spoiler: PDF is a relic from 1993 that refuses to die.',
    date: '2026-05-05',
    readTime: '7 min',
  },
];

export default function BlogPage() {
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
        <div className="w-full max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand/20 p-2 rounded-lg text-brand">
                <BookOpen size={20} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
                The Blog
              </h1>
            </div>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Rants, guides, and technical deep-dives about why PDF is the worst file format ever invented — and what you can do about it.
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:bg-white/10 hover:border-brand/20 transition-all duration-300">
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                    <span>·</span>
                    <span>{post.readTime} read</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-brand text-sm font-medium">
                    Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
