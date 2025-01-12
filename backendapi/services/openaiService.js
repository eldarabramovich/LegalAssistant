require('dotenv').config();
const OpenAI = require('openai');
const { encoding_for_model } = require('tiktoken');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''; // מפתח ברירת המחדל
    this.openai = this.apiKey ? new OpenAI({ apiKey: this.apiKey }) : null; // אם אין מפתח, openai יוגדר כ-null
    this.model = 'gpt-3.5-turbo'; // מודל ברירת המחדל
    this.maxTokens = 4096; // מגבלת טוקנים ברירת מחדל
    this.defaultResponseTokens = 150;
  }

  setApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey; // שמירת המפתח החדש
    this.openai = new OpenAI({ apiKey }); // יצירת אינסטנס חדש עם המפתח החדש
    console.log('API key updated successfully');
  }

  setModel(model) {
    if (!model) {
      throw new Error('Model is required');
    }
    this.model = model; // שינוי המודל
    console.log(`Model updated to: ${model}`);
  }

  countTokens(text) {
    if (!text) return 0;

    try {
      console.log('Loading encoding...');
      const encoding = encoding_for_model(this.model);
      console.log('Encoding loaded successfully');
      const tokens = encoding.encode(text);
      encoding.free(); // שחרור הזיכרון
      console.log(`Token count: ${tokens.length}`);
      return tokens.length;
    } catch (error) {
      console.error('Error in counting tokens:', error);
      throw new Error('Failed to count tokens');
    }
  }

  async generateChatResponse(prompt) {
    try {
      console.log('Generating response...');
      console.log(`Current model in use: ${this.model}`); // הדפסת המודל העדכני
      console.log(`Current API key in use: ${this.openai.apiKey}`); // הדפסת המפתח בשימוש
  
      const tokenCount = this.countTokens(prompt);
      console.log(`Token count for the prompt: ${tokenCount}`); // מספר הטוקנים
  
      if (tokenCount > this.maxTokens) {
        throw new Error(`The prompt exceeds the limit of ${this.maxTokens} tokens`);
      }
  
      const availableTokens = this.maxTokens - tokenCount;
      console.log(`Available tokens for response: ${availableTokens}`); // טוקנים זמינים לתשובה
  
      if (availableTokens <= 0) {
        throw new Error(`Not enough tokens left to generate a response. Available: ${availableTokens}`);
      }
  
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
  
      console.log('Response generated successfully!'); // הודעה לתשובה מוצלחת
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message || error);
      throw new Error('Error getting response from OpenAI');
    }
  }
  
}

module.exports = new OpenAIService();
