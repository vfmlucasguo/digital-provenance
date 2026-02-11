在本地构建这套 **Ionic 数字溯源 (Digital Provenance)** 流程，可以让你在代码提交前就完成“身份存证”和“物料清单生成”。这不仅是 2026 年的前沿开发规范，也是提升项目透明度的核心手段。

以下是详细的本地构建文档：

---

## 🛠️ 环境准备：工具安装清单

在开始之前，请确保你的本地机器（Windows/Mac/Linux）已安装以下工具：

1. **Syft** (SBOM 生成器):
* **Mac/Linux:** `curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin`
* **Windows:** `scoop install syft` 或直接下载 [Release 运行包](https://github.com/anchore/syft/releases)。


2. **Cosign** (签名工具):
* **Mac:** `brew install cosign`
* **Windows:** `scoop install cosign`


3. **Python 3.9+** (元数据处理): 确保已安装并配置环境变量。
4. **Trivy** (可选，用于本地审计): `brew install trivy`。

---

## 📂 项目结构规范

为了让脚本自动识别 AI 辅助的代码，建议你在 Ionic 项目中采用以下目录约定：

```text
my-ionic-app/
├── src/
│   └── app/
│       ├── pages/
│       │   └── ai-gen/         <-- 存放 AI 辅助生成的页面
│       └── services/          <-- 存放人工编写的业务逻辑
├── scripts/
│   └── process_aibom.py       <-- 溯源处理脚本
├── package-lock.json          <-- 核心依赖源
└── .env                       <-- 用于存储签名密钥（本地模式）

```

---

## 📝 核心文件配置

### 1. 溯源处理脚本 (`scripts/process_aibom.py`)

该脚本将 Syft 生成的原始 JSON 转换为包含 AI 标记的 AIBOM。

```python
import json
import os
from datetime import datetime

def process():
    input_path = "base-sbom.json"
    output_path = "aibom-final.json"
    
    if not os.path.exists(input_path):
        print(f"错误: 找不到 {input_path}")
        return

    with open(input_path, 'r') as f:
        bom = json.load(f)

    # 1. 注入全局 AI 平台元数据
    bom['metadata']['properties'] = [
        {"name": "ai:platform", "value": "Local-AI-Native-Flow"},
        {"name": "ai:local_build_time", "value": datetime.now().isoformat()}
    ]

    # 2. 自动标记 AI 生成的文件组件
    for comp in bom.get('components', []):
        if 'ai-gen' in comp.get('name', '').lower():
            comp.setdefault('properties', []).append({"name": "ai:generated", "value": "true"})

    with open(output_path, 'w') as f:
        json.dump(bom, f, indent=2)
    print(f"✅ AIBOM 已生成: {output_path}")

if __name__ == "__main__":
    process()

```

---

## 🚀 本地运行流程（操作手册）

当你完成了一次 Ionic 代码改动，准备提交前，按以下步骤运行：

### 第一步：生成基础物料清单

在项目根目录运行，Syft 会解析你的 `package-lock.json`：

```bash
syft . -o cyclonedx-json --output base-sbom.json

```

### 第二步：运行溯源增强

将基础清单转化为 AIBOM：

```bash
python scripts/process_aibom.py

```

### 第三步：本地数字签名（存证）

在本地，你需要先生成一对密钥（只需执行一次）：

```bash
cosign generate-key-pair

```

*这会生成 `cosign.key` 和 `cosign.pub`。*

然后对 AIBOM 进行签署：

```bash
cosign sign-blob --key cosign.key --bundle aibom.sigstore.json aibom-final.json

```

---

## 🔍 如何验证与审计？

完成上述步骤后，你可以通过以下方式检查你的 Ionic 项目健康度：

1. **检查 SDK 版本与漏洞：**
```bash
trivy sbom aibom-final.json

```


2. **验证溯源凭证的完整性：**
```bash
cosign verify-blob --key cosign.pub --bundle aibom.sigstore.json aibom-final.json

```


*如果输出 `Verified OK`，说明这份 AIBOM 记录是真实且未被篡改的。*

---

## 💡 进阶：Git Hook 自动化

为了不漏掉任何一次记录，你可以将上述命令写进 Git 的 `pre-commit` 钩子中。这样每次你 `git commit` 时，系统都会自动为你更新 AIBOM 并存证。

**你想让我为你提供一段可以直接放入 `.git/hooks/pre-commit` 的 Bash 脚本吗？**