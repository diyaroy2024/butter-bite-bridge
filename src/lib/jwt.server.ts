import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "butter-yellow-dev-secret-change-me";

export type JwtPayload = { sub: string; email: string; name: string; role: "donor" | "ngo" };

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getBearer(request: Request): string | null {
  const auth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export function requireAuth(request: Request): JwtPayload | Response {
  const token = getBearer(request);
  if (!token) return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const payload = verifyToken(token);
  if (!payload) return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401, headers: { "Content-Type": "application/json" } });
  return payload;
}
