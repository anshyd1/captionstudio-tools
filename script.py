import os, random, datetime, json, requests

BASE_URL = "https://captionstudio.in"

# 🔑 load keywords
with open("keywords.txt") as f:
    keywords = [k.strip() for k in f if k.strip()]

keyword = random.choice(keywords)
slug = keyword.lower().replace(" ", "-")

print("Generating:", keyword)

# 🔥 AI content (Groq)
content = ""
try:
    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": "Bearer " + os.environ.get("GROQ_API_KEY",""),
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "user", "content": f"""
Write a clean HTML blog for "{keyword}"

Include:
- <title>
- meta description
- H1
- intro
- 50 captions in <ul>
- FAQ
- clean HTML only
"""}
            ]
        },
        timeout=20
    )

    data = res.json()
    content = data["choices"][0]["message"]["content"]

except:
    content = f"<html><body><h1>{keyword}</h1></body></html>"

# 🔗 internal links
links_html = ""
for k in keywords[:5]:
    if k != keyword:
        slug_k = k.replace(" ", "-")
        links_html += f'<li><a href="/blog/{slug_k}.html">{k}</a></li>'

content += f"""
<h2>Related Pages</h2>
<ul>{links_html}</ul>
"""

# 💾 save blog
os.makedirs("blog", exist_ok=True)
with open(f"blog/{slug}.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Blog saved")

# 📄 index.html
files = [f for f in os.listdir("blog") if f.endswith(".html")]

index_html = "<h1>All Blogs</h1><ul>"
for f_name in files:
    index_html += f'<li><a href="/blog/{f_name}">{f_name}</a></li>'
index_html += "</ul>"

with open("index.html", "w") as f:
    f.write(index_html)

print("Index updated")

# 🗺 sitemap.xml
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for f_name in files:
    sitemap += f"""
<url>
  <loc>{BASE_URL}/blog/{f_name}</loc>
  <lastmod>{datetime.datetime.now().strftime('%Y-%m-%d')}</lastmod>
</url>
"""

sitemap += "</urlset>"

with open("sitemap.xml", "w") as f:
    f.write(sitemap)

print("Sitemap updated")

# 📦 posts.json
posts = []
for f_name in files:
    posts.append({
        "title": f_name.replace(".html",""),
        "url": f"{BASE_URL}/blog/{f_name}"
    })

with open("posts.json", "w") as f:
    json.dump(posts, f, indent=2)

print("JSON updated")
