import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Apple, HandHeart, Sandwich, Sparkles, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="pt-16 pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> REST API + JWT powered
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-[1.05]">
              Share a meal.<br />
              <span className="text-[color:var(--butter-deep)]">Save the day.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              ButterShare connects restaurants, bakeries and homes with neighbors and NGOs.
              List surplus food in seconds — secured end‑to‑end with JWT auth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="px-6 py-3 rounded-xl btn-butter font-semibold">
                Start donating
              </Link>
              <Link to="/dashboard" className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary font-medium">
                Browse donations
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-muted-foreground">
              <div><div className="text-2xl font-display font-bold text-foreground">12k+</div>Meals shared</div>
              <div><div className="text-2xl font-display font-bold text-foreground">320</div>Active donors</div>
              <div><div className="text-2xl font-display font-bold text-foreground">48</div>Partner NGOs</div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-60 rounded-full"
                 style={{ background: "radial-gradient(circle, var(--butter) 0%, transparent 70%)" }} />
            <div className="card-soft p-6 grid grid-cols-2 gap-4">
              <FoodTile icon={<Sandwich className="h-7 w-7" />} title="Sandwiches" qty="25 packs" />
              <FoodTile icon={<Apple className="h-7 w-7" />} title="Fresh Fruit" qty="18 kg" />
              <FoodTile icon={<HandHeart className="h-7 w-7" />} title="Hot Meals" qty="40 boxes" />
              <FoodTile icon={<Sparkles className="h-7 w-7" />} title="Bakery" qty="60 items" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-24 grid md:grid-cols-3 gap-5">
          <Feature icon={<Zap />} title="Instant listings"
            body="Donors post surplus food in seconds. Claim it before it expires." />
          <Feature icon={<ShieldCheck />} title="JWT secured"
            body="Every action is authorized via JSON Web Tokens — stateless and fast." />
          <Feature icon={<HandHeart />} title="Built for impact"
            body="Track meals saved and connect with verified volunteers nearby." />
        </section>
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Made with butter & love · REST API demo
      </footer>
    </>
  );
}

function FoodTile({ icon, title, qty }: { icon: React.ReactNode; title: string; qty: string }) {
  return (
    <div className="rounded-xl p-5 bg-[color:var(--cream)] border border-border hover:-translate-y-0.5 transition-transform">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg btn-butter">{icon}</div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{qty} available</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-soft p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
