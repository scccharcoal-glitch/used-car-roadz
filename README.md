# ROADZ Used Cars

Next.js website for ROADZ Used Cars, designed from the red/black ROADZ visual direction.

## Current Scope

- Home page matching the red/black premium used-car style
- Car detail page with gallery, sidebar CTA, seller card, trust points, installment panel, and related cars
- Real installment calculator with a Next.js API route at `/api/finance`
- Car data imported from one folder per car in `ไฟล์รถ/*`
- Car images copied into `public/cars/<slug>/`
- All contact actions point to LINE: `https://line.me/ti/p/Sc8V8TxeYc`
- No phone number is displayed in the UI
- SEO sitemap and robots routes
- Per-car on-page article section
- Admin dashboard at `/admin`

## Run Locally

```bash
cd /Users/thongpotter/Documents/Me/used-car-roadz
./node_modules/.bin/next dev --webpack -H 127.0.0.1 -p 3000
```

Then open:

```text
http://127.0.0.1:3000
```

## Verified

```bash
npm run build
```

Build passes in this workspace.

## Admin Dashboard

Open:

```text
https://used-car-roadz.vercel.app/admin
```

Local development password, when `ADMIN_PASSWORD` is not set:

```text
roadz-admin
```

For production on Vercel, set these Environment Variables:

```text
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=choose-a-long-random-secret
GITHUB_TOKEN=github-personal-access-token-with-repo-access
GITHUB_REPO_OWNER=scccharcoal-glitch
GITHUB_REPO_NAME=used-car-roadz
GITHUB_BRANCH=main
NEXT_PUBLIC_SITE_URL=https://used-car-roadz.vercel.app
```

The admin dashboard can:

- Add, edit, and delete cars
- Upload car images
- Edit the on-page SEO article
- Publish changes into `data/admin-cars.json`

On Vercel, publishing uses the GitHub token to commit back to the repository. That push triggers a new Vercel deployment automatically, so public pages update after the deployment finishes.

## Import Car Folders

Add one folder per car inside the source folder:

```text
ไฟล์รถ/
  A260510No-10000/
    car.txt or any .txt/.md file
    LINE_NOTE_...jpg
  A260504Ni/
    car.txt
    LINE_NOTE_...jpg
```

Then run:

```bash
npm run import:cars
```

The importer reads every car folder, copies images into `public/cars/<slug>/`, and writes `data/generated-cars.js`.

Recommended file format: [docs/car-folder-template.md](./docs/car-folder-template.md)

Optional on-page article files are supported per car folder:

```text
article.md
onpage.md
content.md
```

Example:

```md
# HONDA CITY e:HEV RS มือสอง น่าใช้ไหม

## เหมาะกับใคร
## จุดเด่น
## ไฟแนนซ์

เนื้อหาบทความสำหรับทำ SEO/on-page ของรถคันนี้...
```

This article appears at the bottom of each car detail page.

For another source location:

```bash
CARS_SOURCE_DIR="/path/to/ไฟล์รถ" npm run import:cars
```

Before pushing to GitHub/Vercel, run:

```bash
npm run import:cars
npm run build
```

## Vercel

Set this environment variable in Vercel after you know the production domain:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

Vercel build command:

```bash
npm run build
```

Important: Vercel uses the committed `data/admin-cars.json`, `data/generated-cars.js`, and `public/cars/` files. The admin dashboard edits `data/admin-cars.json`. If you use the folder importer locally, run `npm run import:cars`, then copy or merge imported data into the admin dashboard before publishing.
