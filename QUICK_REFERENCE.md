# 数字溯源系统 - 快速参考指南

## 🚀 日常使用命令

### 基本工作流
```bash
# 正常开发提交（自动触发溯源）
git add .
git commit -m "feat: 你的提交信息"

# 手动生成溯源（测试用）
./scripts/manual-provenance.sh

# 验证签名
./scripts/verify-provenance.sh

# 性能测试
./scripts/quick-test.sh
```

### 实用工具
```bash
# SBOM差异分析
python3 scripts/sbom_diff.py old-sbom.json new-sbom.json

# 查看AI检测结果
cat aibom-final.json | grep -A5 "ai:detection_report"

# 重新运行优化设置
./setup-optimizations.sh
```

## ⚙️ 配置文件

### 环境变量 (.env)
```bash
COSIGN_PASSWORD=your_secure_password_here
ENABLE_SBOM_CACHE=true
ENABLE_VULN_SCAN=true
AI_CONFIDENCE_THRESHOLD=0.7
```

### 重要文件位置
- 🔑 私钥: `cosign.key` (gitignored)
- 🔓 公钥: `cosign.pub` (已提交)
- 📋 SBOM: `aibom-final.json`
- 🔏 签名: `aibom.sigstore.json`

## 🔧 故障排除

### 常见问题
1. **提交慢**: 检查 `ENABLE_SBOM_CACHE=true`
2. **签名失败**: 确认 `COSIGN_PASSWORD` 正确
3. **AI检测不准**: 调整 `AI_CONFIDENCE_THRESHOLD`

### 诊断命令
```bash
# 检查工具版本
syft version
cosign version
trivy version

# 验证配置
source .env && echo $COSIGN_PASSWORD

# 测试完整流程
./scripts/quick-test.sh
```

## 📊 性能指标

- ⚡ 提交时间: ~9秒 (优化前77秒)
- 🤖 AI检测准确率: 90%
- 🔒 安全等级: 高
- 📈 性能提升: 88%

## 🆘 获取帮助

1. 查看详细文档: `OPTIMIZATION_REPORT.md`
2. 运行诊断: `./scripts/quick-test.sh`
3. 检查日志: `.git/hooks/pre-commit.log`

---
*最后更新: 2026-02-11*
*系统版本: 企业级优化版 v2.0*