# 🔍 Pre-commit钩子功能详解

## 🎯 Pre-commit钩子的作用

Pre-commit钩子是一个**本地自动化脚本**，在每次执行`git commit`命令时自动运行，确保您的AI数字溯源系统始终保持最新和完整状态。

---

## 🔄 执行流程详解

### 第1步：环境检查 (5秒)
```bash
echo "🚀 Running Digital Provenance pre-commit checks..."

# 检查必需工具是否安装
command -v syft >/dev/null 2>&1 || { echo "❌ Syft is not installed"; exit 1; }
command -v cosign >/dev/null 2>&1 || { echo "❌ Cosign is not installed"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python3 is not installed"; exit 1; }
```

**作用**:
- 验证Syft（SBOM生成器）是否已安装
- 验证Cosign（数字签名工具）是否已安装
- 验证Python3（AI检测脚本）是否可用
- 如果任何工具缺失，阻止提交并提示安装

### 第2步：智能SBOM缓存 (性能优化)
```bash
# 检查package-lock.json是否变更
PACKAGE_LOCK_CHANGED=false
if git diff --cached --name-only | grep -q "package-lock.json"; then
    PACKAGE_LOCK_CHANGED=true
    echo "📦 Package dependencies changed, regenerating SBOM..."
else
    echo "📦 No dependency changes detected, using cached SBOM..."
fi
```

**作用**:
- **智能检测**：只有当`package-lock.json`发生变化时才重新生成SBOM
- **性能优化**：如果依赖没有变化，跳过耗时的SBOM生成过程
- **时间节省**：从77秒优化到9秒的关键优化点

### 第3步：SBOM生成 (仅在需要时)
```bash
if [ "$PACKAGE_LOCK_CHANGED" = true ]; then
    echo "📦 Generating base SBOM..."
    syft . -o cyclonedx-json > base-sbom.json
fi
```

**作用**:
- 扫描整个项目，识别所有依赖组件
- 生成标准CycloneDX格式的软件物料清单
- 包含组件名称、版本、许可证等完整信息
- 为后续AI检测提供基础数据

### 第4步：AI代码检测和AIBOM生成
```bash
echo "🤖 Processing SBOM to AIBOM..."
python3 scripts/process_aibom.py
```

**作用**:
- 运行AI检测算法，扫描源代码文件
- 识别AI生成的代码文件和模式
- 将AI检测结果集成到SBOM中
- 生成增强版AIBOM（AI-enhanced SBOM）

### 第5步：数字签名
```bash
echo "🔑 Signing AIBOM..."
cosign sign-blob --key cosign.key --bundle aibom.sigstore.json aibom-final.json
```

**作用**:
- 使用您的私钥对AIBOM进行数字签名
- 生成Sigstore格式的签名文件
- 确保AIBOM的完整性和真实性
- 提供不可篡改的溯源证明

### 第6步：签名验证
```bash
echo "✅ Verifying AIBOM signature..."
cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json
```

**作用**:
- 立即验证刚生成的数字签名
- 确保签名过程正确完成
- 提供即时的完整性检查
- 防止签名文件损坏或错误

### 第7步：可选的漏洞扫描
```bash
if [ "$ENABLE_VULN_SCAN" = "true" ]; then
    echo "🔍 Running vulnerability scan..."
    trivy sbom aibom-final.json --severity HIGH,CRITICAL --exit-code 1
fi
```

**作用**:
- 仅在启用时运行（默认关闭以提高性能）
- 扫描SBOM中的已知安全漏洞
- 重点关注HIGH和CRITICAL级别漏洞
- 发现严重漏洞时警告但不阻止提交

### 第8步：自动添加到提交
```bash
echo "📝 Adding provenance files to commit..."
git add base-sbom.json aibom-final.json aibom.sigstore.json
```

**作用**:
- 自动将生成的溯源文件添加到当前提交
- 确保每次提交都包含最新的数字溯源信息
- 无需手动管理这些文件

---

## 🎯 Pre-commit钩子的实际效果

### 当您执行`git commit`时会发生什么：

#### ✅ 自动触发（无需手动操作）
```bash
$ git commit -m "feat: 添加新功能"

🚀 Running Digital Provenance pre-commit checks...
📦 No dependency changes detected, using cached SBOM...
🤖 Processing SBOM to AIBOM...
✅ AIBOM 已生成: aibom-final.json
🤖 AI检测结果: 0 个文件, 0 个指标
📊 标记组件: 0 个
🔑 Signing AIBOM...
Using payload from: aibom-final.json
Signing artifact...
Wrote bundle to file aibom.sigstore.json
✅ Verifying AIBOM signature...
Verified OK
📝 Adding provenance files to commit...
✅ Digital Provenance checks completed successfully!

[main abc1234] feat: 添加新功能
 4 files changed, 10 insertions(+)
 create mode 100644 src/new-feature.ts
 modified: aibom-final.json
 modified: aibom.sigstore.json
```

#### 📁 自动生成的文件
每次提交后，您的仓库会自动包含：
- `base-sbom.json` - 基础软件物料清单
- `aibom-final.json` - AI增强的SBOM
- `aibom.sigstore.json` - 数字签名文件

---

## ⚡ 性能优化特性

### 🚀 智能缓存机制
- **依赖未变化**：9秒完成（跳过SBOM生成）
- **依赖有变化**：30-45秒完成（重新生成SBOM）
- **首次运行**：60-90秒完成（下载工具和数据库）

### 🔍 条件执行
- **SBOM生成**：仅在`package-lock.json`变化时
- **漏洞扫描**：仅在`ENABLE_VULN_SCAN=true`时
- **工具检查**：每次运行，确保环境完整

---

## 🛡️ 安全保障

### 🔒 多重验证
1. **工具可用性**：确保所有必需工具已安装
2. **环境变量**：验证COSIGN_PASSWORD已设置
3. **签名完整性**：立即验证生成的数字签名
4. **错误处理**：任何步骤失败都会阻止提交

### 🚫 失败场景处理
如果pre-commit钩子失败，提交会被阻止：
```bash
❌ Failed to generate SBOM
❌ Failed to process AIBOM
❌ Failed to sign AIBOM
❌ Failed to verify AIBOM signature
❌ COSIGN_PASSWORD environment variable not set
```

---

## 🎯 Pre-commit vs GitHub Actions对比

| 功能 | Pre-commit钩子 | GitHub Actions |
|------|----------------|----------------|
| **执行时机** | 本地提交前 | 推送到GitHub后 |
| **执行环境** | 开发者本地 | GitHub云端 |
| **主要作用** | 确保提交质量 | CI/CD自动化 |
| **失败影响** | 阻止提交 | 显示失败状态 |
| **性能优化** | 智能缓存 | 每次完整执行 |
| **网络依赖** | 首次需要 | 每次需要 |

### 🔄 协同工作
- **Pre-commit**：在本地确保每个提交都有完整的数字溯源
- **GitHub Actions**：在云端验证和展示溯源结果
- **双重保障**：本地+云端的完整AI透明度解决方案

---

## 🛠️ 自定义配置

### 环境变量控制
```bash
# 必需的环境变量
export COSIGN_PASSWORD="your_secure_password"

# 可选的性能控制
export ENABLE_VULN_SCAN="false"  # 默认关闭漏洞扫描
export ENABLE_SBOM_CACHE="true"  # 默认启用SBOM缓存
```

### 跳过Pre-commit（紧急情况）
```bash
# 跳过pre-commit钩子（不推荐）
git commit --no-verify -m "emergency fix"
```

---

## 🎉 Pre-commit钩子的价值

### 🔍 **开发者体验**
- **无感知**：自动运行，无需记住额外命令
- **即时反馈**：本地立即发现问题
- **一致性**：每个提交都有相同的质量保证

### 🛡️ **安全保障**
- **完整溯源**：每个提交都包含数字溯源信息
- **AI透明度**：自动识别和标记AI生成代码
- **签名验证**：确保溯源文件完整性

### ⚡ **性能优化**
- **智能缓存**：避免不必要的重复计算
- **条件执行**：仅在需要时运行耗时操作
- **快速反馈**：大多数情况下9秒内完成

---

## 🎯 总结

**Pre-commit钩子是您的AI数字溯源系统的本地守护者**，它确保：

- ✅ **每个提交**都有完整的数字溯源信息
- ✅ **AI代码**被自动识别和标记
- ✅ **数字签名**保证溯源文件完整性
- ✅ **性能优化**提供快速的开发体验
- ✅ **错误预防**在本地就发现和解决问题

**它与GitHub Actions工作流协同工作，为您提供完整的本地+云端AI透明度解决方案！**

---

*Pre-commit钩子功能详解 v1.0*
*本地AI数字溯源的核心组件*