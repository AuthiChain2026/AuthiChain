import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Shield, CheckCircle, TrendingUp, ArrowRight, Zap, Globe, Lock } from 'lucide-react'

const industries: Record<string, {
  name: string
  headline: string
  description: string
  problem: string
  stats: { label: string; value: string }[]
  useCases: string[]
  painPoints: string[]
}> = {
  'luxury-goods': {
    name: 'Luxury Goods',
    headline: 'Stop Luxury Counterfeits Before They Reach Your Customers',
    description: 'AuthiChain protects luxury brands with AI-powered authentication and blockchain verification. Every handbag, watch, and accessory gets a tamper-proof digital identity.',
    problem: 'The luxury counterfeit market is worth $600B+ annually. Consumers lose trust, brands lose revenue, and counterfeits fund criminal networks.',
    stats: [
      { label: 'Counterfeit Market Size', value: '$600B+' },
      { label: 'Authentication Accuracy', value: '99.7%' },
      { label: 'Avg Brand Revenue Recovery', value: '23%' },
    ],
    useCases: [
      'Authenticate handbags, watches, jewelry at point of sale',
      'QR-verified certificates of authenticity for resale markets',
      'Supply chain tracking from manufacturer to retail',
      'Consumer-facing verification via smartphone scan',
    ],
    painPoints: [
      'Luxury resale platforms struggle to verify authenticity',
      'Brand dilution from counterfeit flooding online marketplaces',
      'Manual authentication processes that don\'t scale',
      'No consumer-facing proof of authenticity for gifting/resale',
    ],
  },
  'pharmaceuticals': {
    name: 'Pharmaceuticals',
    headline: 'Protect Lives with Pharmaceutical Authentication',
    description: 'AuthiChain ensures drug safety with blockchain-verified supply chain tracking. Meet DSCSA compliance while protecting patients from counterfeit medications.',
    problem: 'Counterfeit drugs kill 1M+ people annually. The WHO estimates 10% of medicines in low/middle-income countries are substandard or falsified.',
    stats: [
      { label: 'Deaths from Fake Drugs/Year', value: '1M+' },
      { label: 'DSCSA Compliance', value: '100%' },
      { label: 'Verification Speed', value: '<2 sec' },
    ],
    useCases: [
      'End-to-end drug traceability from manufacturer to pharmacy',
      'DSCSA compliance with automated serialization',
      'Patient-facing verification via QR code scan',
      'Recall management with instant lot-level tracking',
    ],
    painPoints: [
      'DSCSA compliance deadlines require immediate action',
      'Complex multi-tier supply chains with limited visibility',
      'Manual processes prone to error and fraud',
      'No real-time verification at pharmacy/hospital level',
    ],
  },
  'fashion-apparel': {
    name: 'Fashion & Apparel',
    headline: 'Authenticate Every Garment. Protect Every Collection.',
    description: 'AuthiChain gives fashion brands digital product passports with AI classification and blockchain verification. Enable resale, prove sustainability, stop knockoffs.',
    problem: 'Fashion counterfeiting costs the industry $50B+ per year. EU Digital Product Passports become mandatory in 2027.',
    stats: [
      { label: 'Fashion Counterfeit Losses', value: '$50B+/yr' },
      { label: 'DPP Compliance Ready', value: 'EU 2027' },
      { label: 'Products Authenticated', value: '500K+' },
    ],
    useCases: [
      'Digital Product Passports for EU compliance',
      'Resale authentication for secondhand marketplaces',
      'Sustainability and material origin tracking',
      'Anti-counterfeit NFC/QR tags in garments',
    ],
    painPoints: [
      'EU DPP regulation requires digital product identity by 2027',
      'Resale platforms need scalable authentication',
      'Consumers demand sustainability proof',
      'Fast fashion knockoffs erode brand value',
    ],
  },
  'electronics': {
    name: 'Electronics',
    headline: 'Verify Every Component. Secure Every Device.',
    description: 'AuthiChain authenticates electronics from chip to consumer device. Prevent counterfeit components entering your supply chain with AI-powered verification.',
    problem: 'Counterfeit electronics cause $75B+ in annual losses and pose serious safety risks in automotive, aerospace, and medical devices.',
    stats: [
      { label: 'Counterfeit Electronics Losses', value: '$75B+/yr' },
      { label: 'Component Verification', value: 'Real-time' },
      { label: 'Supply Chain Coverage', value: 'End-to-end' },
    ],
    useCases: [
      'Component-level authentication for PCBs and ICs',
      'Supply chain verification for contract manufacturers',
      'Consumer device authenticity for warranty claims',
      'Gray market and unauthorized resale detection',
    ],
    painPoints: [
      'Counterfeit chips causing device failures and safety hazards',
      'Complex global supply chains with multiple brokers',
      'Warranty fraud from refurbished-as-new devices',
      'No visibility into component origin after distribution',
    ],
  },
  'automotive-parts': {
    name: 'Automotive Parts',
    headline: 'Authenticate Auto Parts. Save Lives.',
    description: 'AuthiChain protects the automotive aftermarket with blockchain-verified parts authentication. Prevent counterfeit brakes, airbags, and critical components from endangering drivers.',
    problem: 'Counterfeit auto parts generate $45B+ annually and cause thousands of accidents. Fake brake pads, airbags, and filters put lives at risk.',
    stats: [
      { label: 'Counterfeit Auto Parts Market', value: '$45B+' },
      { label: 'Parts Verified per Scan', value: '<1 sec' },
      { label: 'Recall Tracking', value: 'Instant' },
    ],
    useCases: [
      'OEM parts authentication at dealer/repair shop level',
      'Aftermarket parts verification for online marketplaces',
      'Recall tracking with instant lot identification',
      'Fleet management parts compliance and tracking',
    ],
    painPoints: [
      'Fake brake pads and airbags causing fatal accidents',
      'Online marketplaces flooded with knockoff parts',
      'Dealers unable to verify aftermarket part authenticity',
      'Recall campaigns with limited traceability',
    ],
  },
  'food-beverage': {
    name: 'Food & Beverage',
    headline: 'From Farm to Fork. Verified.',
    description: 'AuthiChain brings transparency to food supply chains. Track origin, verify organic certifications, and protect premium food brands from adulteration.',
    problem: 'Food fraud costs the global industry $40B+ per year. From fake olive oil to mislabeled seafood, consumers can\'t trust what they eat.',
    stats: [
      { label: 'Food Fraud Annual Cost', value: '$40B+' },
      { label: 'Origin Traceability', value: 'Farm-to-fork' },
      { label: 'Certification Verification', value: 'Real-time' },
    ],
    useCases: [
      'Organic and fair-trade certification verification',
      'Wine and spirits provenance tracking',
      'Seafood origin and species verification',
      'Premium brand protection against adulteration',
    ],
    painPoints: [
      'Olive oil, honey, and spice adulteration is rampant',
      'Organic labels can\'t be verified by consumers',
      'Seafood mislabeling affects 20-30% of products',
      'Food safety recalls need faster traceability',
    ],
  },
  'cosmetics': {
    name: 'Cosmetics & Beauty',
    headline: 'Protect Beauty Brands from Dangerous Counterfeits',
    description: 'AuthiChain authenticates cosmetics and skincare products. Protect consumers from counterfeit beauty products that contain harmful ingredients.',
    problem: 'Counterfeit cosmetics contain dangerous chemicals including lead, mercury, and bacteria. The fake beauty market exceeds $5B annually.',
    stats: [
      { label: 'Fake Beauty Market', value: '$5B+/yr' },
      { label: 'Harmful Ingredient Detection', value: 'Pre-scan' },
      { label: 'Consumer Trust Score', value: '+40%' },
    ],
    useCases: [
      'Product authenticity verification at point of purchase',
      'Ingredient transparency and safety verification',
      'Anti-diversion tracking for authorized retailers',
      'Consumer-facing brand trust with scannable verification',
    ],
    painPoints: [
      'Fake makeup with toxic ingredients harming consumers',
      'Social media marketplaces selling convincing counterfeits',
      'Gray market diversion eroding authorized retailer sales',
      'No consumer-facing way to verify before purchasing',
    ],
  },
  'wine-spirits': {
    name: 'Wine & Spirits',
    headline: 'Every Bottle Tells a Verified Story',
    description: 'AuthiChain brings provenance and authenticity to wine and spirits. Protect vintage collections, verify barrel origins, and stop counterfeit bottles.',
    problem: 'Wine and spirits counterfeiting is a $3B+ problem. 20% of wine sold in China is estimated to be fake.',
    stats: [
      { label: 'Spirits Counterfeiting', value: '$3B+/yr' },
      { label: 'Provenance Chain', value: 'Barrel-to-bottle' },
      { label: 'Collector Verification', value: 'Instant' },
    ],
    useCases: [
      'Vintage wine authentication for auction houses and collectors',
      'Barrel-to-bottle provenance tracking for distilleries',
      'Import/export verification to prevent counterfeits',
      'Consumer-facing QR scan for bottle story and origin',
    ],
    painPoints: [
      'Fake vintage wines deceiving collectors and auction houses',
      'Refilled bottles with counterfeit spirits causing health risks',
      'Import markets flooded with fake premium brands',
      'No way for consumers to verify authenticity at purchase',
    ],
  },
  'cannabis': {
    name: 'Cannabis',
    headline: 'Compliant Cannabis. Verified from Seed to Sale.',
    description: 'AuthiChain provides cannabis track-and-trace with blockchain verification. Meet state compliance requirements while protecting brands from counterfeit products.',
    problem: 'Cannabis counterfeiting and diversion cost the legal market billions. Illicit vapes and edibles with dangerous additives endanger consumers.',
    stats: [
      { label: 'Illicit Cannabis Market', value: '$65B+' },
      { label: 'State Compliance', value: '50-state ready' },
      { label: 'Seed-to-Sale Tracking', value: 'Full chain' },
    ],
    useCases: [
      'Seed-to-sale tracking for state compliance (Metrc integration)',
      'Dispensary verification of product authenticity',
      'Consumer scanning to verify licensed products',
      'Lab result verification linked to product identity',
    ],
    painPoints: [
      'Counterfeit vape cartridges with dangerous additives',
      'Complex multi-state compliance requirements',
      'Diversion from legal to illicit markets',
      'Consumers unable to verify licensed products',
    ],
  },
  'sneakers-streetwear': {
    name: 'Sneakers & Streetwear',
    headline: 'Authenticate Drops. Verify Grails. Stop Fakes.',
    description: 'AuthiChain gives sneakers and streetwear digital certificates of authenticity. Power resale platforms, protect hype releases, and let collectors verify with a scan.',
    problem: 'Sneaker counterfeits are a $450B+ global problem. 1 in 4 sneakers on resale platforms may be fake.',
    stats: [
      { label: 'Sneaker Counterfeit Market', value: '$450B+' },
      { label: 'Scan-to-Verify', value: '<1 second' },
      { label: 'Resale Platform Ready', value: 'API/embed' },
    ],
    useCases: [
      'Drop-day authenticity tagging for limited releases',
      'Resale marketplace integration via API',
      'Collector portfolio with verified ownership history',
      'Brand-to-consumer authentication for direct sales',
    ],
    painPoints: [
      'Resale platforms can\'t scale manual authentication',
      'Consumers losing thousands on convincing fakes',
      'Brands have no post-sale authentication mechanism',
      'Limited releases immediately counterfeited',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(industries).map(industry => ({ industry }))
}

export function generateMetadata({ params }: { params: { industry: string } }): Metadata {
  const data = industries[params.industry]
  if (!data) return {}
  return {
    title: `${data.name} Authentication | AuthiChain`,
    description: data.description,
    openGraph: {
      title: `${data.name} Product Authentication | AuthiChain`,
      description: data.description,
      url: `https://authichain.com/solutions/${params.industry}`,
    },
    alternates: { canonical: `https://authichain.com/solutions/${params.industry}` },
  }
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const data = industries[params.industry]
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
            <Shield className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">{data.name} Authentication</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {data.headline}
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">{data.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition">
              Start Free Trial <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
            <Link href="/pricing" className="px-8 py-3 rounded-lg border border-gray-700 text-gray-300 hover:border-purple-500 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-red-400">The Problem</h2>
          <p className="text-gray-400 text-lg">{data.problem}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-900/10 to-cyan-900/10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">How AuthiChain Solves {data.name} Authentication</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.useCases.map((uc, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-gray-800 bg-gray-900/50">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-gray-300">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Pain Points We Eliminate</h2>
          <div className="space-y-3">
            {data.painPoints.map((pp, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <Zap className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">{pp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AuthiChain */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Why AuthiChain for {data.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">AI AutoFlow&trade;</h3>
              <p className="text-sm text-gray-500">Automatic product classification across 10+ industries using AI vision models</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <Lock className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Blockchain Verified</h3>
              <p className="text-sm text-gray-500">Immutable proof of authenticity on Base L2 blockchain with TrueMark&trade; QR codes</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <Globe className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Enterprise Scale</h3>
              <p className="text-sm text-gray-500">50,000+ products/month with API integration and white-label options</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your {data.name} Brand?</h2>
          <p className="text-gray-400 mb-8">Start authenticating products in minutes. No contracts, cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition">
              Start Free Trial <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
            <Link href="/enterprise" className="px-8 py-3 rounded-lg border border-gray-700 text-gray-300 hover:border-purple-500 transition">
              Talk to Sales
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-4">Starting at $299/month &middot; 14-day free trial &middot; No credit card required</p>
        </div>
      </section>

      {/* JSON-LD for this specific industry page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${data.name} Product Authentication | AuthiChain`,
            description: data.description,
            url: `https://authichain.com/solutions/${params.industry}`,
            mainEntity: {
              "@type": "Product",
              name: `AuthiChain for ${data.name}`,
              description: data.description,
              brand: { "@type": "Brand", name: "AuthiChain" },
            },
          }),
        }}
      />
    </div>
  )
}
