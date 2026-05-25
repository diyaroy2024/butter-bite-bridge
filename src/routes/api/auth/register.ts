import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { store, uid, type Role } from "@/lib/store.server";
import { signToken } from "@/lib/jwt.server";

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (!body?.email || !body?.password || !body?.name) {
          return Response.json({ error: "name, email and password are required" }, { status: 400 });
        }
        if (String(body.password).length < 8) {
          return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }
        const role: Role = body.role === "ngo" ? "ngo" : "donor";
        const email = String(body.email).toLowerCase().trim();
        if (Array.from(store.users.values()).some((u) => u.email === email)) {
          return Response.json({ error: "Email already registered" }, { status: 409 });
        }
        const id = uid();
        const user = {
          id,
          email,
          name: String(body.name).trim(),
          role,
          passwordHash: await bcrypt.hash(String(body.password), 10),
          createdAt: new Date().toISOString(),
        };
        store.users.set(id, user);
        const token = signToken({ sub: id, email: user.email, name: user.name, role });
        return Response.json({ token, user: { id, email: user.email, name: user.name, role } });
      },
    },
  },
});
