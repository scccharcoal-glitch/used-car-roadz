import { requireAdmin } from "@/lib/admin-auth";
import { saveCarImages } from "@/lib/admin-store";

export async function POST(request) {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const formData = await request.formData();
  const slug = String(formData.get("slug") || "");
  const files = formData.getAll("images");

  if (!slug) {
    return Response.json({ error: "กรุณาบันทึกรถก่อนอัปโหลดรูป" }, { status: 400 });
  }

  if (!files.length) {
    return Response.json({ error: "กรุณาเลือกรูปภาพ" }, { status: 400 });
  }

  return Response.json(await saveCarImages(slug, files));
}
