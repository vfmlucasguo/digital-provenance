/**
 * Scenario 3: @ai-generated-begin ... @ai-generated-end block
 * Only lines inside the block count as AI
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockPartialService {
  process(items: string[]): string[] {
    const base = items.map(s => s.trim());
    // @ai-generated-begin
    const filtered = base.filter(s => s.length > 0);
    const sorted = filtered.sort();
    return sorted;
    // @ai-generated-end
  }

  humanWrittenHelper(): number {
    return 42;
  }
}
