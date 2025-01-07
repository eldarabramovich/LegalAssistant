const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const tokenCount = openaiService.countTokens(prompt);

    if (tokenCount > openaiService.maxTokens) {
      return res
        .status(400)
        .json({ error: `The prompt exceeds the limit of ${openaiService.maxTokens} tokens` });
    }

    const response = await openaiService.generateChatResponse(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
