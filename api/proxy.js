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
