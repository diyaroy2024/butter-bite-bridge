import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/lib/auth";
import { HandHeart } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setBusy(true); setErr(null);
    try {
      await register(name, email, password);
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Registration failed");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="card-soft p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl btn-butter">
              <HandHeart className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold">Join ButterShare</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Name" type="text" value={name} onChange={setName} placeholder="Sunrise Bakery" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@kitchen.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={busy} className="w-full py-3 rounded-xl btn-butter font-semibold disabled:opacity-60">
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already a member? <Link to="/login" className="text-foreground font-medium underline underline-offset-4">Sign in</Link>
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
