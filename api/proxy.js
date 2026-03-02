res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

if (req.method === "OPTIONS") {
  return res.status(200).end();
}


export default async function handler(req, res) {
  try {
    // Only allow POST if you want to keep it tight
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;

    // Example: forward to some external API endpoint
    const upstream = await fetch(process.env.UPSTREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Example auth header if needed:
        ...(process.env.UPSTREAM_KEY ? { Authorization: `Bearer ${process.env.UPSTREAM_KEY}` } : {})
      },
      body: JSON.stringify(body)
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
}
