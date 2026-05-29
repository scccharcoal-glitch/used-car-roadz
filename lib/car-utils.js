export function slugifyCar(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function linesToArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeCar(input) {
  const title = String(input.title || `${input.brand || ""} ${input.model || ""} ${input.trim || ""}`).trim();
  const year = String(input.year || "").trim();
  const slug = slugifyCar(input.slug || `${title} ${year}`);

  return {
    slug,
    sourceFolder: input.sourceFolder || "admin",
    badge: input.badge || "ใหม่ล่าสุด",
    brand: String(input.brand || "").trim().toUpperCase(),
    model: String(input.model || "").trim().toUpperCase(),
    trim: String(input.trim || "").trim(),
    title,
    year,
    registeredYear: String(input.registeredYear || "").trim(),
    plate: String(input.plate || "").trim(),
    color: String(input.color || "").trim(),
    engine: String(input.engine || "").trim(),
    mileage: String(input.mileage || "").trim(),
    fuel: String(input.fuel || "").trim(),
    transmission: String(input.transmission || "").trim(),
    price: Number(input.price || 0),
    installment: String(input.installment || "").trim(),
    category: String(input.category || "").trim(),
    seats: String(input.seats || "").trim(),
    doors: String(input.doors || "").trim(),
    condition: String(input.condition || "เกรด A").trim(),
    images: linesToArray(input.images),
    keywords: linesToArray(input.keywords),
    highlights: linesToArray(input.highlights),
    promotions: linesToArray(input.promotions),
    features: linesToArray(input.features),
    description: String(input.description || "").trim(),
    onPageArticle: {
      title: String(input.onPageArticle?.title || `${title} มือสอง`).trim(),
      headings: linesToArray(input.onPageArticle?.headings),
      body: String(input.onPageArticle?.body || "").trim()
    }
  };
}
