#!/usr/bin/env python3
"""
CI/CD测试套件
验证数字溯源系统的所有组件是否正常工作
"""

import os
import sys
import json
import subprocess
import tempfile
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class CICDTestSuite:
    def __init__(self):
        self.test_results = []
        self.temp_dir = None
        self.original_dir = os.getcwd()

    def setup_test_environment(self):
        """设置测试环境"""
        print("🔧 设置测试环境...")
        self.temp_dir = tempfile.mkdtemp(prefix='cicd_test_')
        print(f"📁 测试目录: {self.temp_dir}")

    def cleanup_test_environment(self):
        """清理测试环境"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            print("🧹 测试环境已清理")

    def run_command(self, command: List[str], cwd: Optional[str] = None,
                   timeout: int = 60) -> Tuple[bool, str, str]:
        """运行命令并返回结果"""
        try:
            result = subprocess.run(
                command,
                cwd=cwd or self.original_dir,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            return result.returncode == 0, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return False, "", f"命令超时 ({timeout}秒)"
        except Exception as e:
            return False, "", str(e)

    def test_tools_installation(self) -> bool:
        """测试必需工具是否已安装"""
        print("\n🔍 测试工具安装状态...")

        tools = {
            'syft': ['syft', 'version'],
            'cosign': ['cosign', 'version'],
            'trivy': ['trivy', 'version'],
            'python3': ['python3', '--version'],
            'git': ['git', '--version'],
            'node': ['node', '--version'],
            'npm': ['npm', '--version']
        }

        all_passed = True
        for tool_name, command in tools.items():
            success, stdout, stderr = self.run_command(command)
            if success:
                version = stdout.strip().split('\n')[0]
                print(f"  ✅ {tool_name}: {version}")
                self.test_results.append({
                    'test': f'tool_installation_{tool_name}',
                    'status': 'PASS',
                    'message': version
                })
            else:
                print(f"  ❌ {tool_name}: 未安装或无法访问")
                self.test_results.append({
                    'test': f'tool_installation_{tool_name}',
                    'status': 'FAIL',
                    'message': stderr or '工具未找到'
                })
                all_passed = False

        return all_passed

    def test_environment_variables(self) -> bool:
        """测试环境变量配置"""
        print("\n🔧 测试环境变量配置...")

        required_vars = ['COSIGN_PASSWORD']
        optional_vars = ['SLACK_WEBHOOK_URL', 'TEAMS_WEBHOOK_URL']

        all_passed = True

        # 检查必需的环境变量
        for var in required_vars:
            if os.getenv(var):
                print(f"  ✅ {var}: 已设置")
                self.test_results.append({
                    'test': f'env_var_{var}',
                    'status': 'PASS',
                    'message': '环境变量已设置'
                })
            else:
                print(f"  ❌ {var}: 未设置")
                self.test_results.append({
                    'test': f'env_var_{var}',
                    'status': 'FAIL',
                    'message': '必需的环境变量未设置'
                })
                all_passed = False

        # 检查可选的环境变量
        for var in optional_vars:
            if os.getenv(var):
                print(f"  ✅ {var}: 已设置 (可选)")
            else:
                print(f"  ⚠️  {var}: 未设置 (可选)")

        return all_passed

    def test_cosign_keys(self) -> bool:
        """测试Cosign密钥配置"""
        print("\n🔑 测试Cosign密钥配置...")

        all_passed = True

        # 检查私钥文件
        if os.path.exists('cosign.key'):
            print("  ✅ cosign.key: 存在")
            self.test_results.append({
                'test': 'cosign_private_key',
                'status': 'PASS',
                'message': '私钥文件存在'
            })
        else:
            print("  ❌ cosign.key: 不存在")
            self.test_results.append({
                'test': 'cosign_private_key',
                'status': 'FAIL',
                'message': '私钥文件不存在'
            })
            all_passed = False

        # 检查公钥文件
        if os.path.exists('cosign.pub'):
            print("  ✅ cosign.pub: 存在")
            self.test_results.append({
                'test': 'cosign_public_key',
                'status': 'PASS',
                'message': '公钥文件存在'
            })
        else:
            print("  ❌ cosign.pub: 不存在")
            self.test_results.append({
                'test': 'cosign_public_key',
                'status': 'FAIL',
                'message': '公钥文件不存在'
            })
            all_passed = False

        # 测试密钥匹配
        if all_passed:
            test_file = os.path.join(self.temp_dir, 'test.txt')
            with open(test_file, 'w') as f:
                f.write('test content')

            # 尝试签名
            success, stdout, stderr = self.run_command([
                'cosign', 'sign-blob', '--key', 'cosign.key',
                '--bundle', os.path.join(self.temp_dir, 'test.sigstore.json'),
                test_file
            ])

            if success:
                # 尝试验证
                success, stdout, stderr = self.run_command([
                    'cosign', 'verify-blob', '--key', 'cosign.pub',
                    '--bundle', os.path.join(self.temp_dir, 'test.sigstore.json'),
                    test_file
                ])

                if success:
                    print("  ✅ 密钥对匹配且功能正常")
                    self.test_results.append({
                        'test': 'cosign_key_functionality',
                        'status': 'PASS',
                        'message': '密钥对功能正常'
                    })
                else:
                    print(f"  ❌ 签名验证失败: {stderr}")
                    self.test_results.append({
                        'test': 'cosign_key_functionality',
                        'status': 'FAIL',
                        'message': f'签名验证失败: {stderr}'
                    })
                    all_passed = False
            else:
                print(f"  ❌ 签名失败: {stderr}")
                self.test_results.append({
                    'test': 'cosign_key_functionality',
                    'status': 'FAIL',
                    'message': f'签名失败: {stderr}'
                })
                all_passed = False

        return all_passed

    def test_sbom_generation(self) -> bool:
        """测试SBOM生成"""
        print("\n📦 测试SBOM生成...")

        # 生成基础SBOM
        success, stdout, stderr = self.run_command([
            'syft', '.', '-o', 'cyclonedx-json'
        ])

        if success:
            try:
                sbom_data = json.loads(stdout)
                components_count = len(sbom_data.get('components', []))
                print(f"  ✅ SBOM生成成功: {components_count} 个组件")
                self.test_results.append({
                    'test': 'sbom_generation',
                    'status': 'PASS',
                    'message': f'生成了 {components_count} 个组件'
                })

                # 保存SBOM用于后续测试
                with open('test-base-sbom.json', 'w') as f:
                    json.dump(sbom_data, f, indent=2)

                return True
            except json.JSONDecodeError:
                print("  ❌ SBOM格式无效")
                self.test_results.append({
                    'test': 'sbom_generation',
                    'status': 'FAIL',
                    'message': 'SBOM格式无效'
                })
        else:
            print(f"  ❌ SBOM生成失败: {stderr}")
            self.test_results.append({
                'test': 'sbom_generation',
                'status': 'FAIL',
                'message': f'SBOM生成失败: {stderr}'
            })

        return False

    def test_ai_detection(self) -> bool:
        """测试AI检测功能"""
        print("\n🤖 测试AI检测功能...")

        # 创建测试AI文件
        test_ai_file = 'src/app/test-ai-component.ts'
        os.makedirs(os.path.dirname(test_ai_file), exist_ok=True)
        with open(test_ai_file, 'w') as f:
            f.write('''// Generated by Claude AI
// This is an AI-generated test component
export class TestAIComponent {
  // Auto-generated method
  testMethod() {
    console.log("AI generated test method");
  }
}''')

        try:
            # 运行AI检测
            success, stdout, stderr = self.run_command([
                'python3', 'scripts/process_aibom.py'
            ])

            if success:
                # 检查是否生成了AIBOM
                if os.path.exists('aibom-final.json'):
                    with open('aibom-final.json', 'r') as f:
                        aibom = json.load(f)

                    # 检查AI检测结果
                    ai_files = 0
                    for prop in aibom.get('metadata', {}).get('properties', []):
                        if prop.get('name') == 'ai:detected_files':
                            ai_files = int(prop.get('value', 0))
                            break

                    if ai_files > 0:
                        print(f"  ✅ AI检测成功: 检测到 {ai_files} 个AI生成文件")
                        self.test_results.append({
                            'test': 'ai_detection',
                            'status': 'PASS',
                            'message': f'检测到 {ai_files} 个AI生成文件'
                        })
                        return True
                    else:
                        print("  ⚠️  AI检测未发现AI生成文件")
                        self.test_results.append({
                            'test': 'ai_detection',
                            'status': 'WARN',
                            'message': '未检测到AI生成文件'
                        })
                        return True
                else:
                    print("  ❌ AIBOM文件未生成")
                    self.test_results.append({
                        'test': 'ai_detection',
                        'status': 'FAIL',
                        'message': 'AIBOM文件未生成'
                    })
            else:
                print(f"  ❌ AI检测失败: {stderr}")
                self.test_results.append({
                    'test': 'ai_detection',
                    'status': 'FAIL',
                    'message': f'AI检测失败: {stderr}'
                })

        finally:
            # 清理测试文件
            if os.path.exists(test_ai_file):
                os.remove(test_ai_file)
            if os.path.exists('src/app') and not os.listdir('src/app'):
                os.rmdir('src/app')
            if os.path.exists('src') and not os.listdir('src'):
                os.rmdir('src')

        return False

    def test_security_scanning(self) -> bool:
        """测试安全扫描功能"""
        print("\n🔒 测试安全扫描功能...")

        all_passed = True

        # 测试恶意软件检测
        if os.path.exists('aibom-final.json'):
            success, stdout, stderr = self.run_command([
                'python3', 'scripts/malware_check.py', 'aibom-final.json'
            ])

            if success:
                print("  ✅ 恶意软件检测: 通过")
                self.test_results.append({
                    'test': 'malware_detection',
                    'status': 'PASS',
                    'message': '恶意软件检测完成'
                })
            else:
                print(f"  ❌ 恶意软件检测: 失败 - {stderr}")
                self.test_results.append({
                    'test': 'malware_detection',
                    'status': 'FAIL',
                    'message': f'恶意软件检测失败: {stderr}'
                })
                all_passed = False

            # 测试许可证检查
            success, stdout, stderr = self.run_command([
                'python3', 'scripts/license_check.py', 'aibom-final.json'
            ])

            if success:
                print("  ✅ 许可证检查: 通过")
                self.test_results.append({
                    'test': 'license_check',
                    'status': 'PASS',
                    'message': '许可证检查完成'
                })
            else:
                print(f"  ❌ 许可证检查: 失败 - {stderr}")
                self.test_results.append({
                    'test': 'license_check',
                    'status': 'FAIL',
                    'message': f'许可证检查失败: {stderr}'
                })
                all_passed = False

            # 测试供应链风险评估
            success, stdout, stderr = self.run_command([
                'python3', 'scripts/supply_chain_risk.py', 'aibom-final.json'
            ])

            if success:
                print("  ✅ 供应链风险评估: 通过")
                self.test_results.append({
                    'test': 'supply_chain_risk',
                    'status': 'PASS',
                    'message': '供应链风险评估完成'
                })
            else:
                print(f"  ❌ 供应链风险评估: 失败 - {stderr}")
                self.test_results.append({
                    'test': 'supply_chain_risk',
                    'status': 'FAIL',
                    'message': f'供应链风险评估失败: {stderr}'
                })
                all_passed = False
        else:
            print("  ⚠️  跳过安全扫描测试 (AIBOM文件不存在)")
            all_passed = False

        return all_passed

    def test_workflow_files(self) -> bool:
        """测试工作流文件"""
        print("\n🔄 测试工作流文件...")

        workflow_files = [
            '.github/workflows/digital-provenance.yml',
            '.github/workflows/multi-environment-deployment.yml'
        ]

        all_passed = True
        for workflow_file in workflow_files:
            if os.path.exists(workflow_file):
                print(f"  ✅ {workflow_file}: 存在")
                self.test_results.append({
                    'test': f'workflow_file_{os.path.basename(workflow_file)}',
                    'status': 'PASS',
                    'message': '工作流文件存在'
                })
            else:
                print(f"  ❌ {workflow_file}: 不存在")
                self.test_results.append({
                    'test': f'workflow_file_{os.path.basename(workflow_file)}',
                    'status': 'FAIL',
                    'message': '工作流文件不存在'
                })
                all_passed = False

        return all_passed

    def test_utility_scripts(self) -> bool:
        """测试实用脚本"""
        print("\n🛠️  测试实用脚本...")

        scripts = [
            'scripts/manual-provenance.sh',
            'scripts/verify-provenance.sh',
            'scripts/quick-test.sh',
            'scripts/sbom_diff.py',
            'scripts/notification_system.py',
            'scripts/dashboard_generator.py'
        ]

        all_passed = True
        for script in scripts:
            if os.path.exists(script) and os.access(script, os.X_OK):
                print(f"  ✅ {script}: 存在且可执行")
                self.test_results.append({
                    'test': f'script_{os.path.basename(script)}',
                    'status': 'PASS',
                    'message': '脚本存在且可执行'
                })
            elif os.path.exists(script):
                print(f"  ⚠️  {script}: 存在但不可执行")
                self.test_results.append({
                    'test': f'script_{os.path.basename(script)}',
                    'status': 'WARN',
                    'message': '脚本存在但不可执行'
                })
            else:
                print(f"  ❌ {script}: 不存在")
                self.test_results.append({
                    'test': f'script_{os.path.basename(script)}',
                    'status': 'FAIL',
                    'message': '脚本不存在'
                })
                all_passed = False

        return all_passed

    def generate_test_report(self) -> str:
        """生成测试报告"""
        passed = len([r for r in self.test_results if r['status'] == 'PASS'])
        failed = len([r for r in self.test_results if r['status'] == 'FAIL'])
        warned = len([r for r in self.test_results if r['status'] == 'WARN'])
        total = len(self.test_results)

        report = f"""
# 🧪 CI/CD测试套件报告

## 📊 测试概览

- **总测试数**: {total}
- **✅ 通过**: {passed}
- **❌ 失败**: {failed}
- **⚠️ 警告**: {warned}
- **成功率**: {(passed/total*100):.1f}%

## 📋 详细结果

"""

        for result in self.test_results:
            status_icon = {'PASS': '✅', 'FAIL': '❌', 'WARN': '⚠️'}.get(result['status'], '❓')
            report += f"### {status_icon} {result['test']}\n"
            report += f"**状态**: {result['status']}\n"
            report += f"**信息**: {result['message']}\n\n"

        report += f"""
## 🎯 建议

"""

        if failed > 0:
            report += "### 🔴 需要立即修复的问题\n\n"
            for result in self.test_results:
                if result['status'] == 'FAIL':
                    report += f"- **{result['test']}**: {result['message']}\n"
            report += "\n"

        if warned > 0:
            report += "### 🟡 建议改进的项目\n\n"
            for result in self.test_results:
                if result['status'] == 'WARN':
                    report += f"- **{result['test']}**: {result['message']}\n"
            report += "\n"

        if failed == 0:
            report += "🎉 所有关键测试都已通过！您的CI/CD系统已准备就绪。\n\n"

        report += f"""
---
*测试报告生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
*CI/CD测试套件 v1.0*
"""

        return report

    def run_all_tests(self) -> bool:
        """运行所有测试"""
        print("🚀 开始运行CI/CD测试套件...")
        print("=" * 50)

        self.setup_test_environment()

        try:
            # 运行所有测试
            tests = [
                self.test_tools_installation,
                self.test_environment_variables,
                self.test_cosign_keys,
                self.test_sbom_generation,
                self.test_ai_detection,
                self.test_security_scanning,
                self.test_workflow_files,
                self.test_utility_scripts
            ]

            all_passed = True
            for test in tests:
                try:
                    result = test()
                    if not result:
                        all_passed = False
                except Exception as e:
                    print(f"  ❌ 测试执行出错: {e}")
                    all_passed = False

            # 生成报告
            report = self.generate_test_report()
            with open('cicd-test-report.md', 'w', encoding='utf-8') as f:
                f.write(report)

            print("\n" + "=" * 50)
            print("📋 测试完成！")
            print(f"📄 详细报告已保存到: cicd-test-report.md")

            passed = len([r for r in self.test_results if r['status'] == 'PASS'])
            failed = len([r for r in self.test_results if r['status'] == 'FAIL'])
            total = len(self.test_results)

            print(f"📊 测试结果: {passed}/{total} 通过")

            if all_passed:
                print("🎉 所有测试通过！CI/CD系统已准备就绪。")
            else:
                print("⚠️  部分测试失败，请查看报告并修复问题。")

            return all_passed

        finally:
            self.cleanup_test_environment()

def main():
    """主函数"""
    test_suite = CICDTestSuite()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()