# VIEW OpenSpec 协作用户手册（中文）

## 1. 介绍

VIEW OpenSpec 协作是一种以规格为驱动的开发方法，旨在提升协作效率和代码质量。通过标准化的文档结构、流程和自动化工具，帮助团队在需求、设计、实现、测试各阶段保持一致性。

## 2. 核心概念

### 2.1 规格驱动开发

三个阶段：
1. **规格阶段**：创建 `proposal.md`、`design.md`、`tasks.md`、`spec.md`，并可使用技能生成测试用例、功能规格、技术规格及自检。
2. **实现阶段**：按照规格文档进行开发。
3. **归档阶段**：完成后将变更移动到 `archive/` 目录。

### 2.2 目录结构

```
openspec/
├── project.md              # VIEW 约定
├── specs/                  # 已生效的规格（真值）
│   └── [capability]/
│       └── spec.md         # 需求与场景
├── changes/                # 提案与变更（应当发生）
│   ├── [change-name]/
│   │   ├── proposal.md     # 为什么/做什么/影响
│   │   ├── tasks.md        # 实现清单
│   │   ├── design.md       # 技术决策
│   │   └── specs/          # 规格增量
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已归档变更
├── skills/
│   └── [skill-name].md     # 关键字触发的技能说明
├── docs/                   # 文档：功能规格、技术规格、测试用例
│   ├── template/
│   └── [change-name]/
```

## 3. 安装与初始化

前置：Node.js >= 20.19.0

### 3.1 安装
```
npm install -g @fission-ai/openspec@latest
```
验证：
```
openspec --version
```

### 3.2 初始化
- 执行 `git pull` 同步仓库，在 VIEW 根目录放置 openspec 目录与 AGENTS.md。

## 4. 工作流（按角色）

### 4.1 创建变更提案（BA）
- 触发：新功能/修改/架构/性能/安全相关。
- 行为：与 AI 协作创建 `changes/<change-id>/`，填写 `proposal.md` 与增量 `spec.md`，补充验收场景。

### 4.2 提案澄清（可选，BA）
- 技能：`proposal self review` 自检并完善 `proposal.md`、`spec.md`。

### 4.3 生成测试用例（可选，BA）
- 技能：`Generate Test Case <change-id>`，输出到 `openspec/docs/<change-id>/`。

### 4.4 生成功能规格（可选，BA）
- 技能：`Generate FS <change-id>`，在 `openspec/docs/<change-id>/` 生成功能规格。

### 4.5 更新设计与任务（Developer）
- 触发：需求定稿后开发接手。
- 行为：完善 `design.md`（技术方案）、`tasks.md`（实现清单）。

### 4.6 设计自检（可选，Developer）
- 技能：`design self review` 检查设计完整性与一致性。

### 4.7 任务自检（可选，Developer）
- 技能：`tasks self review` 检查任务覆盖性与可执行性。

### 4.8 生成技术规格（可选，Developer）
- 技能：`Generate TS <change-id>`，在 `openspec/docs/<change-id>/` 生成技术规格。

### 4.9 实施变更（Developer）
- 行为：按 `tasks.md` 顺序实现并勾选完成，确保实现与规格一致。

### 4.10 归档变更（Developer/Infra）
- 触发：上线并验证通过。
- 行为：`openspec archive <change-id> --yes`，移动到 `changes/archive/` 并同步正式 `specs/`。

## 5. 常用命令

### 5.1 基本命令
```
openspec list                     # 查看活跃变更
openspec show [change-id]         # 查看具体变更
openspec show [spec-id]           # 查看规格
openspec validate [change-id] --strict  # 严格校验
openspec archive <change-id> [--yes|-y] # 归档
```

### 5.2 调试命令
```
openspec show [change] --json --deltas-only  # 调试 delta 解析
openspec show [spec] --json -r 1             # 查看特定需求
```

## 6. 故障排查

### 6.1 提案生成格式不正确
- 检查 openspec 安装：`openspec --version`
- 确认 AGENTS.md 在 VIEW 根目录
- 若 AI 未按 AGENTS.md 执行，需重新让其阅读并重新生成

### 6.2 提案阶段直接生成代码
- 让 AI 重读 AGENTS.md，先生成规格文件，再处理代码，必要时回退代码

### 6.3 技能触发异常
- 让 AI 重读对应 skill 文件（如 proposal-self-review.md）并重试

### 6.4 “Change must have at least one delta”
- 确认 `changes/[name]/specs/` 下存在 .md，且含 `## ADDED Requirements` 等段落

### 6.5 “Requirement must have at least one scenario”
- 每个 Requirement 至少一个 `#### Scenario:`，格式需精确

### 6.6 PowerShell 脚本禁用
- Windows 执行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 7. 官网
https://github.com/Fission-AI/OpenSpec

## 8. 结语
遵循规格驱动流程可提升质量与协作效率。请按照本手册及 AGENTS.md 指南，确保需求、设计、实现、测试与归档的一致性。
