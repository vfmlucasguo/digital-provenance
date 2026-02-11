#!/usr/bin/env python3
"""
CI/CD通知系统
支持Slack、Teams、邮件等多种通知方式
"""

import json
import sys
import os
import requests
from datetime import datetime
from typing import Dict, List, Optional

class NotificationManager:
    def __init__(self):
        self.slack_webhook = os.getenv('SLACK_WEBHOOK_URL')
        self.teams_webhook = os.getenv('TEAMS_WEBHOOK_URL')
        self.email_config = {
            'smtp_server': os.getenv('SMTP_SERVER'),
            'smtp_port': os.getenv('SMTP_PORT', '587'),
            'username': os.getenv('SMTP_USERNAME'),
            'password': os.getenv('SMTP_PASSWORD'),
            'from_email': os.getenv('FROM_EMAIL'),
            'to_emails': os.getenv('TO_EMAILS', '').split(',')
        }

    def send_slack_notification(self, message: Dict) -> bool:
        """发送Slack通知"""
        if not self.slack_webhook:
            print("⚠️ Slack webhook未配置")
            return False

        try:
            response = requests.post(self.slack_webhook, json=message, timeout=10)
            response.raise_for_status()
            print("✅ Slack通知发送成功")
            return True
        except Exception as e:
            print(f"❌ Slack通知发送失败: {e}")
            return False

    def send_teams_notification(self, message: Dict) -> bool:
        """发送Teams通知"""
        if not self.teams_webhook:
            print("⚠️ Teams webhook未配置")
            return False

        try:
            response = requests.post(self.teams_webhook, json=message, timeout=10)
            response.raise_for_status()
            print("✅ Teams通知发送成功")
            return True
        except Exception as e:
            print(f"❌ Teams通知发送失败: {e}")
            return False

    def create_deployment_message(self, event_type: str, environment: str,
                                status: str, details: Dict) -> Dict:
        """创建部署通知消息"""

        # 状态图标和颜色
        status_config = {
            'success': {'icon': '✅', 'color': 'good'},
            'failure': {'icon': '❌', 'color': 'danger'},
            'warning': {'icon': '⚠️', 'color': 'warning'},
            'info': {'icon': 'ℹ️', 'color': '#439FE0'}
        }

        config = status_config.get(status, status_config['info'])
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')

        # Slack格式消息
        slack_message = {
            "text": f"{config['icon']} 数字溯源系统 - {event_type}",
            "attachments": [
                {
                    "color": config['color'],
                    "fields": [
                        {"title": "环境", "value": environment, "short": True},
                        {"title": "状态", "value": status.upper(), "short": True},
                        {"title": "分支", "value": details.get('branch', 'unknown'), "short": True},
                        {"title": "提交", "value": details.get('commit', 'unknown')[:8], "short": True},
                        {"title": "时间", "value": timestamp, "short": False}
                    ]
                }
            ]
        }

        # 添加安全扫描结果
        if 'security' in details:
            security = details['security']
            slack_message["attachments"][0]["fields"].extend([
                {"title": "SBOM组件", "value": str(security.get('components', 0)), "short": True},
                {"title": "AI检测", "value": f"{security.get('ai_files', 0)} 个文件", "short": True},
                {"title": "漏洞扫描", "value": security.get('vulnerabilities', '通过'), "short": True}
            ])

        return slack_message

    def create_security_alert(self, scan_results: Dict) -> Dict:
        """创建安全告警消息"""
        critical_count = scan_results.get('critical_vulnerabilities', 0)
        high_count = scan_results.get('high_vulnerabilities', 0)

        if critical_count > 0:
            color = 'danger'
            icon = '🚨'
            urgency = 'CRITICAL'
        elif high_count > 0:
            color = 'warning'
            icon = '⚠️'
            urgency = 'HIGH'
        else:
            color = 'good'
            icon = '✅'
            urgency = 'LOW'

        message = {
            "text": f"{icon} 安全扫描告警 - {urgency}",
            "attachments": [
                {
                    "color": color,
                    "fields": [
                        {"title": "严重漏洞", "value": str(critical_count), "short": True},
                        {"title": "高危漏洞", "value": str(high_count), "short": True},
                        {"title": "许可证违规", "value": str(scan_results.get('license_violations', 0)), "short": True},
                        {"title": "恶意包检测", "value": str(scan_results.get('malicious_packages', 0)), "short": True}
                    ]
                }
            ]
        }

        return message

    def notify_deployment(self, event_type: str, environment: str,
                         status: str, details: Dict):
        """发送部署通知"""
        message = self.create_deployment_message(event_type, environment, status, details)

        # 发送到所有配置的通知渠道
        self.send_slack_notification(message)

        # Teams消息格式转换
        teams_message = self.convert_to_teams_format(message)
        self.send_teams_notification(teams_message)

    def notify_security_alert(self, scan_results: Dict):
        """发送安全告警"""
        message = self.create_security_alert(scan_results)

        self.send_slack_notification(message)

        teams_message = self.convert_to_teams_format(message)
        self.send_teams_notification(teams_message)

    def convert_to_teams_format(self, slack_message: Dict) -> Dict:
        """将Slack格式转换为Teams格式"""
        attachment = slack_message.get('attachments', [{}])[0]
        fields = attachment.get('fields', [])

        # 构建Teams卡片
        teams_message = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": attachment.get('color', '#439FE0'),
            "summary": slack_message.get('text', ''),
            "sections": [
                {
                    "activityTitle": slack_message.get('text', ''),
                    "facts": [
                        {"name": field['title'], "value": field['value']}
                        for field in fields
                    ]
                }
            ]
        }

        return teams_message

def main():
    """主函数 - 处理命令行参数并发送通知"""
    if len(sys.argv) < 4:
        print("用法: python3 notification_system.py <event_type> <environment> <status> [details_json]")
        print("示例: python3 notification_system.py deployment production success '{\"branch\":\"main\",\"commit\":\"abc123\"}'")
        sys.exit(1)

    event_type = sys.argv[1]
    environment = sys.argv[2]
    status = sys.argv[3]
    details = {}

    if len(sys.argv) > 4:
        try:
            details = json.loads(sys.argv[4])
        except json.JSONDecodeError:
            print("❌ 无效的JSON格式")
            sys.exit(1)

    # 从环境变量获取额外信息
    details.update({
        'branch': os.getenv('GITHUB_REF_NAME', details.get('branch', 'unknown')),
        'commit': os.getenv('GITHUB_SHA', details.get('commit', 'unknown')),
        'actor': os.getenv('GITHUB_ACTOR', 'unknown'),
        'workflow': os.getenv('GITHUB_WORKFLOW', 'unknown')
    })

    # 创建通知管理器并发送通知
    notifier = NotificationManager()

    if event_type == 'security_alert':
        notifier.notify_security_alert(details)
    else:
        notifier.notify_deployment(event_type, environment, status, details)

    print(f"✅ 通知发送完成: {event_type} - {environment} - {status}")

if __name__ == "__main__":
    main()