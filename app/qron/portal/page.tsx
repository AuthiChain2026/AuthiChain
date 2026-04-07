'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Film, Shield, ExternalLink, ChevronDown,
  Sparkles, QrCode, Fingerprint, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const PORTAL_ITEMS = [
  {
    id: 'a1000001-0001-4000-a000-000000000004',
    name: 'Sony WH-1000XM6 Headphones',
    brand: 'Sony',
    industry: 'Electronics',
    price: '$449',
    score: 96.0,
    truemark: 'TM-SNY-XM6-W2R88',
    events: 3,
    qronImage: '/qron/qron-electronics.png',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/40',
    badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000020',
    name: 'Zkittlez OG — Indoor Craft Flower (3.5g)',
    brand: 'StrainChain Labs',
    industry: 'Cannabis',
    price: '$65',
    score: 99.1,
    truemark: 'TM-SC-ZKTOG7-H4W91',
    events: 5,
    qronImage: '/qron/strainchain-zkittlez-qr.png',
    color: 'green',
    gradient: 'from-green-500/20 to-emerald-500/10',
    borderColor: 'border-green-500/40',
    badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000002',
    name: 'Patek Philippe Nautilus 5711/1A',
    brand: 'Patek Philippe',
    industry: 'Luxury Goods',
    price: '$85,000',
    score: 99.8,
    truemark: 'TM-PP-NAU5711-X3M47',
    events: 4,
    qronImage: '/qron/qron-luxury.png',
    color: 'yellow',
    gradient: 'from-yellow-500/20 to-amber-500/10',
    borderColor: 'border-yellow-500/40',
    badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000008',
    name: 'Brembo GT-R Brake Caliper Set',
    brand: 'Brembo',
    industry: 'Automotive',
    price: '$4,800',
    score: 98.0,
    truemark: 'TM-BRM-GTR-K7J44',
    events: 3,
    qronImage: '/qron/qron-automotive.png',
    color: 'blue',
    gradient: 'from-blue-500/20 to-indigo-500/10',
    borderColor: 'border-blue-500/40',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000005',
    name: 'NovaShield mRNA Booster Vial',
    brand: 'NovaShield Bio',
    industry: 'Pharmaceuticals',
    price: '$42',
    score: 99.9,
    truemark: 'TM-NVS-B7-L4H21',
    events: 3,
    qronImage: '/qron/qron-pharma.png',
    color: 'teal',
    gradient: 'from-teal-500/20 to-cyan-500/10',
    borderColor: 'border-teal-500/40',
    badgeClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000011',
    name: 'Valentino Garavani Rockstud Pump',
    brand: 'Valentino',
    industry: 'Fashion & Apparel',
    price: '$1,190',
    score: 98.5,
    truemark: 'TM-VAL-RS2026-A7K92B',
    events: 4,
    qronImage: '/qron/qron-fashion.png',
    color: 'amber',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/40',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000003',
    name: 'Kopi Luwak Heritage Reserve Coffee',
    brand: 'Heritage Reserve',
    industry: 'Food & Beverage',
    price: '$289',
    score: 97.2,
    truemark: 'TM-KL-HR2026-Q9P55',
    events: 4,
    qronImage: '/qron/qron-food.png',
    color: 'orange',
    gradient: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/40',
    badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000006',
    name: 'Banksy "Girl with Balloon" Print',
    brand: 'Banksy / Pest Control',
    industry: 'Art & Collectibles',
    price: '$320,000',
    score: 99.5,
    truemark: 'TM-BNK-GWB-N8V33',
    events: 4,
    qronImage: '/qron/qron-art.png',
    color: 'sky',
    gradient: 'from-sky-500/20 to-blue-500/10',
    borderColor: 'border-sky-500/40',
    badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000007',
    name: 'La Mer Creme de la Mer Moisturizer',
    brand: 'La Mer',
    industry: 'Cosmetics & Beauty',
    price: '$380',
    score: 97.8,
    truemark: 'TM-LMR-CDM-P6T19',
    events: 3,
    qronImage: '/qron/qron-cosmetics.png',
    color: 'pink',
    gradient: 'from-pink-500/20 to-rose-500/10',
    borderColor: 'border-pink-500/40',
    badgeClass: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000009',
    name: 'Titleist Pro V1x Tour Edition (Dozen)',
    brand: 'Titleist',
    industry: 'Sports & Fitness',
    price: '$79.99',
    score: 95.5,
    truemark: 'TM-TTL-PV1X-S5Q77',
    events: 2,
    qronImage: '/qron/qron-sports.png',
    color: 'slate',
    gradient: 'from-slate-500/20 to-zinc-500/10',
    borderColor: 'border-slate-500/40',
    badgeClass: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  },
  {
    id: 'a1000001-0001-4000-a000-000000000010',
    name: 'SKF Explorer Roller Bearing 22320',
    brand: 'SKF',
    industry: 'Industrial',
    price: '$1,250',
    score: 96.8,
    truemark: 'TM-SKF-22320-R3F66',
    events: 3,
    qronImage: '/qron/qron-industrial.png',
    color: 'zinc',
    gradient: 'from-zinc-500/20 to-neutral-500/10',
    borderColor: 'border-zinc-500/40',
    badgeClass: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  },
]

export default function QronPortal() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalEvents = PORTAL_ITEMS.reduce((sum, p) => sum + p.events, 0)
  const avgScore = (PORTAL_ITEMS.reduce((sum, p) => sum + p.score, 0) / PORTAL_ITEMS.length).toFixed(1)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="h-7 w-7 text-primary" />
              <Badge variant="outline" className="border-primary/50 text-primary text-sm">
                QRON Portal
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-cyan-400">
                Authentic Economy
              </span>
              <br />Gallery
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
              11 industries. {totalEvents} verified supply chain events. {avgScore}% average authenticity.
              Click any QRON to experience blockchain-verified product provenance.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-zinc-400">{PORTAL_ITEMS.length} Industries</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-zinc-400">{totalEvents} Events Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-zinc-400">{avgScore}% Avg Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-purple-400" />
                <span className="text-zinc-400">Polygon + Bitcoin</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTAL_ITEMS.map((item, index) => {
            const isExpanded = expanded === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                layout
              >
                <Card
                  className={`bg-zinc-900/80 border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                    isExpanded ? item.borderColor : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  <CardContent className="p-0">
                    {/* QRON Image */}
                    <div className={`relative aspect-square bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
                      <img
                        src={item.qronImage}
                        alt={`QRON - ${item.industry}`}
                        className="w-3/4 h-3/4 object-contain opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <Badge className={`absolute top-3 left-3 ${item.badgeClass} text-xs`}>
                        {item.industry}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-black/60 text-white text-xs border-0">
                        {item.score}%
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{item.brand}</span>
                        <span className="font-mono">{item.price}</span>
                      </div>

                      {/* Expand indicator */}
                      <div className="flex items-center justify-center mt-3">
                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-zinc-500">TrueMark™</span>
                                <p className="font-mono text-zinc-300 truncate">{item.truemark}</p>
                              </div>
                              <div>
                                <span className="text-zinc-500">Supply Chain</span>
                                <p className="text-zinc-300">{item.events} verified events</p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                              <Link href={`/storymode/viewer?product_id=${item.id}`} className="flex-1" onClick={e => e.stopPropagation()}>
                                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs">
                                  <Film className="h-3 w-3 mr-1" />
                                  Origin Story
                                </Button>
                              </Link>
                              <Link href={`/verify?id=${item.truemark}`} className="flex-1" onClick={e => e.stopPropagation()}>
                                <Button size="sm" variant="outline" className="w-full text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-500 text-sm mb-4">
            Every QRON code links to a blockchain-verified origin story.
            Scan any code to experience the Authentic Economy.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/storymode">
              <Button variant="outline" size="sm">
                <Film className="h-4 w-4 mr-2" />
                About StoryMode
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
