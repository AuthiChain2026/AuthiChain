"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Shield, Plus, Package, CheckCircle, Loader2, LogOut, Sparkles, TrendingUp, Zap, X, Coins, ArrowUpRight, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { productsResponseSchema, type Product } from "@/lib/contracts/products"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [upgradeDismissed, setUpgradeDismissed] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [brand, setBrand] = useState<any>(null)
  const [feeFlowSummary, setFeeFlowSummary] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchProducts()
    fetchSubscription()
    fetchBrand()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription")
      if (res.ok) setSubscription(await res.json())
    } catch {}
  }

  const fetchBrand = async () => {
    try {
      const [brandRes, flowsRes] = await Promise.all([
        fetch("/api/brands/me"),
        fetch("/api/brands/fee-flows"),
      ])
      if (brandRes.ok) {
        const data = await brandRes.json()
        setBrand(data.brand)
      }
      if (flowsRes.ok) {
        const data = await flowsRes.json()
        setFeeFlowSummary(data.summary)
      }
    } catch {}
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.upgradeUrl) {
        router.push(data.upgradeUrl)
      }
    } catch {
      toast({ title: "Error", description: "Could not open billing portal.", variant: "destructive" })
    }
  }

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      router.push("/login")
      return
    }

    setUser(user)
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) throw new Error("Failed to fetch products")

      const data = productsResponseSchema.parse(await response.json())
      setProducts(data.products)
    } catch (error) {
      console.error("Fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const stats = {
    total: products.length,
    registered: products.filter((p) => p.is_registered).length,
    pending: products.filter((p) => !p.is_registered).length,
  }

  // AI AutoFlow Analytics
  const industryBreakdown: Record<string, number> = products.reduce((acc: Record<string, number>, product: Product) => {
    if (product.industry_id) {
      acc[product.industry_id] = (acc[product.industry_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalWithIndustry: number = (Object.values(industryBreakdown) as number[]).reduce((sum: number, count: number) => sum + count, 0)

  const avgConfidence = products.filter((p) => p.confidence !== null && p.confidence !== undefined)
    .reduce((sum: number, p: Product) => sum + (p.confidence ?? 0), 0) /
    (products.filter((p) => p.confidence !== null && p.confidence !== undefined).length || 1)

  const topIndustries: [string, number][] = (Object.entries(industryBreakdown) as [string, number][])
    .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
    .slice(0, 3)

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
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your products and blockchain registrations
            </p>
          </div>
          <Link href="/upload">
            <Button variant="gradient" size="lg" className="mt-4 md:mt-0">
              <Plus className="mr-2 h-5 w-5" />
              Upload Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.registered}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {subscription?.subscription?.plan ?? 'Free'}
              </div>
              {subscription?.subscription?.status === 'trialing' && (
                <p className="text-xs text-blue-500 mt-1">Trial active</p>
              )}
              {subscription?.subscription?.status === 'past_due' && (
                <p className="text-xs text-red-500 mt-1">Payment past due</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QRON Staking Widget */}
        {brand && (
          <Card className="mb-8 border-amber-500/30 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-500" />
                    QRON Staking
                  </CardTitle>
                  <CardDescription>Stake QRON tokens to reduce per-scan authentication fees</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      brand.staking_tier === 'platinum' ? 'bg-purple-500 text-white' :
                      brand.staking_tier === 'gold'     ? 'bg-yellow-500 text-black' :
                      brand.staking_tier === 'silver'   ? 'bg-slate-400 text-white'  :
                      brand.staking_tier === 'bronze'   ? 'bg-orange-500 text-white'  :
                      'bg-muted text-muted-foreground'
                    }
                  >
                    {brand.staking_tier.charAt(0).toUpperCase() + brand.staking_tier.slice(1)} Tier
                  </Badge>
                  <Link href="/qron">
                    <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Get QRON
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Staked</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {Number(brand.qron_staked).toLocaleString()} <span className="text-sm font-normal">QRON</span>
                  </p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Discount</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {(brand.unit_cost_discount * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Scans (30d)</p>
                  <p className="text-xl font-bold">
                    {feeFlowSummary?.total_scans ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">QRON Saved (30d)</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {feeFlowSummary?.total_discounted?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
              </div>

              {brand.staking_locked_until && new Date(brand.staking_locked_until) > new Date() && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Locked until {new Date(brand.staking_locked_until).toLocaleDateString()}
                </div>
              )}

              {brand.staking_tier === 'none' && (
                <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-sm">
                  <strong>Stake 1,000+ QRON</strong> to unlock Bronze tier (10% discount on every product scan).
                  Platinum tier (60% discount) requires 1,000,000 QRON.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upgrade Banner */}
        {!loading && !upgradeDismissed && (
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-white shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm">
                    Use code <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">LAUNCH25</span> — 25% off for 3 months
                  </p>
                  <p className="text-white/80 text-xs mt-0.5">
                    Upgrade to Pro for unlimited products, API access, supply chain tracking &amp; more.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/pricing">
                  <Button size="sm" className="bg-white text-emerald-700 hover:bg-white/90 font-semibold">
                    Upgrade Now
                  </Button>
                </Link>
                <button
                  onClick={() => setUpgradeDismissed(true)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI AutoFlow Analytics */}
        {totalWithIndustry > 0 && (
          <Card className="mb-8 border-purple-500/20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI AutoFlow™ Analytics
                  </CardTitle>
                  <CardDescription>
                    Multi-industry portfolio insights
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
                  {totalWithIndustry} Products Classified
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Confidence */}
                <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Avg. Confidence</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {avgConfidence.toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${avgConfidence}%` }}
                    />
                  </div>
                </div>

                {/* Total Industries */}
                <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Industries</span>
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Object.keys(industryBreakdown).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Across multiple sectors
                  </p>
                </div>

                {/* Top Industry */}
                <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Top Industry</span>
                    <Shield className="h-4 w-4 text-yellow-500" />
                  </div>
                  {topIndustries.length > 0 && (
                    <>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
                        {topIndustries[0][0].replace('-', ' & ')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {topIndustries[0][1]} products
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Industry Breakdown */}
              {Object.keys(industryBreakdown).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">Industry Distribution</h4>
                  <div className="space-y-2">
                    {(Object.entries(industryBreakdown) as [string, number][])
                      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
                      .map(([industry, count]: [string, number]) => (
                        <div key={industry} className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-3">
                            <span className="text-sm font-medium capitalize min-w-[120px]">
                              {industry.replace('-', ' & ')}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                style={{ width: `${(count / totalWithIndustry) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({((count / totalWithIndustry) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Products</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first product to get started
                </p>
                <Link href="/upload">
                  <Button variant="gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    {product.image_url && (
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1">
                          {product.name}
                        </CardTitle>
                        {product.is_registered ? (
                          <Badge className="bg-green-500 shrink-0 ml-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="shrink-0 ml-2">
                            Pending
                          </Badge>
                        )}
                      </div>
                      {product.brand && (
                        <CardDescription>{product.brand}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {product.industry_id && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {product.industry_id.replace('-', ' & ')}
                            </Badge>
                            {product.confidence && (
                              <span className="text-xs text-muted-foreground">
                                {product.confidence}% confidence
                              </span>
                            )}
                          </div>
                        )}
                        {product.category && !product.industry_id && (
                          <p className="text-muted-foreground">
                            Category: {product.category}
                          </p>
                        )}
                        {product.truemark_id && (
                          <p className="text-xs font-mono truncate">
                            {product.truemark_id}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
