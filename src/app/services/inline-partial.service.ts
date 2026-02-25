/**
 * Scenario 5: Inline/trailing @ai-generated -> only that line counts as AI
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InlinePartialService {
  format(value: string): string {
    return value.trim();  // @ai-generated
  }

  parse(input: string): number {
    const n = parseInt(input, 10);  /* @ai-generated */
    return isNaN(n) ? 0 : n;
  }

  humanCode(): boolean {
    return true;
  }
}
