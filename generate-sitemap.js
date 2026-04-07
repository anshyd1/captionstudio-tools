const fs = require('fs');

const blogs = require('./data/blog.json');

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// MAIN
xml += `
<url>
  <loc>https://captionstudio.in/</loc>
  <priority>1.0</priority>
</url>

<url>
  <loc>https://captionstudio.in/blog/</loc>
  <priority>0.9</priority>
</url>`;

// BLOGS AUTO
blogs.forEach(blog => {
  xml += `
  <url>
    <loc>https://captionstudio.in/blog/${blog.link}</loc>
    <lastmod>${blog.date || '2026-04-06'}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${blog.hot ? '0.9' : '0.7'}</priority>
  </url>`;
});

xml += `</urlset>`;

// SAVE FILE (ROOT me save karo, public me nahi)
fs.writeFileSync('./sitemap.xml', xml);

console.log("✅ Sitemap generated!");
