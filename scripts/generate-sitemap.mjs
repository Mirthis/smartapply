// @ts-nocheck
import { writeFileSync } from "fs";
import { globby } from "globby";

const exclude = [
  "!src/pages/applications.tsx",
  "!src/pages/accounts.tsx",
  "!src/pages/profile.tsx",
  "!src/pages/404.tsx",
  "!src/pages/terms.tsx",
  "!src/pages/privacy.tsx",
  "!src/pages/contact.tsx",
  "!src/pages/_app.tsx",
];

const priorities = [];
priorities[""] = "1.0";
priorities["/new"] = "0.8";

function addPage(page) {
  const path = page
    .replace("src/pages", "")
    // .replace(".ts", "")
    .replace(".tsx", "");
  const route = path === "/index" ? "" : path;
  const priority = priorities[route] || "0.5";

  return `  <url>
    <loc>${`${process.env.WEBSITE_URL}${route}`}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    // "src/pages/**/*{.ts,.tsx}",
    "src/pages/*{.ts,.tsx}",
<<<<<<< HEAD
    "!src/pages/applications.tsx",
    "!src/pages/accounts.tsx",
    "!src/pages/profile.tsx",
    "!src/pages/_*.tsx",
=======
    ...exclude,
>>>>>>> main
    "!src/pages/api",
  ]);
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(addPage).join("\n")}
</urlset>`;

  writeFileSync("public/sitemap.xml", sitemap);
}

generateSitemap();
