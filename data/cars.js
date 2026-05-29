import { generatedCars } from "./generated-cars";

export const lineUrl = "https://line.me/ti/p/Sc8V8TxeYc";
export const showroomAddress = "กรุงเทพฯ เขตตลิ่งชัน ถนนกาญจนาภิเษก-สวนผัก (ภายในศูนย์รวมรถยนต์เดอะเบสท์ 5)";

const fallbackCars = [
  {
    slug: "honda-city-ehev-rs-2023",
    badge: "ยอดนิยม",
    brand: "HONDA",
    model: "CITY",
    trim: "1.5 e:HEV RS AT",
    title: "HONDA CITY 1.5 e:HEV RS AT",
    year: "2023",
    registeredYear: "2024",
    plate: "กพ 9987 เพชรบุรี",
    color: "เทา",
    engine: "เบนซิน + ไฟฟ้า 1500cc",
    mileage: "57,xxx กม.",
    fuel: "เบนซิน + ไฟฟ้า",
    transmission: "อัตโนมัติ",
    price: 549000,
    downPayment: 109800,
    installment: "9,xxx",
    category: "รถเก๋ง",
    seats: "5 ที่นั่ง",
    doors: "4 ประตู",
    condition: "เกรด A",
    images: Array.from({ length: 18 }, (_, index) => `/cars/honda-city/LINE_NOTE_260529_${index + 1}.jpg`),
    keywords: [
      "honda city hatchback",
      "honda city hatchback rs",
      "honda city มือสอง",
      "city 1.5 rs e hev",
      "city 1.5 e hev ราคา",
      "city 1.5 e hev rs"
    ],
    highlights: [
      "รับประกันเครื่องยนต์และเกียร์ 2 ปี หรือ 20,000 กิโลเมตร",
      "รถประวัติดี มีเอกสารครบถ้วน",
      "ไม่เคยมีอุบัติเหตุหนัก",
      "ไม่เคยไฟไหม้หรือน้ำท่วม",
      "ผ่านการตรวจสภาพ U-Car Grading 344 จุด โดย Goo Inspection JAAA ญี่ปุ่น"
    ],
    promotions: [
      "บริการจัดไฟแนนซ์ให้ถึงบ้านทั่วประเทศ",
      "ตรวจเช็คระบบของเหลวและเปลี่ยนถ่ายน้ำมันเครื่องก่อนส่งมอบ",
      "ล้าง อบโอโซน และสปารถก่อนส่งมอบ",
      "บริการส่งมอบรถให้ถึงบ้านทั่วประเทศ",
      "บริการช่วยเหลือฉุกเฉิน 24 ชั่วโมง 1 ปีเต็ม"
    ],
    features: [
      "ระบบเบรก ABS",
      "AIRBAG 6 ตำแหน่ง",
      "หน้าจอสัมผัส",
      "กล้องมองหลัง",
      "เบาะหนัง",
      "พวงมาลัยมัลติฟังก์ชัน",
      "ระบบควบคุมการทรงตัว",
      "ระบบช่วยออกตัวบนทางลาดชัน",
      "ล้อแม็ก"
    ],
    description:
      "HONDA CITY 1.5 e:HEV RS AT ปี 2023 จด 2024 สีเทา สภาพสวย ประวัติดี เอกสารครบ พร้อมรับประกันและบริการหลังการขาย เหมาะสำหรับคนที่ต้องการรถไฮบริดประหยัดน้ำมัน ขับสบาย และดูแลง่าย"
  },
  {
    slug: "toyota-altis-2020",
    badge: "ใหม่ล่าสุด",
    brand: "TOYOTA",
    model: "ALTIS",
    trim: "1.6 G",
    title: "TOYOTA ALTIS 1.6 G",
    year: "2020",
    mileage: "45,xxx กม.",
    fuel: "เบนซิน",
    transmission: "อัตโนมัติ",
    price: 589000,
    installment: "10,xxx",
    category: "รถเก๋ง",
    images: ["/cars/honda-city/LINE_NOTE_260529_2.jpg"],
    description: "รถเก๋งยอดนิยม ดูแลง่าย พร้อมจัดไฟแนนซ์"
  },
  {
    slug: "mazda-3-2021",
    badge: "ใหม่ล่าสุด",
    brand: "MAZDA",
    model: "3",
    trim: "2.0 SP",
    title: "MAZDA 3 2.0 SP",
    year: "2021",
    mileage: "30,xxx กม.",
    fuel: "เบนซิน",
    transmission: "อัตโนมัติ",
    price: 799000,
    installment: "14,xxx",
    category: "รถเก๋ง",
    images: ["/cars/honda-city/LINE_NOTE_260529_3.jpg"],
    description: "ดีไซน์สปอร์ต ภายในพรีเมียม พร้อมใช้งาน"
  },
  {
    slug: "corolla-cross-2022",
    badge: "แนะนำ",
    brand: "COROLLA",
    model: "CROSS",
    trim: "1.8 HYBRID",
    title: "COROLLA CROSS 1.8 HYBRID",
    year: "2022",
    mileage: "38,xxx กม.",
    fuel: "ไฮบริด",
    transmission: "อัตโนมัติ",
    price: 899000,
    installment: "16,xxx",
    category: "SUV",
    images: ["/cars/honda-city/LINE_NOTE_260529_4.jpg"],
    description: "SUV ไฮบริดครอบครัว ประหยัดและนั่งสบาย"
  }
];

export const cars = generatedCars.length ? generatedCars : fallbackCars;
export const featuredCar = cars[0];

export function formatBaht(value) {
  return new Intl.NumberFormat("th-TH").format(value);
}
