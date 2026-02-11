"""
AIBOM 全量统计脚本：支持整文件 + 部分代码片段

## 支持的标注方式

1. **整文件 - 路径**: 路径含 `ai-gen` → 整个文件计为 AI
2. **整文件 - 头部**: 前 10 行内任一行含 `@ai-generated` 或 `@generated-ai` → 整个文件
3. **部分 - 块开始/结束**:
   - `// @ai-generated-begin` ... `// @ai-generated-end` 之间的行
4. **部分 - 独立注释块**: `// @ai-generated` 单独一行 → 标记下一块（到缩进回退）
5. **部分 - 行尾/行内**: 某行含 `@ai-generated` → 该行计为 AI

## 支持文件类型
.ts, .tsx, .html, .htm, .scss, .css, .js, .jsx, .vue
"""
import json
import os
from datetime import datetime
from pathlib import Path

# 支持的文件类型
SRC_EXTENSIONS = ('.ts', '.tsx', '.html', '.htm', '.scss', '.css', '.js', '.jsx', '.vue')
# 头部判定行数
HEADER_LINES = 10
# AI 标记关键字（不区分大小写）
AI_MARKERS = ('@ai-generated', '@ai-generated-begin', '@ai-generated-end', '@generated-ai')


def _get_base_indent(line: str) -> int:
    return len(line) - len(line.lstrip())


def _count_non_empty(lines: list[str]) -> int:
    return sum(1 for l in lines if l.strip())


def analyze_file(file_path: str, project_root: str = ".") -> dict:
    """
    分析单个文件，返回整文件/部分片段的 AI 统计
    支持: 路径(ai-gen)、头部(@ai-generated)、行尾、块(@ai-generated-begin/end)
    """
    full_path = os.path.join(project_root, file_path)
    result = {
        "total_lines": 0,
        "whole_file": False,
        "partial_lines": 0,
        "ai_lines": 0,
        "scope": "none",
        "details": []
    }
    try:
        with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return result

    total = _count_non_empty(lines)
    result["total_lines"] = total
    if total == 0:
        return result

    # 1. 整文件：路径含 ai-gen
    if 'ai-gen' in file_path.lower():
        result["whole_file"] = True
        result["ai_lines"] = total
        result["scope"] = "whole"
        return result

    # 2. 整文件：头部(前 N 行) 有 @ai-generated 或 @generated-ai
    for line in lines[:HEADER_LINES]:
        sl = line.strip().lower()
        if '@ai-generated' in sl or '@generated-ai' in sl:
            if '@ai-generated-end' not in sl:
                result["whole_file"] = True
                result["ai_lines"] = total
                result["scope"] = "whole"
                return result

    # 3. 部分片段：行级 + 块级标记
    ai_line_indices = set()
    in_block = False
    block_indent = -1

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        s_lower = stripped.lower()
        indent = _get_base_indent(line)

        if not stripped:
            i += 1
            continue

        # 块结束
        if '@ai-generated-end' in s_lower:
            in_block = False
            block_indent = -1
            i += 1
            continue

        # 块开始
        if '@ai-generated-begin' in s_lower:
            in_block = True
            block_indent = indent
            i += 1
            continue

        if in_block:
            if indent <= block_indent and block_indent >= 0:
                in_block = False
            else:
                ai_line_indices.add(i)
            i += 1
            continue

        # 纯注释行上的 standalone 标记：标记「下一块」到缩进回退
        is_comment = (
            s_lower.startswith('//') or s_lower.startswith('#') or
            s_lower.startswith('*') or s_lower.startswith('<!--')
        )
        if is_comment and ('@ai-generated' in s_lower or '@generated-ai' in s_lower):
            if '@ai-generated-end' in s_lower or '@ai-generated-begin' in s_lower:
                i += 1
                continue
            # 标记下一块：从下一非空行起，直到缩进严格小于注释行
            j = i + 1
            while j < len(lines):
                nl = lines[j]
                ns = nl.strip()
                ni = _get_base_indent(lines[j])
                if not ns:
                    j += 1
                    continue
                if ni < indent:
                    break
                if '@ai-generated' in ns.lower() or '@ai-generated-begin' in ns.lower():
                    break
                ai_line_indices.add(j)
                j += 1
            i += 1
            continue

        # 行尾/行内标记：该行含 @ai-generated
        if ('@ai-generated' in s_lower or '@generated-ai' in s_lower) and '@ai-generated-end' not in s_lower:
            ai_line_indices.add(i)

        i += 1

    result["partial_lines"] = len(ai_line_indices)
    result["ai_lines"] = len(ai_line_indices)
    if result["ai_lines"] > 0:
        result["scope"] = "partial"
    return result


def collect_src_files(project_root: str, src_dir: str = "src") -> list[str]:
    """递归收集 src 下所有支持的源文件"""
    base = os.path.join(project_root, src_dir)
    if not os.path.isdir(base):
        return []
    files = []
    for root, _, names in os.walk(base):
        for name in names:
            if name.lower().endswith(SRC_EXTENSIONS):
                full = os.path.join(root, name)
                rel = os.path.relpath(full, project_root)
                files.append(rel.replace("\\", "/"))
    return sorted(files)


def process():
    input_path = "base-sbom.json"
    output_path = "aibom-final.json"
    project_root = "."

    # 1. 直接扫描 src/ 获取全量文件（不依赖 BOM）
    src_files = collect_src_files(project_root)
    file_results = {}
    total_lines = 0
    ai_whole_lines = 0
    ai_partial_lines = 0
    whole_files_count = 0
    partial_files_count = 0

    for fp in src_files:
        r = analyze_file(fp, project_root)
        file_results[fp] = r
        total_lines += r["total_lines"]
        if r["scope"] == "whole":
            ai_whole_lines += r["ai_lines"]
            whole_files_count += 1
        elif r["scope"] == "partial":
            ai_partial_lines += r["partial_lines"]
            partial_files_count += 1

    ai_total_lines = ai_whole_lines + ai_partial_lines

    # 2. 加载 BOM 并更新匹配的组件
    bom = {"metadata": {"properties": []}, "components": []}
    if os.path.exists(input_path):
        with open(input_path, 'r', encoding='utf-8') as f:
            bom = json.load(f)

    def set_prop(props: list, name: str, value: str):
        for p in props:
            if p.get("name") == name:
                p["value"] = value
                return
        props.append({"name": name, "value": value})

    for fp, r in file_results.items():
        if r["scope"] in ("whole", "partial"):
            matched = False
            for comp in bom.get("components", []):
                cname = comp.get("name", "")
                if fp in cname or cname.endswith(fp) or os.path.normpath(fp) in os.path.normpath(cname):
                    props = comp.setdefault("properties", [])
                    set_prop(props, "ai:generated", "true")
                    set_prop(props, "ai:scope", r["scope"])
                    set_prop(props, "ai:lines", str(r["ai_lines"]))
                    matched = True
            if not matched and bom.get("components") is not None:
                # BOM 中可能无该文件，注入为 file 组件
                bom["components"].append({
                    "type": "file",
                    "name": fp,
                    "properties": [
                        {"name": "ai:generated", "value": "true"},
                        {"name": "ai:scope", "value": r["scope"]},
                        {"name": "ai:lines", "value": str(r["ai_lines"])}
                    ]
                })

    # 3. 注入全局统计
    ai_pct = round((ai_total_lines / total_lines * 100), 2) if total_lines > 0 else 0
    bom["metadata"]["properties"] = [
        {"name": "ai:platform", "value": "Ionic-Universal-Flow"},
        {"name": "stats:src_total_lines", "value": str(total_lines)},
        {"name": "stats:ai_total_lines", "value": str(ai_total_lines)},
        {"name": "stats:ai_whole_file_lines", "value": str(ai_whole_lines)},
        {"name": "stats:ai_partial_lines", "value": str(ai_partial_lines)},
        {"name": "stats:ai_percentage", "value": f"{ai_pct}%"},
        {"name": "stats:whole_files_count", "value": str(whole_files_count)},
        {"name": "stats:partial_files_count", "value": str(partial_files_count)},
        {"name": "stats:src_files_scanned", "value": str(len(src_files))},
        {"name": "build:scan_time", "value": datetime.now().isoformat()}
    ]

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bom, f, indent=2)

    print(f"📊 [src/] 全量统计:")
    print(f"   总行数: {total_lines} | 扫描文件: {len(src_files)}")
    print(f"   AI 行数: {ai_total_lines} (整文件 {ai_whole_lines} + 片段 {ai_partial_lines})")
    print(f"   渗透率: {ai_pct}%")
    print(f"   整文件: {whole_files_count} 个 | 部分片段: {partial_files_count} 个")
    print(f"✅ AIBOM 已生成: {output_path}")


if __name__ == "__main__":
    process()
