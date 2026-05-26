"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!currentPassword) {
      return setMsg({ text: "Enter your current password to confirm changes.", ok: false });
    }
    setSaving(true);
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail,
        currentPassword,
        ...(newPassword ? { newPassword } : {}),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json();
      return setMsg({ text: j.error ?? "Update failed.", ok: false });
    }
    await update({ email: newEmail });
    setMsg({ text: "Credentials updated successfully.", ok: true });
    setCurrentPassword("");
    setNewPassword("");
  };

  const input =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none";

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-4xl text-deep-brown">Edit profile</h1>
      <p className="mt-1 text-charcoal/70">Update your login email and password.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">
            Email <span className="text-terracotta">*</span>
          </label>
          <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={input} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">
            New password{" "}
            <span className="normal-case text-charcoal/40">(leave blank to keep current)</span>
          </label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            minLength={newPassword ? 6 : undefined}
            className={input}
          />
        </div>

        <div className="border-t border-border pt-1" />

        <div className="rounded-2xl bg-secondary/60 px-5 py-4">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">
            Current password <span className="text-terracotta">*</span>
          </label>
          <PasswordInput
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Required to confirm any changes"
            className={input}
          />
          <p className="mt-2 text-xs text-charcoal/50">You must enter your current password to save changes.</p>
        </div>

        {msg && (
          <p className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
            {msg.ok && <CheckCircle className="h-4 w-4" />}
            {msg.text}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving} className="rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
