/**
 * Workflow Test 1: Multiple inline @ai-generated lines
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkflowTestDebounceService {
  debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);  // @ai-generated
    };
  }

  humanHelper(): string {
    return 'debounce';
  }
}
