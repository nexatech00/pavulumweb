"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Essay = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  published: boolean;
  order: number;
};

const EMPTY: Omit<Essay, "id"> = {
  title: "",
  excerpt: "",
  content: "",
  readTime: "",
  published: true,
  order: 0,
};

export default function AdminEssaysPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Omit<Essay, "id"> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const { data: essays = [], isLoading } = useQuery<Essay[]>({
    queryKey: ["admin-essays"],
    queryFn: async () => {
      const res = await fetch("/api/admin/essays");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const save = useMutation({
    mutationFn: async (data: Omit<Essay, "id">) => {
      const url = editId ? `/api/admin/essays/${editId}` : "/api/admin/essays";
      const res = await fetch(url, {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-essays"] });
      setForm(null);
      setEditId(null);
      setMsg({ text: editId ? "Essay updated." : "Essay created.", ok: true });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: (e: Error) => setMsg({ text: e.message, ok: false }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/essays/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-essays"] });
      setDeleteId(null);
    },
  });

  const openNew = () => { setEditId(null); setForm({ ...EMPTY }); };
  const openEdit = (e: Essay) => {
    setEditId(e.id);
    setForm({ title: e.title, excerpt: e.excerpt, content: e.content, readTime: e.readTime, published: e.published, order: e.order });
  };

  const input = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-deep-brown">Essays</h1>
          <p className="mt-1 text-charcoal/60">Manage articles and reflections shown on the insights page.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
          <Plus className="h-4 w-4" /> New essay
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
          <h2 className="font-serif text-xl text-deep-brown mb-5">{editId ? "Edit essay" : "New essay"}</h2>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Title *</label>
                <input required className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Read time *</label>
                <input required placeholder="e.g. 5 min read" className={input} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Excerpt * <span className="normal-case text-charcoal/40">(shown on listings)</span></label>
              <textarea required rows={3} className={`${input} resize-none`} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Full content <span className="normal-case text-charcoal/40">(optional)</span></label>
              <textarea rows={6} className={`${input} resize-y`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
      ) : essays.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-charcoal/50">
          <p>No essays yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Title</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50 hidden sm:table-cell">Read time</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {essays.map((essay) => (
                <tr key={essay.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-deep-brown">{essay.title}</p>
                    <p className="text-xs text-charcoal/50 line-clamp-1 mt-0.5">{essay.excerpt}</p>
                  </td>
                  <td className="px-5 py-4 text-charcoal/60 hidden sm:table-cell">{essay.readTime}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${essay.published ? "bg-green-100 text-green-700" : "bg-secondary text-charcoal/60"}`}>
                      {essay.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(essay)} className="rounded-lg p-2 text-charcoal/50 hover:bg-secondary hover:text-terracotta transition-colors" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(essay.id)} className="rounded-lg p-2 text-charcoal/50 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Delete">
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
        title="Delete essay?"
        description="This will permanently remove the essay from the site."
        confirmLabel="Delete"
        onConfirm={() => deleteId && del.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
