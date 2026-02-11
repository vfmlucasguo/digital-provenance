"""
AIBOM 全量统计脚本：支持整文件 + 部分代码片段 + 当前提交统计

## 支持的标注方式

1. **整文件 - 路径**: 路径含 `ai-gen` → 整个文件计为 AI
2. **整文件 - 头部**: 前 10 行内任一行含 `@ai-generated` 或 `@generated-ai` → 整个文件
3. **部分 - 块开始/结束**:
   - `// @ai-generated-begin` ... `// @ai-generated-end` 之间的行
4. **部分 - 独立注释块**: `// @ai-generated` 单独一行 → 标记下一块（到缩进回退）
5. **部分 - 行尾/行内**: 某行含 `@ai-generated` → 该行计为 AI

## 统计维度
- **项目累计**: 扫描 src/ 全量，统计总 AI 渗透率
- **当前提交**: 仅统计本 commit diff 中新增且为 AI 的行（需 --commit）

## 用法
  python3 scripts/process_aibom.py              # 项目累计
  python3 scripts/process_aibom.py --commit     # 含当前提交统计（默认 base=HEAD~1）
  python3 scripts/process_aibom.py --commit --base origin/main
  python3 scripts/process_aibom.py --append-history
"""
import argparse
import json
import os
import re
import subprocess
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
    result["ai_line_indices"] = set()
    if total == 0:
        return result

    def _all_non_empty_indices():
        return set(i for i, ln in enumerate(lines) if ln.strip())

    # 1. 整文件：路径含 ai-gen
    if 'ai-gen' in file_path.lower():
        result["whole_file"] = True
        result["ai_lines"] = total
        result["scope"] = "whole"
        result["ai_line_indices"] = _all_non_empty_indices()
        return result

    # 2. 整文件：头部(前 N 行) 有 @ai-generated 或 @generated-ai
    for line in lines[:HEADER_LINES]:
        sl = line.strip().lower()
        if '@ai-generated' in sl or '@generated-ai' in sl:
            if '@ai-generated-end' not in sl:
                result["whole_file"] = True
                result["ai_lines"] = total
                result["scope"] = "whole"
                result["ai_line_indices"] = _all_non_empty_indices()
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
    result["ai_line_indices"] = ai_line_indices
    if result["ai_lines"] > 0:
        result["scope"] = "partial"
    return result


def _run_git(cmd, cwd="."):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=30)
        return r.stdout.strip() if r.returncode == 0 else ""
    except Exception:
        return ""


def get_changed_src_files(base, head, project_root):
    """获取 base..head 之间变更的 src/ 下源文件路径"""
    out = _run_git(["git", "diff", "--name-only", base, head], cwd=project_root)
    if not out:
        return []
    result = []
    for line in out.splitlines():
        p = line.strip()
        if p and p.startswith("src/") and any(p.lower().endswith(ext) for ext in SRC_EXTENSIONS):
            result.append(p.replace("\\", "/"))
    return sorted(set(result))


def get_diff_added_line_numbers(base, head, filepath, project_root):
    """解析 git diff，返回 filepath 在 head 版本中「新增行」的 0-based 行号集合"""
    out = _run_git(["git", "diff", "-U0", base, head, "--", filepath], cwd=project_root)
    if not out:
        return set()
    added = set()
    hunk_re = re.compile(r"^@@ -[\d,]+ \+(\d+)(?:,(\d+))? @@")
    new_line = 0
    in_hunk = False
    for raw in out.splitlines():
        if raw.startswith("@@"):
            m = hunk_re.match(raw)
            if m:
                new_line = int(m.group(1)) - 1
                in_hunk = True
            continue
        if not in_hunk:
            continue
        if raw.startswith("+"):
            if raw.startswith("+++"):
                continue
            added.add(new_line)
            new_line += 1
        elif not raw.startswith("---"):
            new_line += 1
    return added


def compute_commit_stats(base, head, project_root, file_results):
    """计算当前提交的 AI 统计：仅统计 diff 新增行中属于 AI 区域的行"""
    changed = get_changed_src_files(base, head, project_root)
    if not changed:
        return {"ai_lines": 0, "total_added": 0, "changed_files": 0, "ai_changed_files": 0}
    commit_ai = 0
    commit_total = 0
    ai_file_count = 0
    for fp in changed:
        added = get_diff_added_line_numbers(base, head, fp, project_root)
        if not added:
            continue
        commit_total += len(added)
        r = file_results.get(fp)
        if not r:
            r = analyze_file(fp, project_root)
        overlap = added & r.get("ai_line_indices", set())
        if overlap:
            commit_ai += len(overlap)
            ai_file_count += 1
    return {
        "ai_lines": commit_ai,
        "total_added": commit_total,
        "changed_files": len(changed),
        "ai_changed_files": ai_file_count,
    }


def collect_src_files(project_root: str, src_dir: str = "src") -> list:
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


def process(args=None):
    input_path = "base-sbom.json"
    output_path = "aibom-final.json"
    project_root = "."
    opts = args or argparse.Namespace(commit=False, base="HEAD~1", append_history=False)

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

    # 1b. 当前提交统计（可选）
    commit_stats = None
    git_commit = ""
    git_commit_short = ""
    if opts.commit:
        git_commit = _run_git(["git", "rev-parse", "HEAD"], project_root)
        git_commit_short = _run_git(["git", "rev-parse", "--short", "HEAD"], project_root)
        commit_stats = compute_commit_stats(opts.base, "HEAD", project_root, file_results)

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
    ai_pct_str = str(ai_pct) + "%"
    props = [
        {"name": "ai:platform", "value": "Ionic-Universal-Flow"},
        {"name": "stats:project:src_total_lines", "value": str(total_lines)},
        {"name": "stats:project:ai_total_lines", "value": str(ai_total_lines)},
        {"name": "stats:project:ai_whole_file_lines", "value": str(ai_whole_lines)},
        {"name": "stats:project:ai_partial_lines", "value": str(ai_partial_lines)},
        {"name": "stats:project:ai_percentage", "value": ai_pct_str},
        {"name": "stats:project:whole_files_count", "value": str(whole_files_count)},
        {"name": "stats:project:partial_files_count", "value": str(partial_files_count)},
        {"name": "stats:project:src_files_scanned", "value": str(len(src_files))},
        {"name": "stats:src_total_lines", "value": str(total_lines)},
        {"name": "stats:ai_total_lines", "value": str(ai_total_lines)},
        {"name": "stats:ai_percentage", "value": ai_pct_str},
        {"name": "build:scan_time", "value": datetime.now().isoformat()},
    ]
    if commit_stats is not None:
        props.extend([
            {"name": "git:commit", "value": git_commit or "unknown"},
            {"name": "git:commit_short", "value": git_commit_short or "unknown"},
            {"name": "stats:commit:ai_lines", "value": str(commit_stats["ai_lines"])},
            {"name": "stats:commit:total_added", "value": str(commit_stats["total_added"])},
            {"name": "stats:commit:changed_files", "value": str(commit_stats["changed_files"])},
            {"name": "stats:commit:ai_changed_files", "value": str(commit_stats["ai_changed_files"])},
        ])
        if commit_stats["total_added"] > 0:
            commit_pct = round(commit_stats["ai_lines"] / commit_stats["total_added"] * 100, 2)
            props.append({"name": "stats:commit:ai_percentage", "value": str(commit_pct) + "%"})
    bom["metadata"]["properties"] = props

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bom, f, indent=2)

    print("📊 [项目累计] src/ 全量统计:")
    print("   总行数: %s | 扫描文件: %s" % (total_lines, len(src_files)))
    print("   AI 行数: %s (整文件 %s + 片段 %s)" % (ai_total_lines, ai_whole_lines, ai_partial_lines))
    print("   渗透率: %s%%" % ai_pct)
    print("   整文件: %s 个 | 部分片段: %s 个" % (whole_files_count, partial_files_count))
    if commit_stats is not None:
        print("📊 [当前提交] diff 统计:")
        print("   变更文件: %s 个 | 含 AI: %s 个" % (commit_stats["changed_files"], commit_stats["ai_changed_files"]))
        print("   本 commit 新增: %s 行 | AI 部分: %s 行" % (commit_stats["total_added"], commit_stats["ai_lines"]))
        if commit_stats["total_added"] > 0:
            cp = round(commit_stats["ai_lines"] / commit_stats["total_added"] * 100, 2)
            print("   本 commit AI 占比: %s%%" % cp)
    print("✅ AIBOM 已生成: %s" % output_path)

    if opts.append_history and os.path.isdir(os.path.join(project_root, ".git")):
        gc = git_commit or _run_git(["git", "rev-parse", "HEAD"], project_root)
        gcs = git_commit_short or _run_git(["git", "rev-parse", "--short", "HEAD"], project_root)
        _append_history(project_root, commit_stats, total_lines, ai_total_lines, gc, gcs)


def _append_history(project_root, commit_stats, proj_total, proj_ai, git_commit, git_commit_short):
    history_path = os.path.join(project_root, "aibom-history.json")
    entry = {
        "timestamp": datetime.now().isoformat(),
        "commit": git_commit or "unknown",
        "commit_short": git_commit_short or "unknown",
        "project_total_lines": proj_total,
        "project_ai_lines": proj_ai,
        "project_ai_percentage": round(proj_ai / proj_total * 100, 2) if proj_total > 0 else 0,
    }
    if commit_stats:
        entry["commit_ai_lines"] = commit_stats["ai_lines"]
        entry["commit_total_added"] = commit_stats["total_added"]
        entry["commit_changed_files"] = commit_stats["changed_files"]
    data = []
    if os.path.exists(history_path):
        try:
            with open(history_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            pass
    data.append(entry)
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("✅ 历史已追加: %s" % history_path)


def main():
    parser = argparse.ArgumentParser(description="AIBOM 全量统计（项目累计 + 当前提交）")
    parser.add_argument("--commit", action="store_true", help="启用当前提交 diff 统计")
    parser.add_argument("--base", default="HEAD~1", help="diff 基准 ref，默认 HEAD~1")
    parser.add_argument("--append-history", action="store_true", help="追加本次统计到 aibom-history.json")
    args = parser.parse_args()
    process(args)


if __name__ == "__main__":
    main()
