'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ScanLine, Brain, Sparkles, Shield, Film, Coins,
  ArrowDown, CheckCircle, Fingerprint, Database,
  Cpu, Image, QrCode, Play,
} from 'lucide-react'

const PRODUCT = {
  id: 'a1000001-0001-4000-a000-000000000020',
  name: 'Zkittlez OG — Indoor Craft Flower (3.5g)',
  brand: 'StrainChain Labs',
  category: 'Cannabis',
  truemark_id: 'TM-SC-ZKTOG7-H4W91',
  authenticity_score: 99.1,
  price: '$65.00',
  blockchain_tx: '0xd1e2f3a4...b9c0d1',
  nft_contract: '0xc314...3eb5',
  thc: '28.4%',
  terpenes: 'Caryophyllene, Limonene, Linalool',
}

interface StepProps {
  step: number
  icon: React.ReactNode
  title: string
  subtitle: string
  endpoint: string
  details: string[]
  color: string
  active: boolean
  onClick: () => void
}

function FlowStep({ step, icon, title, subtitle, endpoint, details, color, active, onClick }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.15 }}
    >
      <Card
        className={`cursor-pointer transition-all border-2 ${active ? `border-${color}-500 bg-${color}-500/5` : 'border-zinc-800 hover:border-zinc-700'}`}
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${active ? `bg-${color}-500/20` : 'bg-zinc-800'}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  Step {step}
                </Badge>
                <h3 className="font-semibold text-sm">{title}</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-2">{subtitle}</p>
              <code className="text-xs text-green-400 bg-zinc-900 px-2 py-1 rounded block mb-2 truncate">
                {endpoint}
              </code>
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-1 mt-2">
                      {details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center py-1">
        <ArrowDown className="h-4 w-4 text-zinc-600" />
      </div>
    </motion.div>
  )
}

export default function MockupPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps: Omit<StepProps, 'active' | 'onClick'>[] = [
    {
      step: 1,
      icon: <ScanLine className="h-6 w-6 text-blue-400" />,
      title: 'User Scans Product',
      subtitle: 'Consumer scans QRON QR code on product packaging',
      endpoint: 'GET /verify/{truemark_id}',
      color: 'blue',
      details: [
        'Phone camera scans QRON QR code on Zkittlez OG jar',
        'QR links to: authichain.com/storymode/viewer?product_id=...0020',
        'Scan event logged to scan_events table',
        '$QRON fee triggered: 0.05 QRON → 40% stakers / 40% treasury / 20% burn',
      ],
    },
    {
      step: 2,
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      title: 'AI AutoFlow™ Classifies',
      subtitle: 'GPT-4 + industry detection classifies product into vertical',
      endpoint: 'POST /api/classify → lib/industries.ts',
      color: 'purple',
      details: [
        'AI analyzes: product name, description, metadata, image',
        'Matches keywords: "cannabis, flower, thc, strain" → Cannabis industry',
        'Assigns workflow: cultivation → processing → testing → distribution → retail',
        'Sets confidence: 99.1% | Generates authenticity features array',
      ],
    },
    {
      step: 3,
      icon: <Image className="h-6 w-6 text-pink-400" />,
      title: 'Hugging Face Generates QRON Art',
      subtitle: 'AI model creates artistic QR code with cannabis botanical theme',
      endpoint: 'POST qron-ai-api.undone-k.workers.dev/v1/generate',
      color: 'pink',
      details: [
        'Prompt: "Cannabis botanical, emerald greens, trichome frost, living soil earth tones"',
        'FAL.ai / Hugging Face Stable Diffusion generates artistic QR overlay',
        'Pixel-clamped scannability guarantee — art + function',
        'Output: 2048x2048 PNG with embedded scannable QR data',
      ],
    },
    {
      step: 4,
      icon: <Database className="h-6 w-6 text-green-400" />,
      title: 'Supabase Logs TrueMark™ Authentication',
      subtitle: 'Product registered with unique TrueMark ID on blockchain',
      endpoint: 'POST /api/register → Supabase products table',
      color: 'green',
      details: [
        'TrueMark™ ID: TM-SC-ZKTOG7-H4W91 (unique, immutable)',
        'Polygon TX: 0xd1e2f3a4...b9c0d1 recorded',
        'NFT Certificate minted via contract 0xc314...3eb5',
        'Supply chain: 5 verified events (cultivation → distribution)',
        'Authenticity score: 99.1% stored in products table',
      ],
    },
    {
      step: 5,
      icon: <QrCode className="h-6 w-6 text-cyan-400" />,
      title: 'Dynamic QRON Code Updated',
      subtitle: 'Living QR portal updates with product data + use cases',
      endpoint: 'PATCH /api/qron/[id] → qron_generations table',
      color: 'cyan',
      details: [
        'QRON code becomes "living portal" — destination can change',
        'Links to: StoryMode viewer, verify page, product detail, or custom URL',
        'Scan analytics tracked: location, device, timestamp',
        'Story Mode content (title, scenes, CTAs) can be managed from dashboard',
      ],
    },
    {
      step: 6,
      icon: <Film className="h-6 w-6 text-amber-400" />,
      title: 'StoryMode Video Generation',
      subtitle: 'GPT-4 writes cinematic script → HeyGen produces avatar video',
      endpoint: 'POST /api/storymode/generate',
      color: 'amber',
      details: [
        'GPT-4 generates 60-90s theatrical narration from supply chain data',
        'HeyGen renders photorealistic AI avatar narrator at 1080p',
        'Script: "In the fertile soil of Ann Arbor, Michigan..."',
        'Video stored in story_videos table, streamed to viewer',
      ],
    },
    {
      step: 7,
      icon: <Coins className="h-6 w-6 text-yellow-400" />,
      title: '$QRON Reward Experience',
      subtitle: 'Consumer earns rewards, brand pays scan fee, stakers earn yield',
      endpoint: 'lib/fee-flows.ts → fee_flows table',
      color: 'yellow',
      details: [
        'Per scan: 0.05 QRON base fee (discounted by brand staking tier)',
        'Split: 40% → staker rewards, 40% → protocol treasury, 20% → burned',
        'Brand "StrainChain Labs" at Gold tier: 40% discount → 0.03 QRON net',
        'Consumer can earn QRON rewards for scanning + verifying',
        'Staking tiers: Bronze $49 → Platinum $14,999 (10-60% discount)',
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-8">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            Authentic Economy System Flow
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Authentic Economy
            </span>{' '}
            Works
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            From product scan to cinematic video to $QRON rewards — every step
            traced on the blockchain across AuthiChain, QRON, and StrainChain.
          </p>
        </div>

        {/* Product Card with QRON Image */}
        <Card className="bg-zinc-900/80 border-zinc-800 mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* QRON Code Image */}
              <div className="bg-gradient-to-br from-green-950/50 to-black p-8 flex items-center justify-center">
                <div className="relative">
                  <img
                    src="/qron/strainchain-zkittlez-qr.png"
                    alt="StrainChain QRON Code"
                    className="w-64 h-64 rounded-xl opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-3">
                      <Fingerprint className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                    SCAN ME
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                    {PRODUCT.authenticity_score}% Authentic
                  </Badge>
                </div>
                <h2 className="text-xl font-bold mb-1">{PRODUCT.name}</h2>
                <p className="text-zinc-400 text-sm mb-3">{PRODUCT.brand} • {PRODUCT.price}</p>
                <div className="space-y-1 text-xs text-zinc-500">
                  <p><span className="text-zinc-400">THC:</span> {PRODUCT.thc} • <span className="text-zinc-400">Terpenes:</span> {PRODUCT.terpenes}</p>
                  <p><span className="text-zinc-400">TrueMark™:</span> <code className="text-green-400">{PRODUCT.truemark_id}</code></p>
                  <p><span className="text-zinc-400">Chain:</span> Polygon • <span className="text-zinc-400">Contract:</span> <code>{PRODUCT.nft_contract}</code></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Steps */}
        <div className="space-y-0">
          {steps.map((s) => (
            <FlowStep
              key={s.step}
              {...s}
              active={activeStep === s.step}
              onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            />
          ))}
        </div>

        {/* Final output */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-gradient-to-br from-green-950/30 to-zinc-900 border-green-500/30">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cpu className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-bold">End Result</h3>
              </div>
              <p className="text-zinc-300 mb-4">
                Consumer scans jar → sees cinematic origin video → verifies 28.4% THC on blockchain →
                earns $QRON rewards → dispensary pays 0.03 QRON/scan (Gold tier)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400">AuthiChain Verified</Badge>
                <Badge className="bg-purple-500/20 text-purple-400">AI Classified</Badge>
                <Badge className="bg-pink-500/20 text-pink-400">QRON Art Generated</Badge>
                <Badge className="bg-green-500/20 text-green-400">Blockchain Anchored</Badge>
                <Badge className="bg-amber-500/20 text-amber-400">StoryMode Video</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-400">$QRON Rewards</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
