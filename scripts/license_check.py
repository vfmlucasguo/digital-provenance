#!/usr/bin/env python3
"""
许可证合规检查脚本
检查SBOM中的软件包许可证是否符合企业政策
"""

import json
import sys
import re
from typing import Dict, List, Set

# 许可证分类
LICENSE_CATEGORIES = {
    'permissive': {
        'MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', 'ISC',
        'Unlicense', 'WTFPL', 'CC0-1.0', 'Python-2.0'
    },
    'weak_copyleft': {
        'LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0',
        'CDDL-1.0', 'CDDL-1.1'
    },
    'strong_copyleft': {
        'GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'OSL-3.0'
    },
    'proprietary': {
        'UNLICENSED', 'COMMERCIAL', 'PROPRIETARY'
    },
    'unknown': {
        'UNKNOWN', 'NOASSERTION', '', None
    }
}

# 企业许可证政策配置
LICENSE_POLICY = {
    'allowed': {
        'MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', 'ISC',
        'LGPL-2.1', 'LGPL-3.0', 'MPL-2.0'
    },
    'review_required': {
        'GPL-2.0', 'GPL-3.0', 'EPL-1.0', 'EPL-2.0'
    },
    'prohibited': {
        'AGPL-3.0', 'OSL-3.0', 'SSPL-1.0'
    }
}

def load_sbom(file_path: str) -> Dict:
    """加载SBOM文件"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 {file_path}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"❌ 错误: 无效的JSON文件 {file_path}")
        sys.exit(1)

def normalize_license(license_str: str) -> str:
    """标准化许可证名称"""
    if not license_str:
        return 'UNKNOWN'

    # 移除版本号后缀
    license_str = re.sub(r'-only$|-or-later$', '', license_str)

    # 常见别名映射
    aliases = {
        'BSD': 'BSD-3-Clause',
        'MIT License': 'MIT',
        'Apache License 2.0': 'Apache-2.0',
        'GNU GPL v2': 'GPL-2.0',
        'GNU GPL v3': 'GPL-3.0',
        'LGPL': 'LGPL-2.1',
    }

    return aliases.get(license_str, license_str)

def extract_licenses(component: Dict) -> List[str]:
    """从组件中提取许可证信息"""
    licenses = []

    # 检查不同的许可证字段
    if 'licenses' in component:
        for license_info in component['licenses']:
            if isinstance(license_info, dict):
                if 'license' in license_info:
                    licenses.append(license_info['license'].get('id', ''))
                elif 'name' in license_info:
                    licenses.append(license_info['name'])
            elif isinstance(license_info, str):
                licenses.append(license_info)

    # 检查属性中的许可证信息
    for prop in component.get('properties', []):
        if prop.get('name') in ['syft:package:license', 'license']:
            licenses.append(prop.get('value', ''))

    # 标准化许可证名称
    return [normalize_license(lic) for lic in licenses if lic]

def categorize_license(license_name: str) -> str:
    """对许可证进行分类"""
    for category, licenses in LICENSE_CATEGORIES.items():
        if license_name in licenses:
            return category
    return 'unknown'

def check_license_compliance(components: List[Dict]) -> Dict:
    """检查许可证合规性"""
    results = {
        'compliant': [],
        'review_required': [],
        'violations': [],
        'unknown': [],
        'statistics': {}
    }

    license_stats = {}

    for component in components:
        name = component.get('name', 'unknown')
        version = component.get('version', 'unknown')
        licenses = extract_licenses(component)

        if not licenses:
            licenses = ['UNKNOWN']

        for license_name in licenses:
            # 统计许可证使用情况
            if license_name not in license_stats:
                license_stats[license_name] = 0
            license_stats[license_name] += 1

            # 检查合规性
            component_info = {
                'name': name,
                'version': version,
                'license': license_name,
                'category': categorize_license(license_name)
            }

            if license_name in LICENSE_POLICY['prohibited']:
                results['violations'].append(component_info)
            elif license_name in LICENSE_POLICY['review_required']:
                results['review_required'].append(component_info)
            elif license_name in LICENSE_POLICY['allowed']:
                results['compliant'].append(component_info)
            else:
                results['unknown'].append(component_info)

    results['statistics'] = license_stats
    return results

def generate_compliance_report(results: Dict) -> str:
    """生成合规性报告"""
    report = "# 📋 许可证合规性报告\n\n"

    # 总体统计
    total = len(results['compliant']) + len(results['review_required']) + \
            len(results['violations']) + len(results['unknown'])

    report += f"## 📊 总体统计\n\n"
    report += f"- 总组件数: {total}\n"
    report += f"- ✅ 合规组件: {len(results['compliant'])}\n"
    report += f"- ⚠️ 需审查组件: {len(results['review_required'])}\n"
    report += f"- ❌ 违规组件: {len(results['violations'])}\n"
    report += f"- ❓ 未知许可证: {len(results['unknown'])}\n\n"

    # 许可证使用统计
    if results['statistics']:
        report += "## 📈 许可证使用统计\n\n"
        sorted_licenses = sorted(results['statistics'].items(),
                               key=lambda x: x[1], reverse=True)
        for license_name, count in sorted_licenses[:10]:  # 显示前10个
            report += f"- {license_name}: {count} 个组件\n"
        report += "\n"

    # 违规组件详情
    if results['violations']:
        report += f"## ❌ 违规组件 ({len(results['violations'])}个)\n\n"
        report += "⚠️ 以下组件使用了禁止的许可证，必须移除或替换:\n\n"
        for comp in results['violations']:
            report += f"- **{comp['name']}@{comp['version']}**\n"
            report += f"  - 许可证: {comp['license']}\n"
            report += f"  - 分类: {comp['category']}\n\n"

    # 需审查组件
    if results['review_required']:
        report += f"## ⚠️ 需审查组件 ({len(results['review_required'])}个)\n\n"
        report += "以下组件需要法务团队审查:\n\n"
        for comp in results['review_required']:
            report += f"- **{comp['name']}@{comp['version']}**\n"
            report += f"  - 许可证: {comp['license']}\n"
            report += f"  - 分类: {comp['category']}\n\n"

    # 未知许可证
    if results['unknown']:
        report += f"## ❓ 未知许可证 ({len(results['unknown'])}个)\n\n"
        report += "以下组件的许可证信息不明确，需要进一步调查:\n\n"
        for comp in results['unknown'][:20]:  # 限制显示数量
            report += f"- **{comp['name']}@{comp['version']}**\n"
            report += f"  - 许可证: {comp['license']}\n\n"

        if len(results['unknown']) > 20:
            report += f"... 还有 {len(results['unknown']) - 20} 个组件\n\n"

    return report

def main():
    if len(sys.argv) != 2:
        print("用法: python3 license_check.py <sbom_file.json>")
        sys.exit(1)

    sbom_file = sys.argv[1]
    print(f"📋 正在检查许可证合规性: {sbom_file}")

    # 加载SBOM
    sbom = load_sbom(sbom_file)
    components = sbom.get('components', [])

    print(f"📦 检查 {len(components)} 个组件的许可证...")

    # 执行合规性检查
    results = check_license_compliance(components)

    # 生成报告
    report = generate_compliance_report(results)
    print(report)

    # 保存报告到文件
    with open('license-compliance-report.md', 'w') as f:
        f.write(report)
    print("📄 详细报告已保存到: license-compliance-report.md")

    # 根据结果决定退出码
    if results['violations']:
        print(f"\n❌ 发现 {len(results['violations'])} 个许可证违规，构建失败")
        sys.exit(1)
    elif results['review_required']:
        print(f"\n⚠️ 发现 {len(results['review_required'])} 个组件需要审查")
        # 可以根据政策决定是否失败构建
        # sys.exit(1)

    print("✅ 许可证合规性检查完成")

if __name__ == "__main__":
    main()