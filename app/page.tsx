"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Scan, Lock, TrendingUp, CheckCircle, Sparkles, Globe } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AuthiChain</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI AutoFlow™ — Instant Product Classification</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">AI AutoFlow™</span>{" "}
              Authentication for Any Product
            </h1>
            <p className="text-xl text-muted-foreground">
              Automatically classifies products across 10 industries and generates blockchain-backed authentication workflows in under 3 seconds. From cannabis to luxury goods, electronics to pharmaceuticals—one platform for everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding">
                <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                  Start Certification
                </Button>
              </Link>
              <Link href="/verify">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Verify a Product
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <div className="text-3xl font-bold gradient-text">10</div>
                <div className="text-xs text-muted-foreground">Industries</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">$14T+</div>
                <div className="text-xs text-muted-foreground">Market</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">98%</div>
                <div className="text-xs text-muted-foreground">AI Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">&lt;3s</div>
                <div className="text-xs text-muted-foreground">Time</div>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <Image
                src="/images/hero-shield.svg"
                alt="AuthiChain blockchain authentication shield"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industries Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-xl">
          <Image
            src="/images/industries-banner.svg"
            alt="Industries covered: Cannabis, Luxury, Electronics, Pharma, Fashion, Automotive, Food, Art, Cosmetics"
            width={1000}
            height={120}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">AuthiChain</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade blockchain authentication trusted by brands protecting products across 10 industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 border-purple-500/20 hover:border-purple-500 transition-colors bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-500 mb-4" />
              <CardTitle>AI AutoFlow™ Engine</CardTitle>
              <CardDescription>
                Automatically classifies products across 10 industries and generates custom authentication workflows in under 3 seconds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Universal Platform</CardTitle>
              <CardDescription>
                One platform for all industries: Cannabis, Luxury, Electronics, Pharma, Fashion, Automotive, Food, Art, Cosmetics, and Sports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Lock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Blockchain Security</CardTitle>
              <CardDescription>
                Immutable records on the blockchain ensure your products can't be
                counterfeited or tampered with
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Scan className="h-12 w-12 text-primary mb-4" />
              <CardTitle>TrueMark™ Technology</CardTitle>
              <CardDescription>
                Unique microscopic patterns verified through our proprietary
                scanning technology
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Instant Verification</CardTitle>
              <CardDescription>
                Anyone can verify product authenticity in seconds using just a
                TrueMark™ ID
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track verification scans, monitor your products, and gain insights
                into your supply chain
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Simple API and SDK for seamless integration into your existing
                systems
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to protect your products
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Image
            src="/images/how-it-works.svg"
            alt="How AuthiChain works: Upload Product → Blockchain Register → Verify Anywhere"
            width={900}
            height={280}
            className="w-full h-auto rounded-xl"
          />
        </div>
      </section>

      {/* QRON Ecosystem Callout */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-500/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
              AuthiChain Ecosystem
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Create Verified <span className="gradient-text">QRON Art</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              QRON Space generates cryptographically signed QR art via Ed25519 — every scan verifies back to the AuthiChain Protocol. The creative entry point to enterprise authentication.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://qron.space" target="_blank" rel="noopener noreferrer">
                <Button variant="gradient" className="w-full sm:w-auto">
                  Generate a QRON →
                </Button>
              </a>
              <Link href="/qron">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card border p-4 text-center">
              <div className="text-2xl font-bold gradient-text">Ed25519</div>
              <div className="text-xs text-muted-foreground mt-1">Cryptographic Signing</div>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <div className="text-2xl font-bold gradient-text">99.7%</div>
              <div className="text-xs text-muted-foreground mt-1">Verification Accuracy</div>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <div className="text-2xl font-bold gradient-text">~25%</div>
              <div className="text-xs text-muted-foreground mt-1">Scan Lift vs Standard QR</div>
            </div>
            <div className="rounded-xl bg-card border p-4 text-center">
              <div className="text-2xl font-bold gradient-text">Live</div>
              <div className="text-xs text-muted-foreground mt-1">On-Chain Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 p-12 rounded-3xl gradient-primary">
          <h2 className="text-4xl font-bold text-white">
            Ready to Protect Your Products?
          </h2>
          <p className="text-xl text-white/90">
            Brands in luxury, pharma, cannabis, and electronics rely on AuthiChain for blockchain-grade authentication. Start with a free product registration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="font-semibold">
                Start Certification
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="font-semibold border-white/40 text-white hover:bg-white/10">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">AuthiChain</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/verify" className="hover:text-foreground transition-colors">Verify Product</Link>
              <Link href="/demo" className="hover:text-foreground transition-colors">Live Demo</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/qron" className="hover:text-foreground transition-colors">QRON Gallery</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © 2026 AuthiChain. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
