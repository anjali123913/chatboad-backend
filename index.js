// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const app = express();
// const port = process.env.PORT || 3000;

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Temporary in-memory storage (you can replace with DB later)
// const content = [];

// // ✅ Root route
// app.get("/", (req, res) => {
//     res.send("🚀 Gemini AI Backend is running successfully!");
// });

// // ✅ Route: Fetch stored responses
// app.get("/api", (req, res) => {
//     try {
//         return res.json(content);
//     } catch (error) {
//         console.error("Error fetching stored responses:", error);
//         return res.status(500).json({ error: "Failed to fetch stored responses" });
//     }
// });

// // ✅ Route: Process AI query
// app.post("/api/result", async (req, res) => {
//     try {
//         console.log("Received Body:", req.body);

//         // ✅ Extract query safely
//         const query =
//             req.body.query?.trim() ||
//             req.body?.[" query"]?.trim() ||
//             req.body?.prompt?.trim();

//         console.log("Extracted Query:", query);

//         if (!query || query === "") {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // ✅ Initialize Gemini AI client
//         const genAI = new GoogleGenerativeAI("AIzaSyCGDlYyzDuqMs5nSK_BEICcFrTi4w7_eJw");
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // ✅ Correct API call
//         const result = await model.generateContent(query);
//         const response = result.response.text();

//         console.log("AI Response:", response);

//         if (!response) {
//             return res.status(404).json({ message: "No result found" });
//         }

//         // ✅ Store query + answer in memory
//         const entry = { query, answer: response };
//         content.push(entry);

//         return res.json(entry);
//     } catch (error) {
//         console.error("Error processing query:", error);

//         // Detailed error feedback
//         if (error.status === 404) {
//             return res.status(404).json({
//                 error:
//                     "Requested model not found. Try using 'gemini-1.5-flash' or update @google/generative-ai package.",
//             });
//         }

//         if (error.status === 403) {
//             return res.status(403).json({
//                 error:
//                     "Access forbidden. Check if Generative Language API is enabled in Google AI Studio project.",
//             });
//         }

//         return res.status(500).json({
//             error:
//                 error.message || "Internal Server Error while processing the query",
//         });
//     }
// });

// // ✅ Start server
// app.listen(port, () => {
//     console.log(`✅ Server is running on http://localhost:${port}`);
// });


// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const app = express();
// app.use(cors());
// app.use(express.json());
// const port = process.env.PORT || 3000;

// const content = [];

// app.post("/api/result", async (req, res) => {
//   try {
//     const query = req.body.query?.trim();
//     if (!query) return res.status(400).json({ error: "Query required" });

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ latest SDK uses v1
//     const result = await model.generateContent(query);

//     const response = result.response?.text?.() || "No response";

//     content.push({ query, answer: response });
//     res.json({ query, answer: response });
//   } catch (err) {
//     console.error(err);
//     if (err.status === 404) {
//       return res.status(404).json({
//         error:
//           "Model not found. Ensure latest SDK and model 'gemini-1.5-flash' are used.",
//       });
//     }
//     if (err.status === 403) {
//       return res.status(403).json({
//         error:
//           "Access forbidden. Check Cloud Console key and Generative Language API is enabled.",
//       });
//     }
//     return res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

import express from "express";
import cors from "cors";

import "dotenv/config";

const app = express();
app.use(cors());
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
