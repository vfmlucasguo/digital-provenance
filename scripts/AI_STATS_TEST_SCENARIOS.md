# AI 统计测试场景说明

本目录下的示例代码用于验证 `process_aibom.py` 的 AI 统计逻辑。各场景对应项目根目录 `AGENTS.md` 与 `openspec/config.yaml` 中的 AI 数字溯源协议。

---

## 整体流程概览

### 核心流程（精简）

```
┌─────────────────────────────┐     ┌──────────────────────────────┐
│ process_aibom.py             │────►│ 生成 AIBOM + 统计             │
│ • 扫描 src/                  │     │ • aibom-final.json            │
│ • 解析 AI 标记               │     │ • commit-ai-lines.json¹       │
│ • 可选: git diff             │     │ • 控制台汇总                  │
└─────────────────────────────┘     └──────────────────────────────┘
              │
              └─ --commit 时叠加提交级 AI 行统计
```

> ¹ `commit-ai-lines.json` 仅在 `--commit` 时生成

### 触发方式

| 场景 | 命令 / 入口 | 说明 |
|------|-------------|------|
| 本地全量 | `python3 scripts/process_aibom.py` | 项目累计，不依赖 git |
| 本地 + 提交 | `python3 scripts/process_aibom.py --commit` | 含当前 commit 的 diff 统计 |
| PR / 推送 | `.github/workflows/digital-provenance.yml` | 自动运行 process_aibom --commit --base $BASE_REF |
| 快速测试 | `scripts/manual-provenance.sh` | 同上，本地一键执行 |

### 端到端数据流

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  1. 数据源                                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • src/ 源码目录     → 递归扫描 .ts/.tsx/.html/.scss/.css/.js/.jsx/.vue          │
│  • git diff         → 当前提交变更（启用 --commit 时）                            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  2. process_aibom.py 核心处理                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│  (a) 解析 AI 标记  → 路径(ai-gen)、头部、块、行尾、独立注释                        │
│  (b) 计算行级 AI   → 整文件 / 部分片段 → ai_line_indices                          │
│  (c) diff 交集     → added_lines ∩ ai_line_indices → 提交级 AI 行 (--commit)       │
│  (d) 写入 metadata → stats:project / stats:services / stats:commit 等属性          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  3. 输出产物                                                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • aibom-final.json     → AIBOM（AI 统计 metadata + AI 文件 components）           │
│  • commit-ai-lines.json → 当前提交 AI 行明细（--commit 时生成）                    │
│  • aibom-history.json   → 历史记录追加（--append-history 时）                     │
│  • 控制台汇总           → 项目累计、services 子目录、当前提交统计                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  4. 下游消费                                                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • GitHub Actions    → 解析 properties，写入 Step Summary、PR 评论                 │
│  • 报表 / 合规       → 读取 stats:* 做审计、渗透率追踪                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 依赖关系

- **Git**：仅在 `--commit` 时用于 `git diff base..HEAD`
- **Python 3**：无第三方库依赖，仅用标准库
- **Syft / base-sbom.json**：不需要，已移除

### 与项目配置的衔接

| 配置 | 作用 |
|------|------|
| `AGENTS.md` | 规定 src/ 内必须加 provenance 标记，由本脚本解析 |
| `openspec/config.yaml` | 声明 AI 标记由 `scripts/process_aibom.py` 检测 |

---

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
# 运行 AI 统计
python3 scripts/process_aibom.py

# 查看统计结果
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
