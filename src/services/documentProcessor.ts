import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';

export class DocumentProcessor {
  static async extractText(file: File): Promise<string> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    try {
      if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/)) {
        return await this.extractTextFromImage(file);
      } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        return await this.extractTextFromPDF(file);
      } else if (fileType.includes('word') || fileName.match(/\.(doc|docx)$/)) {
        return await this.extractTextFromWord(file);
      } else {
        // Try to read as plain text
        return await this.readAsText(file);
      }
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error(`Failed to extract text from ${file.name}. Please ensure the file is readable and try again.`);
    }
  }

  private static async extractTextFromImage(file: File): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    });
    return text.trim();
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    // For browser environment, we'll use a different approach
    // Since pdf-parse requires Node.js, we'll implement a basic PDF text extraction
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Basic PDF text extraction - look for text between stream objects
    const textMatches = text.match(/stream\s*(.*?)\s*endstream/gs);
    if (textMatches) {
      return textMatches
        .map(match => match.replace(/stream\s*|\s*endstream/g, ''))
        .join(' ')
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Fallback: try to extract readable text
    return text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private static async extractTextFromWord(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  private static async readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text.trim());
      };
      reader.onerror = () => reject(new Error('Failed to read file as text'));
      reader.readAsText(file);
    });
  }
}