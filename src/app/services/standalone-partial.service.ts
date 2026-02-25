/**
 * Scenario 4: // @ai-generated standalone line -> marks next block until indent regression
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StandalonePartialService {
  constructor() {}

  // @ai-generated
  aiImplementedMethod(): string {
    const result = 'demo';
    return result.toUpperCase();
  }

  humanWrittenMethod(): number {
    return 100;
  }
}
