import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_TIPS_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, firstName, lastName, email, location, phone } = body;

    if (!message || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 },
      );
    }

    // Post to Discord #tips-redactie via webhook
    if (DISCORD_WEBHOOK_URL) {
      const lines = [
        `📩 **Nieuwe tip via website**`,
        ``,
        `**Van:** ${firstName} ${lastName} (${email})`,
        location ? `**Locatie:** ${location}` : null,
        phone ? `**Tel:** ${phone}` : null,
        ``,
        `**Tip:**`,
        message,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: lines }),
      });

      if (!res.ok) {
        console.error("Discord webhook failed:", res.status, await res.text());
      }
    }

    // Also forward to email (optional, via external service later)

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tip API error:", err);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
