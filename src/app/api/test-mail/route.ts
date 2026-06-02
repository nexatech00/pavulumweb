import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO;

  if (!user || !pass) {
    return NextResponse.json({
      error: "Env vars not loaded",
      GMAIL_USER: user ?? "MISSING",
      GMAIL_APP_PASSWORD: pass ? "SET" : "MISSING",
      CONTACT_TO: to ?? "MISSING",
    }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Pavulum Test" <${user}>`,
      to: to ?? user,
      replyTo: `"Test Client" <testclient@example.com>`,
      subject: "✅ Pavulum contact form — test email",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#C0392B">New contact message</h2>
          <p><strong>Name:</strong> Test Client</p>
          <p><strong>Email:</strong> testclient@example.com</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p>This is a test message from the Pavulum contact form.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="font-size:12px;color:#999">Sent via pavulum.com contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, sentTo: to ?? user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
