"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ── Storage keys ──────────────────────────────────────────────────────────
const ADMIN_CREDS_KEY = "pavulum_creds";
const SESSION_KEY = "pavulum_session";
const USERS_KEY = "pavulum_users";

// ── Default admin credentials ─────────────────────────────────────────────
const DEFAULT_ADMIN_EMAIL = "admin@pavulum.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

// ── Types ─────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
};

type StoredUser = User & { password: string };

type AuthCtx = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (fields: { name?: string; email?: string }) => Promise<{ error?: string }>;
  updateCredentials: (currentPassword: string, newEmail: string, newPassword: string) => Promise<{ error?: string }>;
};

// ── Helpers ───────────────────────────────────────────────────────────────
function loadAdminCreds(): { email: string; password: string } {
  try {
    const s = localStorage.getItem(ADMIN_CREDS_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD };
}

function loadUsers(): StoredUser[] {
  try {
    const s = localStorage.getItem(USERS_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Context ───────────────────────────────────────────────────────────────
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setUser(JSON.parse(s));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User) => {
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  // ── Sign in ──────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const trimmed = email.trim().toLowerCase();

    // Check admin first
    const adminCreds = loadAdminCreds();
    if (trimmed === adminCreds.email.toLowerCase() && password === adminCreds.password) {
      persist({ id: "admin-1", email: adminCreds.email, name: "Admin", role: "admin" });
      return {};
    }

    // Check normal users
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!found) return { error: "No account found with that email." };
    if (found.password !== password) return { error: "Incorrect password." };

    persist({ id: found.id, email: found.email, name: found.name, role: "user" });
    return {};
  };

  // ── Sign up ──────────────────────────────────────────────────────────
  const signUp = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const users = loadUsers();

    if (users.find((u) => u.email.toLowerCase() === trimmed)) {
      return { error: "An account with that email already exists." };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email: trimmed,
      name: name.trim(),
      role: "user",
      password,
    };
    saveUsers([...users, newUser]);
    persist({ id: newUser.id, email: newUser.email, name: newUser.name, role: "user" });
    return {};
  };

  // ── Sign out ─────────────────────────────────────────────────────────
  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // ── Update profile (name / email) ────────────────────────────────────
  const updateProfile = async (fields: { name?: string; email?: string }): Promise<{ error?: string }> => {
    if (!user) return { error: "Not signed in." };

    if (user.role === "admin") {
      const updated: User = { ...user, ...fields };
      persist(updated);
      return {};
    }

    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { error: "User not found." };

    if (fields.email) {
      const conflict = users.find(
        (u) => u.email.toLowerCase() === fields.email!.trim().toLowerCase() && u.id !== user.id,
      );
      if (conflict) return { error: "That email is already in use." };
    }

    const updated: StoredUser = {
      ...users[idx],
      name: fields.name?.trim() ?? users[idx].name,
      email: fields.email?.trim().toLowerCase() ?? users[idx].email,
    };
    const newUsers = [...users];
    newUsers[idx] = updated;
    saveUsers(newUsers);
    persist({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
    return {};
  };

  // ── Update credentials (admin password change) ───────────────────────
  const updateCredentials = async (
    currentPassword: string,
    newEmail: string,
    newPassword: string,
  ): Promise<{ error?: string }> => {
    if (!user) return { error: "Not signed in." };

    if (user.role === "admin") {
      const creds = loadAdminCreds();
      if (currentPassword !== creds.password) return { error: "Current password is incorrect." };
      const updated = { email: newEmail.trim().toLowerCase(), password: newPassword };
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));
      persist({ ...user, email: updated.email });
      return {};
    }

    // Normal user password change
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { error: "User not found." };
    if (users[idx].password !== currentPassword) return { error: "Current password is incorrect." };

    const updated: StoredUser = {
      ...users[idx],
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
    };
    const newUsers = [...users];
    newUsers[idx] = updated;
    saveUsers(newUsers);
    persist({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
    return {};
  };

  return (
    <Ctx.Provider value={{ user, isAdmin: user?.role === "admin", loading, signIn, signUp, signOut, updateProfile, updateCredentials }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
