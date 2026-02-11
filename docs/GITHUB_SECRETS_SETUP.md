# GitHub Secrets 配置指南

## 🔑 必需的 GitHub Secrets

为了让CI/CD工作流正常运行，您需要在GitHub仓库中配置以下Secrets：

### 1. 数字签名相关

#### COSIGN_PRIVATE_KEY
- **描述**: Cosign私钥内容
- **获取方式**:
  ```bash
  cat cosign.key
  ```
- **配置路径**: Settings → Secrets and variables → Actions → New repository secret
- **注意**: 包含完整的私钥内容，包括 `-----BEGIN ENCRYPTED COSIGN PRIVATE KEY-----` 和 `-----END ENCRYPTED COSIGN PRIVATE KEY-----`

#### COSIGN_PASSWORD
- **描述**: Cosign私钥密码
- **值**: 您在 `.env` 文件中设置的密码
- **示例**: `SecureDigitalProvenance2026!`

### 2. 部署相关 (可选)

#### DEPLOY_TOKEN_DEV
- **描述**: 开发环境部署令牌
- **用途**: 用于部署到开发环境

#### DEPLOY_TOKEN_STAGING
- **描述**: 预发布环境部署令牌
- **用途**: 用于部署到预发布环境

#### DEPLOY_TOKEN_PROD
- **描述**: 生产环境部署令牌
- **用途**: 用于部署到生产环境

### 3. 通知相关 (可选)

#### SLACK_WEBHOOK_URL
- **描述**: Slack通知Webhook URL
- **用途**: 发送部署状态通知

#### TEAMS_WEBHOOK_URL
- **描述**: Microsoft Teams通知Webhook URL
- **用途**: 发送部署状态通知

## 🏗️ 环境配置

### 创建部署环境

在GitHub仓库中创建以下环境：

1. **development**
   - 保护规则: 无
   - 自动部署: develop分支推送时

2. **staging**
   - 保护规则: 需要审查者批准
   - 自动部署: staging分支推送时

3. **production**
   - 保护规则: 需要管理员批准
   - 自动部署: 仅发布时

### 环境变量配置

每个环境可以设置特定的环境变量：

```yaml
# development 环境
API_URL: https://api-dev.example.com
DEBUG_MODE: true
LOG_LEVEL: debug

# staging 环境
API_URL: https://api-staging.example.com
DEBUG_MODE: false
LOG_LEVEL: info

# production 环境
API_URL: https://api.example.com
DEBUG_MODE: false
LOG_LEVEL: error
```

## 📋 配置步骤

### 步骤1: 准备密钥信息

```bash
# 1. 获取私钥内容
echo "=== COSIGN_PRIVATE_KEY ==="
cat cosign.key

# 2. 获取密码
echo "=== COSIGN_PASSWORD ==="
grep COSIGN_PASSWORD .env
```

### 步骤2: 在GitHub中配置

1. 进入您的GitHub仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加以下secrets:

   - Name: `COSIGN_PRIVATE_KEY`
     Value: [粘贴完整的私钥内容]

   - Name: `COSIGN_PASSWORD`
     Value: [您的密钥密码]

### 步骤3: 创建环境

1. 在Settings中选择 **Environments**
2. 点击 **New environment**
3. 创建三个环境：
   - `development`
   - `staging`
   - `production`

### 步骤4: 配置环境保护规则

#### Development环境
- 无特殊保护规则
- 允许自动部署

#### Staging环境
- 添加 **Required reviewers**: 至少1个审查者
- 设置 **Deployment branches**: 仅 `staging` 分支

#### Production环境
- 添加 **Required reviewers**: 至少2个审查者
- 设置 **Deployment branches**: 仅 `main` 分支
- 启用 **Wait timer**: 5分钟等待时间

## 🧪 测试配置

### 测试Secrets配置

创建一个简单的测试工作流来验证secrets配置：

```yaml
name: Test Secrets

on:
  workflow_dispatch:

jobs:
  test-secrets:
    runs-on: ubuntu-latest
    steps:
    - name: Test Cosign setup
      env:
        COSIGN_PRIVATE_KEY: ${{ secrets.COSIGN_PRIVATE_KEY }}
        COSIGN_PASSWORD: ${{ secrets.COSIGN_PASSWORD }}
      run: |
        if [ -z "$COSIGN_PRIVATE_KEY" ]; then
          echo "❌ COSIGN_PRIVATE_KEY not set"
          exit 1
        fi

        if [ -z "$COSIGN_PASSWORD" ]; then
          echo "❌ COSIGN_PASSWORD not set"
          exit 1
        fi

        echo "✅ All secrets configured correctly"
```

### 验证工作流

1. 推送代码到 `develop` 分支，验证开发环境部署
2. 创建PR到 `main` 分支，验证SBOM差异分析
3. 创建Release，验证生产环境部署

## 🔒 安全最佳实践

### Secrets管理
- 定期轮换密钥 (建议每季度)
- 使用最小权限原则
- 监控secrets使用情况
- 不要在日志中输出敏感信息

### 环境隔离
- 每个环境使用独立的secrets
- 生产环境需要额外的审批流程
- 限制对生产环境的访问权限

### 审计和监控
- 启用GitHub审计日志
- 监控异常的部署活动
- 设置关键操作的通知

## 🆘 故障排除

### 常见问题

#### 1. Cosign签名失败
```
Error: signing aibom-final.json: getting keypair and token
```
**解决方案**: 检查 `COSIGN_PRIVATE_KEY` 和 `COSIGN_PASSWORD` 是否正确设置

#### 2. 环境部署被阻止
```
Environment protection rules prevent deployment
```
**解决方案**: 确保有足够的审查者批准，或检查分支保护规则

#### 3. Secrets未找到
```
Error: Required secret not found
```
**解决方案**: 确认secret名称拼写正确，且已在正确的范围内设置

### 调试命令

```bash
# 检查工作流状态
gh run list --workflow="Multi-Environment Deployment"

# 查看特定运行的日志
gh run view [RUN_ID] --log

# 重新运行失败的工作流
gh run rerun [RUN_ID]
```

## 📞 获取帮助

如果遇到配置问题：

1. 检查GitHub Actions日志中的详细错误信息
2. 验证所有必需的secrets都已正确设置
3. 确认环境保护规则配置正确
4. 查看仓库的Actions权限设置

---

*配置完成后，您的CI/CD流水线将自动处理数字溯源、安全扫描和多环境部署！*