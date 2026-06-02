import nodemailer from "nodemailer";

// Reuse transporter across requests in development (hot-reload safe)
const globalForMailer = globalThis as unknown as { mailer?: nodemailer.Transporter };

export const transporter =
  globalForMailer.mailer ??
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

if (process.env.NODE_ENV !== "production") globalForMailer.mailer = transporter;

export async function sendContactEmail({
  fromName,
  fromEmail,
  message,
}: {
  fromName: string;
  fromEmail: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"Pavulum Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_TO ?? "pavulumconnect@gmail.com",
    replyTo: `"${fromName}" <${fromEmail}>`,
    subject: `New message from ${fromName} — Pavulum`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#C0392B">New contact message</h2>
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p style="white-space:pre-wrap">${message}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p style="font-size:12px;color:#999">Sent via pavulum.com contact form</p>
      </div>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string) {
  await transporter.sendMail({
    from: `"Pavulum" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Welcome to The Pavulum Letter",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#C0392B">You're in.</h2>
        <p>Thanks for subscribing to The Pavulum Letter.</p>
        <p>You'll hear from us on Sundays — honest writing on parenting, relationships, and self-awareness. No spam, ever.</p>
        <p style="margin-top:24px;font-style:italic">Learn. Love. Laugh.<br/>— Pav King</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">You subscribed at pavulum.com. <a href="mailto:pavulumconnect@gmail.com">Unsubscribe</a> anytime.</p>
      </div>
    `,
  });
}
