import requests, os, random

with open('keywords.txt') as f:
    keywords = [k.strip() for k in f if k.strip()]

keyword = random.choice(keywords)
slug = keyword.lower().replace(" ", "-")

print("Keyword:", keyword)

try:
    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY','')}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "user", "content": f"Create HTML page for {keyword}"}
            ]
        }
    ).json()

    content = res['choices'][0]['message']['content']

except:
    content = f"<html><body><h1>{keyword}</h1></body></html>"

os.makedirs("blog", exist_ok=True)

with open(f"blog/{slug}.html", "w") as f:
    f.write(content)

print("Created:", slug)
