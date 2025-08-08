import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY not set" });
    return;
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      res.status(400).json({ error: "Missing 'message'." });
      return;
    }

    const system = `You are Wesley AI for Dalton First UMC (daltonfumc.com). 
Tone: warm, invitational, concise. Use short paragraphs. 
Primary facts (temporary staging):
- Service times: Sundays 9:30 AM (Modern) & 11:00 AM (Traditional). 
- Wonderful Wednesdays (Aug–Apr): dinner 5:00 PM, programming 6:00 PM.
- Address: 500 S. Thornton Ave, Dalton, GA 30720. Phone: (706) 278-8494.
- Guest parking: west side of the building (off Thornton Ave).
- Watch online: Live & On-Demand pages on the website.
- Give: https://daltonfumc.com/give (ask for a confirmation 'yes' before sharing link).
- Pastoral care/prayer/sensitive topics: route to Contact page (https://daltonfumc.com/contact).
- Name usage: always say "Dalton First UMC", never DFUMC or FUMC alone.
- Keep answers on-mission. If asked for local directions/landmarks in Dalton/Chattanooga area, give simple, general guidance and suggest maps for precise navigation.

Guidelines:
- Prefer direct answers with one relevant next step or link.
- If not sure, say you’re not sure and offer the Contact page.
- Avoid doctrinal debate. Offer a friendly invitation to visit or connect.
`;

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 600
    });

    const reply = completion.choices?.[0]?.message?.content || "Sorry, I had trouble responding.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
