import Image from "next/image";
import Link from "next/link";
import FinanceCalculator from "@/components/FinanceCalculator";
import { cars, formatBaht, lineUrl, showroomAddress } from "@/data/cars";

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = cars.find((item) => item.slug === slug) || cars[0];
  return {
    title: `${car.title} มือสอง ราคา ${formatBaht(car.price)} บาท | ROADZ Used Cars`,
    description: car.description,
    openGraph: {
      title: `${car.title} มือสอง`,
      description: car.description,
      images: [car.images[0]]
    }
  };
}

function Logo() {
  return (
    <Link className="logo" href="/" aria-label="ROADZ Used Cars">
      <span className="logo-mark">ROADZ</span>
      <span>USED CARS</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="main-nav" aria-label="เมนูหลัก">
          <Link href="/">หน้าแรก</Link>
          <Link href="/#cars">รถทั้งหมด</Link>
          <Link href="/#popular">รถยอดนิยม</Link>
          <Link href="/#brands">แบรนด์</Link>
          <Link href="/#promo">โปรโมชั่น</Link>
          <Link href="/#reviews">รีวิวลูกค้า</Link>
          <Link href={lineUrl}>ติดต่อเรา</Link>
        </nav>
        <a className="line-button" href={lineUrl}>ติดต่อ LINE</a>
      </div>
    </header>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default async function CarDetailPage({ params }) {
  const { slug } = await params;
  const car = cars.find((item) => item.slug === slug) || cars[0];
  const related = cars.filter((item) => item.slug !== car.slug);
  const features = car.features || ["ระบบเบรก ABS", "AIRBAG", "กล้องมองหลัง", "เบาะหนัง", "พวงมาลัยมัลติฟังก์ชัน", "ล้อแม็ก"];
  const highlights = car.highlights || ["รถประวัติดี เอกสารครบถ้วน", "ตรวจสภาพก่อนส่งมอบ", "พร้อมจัดไฟแนนซ์", "พร้อมโอน"];
  const promotions = car.promotions || ["บริการจัดไฟแนนซ์", "ตรวจเช็คก่อนส่งมอบ", "บริการส่งมอบรถ", "ให้คำปรึกษาผ่าน LINE"];

  return (
    <>
      <Header />
      <main className="detail-page shell">
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span>/</span>
          <Link href="/#cars">รถทั้งหมด</Link>
          <span>/</span>
          <span>{car.title}</span>
        </nav>

        <div className="detail-layout">
          <section className="gallery-section">
            <div className="gallery-hero">
              <Image src={car.images[0]} alt={`${car.title} ${car.color}`} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
              <span className="badge">{car.badge}</span>
              <button className="gallery-arrow left" aria-label="ดูรูปก่อนหน้า">‹</button>
              <button className="gallery-arrow right" aria-label="ดูรูปถัดไป">›</button>
            </div>
            <div className="thumb-strip">
              {car.images.slice(0, 6).map((image, index) => (
                <div className="thumb" key={image}>
                  <Image src={image} alt={`${car.title} รูปที่ ${index + 1}`} fill sizes="120px" />
                  {index === 5 ? <span>+{car.images.length - 5}</span> : null}
                </div>
              ))}
            </div>
          </section>

          <aside className="detail-sidebar">
            <section className="side-card price-card">
              <h2>{car.brand} {car.model}</h2>
              <p>{car.trim} ปี {car.year}</p>
              <div className="quick-specs">
                <span>{car.year}</span>
                <span>{car.mileage}</span>
                <span>{car.fuel}</span>
                <span>{car.transmission}</span>
              </div>
              <strong className="big-price">{formatBaht(car.price)} บาท</strong>
              <p>ผ่อนเริ่มต้น {car.installment} บาท / เดือน</p>
              <a className="red-button full" href={lineUrl}>ติดต่อสอบถาม</a>
              <a className="ghost-button full" href={lineUrl}>นัดดูรถ</a>
            </section>

            <section className="side-card seller-card">
              <h2>ผู้ขาย</h2>
              <div className="seller-row">
                <Logo />
                <div>
                  <strong>ROADZ USED CARS</strong>
                  <p>ผู้ขายมืออาชีพ ตอบกลับไว</p>
                </div>
              </div>
              <p className="seller-address">{showroomAddress}</p>
            </section>

            <section className="side-card">
              <h2>มั่นใจได้...เมื่อซื้อกับเรา</h2>
              <ul className="check-list">
                <li>รถสวย คัดสภาพเกรด A</li>
                <li>ไม่มีอุบัติเหตุหนัก จมน้ำ</li>
                <li>เลขไมล์แท้ 100%</li>
                <li>เอกสารครบ พร้อมโอน</li>
              </ul>
            </section>

            <FinanceCalculator price={car.price} lineUrl={lineUrl} />
          </aside>

          <article className="info-card">
            <h1>รายละเอียดรถ</h1>
            <div className="detail-grid">
              <DetailRow label="แบรนด์" value={car.brand} />
              <DetailRow label="รุ่น" value={car.model} />
              <DetailRow label="รุ่นย่อย" value={car.trim} />
              <DetailRow label="ปี" value={car.year} />
              <DetailRow label="เลขไมล์" value={car.mileage} />
              <DetailRow label="เชื้อเพลิง" value={car.fuel} />
              <DetailRow label="เกียร์" value={car.transmission} />
              <DetailRow label="สี" value={car.color} />
              <DetailRow label="ทะเบียน" value={car.plate} />
              <DetailRow label="ปีจดทะเบียน" value={car.registeredYear} />
              <DetailRow label="ประเภท" value={car.category} />
              <DetailRow label="เครื่องยนต์" value={car.engine} />
              <DetailRow label="จำนวนที่นั่ง" value={car.seats} />
              <DetailRow label="จำนวนประตู" value={car.doors} />
              <DetailRow label="สภาพ" value={car.condition} />
            </div>

            <hr />
            <h2>อุปกรณ์และฟังก์ชัน</h2>
            <div className="feature-list">
              {features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>

            <hr />
            <h2>รายละเอียดเพิ่มเติม</h2>
            <p>{car.description}</p>
            <ul className="check-list two-cols">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <hr />
            <h2>โปรโมชั่นพิเศษ</h2>
            <ul className="check-list two-cols">
              {promotions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <section className="section-block related">
          <div className="section-head">
            <h2>รถคันอื่นที่น่าสนใจ</h2>
            <Link href="/#cars">ดูรถทั้งหมด</Link>
          </div>
          <div className="car-grid">
            {related.map((item) => (
              <article className="car-card" key={item.slug}>
                <Link href={`/cars/${item.slug}`} className="car-card-media">
                  <Image src={item.images[0]} alt={`${item.title} มือสอง`} fill sizes="25vw" />
                  <span className="badge">{item.badge}</span>
                </Link>
                <div className="car-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.trim} ปี {item.year}</p>
                  <strong>{formatBaht(item.price)} บาท</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="onpage-section">
          <p className="eyebrow">ON-PAGE ARTICLE</p>
          <h2>{car.onPageArticle?.title || `${car.title} มือสอง`}</h2>
          <div className="onpage-grid">
            {(car.onPageArticle?.headings || []).map((heading) => (
              <h3 key={heading}>{heading}</h3>
            ))}
          </div>
          {(car.onPageArticle?.body || car.description)
            .split("\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </section>
      </main>
    </>
  );
}
