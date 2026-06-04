"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Submission = {
  id: string;
  type: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const TYPE_COLORS: Record<string, string> = {
  "Newsletter Signup":                    "bg-blue-500/20 text-blue-400",
  "Advanced Reader Application":          "bg-purple-500/20 text-purple-400",
  "Podcast Guest Application":            "bg-yellow-500/20 text-yellow-400",
  "Volunteer / Collaboration Application":"bg-green-500/20 text-green-400",
  "Idea Submission":                      "bg-orange-500/20 text-orange-400",
  "Contact":                              "bg-white/10 text-white/60",
};

function typeColor(type: string) {
  return TYPE_COLORS[type] ?? "bg-white/10 text-white/60";
}

export default function AdminSubmissionsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/submissions");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const markRead = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      setDeleteId(null);
      toast("Submission deleted.", "success");
    },
  });

  // Unique types for filter
  const types = ["all", ...Array.from(new Set(submissions.map((s) => s.type)))];

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.type === filter);

  const unread = submissions.filter((s) => !s.read).length;

  const toggle = (id: string, currentlyRead: boolean) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!currentlyRead) markRead.mutate({ id, read: true });
    }
  };

  return (
    <>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete submission"
        message="Permanently delete this submission? This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteId && del.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl text-white">Submissions</h1>
            <p className="mt-1 text-white/50">
              {submissions.length} total
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                  {unread} unread
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors capitalize ${
                filter === t
                  ? "bg-red-600 text-white"
                  : "border border-white/15 text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              {t === "all" ? `All (${submissions.length})` : t}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#1A1A1A]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-white/40">
            <Mail className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p>No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <div
                key={s.id}
                className={`rounded-2xl border transition-colors ${
                  s.read ? "border-white/10 bg-[#1A1A1A]" : "border-red-600/30 bg-[#1A1A1A]"
                }`}
              >
                {/* Row */}
                <div
                  className="flex cursor-pointer items-center gap-4 px-5 py-4"
                  onClick={() => toggle(s.id, s.read)}
                >
                  {/* Read indicator */}
                  <div className="shrink-0">
                    {s.read
                      ? <MailOpen className="h-4 w-4 text-white/30" />
                      : <Mail className="h-4 w-4 text-red-500" />
                    }
                  </div>

                  {/* Type badge */}
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor(s.type)}`}>
                    {s.type}
                  </span>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white">{s.name}</span>
                    <span className="ml-2 text-sm text-white/45">{s.email}</span>
                  </div>

                  {/* Date */}
                  <span className="hidden shrink-0 text-xs text-white/35 sm:block">
                    {format(new Date(s.createdAt), "MMM d, yyyy · h:mm a")}
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => markRead.mutate({ id: s.id, read: !s.read })}
                      className="rounded-lg p-1.5 text-white/30 hover:bg-white/10 hover:text-white transition-colors"
                      title={s.read ? "Mark unread" : "Mark read"}
                    >
                      {s.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="rounded-lg p-1.5 text-white/30 hover:bg-red-600/20 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expanded === s.id
                      ? <ChevronUp className="h-4 w-4 text-white/30" />
                      : <ChevronDown className="h-4 w-4 text-white/30" />
                    }
                  </div>
                </div>

                {/* Expanded message */}
                {expanded === s.id && (
                  <div className="border-t border-white/10 px-5 pb-5 pt-4">
                    <div className="flex gap-6 text-xs text-white/40 mb-3">
                      <span>From: <span className="text-white/60">{s.name}</span></span>
                      <a href={`mailto:${s.email}`} className="text-red-400 hover:underline">{s.email}</a>
                      <span>{format(new Date(s.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-xl bg-[#0C0C0C] p-4 text-sm text-white/70 leading-relaxed font-sans border border-white/10">
                      {s.message.replace(/^\[[^\]]+\]\n\n/, "")}
                    </pre>
                    <div className="mt-4">
                      <a
                        href={`mailto:${s.email}?subject=Re: ${s.type} — Pavulum`}
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm text-white hover:bg-red-500 transition-colors"
                      >
                        <Mail className="h-4 w-4" /> Reply via email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
