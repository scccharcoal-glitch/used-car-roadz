import Link from "next/link";
import { Footer, Header } from "@/components/SiteChrome";
import { publishedPosts } from "@/data/blog";
import { getPostSummary } from "@/lib/blog-utils";

export const metadata = {
  title: "บทความรถมือสอง | ROADZ Used Cars",
  description: "รวมบทความรถมือสอง เทคนิคการเลือกซื้อรถ และข้อมูลไฟแนนซ์จาก ROADZ Used Cars"
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="blog-page shell">
        <section className="blog-hero">
          <p className="eyebrow">ROADZ BLOG</p>
          <h1>บทความรถมือสอง</h1>
          <p>รวมความรู้ก่อนซื้อรถมือสอง เทคนิคเช็ครถ ไฟแนนซ์ และรีวิวรถน่าใช้</p>
        </section>

        <section className="blog-grid">
          {publishedPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <Link className="blog-card-media" href={`/blog/${post.slug}`}>
                {post.coverImage ? <img src={post.coverImage} alt={post.title} loading="lazy" /> : null}
              </Link>
              <div>
                <time>{post.publishedAt}</time>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{getPostSummary(post)}</p>
                <Link className="blog-readmore" href={`/blog/${post.slug}`}>อ่านบทความ</Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
