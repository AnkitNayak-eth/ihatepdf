export default function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "i hate pdf",
    "alternateName": ["ihatepdf", "I Hate PDF"],
    "url": "https://ihate-pdf.vercel.app",
    "description": "When you really hate PDFs. Free client-side tools to corrupt, ruin, inflate, and explode your PDF files.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ihate-pdf.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ihatepdf",
    "url": "https://ihate-pdf.vercel.app",
    "logo": "https://ihate-pdf.vercel.app/favicon.ico",
    "sameAs": [
      "https://github.com/AnkitNayak-eth/ihatepdf"
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "i hate pdf",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "The hostile productivity suite. Free client-side tools to corrupt, ruin, inflate, spoof, shuffle, and destroy your PDF files. 100% in-browser, no uploads.",
    "url": "https://ihate-pdf.vercel.app",
    "featureList": [
      "PDF Corruptor - Make PDFs unreadable",
      "Metadata Spoofer - Fake author and dates",
      "PDF Self Destruct - Set expiry dates",
      "Payload Inflator - Make PDFs absurdly large",
      "Copy Killer - Prevent text copying",
      "Secret Embedder - Hide messages in PDFs",
      "Page Shuffler - Randomize page order",
      "Dyslexia Inducer - Scramble text visually",
      "Laggy PDF - Make PDFs incredibly slow"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ihatepdf?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ihatepdf is a free, open-source hostile productivity suite that provides client-side tools to corrupt, ruin, inflate, and destroy PDF files. All processing happens in your browser — no files are ever uploaded to any server."
        }
      },
      {
        "@type": "Question",
        "name": "Is ihatepdf safe to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every tool runs 100% inside your browser using JavaScript. Your PDF files never leave your computer. Nothing is uploaded to any server. The source code is open on GitHub for full transparency."
        }
      },
      {
        "@type": "Question",
        "name": "How do I corrupt a PDF file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the PDF Corruptor tool on ihatepdf. Simply drag and drop your PDF file, and the tool will systematically destroy the document's internal structure while keeping the file size and extension intact. The result looks like a genuine, unexplainable tech glitch."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use ihatepdf to extend my deadline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ihatepdf provides tools like the PDF Corruptor (makes files unopenable) and Payload Inflator (makes files too large to upload) that can buy you extra time. The corrupted files produce error signatures identical to real computer problems."
        }
      },
      {
        "@type": "Question",
        "name": "Does ihatepdf upload my files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Every single tool on ihatepdf runs entirely in your browser. Your files are loaded into memory, modified locally, and returned as a download. Zero network requests are made with your file data."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
