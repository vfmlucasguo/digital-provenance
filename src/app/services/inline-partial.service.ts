/**
 * AI Scenario 4: Inline partial
 * Single line with // @ai-generated at end counts as AI
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InlinePartialService {
  trim(value: string): string {
    return value.trim();  // @ai-generated
  }
}
