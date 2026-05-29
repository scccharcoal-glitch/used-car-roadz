import { requireAdmin } from "@/lib/admin-auth";
import { deleteCar, readCars, saveCar } from "@/lib/admin-store";

export async function GET() {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  return Response.json({ cars: await readCars() });
}

export async function POST(request) {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const car = await request.json();
  const result = await saveCar(car);
  return Response.json(result);
}

export async function DELETE(request) {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "ไม่พบ slug ของรถ" }, { status: 400 });
  }

  return Response.json(await deleteCar(slug));
}
