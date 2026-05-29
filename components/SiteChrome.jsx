import Link from "next/link";
import { lineUrl, showroomAddress } from "@/data/cars";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="ROADZ Used Cars">
      <span className="logo-mark">ROADZ</span>
      <span>USED CARS</span>
    </Link>
  );
}

export function Header() {
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
          <Link href="/blog">บทความ</Link>
          <Link href={lineUrl}>ติดต่อเรา</Link>
        </nav>
        <a className="line-button" href={lineUrl}>ติดต่อ LINE</a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <Logo />
        <div>
          <h3>เมนูลัด</h3>
          <Link href="/">หน้าแรก</Link>
          <Link href="/#cars">รถทั้งหมด</Link>
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
  );
}
