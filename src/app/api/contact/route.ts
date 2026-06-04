import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const n = name.trim();
    const e = email.trim();
    const m = message.trim();

    // Detect submission type from message prefix e.g. "[Newsletter Signup]"
    const typeMatch = m.match(/^\[([^\]]+)\]/);
    const type = typeMatch ? typeMatch[1] : "Contact";

    // Save to database
    await prisma.submission.create({
      data: { type, name: n, email: e, message: m },
    });

    // Send email notification (best-effort — don't fail if SMTP is blocked)
    try {
      await sendContactEmail({ fromName: n, fromEmail: e, message: m });
    } catch (mailErr) {
      console.warn("[contact] email send failed (saved to DB):", mailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
