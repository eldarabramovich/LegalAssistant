require('dotenv').config();
const OpenAI = require('openai');
const { encoding_for_model } = require("tiktoken");


class OpenAIService {

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = "gpt-3.5-turbo"; // המודל שבו אתה משתמש
    this.maxTokens = 4096;
  }

  countTokens(text) {
    if (!text) return 0;

  try {
    console.log("Loading encoding...");
    const encoding = encoding_for_model("gpt-3.5-turbo");
    console.log("Encoding loaded successfully");
    const tokens = encoding.encode(text);
    encoding.free(); // משחרר את הזיכרון לאחר השימוש
    return tokens.length;
  } catch (error) {
    console.error("Error in counting tokens:", error);
    throw new Error("Failed to count tokens");
  }
  }


  async generateChatResponse(prompt) {
    try {

      const tokenCount = this.countTokens(prompt);
      if (tokenCount > this.maxTokens) {
        throw new Error(`The prompt exceeds the limit of ${this.maxTokens} tokens`);      }

      const completion = await this.openai.chat.completions.create({
        model:  this.model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Error getting response from OpenAI');
    }
  }
}

module.exports = new OpenAIService();