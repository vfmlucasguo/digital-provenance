import json
import os
from datetime import datetime

def analyze_file(file_path):
    """统计行数并识别 AI 标记"""
    is_ai, lines = False, 0
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.readlines()
            lines = sum(1 for line in content if line.strip())
            # 识别逻辑：路径含 ai-gen 或头部含 @ai-generated 标识
            if 'ai-gen' in file_path.lower():
                is_ai = True
            elif content and any('@ai-generated' in line for line in content[:5]):
                is_ai = True
    except:
        pass
    return lines, is_ai

def process():
    input_path, output_path, project_root = "base-sbom.json", "aibom-final.json", "."
    if not os.path.exists(input_path): return

    with open(input_path, 'r', encoding='utf-8') as f:
        bom = json.load(f)

    ai_lines, total_lines = 0, 0

    # 递归扫描 src 目录下的核心开发文件
    for comp in bom.get('components', []):
        file_name = comp.get('name', '')
        if file_name.startswith('src/') and file_name.endswith(('.ts', '.html', '.scss')):
            full_path = os.path.join(project_root, file_name)
            if os.path.isfile(full_path):
                lines, is_ai = analyze_file(full_path)
                total_lines += lines
                if is_ai:
                    ai_lines += lines
                    comp.setdefault('properties', []).append({"name": "ai:generated", "value": "true"})

    # 注入全局量化元数据
    ai_pct = round((ai_lines / total_lines * 100), 2) if total_lines > 0 else 0
    bom['metadata']['properties'] = [
        {"name": "stats:src_total_lines", "value": str(total_lines)},
        {"name": "stats:ai_total_lines", "value": str(ai_lines)},
        {"name": "stats:ai_percentage", "value": f"{ai_pct}%"},
        {"name": "build:scan_time", "value": datetime.now().isoformat()}
    ]

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bom, f, indent=2)
    print(f"📊 统计完成: 总行数 {total_lines}, AI 行数 {ai_lines}, 占比 {ai_pct}%")

if __name__ == "__main__":
    process()