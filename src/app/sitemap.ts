import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ihate-pdf.vercel.app';
  
  const tools = [
    'corruptor',
    'spoofer',
    'timebomb',
    'inflator',
    'copykiller',
    'steganography',
    'shuffler',
    'dyslexia',
    'scrollchoker'
  ];

  const blogPosts = [
    'why-i-hate-pdf',
    'how-to-corrupt-a-pdf',
    'pdf-vs-the-world',
  ];

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolRoutes,
    ...blogRoutes,
  ];
}
