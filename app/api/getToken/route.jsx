// /app/api/getToken/route.js
export async function GET() {
  try {
    const response = await fetch("https://streaming.assemblyai.com/v3/token?expires_in_seconds=300", {
      method: "GET",
      headers: {
        "Authorization": process.env.ASSEMBLYAI_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AssemblyAI error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AssemblyAI returned ${response.status}: ${errorText}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify({ token: data.token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate token" }),
      { status: 500 }
    );
  }
}