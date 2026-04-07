import { Film, Sparkles, Shield, Clapperboard, Mic } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'StoryMode — AuthiChain',
  description: 'Cinematic AI-narrated product origin stories, anchored in blockchain truth.',
}

export default function StorymodePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-green-500/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-sm font-semibold tracking-widest uppercase text-primary">
              AuthiChain StoryMode
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Every Product Has
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-primary">
              An Origin Story
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform blockchain-verified provenance into cinematic, AI-narrated videos.
            A theatrical experience that turns supply chain data into compelling brand narratives.
          </p>
          <Link
            href="/storymode/viewer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            <Clapperboard className="h-5 w-5" />
            Launch StoryMode
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How StoryMode Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Blockchain Data</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Supply chain events, TrueMark™ IDs, and NFT certificates are pulled
              directly from the Polygon blockchain — no fiction, only verified truth.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-3">AI Script</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              GPT-4 transforms raw provenance data into a theatrical narration —
              dramatic, sensory, and emotionally compelling. Documentary-grade storytelling.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-3">HeyGen Video</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A photorealistic AI avatar narrates your product&apos;s origin story
              in a cinematic 1080p video — ready to share, embed, or present.
            </p>
          </div>
        </div>
      </section>

      {/* API docs */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-start gap-4">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-bold shrink-0">POST</span>
              <div>
                <code className="text-zinc-200">/api/storymode/generate</code>
                <p className="text-zinc-500 font-sans mt-1">
                  Generate a cinematic video. Body: <code>{'{ "productId": "uuid" }'}</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-bold shrink-0">GET</span>
              <div>
                <code className="text-zinc-200">/api/storymode/status?videoId=xxx</code>
                <p className="text-zinc-500 font-sans mt-1">
                  Poll for video generation status. Returns video URL when complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
