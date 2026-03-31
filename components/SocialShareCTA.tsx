'use client'

import { useState } from 'react'
import { Share2, Copy, CheckCircle } from 'lucide-react'

interface SocialShareCTAProps {
  productName?: string
  verifyUrl?: string
}

export function SocialShareCTA({ productName = 'this product', verifyUrl }: SocialShareCTAProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = verifyUrl || 'https://authichain.com'
  const shareText = `${productName} is verified authentic on AuthiChain — blockchain product authentication.`

  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'AuthiChain Verified', text: shareText, url: shareUrl }) } catch {}
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
      <span className="w-full text-xs text-gray-500 mb-1">Share this verification:</span>

      {'share' in (typeof navigator !== 'undefined' ? navigator : {}) && (
        <button onClick={handleNativeShare} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-700 text-gray-300 hover:border-purple-500 transition">
          <Share2 className="h-3 w-3" /> Share
        </button>
      )}

      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-700 text-gray-300 hover:border-purple-500 transition no-underline">
        𝕏 Post
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-700 text-gray-300 hover:border-purple-500 transition no-underline">
        in LinkedIn
      </a>

      <button onClick={handleCopy} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-700 text-gray-300 hover:border-purple-500 transition">
        {copied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
