import os, random

print("START")

# fallback keyword
keyword = "test captions"
slug = keyword.replace(" ", "-")

try:
    import requests

    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY','')}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "user", "content": f"Write HTML blog for {keyword}"}
            ]
        },
        timeout=15
    ).json()

    print("API RESPONSE:", res)

    content = res['choices'][0]['message']['content']

except Exception as e:
    print("API FAILED:", e)
    content = f"<html><body><h1>{keyword}</h1><p>Fallback content</p></body></html>"

os.makedirs("blog", exist_ok=True)

with open(f"blog/{slug}.html", "w") as f:
    f.write(content)

print("FILE CREATED")
