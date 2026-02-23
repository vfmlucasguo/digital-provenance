/**
 * 场景5：行尾/行内 @ai-generated → 仅该行计为 AI
 */
export class InlinePartialService {
  format(value: string): string {
    return value.trim();  // @ai-generated
  }

  parse(input: string): number {
    const n = parseInt(input, 10);  /* @ai-generated */
    return isNaN(n) ? 0 : n;
  }
}
