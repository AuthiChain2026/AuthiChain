import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { AuthiChainThirdwebProvider } from "@/components/ThirdwebProvider"

export const metadata: Metadata = {
  title: "AuthiChain - Blockchain Product Authentication",
  description: "Verify product authenticity with AI-powered blockchain technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthiChainThirdwebProvider>
            {children}
            <Toaster />
            <Analytics />
          </AuthiChainThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
