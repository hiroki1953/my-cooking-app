import { supabase } from "@/lib/initSupabase";
import { UserAuthResponse } from "@/types/auth";

export async function findUserByEmailAndPassword(
  email: string,
  password: string
): Promise<UserAuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    throw new Error(error?.message || "Authentication failed");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email || "",
    },
    session: {
      access_token: data.session.access_token,
    },
  };
}
