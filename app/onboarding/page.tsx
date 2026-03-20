'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle, Building2, Package, QrCode, ShieldCheck, ChevronRight, Sparkles, Clock
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  // Step 1 – Brand
  brandName: string
  industry: string
  website: string
  // Step 2 – Product
  productName: string
  productCategory: string
  productSku: string
  // Step 3 – Protection goals
  goals: string[]
  // Step 4 – Plan selection
  plan: 'starter' | 'pro' | 'enterprise'
}

const INDUSTRIES = [
  'Luxury Goods', 'Cannabis / Dispensary', 'Pharmaceuticals', 'Electronics',
  'Apparel & Fashion', 'Food & Beverage', 'Cosmetics', 'Supply Chain / Logistics', 'Other',
]

const PRODUCT_CATEGORIES = [
  'Apparel', 'Electronics', 'Health & Beauty', 'Cannabis Products',
  'Pharmaceutical', 'Food & Beverage', 'Jewelry', 'Accessories', 'Other',
]

const PROTECTION_GOALS = [
  { id: 'anti_counterfeit', label: 'Anti-counterfeit protection', icon: '🛡️' },
  { id: 'supply_chain', label: 'Supply chain visibility', icon: '🔗' },
  { id: 'consumer_trust', label: 'Consumer trust & transparency', icon: '🤝' },
  { id: 'regulatory', label: 'Regulatory compliance', icon: '📋' },
  { id: 'nft_certs', label: 'NFT certificates of authenticity', icon: '🏆' },
  { id: 'analytics', label: 'Scan analytics & insights', icon: '📊' },
]

const PLANS = [
  {
    key: 'starter' as const,
    name: 'Starter',
    price: '$49/mo',
    features: ['Up to 500 products', 'QR verification', 'Basic analytics', 'CSV export'],
    badge: null,
  },
  {
    key: 'pro' as const,
    name: 'Professional',
    price: '$149/mo',
    features: ['Unlimited products', 'NFT certificates', 'Supply chain tracking', 'API access', 'Custom QR branding'],
    badge: 'Most Popular',
  },
  {
    key: 'enterprise' as const,
    name: 'Enterprise',
    price: 'Custom',
    features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'White-label', 'Custom integrations'],
    badge: null,
  },
]

const STEPS = [
  { title: 'Your Brand', icon: Building2, description: 'Tell us about your company' },
  { title: 'First Product', icon: Package, description: 'Add your flagship product' },
  { title: 'Your Goals', icon: ShieldCheck, description: 'What do you want to protect?' },
  { title: 'Choose Plan', icon: Sparkles, description: 'Start verifying in minutes' },
]

// ─── Step components ──────────────────────────────────────────────────────────

function StepBrand({ data, onChange }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brandName">Brand / Company Name *</Label>
        <Input
          id="brandName"
          placeholder="e.g. Acme Luxury Co."
          value={data.brandName}
          onChange={e => onChange({ brandName: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="industry">Industry *</Label>
        <select
          id="industry"
          value={data.industry}
          onChange={e => onChange({ industry: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select your industry…</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          placeholder="https://yourbrand.com"
          value={data.website}
          onChange={e => onChange({ website: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  )
}

function StepProduct({ data, onChange }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name *</Label>
        <Input
          id="productName"
          placeholder="e.g. Gold Reserve Tincture 1000mg"
          value={data.productName}
          onChange={e => onChange({ productName: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="productCategory">Category *</Label>
        <select
          id="productCategory"
          value={data.productCategory}
          onChange={e => onChange({ productCategory: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select category…</option>
          {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="productSku">SKU / Product ID</Label>
        <Input
          id="productSku"
          placeholder="e.g. SKU-001 (optional)"
          value={data.productSku}
          onChange={e => onChange({ productSku: e.target.value })}
          className="mt-1"
        />
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <QrCode className="h-3 w-3" />
        We'll generate a TrueMark™ ID and QR code instantly after you finish.
      </p>
    </div>
  )
}

function StepGoals({ data, onChange }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void }) {
  const toggle = (id: string) => {
    const next = data.goals.includes(id)
      ? data.goals.filter(g => g !== id)
      : [...data.goals, id]
    onChange({ goals: next })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Select all that apply — we'll tailor your setup.</p>
      <div className="grid grid-cols-1 gap-2">
        {PROTECTION_GOALS.map(goal => {
          const selected = data.goals.includes(goal.id)
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggle(goal.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                selected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <span className="text-lg">{goal.icon}</span>
              <span className="text-sm font-medium">{goal.label}</span>
              {selected && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-primary" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepPlan({ data, onChange }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-3">
      {PLANS.map(plan => (
        <button
          key={plan.key}
          type="button"
          onClick={() => onChange({ plan: plan.key })}
          className={`w-full rounded-lg border p-4 text-left transition-colors ${
            data.plan === plan.key
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{plan.name}</span>
                {plan.badge && (
                  <Badge className="bg-primary text-primary-foreground text-xs">{plan.badge}</Badge>
                )}
              </div>
              <p className="text-lg font-bold text-primary mt-0.5">{plan.price}</p>
              <ul className="mt-2 space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {data.plan === plan.key && (
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    brandName: '',
    industry: '',
    website: '',
    productName: '',
    productCategory: '',
    productSku: '',
    goals: [],
    plan: 'pro',
  })

  const patch = (partial: Partial<OnboardingData>) => setData(d => ({ ...d, ...partial }))

  const canProceed = () => {
    if (step === 0) return data.brandName.trim() && data.industry
    if (step === 1) return data.productName.trim() && data.productCategory
    if (step === 2) return data.goals.length > 0
    return true
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Save brand + first product via API, then redirect to checkout
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      // Redirect to pricing/checkout with selected plan pre-filled
      router.push(`/pricing?plan=${data.plan}&from=onboarding`)
    } catch {
      router.push(`/pricing?plan=${data.plan}`)
    } finally {
      setSubmitting(false)
    }
  }

  const CurrentStep = [StepBrand, StepProduct, StepGoals, StepPlan][step]
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AuthiChain</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            5-minute brand setup
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                {(() => { const Icon = STEPS[step].icon; return <Icon className="h-5 w-5 text-primary" /> })()}
              </div>
              <div>
                <CardTitle className="text-lg">{STEPS[step].title}</CardTitle>
                <CardDescription>{STEPS[step].description}</CardDescription>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </p>
          </CardHeader>

          <CardContent>
            <CurrentStep data={data} onChange={patch} />

            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed() || submitting}
                className="gap-2"
              >
                {submitting
                  ? 'Setting up…'
                  : step === STEPS.length - 1
                    ? 'Start Protecting My Brand'
                    : 'Continue'}
                {!submitting && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust signals */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />No credit card to start</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />Cancel anytime</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />SOC 2 ready</span>
        </div>
      </div>
    </div>
  )
}
