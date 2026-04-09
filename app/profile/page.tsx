import { requireSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/api";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await requireSession();

  let profile = {
    full_name: session.fullName,
    email:     session.email,
    phone:     null as string | null,
    role:      session.role,
    created_at: "",
  };

  try {
    const data = await getUserProfile(session.accessToken);
    profile = {
      full_name:  data.full_name,
      email:      data.email,
      phone:      data.phone,
      role:       data.role,
      created_at: data.created_at,
    };
  } catch {
    // use session fallback
  }

  return <ProfileClient profile={profile} accessToken={session.accessToken} />;
}
