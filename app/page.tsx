"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Scan, Lock, TrendingUp, CheckCircle, Sparkles, Globe, Mail, ArrowRight, Zap, Award } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LeadCapturePopup } from "@/components/LeadCapturePopup"
import { DemoBooker } from "@/components/DemoBooker"

export default function Home() {
  return (
    <div className="min-h-screen protocol-bg">
      {/* Navigation */}
      <nav className="border-b border-[rgba(201,162,39,0.15)] sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227] to-[#A07D10] flex items-center justify-center glow-gold-sm">
              <Shield className="h-4 w-4 text-black" />
            </div>
            <span className="text-2xl font-bold gradient-text">AuthiChain</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/demos" className="hidden sm:block text-sm text-muted-foreground hover:text-[#e8c547] transition-colors">Demos</Link>
            <Link href="/pricing" className="hidden sm:block text-sm text-muted-foreground hover:text-[#e8c547] transition-colors">Pricing</Link>
            <Link href="/login"><Button variant="ghost" className="hover:text-[#e8c547]">Login</Button></Link>
            <Link href="/signup"><Button className="btn-gold rounded-lg px-5">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="protocol-badge">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI AutoFlow™ — Instant Product Classification</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">AI AutoFlow™</span>{" "}
              <span className="text-foreground">Authentication for Any Product</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Automatically classifies products across 10 industries and generates blockchain-backed
              authentication workflows in under 3 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="btn-gold w-full sm:w-auto rounded-xl px-8 font-bold">
                  Start Certification <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demos">
                <Button size="lg" className="btn-outline-gold w-full sm:w-auto rounded-xl px-8">See Use Case Demos</Button>
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-2">
              {[
                { stat: "10",   label: "Industries" },
                { stat: "$14T+",label: "Market" },
                { stat: "98%",  label: "AI Accuracy" },
                { stat: "<3s",  label: "Speed" },
              ].map(({ stat, label }) => (
                <div key={label} className="gold-card p-3 text-center">
                  <div className="text-xl font-bold gradient-text">{stat}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-[-20%] rounded-full glow-gold opacity-20 blur-3xl pointer-events-none" />
              <Image
                src="/images/hero-shield.png"
                alt="AuthiChain blockchain authentication shield"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl relative z-10 animate-float"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industries Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl protocol-card">
          <Image
            src="/images/industries-banner.png"
            alt="10 Industries served by AuthiChain Protocol"
            width={1200}
            height={150}
            className="w-full h-auto"
          />
        </div>
      </section>

      <div className="gold-divider mx-auto max-w-6xl px-4" />

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="protocol-badge mb-4 inline-flex"><Shield className="h-3.5 w-3.5" /> Enterprise Authentication</div>
          <h2 className="text-4xl font-bold mb-4 mt-4">Why Choose <span className="gradient-text">AuthiChain</span>?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Enterprise-grade blockchain authentication trusted by brands across 10 industries</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: <Sparkles className="h-6 w-6 text-black" />, iconClass: "bg-gradient-to-br from-[#C9A227] to-[#A07D10] glow-gold-sm", title: "AI AutoFlow™ Engine", desc: "Automatically classifies products across 10 industries and generates custom authentication workflows in under 3 seconds." },
            { icon: <Globe className="h-6 w-6 text-[#c9a227]" />, iconClass: "border border-[rgba(201,162,39,0.3)]", title: "Universal Platform", desc: "One platform for all industries: Cannabis, Luxury, Electronics, Pharma, Fashion, Automotive, Food, Art, Cosmetics, and Sports." },
            { icon: <Lock className="h-6 w-6 text-[#c9a227]" />, iconClass: "border border-[rgba(201,162,39,0.3)]", title: "Blockchain Security", desc: "Immutable records on the blockchain ensure your products can't be counterfeited or tampered with." },
            { icon: <Scan className="h-6 w-6 text-[#c9a227]" />, iconClass: "border border-[rgba(201,162,39,0.3)]", title: "TrueMark™ Technology", desc: "Unique microscopic patterns verified through our proprietary scanning technology." },
            { icon: <Zap className="h-6 w-6 text-[#c9a227]" />, iconClass: "border border-[rgba(201,162,39,0.3)]", title: "Instant Verification", desc: "Anyone can verify product authenticity in seconds using just a TrueMark™ ID." },
            { icon: <TrendingUp className="h-6 w-6 text-[#c9a227]" />, iconClass: "border border-[rgba(201,162,39,0.3)]", title: "Analytics Dashboard", desc: "Track verification scans, monitor your products, and gain insights into your supply chain." },
          ].map(({ icon, iconClass, title, desc }) => (
            <div key={title} className="protocol-card p-7 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>{icon}</div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="protocol-badge mb-4 inline-flex"><CheckCircle className="h-3.5 w-3.5" /> Simple Process</div>
          <h2 className="text-4xl font-bold mb-4 mt-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-xl text-muted-foreground">Three simple steps to protect your products</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="protocol-card p-2">
            <Image src="/images/how-it-works.png" alt="How AuthiChain works" width={900} height={280} className="w-full h-auto rounded-xl" />
          </div>
        </div>
      </section>

      <div className="gold-divider mx-auto max-w-6xl px-4" />

      {/* QRON Ecosystem */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto protocol-card p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="protocol-badge mb-4">AuthiChain Ecosystem</div>
            <h2 className="text-3xl font-bold mb-3 mt-4">Create Verified <span className="gradient-text">QRON Art</span></h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">QRON Space generates cryptographically signed QR art via Ed25519 — every scan verifies back to the AuthiChain Protocol.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://qron.space" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold w-full sm:w-auto rounded-xl px-6 font-bold">Generate a QRON →</Button>
              </a>
              <Link href="/qron"><Button className="btn-outline-gold w-full sm:w-auto rounded-xl px-6">View Gallery</Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { stat: "Ed25519", label: "Cryptographic Signing" },
              { stat: "99.7%",  label: "Verification Accuracy" },
              { stat: "~25%",   label: "Scan Lift vs Standard QR" },
              { stat: "Live",   label: "On-Chain Verification" },
            ].map(({ stat, label }) => (
              <div key={label} className="gold-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{stat}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture + Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inline Lead Capture */}
          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-purple-500" />
              <h3 className="text-xl font-bold">Try AuthiChain Free</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Authenticate your first product with AI AutoFlow™ — no credit card required.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const formData = new FormData(form)
                fetch('/api/leads/capture', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: formData.get('email'),
                    name: formData.get('name'),
                    company: formData.get('company'),
                    source: 'inline',
                    product_interest: 'authichain',
                    page_url: '/',
                  }),
                }).then(() => {
                  fetch('/api/leads/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: formData.get('email'),
                      name: formData.get('name'),
                      company: formData.get('company'),
                      source: 'inline',
                      product_interest: 'authichain',
                    }),
                  }).catch(() => {})
                  form.reset()
                  alert('Check your email! Your free demo access is on the way.')
                }).catch(() => {})
              }}
              className="space-y-3"
            >
              <input name="email" type="email" required placeholder="Work email" className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input name="name" type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input name="company" type="text" placeholder="Company" className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <Button type="submit" variant="gradient" className="w-full">
                Get Free Access <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Demo Booker */}
          <DemoBooker />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto protocol-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 rounded-[1rem] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.12) 0%, transparent 70%)" }} />
          <div className="relative z-10 space-y-6">
            <div className="protocol-badge inline-flex"><Award className="h-3.5 w-3.5" /> Enterprise Ready</div>
            <h2 className="text-4xl font-bold mt-4">Ready to <span className="gradient-text">Protect Your Products?</span></h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Brands in luxury, pharma, cannabis, and electronics rely on AuthiChain for blockchain-grade authentication.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/onboarding"><Button size="lg" className="btn-gold rounded-xl px-8 font-bold">Start Certification <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link href="/signup"><Button size="lg" className="btn-outline-gold rounded-xl px-8">View Plans</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Popup */}
      <LeadCapturePopup />

      {/* Footer */}
      <footer className="border-t border-[rgba(201,162,39,0.12)] mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A227] to-[#A07D10] flex items-center justify-center">
                <Shield className="h-3 w-3 text-black" />
              </div>
              <span className="text-lg font-bold gradient-text">AuthiChain</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap justify-center">
              {[
                { href: "/verify",  label: "Verify Product" },
                { href: "/demo",    label: "Live Demo" },
                { href: "/pricing", label: "Pricing" },
                { href: "/qron",    label: "QRON Gallery" },
                { href: "/login",   label: "Login" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="hover:text-[#e8c547] transition-colors">{label}</Link>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">© 2026 AuthiChain. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
