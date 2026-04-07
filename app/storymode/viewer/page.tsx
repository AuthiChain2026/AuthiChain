'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Loader2,
  Film,
  Sparkles,
  Shield,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

type VideoStatus = 'idle' | 'generating' | 'processing' | 'completed' | 'failed'

export default function StorymodeViewer() {
  const [productId, setProductId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoStatus>('idle')
  const [script, setScript] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setProductId(params.get('product_id'))
  }, [])

  // Generate the cinematic story video
  const handleGenerate = useCallback(async () => {
    if (!productId) return

    setStatus('generating')
    try {
      const res = await fetch('/api/storymode/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Generation failed')

      setScript(data.script)
      setVideoId(data.videoId)
      setStatus('processing')

      toast({
        title: 'Story Video Queued',
        description: 'HeyGen is producing your cinematic origin story...',
      })
    } catch (err: any) {
      setStatus('failed')
      toast({ title: 'Generation Failed', description: err.message, variant: 'destructive' })
    }
  }, [productId, toast])

  // Poll for video completion
  useEffect(() => {
    if (status !== 'processing' || !videoId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/storymode/status?videoId=${videoId}`)
        const data = await res.json()

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          setThumbnailUrl(data.thumbnailUrl ?? null)
          setDuration(data.duration ?? null)
          setStatus('completed')
          toast({ title: 'Story Video Ready', description: 'Your cinematic origin story is ready to play.' })
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setStatus('failed')
          clearInterval(interval)
        }
      } catch {
        // Retry silently
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [status, videoId, toast])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Cinematic header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-black" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="border-primary/50 text-primary text-sm">
                AuthiChain StoryMode
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Product Origin
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Story
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              A cinematic narrative powered by blockchain truth. Every frame
              anchored in verified provenance data from the AuthiChain Protocol.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Video area */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {!productId ? (
          <Card className="bg-zinc-900/80 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Product Selected</h2>
              <p className="text-zinc-400">
                Add <code className="bg-zinc-800 px-2 py-1 rounded text-sm">?product_id=xxx</code> to the URL
                to generate a cinematic origin story.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Video player / generation area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-zinc-900/80 border-zinc-800 overflow-hidden">
                <div className="aspect-video relative bg-black flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {status === 'completed' && videoUrl ? (
                      <motion.video
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full object-cover"
                        src={videoUrl}
                        poster={thumbnailUrl ?? undefined}
                        controls
                        autoPlay
                      />
                    ) : status === 'processing' ? (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Producing Your Story</h3>
                        <p className="text-zinc-400 text-sm">
                          HeyGen is rendering your cinematic origin narrative...
                        </p>
                        <p className="text-zinc-500 text-xs mt-2">This typically takes 1-3 minutes</p>
                      </motion.div>
                    ) : status === 'generating' ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <Sparkles className="h-16 w-16 text-primary animate-pulse mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Writing the Script</h3>
                        <p className="text-zinc-400 text-sm">
                          GPT-4 is crafting your theatrical narration...
                        </p>
                      </motion.div>
                    ) : status === 'failed' ? (
                      <motion.div
                        key="failed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <p className="text-red-400 mb-4">Generation failed. Please try again.</p>
                        <Button onClick={handleGenerate} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <div className="mb-6">
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                            <Play className="h-10 w-10 text-primary ml-1" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">
                          Generate Origin Story
                        </h3>
                        <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                          Create a cinematic, AI-narrated video tracing this product&apos;s
                          journey from origin to your hands — verified on the blockchain.
                        </p>
                        <Button
                          size="lg"
                          onClick={handleGenerate}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                          <Film className="h-5 w-5 mr-2" />
                          Generate Cinematic Story
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Video info bar */}
                {status === 'completed' && (
                  <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Blockchain Verified
                      </Badge>
                      {duration && (
                        <span className="text-sm text-zinc-400">
                          {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    {videoUrl && (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Open Full Screen <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Script display */}
            {script && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-zinc-900/80 border-zinc-800">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Narration Script</h3>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs ml-auto">
                        AI Generated by GPT-4
                      </Badge>
                    </div>
                    <blockquote className="text-zinc-300 leading-relaxed text-lg italic border-l-2 border-primary/50 pl-6">
                      {script}
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
