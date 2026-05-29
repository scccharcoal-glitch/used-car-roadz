import Image from "next/image";
import Link from "next/link";
import { cars, featuredCar, formatBaht, lineUrl, showroomAddress } from "@/data/cars";

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
          <Link className="active" href="/">หน้าแรก</Link>
          <Link href="#cars">รถทั้งหมด</Link>
          <Link href="#popular">รถยอดนิยม</Link>
          <Link href="#brands">แบรนด์</Link>
          <Link href="#promo">โปรโมชั่น</Link>
          <Link href="/blog">บทความ</Link>
          <Link href="#reviews">รีวิวลูกค้า</Link>
          <Link href={lineUrl}>ติดต่อเรา</Link>
        </nav>
        <a className="line-button" href={lineUrl}>ติดต่อ LINE</a>
      </div>
    </header>
  );
}

function CarCard({ car }) {
  return (
    <article className="car-card">
      <Link href={`/cars/${car.slug}`} className="car-card-media">
        <Image src={car.images[0]} alt={`${car.title} มือสอง`} fill sizes="(max-width: 768px) 100vw, 25vw" />
        <span className="badge">{car.badge}</span>
        <span className="heart">♡</span>
      </Link>
      <div className="car-card-body">
        <h3>{car.title}</h3>
        <p>{car.trim} ปี {car.year}</p>
        <div className="meta-row">
          <span>{car.year}</span>
          <span>{car.mileage}</span>
          <span>{car.fuel}</span>
        </div>
        <strong>{formatBaht(car.price)} บาท</strong>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <Image
            className="hero-car"
            src={featuredCar.images[0]}
            alt="รถมือสองคุณภาพเกรด A"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="shell hero-content">
            <p className="eyebrow">ROADZ USED CARS</p>
            <h1>
              รถมือสอง
              <span>คุณภาพเกรด A</span>
            </h1>
            <p className="hero-copy">คัดรถสวย สภาพดี ราคาคุ้มค่า ออกรถง่าย อนุมัติไว ผ่อนสบาย</p>
            <div className="hero-actions">
              <Link className="red-button" href="#cars">ดูรถทั้งหมด</Link>
              <a className="ghost-button" href={lineUrl}>คุยกับแอดมิน</a>
            </div>
          </div>
        </section>

        <section className="shell search-panel" aria-label="ค้นหารถ">
          <h2>ค้นหารถที่ใช่สำหรับคุณ</h2>
          <form className="filter-grid">
            {["ประเภทรถ", "ยี่ห้อ", "รุ่น", "ช่วงราคา"].map((label) => (
              <label key={label}>
                <span>{label}</span>
                <select defaultValue="ทั้งหมด">
                  <option>ทั้งหมด</option>
                </select>
              </label>
            ))}
            <button type="button">ค้นหา</button>
          </form>
        </section>

        <section id="cars" className="shell section-block">
          <div className="section-head">
            <h2>รถแนะนำ</h2>
            <Link href={`/cars/${featuredCar.slug}`}>ดูรถทั้งหมด</Link>
          </div>
          <div className="car-grid">
            {cars.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        </section>

        <section id="promo" className="shell trust-strip">
          {[
            ["รถคุณภาพเกรด A", "คัดสรรสภาพดี ผ่านการตรวจสอบละเอียด"],
            ["ออกรถง่าย อนุมัติไว", "เอกสารไม่ยุ่งยาก รู้ผลไว"],
            ["ผ่อนสบาย ดอกเบี้ยพิเศษ", "มีหลายสถาบันการเงินให้เลือก"],
            ["บริการหลังการขาย", "รับประกันเครื่องยนต์และเกียร์สูงสุด 1 ปี"]
          ].map(([title, text]) => (
            <div key={title}>
              <span className="round-icon">✓</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section id="reviews" className="shell section-block reviews">
          <div className="section-head">
            <h2>รีวิวจากลูกค้า</h2>
            <Link href={lineUrl}>ดูรีวิวทั้งหมด</Link>
          </div>
          <div className="review-grid">
            {["คุณนนท์", "คุณแพรว", "คุณต้น"].map((name, index) => (
              <article key={name} className="review-card">
                <div className="avatar">{name.slice(3, 4)}</div>
                <div>
                  <h3>{name}</h3>
                  <p className="stars">★★★★★</p>
                  <p>{index === 1 ? "ออกรถง่าย อนุมัติไวจริงค่ะ ประทับใจมาก" : "รถสวยตรงปก บริการดีมากครับ แนะนำเลย"}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <Logo />
          <div>
            <h3>เมนูลัด</h3>
            <Link href="/">หน้าแรก</Link>
            <Link href="#cars">รถทั้งหมด</Link>
            <Link href="#promo">โปรโมชั่น</Link>
            <Link href="/blog">บทความ</Link>
            <Link href={lineUrl}>ติดต่อเรา</Link>
          </div>
          <div>
            <h3>ติดต่อเรา</h3>
            <a href={lineUrl}>LINE: ROADZ USED CARS</a>
          </div>
          <div>
            <h3>ที่ตั้ง</h3>
            <p>{showroomAddress}</p>
          </div>
          <div>
            <h3>เวลาทำการ</h3>
            <p>จันทร์ - เสาร์ 09:00 - 18:00 น.</p>
            <p>อาทิตย์ 10:00 - 17:00 น.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
