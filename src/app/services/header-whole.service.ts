/**
 * AI Scenario 2: Whole file by header
 * @ai-generated in first 10 lines -> entire file counted
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderWholeService {
  format(): string {
    return new Date().toISOString();
  }
}
