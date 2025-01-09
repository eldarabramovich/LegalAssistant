const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

let chatHistory = []; // משתנה גלובלי לשמירת היסטוריית השיחות

// Middleware לבדיקת תקינות הבקשה
const validateRequest = (req, res, next) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a string' });
  }
  next();
};

// נתיב POST: שליחת הודעה וקבלת תשובה
router.post('/chat', validateRequest, async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openaiService.generateChatResponse(prompt);

    // שמירת השיחה בהיסטוריה
    chatHistory.push({ prompt, response });

    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// נתיב GET: החזרת ההיסטוריה
router.get('/history', (req, res) => {
  res.json(chatHistory); // מחזיר את כל ההיסטוריה
});

module.exports = router;
