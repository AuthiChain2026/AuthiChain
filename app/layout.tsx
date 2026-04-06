import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthiChainThirdwebProvider } from "@/components/ThirdwebProvider"

export const metadata: Metadata = {
  title: {
    default: "AuthiChain - AI-Powered Blockchain Product Authentication",
    template: "%s | AuthiChain",
  },
  description: "Stop counterfeits. AuthiChain uses AI classification and blockchain verification to authenticate products across luxury, pharma, fashion, and 10+ industries. Trusted by enterprise brands.",
  keywords: ["product authentication", "anti-counterfeiting", "blockchain verification", "supply chain security", "AI product classification", "luxury authentication", "pharmaceutical tracking", "brand protection"],
  metadataBase: new URL("https://authichain.com"),
  openGraph: {
    title: "AuthiChain - AI-Powered Blockchain Product Authentication",
    description: "Stop counterfeits with AI + blockchain. Authenticate products across luxury, pharma, fashion & more.",
    url: "https://authichain.com",
    siteName: "AuthiChain",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AuthiChain — AI-Powered Blockchain Product Authentication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuthiChain - AI-Powered Product Authentication",
    description: "Stop counterfeits with AI + blockchain. Trusted by enterprise brands.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/icon-512.png" },
    ],
  },
  verification: { google: 'cu9x2r43csh8lpqxm5YsxTvNAI2EVqkXIq65RYrj0vk' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://authichain.com" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AuthiChain",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: "AI-powered blockchain product authentication platform. Verify product authenticity across luxury, pharma, fashion, and 10+ industries.",
              url: "https://authichain.com",
              offers: [
                { "@type": "Offer", name: "Starter", price: "299", priceCurrency: "USD", description: "Up to 1,000 products/month" },
                { "@type": "Offer", name: "Pro", price: "799", priceCurrency: "USD", description: "Up to 50,000 products/month" },
              ],
              publisher: {
                "@type": "Organization",
                name: "AuthiChain, Inc.",
                url: "https://authichain.com",
                sameAs: ["https://qron.space"],
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthiChainThirdwebProvider>
            <nav className="w-full px-6 py-4 border-b border-neutral-800 flex gap-6">
          <a href="/" className="hover:opacity-80">Home</a>
          <a href="/storymode" className="hover:opacity-80">Storymode</a>
        </nav>
        {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </AuthiChainThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
