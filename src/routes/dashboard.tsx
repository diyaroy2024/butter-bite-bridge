import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/lib/auth";
import { Apple, Clock, MapPin, Plus, UtensilsCrossed, CheckCircle2, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type Donation = {
  id: string; donorName: string; foodName: string; quantity: string;
  pickupLocation: string; expiresAt: string; status: "available" | "claimed" | "delivered";
  claimedBy?: string; createdAt: string;
};

function Dashboard() {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/donations");
    const d = await r.json();
    setDonations(d.donations || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const claim = async (id: string) => {
    if (!token) return;
    const r = await fetch(`/api/donations/${id}/claim`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.ok) load();
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Available donations</h1>
            <p className="text-muted-foreground mt-1">Fresh meals waiting for someone to claim them.</p>
          </div>
          {user ? (
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-butter font-semibold">
              <Plus className="h-4 w-4" /> Donate food
            </button>
          ) : (
            <Link to="/login" className="px-5 py-3 rounded-xl btn-butter font-semibold">Sign in to donate</Link>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : donations.length === 0 ? (
          <div className="card-soft p-12 text-center">
            <UtensilsCrossed className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No donations yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {donations.map((d) => <Card key={d.id} d={d} onClaim={() => claim(d.id)} canClaim={!!user && d.status === "available"} />)}
          </div>
        )}
      </main>

      {open && <DonateModal token={token!} onClose={() => setOpen(false)} onCreated={() => { setOpen(false); load(); }} />}
    </>
  );
}

function Card({ d, onClaim, canClaim }: { d: Donation; onClaim: () => void; canClaim: boolean }) {
  const expires = new Date(d.expiresAt);
  const hours = Math.max(0, Math.round((expires.getTime() - Date.now()) / 3600000));
  return (
    <article className="card-soft p-6 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg btn-butter">
          <Apple className="h-5 w-5" />
        </div>
        <StatusBadge status={d.status} />
      </div>
      <h3 className="mt-4 text-xl font-bold">{d.foodName}</h3>
      <p className="text-sm text-muted-foreground">{d.quantity} · from {d.donorName}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {d.pickupLocation}</div>
        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Expires in ~{hours}h</div>
      </dl>
      <div className="mt-5">
        {d.status === "available" ? (
          <button disabled={!canClaim} onClick={onClaim}
            className="w-full py-2.5 rounded-lg btn-butter font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {canClaim ? "Claim donation" : "Sign in to claim"}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground italic">Claimed by {d.claimedBy}</p>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: Donation["status"] }) {
  const cfg = status === "available"
    ? { label: "Available", cls: "bg-accent text-accent-foreground" }
    : status === "claimed"
      ? { label: "Claimed", cls: "bg-secondary text-secondary-foreground" }
      : { label: "Delivered", cls: "bg-secondary text-secondary-foreground" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.cls}`}>
      {status === "available" && <CheckCircle2 className="h-3 w-3" />} {cfg.label}
    </span>
  );
}

function DonateModal({ token, onClose, onCreated }: { token: string; onClose: () => void; onCreated: () => void }) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [hours, setHours] = useState("6");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const expiresAt = new Date(Date.now() + Number(hours) * 3600000).toISOString();
    const r = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ foodName, quantity, pickupLocation, expiresAt }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(data.error || "Failed"); return; }
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="card-soft w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Donate food</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Food name" value={foodName} onChange={setFoodName} placeholder="Veggie Sandwiches" />
          <Input label="Quantity" value={quantity} onChange={setQuantity} placeholder="25 packs" />
          <Input label="Pickup location" value={pickupLocation} onChange={setPickupLocation} placeholder="8 Park Avenue" />
          <Input label="Expires in (hours)" type="number" value={hours} onChange={setHours} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} className="w-full py-3 rounded-xl btn-butter font-semibold disabled:opacity-60">
            {busy ? "Posting…" : "Post donation"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
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
