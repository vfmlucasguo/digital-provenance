/**
 * PR Test Scenario 2: Block with multiple AI lines
 * Tests @ai-generated-begin/end with more logic
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrTestValidatorService {
  validateEmail(input: string): boolean {
    const trimmed = input.trim();
    // @ai-generated-begin
    const atIndex = trimmed.indexOf('@');
    const dotIndex = trimmed.lastIndexOf('.');
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1;
    // @ai-generated-end
  }

  humanWrittenHelper(): string {
    return 'validator';
  }
}
