import { StoredInteraction, AnalysisResponse } from '../types';

export class StorageService {
  private static readonly STORAGE_KEY = 'civicscan_interactions';

  static storeInteraction(response: AnalysisResponse): void {
    try {
      const interaction: StoredInteraction = {
        id: this.generateId(),
        question: response.request.question,
        documentName: response.request.fileName,
        state: response.request.state,
        answer: response.answer,
        timestamp: response.timestamp
      };

      const existingInteractions = this.getStoredInteractions();
      existingInteractions.unshift(interaction); // Add to beginning

      // Keep only the last 50 interactions to prevent storage bloat
      const limitedInteractions = existingInteractions.slice(0, 50);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedInteractions));
      
      console.log('Interaction stored successfully:', interaction.id);
    } catch (error) {
      console.error('Failed to store interaction:', error);
    }
  }

  static getStoredInteractions(): StoredInteraction[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve stored interactions:', error);
      return [];
    }
  }

  static clearStoredInteractions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Stored interactions cleared');
    } catch (error) {
      console.error('Failed to clear stored interactions:', error);
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getAnalytics() {
    const interactions = this.getStoredInteractions();
    
    return {
      totalQueries: interactions.length,
      stateBreakdown: this.getStateBreakdown(interactions),
      recentActivity: interactions.slice(0, 10),
      documentsUploaded: interactions.filter(i => i.documentName).length
    };
  }

  private static getStateBreakdown(interactions: StoredInteraction[]) {
    const breakdown: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      const state = interaction.state || 'Unknown';
      breakdown[state] = (breakdown[state] || 0) + 1;
    });

    return Object.entries(breakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10 states
  }
}