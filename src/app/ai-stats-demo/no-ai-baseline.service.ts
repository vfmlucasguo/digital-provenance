/**
 * 对照：无任何 AI 标记，用于验证统计差异
 */
export class NoAiBaselineService {
  add(a: number, b: number): number {
    return a + b;
  }

  greet(name: string): string {
    return `Hello, ${name}`;
  }
}
