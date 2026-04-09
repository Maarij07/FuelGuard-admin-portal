"use server";

import { redirect } from "next/navigation";
import { apiLogin, getUserProfile } from "@/lib/api";
import { clearSession, setSession } from "@/lib/auth";

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData,
) {
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const token = await apiLogin(email, password);

    if (!["admin", "super_admin"].includes(token.role)) {
      return { error: "Access denied. Admin credentials required." };
    }

    // Fetch full name from /users/me immediately after login
    let fullName = "Admin";
    try {
      const profile = await getUserProfile(token.access_token);
      fullName = profile.full_name;
    } catch {
      // Non-fatal — fall back to derived name from email
      fullName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    await setSession({
      accessToken:  token.access_token,
      refreshToken: token.refresh_token,
      uid:          token.uid,
      role:         token.role,
      email,
      fullName,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Login failed" };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/signin");
}
