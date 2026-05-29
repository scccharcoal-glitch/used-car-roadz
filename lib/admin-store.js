import fs from "node:fs/promises";
import path from "node:path";
import adminCars from "@/data/admin-cars.json";
import blogPosts from "@/data/blog-posts.json";
import { normalizePost } from "@/lib/blog-utils";
import { normalizeCar } from "@/lib/car-utils";

const repoOwner = process.env.GITHUB_REPO_OWNER || "scccharcoal-glitch";
const repoName = process.env.GITHUB_REPO_NAME || "used-car-roadz";
const branch = process.env.GITHUB_BRANCH || "main";
const carsPath = "data/admin-cars.json";
const blogPath = "data/blog-posts.json";

function localPath(filePath) {
  return path.join(process.cwd(), filePath);
}

function getGithubToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
}

async function githubRequest(filePath) {
  const token = getGithubToken();
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodedPath}?ref=${branch}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      cache: "no-store"
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`);
  }
  return response.json();
}

async function commitGithubFile(filePath, content, message, encoding = "utf8") {
  const token = getGithubToken();
  if (!token) return false;

  const current = await githubRequest(filePath);
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const body = {
    message,
    branch,
    content: Buffer.from(content, encoding).toString("base64")
  };
  if (current?.sha) body.sha = current.sha;

  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodedPath}`, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub commit failed: ${response.status} ${errorText}`);
  }

  return true;
}

export async function readCars() {
  try {
    const text = await fs.readFile(localPath(carsPath), "utf8");
    return JSON.parse(text);
  } catch {
    return adminCars;
  }
}

export async function saveCars(cars, message = "Update ROADZ car data") {
  const normalized = cars.map(normalizeCar);
  const content = `${JSON.stringify(normalized, null, 2)}\n`;

  if (getGithubToken()) {
    await commitGithubFile(carsPath, content, message);
    return { mode: "github", needsRedeploy: true };
  }

  await fs.writeFile(localPath(carsPath), content);
  return { mode: "local", needsRedeploy: false };
}

export async function saveCar(carInput) {
  const cars = await readCars();
  const car = normalizeCar(carInput);
  const index = cars.findIndex((item) => item.slug === car.slug);

  if (index >= 0) {
    cars[index] = car;
  } else {
    cars.unshift(car);
  }

  const result = await saveCars(cars, `Publish ${car.title}`);
  return { car, ...result };
}

export async function deleteCar(slug) {
  const cars = await readCars();
  const nextCars = cars.filter((car) => car.slug !== slug);
  const result = await saveCars(nextCars, `Delete car ${slug}`);
  return { cars: nextCars, ...result };
}

export async function saveCarImages(slug, files) {
  const cars = await readCars();
  const car = cars.find((item) => item.slug === slug);
  if (!car) throw new Error("ไม่พบรถคันนี้");

  const safeFiles = files.filter((file) => file?.size && file.type?.startsWith("image/"));
  const startIndex = (car.images || []).length + 1;
  const imagePaths = [];

  for (let index = 0; index < safeFiles.length; index += 1) {
    const file = safeFiles[index];
    const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
    const filename = `${String(startIndex + index).padStart(2, "0")}${ext}`;
    const publicPath = `public/cars/${slug}/${filename}`;
    const imageUrl = `/cars/${slug}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (getGithubToken()) {
      await commitGithubFile(publicPath, buffer, `Upload image ${filename} for ${slug}`, "binary");
    } else {
      await fs.mkdir(localPath(`public/cars/${slug}`), { recursive: true });
      await fs.writeFile(localPath(publicPath), buffer);
    }

    imagePaths.push(imageUrl);
  }

  car.images = [...(car.images || []), ...imagePaths];
  const result = await saveCars(cars, `Update images for ${car.title}`);
  return { car: normalizeCar(car), images: imagePaths, ...result };
}

export async function readPosts() {
  try {
    const text = await fs.readFile(localPath(blogPath), "utf8");
    return JSON.parse(text);
  } catch {
    return blogPosts;
  }
}

export async function savePosts(posts, message = "Update ROADZ blog posts") {
  const normalized = posts.map(normalizePost);
  const content = `${JSON.stringify(normalized, null, 2)}\n`;

  if (getGithubToken()) {
    await commitGithubFile(blogPath, content, message);
    return { mode: "github", needsRedeploy: true };
  }

  await fs.writeFile(localPath(blogPath), content);
  return { mode: "local", needsRedeploy: false };
}

export async function savePost(postInput) {
  const posts = await readPosts();
  const post = normalizePost(postInput);
  const index = posts.findIndex((item) => item.slug === post.slug);

  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }

  const result = await savePosts(posts, `Publish blog post ${post.title}`);
  return { post, ...result };
}

export async function deletePost(slug) {
  const posts = await readPosts();
  const nextPosts = posts.filter((post) => post.slug !== slug);
  const result = await savePosts(nextPosts, `Delete blog post ${slug}`);
  return { posts: nextPosts, ...result };
}
