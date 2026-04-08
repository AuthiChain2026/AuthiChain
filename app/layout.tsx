import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "AuthiChain — Blockchain Product Authentication",
    template: "%s | AuthiChain"
  },
  description: "Cryptographic provenance for every physical product. ERC-721 NFT on Polygon + AI QR code + 2.1 second smartphone verification. The truth layer for the physical world.",
  keywords: ["blockchain","product authentication","NFT","QR code","supply chain","EU DPP","counterfeit"],
  authors: [{ name: "Zachary Kietzman", url: "https://authichain.com" }],
  creator: "AuthiChain, Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://authichain.com",
    siteName: "AuthiChain",
    title: "AuthiChain — Blockchain Product Authentication",
    description: "The truth layer for every physical product. Blockchain NFT + AI QR + 2.1s verification.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuthiChain — Blockchain Product Authentication",
    description: "Scan any QR code. Know it's real in 2.1 seconds. No app. No hardware. $0.004/seal.",
    creator: "@authichain",
  },
  robots: "index, follow",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://authichain.com" />
        <meta name="theme-color" content="#c9a227" />
      </head>
      <body>{children}</body>
    </html>
  )
}
