import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Returns embeddable HTML/JS snippet for customers to paste on their sites
// Creates organic backlinks to authichain.com from every customer website
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brand = searchParams.get('brand') || 'Verified Product'
  const style = searchParams.get('style') || 'dark'
  const size = searchParams.get('size') || 'medium'
  const format = searchParams.get('format') || 'html' // html | markdown | bbcode

  const badgeUrl = `https://authichain.com/api/badge?brand=${encodeURIComponent(brand)}&style=${style}&size=${size}`
  const verifyUrl = `https://authichain.com/verify?ref=badge&brand=${encodeURIComponent(brand)}`

  if (format === 'markdown') {
    return NextResponse.json({
      embed: `[![Verified by AuthiChain](${badgeUrl})](${verifyUrl})`,
      format: 'markdown',
    })
  }

  const html = `<!-- AuthiChain Verification Badge -->
<a href="${verifyUrl}" target="_blank" rel="noopener" title="Verified by AuthiChain - Blockchain Product Authentication">
  <img src="${badgeUrl}" alt="Verified by AuthiChain" style="height:${size === 'small' ? '32' : size === 'large' ? '48' : '40'}px" />
</a>`

  return NextResponse.json({
    embed: html,
    badge_url: badgeUrl,
    verify_url: verifyUrl,
    instructions: 'Paste this HTML on your website to display the AuthiChain verification badge. The badge links to your verification page on authichain.com.',
  })
}
