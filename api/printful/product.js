export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing PRINTFUL_API_KEY" });

  try {
    // 1) list store products
    const listRes = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const listData = await listRes.json().catch(() => ({}));
    if (!listRes.ok) return res.status(listRes.status).json(listData);

    const products = listData.result || [];
    const match =
      products.find(p => (p.name || "").toLowerCase().includes("goshwk og tee")) ||
      products[0];

    if (!match) return res.status(404).json({ error: "No products found in Printful store" });

    // 2) fetch product details (variants)
    const detailRes = await fetch(`https://api.printful.com/store/products/${match.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const detailData = await detailRes.json().catch(() => ({}));
    if (!detailRes.ok) return res.status(detailRes.status).json(detailData);

    const syncProduct = detailData.result?.sync_product || {};
    const syncVariants = detailData.result?.sync_variants || [];

    return res.status(200).json({
      id: match.id,
      name: syncProduct.name || match.name || "GOSHWK OG TEE",
      description: syncProduct.description || "",
      thumbnail_url: syncProduct.thumbnail_url || null,
      variants: syncVariants.map(v => ({
        id: v.id,
        size: v.size || "",
        color: v.color || "",
        retail_price: v.retail_price || "",
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
