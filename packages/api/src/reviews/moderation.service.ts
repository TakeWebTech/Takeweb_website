import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ModerationService {
  // A basic list of abusive, offensive, and hateful words.
  // In a real production system, this would be much larger or powered by an external service.
  private readonly profanityList = [
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard',
    'slut', 'whore', 'faggot', 'nigger', 'spic', 'chink', 'retard', 'kill yourself',
    'die', 'kill', 'murder', 'rape', 'dumbass', 'moron', 'idiot'
  ];

  // Some words might be part of other words, so we use word boundaries where possible
  // but for a robust system, we would need a more sophisticated NLP approach.
  private buildRegex(): RegExp {
    // Create a regex that matches any of the words, case insensitive, with word boundaries
    const escapedWords = this.profanityList.map(word => 
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    return new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'i');
  }

  /**
   * Validates text and throws an error if offensive language is detected.
   */
  public validateText(text: string, fieldName: string = 'Text'): void {
    if (!text) return;

    const regex = this.buildRegex();
    if (regex.test(text)) {
      throw new BadRequestException(
        `${fieldName} contains language that violates our professional conduct policy. Please revise your submission.`
      );
    }

    // Basic heuristic for excessive caps shouting or other simple toxicity markers
    const uppercaseRatio = this.calculateUppercaseRatio(text);
    if (uppercaseRatio > 0.6 && text.length > 20) {
      throw new BadRequestException(
        `${fieldName} contains excessive capitalization which may be perceived as shouting. Please revise for professional tone.`
      );
    }
  }

  /**
   * Returns whether text is clean without throwing an error.
   */
  public isClean(text: string): boolean {
    if (!text) return true;
    const regex = this.buildRegex();
    return !regex.test(text);
  }

  private calculateUppercaseRatio(text: string): number {
    const letters = text.match(/[a-zA-Z]/g);
    if (!letters) return 0;
    
    const uppercase = letters.filter(c => c === c.toUpperCase());
    return uppercase.length / letters.length;
  }
}
