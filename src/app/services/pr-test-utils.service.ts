/**
 * PR Test Scenario 1: @generated-ai alternate marker
 * Uses @generated-ai in header -> entire file counts as AI
 */
// @generated-ai
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrTestUtilsService {
  formatDate(ts: number): string {
    return new Date(ts).toISOString();
  }

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
