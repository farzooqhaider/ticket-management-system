import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, SessionPayload } from "@/lib/session";

// For use inside server components / server actions (not API routes —
// there, use getSessionFromRequest from lib/session.ts instead).
export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
