import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const content = [];
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json()); // ✅ Ensure JSON body parsing

// ✅ Route to fetch stored AI responses
app.get("/api", (req, res) => {
    try {
        return res.json(content);
    } catch (error) {
        console.error("Error fetching stored responses:", error);
        return res.status(500).json({ error: "Failed to fetch stored responses" });
    }
});

// ✅ Route to process AI query
app.post("/api/result", async (req, res) => {
    try {
        console.log("Received Body:", req.body); // Debugging line

        // ✅ Fix: Extract the query and remove unwanted spaces from keys
        const query = req.body.query?.trim() || req.body?.[" query"]?.trim();
        console.log("Extracted Query:", query);

        // ✅ Validate input
        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Query is required" });
        }

        // ✅ Initialize AI model
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // ✅ Corrected Input Format
        const result = await model.generateContent({
            contents: [{ parts: [{ text: query }] }]
        });

        console.log("AI Raw Response:", result);

        // ✅ Extract AI-generated response correctly
        const response = await result.response.text(); // FIXED HERE

        if (!response) {
            return res.status(404).json({ message: "No result found" });
        }

        // ✅ Store response
        const entry = { query, answer: response };
        content.push(entry);

        return res.json(entry);
    } catch (error) {
        console.error("Error processing query:", error);

        if (error.response) {
            return res.status(500).json({ error: error.response.data || "AI service error" });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});


