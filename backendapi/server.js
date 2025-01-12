require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/ChatRoute');
const chatHistory=[];
const app = express();
const port = process.env.PORT || 4000;

// הגדרות middleware
app.use(cors());
app.use(express.json());


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


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.use('/api', chatRoutes,validateRequest);

// נקודת קצה לבדיקת תקינות השרת
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Listning to ${port}`);
});