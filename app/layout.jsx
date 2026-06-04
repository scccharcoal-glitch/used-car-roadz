import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://used-car-roadz.vercel.app";
const siteName = "ROADZ Used Cars";
const siteDescription =
  "รถมือสองคุณภาพเกรด A ออกรถง่าย อนุมัติไว พร้อมรับประกันและบริการหลังการขาย ติดต่อผ่าน LINE ได้ทันที";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "ROADZ Used Cars | รถมือสองคุณภาพเกรด A",
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: [
    "รถมือสอง",
    "รถมือสองกรุงเทพ",
    "รถมือสองตลิ่งชัน",
    "รถมือสองคุณภาพเกรด A",
    "ROADZ Used Cars",
    "จัดไฟแนนซ์รถมือสอง"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/cars/toyota-fortuner-2-8-v-4wd-at-2016/01.jpg",
        width: 1200,
        height: 630,
        alt: "ROADZ Used Cars รถมือสองคุณภาพเกรด A"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/cars/toyota-fortuner-2-8-v-4wd-at-2016/01.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
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
