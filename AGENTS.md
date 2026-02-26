# Project: digital-provenance

Ionic/Angular app with AI code provenance tracking. Use OpenSpec for spec-driven changes.

## OpenSpec Workflow

- `/opsx:propose <change-id>` — Create a new change proposal (e.g. add-feature-x)
- `/opsx:apply` — Implement tasks from an OpenSpec change
- `/opsx:archive` — Archive completed change and sync specs

Project config: `openspec/config.yaml`

---

## AI Digital Provenance (Mandatory for Code in src/)

When writing or modifying code in `src/`, you **MUST** add provenance markers so AIBOM can track AI-generated lines. These are detected by `scripts/process_aibom.py`.

**CRITICAL**: Apply markers to every file you touch — both **new files** and **existing files you modify** (e.g. `tabs.page.html`, `*-routing.module.ts`). Wrap added/changed code blocks with `@ai-generated-begin` / `@ai-generated-end`. Do not skip markers in modified existing files.

### Scope

- **Markers allowed in**: `src/` business code only
- **Never add markers to**: `node_modules`, `package.json`, `angular.json`, `tsconfig.json`, plugin configs

### Syntax (use exactly)

| Scenario | Syntax | Placement |
|----------|--------|-----------|
| **Whole file** | `// @ai-generated` or `// @generated-ai` | Top of file, in a pure comment line (within first 10 lines) |
| **Block** | `// @ai-generated-begin` … `// @ai-generated-end` | Wrap the AI-written block |
| **Single line** | `// @ai-generated` | At end of line (trailing comment) |

### Path exemption

Paths containing `ai-gen` (e.g. `src/app/services/ai-gen/`) are auto-detected as whole-file AI; no manual markers needed.

### Example

```typescript
async processData() {
  const data = await this.getData();
  // @ai-generated-begin
  const result = data.filter(item => item.active && item.score > 80);
  // @ai-generated-end
  return result;
}
```

### Do not use

- `@ai-start` / `@ai-end` — not supported; use `@ai-generated-begin` / `@ai-generated-end`
- Markers inside string literals or HTML text — they are ignored and cause false positives
