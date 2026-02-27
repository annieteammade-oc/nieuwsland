import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });

    if (error) {
      console.error("Contact error:", error);
      return NextResponse.json({ error: "Kon bericht niet opslaan" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }
}
