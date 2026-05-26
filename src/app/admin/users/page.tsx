"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type DBUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

function useUsers() {
  return useQuery<DBUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const { data: users = [], isLoading } = useUsers();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [pending, setPending] = useState<{ id: string; email: string } | null>(null);

  const handleDelete = async () => {
    if (!pending) return;
    const { id, email } = pending;
    setPending(null);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast(j.error ?? "Failed to delete user.", "error");
      return;
    }
    toast(`User "${email}" deleted.`, "success");
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <>
      <ConfirmDialog
        open={!!pending}
        title="Delete user"
        message={`Delete "${pending?.email}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />

      <div>
        <div>
          <h1 className="font-serif text-4xl text-deep-brown">Users</h1>
          <p className="mt-1 text-charcoal/70">{users.length} {users.length === 1 ? "user" : "users"}</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-charcoal/60">Loading…</td></tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-charcoal/60">No users yet.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-cream uppercase">
                        {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-deep-brown">{u.name ?? "—"}</p>
                        <p className="text-xs text-charcoal/60">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "ADMIN"
                        ? "bg-terracotta/15 text-terracotta"
                        : "bg-secondary text-charcoal/70"
                    }`}>
                      {u.role === "ADMIN" ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-charcoal/60">
                    {format(new Date(u.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      {u.id !== session?.user?.id && (
                        <button
                          onClick={() => setPending({ id: u.id, email: u.email })}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal/70 hover:bg-secondary hover:text-destructive"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
