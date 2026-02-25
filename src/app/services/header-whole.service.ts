// @ai-generated
/**
 * Scenario 2: Header contains @ai-generated -> entire file counts as AI
 * Any line in first 10 lines with this marker triggers whole-file scope
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderWholeService {
  getTitle(): string {
    return 'Header Whole Demo';
  }

  compute(value: number): number {
    return value * 2;
  }

  formatMessage(msg: string): string {
    return `[${msg}]`;
  }
}
