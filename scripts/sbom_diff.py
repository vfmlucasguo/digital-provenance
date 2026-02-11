#!/usr/bin/env python3
"""
SBOM Diff Tool - Analyze changes between two SBOM files
"""

import json
import sys
from datetime import datetime
from typing import Dict, List, Set, Tuple

def load_sbom(file_path: str) -> Dict:
    """Load SBOM from JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {file_path}")
        sys.exit(1)

def extract_components(sbom: Dict) -> Dict[str, Dict]:
    """Extract components from SBOM as a dictionary keyed by name@version"""
    components = {}
    for comp in sbom.get('components', []):
        name = comp.get('name', 'unknown')
        version = comp.get('version', 'unknown')
        key = f"{name}@{version}"
        components[key] = comp
    return components

def analyze_changes(old_components: Dict, new_components: Dict) -> Dict:
    """Analyze changes between two component sets"""
    old_keys = set(old_components.keys())
    new_keys = set(new_components.keys())

    added = new_keys - old_keys
    removed = old_keys - new_keys
    common = old_keys & new_keys

    # Check for version changes (same package, different version)
    version_changes = []
    old_names = {key.split('@')[0]: key for key in old_keys}
    new_names = {key.split('@')[0]: key for key in new_keys}

    for name in old_names:
        if name in new_names and old_names[name] != new_names[name]:
            old_version = old_names[name].split('@')[1]
            new_version = new_names[name].split('@')[1]
            version_changes.append({
                'name': name,
                'old_version': old_version,
                'new_version': new_version,
                'old_key': old_names[name],
                'new_key': new_names[name]
            })

    return {
        'added': added,
        'removed': removed,
        'common': common,
        'version_changes': version_changes
    }

def check_security_implications(changes: Dict, old_components: Dict, new_components: Dict) -> List[str]:
    """Check for potential security implications"""
    warnings = []

    # Check for new dependencies
    if changes['added']:
        warnings.append(f"⚠️  {len(changes['added'])} new dependencies added - review for security risks")

    # Check for removed dependencies
    if changes['removed']:
        warnings.append(f"ℹ️  {len(changes['removed'])} dependencies removed")

    # Check for version downgrades
    for change in changes['version_changes']:
        old_ver = change['old_version']
        new_ver = change['new_version']
        if old_ver > new_ver:  # Simple string comparison, could be improved
            warnings.append(f"⚠️  Potential downgrade: {change['name']} {old_ver} → {new_ver}")

    # Check for AI-generated component changes
    ai_changes = []
    for key in changes['added']:
        comp = new_components[key]
        if any(prop.get('name') == 'ai:generated' and prop.get('value') == 'true'
               for prop in comp.get('properties', [])):
            ai_changes.append(key)

    if ai_changes:
        warnings.append(f"🤖 {len(ai_changes)} new AI-generated components detected")

    return warnings

def generate_markdown_report(old_file: str, new_file: str, changes: Dict,
                           old_components: Dict, new_components: Dict) -> str:
    """Generate a markdown report of the changes"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    report = f"""# SBOM Diff Report

**Generated**: {timestamp}
**Comparing**: `{old_file}` → `{new_file}`

## Summary

| Change Type | Count |
|-------------|-------|
| Added | {len(changes['added'])} |
| Removed | {len(changes['removed'])} |
| Version Changes | {len(changes['version_changes'])} |
| Unchanged | {len(changes['common'])} |

"""

    # Security warnings
    warnings = check_security_implications(changes, old_components, new_components)
    if warnings:
        report += "## 🔒 Security Analysis\n\n"
        for warning in warnings:
            report += f"- {warning}\n"
        report += "\n"

    # Added components
    if changes['added']:
        report += "## ➕ Added Components\n\n"
        for key in sorted(changes['added']):
            comp = new_components[key]
            comp_type = comp.get('type', 'unknown')
            licenses = [prop['value'] for prop in comp.get('properties', [])
                       if prop.get('name') == 'syft:package:language']
            license_info = f" ({licenses[0]})" if licenses else ""
            report += f"- `{key}` - {comp_type}{license_info}\n"
        report += "\n"

    # Removed components
    if changes['removed']:
        report += "## ➖ Removed Components\n\n"
        for key in sorted(changes['removed']):
            comp = old_components[key]
            comp_type = comp.get('type', 'unknown')
            report += f"- `{key}` - {comp_type}\n"
        report += "\n"

    # Version changes
    if changes['version_changes']:
        report += "## 🔄 Version Changes\n\n"
        for change in sorted(changes['version_changes'], key=lambda x: x['name']):
            report += f"- `{change['name']}`: {change['old_version']} → {change['new_version']}\n"
        report += "\n"

    # AI-generated components summary
    ai_old = sum(1 for comp in old_components.values()
                 if any(prop.get('name') == 'ai:generated' and prop.get('value') == 'true'
                       for prop in comp.get('properties', [])))
    ai_new = sum(1 for comp in new_components.values()
                 if any(prop.get('name') == 'ai:generated' and prop.get('value') == 'true'
                       for prop in comp.get('properties', [])))

    if ai_old > 0 or ai_new > 0:
        report += f"## 🤖 AI-Generated Components\n\n"
        report += f"- Previous: {ai_old} components\n"
        report += f"- Current: {ai_new} components\n"
        report += f"- Change: {ai_new - ai_old:+d}\n\n"

    return report

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 sbom_diff.py <old_sbom.json> <new_sbom.json>")
        sys.exit(1)

    old_file = sys.argv[1]
    new_file = sys.argv[2]

    # Load SBOMs
    old_sbom = load_sbom(old_file)
    new_sbom = load_sbom(new_file)

    # Extract components
    old_components = extract_components(old_sbom)
    new_components = extract_components(new_sbom)

    # Analyze changes
    changes = analyze_changes(old_components, new_components)

    # Generate report
    report = generate_markdown_report(old_file, new_file, changes,
                                    old_components, new_components)

    print(report)

if __name__ == "__main__":
    main()