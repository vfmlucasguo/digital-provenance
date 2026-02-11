# 🔧 GitHub Actions数字签名错误解决方案

## 🚨 错误分析

错误信息：`Error: signing aibom-final.json: reading key: invalid pem block`

**根本原因**: GitHub Secrets中的`COSIGN_PRIVATE_KEY`内容格式有问题，通常是复制粘贴时丢失了换行符或格式。

---

## ✅ 解决步骤

### 步骤1: 正确获取私钥内容

在本地终端运行以下命令，获取完整的私钥内容：

```bash
# 显示完整的私钥内容（包含所有换行符）
cat cosign.key
```

**重要**: 必须复制**完整输出**，包括：
- `-----BEGIN ENCRYPTED SIGSTORE PRIVATE KEY-----`
- 中间的所有加密内容行
- `-----END ENCRYPTED SIGSTORE PRIVATE KEY-----`
- **所有换行符都必须保留**

### 步骤2: 设置GitHub Secret

1. 访问GitHub仓库设置页面：
   ```
   https://github.com/vfmlucasguo/digital-provenance/settings/secrets/actions
   ```

2. 找到`COSIGN_PRIVATE_KEY`，点击"Update"（或创建新的）

3. 在Value字段中：
   - **完整粘贴**步骤1中复制的内容
   - **不要**添加额外的空格或换行
   - **不要**删除任何换行符
   - **确保**开头和结尾的标记行完整

### 步骤3: 验证COSIGN_PASSWORD

确保`COSIGN_PASSWORD`也正确设置：
- 值应该是: `SecureDigitalProvenance2026!`
- 没有额外的空格或字符

### 步骤4: 测试修复

设置完成后，推送一个小的更改来触发工作流：

```bash
# 创建一个小的测试更改
echo "# Test fix for cosign key issue" >> README.md
git add README.md
git commit -m "test: 修复cosign私钥配置问题"
git push origin main
```

---

## 🔍 常见问题和解决方案

### 问题1: 复制时丢失换行符
**症状**: `invalid pem block`错误
**解决**: 使用`cat cosign.key`命令，确保复制完整内容

### 问题2: 额外的空格或字符
**症状**: `invalid pem block`或解密失败
**解决**: 重新复制，不要手动编辑内容

### 问题3: 密码错误
**症状**: `could not decrypt`错误
**解决**: 确认COSIGN_PASSWORD正确设置

### 问题4: 文件编码问题
**症状**: 各种格式错误
**解决**: 确保使用UTF-8编码，避免特殊字符

---

## 🧪 验证修复的方法

### 方法1: 查看GitHub Actions日志
修复后的成功输出应该是：
```
🔏 Signing AI-enhanced SBOM...
Using payload from: aibom-final.json
Signing artifact...
Wrote bundle to file aibom.sigstore.json
✅ Signature verification successful
```

### 方法2: 本地测试私钥
在本地验证私钥可以正常使用：
```bash
# 测试私钥可以正常签名
export COSIGN_PASSWORD="SecureDigitalProvenance2026!"
echo "test content" > test.txt
cosign sign-blob --key cosign.key --bundle test.sigstore.json test.txt
cosign verify-blob --key cosign.pub --bundle test.sigstore.json test.txt
rm test.txt test.sigstore.json
```

---

## 🎯 预防措施

### 1. 使用脚本设置Secret
创建一个脚本来自动设置GitHub Secret：
```bash
#!/bin/bash
# 自动设置GitHub Secret
gh secret set COSIGN_PRIVATE_KEY < cosign.key
echo "✅ COSIGN_PRIVATE_KEY已更新"
```

### 2. 定期验证Secret
定期检查Secret是否正确：
```bash
# 检查Secret是否存在
gh secret list | grep COSIGN
```

### 3. 备份私钥
确保私钥文件有安全备份，避免丢失。

---

## 🚀 立即行动

1. **复制私钥**: 运行`cat cosign.key`并复制完整输出
2. **更新Secret**: 在GitHub设置中更新COSIGN_PRIVATE_KEY
3. **测试修复**: 推送小的更改验证修复
4. **确认成功**: 查看GitHub Actions运行成功

修复完成后，您的AI数字溯源系统将恢复正常运行！

---

*GitHub Actions数字签名错误解决方案 v1.0*
*确保Cosign私钥正确配置*