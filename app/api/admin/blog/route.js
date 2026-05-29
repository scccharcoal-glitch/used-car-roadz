import { requireAdmin } from "@/lib/admin-auth";
import { deletePost, readPosts, savePost } from "@/lib/admin-store";

export async function GET() {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  return Response.json({ posts: await readPosts() });
}

export async function POST(request) {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const post = await request.json();
  return Response.json(await savePost(post));
}

export async function DELETE(request) {
  const blocked = await requireAdmin();
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "ไม่พบ slug ของบทความ" }, { status: 400 });
  }

  return Response.json(await deletePost(slug));
}
