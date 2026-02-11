# 🚨 紧急修复：GitHub Secrets配置问题

## 🔍 问题诊断

从GitHub Actions日志发现关键问题：
```
env:
    COSIGN_PASSWORD:
```

**COSIGN_PASSWORD为空！** 这导致Cosign无法解密私钥，从而报告"invalid pem block"错误。

---

## ✅ 立即修复步骤

### 步骤1: 设置COSIGN_PASSWORD Secret

1. **访问GitHub Secrets设置页面**：
   ```
   https://github.com/vfmlucasguo/digital-provenance/settings/secrets/actions
   ```

2. **检查COSIGN_PASSWORD**：
   - 如果不存在，点击"New repository secret"
   - 如果存在但为空，点击"Update"

3. **设置正确的密码**：
   - Name: `COSIGN_PASSWORD`
   - Value: `SecureDigitalProvenance2026!`
   - **重要**: 确保没有额外的空格或换行符

### 步骤2: 验证COSIGN_PRIVATE_KEY Secret

同时确保COSIGN_PRIVATE_KEY也正确设置：

1. **检查COSIGN_PRIVATE_KEY**：
   - 应该包含完整的PEM格式私钥
   - 从`-----BEGIN ENCRYPTED SIGSTORE PRIVATE KEY-----`开始
   - 到`-----END ENCRYPTED SIGSTORE PRIVATE KEY-----`结束

2. **如果需要更新**，使用以下完整内容：
   ```
   -----BEGIN ENCRYPTED SIGSTORE PRIVATE KEY-----
   eyJrZGYiOnsibmFtZSI6InNjcnlwdCIsInBhcmFtcyI6eyJOIjo2NTUzNiwiciI6
   OCwicCI6MX0sInNhbHQiOiJzU0FPdFJ3UEl2NkZlbUtTZXc4M09ZWVN4dUZncm1Q
   S2FxaSsvZzMxVm1RPSJ9LCJjaXBoZXIiOnsibmFtZSI6Im5hY2wvc2VjcmV0Ym94
   Iiwibm9uY2UiOiJkMCtFN2pzZWRVbU9CWE5nYlFnM2YzUktmcHdhSldmViJ9LCJj
   aXBoZXJ0ZXh0IjoicVRRdHdwNVllTDdPVjVwRngvaHpmUFZuQTl0SjhRNERvMjBa
   cXQzQVJudmYvTS8xRmlsMldaRDB5ZFllSEV3QkxrTm1MTEJ3ZDdnWm40QjNiNlNn
   OW10L1VlRGt6RWduT29OczNVc2Jhb1FYZzNRd05sWTZCUVhtWDhaU2NOVGhRTmtB
   RXdVUjFvdDdMUVRaZFllc0pYUFVFbHphMHpHSG9GMWthZXVWSzQ0VDJ0SU1yN1N4
   MG5WWDlvMGo0ZmtNSEJ4ZlFRRjh3V3NOZnc9PSJ9
   -----END ENCRYPTED SIGSTORE PRIVATE KEY-----
   ```

---

## 🧪 验证修复

设置完成后，重新运行GitHub Actions：

### 方法1: 重新运行失败的工作流
1. 访问：https://github.com/vfmlucasguo/digital-provenance/actions
2. 点击失败的工作流运行
3. 点击"Re-run jobs" → "Re-run all jobs"

### 方法2: 推送新的测试更改
```bash
# 创建一个小的测试更改
echo "Cosign secrets fix test - $(date)" >> COSIGN_FIX_TEST.md
git add COSIGN_FIX_TEST.md
git commit -m "test: 验证Cosign secrets修复"
git push origin main
```

---

## 🎯 成功标志

修复成功后，GitHub Actions日志应该显示：

```
env:
    COSIGN_PASSWORD: ***  # 不再为空
```

以及成功的签名输出：
```
🔏 Signing AI-enhanced SBOM...
Using payload from: aibom-final.json
Signing artifact...
Wrote bundle to file aibom.sigstore.json
✅ Digital signature created
```

---

## 🔧 故障排除

### 如果仍然失败：

1. **检查Secret名称**：确保是`COSIGN_PASSWORD`（大小写敏感）
2. **检查密码内容**：确保是`SecureDigitalProvenance2026!`
3. **清除浏览器缓存**：有时GitHub界面需要刷新
4. **等待几分钟**：GitHub Secrets更新可能需要短暂延迟

### 本地测试验证：
```bash
# 在本地验证密码是否正确
export COSIGN_PASSWORD="SecureDigitalProvenance2026!"
echo "test" > test.txt
cosign sign-blob --key cosign.key --bundle test.sigstore.json test.txt
# 如果成功，说明密码正确
rm test.txt test.sigstore.json
```

---

## 🚀 立即行动

1. **设置COSIGN_PASSWORD Secret** - 这是最关键的修复
2. **验证COSIGN_PRIVATE_KEY Secret** - 确保格式正确
3. **重新运行工作流** - 验证修复效果
4. **确认成功** - 查看绿色勾号和成功日志

修复这两个Secrets后，您的AI数字溯源系统将立即恢复正常运行！

---

*紧急修复指南 v1.0*
*解决GitHub Secrets配置问题*