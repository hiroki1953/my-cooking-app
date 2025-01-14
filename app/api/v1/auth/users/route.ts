import { supabase } from "@/lib/initSupabase";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  // display_nameにusernameを保存
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
      },
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ message: "User registered successfully", data }),
    { status: 200 }
  );
}
