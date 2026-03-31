import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Embeddable verification badge — generates SVG that customers embed on their sites
// Each badge links back to authichain.com, creating organic backlinks + traffic
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brand = searchParams.get('brand') || 'Verified'
  const style = searchParams.get('style') || 'dark' // dark | light | minimal
  const size = searchParams.get('size') || 'medium' // small | medium | large

  const sizes = { small: { w: 160, h: 32, fs: 10 }, medium: { w: 200, h: 40, fs: 12 }, large: { w: 260, h: 48, fs: 14 } }
  const s = sizes[size as keyof typeof sizes] || sizes.medium

  const styles = {
    dark: { bg: '#0f0f0f', border: '#a855f7', text: '#e2e8f0', accent: '#a855f7' },
    light: { bg: '#ffffff', border: '#7c3aed', text: '#1a1a2e', accent: '#7c3aed' },
    minimal: { bg: 'transparent', border: '#666', text: '#999', accent: '#a855f7' },
  }
  const c = styles[style as keyof typeof styles] || styles.dark

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#22d3ee"/>
    </linearGradient>
  </defs>
  <a href="https://authichain.com/verify?ref=badge&brand=${encodeURIComponent(brand)}" target="_blank">
    <rect width="${s.w}" height="${s.h}" rx="${s.h / 2}" fill="${c.bg}" stroke="${c.border}" stroke-width="1.5"/>
    <circle cx="${s.h / 2 + 4}" cy="${s.h / 2}" r="${s.h / 4}" fill="url(#g)"/>
    <text x="${s.h / 2 + 4}" y="${s.h / 2 + s.fs * 0.15}" text-anchor="middle" fill="white" font-size="${s.fs * 0.7}" font-weight="700" font-family="sans-serif">✓</text>
    <text x="${s.h + 4}" y="${s.h / 2 - 2}" fill="${c.text}" font-size="${s.fs}" font-weight="700" font-family="Inter,system-ui,sans-serif" dominant-baseline="auto">
      ${brand.length > 20 ? brand.slice(0, 20) + '…' : brand}
    </text>
    <text x="${s.h + 4}" y="${s.h / 2 + s.fs + 2}" fill="${c.accent}" font-size="${s.fs * 0.75}" font-family="Inter,system-ui,sans-serif" dominant-baseline="auto">
      Verified by AuthiChain
    </text>
  </a>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
