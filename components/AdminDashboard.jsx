"use client";

import { useEffect, useMemo, useState } from "react";

const blankCar = {
  slug: "",
  badge: "ใหม่ล่าสุด",
  brand: "",
  model: "",
  trim: "",
  title: "",
  year: "",
  registeredYear: "",
  plate: "",
  color: "",
  engine: "",
  mileage: "",
  fuel: "",
  transmission: "อัตโนมัติ",
  price: "",
  installment: "",
  category: "",
  seats: "5 ที่นั่ง",
  doors: "4 ประตู",
  condition: "เกรด A",
  images: [],
  keywords: [],
  highlights: [],
  promotions: [],
  features: [],
  description: "",
  onPageArticle: { title: "", headings: [], body: "" }
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

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="admin-field wide">
      <span>{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [cars, setCars] = useState([]);
  const [current, setCurrent] = useState(blankCar);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);

  const selectedSlug = current.slug;
  const currentImages = useMemo(() => toLines(current.images), [current.images]);

  async function loadCars() {
    const response = await fetch("/api/admin/cars", { cache: "no-store" });
    if (response.status === 401) {
      setLoggedIn(false);
      return;
    }
    const data = await response.json();
    setCars(data.cars || []);
    setCurrent(data.cars?.[0] || blankCar);
    setLoggedIn(true);
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
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
    await loadCars();
  }

  function update(key, value) {
    setCurrent((car) => ({ ...car, [key]: value }));
  }

  function updateArticle(key, value) {
    setCurrent((car) => ({
      ...car,
      onPageArticle: { ...(car.onPageArticle || {}), [key]: value }
    }));
  }

  function editCar(car) {
    setFiles([]);
    setCurrent(car);
    setMessage("");
  }

  function newCar() {
    setFiles([]);
    setCurrent(blankCar);
    setMessage("");
  }

  async function saveCar(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("กำลัง publish...");

    const payload = {
      ...current,
      price: Number(current.price || 0),
      images: fromLines(currentImages),
      keywords: fromLines(toLines(current.keywords)),
      highlights: fromLines(toLines(current.highlights)),
      promotions: fromLines(toLines(current.promotions)),
      features: fromLines(toLines(current.features)),
      onPageArticle: {
        ...(current.onPageArticle || {}),
        headings: fromLines(toLines(current.onPageArticle?.headings))
      }
    };

    const response = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(data.error || "บันทึกไม่สำเร็จ");
      return;
    }

    if (files.length) {
      const formData = new FormData();
      formData.append("slug", data.car.slug);
      files.forEach((file) => formData.append("images", file));
      const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setLoading(false);
        setMessage(uploadData.error || "อัปโหลดรูปไม่สำเร็จ");
        return;
      }
    }

    await loadCars();
    setFiles([]);
    setLoading(false);
    setMessage(data.needsRedeploy ? "Publish แล้ว รอ Vercel deploy อัตโนมัติสักครู่" : "บันทึกแล้ว รีเฟรชหน้าเว็บ local เพื่อดูผล");
  }

  async function removeCar() {
    if (!selectedSlug || !confirm("ลบรถคันนี้ออกจากหน้าเว็บ?")) return;
    setLoading(true);
    const response = await fetch(`/api/admin/cars?slug=${encodeURIComponent(selectedSlug)}`, { method: "DELETE" });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "ลบไม่สำเร็จ");
      return;
    }
    await loadCars();
    setMessage(data.needsRedeploy ? "ลบแล้ว รอ Vercel deploy อัตโนมัติสักครู่" : "ลบแล้ว");
  }

  if (!loggedIn) {
    return (
      <main className="admin-login">
        <form onSubmit={login} className="admin-login-card">
          <p className="eyebrow">ROADZ ADMIN</p>
          <h1>เข้าสู่ระบบหลังบ้าน</h1>
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
          <p className="eyebrow">ROADZ ADMIN</p>
          <h1>จัดการเว็บ</h1>
        </div>
        <a className="admin-link" href="/admin/blog">จัดการบทความ</a>
        <button className="admin-primary" type="button" onClick={newCar}>เพิ่มรถใหม่</button>
        <div className="admin-car-list">
          {cars.map((car) => (
            <button className={car.slug === selectedSlug ? "active" : ""} key={car.slug} type="button" onClick={() => editCar(car)}>
              <strong>{car.title}</strong>
              <span>{Number(car.price || 0).toLocaleString("th-TH")} บาท</span>
            </button>
          ))}
        </div>
      </aside>

      <form className="admin-editor" onSubmit={saveCar}>
        <div className="admin-editor-head">
          <div>
            <p className="eyebrow">PUBLISH</p>
            <h2>{current.title || "เพิ่มรถใหม่"}</h2>
          </div>
          <div className="admin-actions">
            <button className="admin-danger" type="button" onClick={removeCar} disabled={!selectedSlug || loading}>ลบ</button>
            <button className="admin-primary" type="submit" disabled={loading}>{loading ? "กำลังบันทึก..." : "Publish"}</button>
          </div>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <section className="admin-panel">
          <h3>ข้อมูลรถ</h3>
          <div className="admin-grid">
            <Field label="Slug" value={current.slug} onChange={(value) => update("slug", value)} />
            <Field label="ป้ายกำกับ" value={current.badge} onChange={(value) => update("badge", value)} />
            <Field label="แบรนด์" value={current.brand} onChange={(value) => update("brand", value)} />
            <Field label="รุ่น" value={current.model} onChange={(value) => update("model", value)} />
            <Field label="รุ่นย่อย" value={current.trim} onChange={(value) => update("trim", value)} />
            <Field label="ชื่อรถ" value={current.title} onChange={(value) => update("title", value)} />
            <Field label="ปี" value={current.year} onChange={(value) => update("year", value)} />
            <Field label="ปีจดทะเบียน" value={current.registeredYear} onChange={(value) => update("registeredYear", value)} />
            <Field label="ราคา" type="number" value={current.price} onChange={(value) => update("price", value)} />
            <Field label="ผ่อนเริ่มต้น" value={current.installment} onChange={(value) => update("installment", value)} />
            <Field label="เลขไมล์" value={current.mileage} onChange={(value) => update("mileage", value)} />
            <Field label="เชื้อเพลิง" value={current.fuel} onChange={(value) => update("fuel", value)} />
            <Field label="เกียร์" value={current.transmission} onChange={(value) => update("transmission", value)} />
            <Field label="สี" value={current.color} onChange={(value) => update("color", value)} />
            <Field label="ทะเบียน" value={current.plate} onChange={(value) => update("plate", value)} />
            <Field label="ประเภท" value={current.category} onChange={(value) => update("category", value)} />
            <Field label="เครื่องยนต์" value={current.engine} onChange={(value) => update("engine", value)} />
            <Field label="จำนวนที่นั่ง" value={current.seats} onChange={(value) => update("seats", value)} />
            <Field label="จำนวนประตู" value={current.doors} onChange={(value) => update("doors", value)} />
            <Field label="สภาพ" value={current.condition} onChange={(value) => update("condition", value)} />
          </div>
        </section>

        <section className="admin-panel">
          <h3>รูปภาพ</h3>
          <div className="admin-grid">
            <TextArea label="รูปที่ใช้อยู่ หนึ่ง URL ต่อบรรทัด" rows={7} value={currentImages} onChange={(value) => update("images", fromLines(value))} />
            <label className="admin-field wide">
              <span>อัปโหลดรูปเพิ่ม</span>
              <input type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} />
            </label>
          </div>
        </section>

        <section className="admin-panel">
          <h3>รายละเอียดและ SEO</h3>
          <div className="admin-grid">
            <TextArea label="รายละเอียดเพิ่มเติม" rows={5} value={current.description} onChange={(value) => update("description", value)} />
            <TextArea label="อุปกรณ์และฟังก์ชัน หนึ่งรายการต่อบรรทัด" value={toLines(current.features)} onChange={(value) => update("features", fromLines(value))} />
            <TextArea label="จุดเด่น หนึ่งรายการต่อบรรทัด" value={toLines(current.highlights)} onChange={(value) => update("highlights", fromLines(value))} />
            <TextArea label="โปรโมชั่น หนึ่งรายการต่อบรรทัด" value={toLines(current.promotions)} onChange={(value) => update("promotions", fromLines(value))} />
            <TextArea label="Keyword หนึ่งคำต่อบรรทัด" value={toLines(current.keywords)} onChange={(value) => update("keywords", fromLines(value))} />
            <Field label="หัวข้อบทความ H1" value={current.onPageArticle?.title} onChange={(value) => updateArticle("title", value)} />
            <TextArea label="หัวข้อย่อย H3 หนึ่งหัวข้อต่อบรรทัด" value={toLines(current.onPageArticle?.headings)} onChange={(value) => updateArticle("headings", fromLines(value))} />
            <TextArea label="เนื้อหาบทความ SEO" rows={8} value={current.onPageArticle?.body} onChange={(value) => updateArticle("body", value)} />
          </div>
        </section>
      </form>
    </main>
  );
}
