# Instant Wesley AI (Staging)

This is a super‑light, **temporary** version of Wesley AI you can deploy in minutes while the full RAG‑powered bot is built.

## What it does
- Simple chat endpoint using OpenAI (no database).
- A small, on‑brand web widget (teal #1495A0) you can embed with one script tag.
- Hard‑coded Dalton First UMC facts to bias accurate answers.
- Routes pastoral care to the Contact page and confirms before opening the Give link.

## Deploy (Vercel – fastest)
1) Create a new Vercel project, import this folder.
2) Set an environment variable: `OPENAI_API_KEY` (required).
3) Deploy. Vercel will give you a domain like `https://<project>.vercel.app`.

## Embed on your website
Paste this in your site footer/header (replace the URL with your deployed domain):

```html
<!-- Wesley AI (instant staging) -->
<script>
  (function () {
    window.WESLEY_AI_CONFIG = {
      brand: {
        name: "Dalton First UMC",
        botName: "Wesley AI",
        color: "#1495A0"
      },
      welcome: "👋 Welcome to Dalton First UMC! I’m Wesley AI — ask me about service times, events, or planning your first visit.",
      contactUrl: "https://daltonfumc.com/contact",
      giveUrl: "https://daltonfumc.com/give"
    };
    var s = document.createElement('script');
    s.async = true;
    s.src = "https://REPLACE_WITH_YOUR_DOMAIN/public/loader.js";
    document.head.appendChild(s);
  })();
</script>
```

## Local dev
- `npm install`
- `vercel dev` (or `node example/test.html` served via any static server)

## Notes
- This instant build does **not** include retrieval/citations. It relies on the system prompt + a few facts. 
- Expect occasional generic answers — we’ll swap in the full RAG bot shortly.
