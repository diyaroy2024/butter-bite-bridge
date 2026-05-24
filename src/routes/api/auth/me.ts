import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/jwt.server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = requireAuth(request);
        if (auth instanceof Response) return auth;
        return Response.json({ user: { id: auth.sub, email: auth.email, name: auth.name } });
      },
    },
  },
});
