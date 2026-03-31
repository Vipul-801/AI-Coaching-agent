import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // Placeholder: implement server-side TTS using ElevenLabs, AWS Polly, or another provider.
    // This route intentionally avoids importing any SDKs until implemented so the client
    // bundle doesn't try to include node-only modules.
    console.log('/api/tts called - placeholder');
    return NextResponse.json({ error: 'TTS route not implemented on server yet' }, { status: 501 });
  } catch (err) {
    console.error('/api/tts error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
