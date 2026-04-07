"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles, Lock, Eye, Palette, Building2, Zap, Car, Leaf, Coffee, Trophy, Rocket, Globe, Cpu, Film, QrCode, ArrowRight, ChevronDown, Fingerprint, ScanLine } from "lucide-react"
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
    image: "/images/qron/aegis.png",
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
    image: "/images/qron/bloom.png",
    gradient: "from-green-500 via-lime-400 to-emerald-700",
    tags: ["Botanical", "Organic", "AI-Generated"],
    icon: Sparkles,
  },
  {
    id: "velocity",
    title: "Velocity",
    style: "Automotive Lightning",
    description:
      "A supercar tears through a QR-encoded storm of purple lightning. Speed and data collide — scan the code to verify the vehicle's provenance chain.",
    image: "/images/qron/velocity.png",
    gradient: "from-blue-600 via-purple-500 to-indigo-900",
    tags: ["Automotive", "Lightning", "Dynamic"],
    icon: Car,
  },
  {
    id: "canopy",
    title: "Canopy",
    style: "Cannabis Botanical",
    description:
      "Lush cannabis trichomes emerge from QR data modules in a macro-lens fusion. Every leaf is a verifiable pixel — seed-to-sale traceability meets living art.",
    image: "/images/qron/canopy.png",
    gradient: "from-green-400 via-emerald-500 to-green-800",
    tags: ["Cannabis", "Botanical", "Traceability"],
    icon: Leaf,
  },
  {
    id: "palazzo",
    title: "Palazzo",
    style: "Luxury Marble & Gold",
    description:
      "Black marble and gold leaf form a QR mosaic fit for a Renaissance palace. Art deco elegance meets blockchain authentication — luxury brands, verified.",
    image: "/images/qron/palazzo.png",
    gradient: "from-amber-300 via-stone-800 to-amber-500",
    tags: ["Luxury", "Gold", "Marble"],
    icon: Globe,
  },
  {
    id: "roast",
    title: "Roast",
    style: "Coffee Origin Art",
    description:
      "Coffee beans scatter across a tilt-shift QR code, each module a roasted pixel. Scan to trace origin, altitude, and roast profile — farm-to-cup verified.",
    image: "/images/qron/roast.png",
    gradient: "from-amber-800 via-stone-600 to-amber-900",
    tags: ["Food", "Coffee", "Origin Trace"],
    icon: Coffee,
  },
  {
    id: "arena",
    title: "Arena",
    style: "Sports Action",
    description:
      "Athletes burst through a QR-encoded field, every pixel a data module in motion. Scan to verify ticket authenticity, merchandise provenance, or memorabilia.",
    image: "/images/qron/arena.png",
    gradient: "from-pink-500 via-blue-600 to-yellow-400",
    tags: ["Sports", "Action", "Tickets"],
    icon: Trophy,
  },
  {
    id: "launchpad",
    title: "Launchpad",
    style: "Aerospace Poster",
    description:
      "A rocket lifts off through a QR-encoded sky, data modules forming clouds and exhaust plumes. Scan to authenticate aerospace-grade components and mission logs.",
    image: "/images/qron/launchpad.png",
    gradient: "from-orange-400 via-teal-500 to-sky-600",
    tags: ["Aerospace", "Retro", "Mission"],
    icon: Rocket,
  },
  {
    id: "nexus",
    title: "Nexus",
    style: "Cyberpunk Circuit",
    description:
      "Neon pink and cyan circuit boards form a glowing QR matrix. Every connection is a data pathway — scan to authenticate electronics and trace component origins.",
    image: "/images/qron/nexus.png",
    gradient: "from-purple-600 via-cyan-400 to-pink-500",
    tags: ["Electronics", "Cyberpunk", "Neon"],
    icon: Cpu,
  },
  {
    id: "couture",
    title: "Couture",
    style: "Art Deco Fashion",
    description:
      "An art deco figure draped in gold and black QR patterns. Fashion meets cryptographic verification — scan the garment code to prove authenticity and provenance.",
    image: "/images/qron/couture.png",
    gradient: "from-amber-400 via-stone-900 to-amber-600",
    tags: ["Fashion", "Art Deco", "Luxury"],
    icon: Palette,
  },
]

const stats = [
  { label: "Industries Covered", value: "11" },
  { label: "Verification Accuracy", value: "99.7%" },
  { label: "Scan Lift vs Plain QR", value: "+25%" },
  { label: "Generation Time", value: "<4s" },
  { label: "Signing Standard", value: "Ed25519" },
  { label: "Blockchain Proof", value: "Polygon" },
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
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/qron/portal">
              <Button variant="ghost" size="sm">Portal</Button>
            </Link>
            <Link href="/storymode">
              <Button variant="ghost" size="sm">StoryMode</Button>
            </Link>
            <Link href="/verify">
              <Button variant="ghost" size="sm">Verify</Button>
            </Link>
            <a href="https://qron.space" target="_blank" rel="noopener noreferrer">
              <Button variant="gradient" size="sm">Generate QRON</Button>
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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
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

      {/* Live Demo — QRON Portal CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-green-500/5 p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                <Fingerprint className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Experience the{" "}
                <span className="gradient-text">Authentic Economy</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Browse 11 real products across every industry — from a $85,000 Patek Philippe to a $65 cannabis flower. Click any QRON to verify authenticity, watch a cinematic origin story, and see the blockchain proof.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/qron/portal">
                  <Button size="lg" className="w-full sm:w-auto">
                    <QrCode className="mr-2 h-5 w-5" />
                    Explore QRON Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/storymode">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Film className="mr-2 h-5 w-5" />
                    About StoryMode
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { img: "/qron/qron-luxury.png", label: "Luxury" },
                { img: "/qron/strainchain-zkittlez-qr.png", label: "Cannabis" },
                { img: "/qron/qron-automotive.png", label: "Automotive" },
                { img: "/qron/qron-electronics.png", label: "Electronics" },
                { img: "/qron/qron-fashion.png", label: "Fashion" },
                { img: "/qron/qron-pharma.png", label: "Pharma" },
              ].map((q) => (
                <Link key={q.label} href="/qron/portal" className="group">
                  <div className="aspect-square rounded-xl overflow-hidden border border-border/50 group-hover:border-primary/50 transition-all">
                    <img src={q.img} alt={q.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-1">{q.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
            <ScanLine className="h-4 w-4" />
            Industry Use Cases
          </div>
          <h2 className="text-3xl font-bold mb-3">
            One Scan. <span className="gradient-text">Every Industry.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how QRON codes transform product authentication across verticals — from seed-to-sale cannabis tracking to luxury watch provenance.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              industry: "Cannabis",
              icon: Leaf,
              color: "text-green-500",
              bg: "bg-green-500/10",
              border: "border-green-500/20",
              product: "Zkittlez OG Craft Flower",
              productId: "a1000001-0001-4000-a000-000000000020",
              flow: ["Consumer scans jar QR", "AI verifies strain + lab results (THC 28.4%)", "StoryMode video: cultivation → harvest → lab → dispensary", "Consumer earns $QRON rewards"],
            },
            {
              industry: "Luxury Goods",
              icon: Globe,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
              product: "Patek Philippe Nautilus 5711/1A",
              productId: "a1000001-0001-4000-a000-000000000002",
              flow: ["Buyer scans watch case back QR", "315 components verified via Swiss manufacture records", "StoryMode video: Geneva atelier → Patek Seal → Archives", "NFT Certificate of Authenticity minted on Polygon"],
            },
            {
              industry: "Fashion & Apparel",
              icon: Palette,
              color: "text-pink-500",
              bg: "bg-pink-500/10",
              border: "border-pink-500/20",
              product: "Valentino Garavani Rockstud Pump",
              productId: "a1000001-0001-4000-a000-000000000011",
              flow: ["Customer scans shoe box QR", "47 artisan steps verified from Tuscan tannery", "StoryMode video: leather sourcing → hand-stitching → QC", "Anti-counterfeit proof shared via social"],
            },
            {
              industry: "Pharmaceuticals",
              icon: Shield,
              color: "text-teal-500",
              bg: "bg-teal-500/10",
              border: "border-teal-500/20",
              product: "NovaShield mRNA Booster Vial",
              productId: "a1000001-0001-4000-a000-000000000005",
              flow: ["Pharmacist scans vial QR", "Cold chain verified: -70°C maintained, zero deviation", "StoryMode video: GMP synthesis → FDA testing → delivery", "Batch certificate immutable on Polygon blockchain"],
            },
          ].map((uc) => {
            const Icon = uc.icon
            return (
              <Card key={uc.industry} className={`border-2 ${uc.border} overflow-hidden`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${uc.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${uc.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold">{uc.industry}</h3>
                      <p className="text-xs text-muted-foreground">{uc.product}</p>
                    </div>
                  </div>
                  <ol className="space-y-2 mb-4">
                    {uc.flow.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className={`text-xs font-bold ${uc.color} mt-0.5`}>{i + 1}.</span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Link href={`/storymode/viewer?product_id=${uc.productId}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <Film className="mr-2 h-3 w-3" />
                      Watch Origin Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
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

      {/* QRON Credit Packs */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            QRON Credit Packs
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Buy More <span className="gradient-text">Generations</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-3">
            Start with 10 free QRONs. Need more? Grab a credit pack — no subscription required.
          </p>
          <p className="text-sm text-muted-foreground">
            Use code{' '}
            <span className="font-mono font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              LAUNCH25
            </span>{' '}
            for 25% off.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter Pack",
              credits: "100 QRONs",
              price: "$29",
              paymentLink: "https://buy.stripe.com/cNi28t2yD55z0B076AaIM09",
              perUnit: "$0.29 / QRON",
              highlight: false,
              features: ["100 Ed25519-signed QRONs", "All art styles", "On-chain verification", "Never expires"],
            },
            {
              name: "Creator Pack",
              credits: "500 QRONs",
              price: "$99",
              paymentLink: "https://buy.stripe.com/bJebJ32yD41vbfEez2aIM0a",
              perUnit: "$0.20 / QRON",
              highlight: true,
              features: ["500 Ed25519-signed QRONs", "All art styles", "On-chain verification", "Never expires", "Priority generation queue"],
            },
            {
              name: "Studio Pack",
              credits: "2,000 QRONs",
              price: "$299",
              paymentLink: "https://buy.stripe.com/dRm7sNa15fKdfvUfD6aIM0b",
              perUnit: "$0.15 / QRON",
              highlight: false,
              features: ["2,000 Ed25519-signed QRONs", "All art styles", "On-chain verification", "Never expires", "Priority generation queue", "Bulk export (ZIP)"],
            },
          ].map((pack) => (
            <div
              key={pack.name}
              className={`rounded-2xl border p-7 flex flex-col ${
                pack.highlight
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {pack.highlight && (
                <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  Best Value
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold">{pack.price}</span>
                <span className="text-muted-foreground mb-1 text-sm">one-time</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">{pack.credits} · {pack.perUnit}</div>
              <ul className="space-y-2 mb-6 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={pack.paymentLink}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition text-center block ${
                  pack.highlight
                    ? "bg-primary hover:opacity-90 text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                Buy {pack.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Staking Section */}
      <section id="staking" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Brand Staking
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Stake QRON. <span className="gradient-text">Reduce Your Costs.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Brands that stake QRON tokens receive discounts on the per-scan authentication fee
            charged every time a product is verified on the AuthiChain Protocol.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tier table */}
          <div className="rounded-2xl border overflow-hidden mb-8">
            <div className="grid grid-cols-4 bg-muted/50 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div>Tier</div>
              <div className="text-right">QRON Required</div>
              <div className="text-right">Fee Discount</div>
              <div className="text-right">Cost / Scan</div>
            </div>
            {[
              { tier: 'None',     color: 'text-muted-foreground', qron: '—',               discount: '0%',   cost: '0.050 QRON' },
              { tier: 'Bronze',   color: 'text-orange-500',       qron: '1,000+',          discount: '10%',  cost: '0.045 QRON' },
              { tier: 'Silver',   color: 'text-slate-400',        qron: '10,000+',         discount: '25%',  cost: '0.0375 QRON' },
              { tier: 'Gold',     color: 'text-yellow-500',       qron: '100,000+',        discount: '40%',  cost: '0.030 QRON' },
              { tier: 'Platinum', color: 'text-purple-400',       qron: '1,000,000+',      discount: '60%',  cost: '0.020 QRON' },
            ].map((row, i) => (
              <div
                key={row.tier}
                className={`grid grid-cols-4 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'} border-t`}
              >
                <div className={`font-semibold ${row.color}`}>{row.tier}</div>
                <div className="text-right text-muted-foreground">{row.qron}</div>
                <div className={`text-right font-semibold ${row.tier !== 'None' ? 'text-green-500' : 'text-muted-foreground'}`}>{row.discount}</div>
                <div className="text-right text-muted-foreground">{row.cost}</div>
              </div>
            ))}
          </div>

          {/* Staking CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-2">Already have a brand account?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Go to your dashboard to stake QRON tokens and instantly upgrade your tier.
                Discounts apply to all future product scans.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">Go to Dashboard</Button>
              </Link>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30 p-6">
              <h3 className="font-semibold mb-2">New to AuthiChain?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Register your brand, upload products, and start staking QRON to reduce
                authentication costs as your scan volume grows.
              </p>
              <Link href="/register">
                <Button variant="gradient" className="w-full">Create Brand Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How long does it take to generate a QRON?", a: "Under 4 seconds. Our Stable Diffusion + ControlNet pipeline runs on Cloudflare Workers for edge-speed generation. The result is a high-res, scannable QR code fused with AI art." },
              { q: "What happens when someone scans my QRON?", a: "They're taken to a verification page showing blockchain-backed authenticity proof, supply chain history, and optionally a cinematic StoryMode video narrating the product's origin story." },
              { q: "Can I use my own branding?", a: "Yes. QRON supports custom colors, logos, and art style prompts. Enterprise plans include white-label options where the entire experience is branded to your company." },
              { q: "How is QRON different from a regular QR code?", a: "Plain QR codes are black-and-white grids with zero security. QRONs are AI-generated artworks with Ed25519 cryptographic signatures verified on the AuthiChain Protocol. The art IS the code — no overlay, no sticker." },
              { q: "Can I integrate QRON generation into my app?", a: "Yes. Use our API at /api/v1/qr/generate (POST with url, style, prompt). Available on Pro plans and above. See our API docs or contact us for enterprise integration." },
              { q: "What blockchains does QRON support?", a: "Polygon for NFT certificates, Bitcoin for Ordinal inscriptions. Every QRON verification is recorded in the immutable fee_flows ledger with the $QRON token economy." },
              { q: "How much does it cost?", a: "10 free QRONs to start. Credit packs from $29 (100 QRONs) to $299 (2,000 QRONs). Subscriptions from $99/mo for 5,000 seals. Enterprise plans with SLA from $1,499/mo." },
              { q: "Do credits expire?", a: "Never. Credit packs are one-time purchases that last forever. Subscription plans renew monthly with fresh generation limits." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border bg-card">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
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
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap justify-center">
              <Link href="/qron/portal" className="hover:text-foreground transition-colors">QRON Portal</Link>
              <Link href="/storymode" className="hover:text-foreground transition-colors">StoryMode</Link>
              <Link href="/verify" className="hover:text-foreground transition-colors">Verify</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/solutions/cannabis" className="hover:text-foreground transition-colors">StrainChain</Link>
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
