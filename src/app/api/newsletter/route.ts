import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail is verplicht" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email" });

    if (error) {
      console.error("Newsletter error:", error);
      return NextResponse.json({ error: "Kon niet inschrijven" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }
}
