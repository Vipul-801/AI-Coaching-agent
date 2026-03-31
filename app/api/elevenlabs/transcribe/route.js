import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // Placeholder: implement server-side transcription using ElevenLabs or another provider.
    // The server should download the file (if URL provided) or accept an uploaded file and
    // call the provider SDK/server API. Keep provider SDK imports inside this server file.
    console.log('/api/elevenlabs/transcribe called - placeholder', { body });
    return NextResponse.json({ error: 'Transcribe route not implemented on server yet' }, { status: 501 });
  } catch (err) {
    console.error('/api/elevenlabs/transcribe error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
