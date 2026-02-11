# Cosign私钥修复测试

此提交用于测试GitHub Actions中的Cosign数字签名功能是否正常工作。

修复内容:
- 更新GitHub Secret中的COSIGN_PRIVATE_KEY格式
- 确保私钥内容包含正确的换行符和PEM格式

预期结果:
- GitHub Actions工作流应该成功完成
- 数字签名步骤不再报错
- 生成有效的aibom.sigstore.json签名文件

测试时间: 2026年 2月11日 星期三 13时05分16秒 CST
