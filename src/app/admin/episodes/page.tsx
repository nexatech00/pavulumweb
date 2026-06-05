"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, CheckCircle, XCircle,
  ExternalLink, Upload, X, Loader2, Lock, Unlock,
  ChevronDown, Mic2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

/* ── Types ── */
type Podcast = {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  category: string;
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
  published: boolean;
  order: number;
  episodes: { id: string }[];
};

type Episode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  coverImage: string | null;
  price: number;
  free: boolean;
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
  published: boolean;
  order: number;
  podcastId: string | null;
};

type PodcastForm = Omit<Podcast, "id" | "episodes">;
type EpisodeForm = Omit<Episode, "id">;

const PODCAST_CATEGORIES = [
  "General", "Relationships", "Parenting", "Personal Growth",
  "Family", "Modern Culture", "Communication", "Accountability",
  "Self-Awareness", "Life Lessons",
];

const EMPTY_PODCAST: PodcastForm = {
  title: "", description: "", coverImage: null, category: "General",
  spotifyUrl: "", appleUrl: "", youtubeUrl: "", published: true, order: 0,
};

const EMPTY_EPISODE: EpisodeForm = {
  title: "", description: "", duration: "", coverImage: null,
  price: 0, free: true, spotifyUrl: "", appleUrl: "", youtubeUrl: "",
  published: true, order: 0, podcastId: null,
};

/* ── Shared input style ── */
const inp = "w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none text-sm";

export default function AdminEpisodesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"podcasts" | "episodes">("podcasts");

  /* ── Podcast state ── */
  const [podForm, setPodForm] = useState<PodcastForm | null>(null);
  const [podEditId, setPodEditId] = useState<string | null>(null);
  const [podDeleteId, setPodDeleteId] = useState<string | null>(null);
  const [podUploading, setPodUploading] = useState(false);
  const podThumbRef = useRef<HTMLInputElement>(null);

  /* ── Episode state ── */
  const [epForm, setEpForm] = useState<EpisodeForm | null>(null);
  const [epEditId, setEpEditId] = useState<string | null>(null);
  const [epDeleteId, setEpDeleteId] = useState<string | null>(null);
  const [epUploading, setEpUploading] = useState(false);
  const epThumbRef = useRef<HTMLInputElement>(null);

  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const flash = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  /* ── Queries ── */
  const { data: podcasts = [], isLoading: podLoading } = useQuery<Podcast[]>({
    queryKey: ["admin-podcasts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/podcasts");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: episodes = [], isLoading: epLoading } = useQuery<Episode[]>({
    queryKey: ["admin-episodes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/episodes");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  /* ── Podcast mutations ── */
  const savePodcast = useMutation({
    mutationFn: async (data: PodcastForm) => {
      const url = podEditId ? `/api/admin/podcasts/${podEditId}` : "/api/admin/podcasts";
      const res = await fetch(url, {
        method: podEditId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-podcasts"] });
      setPodForm(null); setPodEditId(null);
      flash(podEditId ? "Podcast updated." : "Podcast created.");
    },
    onError: (e: Error) => flash(e.message, false),
  });

  const delPodcast = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/podcasts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); setPodDeleteId(null); },
  });

  /* ── Episode mutations ── */
  const saveEpisode = useMutation({
    mutationFn: async (data: EpisodeForm) => {
      const url = epEditId ? `/api/admin/episodes/${epEditId}` : "/api/admin/episodes";
      const res = await fetch(url, {
        method: epEditId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-episodes"] });
      setEpForm(null); setEpEditId(null);
      flash(epEditId ? "Episode updated." : "Episode created.");
    },
    onError: (e: Error) => flash(e.message, false),
  });

  const delEpisode = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-episodes"] }); setEpDeleteId(null); },
  });

  /* ── Upload helpers ── */
  const uploadImg = async (
    file: File,
    setUploading: (v: boolean) => void,
    onUrl: (url: string) => void,
    ref: React.RefObject<HTMLInputElement | null>,
  ) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) { const { url } = await res.json(); onUrl(url); }
    setUploading(false);
    if (ref.current) ref.current.value = "";
  };

  /* ── Podcast form helpers ── */
  const openNewPodcast = () => { setPodEditId(null); setPodForm({ ...EMPTY_PODCAST }); };
  const openEditPodcast = (p: Podcast) => {
    setPodEditId(p.id);
    setPodForm({
      title: p.title, description: p.description, coverImage: p.coverImage,
      category: p.category, spotifyUrl: p.spotifyUrl ?? "",
      appleUrl: p.appleUrl ?? "", youtubeUrl: p.youtubeUrl ?? "",
      published: p.published, order: p.order,
    });
  };

  /* ── Episode form helpers ── */
  const openNewEpisode = (podcastId?: string) => {
    setEpEditId(null);
    setEpForm({ ...EMPTY_EPISODE, podcastId: podcastId ?? null });
    setTab("episodes");
  };
  const openEditEpisode = (ep: Episode) => {
    setEpEditId(ep.id);
    setEpForm({
      title: ep.title, description: ep.description, duration: ep.duration,
      coverImage: ep.coverImage, price: ep.price, free: ep.free,
      spotifyUrl: ep.spotifyUrl ?? "", appleUrl: ep.appleUrl ?? "",
      youtubeUrl: ep.youtubeUrl ?? "", published: ep.published,
      order: ep.order, podcastId: ep.podcastId,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-4xl text-white">Podcast</h1>
          <p className="mt-1 text-white/50">Manage podcast shows and their episodes.</p>
        </div>
        <div className="flex gap-2">
          {tab === "podcasts" ? (
            <button onClick={openNewPodcast}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
              <Plus className="h-4 w-4" /> New show
            </button>
          ) : (
            <button onClick={() => openNewEpisode()}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
              <Plus className="h-4 w-4" /> New episode
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-[#111111] p-1 w-fit">
        {(["podcasts", "episodes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-red-600 text-white" : "text-white/50 hover:text-white"}`}>
            {t === "podcasts" ? `Shows (${podcasts.length})` : `Episodes (${episodes.length})`}
          </button>
        ))}
      </div>

      {/* Toast */}
      {msg && (
        <div className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-green-900/30 border border-green-700/40 text-green-400" : "bg-red-900/30 border border-red-700/40 text-red-400"}`}>
          {msg.ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          {msg.text}
        </div>
      )}

      {/* ════════════ PODCASTS TAB ════════════ */}
      {tab === "podcasts" && (
        <>
          {/* Podcast form */}
          {podForm && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#111111] p-6">
              <h2 className="font-serif text-xl text-white mb-6">{podEditId ? "Edit show" : "New show"}</h2>
              <form onSubmit={(e) => { e.preventDefault(); savePodcast.mutate(podForm); }} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Title *</label>
                    <input required className={inp} value={podForm.title} onChange={(e) => setPodForm({ ...podForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Category</label>
                    <div className="relative">
                      <select className={`${inp} appearance-none pr-8`} value={podForm.category}
                        onChange={(e) => setPodForm({ ...podForm, category: e.target.value })}>
                        {PODCAST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Description *</label>
                  <textarea required rows={3} className={`${inp} resize-none`} value={podForm.description}
                    onChange={(e) => setPodForm({ ...podForm, description: e.target.value })} />
                </div>

                {/* Cover image */}
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Cover Image</label>
                  <div className="flex items-start gap-4">
                    {podForm.coverImage && (
                      <div className="relative shrink-0">
                        <Image src={podForm.coverImage} alt="Cover" width={80} height={80}
                          className="h-20 w-20 rounded-xl object-cover border border-white/15" />
                        <button type="button" onClick={() => setPodForm({ ...podForm, coverImage: null })}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 hover:border-red-500 transition-colors">
                      {podUploading ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Upload className="h-4 w-4 text-white/40" />}
                      <span className="text-sm text-white/50">{podUploading ? "Uploading…" : "Upload cover"}</span>
                      <input ref={podThumbRef} type="file" accept="image/*" className="hidden" disabled={podUploading}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f, setPodUploading, (url) => setPodForm((p) => p ? { ...p, coverImage: url } : p), podThumbRef); }} />
                    </label>
                  </div>
                </div>

                {/* Platform links */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Spotify URL", key: "spotifyUrl", placeholder: "https://open.spotify.com/…" },
                    { label: "Apple Podcasts URL", key: "appleUrl", placeholder: "https://podcasts.apple.com/…" },
                    { label: "YouTube URL", key: "youtubeUrl", placeholder: "https://youtube.com/…" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs text-white/40">{label}</label>
                      <input type="url" className={inp} placeholder={placeholder}
                        value={(podForm as Record<string, unknown>)[key] as string ?? ""}
                        onChange={(e) => setPodForm({ ...podForm, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Order</label>
                    <input type="number" className={`${inp} w-24`} value={podForm.order}
                      onChange={(e) => setPodForm({ ...podForm, order: Number(e.target.value) })} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 mt-5">
                    <input type="checkbox" checked={podForm.published} className="h-4 w-4 accent-red-600"
                      onChange={(e) => setPodForm({ ...podForm, published: e.target.checked })} />
                    <span className="text-sm text-white/70">Published</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={savePodcast.isPending || podUploading}
                    className="rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
                    {savePodcast.isPending ? "Saving…" : podEditId ? "Update show" : "Create show"}
                  </button>
                  <button type="button" onClick={() => { setPodForm(null); setPodEditId(null); }}
                    className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Podcast cards list */}
          {podLoading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#1A1A1A]" />)}</div>
          ) : podcasts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/40">
              <Mic2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
              <p>No podcast shows yet. Create your first one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {podcasts.map((pod) => (
                <div key={pod.id} className="rounded-2xl border border-white/10 bg-[#111111] overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4">
                    {pod.coverImage ? (
                      <Image src={pod.coverImage} alt="" width={56} height={56}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Mic2 className="h-6 w-6 text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{pod.title}</p>
                        <span className="rounded-full bg-red-600/20 border border-red-600/30 px-2 py-0.5 text-[10px] text-red-400">{pod.category}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${pod.published ? "bg-green-900/30 text-green-400 border border-green-700/30" : "bg-white/10 text-white/40"}`}>
                          {pod.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{pod.description}</p>
                      <p className="text-xs text-white/30 mt-1">{pod.episodes.length} episode{pod.episodes.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openNewEpisode(pod.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                        <Plus className="h-3 w-3" /> Episode
                      </button>
                      <button onClick={() => openEditPodcast(pod)}
                        className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setPodDeleteId(pod.id)}
                        className="rounded-lg p-2 text-white/30 hover:bg-red-600/20 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════ EPISODES TAB ════════════ */}
      {tab === "episodes" && (
        <>
          {/* Episode form */}
          {epForm && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#111111] p-6">
              <h2 className="font-serif text-xl text-white mb-6">{epEditId ? "Edit episode" : "New episode"}</h2>
              <form onSubmit={(e) => { e.preventDefault(); saveEpisode.mutate(epForm); }} className="space-y-5">

                {/* Parent podcast */}
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Parent Show</label>
                  <div className="relative">
                    <select className={`${inp} appearance-none pr-8`} value={epForm.podcastId ?? ""}
                      onChange={(e) => setEpForm({ ...epForm, podcastId: e.target.value || null })}>
                      <option value="">— Standalone episode —</option>
                      {podcasts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Title *</label>
                    <input required className={inp} value={epForm.title} onChange={(e) => setEpForm({ ...epForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Duration *</label>
                    <input required placeholder="e.g. 42 min" className={inp} value={epForm.duration}
                      onChange={(e) => setEpForm({ ...epForm, duration: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Description *</label>
                  <textarea required rows={3} className={`${inp} resize-none`} value={epForm.description}
                    onChange={(e) => setEpForm({ ...epForm, description: e.target.value })} />
                </div>

                {/* Cover image */}
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Cover Image</label>
                  <div className="flex items-start gap-4">
                    {epForm.coverImage && (
                      <div className="relative shrink-0">
                        <Image src={epForm.coverImage} alt="Cover" width={80} height={80}
                          className="h-20 w-20 rounded-xl object-cover border border-white/15" />
                        <button type="button" onClick={() => setEpForm({ ...epForm, coverImage: null })}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 hover:border-red-500 transition-colors">
                      {epUploading ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Upload className="h-4 w-4 text-white/40" />}
                      <span className="text-sm text-white/50">{epUploading ? "Uploading…" : "Upload cover image"}</span>
                      <input ref={epThumbRef} type="file" accept="image/*" className="hidden" disabled={epUploading}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f, setEpUploading, (url) => setEpForm((p) => p ? { ...p, coverImage: url } : p), epThumbRef); }} />
                    </label>
                  </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-white/10 bg-[#0C0C0C] p-4 space-y-3">
                  <p className="text-xs uppercase tracking-wider text-white/50">Pricing</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5">
                      <input type="checkbox" checked={epForm.free} className="h-4 w-4 accent-red-600"
                        onChange={(e) => setEpForm({ ...epForm, free: e.target.checked, price: e.target.checked ? 0 : epForm.price })} />
                      <span className="flex items-center gap-2 text-sm text-white/70">
                        <Unlock className="h-4 w-4 text-green-400" /> Free episode
                      </span>
                    </label>
                    {!epForm.free && (
                      <div>
                        <label className="mb-1 block text-xs text-white/50">Price (USD) *</label>
                        <input type="number" step="0.01" min="0.01" required={!epForm.free}
                          className={`${inp} w-32`} value={epForm.price || ""} placeholder="9.99"
                          onChange={(e) => setEpForm({ ...epForm, price: parseFloat(e.target.value) || 0 })} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform links */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Spotify URL", key: "spotifyUrl", ph: "https://open.spotify.com/…" },
                    { label: "Apple Podcasts URL", key: "appleUrl", ph: "https://podcasts.apple.com/…" },
                    { label: "YouTube URL", key: "youtubeUrl", ph: "https://youtube.com/…" },
                  ].map(({ label, key, ph }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs text-white/40">{label}</label>
                      <input type="url" className={inp} placeholder={ph}
                        value={(epForm as Record<string, unknown>)[key] as string ?? ""}
                        onChange={(e) => setEpForm({ ...epForm, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Order</label>
                    <input type="number" className={`${inp} w-24`} value={epForm.order}
                      onChange={(e) => setEpForm({ ...epForm, order: Number(e.target.value) })} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 mt-5">
                    <input type="checkbox" checked={epForm.published} className="h-4 w-4 accent-red-600"
                      onChange={(e) => setEpForm({ ...epForm, published: e.target.checked })} />
                    <span className="text-sm text-white/70">Published</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saveEpisode.isPending || epUploading}
                    className="rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
                    {saveEpisode.isPending ? "Saving…" : epEditId ? "Update episode" : "Create episode"}
                  </button>
                  <button type="button" onClick={() => { setEpForm(null); setEpEditId(null); }}
                    className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Episodes table */}
          {epLoading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#1A1A1A]" />)}</div>
          ) : episodes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/40">
              <p>No episodes yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40">Episode</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40 hidden sm:table-cell">Show</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40 hidden sm:table-cell">Duration</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40 hidden md:table-cell">Price</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40 hidden md:table-cell">Links</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-white/40">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {episodes.map((ep) => {
                    const parentPodcast = podcasts.find((p) => p.id === ep.podcastId);
                    return (
                      <tr key={ep.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {ep.coverImage ? (
                              <Image src={ep.coverImage} alt="" width={40} height={40}
                                className="h-10 w-10 shrink-0 rounded-lg object-cover border border-white/10" />
                            ) : (
                              <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/10" />
                            )}
                            <div>
                              <p className="font-medium text-white">{ep.title}</p>
                              <p className="text-xs text-white/40 line-clamp-1">{ep.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          {parentPodcast ? (
                            <span className="text-xs text-red-400">{parentPodcast.title}</span>
                          ) : (
                            <span className="text-xs text-white/30">Standalone</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-white/50 hidden sm:table-cell">{ep.duration}</td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          {ep.free ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-900/30 border border-green-700/30 px-2.5 py-0.5 text-xs text-green-400">
                              <Unlock className="h-3 w-3" /> Free
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 border border-red-600/30 px-2.5 py-0.5 text-xs text-red-400">
                              <Lock className="h-3 w-3" /> ${ep.price.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex gap-2">
                            {ep.spotifyUrl && <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-red-400 flex items-center gap-0.5">Spotify <ExternalLink className="h-3 w-3" /></a>}
                            {ep.appleUrl && <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-red-400 flex items-center gap-0.5">Apple <ExternalLink className="h-3 w-3" /></a>}
                            {ep.youtubeUrl && <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-red-400 flex items-center gap-0.5">YouTube <ExternalLink className="h-3 w-3" /></a>}
                            {!ep.spotifyUrl && !ep.appleUrl && !ep.youtubeUrl && <span className="text-xs text-white/25">—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ep.published ? "bg-green-900/30 text-green-400 border border-green-700/30" : "bg-white/10 text-white/50"}`}>
                            {ep.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditEpisode(ep)} className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white transition-colors"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => setEpDeleteId(ep.id)} className="rounded-lg p-2 text-white/30 hover:bg-red-600/20 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ConfirmDialog open={!!podDeleteId} title="Delete show?" destructive confirmLabel="Delete"
        message="This will delete the show. Episodes will remain but become standalone."
        onConfirm={() => podDeleteId && delPodcast.mutate(podDeleteId)}
        onCancel={() => setPodDeleteId(null)} />

      <ConfirmDialog open={!!epDeleteId} title="Delete episode?" destructive confirmLabel="Delete"
        message="This will permanently remove the episode."
        onConfirm={() => epDeleteId && delEpisode.mutate(epDeleteId)}
        onCancel={() => setEpDeleteId(null)} />
    </div>
  );
}
