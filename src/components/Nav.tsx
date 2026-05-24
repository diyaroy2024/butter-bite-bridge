import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { UtensilsCrossed, LogOut } from "lucide-react";

export function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl btn-butter">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">ButterShare</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors">
            Donations
          </Link>
          {user ? (
            <>
              <span className="px-3 py-2 text-muted-foreground hidden sm:inline">
                Hi, <span className="text-foreground font-medium">{user.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={() => { logout(); navigate({ to: "/" }); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-lg btn-butter font-medium">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
