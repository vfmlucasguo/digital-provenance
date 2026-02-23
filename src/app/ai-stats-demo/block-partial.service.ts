/**
 * 场景3：@ai-generated-begin ... @ai-generated-end 块标记
 * 仅块内行计为 AI
 */
export class BlockPartialService {
  process(items: string[]): string[] {
    const base = items.map(s => s.trim());
    // @ai-generated-begin
    const filtered = base.filter(s => s.length > 0);
    const sorted = filtered.sort();
    return sorted;
    // @ai-generated-end
  }

  otherMethod(): number {
    return 1;
  }
}
