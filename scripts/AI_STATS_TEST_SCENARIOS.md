# AI 统计测试场景说明

本目录下的示例代码用于验证 `process_aibom.py` 的 AI 统计逻辑。各场景对应项目根目录 `AGENTS.md` 与 `openspec/config.yaml` 中的 AI 数字溯源协议。

## 测试文件一览

| 场景 | 文件路径 | 标注方式 | 预期 AI 行数 |
|------|----------|----------|--------------|
| 1. 路径整文件 | `src/app/ai-gen/whole-by-path.service.ts` | 路径含 `ai-gen` | 整文件（约 10 行） |
| 2. 头部整文件 | `src/app/ai-stats-demo/header-whole.component.ts` | 首行 `// @ai-generated` | 整文件（约 18 行） |
| 3. 块标记 | `src/app/ai-stats-demo/block-partial.service.ts` | `@ai-generated-begin` … `@ai-generated-end` | 块内 4 行 |
| 4. 独立注释 | `src/app/ai-stats-demo/standalone-partial.service.ts` | `// @ai-generated` 单独一行 | 下一块 3 行 |
| 5. 行内标记 | `src/app/ai-stats-demo/inline-partial.service.ts` | 行尾 `// @ai-generated` | 2 行 |
| 6. HTML 块 | `src/app/ai-stats-demo/demo.component.html` | `<!-- @ai-generated -->` + 下一块 | 块内行 |
| 7. SCSS 块 | `src/app/ai-stats-demo/demo.component.scss` | `// @ai-generated` + 下一块 | 块内行 |
| 8. 对照（无 AI） | `src/app/ai-stats-demo/no-ai-baseline.service.ts` | 无 | 0 |
| 9. 已有示例 | `src/app/tab1/tab1.page.ts` | `// @ai-generated` | 下一块 3 行 |

## 运行测试

```bash
# 1. 生成基础 SBOM（若尚未生成）
syft . -o cyclonedx-json --output base-sbom.json

# 2. 运行 AI 统计
python3 scripts/process_aibom.py

# 3. 查看统计结果
# 控制台输出项目累计的 AI 行数、渗透率
# 详细数据在 aibom-final.json 的 metadata.properties 中
```

## 验证要点

- **项目累计**：`stats:project:ai_total_lines` 应包含上述所有 AI 行之和
- **整文件**：`stats:project:ai_whole_file_lines` 包含路径整文件 + 头部整文件
- **部分片段**：`stats:project:ai_partial_lines` 包含块、独立注释、行内标记

## 与 AGENTS.md 的对应关系

| AGENTS.md / config 语法 | process_aibom.py 支持 |
|----------------|------------------------|
| `// @ai-generated`（头部） | ✅ 前 10 行内 |
| `// @ai-start` … `// @ai-end` | ⚠️ 需使用 `@ai-generated-begin` / `@ai-generated-end` |
| `src/app/pages/ai-gen/` 免标 | ✅ 路径含 `ai-gen` 自动整文件 |

> 注意：当前规则已与脚本对齐，统一使用 `@ai-generated-begin`/`@ai-generated-end`。
