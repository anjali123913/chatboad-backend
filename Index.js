import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const content = [];

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json()); // ✅ Middleware to handle JSON requests

// 
app.get("/api",(req,res)=>
{
    return res.json(content)
})


app.post("/api/result", async (req, res) => {
    const { query } = req.body;
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyBpiu-YI3QcA9afGd9toOXTh6EelSHNko8");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(query);
        const response = result.response.text();
        if (response) {
            content.push({
                answer: response,
                query: query
            });
            return res.json(content);
        }
        return res.json({
            message: "not result"
        })
    } catch (error) {
        return res.json(error + "Error");;
    }

});




app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
