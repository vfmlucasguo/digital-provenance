/**
 * 场景1：路径含 ai-gen → 整文件自动计为 AI
 * 路径 src/app/ai-gen/* 会被 process_aibom.py 识别为整文件 AI
 */
export class WholeByPathService {
  getGreeting(): string {
    return 'Hello from ai-gen path';
  }

  process(input: string): string {
    return input.toUpperCase();
  }
}
