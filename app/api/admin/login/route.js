import { canLogin, clearAdminCookie, createSessionToken, isAdminConfigured, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request) {
  if (!isAdminConfigured()) {
    return Response.json({ error: "ยังไม่ได้ตั้ง ADMIN_PASSWORD บน Vercel" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  if (!canLogin(body.password)) {
    return Response.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  await setAdminCookie(createSessionToken());
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return Response.json({ ok: true });
}
