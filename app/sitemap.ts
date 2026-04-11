import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://authichain.com";
  const now = new Date();
  return [
    { url: base,                                                      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/demo-video`,                                      lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/collection`,                                      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/qron-reveal`,                                     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/automotive`,                                      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/grants`,                                          lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/yc`,                                              lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/strainchain`,                                     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/opensea`,                                         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/blog`,                                            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/blog/eu-digital-product-passport`,               lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog/blockchain-anti-counterfeiting`,            lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog/qron-ai-qr-code-art`,                      lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog/strainchain-cannabis-blockchain`,           lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog/automotive-blockchain-authentication`,      lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/blog/pharmaceutical-blockchain-dscsa`,          lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/product-hunt`,                                   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/portal`,                                         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compliance`,                                     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/verify`,                                         lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/pricing`,                                        lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/eu-dpp`,                                         lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/demo-video`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
