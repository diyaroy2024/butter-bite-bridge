import { createFileRoute } from "@tanstack/react-router";
import { store, uid } from "@/lib/store.server";
import { requireAuth } from "@/lib/jwt.server";

export const Route = createFileRoute("/api/donations")({
  server: {
    handlers: {
      GET: async () => {
        const list = Array.from(store.donations.values()).sort(
          (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
        );
        return Response.json({ donations: list });
      },
      POST: async ({ request }) => {
        const auth = requireAuth(request);
        if (auth instanceof Response) return auth;
        const body = await request.json().catch(() => null);
        if (!body?.foodName || !body?.quantity || !body?.pickupLocation || !body?.expiresAt) {
          return Response.json({ error: "foodName, quantity, pickupLocation, expiresAt required" }, { status: 400 });
        }
        const id = uid();
        const donation = {
          id,
          donorId: auth.sub,
          donorName: auth.name,
          foodName: String(body.foodName).slice(0, 120),
          quantity: String(body.quantity).slice(0, 60),
          pickupLocation: String(body.pickupLocation).slice(0, 200),
          expiresAt: new Date(body.expiresAt).toISOString(),
          status: "available" as const,
          createdAt: new Date().toISOString(),
        };
        store.donations.set(id, donation);
        return Response.json({ donation }, { status: 201 });
      },
    },
  },
});
