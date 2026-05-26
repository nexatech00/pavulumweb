"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Episode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
  published: boolean;
  order: number;
};

const EMPTY: Omit<Episode, "id"> = {
  title: "",
  description: "",
  duration: "",
  spotifyUrl: "",
  appleUrl: "",
  youtubeUrl: "",
  published: true,
  order: 0,
};

export default function AdminEpisodesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Omit<Episode, "id"> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const { data: episodes = [], isLoading } = useQuery<Episode[]>({
    queryKey: ["admin-episodes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/episodes");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const save = useMutation({
    mutationFn: async (data: Omit<Episode, "id">) => {
      const url = editId ? `/api/admin/episodes/${editId}` : "/api/admin/episodes";
      const res = await fetch(url, {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-episodes"] });
      setForm(null);
      setEditId(null);
      setMsg({ text: editId ? "Episode updated." : "Episode created.", ok: true });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: (e: Error) => setMsg({ text: e.message, ok: false }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-episodes"] });
      setDeleteId(null);
    },
  });

  const openNew = () => { setEditId(null); setForm({ ...EMPTY }); };
  const openEdit = (ep: Episode) => {
    setEditId(ep.id);
    setForm({
      title: ep.title, description: ep.description, duration: ep.duration,
      spotifyUrl: ep.spotifyUrl ?? "", appleUrl: ep.appleUrl ?? "",
      youtubeUrl: ep.youtubeUrl ?? "", published: ep.published, order: ep.order,
    });
  };

  const input = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-deep-brown">Episodes</h1>
          <p className="mt-1 text-charcoal/60">Manage podcast episodes shown on the site.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
          <Plus className="h-4 w-4" /> New episode
        </button>
      </div>

      {msg && (
        <div className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.ok ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {msg.text}
        </div>
      )}

      {/* Form */}
      {form && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl text-deep-brown mb-5">{editId ? "Edit episode" : "New episode"}</h2>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Title *</label>
                <input required className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Duration *</label>
                <input required placeholder="e.g. 42 min" className={input} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Description *</label>
              <textarea required rows={3} className={`${input} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Spotify URL</label>
                <input type="url" className={input} placeholder="https://open.spotify.com/…" value={form.spotifyUrl ?? ""} onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Apple Podcasts URL</label>
                <input type="url" className={input} placeholder="https://podcasts.apple.com/…" value={form.appleUrl ?? ""} onChange={(e) => setForm({ ...form, appleUrl: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">YouTube URL</label>
                <input type="url" className={input} placeholder="https://youtube.com/…" value={form.youtubeUrl ?? ""} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Order</label>
                <input type="number" className={`${input} w-24`} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-5">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-border accent-terracotta" />
                <span className="text-sm text-charcoal/80">Published</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={save.isPending} className="rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
                {save.isPending ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setForm(null); setEditId(null); }} className="rounded-full border border-border px-6 py-2.5 text-sm text-charcoal/70 hover:bg-secondary transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}
        </div>
      ) : episodes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-charcoal/50">
          <p>No episodes yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Title</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50 hidden sm:table-cell">Duration</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50 hidden md:table-cell">Links</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-deep-brown">{ep.title}</p>
                    <p className="text-xs text-charcoal/50 line-clamp-1 mt-0.5">{ep.description}</p>
                  </td>
                  <td className="px-5 py-4 text-charcoal/60 hidden sm:table-cell">{ep.duration}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex gap-2">
                      {ep.spotifyUrl && <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-soft-gold hover:text-terracotta flex items-center gap-0.5">Spotify <ExternalLink className="h-3 w-3" /></a>}
                      {ep.appleUrl && <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-soft-gold hover:text-terracotta flex items-center gap-0.5">Apple <ExternalLink className="h-3 w-3" /></a>}
                      {ep.youtubeUrl && <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-soft-gold hover:text-terracotta flex items-center gap-0.5">YouTube <ExternalLink className="h-3 w-3" /></a>}
                      {!ep.spotifyUrl && !ep.appleUrl && !ep.youtubeUrl && <span className="text-xs text-charcoal/40">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ep.published ? "bg-green-100 text-green-700" : "bg-secondary text-charcoal/60"}`}>
                      {ep.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(ep)} className="rounded-lg p-2 text-charcoal/50 hover:bg-secondary hover:text-terracotta transition-colors" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(ep.id)} className="rounded-lg p-2 text-charcoal/50 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete episode?"
        description="This will permanently remove the episode from the site."
        confirmLabel="Delete"
        onConfirm={() => deleteId && del.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
