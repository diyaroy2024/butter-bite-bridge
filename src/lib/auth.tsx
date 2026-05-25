import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type Role = "donor" | "ngo";
type User = { id: string; email: string; name: string; role: Role };
type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "ecomeal_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!t) { setLoading(false); return; }
    setToken(t);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => { localStorage.removeItem(KEY); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const handle = useCallback(async (path: string, body: unknown) => {
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Request failed");
    localStorage.setItem(KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user, token, loading,
        login: (email, password) => handle("/api/auth/login", { email, password }),
        register: (name, email, password, role) => handle("/api/auth/register", { name, email, password, role }),
        logout: () => { localStorage.removeItem(KEY); setToken(null); setUser(null); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be inside AuthProvider");
  return v;
}
