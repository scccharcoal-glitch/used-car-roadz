import Link from "next/link";
import { notFound } from "next/navigation";
import BlogContent from "@/components/BlogContent";
import { Footer, Header } from "@/components/SiteChrome";
import { publishedPosts } from "@/data/blog";
import { getPostSummary } from "@/lib/blog-utils";

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = publishedPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | ROADZ Used Cars`,
    description: getPostSummary(post),
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: getPostSummary(post),
      images: post.coverImage ? [post.coverImage] : []
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = publishedPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="blog-post shell">
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span>/</span>
          <Link href="/blog">บทความ</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>

        <article>
          <p className="eyebrow">ROADZ BLOG</p>
          <h1>{post.title}</h1>
          <p className="blog-excerpt">{getPostSummary(post)}</p>
          <time>{post.publishedAt}</time>
          {post.coverImage ? (
            <figure className="blog-cover">
              <img src={post.coverImage} alt={post.title} />
            </figure>
          ) : null}
          <BlogContent content={post.content} />
        </article>
      </main>
      <Footer />
    </>
  );
}
