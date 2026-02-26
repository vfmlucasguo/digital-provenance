/**
 * AI Scenario 3: Block partial
 * Lines between @ai-generated-begin and @ai-generated-end
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockPartialService {
  parseJson<T>(text: string): T {
    // @ai-generated-begin
    const trimmed = text.trim();
    return JSON.parse(trimmed) as T;
    // @ai-generated-end
  }
}
