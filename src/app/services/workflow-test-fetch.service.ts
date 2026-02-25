/**
 * Workflow Test 2: Block with JSON parse logic
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkflowTestFetchService {
  async parseJson<T>(text: string): Promise<T> {
    try {
      // @ai-generated-begin
      const trimmed = text.trim();
      return JSON.parse(trimmed) as T;
      // @ai-generated-end
    } catch {
      throw new Error('Invalid JSON');
    }
  }

  humanHelper(): number {
    return 42;
  }
}
