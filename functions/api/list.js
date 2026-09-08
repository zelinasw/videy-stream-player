export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const table = url.searchParams.get("t") || "videos2";

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Supabase Env belum diset" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id,title,videy_id,slug&order=id.desc&limit=100`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
