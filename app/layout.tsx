import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://authichain.com"),
  title: {
    default: "AuthiChain — Blockchain Product Authentication in 2.1 Seconds",
    template: "%s | AuthiChain",
  },
  description: "Cryptographic provenance for every physical product. ERC-721 NFT + QRON AI QR code + 2.1 second verification. The truth layer for the physical world. EU DPP compliant.",
  keywords: ["blockchain authentication","product authentication","anti-counterfeiting","QR code verification","NFT supply chain","StrainChain","QRON","EU Digital Product Passport","DPP compliance","polygon blockchain"],
  authors: [{ name: "Zachary Kietzman", url: "https://authichain.com" }],
  creator: "AuthiChain",
  publisher: "AuthiChain, Inc.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: { canonical: "https://authichain.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://authichain.com",
    siteName: "AuthiChain",
    title: "AuthiChain — Blockchain Product Authentication",
    description: "The truth layer for the physical world. ERC-721 NFT + AI QR + 2.1s verification. $0.004/seal. No hardware.",
    images: [{ url: "https://authichain.com/og-image.png", width: 1200, height: 630, alt: "AuthiChain — Blockchain Product Authentication" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@authichain",
    creator: "@authichain",
    title: "AuthiChain — Blockchain Product Authentication",
    description: "$500B counterfeiting problem. $0.004 solution. Blockchain NFT + AI QR + 2.1s verification.",
    images: ["https://authichain.com/og-image.png"],
  },
  verification: {
    google: "authichain-google-verify-2026",
    other: { "msvalidate.01": "authichain-bing-verify-2026" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://authichain.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AuthiChain",
            url: "https://authichain.com",
            logo: "https://authichain.com/og-image.png",
            description: "Blockchain product authentication. ERC-721 NFT + AI QR code + 2.1 second verification.",
            foundingDate: "2025",
            founder: { "@type": "Person", name: "Zachary Kietzman" },
            contactPoint: { "@type": "ContactPoint", email: "z@authichain.com", contactType: "founder" },
            sameAs: ["https://qron.space","https://strainchain.io"],
            offers: {
              "@type": "Offer",
              name: "Product Authentication API",
              price: "0.004",
              priceCurrency: "USD",
              description: "Blockchain NFT certificate per product batch",
            }
          }) }}
        />
      </head>
      <body><Web3Provider>{children}</Web3Provider></body>
    </html>
  );
}
