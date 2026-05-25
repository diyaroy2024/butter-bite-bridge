import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { store } from "@/lib/store.server";
import { signToken } from "@/lib/jwt.server";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (!body?.email || !body?.password) {
          return Response.json({ error: "email and password required" }, { status: 400 });
        }
        const email = String(body.email).toLowerCase().trim();
        const user = Array.from(store.users.values()).find((u) => u.email === email);
        if (!user) return Response.json({ error: "Invalid credentials" }, { status: 401 });
        const ok = await bcrypt.compare(String(body.password), user.passwordHash);
        if (!ok) return Response.json({ error: "Invalid credentials" }, { status: 401 });
        const token = signToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
        return Response.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      },
    },
  },
});
