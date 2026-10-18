export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "AI service is not configured. Set OPENAI_API_KEY in the deployment environment." });
  }
  const { message, history = [] } = req.body || {};
  if (typeof message !== "string" || !message.trim() || message.length > 1000) {
    return res.status(400).json({ error: "Please send a question up to 1000 characters." });
  }
  const safeHistory = Array.isArray(history)
    ? history.filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
        .slice(-10).map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }))
    : [];
  const instructions = [
    "You are Dr. Heimdall, the friendly FAQ assistant for Heimdall EMS, a student website concept based in Johannesburg, South Africa.",
    "Answer naturally and helpfully, including questions phrased in the user's own words. Explain the four demo roles: EMS Crew, Nurse/Receiving Team, EMS Admin, and Hospital Admin.",
    "Explain the fictional emergency walkthrough, demo patient portal and next-of-kin fields, sample medical-aid status, dispatch, illustrative Johannesburg map, contact form, and light/dark mode when relevant.",
    "Be honest that this is a student prototype. Do not claim live GPS tracking, actual medical-aid verification, secure accounts, persistent patient records, hospital integrations, or real dispatch exist.",
    "Never request or encourage users to share real patient/medical data. If someone describes an active emergency, tell them to call South Africa's emergency services (112 from a mobile phone) instead of relying on this website.",
    "Keep answers clear and concise. If a question is unrelated, still try to help briefly and guide the user back to the Heimdall site."
  ].join(" ");
  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions,
        input: [...safeHistory, { role: "user", content: message.trim() }],
        max_output_tokens: 450
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI API error:", data.error?.message || upstream.status);
      return res.status(502).json({ error: "The AI service could not answer right now. Please try again shortly." });
    }
    const reply = data.output_text || (data.output || []).flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text").map((item) => item.text).join("\n").trim();
    if (!reply) return res.status(502).json({ error: "The AI service returned an empty answer." });
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI request failed:", error.message);
    return res.status(500).json({ error: "Unable to reach the AI service right now." });
  }
}
