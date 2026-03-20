'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle, MapPin, Mail, Phone, Building2, Send, Loader2 } from 'lucide-react'

// ─── Michigan dispensary targets ──────────────────────────────────────────────

const MICHIGAN_TARGETS = [
  {
    id: 1,
    company: 'Lume Cannabis Co.',
    city: 'Kalamazoo',
    state: 'MI',
    contact: 'VP of Operations',
    email: 'ops@lumecannabis.com',
    phone: '',
    website: 'lumecannabis.com',
    tier: 'hot',
    notes: 'Multi-location MSO, active brand protection interest',
  },
  {
    id: 2,
    company: 'Gage Cannabis Co.',
    city: 'Detroit',
    state: 'MI',
    contact: 'Director of Compliance',
    email: 'compliance@gagecannabis.com',
    phone: '',
    website: 'gagecannabis.com',
    tier: 'hot',
    notes: 'Public company, strict METRC compliance needs',
  },
  {
    id: 3,
    company: 'Herbology Cannabis Co.',
    city: 'Saginaw',
    state: 'MI',
    contact: 'Dispensary Manager',
    email: 'info@herbologycannabis.com',
    phone: '',
    website: 'herbologycannabis.com',
    tier: 'warm',
    notes: 'Premium flower brand, packaging authenticity focus',
  },
  {
    id: 4,
    company: 'Green Peak Cannabis',
    city: 'Lansing',
    state: 'MI',
    contact: 'CEO / Founder',
    email: '',
    phone: '',
    website: 'greenpeakmi.com',
    tier: 'warm',
    notes: 'MI-first brand, open to blockchain verification pilots',
  },
  {
    id: 5,
    company: 'Skymint Brands',
    city: 'Grand Rapids',
    state: 'MI',
    contact: 'VP Brand & Marketing',
    email: '',
    phone: '',
    website: 'skymint.com',
    tier: 'warm',
    notes: 'Strong retail footprint, interested in consumer-facing QR',
  },
  {
    id: 6,
    company: 'Cookies Michigan',
    city: 'Detroit',
    state: 'MI',
    contact: 'Store Director',
    email: '',
    phone: '',
    website: 'cookiesmelrose.com',
    tier: 'hot',
    notes: 'Premium brand, counterfeiting is active pain point',
  },
  {
    id: 7,
    company: 'High Life Farms',
    city: 'Chesaning',
    state: 'MI',
    contact: 'COO',
    email: '',
    phone: '',
    website: 'highlifefarms.com',
    tier: 'cold',
    notes: 'Craft cultivator, supply chain transparency angle',
  },
  {
    id: 8,
    company: 'Pleasantrees',
    city: 'Harrison Township',
    state: 'MI',
    contact: 'Director of Sales',
    email: '',
    phone: '',
    website: 'pleasantrees.com',
    tier: 'warm',
    notes: 'Vertically integrated, packaging + batch tracking',
  },
  {
    id: 9,
    company: 'Puff Cannabis Company',
    city: 'Sterling Heights',
    state: 'MI',
    contact: 'Founder',
    email: '',
    phone: '',
    website: 'puffcannabisco.com',
    tier: 'cold',
    notes: 'Growing multi-store chain',
  },
  {
    id: 10,
    company: 'Verilife Michigan',
    city: 'Romulus',
    state: 'MI',
    contact: 'Compliance Manager',
    email: '',
    phone: '',
    website: 'verilife.com',
    tier: 'warm',
    notes: 'PharmaCann subsidiary, enterprise deal potential',
  },
  {
    id: 11,
    company: 'JARS Cannabis',
    city: 'Flint',
    state: 'MI',
    contact: 'VP Operations',
    email: '',
    phone: '',
    website: 'jarscannabis.com',
    tier: 'hot',
    notes: 'Rapid expansion, brand integrity critical',
  },
  {
    id: 12,
    company: 'MedMen Michigan',
    city: 'Ann Arbor',
    state: 'MI',
    contact: 'Regional Director',
    email: '',
    phone: '',
    website: 'medmen.com',
    tier: 'cold',
    notes: 'National brand, MI flagship store',
  },
  {
    id: 13,
    company: 'Common Citizen',
    city: 'Marshall',
    state: 'MI',
    contact: 'Head of Product',
    email: '',
    phone: '',
    website: 'commoncitizen.com',
    tier: 'warm',
    notes: 'Premium positioning, authenticity story strong fit',
  },
  {
    id: 14,
    company: 'TreeHouse Cannabis',
    city: 'Detroit',
    state: 'MI',
    contact: 'Operations Lead',
    email: '',
    phone: '',
    website: 'treehousecannabis.com',
    tier: 'cold',
    notes: 'Detroit-based, community-first brand',
  },
  {
    id: 15,
    company: 'Canna Provisions',
    city: 'Holyoke (MI expansion)',
    state: 'MI',
    contact: 'Founder & CEO',
    email: '',
    phone: '',
    website: 'cannaprovisions.com',
    tier: 'warm',
    notes: 'Expanding into MI, premium positioning, early mover',
  },
]

const TIER_COLORS = {
  hot: 'bg-red-500/20 text-red-400 border-red-500/30',
  warm: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  cold: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

type OutreachStatus = Record<number, 'idle' | 'sending' | 'sent' | 'error'>

export default function MichiganDispensariesPage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [search, setSearch] = useState('')
  const [statuses, setStatuses] = useState<OutreachStatus>({})

  const filtered = MICHIGAN_TARGETS.filter(t => {
    if (filter !== 'all' && t.tier !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.company.toLowerCase().includes(q) || t.city.toLowerCase().includes(q)
    }
    return true
  })

  const sendOutreach = async (targetId: number) => {
    setStatuses(s => ({ ...s, [targetId]: 'sending' }))
    try {
      await fetch('/api/prospect/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, type: 'michigan_dispensary' }),
      })
      setStatuses(s => ({ ...s, [targetId]: 'sent' }))
    } catch {
      setStatuses(s => ({ ...s, [targetId]: 'error' }))
    }
  }

  const sendAll = async () => {
    const pending = filtered.filter(t => !statuses[t.id] || statuses[t.id] === 'idle' || statuses[t.id] === 'error')
    for (const t of pending) {
      await sendOutreach(t.id)
      await new Promise(r => setTimeout(r, 400))
    }
  }

  const counts = {
    hot: MICHIGAN_TARGETS.filter(t => t.tier === 'hot').length,
    warm: MICHIGAN_TARGETS.filter(t => t.tier === 'warm').length,
    cold: MICHIGAN_TARGETS.filter(t => t.tier === 'cold').length,
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Michigan Dispensary Outreach
          </h1>
          <p className="text-muted-foreground mt-1">
            {MICHIGAN_TARGETS.length} pre-qualified targets · Cannabis / Brand Protection vertical
          </p>
        </div>
        <Button onClick={sendAll} className="gap-2 shrink-0">
          <Send className="h-4 w-4" />
          Activate All Targets
        </Button>
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-3 gap-3">
        {(['hot', 'warm', 'cold'] as const).map(tier => (
          <button
            key={tier}
            onClick={() => setFilter(f => f === tier ? 'all' : tier)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              filter === tier ? 'border-primary' : 'border-border hover:border-primary/50'
            }`}
          >
            <p className="text-2xl font-bold">{counts[tier]}</p>
            <Badge className={`${TIER_COLORS[tier]} mt-1 capitalize`}>{tier}</Badge>
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by company or city…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Target list */}
      <div className="grid gap-3">
        {filtered.map(target => {
          const status = statuses[target.id] ?? 'idle'
          return (
            <Card key={target.id} className="transition-all hover:border-primary/40">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <CardTitle className="text-base">{target.company}</CardTitle>
                    <Badge className={`${TIER_COLORS[target.tier]} capitalize text-xs`}>{target.tier}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={status === 'sent' ? 'outline' : 'default'}
                    disabled={status === 'sending' || status === 'sent'}
                    onClick={() => sendOutreach(target.id)}
                    className="shrink-0 gap-1.5"
                  >
                    {status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                    {status === 'sent' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {status === 'error' && <span className="text-red-400">Retry</span>}
                    {status === 'idle' && <Send className="h-3 w-3" />}
                    {status === 'sent' ? 'Sent' : status === 'sending' ? 'Sending…' : 'Reach Out'}
                  </Button>
                </div>
                <CardDescription className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{target.city}, {target.state}
                  </span>
                  {target.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />{target.email}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span><strong>Contact:</strong> {target.contact}</span>
                  {target.website && <span><strong>Web:</strong> {target.website}</span>}
                </div>
                {target.notes && (
                  <p className="mt-2 text-xs text-muted-foreground italic">{target.notes}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
