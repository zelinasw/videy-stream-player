export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const param = url.searchParams.get("id") || url.searchParams.get("v");
  const table = url.searchParams.get("t") || "videos2";

  if (!param) {
    return new Response(JSON.stringify({ error: "Parameter tidak ditemukan" }), { status: 400 });
  }

  // Jika input sudah berupa videy_id langsung
  if (param.length <= 12 && !param.includes("-") && !param.includes(" ")) {
    return new Response(JSON.stringify({ video_url: `https://cdn2.videy.co/${param}.mp4` }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // Ambil dari Supabase menggunakan env Cloudflare
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?slug=eq.${encodeURIComponent(param)}&select=videy_id`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    });

    const data = await res.json();
    if (data && data.length > 0 && data[0].videy_id) {
      return new Response(JSON.stringify({ video_url: `https://cdn2.videy.co/${data[0].videy_id}.mp4` }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Video tidak ditemukan" }), { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
