import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import CoachingOptions from '../../../lib/coachingOptions';

// Server-side AI proxy. Expects a POST with { topic, coachingOptionName, lastTwoConversations }
export async function POST(req) {
  try {
    const body = await req.json();
  const { topic, coachingOptionName, coachingOptions, lastTwoConversations } = body;
  // Accept either coachingOptionName (string) or coachingOptions (string) for backwards compatibility
  const resolvedCoachingName = coachingOptionName ?? coachingOptions;

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
    });

    // Build system message and conversation
    const messages = [
      { role: 'system', content: `You are a coaching assistant. Topic: ${topic ?? 'general'}` },
      ...(Array.isArray(lastTwoConversations) ? lastTwoConversations : []),
    ];

    // Resolve coaching option from shared list
    const option = Array.isArray(CoachingOptions)
      ? CoachingOptions.find((item) => item.name === resolvedCoachingName) || CoachingOptions[0]
      : CoachingOptions[0];

    // If the option has a prompt template, inject the topic
    const systemPrompt = option?.prompt ? option.prompt.replace('{user_topic}', topic ?? '') : '';
    if (systemPrompt) messages.unshift({ role: 'system', content: systemPrompt });

    // Validate messages shape
    if (!Array.isArray(messages) || messages.some((m) => !m?.role || !m?.content)) {
      return NextResponse.json({ error: 'Invalid messages payload sent to AI model' }, { status: 400 });
    }

    // Use a server-side env var for the model so it can be rotated without code changes
    const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free';
    if (!model) {
      console.error('Missing OPENROUTER_MODEL env var');
      return NextResponse.json({ error: 'Server configuration error: OPENROUTER_MODEL not set' }, { status: 500 });
    }

    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
      });

      return NextResponse.json({ result: completion.choices?.[0]?.message ?? null });
    } catch (providerErr) {
      // Surface provider error details for debugging while avoiding leaking secrets
      console.error('Provider returned error', providerErr);
      const status = providerErr?.status || providerErr?.code || 500;
      const message = providerErr?.message || 'Provider error';
      const details = providerErr?.error || providerErr?.response || null;
      return new Response(JSON.stringify({ error: message, details }), { status });
    }
  } catch (err) {
    console.error('AI model route error', err);
    return new Response(JSON.stringify({ error: 'AI model error' }), { status: 500 });
  }
}
