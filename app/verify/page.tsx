"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Shield, Search, CheckCircle, XCircle, Loader2, Camera, Share2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type VerifyResult = {
  authentic: boolean
  qron_id: string
  trust_score: number
  tokenId: number | null
  confidence: 'High' | 'Medium' | 'Low'
  actions: string[]
  message: string
  verifiedAt: string
}

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>
    }
    jsQR?: (data: Uint8ClampedArray, width: number, height: number) => { data: string } | null
  }
}

function SearchParamsHandler({ onIdFromParams }: { onIdFromParams: (id: string) => void }) {
  const searchParams = useSearchParams()
  const idFromParams = searchParams.get("id") || ""

  useEffect(() => {
    if (idFromParams) {
      onIdFromParams(idFromParams)
    }
  }, [idFromParams, onIdFromParams])

  return null
}

function VerifyContent() {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scanTimerRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanLockRef = useRef(false)

  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [detectorSupported, setDetectorSupported] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [jsQrAvailable, setJsQrAvailable] = useState(false)

  const fallbackEnabled = process.env.NEXT_PUBLIC_ENABLE_QR_FALLBACK === 'true'

  const logEvent = useCallback(async (type: string, details?: Record<string, unknown>) => {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, details }),
    }).catch(() => null)
  }, [])

  const stopCamera = useCallback(() => {
    if (scanTimerRef.current) {
      window.clearInterval(scanTimerRef.current)
      scanTimerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraReady(false)
    scanLockRef.current = false
  }, [])

  const verifyValue = useCallback(async (raw: string) => {
    if (!raw.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw }),
      })
      const data = await response.json()
      setResult(data)

      if (!response.ok && !data?.message) {
        throw new Error('Verification request failed')
      }

      if (data.authentic) {
        await logEvent('verify_success', { qron_id: data.qron_id, trust_score: data.trust_score })
      } else {
        await logEvent('verify_failed', { input: raw, message: data?.message })
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown'
      await logEvent('verify_error', { message })
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify right now. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      scanLockRef.current = false
    }
  }, [logEvent, toast])

  const handleDetectedValue = useCallback(async (value: string) => {
    if (scanLockRef.current) return
    scanLockRef.current = true

    setInputValue(value)
    await logEvent('scan_detected', { value })
    stopCamera()
    await verifyValue(value)
  }, [logEvent, stopCamera, verifyValue])

  const startCamera = useCallback(async () => {
    await logEvent('camera_init')

    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ title: 'Camera Unsupported', description: 'Camera access is not available in this browser.', variant: 'destructive' })
      await logEvent('camera_failed', { reason: 'media_devices_unavailable' })
      return
    }

    try {
      stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraReady(true)
      await logEvent('camera_started')
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : 'unknown'
      await logEvent('camera_failed', { reason })
      toast({ title: 'Camera Error', description: 'Could not start camera.', variant: 'destructive' })
    }
  }, [logEvent, stopCamera, toast])

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined'
    setDetectorSupported(hasWindow && typeof window.BarcodeDetector !== 'undefined')
    setJsQrAvailable(hasWindow && typeof window.jsQR === 'function')
    return () => stopCamera()
  }, [stopCamera])

  useEffect(() => {
    if (!cameraReady || !videoRef.current) return

    if (detectorSupported && window.BarcodeDetector) {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      scanTimerRef.current = window.setInterval(async () => {
        if (!videoRef.current) return
        try {
          const detected = await detector.detect(videoRef.current)
          if (detected?.length && detected[0].rawValue) {
            await handleDetectedValue(String(detected[0].rawValue))
          }
        } catch {
          // ignore intermittent detector failures
        }
      }, 700)

      return () => {
        if (scanTimerRef.current) {
          window.clearInterval(scanTimerRef.current)
          scanTimerRef.current = null
        }
      }
    }

    if (fallbackEnabled && jsQrAvailable && window.jsQR) {
      scanTimerRef.current = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video.videoWidth || !video.videoHeight) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (!context) return

        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const decoded = window.jsQR?.(imageData.data, imageData.width, imageData.height)

        if (decoded?.data) {
          await handleDetectedValue(decoded.data)
        }
      }, 700)

      return () => {
        if (scanTimerRef.current) {
          window.clearInterval(scanTimerRef.current)
          scanTimerRef.current = null
        }
      }
    }

    return undefined
  }, [cameraReady, detectorSupported, fallbackEnabled, jsQrAvailable, handleDetectedValue])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyValue(inputValue)
  }

  const handleShare = async () => {
    if (!result) return
    await logEvent('share_clicked', { qron_id: result.qron_id })

    const shareText = `QRON ${result.qron_id} verified with trust score ${result.trust_score} at ${result.verifiedAt}. ${window.location.href}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AuthiChain Verification',
          text: shareText,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toast({ title: 'Copied', description: 'Verification details copied to clipboard.' })
      }
      await logEvent('share_success', { qron_id: result.qron_id })
    } catch {
      toast({ title: 'Share cancelled', description: 'No data was shared.' })
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {fallbackEnabled && <Script src="/jsQR.js" strategy="afterInteractive" onLoad={() => setJsQrAvailable(typeof window !== 'undefined' && typeof window.jsQR === 'function')} />}
      <Suspense fallback={null}>
        <SearchParamsHandler onIdFromParams={setInputValue} />
      </Suspense>

      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AuthiChain</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Live QRON Verification</h1>
          <p className="text-xl text-muted-foreground">Scan or enter a QRON / TrueMark identifier to verify authenticity.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QR Scanner</CardTitle>
            <CardDescription>Uses native BarcodeDetector, with optional local jsQR fallback when configured.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <video ref={videoRef} className="w-full rounded-md bg-muted aspect-video" muted playsInline />
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            <div className="flex gap-3">
              <Button type="button" onClick={startCamera} className="flex-1">
                <Camera className="mr-2 h-4 w-4" /> Start Camera
              </Button>
              <Button type="button" variant="outline" onClick={stopCamera}>Stop</Button>
            </div>
            {!detectorSupported && !fallbackEnabled && (
              <p className="text-sm text-muted-foreground">
                Your browser does not support BarcodeDetector. Optional fallback decoder is disabled. You can still enter code manually.
              </p>
            )}
            {!detectorSupported && fallbackEnabled && !jsQrAvailable && (
              <p className="text-sm text-muted-foreground">
                Fallback mode is enabled, but local `/public/jsQR.js` was not found. Add a vendored jsQR file to enable fallback scanning.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verify</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qron-input">QR / Product Identifier / Token ID</Label>
                <Input id="qron-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="https://... or PROD-12345 or 1" className="font-mono" />
              </div>
              <Button type="submit" disabled={loading} variant="gradient" size="lg" className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : <><Search className="mr-2 h-4 w-4" />Verify Product</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 ${result.authentic ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                {result.authentic ? <CheckCircle className="h-12 w-12 text-green-500" /> : <XCircle className="h-12 w-12 text-red-500" />}
                <div>
                  <CardTitle className="text-2xl">{result.authentic ? 'Product Verified ✓' : 'Verification Failed ✗'}</CardTitle>
                  <CardDescription>{result.message}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>QRON ID</Label><p className="font-mono">{result.qron_id}</p></div>
                <div><Label>Token ID</Label><p>{result.tokenId ?? 'N/A'}</p></div>
                <div><Label>Trust Score</Label><p>{result.trust_score}</p></div>
                <div><Label>Confidence</Label><Badge>{result.confidence}</Badge></div>
              </div>
              <div>
                <Label>Actions</Label>
                <div className="flex flex-wrap gap-2 mt-2">{result.actions?.map((a: string) => <Badge key={a} variant="secondary">{a}</Badge>)}</div>
              </div>
              <div className="flex gap-3">
                {result.authentic && (
                  <Button type="button" onClick={handleOpenShare}><Share2 className="mr-2 h-4 w-4" />Share Verified</Button>
                )}
                <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-sm text-muted-foreground text-center">
          <Link href="/activity" className="underline">Live activity log</Link>
        </p>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Verified</DialogTitle>
            <DialogDescription>Share this verification with your network.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">QRON ID:</span> {result?.qron_id}</p>
            <p><span className="font-medium">Trust Score:</span> {result?.trust_score}</p>
            <p><span className="font-medium">Verified:</span> {result?.verifiedAt}</p>
          </div>
          <Button onClick={handleShare}>Share now</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
