import type { MetadataRoute } from 'next'

const BASE = 'https://authichain.com'

const industries = [
  'luxury-goods', 'pharmaceuticals', 'fashion-apparel', 'electronics',
  'automotive-parts', 'food-beverage', 'cosmetics', 'wine-spirits',
  'cannabis', 'sneakers-streetwear',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/enterprise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/solutions/eu-digital-product-passport`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/demos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demos/fashion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demos/luxury-watch`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demos/pharma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demos/supply-chain`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/verify`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/qron`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/storymode`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  const industryPages: MetadataRoute.Sitemap = industries.map(industry => ({
    url: `${BASE}/solutions/${industry}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...industryPages]
}
