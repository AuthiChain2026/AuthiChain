"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles, Lock, Eye, Palette, Building2, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// ────────────────────────────────────────────────────────────
// GALLERY DATA
// Images live in /public/images/qron/. Items with an `image`
// field render real artwork; items without fall back to a
// gradient placeholder.
// ────────────────────────────────────────────────────────────

const galleryItems = [
  {
    id: "guardian",
    title: "The Guardian",
    style: "Watercolor Wildlife",
    description:
      "A fierce leopard portrait seamlessly woven into a scannable QR matrix. Gold, purple, and black ink strokes dissolve into data modules — every brushstroke is a verifiable pixel.",
    image: "/images/qron/guardian.png",
    gradient: "from-amber-600 via-purple-700 to-stone-900",
    tags: ["Wildlife", "Watercolor", "Ed25519 Signed"],
    icon: Eye,
  },
  {
    id: "citadel",
    title: "The Citadel",
    style: "3D Architecture",
    description:
      "A tilt-shift miniature cityscape built entirely from QR modules. Towers, domes, and gardens rise from the code — scan it and the city tells its provenance story.",
    image: "/images/qron/citadel.png",
    gradient: "from-stone-400 via-emerald-600 to-sky-400",
    tags: ["3D", "Architecture", "Tilt-Shift"],
    icon: Building2,
  },
  {
    id: "persona",
    title: "Persona",
    style: "Pop-Art Portrait",
    description:
      "Surrealist pop-art face decomposed into QR geometry. Every color block is a data module; the portrait remains scannable from any angle. Art meets authentication.",
    image: "/images/qron/persona.png",
    gradient: "from-pink-500 via-cyan-400 to-yellow-400",
    tags: ["Pop-Art", "Portrait", "Colorful"],
    icon: Palette,
  },
  {
    id: "sentinel",
    title: "Sentinel",
    style: "Cyberpunk Character",
    description:
      "A hooded figure walks through a QR-encoded world. Glowing eyes, modular armor, and scattered data fragments — the code is the character, the character is the code.",
    image: "/images/qron/sentinel.png",
    gradient: "from-red-600 via-slate-300 to-pink-500",
    tags: ["Cyberpunk", "Character", "Futuristic"],
    icon: Zap,
  },
  {
    id: "aegis",
    title: "Aegis Shield",
    style: "Brand Emblem",
    description:
      "The AuthiChain shield rendered in gold and steel, QR matrix etched across its face. A blockchain-grade seal of authenticity — scan to verify, impossible to forge.",
    gradient: "from-amber-400 via-amber-600 to-stone-800",
    tags: ["Brand", "Shield", "Gold"],
    icon: Shield,
  },
  {
    id: "bloom",
    title: "Bloom",
    style: "Botanical Fusion",
    description:
      "Flowers and foliage grow through a living QR code, petals replacing rigid squares. Organic yet perfectly scannable — proof that nature and data can coexist.",
    gradient: "from-green-500 via-lime-400 to-emerald-700",
    tags: ["Botanical", "Organic", "AI-Generated"],
    icon: Sparkles,
  },
]

const stats = [
  { label: "Cryptographic Signing", value: "Ed25519" },
  { label: "Verification Accuracy", value: "99.7%" },
  { label: "Scan Lift vs Plain QR", value: "~25%" },
  { label: "Generation Time", value: "<4s" },
]

export default function QronGalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AuthiChain</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/verify">
              <Button variant="ghost">Verify</Button>
            </Link>
            <a href="https://qron.space" target="_blank" rel="noopener noreferrer">
              <Button variant="gradient">Generate QRON</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          QRON Art Gallery
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Scannable Art.{" "}
          <span className="gradient-text">Cryptographically Verified.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Every QRON is an AI-generated artwork fused with a functional QR code,
          signed with Ed25519 cryptography, and verifiable on the AuthiChain
          Protocol. Art that proves itself.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card border p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How QRON Works */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Describe Your Vision",
              desc: "Enter a text prompt — landscape, portrait, brand emblem, abstract — anything you can imagine.",
            },
            {
              step: "02",
              title: "AI Fuses Art + QR",
              desc: "Stable Diffusion + ControlNet merge your artwork with a scannable QR matrix in under 4 seconds.",
            },
            {
              step: "03",
              title: "Signed & Verified",
              desc: "Ed25519 signature is embedded on-chain via the AuthiChain Protocol. Every scan proves authenticity.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-xl border bg-card p-6 text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-2">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Featured <span className="gradient-text">QRON Styles</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each piece is a fully functional, scannable QR code. The art doesn't
            hide the code — the art <em>is</em> the code.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.id}
                className="group overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300"
              >
                {/* Art Preview — real image or gradient fallback */}
                <div className="relative aspect-square overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.title} — ${item.style} QRON art`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                    >
                      {/* QR grid overlay */}
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,.12) 18px, rgba(255,255,255,.12) 20px), repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,.12) 18px, rgba(255,255,255,.12) 20px)",
                        }}
                      />
                      <Icon className="h-16 w-16 text-white/60 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Lock badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 z-10">
                    <Lock className="h-3 w-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400 font-semibold">
                      SIGNED
                    </span>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/40 text-primary"
                    >
                      {item.style}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Art Styles Explainer */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto rounded-2xl border bg-card p-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Makes <span className="gradient-text">QRON Art</span> Different?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">vs. Plain QR Codes</h3>
              <p className="text-sm text-muted-foreground">
                Standard QR codes are black-and-white grids nobody wants to scan.
                QRONs embed the data matrix into AI-generated artwork — increasing
                scan rates by ~25% while maintaining 99.7% decode accuracy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">vs. Other QR Art Generators</h3>
              <p className="text-sm text-muted-foreground">
                Tools like Quick QR Art and QR Diffusion generate beautiful codes,
                but they aren't signed. QRONs are cryptographically signed with
                Ed25519 and verified on-chain — the art proves its own provenance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">The Technology</h3>
              <p className="text-sm text-muted-foreground">
                Stable Diffusion + ControlNet fuse your text prompt with a QR
                matrix. The result is an artwork where the visual composition
                follows the QR structure — no post-processing overlay, no
                stickers. The image <em>is</em> the code.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Use Cases</h3>
              <p className="text-sm text-muted-foreground">
                Product packaging, event tickets, digital collectibles, brand
                campaigns, museum exhibits, and luxury authentication. Anywhere a
                QR code exists, a QRON makes it memorable and verifiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6 p-12 rounded-3xl gradient-primary">
          <h2 className="text-4xl font-bold text-white">
            Create Your First QRON
          </h2>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            10 free generations. No credit card. Every QRON is Ed25519-signed and
            verifiable on the AuthiChain Protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://qron.space" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="font-semibold">
                Generate on QRON Space
              </Button>
            </a>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold border-white/40 text-white hover:bg-white/10"
              >
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">AuthiChain</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/verify" className="hover:text-foreground transition-colors">Verify</Link>
              <Link href="/demo" className="hover:text-foreground transition-colors">Live Demo</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <a href="https://qron.space" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">QRON Space</a>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              &copy; 2026 AuthiChain. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
