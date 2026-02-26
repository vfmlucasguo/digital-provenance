/**
 * AI Scenario 5: No AI (baseline)
 * Human-written code - no markers
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NoAiService {
  identity<T>(x: T): T {
    return x;
  }
}
