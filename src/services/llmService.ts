import { AnalysisRequest, AnalysisResponse } from '../types';
import { buildPrompt } from '../utils/buildPrompt';

export class LLMService {
  private static readonly API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  
  static async analyzeQuery(request: AnalysisRequest): Promise<AnalysisResponse> {
    const prompt = buildPrompt(request);
    
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error('OpenAI API key not configured. Please add your API key to the .env file.');
      }

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using the more cost-effective model
          messages: [
            {
              role: 'system',
              content: 'You are CivicScan, a civic rights and legal information assistant. Provide accurate, helpful information about laws and civic processes. Always structure your responses clearly and include appropriate disclaimers about seeking professional legal advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.2, // Lower temperature for more consistent legal information
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content || 'No response generated.';

      return {
        answer,
        timestamp: new Date().toISOString(),
        request,
        tokensUsed: data.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('LLM API Error:', error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Please check your OpenAI API key in the .env file. Make sure it starts with "sk-" and is valid.');
        } else if (error.message.includes('quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing settings or try again later.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
      }
      
      throw new Error(`Failed to analyze your question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}