import { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://authichain.com"
  const pages = [
    "/","/verify","/compliance","/eu-dpp","/collection","/demo-video",
    "/grants","/yc","/strainchain","/portal","/pricing","/enterprise",
    "/product-hunt","/api/v1/health",
  ]
  return pages.map(p=>({
    url:`${base}${p}`,
    lastModified:new Date("2026-04-08"),
    changeFrequency:"weekly" as const,
    priority: p==="/" ? 1.0 : p.includes("collection")||p.includes("demo") ? 0.9 : 0.7
  }))
}
