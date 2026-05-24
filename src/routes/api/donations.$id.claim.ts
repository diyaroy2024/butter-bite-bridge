import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/lib/store.server";
import { requireAuth } from "@/lib/jwt.server";

export const Route = createFileRoute("/api/donations/$id/claim")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const auth = requireAuth(request);
        if (auth instanceof Response) return auth;
        const d = store.donations.get(params.id);
        if (!d) return Response.json({ error: "Not found" }, { status: 404 });
        if (d.status !== "available") return Response.json({ error: "Already claimed" }, { status: 409 });
        d.status = "claimed";
        d.claimedBy = auth.name;
        store.donations.set(d.id, d);
        return Response.json({ donation: d });
      },
    },
  },
});
