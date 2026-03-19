export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  classifyIndustry,
  generateWorkflow,
  generateStory,
  getIndustry,
  getAllIndustries,
} from '@/lib/industries'

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Get all available industries for the prompt
    const industries = getAllIndustries()
    const industryList = industries.map((i) => i.name).join(', ')

    // Use GPT-4o Vision to analyze the product image
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this product image and provide detailed classification.

Available industries: ${industryList}

Provide:
1. Product name (be specific)
2. Industry category (choose the most appropriate from the list above)
3. Brand (if identifiable, otherwise "Unknown")
4. Detailed description (2-3 sentences about the product)
5. Key features (list 3-5 distinguishing features)
6. Confidence score (0.0–1.0, how confident you are in the classification)

Respond in JSON format only (no markdown fences):
{
  "name": "specific product name",
  "category": "industry category from the list",
  "brand": "brand name or Unknown",
  "description": "detailed product description",
  "features": ["feature 1", "feature 2", "feature 3"],
  "confidence": 0.95,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response — strip markdown code fences if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim()
    const aiResult = JSON.parse(jsonStr)

    // Classify into our industry system
    const industryId = classifyIndustry(
      aiResult.keywords || [],
      aiResult.name,
      aiResult.description
    )

    const industry = getIndustry(industryId)

    // Generate industry-specific workflow
    const workflowSteps = generateWorkflow(industryId)
    const workflow = {
      steps: workflowSteps.map((step) => ({
        title: step.name,
        description: step.description,
        timestamp: step.duration,
      })),
    }

    // Generate AI story
    const storyText = generateStory(industryId, aiResult.name, aiResult.brand, {
      strain: aiResult.features?.[0] || '',
      location: 'certified facilities',
      artist: aiResult.brand,
    })

    // Build the story object expected by StorySchema in the demo page
    const story = {
      title: `${aiResult.name} — Authenticity Story`,
      duration: 60,
      transcriptSegments: [
        {
          text: storyText,
          start: 0,
          end: 60,
        },
      ],
    }

    // Classification result
    const classification = {
      industry: industry?.name || aiResult.category,
      confidence: typeof aiResult.confidence === 'number' ? aiResult.confidence : 0.9,
    }

    return NextResponse.json({
      classification,
      workflow,
      story,
      industryId,
      industryIcon: industry?.icon,
      features: aiResult.features || [],
      authenticityFeatures: industry?.authenticityFeatures || [],
      marketSize: industry?.marketSize,
      name: aiResult.name,
      brand: aiResult.brand,
      description: aiResult.description,
    })
  } catch (error) {
    console.error('AutoFlow error:', error)
    return NextResponse.json(
      { error: 'Failed to process image with AutoFlow' },
      { status: 500 }
    )
  }
}
