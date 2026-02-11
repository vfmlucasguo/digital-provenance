#!/usr/bin/env python3
"""
供应链风险评估脚本
评估SBOM中组件的供应链安全风险
"""

import json
import sys
import re
from datetime import datetime, timedelta
from typing import Dict, List, Set, Optional

# 风险评估规则
RISK_RULES = {
    'age_risk': {
        'very_old': 365 * 3,  # 3年以上
        'old': 365 * 2,       # 2年以上
        'outdated': 365       # 1年以上
    },
    'maintenance_risk': {
        'abandoned_threshold': 365 * 2,  # 2年未更新
        'low_maintenance': 365           # 1年未更新
    },
    'popularity_risk': {
        'unknown_package': True,
        'low_download_threshold': 1000
    }
}

# 高风险包名模式
HIGH_RISK_PATTERNS = [
    r'.*-dev$',           # 开发版本
    r'.*-beta$',          # 测试版本
    r'.*-alpha$',         # 早期版本
    r'.*-rc\d*$',         # 候选版本
    r'.*-snapshot$',      # 快照版本
    r'^test-.*',          # 测试包
    r'^demo-.*',          # 演示包
]

# 可信发布者/组织
TRUSTED_PUBLISHERS = {
    'npm': {
        'facebook', 'google', 'microsoft', 'angular', 'react',
        'typescript', 'webpack', 'babel', 'eslint', 'prettier'
    },
    'pypi': {
        'python', 'django', 'flask', 'requests', 'numpy', 'pandas'
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

def parse_version(version_str: str) -> Dict:
    """解析版本信息"""
    if not version_str:
        return {'major': 0, 'minor': 0, 'patch': 0, 'prerelease': True}

    # 移除前缀 (如 v1.0.0 -> 1.0.0)
    version_str = re.sub(r'^v', '', version_str)

    # 检查是否为预发布版本
    prerelease = bool(re.search(r'-(alpha|beta|rc|dev|snapshot)', version_str, re.I))

    # 提取数字版本
    match = re.match(r'(\d+)(?:\.(\d+))?(?:\.(\d+))?', version_str)
    if match:
        major = int(match.group(1) or 0)
        minor = int(match.group(2) or 0)
        patch = int(match.group(3) or 0)
    else:
        major = minor = patch = 0

    return {
        'major': major,
        'minor': minor,
        'patch': patch,
        'prerelease': prerelease,
        'original': version_str
    }

def assess_version_risk(component: Dict) -> Dict:
    """评估版本风险"""
    risks = []
    version_info = parse_version(component.get('version', ''))

    # 预发布版本风险
    if version_info['prerelease']:
        risks.append({
            'type': 'prerelease_version',
            'severity': 'MEDIUM',
            'description': '使用预发布版本，可能不稳定'
        })

    # 版本号风险模式
    version_str = component.get('version', '')
    for pattern in HIGH_RISK_PATTERNS:
        if re.match(pattern, version_str, re.I):
            risks.append({
                'type': 'risky_version_pattern',
                'severity': 'MEDIUM',
                'description': f'版本号匹配高风险模式: {pattern}'
            })

    # 主版本号为0的风险
    if version_info['major'] == 0:
        risks.append({
            'type': 'zero_major_version',
            'severity': 'LOW',
            'description': '主版本号为0，API可能不稳定'
        })

    return risks

def assess_naming_risk(component: Dict) -> List[Dict]:
    """评估命名风险"""
    risks = []
    name = component.get('name', '').lower()

    # 检查可疑的包名
    suspicious_patterns = [
        (r'.*password.*', '包名包含敏感词汇'),
        (r'.*secret.*', '包名包含敏感词汇'),
        (r'.*token.*', '包名包含敏感词汇'),
        (r'.*hack.*', '包名包含可疑词汇'),
        (r'.*crack.*', '包名包含可疑词汇'),
        (r'.*exploit.*', '包名包含可疑词汇'),
    ]

    for pattern, description in suspicious_patterns:
        if re.search(pattern, name):
            risks.append({
                'type': 'suspicious_naming',
                'severity': 'MEDIUM',
                'description': description
            })

    # 检查单字符或极短包名
    if len(name) <= 2:
        risks.append({
            'type': 'short_name',
            'severity': 'LOW',
            'description': '包名过短，可能是占位包'
        })

    # 检查包含数字的奇怪模式
    if re.search(r'\d{4,}', name):  # 包含4位以上数字
        risks.append({
            'type': 'numeric_pattern',
            'severity': 'LOW',
            'description': '包名包含长数字序列，可能是自动生成'
        })

    return risks

def assess_dependency_risk(components: List[Dict]) -> Dict:
    """评估依赖关系风险"""
    risks = []

    # 统计依赖深度和广度
    total_deps = len(components)
    direct_deps = len([c for c in components if c.get('scope') == 'required'])

    # 依赖过多风险
    if total_deps > 500:
        risks.append({
            'type': 'excessive_dependencies',
            'severity': 'HIGH',
            'description': f'依赖数量过多 ({total_deps}个)，增加供应链攻击面'
        })
    elif total_deps > 200:
        risks.append({
            'type': 'many_dependencies',
            'severity': 'MEDIUM',
            'description': f'依赖数量较多 ({total_deps}个)，需要关注'
        })

    # 分析依赖来源多样性
    publishers = set()
    for comp in components:
        # 尝试从包名推断发布者
        name = comp.get('name', '')
        if '/' in name:  # scoped package like @angular/core
            publisher = name.split('/')[0].lstrip('@')
            publishers.add(publisher)

    if len(publishers) > 50:
        risks.append({
            'type': 'diverse_publishers',
            'severity': 'MEDIUM',
            'description': f'依赖来自 {len(publishers)} 个不同发布者，增加风险'
        })

    return {
        'risks': risks,
        'statistics': {
            'total_dependencies': total_deps,
            'direct_dependencies': direct_deps,
            'unique_publishers': len(publishers)
        }
    }

def assess_component_risk(component: Dict) -> Dict:
    """评估单个组件的风险"""
    risks = []
    name = component.get('name', '')
    version = component.get('version', '')

    # 版本风险
    risks.extend(assess_version_risk(component))

    # 命名风险
    risks.extend(assess_naming_risk(component))

    # 计算总体风险等级
    risk_scores = {'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
    total_score = sum(risk_scores.get(risk['severity'], 0) for risk in risks)

    if total_score >= 6:
        overall_risk = 'HIGH'
    elif total_score >= 3:
        overall_risk = 'MEDIUM'
    elif total_score > 0:
        overall_risk = 'LOW'
    else:
        overall_risk = 'MINIMAL'

    return {
        'component': name,
        'version': version,
        'risks': risks,
        'overall_risk': overall_risk,
        'risk_score': total_score
    }

def generate_risk_report(component_risks: List[Dict], dependency_analysis: Dict) -> str:
    """生成风险评估报告"""
    report = "# 🔍 供应链风险评估报告\n\n"

    # 总体统计
    total_components = len(component_risks)
    high_risk = len([c for c in component_risks if c['overall_risk'] == 'HIGH'])
    medium_risk = len([c for c in component_risks if c['overall_risk'] == 'MEDIUM'])
    low_risk = len([c for c in component_risks if c['overall_risk'] == 'LOW'])

    report += f"## 📊 风险概览\n\n"
    report += f"- 总组件数: {total_components}\n"
    report += f"- 🔴 高风险: {high_risk} 个\n"
    report += f"- 🟡 中风险: {medium_risk} 个\n"
    report += f"- 🟢 低风险: {low_risk} 个\n"
    report += f"- ⚪ 最小风险: {total_components - high_risk - medium_risk - low_risk} 个\n\n"

    # 依赖关系分析
    dep_stats = dependency_analysis['statistics']
    report += f"## 📈 依赖关系分析\n\n"
    report += f"- 总依赖数: {dep_stats['total_dependencies']}\n"
    report += f"- 直接依赖: {dep_stats['direct_dependencies']}\n"
    report += f"- 发布者数量: {dep_stats['unique_publishers']}\n\n"

    # 依赖风险
    if dependency_analysis['risks']:
        report += f"### ⚠️ 依赖结构风险\n\n"
        for risk in dependency_analysis['risks']:
            report += f"- **{risk['severity']}**: {risk['description']}\n"
        report += "\n"

    # 高风险组件详情
    high_risk_components = [c for c in component_risks if c['overall_risk'] == 'HIGH']
    if high_risk_components:
        report += f"## 🔴 高风险组件 ({len(high_risk_components)}个)\n\n"
        for comp in high_risk_components[:10]:  # 限制显示数量
            report += f"### {comp['component']}@{comp['version']}\n\n"
            report += f"**风险评分**: {comp['risk_score']}\n\n"
            report += "**风险详情**:\n"
            for risk in comp['risks']:
                report += f"- **{risk['severity']}**: {risk['description']}\n"
            report += "\n"

    # 风险类型统计
    risk_types = {}
    for comp in component_risks:
        for risk in comp['risks']:
            risk_type = risk['type']
            if risk_type not in risk_types:
                risk_types[risk_type] = 0
            risk_types[risk_type] += 1

    if risk_types:
        report += f"## 📋 风险类型统计\n\n"
        sorted_risks = sorted(risk_types.items(), key=lambda x: x[1], reverse=True)
        for risk_type, count in sorted_risks:
            report += f"- {risk_type}: {count} 次\n"
        report += "\n"

    # 建议
    report += f"## 💡 改进建议\n\n"
    if high_risk_components:
        report += "1. **立即处理高风险组件**: 考虑替换或升级高风险依赖\n"
    if medium_risk > total_components * 0.3:
        report += "2. **审查中风险组件**: 评估是否有更安全的替代方案\n"
    if dep_stats['total_dependencies'] > 300:
        report += "3. **减少依赖数量**: 考虑移除不必要的依赖\n"
    report += "4. **定期更新**: 建立定期更新依赖的流程\n"
    report += "5. **监控新漏洞**: 订阅安全公告，及时响应新发现的漏洞\n\n"

    return report

def main():
    if len(sys.argv) != 2:
        print("用法: python3 supply_chain_risk.py <sbom_file.json>")
        sys.exit(1)

    sbom_file = sys.argv[1]
    print(f"🔍 正在评估供应链风险: {sbom_file}")

    # 加载SBOM
    sbom = load_sbom(sbom_file)
    components = sbom.get('components', [])

    print(f"📦 分析 {len(components)} 个组件的供应链风险...")

    # 评估每个组件的风险
    component_risks = []
    for component in components:
        risk_assessment = assess_component_risk(component)
        component_risks.append(risk_assessment)

    # 评估依赖关系风险
    dependency_analysis = assess_dependency_risk(components)

    # 生成报告
    report = generate_risk_report(component_risks, dependency_analysis)
    print(report)

    # 保存报告到文件
    with open('supply-chain-risk-report.md', 'w') as f:
        f.write(report)
    print("📄 详细报告已保存到: supply-chain-risk-report.md")

    # 根据风险等级决定退出码
    high_risk_count = len([c for c in component_risks if c['overall_risk'] == 'HIGH'])
    critical_dependency_risks = len([r for r in dependency_analysis['risks']
                                   if r['severity'] in ['CRITICAL', 'HIGH']])

    if high_risk_count > 5 or critical_dependency_risks > 0:
        print(f"\n⚠️ 发现 {high_risk_count} 个高风险组件和 {critical_dependency_risks} 个严重依赖风险")
        print("建议在部署前解决这些风险")
        # 可以根据政策决定是否失败构建
        # sys.exit(1)

    print("✅ 供应链风险评估完成")

if __name__ == "__main__":
    main()