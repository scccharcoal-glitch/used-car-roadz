import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ROADZ Used Cars | รถมือสองคุณภาพเกรด A",
  description:
    "รถมือสองคุณภาพเกรด A ออกรถง่าย อนุมัติไว พร้อมรับประกันและบริการหลังการขาย ติดต่อผ่าน LINE ได้ทันที",
  openGraph: {
    title: "ROADZ Used Cars",
    description: "รถมือสองคุณภาพเกรด A พร้อมไฟแนนซ์และบริการส่งมอบทั่วประเทศ",
    type: "website"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg"
  },
  verification: {
    google: "L58KGJi9DZ5BWkQA5CJQr-Iw1-RbN83M5tAMmQls8pY"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
