import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "roadz_admin";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "roadz-local-session";
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const encoded = base64url(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;
  const [encoded, signature] = token.split(".");
  if (signature !== sign(encoded)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminRequest() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "กรุณาเข้าสู่ระบบหลังบ้าน" }, { status: 401 });
  }
  return null;
}

export function canLogin(password) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword) return password === configuredPassword;
  return process.env.NODE_ENV !== "production" && password === "roadz-admin";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD) || process.env.NODE_ENV !== "production";
}
