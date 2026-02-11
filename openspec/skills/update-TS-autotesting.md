# Skill：update-TS-autotesting

## 触发指令
- `update TS autotest [change-id]`

> **前提**：已经通过 `generate TS [change-id]` 生成 `openspec/docs/[change-id]/[change-id] TS v1.0.md`，并确认本机已同步最新的自动化测试仓库目录 `/Users/user/Project/GitLab/vfm_autotesting`（默认读取 `master` 分支工作副本）。读取该目录下的文件时，仍需在 TS 文档中以 `/...` 相对路径引用。

## 操作目标
在 TS 文档的 `## 4. Testing Strategy` 中维护 `### 4.3 Mobility Automation Testing` 小节，确保内容准确描述跨项目（Ionic 应用 +  仓库）的自动化验证覆盖、脚本位置与产出物。

## 流程说明

### 1. 校验输入
1. 确认 `[change-id]` 目录存在于 `openspec/changes/`；若不存在，询问用户或请其提供正确 ID。
2. 确认 `openspec/docs/[change-id]/[change-id] TS v1.0.md` 已生成；若缺失，提示先运行 `generate TS [change-id]`。

### 2. 收集资料
1. 读取 TS 文档：`openspec/docs/[change-id]/[change-id] TS v1.0.md`，定位 `## 4. Testing Strategy`。
2. 通过本地文件系统读取自动化测试仓库 `/Users/user/Project/GitLab/vfm_autotesting` 内容，推荐流程：
	1. 使用 `read_file`/`list_dir`/`grep` 等工具访问该目录（默认 `master` 分支工作副本），不再依赖 Gogs API。
	2. 仅打开与本次变更相关的文件片段，避免无关大范围读取。
	3. 仍按照 `/...` 相对路径来引用仓库资源，保持与 TS 文档约定一致。
	4. 首先阅读仓库根目录下的 `test-suite-map.md`（路径 `/test-suite-map.md`），了解各 Airtest 套件、批处理脚本与产出物索引，再决定需要深入的文件。
3. 根据 `/test-suite-map.md` 的索引定位本次变更关联的脚本，并按需打开下列类别的文件获取上下文：
	- Android 平台的 Airtest 套件：`/Android/*.air`（例如 `/Android/Maintenance_regression_hybrid.air`、`/Android/TaskSets_autotest.air`）。至少阅读所有与本次变更相关的 `.py`/`.air` 文件片段，确认已有步骤与断言。
	- iOS 平台的 Airtest 套件：`/IOS/*.air`（例如 `/IOS/Maintenance_pressure_test.air`、`/IOS/TaskSets_autotest.air`）。同样需要打开文件内容，了解当前流程实现。
	- 跨平台/脚本工具：`/batScript/`（如 `/batScript/Autotest.bat`、`/batScript/Android_Pressure_MTC_QR_R 2`，`/batScript/iOS_Pressure_MTC_QR_R`）。阅读脚本以掌握执行入口、参数及日志落点。
	- 若需要公用资源，可参考 `/AgentUtil.air`、`/README.md` 等文件，同样须打开内容提炼可复用操作。
4. 记录需要新增或修改的脚本、依赖步骤（feature flag、mock API、数据准备）及证据采集方式；必要时标注具体 `.air` 包名称及其角色，并引用阅读到的关键实现点。

### 3. 更新 TS 文档（### 4.3 Mobility Automation Testing）
1. 如果章节不存在，则在 `## 4. Testing Strategy` 下新增 `### 4.3 Mobility Automation Testing`。
	- 仅需列出与本次变更相关、需要调整的自动化脚本/批处理文件的相对路径，例如 `/Android/Maintenance_regression_hybrid.air`、`/IOS/TaskSets_autotest.air`、`/batScript/Autotest.bat` 等。
	- 可根据需要补充一句概述（例如“新增 AI Match 步骤”），但不再展开详细操作步骤或证据说明。
3. 列表或段落均可，确保引用路径全部使用 `/...` 相对路径约定。

### 4. 验证与交付
1. 自查 TS 文档是否仍遵循模板结构（无多余 AI 指南/元信息）。
2. 确认 `### 4.3 Mobility Automation Testing` 信息完整、无遗漏路径。
3. 保存文件，向用户汇报更新成功并提供 TS 文档路径。

## 注意事项
- 该 skill 仅负责 TS 文档第 4.3 节的追加说明，不会自动修改自动化测试仓库。
- 如果未来自动化仓库迁移到其他 Git URL，需要在此文档更新同步指令，但仍维持 `/...` 相对路径要求。
- 如需新增其他自动化章节，请先在 OpenSpec 中提出相应变更。
