import { supabase } from "@/lib/initSupabase";

export async function findUserByEmailAndPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
