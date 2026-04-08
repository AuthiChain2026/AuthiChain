import { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
  return {
    rules:[{userAgent:"*",allow:"/",disallow:["/api/private/","/dashboard/"]}],
    sitemap:"https://authichain.com/sitemap.xml"
  }
}
