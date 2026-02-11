import json
import os
from datetime import datetime

def process():
    input_path = "base-sbom.json"
    output_path = "aibom-final.json"

    if not os.path.exists(input_path):
        print(f"错误: 找不到 {input_path}")
        return

    with open(input_path, 'r') as f:
        bom = json.load(f)

    # 1. 注入全局 AI 平台元数据
    bom['metadata']['properties'] = [
        {"name": "ai:platform", "value": "Local-AI-Native-Flow"},
        {"name": "ai:local_build_time", "value": datetime.now().isoformat()}
    ]

    # 2. 自动标记 AI 生成的文件组件
    for comp in bom.get('components', []):
        if 'ai-gen' in comp.get('name', '').lower():
            comp.setdefault('properties', []).append({"name": "ai:generated", "value": "true"})

    with open(output_path, 'w') as f:
        json.dump(bom, f, indent=2)
    print(f"✅ AIBOM 已生成: {output_path}")

if __name__ == "__main__":
    process()