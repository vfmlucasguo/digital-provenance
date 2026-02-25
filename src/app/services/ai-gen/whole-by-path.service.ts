import { Injectable } from '@angular/core';

/**
 * Scenario 1: Path contains ai-gen -> entire file counts as AI
 * Path src/app/services/ai-gen/* is recognized as whole-file AI by process_aibom.py
 */
@Injectable({ providedIn: 'root' })
export class WholeByPathService {
  getGreeting(): string {
    return 'Hello from services/ai-gen';
  }

  process(input: string): string {
    return input.toUpperCase();
  }

  transform(items: string[]): string[] {
    return items.map(s => s.trim().toLowerCase());
  }
}
