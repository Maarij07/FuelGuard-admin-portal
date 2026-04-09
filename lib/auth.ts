import { cookies } from "next/headers";
import type { Session } from "./types";

const COOKIE_ACCESS    = "fg_access";
const COOKIE_REFRESH   = "fg_refresh";
const COOKIE_UID       = "fg_uid";
const COOKIE_ROLE      = "fg_role";
const COOKIE_EMAIL     = "fg_email";
const COOKIE_FULLNAME  = "fg_name";

const SECURE = process.env.NODE_ENV === "production";

// ── Write session ─────────────────────────────────────────────────────────────

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();

  const base = {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax" as const,
    path: "/",
  };

  store.set(COOKIE_ACCESS,   session.accessToken,  { ...base, maxAge: 60 * 60 });           // 1 h
  store.set(COOKIE_REFRESH,  session.refreshToken, { ...base, maxAge: 60 * 60 * 24 * 30 }); // 30 d
  store.set(COOKIE_UID,      session.uid,          { ...base, maxAge: 60 * 60 * 24 * 30 });
  store.set(COOKIE_ROLE,     session.role,         { ...base, maxAge: 60 * 60 * 24 * 30 });
  store.set(COOKIE_EMAIL,    session.email,        { ...base, maxAge: 60 * 60 * 24 * 30 });
  store.set(COOKIE_FULLNAME, session.fullName,     { ...base, maxAge: 60 * 60 * 24 * 30 });
}

// ── Read session ──────────────────────────────────────────────────────────────

export async function getSession(): Promise<Session | null> {
  const store       = await cookies();
  const accessToken = store.get(COOKIE_ACCESS)?.value;
  const uid         = store.get(COOKIE_UID)?.value;
  const role        = store.get(COOKIE_ROLE)?.value;

  if (!accessToken || !uid || !role) return null;

  return {
    accessToken,
    refreshToken: store.get(COOKIE_REFRESH)?.value  ?? "",
    uid,
    role,
    email:    store.get(COOKIE_EMAIL)?.value    ?? "",
    fullName: store.get(COOKIE_FULLNAME)?.value ?? "Admin",
  };
}

// ── Clear session ─────────────────────────────────────────────────────────────

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_ACCESS);
  store.delete(COOKIE_REFRESH);
  store.delete(COOKIE_UID);
  store.delete(COOKIE_ROLE);
  store.delete(COOKIE_EMAIL);
  store.delete(COOKIE_FULLNAME);
}

// ── Require session (throws redirect-safe error if missing) ────────────────────

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}
