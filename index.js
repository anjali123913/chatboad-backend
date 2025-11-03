

import express from "express";
import cors from "cors";
// import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://sweet-kitsune-dbb520.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you're using cookies or auth headers
  })
);
app.use(express.json());

const content = [];

app.post("/api/result", async (req, res) => {
  try {
    const query = req.body.query?.trim();
    if (!query) return res.status(400).json({ error: "Query required" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [{ role: "user", content: query }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "No response";

    // ✅ Store query and answer in content array
    content.push({ query, answer });

    res.json({ query, answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route: Fetch stored responses
app.get("/api", (req, res) => {
  try {
    return res.json(content);
  } catch (error) {
    console.error("Error fetching stored responses:", error);
    return res.status(500).json({ error: "Failed to fetch stored responses" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
