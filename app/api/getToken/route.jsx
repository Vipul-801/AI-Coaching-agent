import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";
// /app/api/getToken/route.js
export async function GET() {
  const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
    method: "POST",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: "universal-streaming" }),
  });

  const data = await response.json();
  return new Response(JSON.stringify({ token: data.token }), { status: 200 });
}


