const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');
const adminPassword = 'EITAN'; // סיסמת אדמין
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
router.post('/verify-password', (req, res) => {
  const { password } = req.body;

  if (password === adminPassword) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

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


router.post('/save-settings', (req, res) => {
  const { model, apiKey } = req.body;
  if (!model) {
    return res.status(400).json({ success: false, message: 'Model is required' });
  }

  console.log(model,apiKey);
  openaiService.setModel(model);

  if (apiKey) {
    openaiService.setApiKey(apiKey);
  }

  console.log(`Model set to: ${model}`);
  console.log(`API key updated: ${apiKey || 'Using default API key'}`);
  res.json({ success: true });
});
module.exports = router;
