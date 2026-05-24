import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/lib/auth";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="card-soft p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl btn-butter">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold">Welcome back</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@kitchen.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={busy} className="w-full py-3 rounded-xl btn-butter font-semibold disabled:opacity-60">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here? <Link to="/register" className="text-foreground font-medium underline underline-offset-4">Create an account</Link>
          </p>
        </div>
      </main>
    </>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full px-4 py-2.5 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
