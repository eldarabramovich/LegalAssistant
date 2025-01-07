require('dotenv').config();
const OpenAI = require('openai');
const { encoding_for_model } = require('tiktoken');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 4096;
    this.defaultResponseTokens = 150;
  }

  countTokens(text) {
    if (!text) return 0;

    try {
      console.log('Loading encoding...');
      const encoding = encoding_for_model(this.model);
      console.log('Encoding loaded successfully');
      const tokens = encoding.encode(text);
      encoding.free(); // Free memory
      console.log(`Token count: ${tokens.length}`);
      return tokens.length;
    } catch (error) {
      console.error('Error in counting tokens:', error);
      throw new Error('Failed to count tokens');
    }
  }

  async generateChatResponse(prompt) {
    try {
      const tokenCount = this.countTokens(prompt);

      if (tokenCount > this.maxTokens) {
        throw new Error(`The prompt exceeds the limit of ${this.maxTokens} tokens`);
      }

      const availableTokens = this.maxTokens - tokenCount;

      if (availableTokens <= 0) {
        throw new Error(
          `Not enough tokens left to generate a response. Available: ${availableTokens}`
        );
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

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message || error);
      throw new Error('Error getting response from OpenAI');
    }
  }
}

module.exports = new OpenAIService();
