/**
 * Scenario 6: No AI markers - baseline for comparison
 * All lines count as human-written
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NoAiService {
  getStatus(): string {
    return 'human-written';
  }

  add(a: number, b: number): number {
    return a + b;
  }
}
