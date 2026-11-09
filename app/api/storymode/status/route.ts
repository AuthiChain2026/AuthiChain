/**
 * GET /api/storymode/status?videoId=xxx
 *
 * Polls HeyGen for video generation status.
 * Returns video URL when complete.
 * No auth required — allows public demo polling.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getVideoStatus } from '@/lib/heygen'


export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId')
  if (!videoId?.trim()) return NextResponse.json({ error: 'videoId required' }, { status: 400 })

  try {
    const result = await getVideoStatus(videoId)

    // Update stored record if completed
    if (result.status === 'completed' && result.videoUrl) {
      const service = createServiceClient()
      await service
        .from('story_videos')
        .update({
          status: 'completed',
          video_url: result.videoUrl,
          thumbnail_url: result.thumbnailUrl,
          duration_seconds: result.duration,
        })
        .eq('heygen_video_id', videoId)
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
