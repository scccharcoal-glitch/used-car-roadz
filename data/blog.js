import blogPosts from "./blog-posts.json";

export const posts = [...blogPosts].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
export const publishedPosts = posts.filter((post) => post.status === "published");
