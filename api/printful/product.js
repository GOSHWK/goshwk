export default async function handler(req, res) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing PRINTFUL_API_KEY" });

  try {
    const r = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
