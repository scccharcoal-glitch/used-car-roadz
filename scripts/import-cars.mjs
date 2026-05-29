import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const sourceDir =
  process.env.CARS_SOURCE_DIR ||
  "/Users/thongpotter/Documents/My web/รถมือสอง/ไฟล์รถ";
const publicCarsDir = path.join(projectRoot, "public", "cars");
const outputFile = path.join(projectRoot, "data", "generated-cars.js");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function cleanText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[✅📋🚫🚒💧🇯🇵✨💰💵]/g, "")
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function normalizeLine(line) {
  return cleanText(line).replace(/^#+/, "").trim();
}

function slugify(value, fallback) {
  const base = String(value || fallback || "car")
    .toLowerCase()
    .replace(/e-hev/g, "ehev")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || fallback || "car";
}

function numericParts(value) {
  return String(value)
    .match(/\d+/g)
    ?.map((number) => Number(number)) || [0];
}

function sortByNameNumber(a, b) {
  const aParts = numericParts(a);
  const bParts = numericParts(b);
  for (let index = 0; index < Math.max(aParts.length, bParts.length); index += 1) {
    const diff = (aParts[index] || 0) - (bParts[index] || 0);
    if (diff !== 0) return diff;
  }
  return a.localeCompare(b);
}

function readField(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}\\s*:\\s*([^\\n]+)`, "i"));
  return match ? cleanText(match[1]) : "";
}

function readPrice(text) {
  const match = text.match(/ราคา\s*:\s*([0-9,]+)/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function readInstallment(text) {
  const match = text.match(/ผ่อนเริ่มต้น\s*:\s*(?:เพียง)?\s*([^บาท\n]+บาท?)/i);
  if (!match) return "";
  return cleanText(match[1]).replace(/\s*บาท?$/i, "");
}

function readYear(title) {
  return title.match(/ปี\s*(\d{4})/)?.[1] || "";
}

function readRegisteredYear(title) {
  return title.match(/จด\s*(\d{4})/)?.[1] || "";
}

function readCategory(lines) {
  const tag = lines.find((line) => cleanText(line).startsWith("#รถ"));
  return tag ? cleanText(tag).replace(/^#/, "") : "รถมือสอง";
}

function readKeywords(lines) {
  const keywords = [];
  let inKeywordBlock = false;
  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) {
      if (inKeywordBlock) break;
      continue;
    }
    if (/^keyword/i.test(line)) {
      inKeywordBlock = true;
      const afterKeyword = line.replace(/^keyword/i, "").replace(/^[:,\s]+/, "").trim();
      if (afterKeyword) keywords.push(afterKeyword);
      continue;
    }
    if (inKeywordBlock) {
      if (!line.startsWith(",")) break;
      keywords.push(line.replace(/^,+/, "").trim());
    }
  }
  return keywords.filter(Boolean);
}

function readTitle(lines) {
  return normalizeLine(
    lines.find((line) => {
      const normalized = normalizeLine(line);
      return normalized && !/^keyword/i.test(normalized) && !normalized.startsWith(",");
    })
  );
}

function splitTitle(title) {
  const titleWithoutYear = title.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  const tokens = titleWithoutYear.split(" ");
  const brand = tokens[0] || "USED";
  const model = tokens[1] || "CAR";
  const trim = tokens.slice(2).join(" ") || titleWithoutYear;
  return { brand, model, trim };
}

function inferFuel(engine) {
  if (/ไฟฟ้า|hybrid|hev/i.test(engine)) return "เบนซิน + ไฟฟ้า";
  if (/ดีเซล/i.test(engine)) return "ดีเซล";
  if (/เบนซิน/i.test(engine)) return "เบนซิน";
  return engine || "-";
}

function inferTransmission(title) {
  if (/\bAT\b|อัตโนมัติ/i.test(title)) return "อัตโนมัติ";
  if (/\bMT\b|ธรรมดา/i.test(title)) return "ธรรมดา";
  return "อัตโนมัติ";
}

function readPromotions(lines) {
  const items = [];
  let collecting = false;
  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) continue;
    if (/โปรโมชั่นพิเศษ/.test(line)) {
      collecting = true;
      continue;
    }
    if (collecting && cleanText(rawLine).startsWith("#")) break;
    if (collecting) {
      const item = line.replace(/^ฟรี!\s*/, "").replace(/^รับประกัน:\s*/, "รับประกัน ").trim();
      if (item) items.push(item);
    }
  }
  return items;
}

function readHighlights(lines) {
  const items = [];
  let collecting = false;
  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) continue;
    if (/โปรโมชั่นพิเศษ/.test(line)) break;
    if (/รับประกัน|รถประวัติดี|ไม่เคย|ผ่านการตรวจสภาพ/.test(line)) collecting = true;
    if (collecting) {
      const item = line.replace(/^รับประกัน:\s*/, "รับประกัน ").trim();
      if (item && !/^[0-9a-z]+$/i.test(item)) items.push(item);
    }
  }
  return items;
}

async function findTextFile(carDir) {
  const entries = await fs.readdir(carDir);
  const candidates = entries.filter((entry) => {
    const name = entry.trim().toLowerCase();
    return name === "readme.md" || name.endsWith(".txt") || name.endsWith(".md");
  });
  candidates.sort((a, b) => {
    const score = (name) => {
      const cleanName = name.trim().toLowerCase();
      if (cleanName === "car.txt") return 0;
      if (cleanName.endsWith(".txt")) return 1;
      if (cleanName === "readme.md") return 2;
      return 3;
    };
    return score(a) - score(b);
  });
  return candidates[0] ? path.join(carDir, candidates[0]) : null;
}

async function findArticleFile(carDir) {
  const entries = await fs.readdir(carDir);
  const candidates = entries.filter((entry) => {
    const name = entry.trim().toLowerCase();
    return ["article.md", "article.txt", "onpage.md", "onpage.txt", "content.md", "content.txt"].includes(name);
  });
  return candidates[0] ? path.join(carDir, candidates[0]) : null;
}

async function readOnPageArticle(carDir, car) {
  const articleFile = await findArticleFile(carDir);
  if (articleFile) {
    const raw = await fs.readFile(articleFile, "utf8");
    const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
    const titleLine = lines.find((line) => line.startsWith("# ")) || "";
    const headingLines = lines.filter((line) => line.startsWith("## ")).map((line) => normalizeLine(line.replace(/^##\s*/, "")));
    const body = lines
      .filter((line) => !line.startsWith("#"))
      .map(normalizeLine)
      .join("\n\n");

    return {
      title: normalizeLine(titleLine.replace(/^#\s*/, "")) || `${car.title} มือสอง`,
      headings: headingLines,
      body
    };
  }

  return {
    title: `${car.title} มือสอง ราคา ${car.price ? car.price.toLocaleString("th-TH") : "-"} บาท`,
    headings: [
      `${car.title} เหมาะกับใคร`,
      "จุดเด่นและความคุ้มค่า",
      "เอกสารและไฟแนนซ์"
    ],
    body: [
      `${car.title} เป็นรถมือสอง${car.category ? `ประเภท${car.category}` : ""} สี${car.color || "-"} เลขไมล์ ${car.mileage || "-"} เหมาะสำหรับลูกค้าที่ต้องการรถสภาพดี ใช้งานง่าย และมีข้อมูลตรวจสอบครบก่อนตัดสินใจ`,
      `คันนี้มาพร้อมเครื่องยนต์${car.engine || "-"} เกียร์${car.transmission || "-"} ราคา ${car.price ? car.price.toLocaleString("th-TH") : "-"} บาท และผ่อนเริ่มต้นประมาณ ${car.installment || "-"} บาทต่อเดือนตามเงื่อนไขไฟแนนซ์`,
      "ลูกค้าสามารถสอบถามรายละเอียดเพิ่มเติม ขอแผนผ่อน นัดดูรถ หรือขอรูปเพิ่มเติมผ่าน LINE ได้โดยตรง"
    ].join("\n\n")
  };
}

async function importCar(carDir, folderName) {
  const textFile = await findTextFile(carDir);
  if (!textFile) return null;

  const rawText = await fs.readFile(textFile, "utf8");
  const lines = rawText.split("\n");
  const title = readTitle(lines);
  const { brand, model, trim } = splitTitle(title);
  const year = readYear(title);
  const registeredYear = readRegisteredYear(title);
  const price = readPrice(rawText);
  const slug = slugify(`${brand}-${model}-${trim}-${year || folderName}`, folderName);
  const targetDir = path.join(publicCarsDir, slug);

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(carDir);
  const imageNames = entries
    .filter((entry) => imageExtensions.has(path.extname(entry).toLowerCase()))
    .sort(sortByNameNumber);

  const images = [];
  for (let index = 0; index < imageNames.length; index += 1) {
    const imageName = imageNames[index];
    const ext = path.extname(imageName).toLowerCase();
    const newName = `${String(index + 1).padStart(2, "0")}${ext}`;
    await fs.copyFile(path.join(carDir, imageName), path.join(targetDir, newName));
    images.push(`/cars/${slug}/${newName}`);
  }

  const highlights = readHighlights(lines);
  const promotions = readPromotions(lines);
  const engine = readField(rawText, "เครื่องยนต์");

  const importedCar = {
    slug,
    sourceFolder: folderName,
    badge: "ใหม่ล่าสุด",
    brand,
    model,
    trim,
    title: title.replace(/\s*\([^)]*\)\s*/g, " ").trim(),
    year,
    registeredYear,
    plate: readField(rawText, "ทะเบียน"),
    color: readField(rawText, "สี"),
    engine,
    mileage: readField(rawText, "เลขไมล์ปัจจุบัน"),
    fuel: inferFuel(engine),
    transmission: inferTransmission(title),
    price,
    installment: readInstallment(rawText),
    category: readCategory(lines),
    seats: "5 ที่นั่ง",
    doors: "4 ประตู",
    condition: "เกรด A",
    images,
    keywords: readKeywords(lines),
    highlights: highlights.length
      ? highlights.slice(0, 6)
      : [
          "รับประกันเครื่องยนต์และเกียร์ 2 ปี หรือ 20,000 กิโลเมตร",
          "รถประวัติดี มีเอกสารครบถ้วน",
          "ไม่เคยมีอุบัติเหตุหนัก",
          "ไม่เคยไฟไหม้หรือน้ำท่วม"
        ],
    promotions: promotions.length
      ? promotions
      : [
          "บริการจัดไฟแนนซ์ให้ถึงบ้านทั่วประเทศ",
          "ตรวจเช็คระบบของเหลวก่อนส่งมอบ",
          "บริการส่งมอบรถให้ถึงบ้านทั่วประเทศ"
        ],
    features: [
      "ระบบเบรก ABS",
      "AIRBAG",
      "กล้องมองหลัง",
      "เบาะหนัง",
      "พวงมาลัยมัลติฟังก์ชัน",
      "ล้อแม็ก"
    ],
    description: `${title.replace(/\s*\([^)]*\)\s*/g, " ").trim()} สี${readField(rawText, "สี") || "-"} เลขไมล์ ${readField(rawText, "เลขไมล์ปัจจุบัน") || "-"} รถประวัติดี เอกสารครบ พร้อมรับประกันและบริการหลังการขาย`
  };

  importedCar.onPageArticle = await readOnPageArticle(carDir, importedCar);
  return importedCar;
}

async function main() {
  await fs.rm(publicCarsDir, { recursive: true, force: true });
  await fs.mkdir(publicCarsDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const cars = [];

  for (const folder of folders) {
    const car = await importCar(path.join(sourceDir, folder), folder);
    if (car) cars.push(car);
  }

  cars.sort((a, b) => b.sourceFolder.localeCompare(a.sourceFolder));
  if (cars[0]) cars[0].badge = "ยอดนิยม";

  const output = `// Generated by scripts/import-cars.mjs. Do not edit by hand.\nexport const generatedCars = ${JSON.stringify(cars, null, 2)};\n`;
  await fs.writeFile(outputFile, output, "utf8");
  console.log(`Imported ${cars.length} cars from ${sourceDir}`);
  for (const car of cars) {
    console.log(`- ${car.title} -> ${car.slug} (${car.images.length} images)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
