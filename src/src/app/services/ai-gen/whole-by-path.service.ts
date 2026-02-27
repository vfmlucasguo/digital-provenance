/**
 * AI Scenario 1: Whole file by path
 * Path contains 'ai-gen' -> entire file counted as AI-generated
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WholeByPathService {
  getVersion(): string {
    return '1.0.0';
  }
}
