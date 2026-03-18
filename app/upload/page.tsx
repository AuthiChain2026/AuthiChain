"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Upload, ArrowLeft, Loader2, Sparkles, Check, Clock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { productResponseSchema } from "@/lib/contracts/products"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [classified, setClassified] = useState(false)
  const [classificationData, setClassificationData] = useState<any>(null)
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setClassified(false)
    }
  }

  const classifyImage = async () => {
    if (!file || !preview) return

    setLoading(true)
    setProgress(20)

    try {
      // Classify image using AI AutoFlow
      setProgress(40)
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: preview }),
      })

      if (!response.ok) throw new Error("Classification failed")

      const data = await response.json()
      setProgress(80)

      // Store full classification data
      setClassificationData(data)

      // Update product form data
      setProductData({
        name: data.name || "",
        category: data.industry || data.category || "",
        brand: data.brand || "",
        description: data.description || "",
      })

      setClassified(true)
      setProgress(100)

      toast({
        title: "✨ AI AutoFlow™ Complete!",
        description: `Classified as ${data.industry || "product"} with ${data.confidence}% confidence`,
      })
    } catch (error) {
      console.error("Classification error:", error)
      toast({
        title: "Classification Failed",
        description: "Please try again or enter product details manually.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No Image",
        description: "Please upload a product image.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress(20)

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      setProgress(40)

      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      setProgress(60)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)

      setProgress(80)

      // Create product in database with AI AutoFlow data
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          imageUrl: publicUrl,
          // AI AutoFlow fields
          industryId: classificationData?.industryId,
          workflow: classificationData?.workflow,
          story: classificationData?.story,
          features: classificationData?.features,
          authenticityFeatures: classificationData?.authenticityFeatures,
          confidence: classificationData?.confidence,
        }),
      })

      if (!response.ok) throw new Error("Failed to create product")

      const data = productResponseSchema.parse(await response.json())

      setProgress(100)

      if (data.warning) {
        toast({
          title: "Database Migration Needed",
          description: data.warning,
        })
      }

      toast({
        title: "Product Created!",
        description: "Your product has been successfully uploaded.",
      })

      // Redirect to product detail page
      router.push(`/products/${data.product.id}`)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Upload Your <span className="gradient-text">Product</span>
          </h1>
          <p className="text-muted-foreground">
            Let AI classify your product and register it on the blockchain
          </p>
        </div>

        {progress > 0 && (
          <Progress value={progress} className="mb-8" />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>
                Upload a clear photo of your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">
                            Click to upload image
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {file && !classified && (
                  <Button
                    type="button"
                    onClick={classifyImage}
                    disabled={loading}
                    variant="gradient"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Classify with AI
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                {classified
                  ? "AI has classified your product. Review and edit if needed."
                  : "Enter product details manually or use AI classification."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  placeholder="e.g., iPhone 15 Pro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={productData.category}
                  onChange={(e) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                  placeholder="e.g., Electronics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={productData.brand}
                  onChange={(e) =>
                    setProductData({ ...productData, brand: e.target.value })
                  }
                  placeholder="e.g., Apple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the product"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI AutoFlow Preview */}
          {classified && classificationData && (
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      AI AutoFlow™ Preview
                    </CardTitle>
                    <CardDescription>
                      Industry-specific authentication workflow
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {classificationData.industryIcon}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {classificationData.industry}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Confidence Score */}
                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                  <span className="text-sm font-medium">Classification Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        style={{ width: `${classificationData.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {classificationData.confidence}%
                    </span>
                  </div>
                </div>

                {/* Workflow Steps */}
                {classificationData.workflow && classificationData.workflow.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Authentication Workflow ({classificationData.workflow.length} Steps)
                    </h4>
                    <div className="space-y-2">
                      {classificationData.workflow.map((step: any, index: number) => (
                        <div
                          key={step.id}
                          className="flex items-start gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">{step.name}</h5>
                              <span className="text-xs text-muted-foreground">{step.duration}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Story Preview */}
                {classificationData.story && (
                  <div className="p-4 bg-white/60 dark:bg-black/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">AI-Generated Origin Story</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{classificationData.story}"
                    </p>
                  </div>
                )}

                {/* Authenticity Features */}
                {classificationData.authenticityFeatures && classificationData.authenticityFeatures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Authenticity Verification Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {classificationData.authenticityFeatures.map((feature: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs"
                        >
                          <Check className="h-3 w-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !file}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
