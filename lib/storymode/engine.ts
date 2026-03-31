import OpenAI from 'openai';
import { TextEncoder } from 'util';
import { StorymodeContext } from './types';
import { buildStoryPrompt } from './prompt';

// Streaming narrative engine for Storymode
export async function generateStoryStream(ctx: StorymodeContext) {
  const encoder = new TextEncoder();
  const prompt = buildStoryPrompt(ctx);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages: [
      { role: 'system', content: 'You are Storymode, the narrative engine of AuthiChain.' },
      { role: 'user', content: prompt }
    ]
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices?.[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(`data: ${text}\n\n`));
      }
      controller.close();
    }
  });
}
