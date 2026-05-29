"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogContent from "@/components/BlogContent";

const blankPost = {
  slug: "",
  title: "",
  excerpt: "",
  coverImage: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  status: "published",
  keywords: [],
  content: ""
};

function toLines(value) {
  return Array.isArray(value) ? value.join("\n") : value || "";
}

function fromLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5 }) {
  return (
    <label className="admin-field wide">
      <span>{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function AdminBlogDashboard() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(blankPost);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    const response = await fetch("/api/admin/blog", { cache: "no-store" });
    if (response.status === 401) {
      setLoggedIn(false);
      return;
    }
    const data = await response.json();
    setPosts(data.posts || []);
    setCurrent(data.posts?.[0] || blankPost);
    setLoggedIn(true);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "เข้าสู่ระบบไม่ได้");
      return;
    }
    setPassword("");
    await loadPosts();
  }

  function update(key, value) {
    setCurrent((post) => ({ ...post, [key]: value }));
  }

  function insertSnippet(snippet) {
    setCurrent((post) => ({
      ...post,
      content: `${post.content || ""}${post.content ? "\n\n" : ""}${snippet}`
    }));
  }

  async function savePost(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("กำลัง publish...");

    const response = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...current, keywords: fromLines(toLines(current.keywords)) })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "บันทึกไม่สำเร็จ");
      return;
    }

    await loadPosts();
    setMessage(data.needsRedeploy ? "Publish แล้ว รอ Vercel deploy อัตโนมัติสักครู่" : "บันทึกแล้ว");
  }

  async function removePost() {
    if (!current.slug || !confirm("ลบบทความนี้?")) return;
    setLoading(true);
    const response = await fetch(`/api/admin/blog?slug=${encodeURIComponent(current.slug)}`, { method: "DELETE" });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "ลบไม่สำเร็จ");
      return;
    }
    await loadPosts();
    setMessage(data.needsRedeploy ? "ลบแล้ว รอ Vercel deploy อัตโนมัติสักครู่" : "ลบแล้ว");
  }

  if (!loggedIn) {
    return (
      <main className="admin-login">
        <form onSubmit={login} className="admin-login-card">
          <p className="eyebrow">ROADZ BLOG</p>
          <h1>เข้าสู่ระบบจัดการบทความ</h1>
          <label>
            <span>รหัสผ่าน</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
          </label>
          <button type="submit" disabled={loading}>{loading ? "กำลังเข้า..." : "เข้าสู่ระบบ"}</button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">ROADZ BLOG</p>
          <h1>บทความ</h1>
        </div>
        <Link className="admin-link" href="/admin">จัดการรถ</Link>
        <button className="admin-primary" type="button" onClick={() => setCurrent(blankPost)}>เพิ่มบทความ</button>
        <div className="admin-car-list">
          {posts.map((post) => (
            <button className={post.slug === current.slug ? "active" : ""} key={post.slug} type="button" onClick={() => setCurrent(post)}>
              <strong>{post.title}</strong>
              <span>{post.status === "draft" ? "Draft" : post.publishedAt}</span>
            </button>
          ))}
        </div>
      </aside>

      <form className="admin-editor wordpress-editor" onSubmit={savePost}>
        <div className="admin-editor-head">
          <div>
            <p className="eyebrow">WORDPRESS STYLE</p>
            <h2>{current.title || "บทความใหม่"}</h2>
          </div>
          <div className="admin-actions">
            <button className="admin-danger" type="button" onClick={removePost} disabled={!current.slug || loading}>ลบ</button>
            <button className="admin-primary" type="submit" disabled={loading}>{loading ? "กำลังบันทึก..." : "Publish"}</button>
          </div>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <div className="wp-layout">
          <div className="wp-main">
            <section className="admin-panel wp-box">
              <div className="wp-box-head">
                <h3>เขียนบทความ</h3>
                <span>Editor</span>
              </div>
              <Field label="หัวข้อ H1" value={current.title} onChange={(value) => update("title", value)} />
              <TextArea label="คำอธิบายสั้น" rows={3} value={current.excerpt} onChange={(value) => update("excerpt", value)} />
              <div className="editor-toolbar" aria-label="เครื่องมือเขียนบทความ">
                <button type="button" onClick={() => insertSnippet("## หัวข้อย่อย")}>H2</button>
                <button type="button" onClick={() => insertSnippet("### หัวข้อเล็ก")}>H3</button>
                <button type="button" onClick={() => insertSnippet("![คำอธิบายรูป](https://example.com/image.jpg)")}>รูป</button>
                <button type="button" onClick={() => insertSnippet("[ข้อความลิงก์](https://example.com)")}>ลิงก์</button>
                <button type="button" onClick={() => insertSnippet("ย่อหน้าใหม่...")}>ย่อหน้า</button>
              </div>
              <p className="admin-help">ใส่รูปจากเว็บอื่นได้ด้วยรูปแบบ Markdown: ![คำอธิบาย](https://example.com/image.jpg)</p>
              <TextArea label="เนื้อหาบทความ" rows={20} value={current.content} onChange={(value) => update("content", value)} />
            </section>

            <section className="admin-panel wp-box">
              <div className="wp-box-head">
                <h3>Preview</h3>
                <span>ตัวอย่างหน้าโพสต์</span>
              </div>
              <article className="wp-preview">
                <p className="eyebrow">ROADZ BLOG</p>
                <h1>{current.title || "หัวข้อบทความ"}</h1>
                {current.excerpt ? <p className="blog-excerpt">{current.excerpt}</p> : null}
                {current.coverImage ? <img className="wp-preview-cover" src={current.coverImage} alt={current.title || "cover"} /> : null}
                <BlogContent content={current.content} />
              </article>
            </section>
          </div>

          <aside className="wp-meta">
            <section className="admin-panel wp-box">
              <div className="wp-box-head">
                <h3>Publish</h3>
                <span>สถานะ</span>
              </div>
              <label className="admin-field">
                <span>สถานะบทความ</span>
                <select value={current.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <Field label="วันที่เผยแพร่" type="date" value={current.publishedAt} onChange={(value) => update("publishedAt", value)} />
              <Field label="Slug" value={current.slug} onChange={(value) => update("slug", value)} />
              <button className="admin-primary wp-full" type="submit" disabled={loading}>{loading ? "กำลังบันทึก..." : "Publish"}</button>
            </section>

            <section className="admin-panel wp-box">
              <div className="wp-box-head">
                <h3>Featured Image</h3>
                <span>รูปปก</span>
              </div>
              <TextArea label="Cover image URL" rows={3} value={current.coverImage} onChange={(value) => update("coverImage", value)} />
              {current.coverImage ? <img className="wp-thumb-preview" src={current.coverImage} alt="cover preview" /> : null}
            </section>

            <section className="admin-panel wp-box">
              <div className="wp-box-head">
                <h3>SEO</h3>
                <span>On-page</span>
              </div>
              <TextArea label="Keywords หนึ่งคำต่อบรรทัด" rows={6} value={toLines(current.keywords)} onChange={(value) => update("keywords", fromLines(value))} />
              <div className="seo-count">
                <span>Title: {(current.title || "").length} ตัวอักษร</span>
                <span>Description: {(current.excerpt || "").length} ตัวอักษร</span>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
}
