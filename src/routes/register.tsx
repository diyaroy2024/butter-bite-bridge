import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/lib/auth";
import { HandHeart, User, Mail, Lock, Building2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

type Role = "donor" | "ngo";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("donor");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setErr("Passwords do not match"); return; }
    setBusy(true); setErr(null);
    try {
      await register(name, email, password, role);
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Registration failed");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-lg px-5 py-12">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl btn-butter mb-4">
            <HandHeart className="h-7 w-7" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join our community of donors and NGOs</p>
        </div>

        <div className="card-soft p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <IconField icon={<User className="h-4 w-4" />} label="Full name" type="text" value={name} onChange={setName} placeholder="Maya Chen" />
            <IconField icon={<Mail className="h-4 w-4" />} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <div>
              <IconField icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>
            <IconField icon={<Lock className="h-4 w-4" />} label="Confirm password" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" />

            <div>
              <span className="text-sm font-semibold">I am a</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <RoleOption active={role === "donor"} onClick={() => setRole("donor")} icon={<HandHeart className="h-4 w-4" />} label="Donor" />
                <RoleOption active={role === "ngo"} onClick={() => setRole("ngo")} icon={<Building2 className="h-4 w-4" />} label="NGO" />
              </div>
            </div>

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

function IconField({ icon, label, type, value, onChange, placeholder }: { icon: React.ReactNode; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <input
          type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </label>
  );
}

function RoleOption({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-medium transition ${
        active ? "border-primary bg-primary/15 text-foreground" : "border-input bg-card text-muted-foreground hover:border-primary/40"
      }`}
    >
      {icon} {label}
    </button>
  );
}
