const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

// מפתח ה-API שלך ל-GPT (ודא שהמפתח שלך מוגדר בקובץ סביבה)
const API_KEY = process.env.API_KEY; //מומלץ לשמור את המפתח בקובץ .env

// נתיב לבדיקה עם GPT
router.post("/chat", async (req, res) => {
  try {
    console.log("Received POST request to /chat");
    console.log("Request body:", req.body);

    // וידוא שגוף הבקשה קיים
    if (!req.body || !req.body.prompt) {
      console.log("No prompt provided in the request body.");
      return res.status(400).json({ error: "Prompt is required." });
    }

    const { prompt } = req.body;

    // בקשה ל-OpenAI API
    console.log("Sending request to OpenAI API...");
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("Response from OpenAI received:", response.data);

    // בדיקה אם יש תשובה חוקית מה-API
    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0
    ) {
      console.log("No valid response received from OpenAI API.");
      return res
        .status(500)
        .json({ error: "Invalid response from ChatGPT API." });
    }

    // שליחת תשובה ללקוח
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);

    // טיפול בשגיאות לפי סוג השגיאה
    if (error.response) {
      // שגיאה מה-API של OpenAI
      console.error("OpenAI API Error:", error.response.data);
      res.status(error.response.status).json({
        error: "Error from ChatGPT API",
        details: error.response.data,
      });
    } else if (error.request) {
      // שגיאה בבקשה (לא התקבלה תשובה)
      console.error("No response received from OpenAI API.");
      res.status(500).json({
        error: "No response from ChatGPT API.",
      });
    } else {
      // שגיאה כללית
      console.error("Unexpected error:", error.message);
      res.status(500).json({
        error: "Unexpected error occurred.",
      });
    }
  }
});

module.exports = router;
