interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
}

interface AudioResponse {
  audioUrl: string;
  audioBlob?: Blob;
}

class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private modelId: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: ElevenLabsConfig) {
    this.apiKey = config.apiKey;
    this.voiceId = config.voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default voice (Rachel)
    this.modelId = config.modelId || 'eleven_monolingual_v1';
    console.log('[ElevenLabsService] Initialized with API Key:', this.apiKey);
  }

  async textToSpeech(text: string): Promise<AudioResponse> {
    try {
      console.log('[ElevenLabsService] Using API Key:', this.apiKey); // Debug log
      // Remove markdown symbols for TTS clarity
      const cleanText = text
        .replace(/[#*_`~\[\]()>\-]/g, '') // Remove markdown special chars
        .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
        .replace(/\n/g, '. '); // Convert newlines to pauses

      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        audioBlob
      };
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw new Error(`Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  setVoice(voiceId: string) {
    this.voiceId = voiceId;
  }

  setModel(modelId: string) {
    this.modelId = modelId;
  }

  // Clean up audio URL to prevent memory leaks
  cleanupAudioUrl(audioUrl: string) {
    URL.revokeObjectURL(audioUrl);
  }
}

// Create a singleton instance
let elevenLabsInstance: ElevenLabsService | null = null;

export const initializeElevenLabs = (apiKey: string, voiceId?: string, modelId?: string) => {
  if (!apiKey) {
    throw new Error('ElevenLabs API key is required');
  }
  
  elevenLabsInstance = new ElevenLabsService({ apiKey, voiceId, modelId });
  return elevenLabsInstance;
};

export const getElevenLabsService = (): ElevenLabsService => {
  if (!elevenLabsInstance) {
    throw new Error('ElevenLabs service not initialized. Call initializeElevenLabs first.');
  }
  return elevenLabsInstance;
};

export default ElevenLabsService; 