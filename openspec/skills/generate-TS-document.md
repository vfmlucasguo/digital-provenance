# Technical Specification (TS) Document Generation Guide

## Purpose

Generate a TS document from an OpenSpec change proposal. Focus on **technical implementation details**, **system architecture**, and **developer-facing specifications**.

## Process

### Step 1: Read Required Files

Read in order:
1. **Template**: `@/openspec/docs/template/Prompt - TS_Tech_Design_EN.md`
2. **Change files**:
   - `@/openspec/changes/[change-id]/proposal.md`
   - `@/openspec/changes/[change-id]/design.md`
   - `@/openspec/changes/[change-id]/specs/*/spec.md` (all spec delta files)

**Validation**: Verify `proposal.md` and `design.md` exist. If `[change-id]` not found, inform user and ask for clarification.

### Step 2: Extract Content

**From `proposal.md`**: Project Background, Business Context, System Boundaries, Constraints, Performance/Security requirements

**From `design.md`**: System Architecture, Module Design, Class/Component names and methods, Data Table Design, ER Diagrams, Code Implementation Details, API Design. When extracting implementation details, explicitly capture the split between **Mobility Client** and **Mobility API** sections per the project’s Frontend/Backend guidance.

**From `specs/*/spec.md`**: Requirements needing technical implementation, Scenarios informing design decisions

### Step 3: Generate Document

**CRITICAL**: When reading the template file, **DO NOT include** any metadata sections (such as `**AI Role**`, `**Task Requirements**`, `**Save Output Instructions**`, or similar guidance sections) in the final output document. These sections are for AI guidance only and must be excluded from the generated document. Start the document from the actual content structure.

1. **Structure**: Use template structure from `Prompt - TS_Tech_Design_EN.md`, but **exclude any metadata/guidance sections**. Include ALL content sections (mark as "N/A" if not applicable)

2. **Content Mapping**:
   - Project Background → `proposal.md` (Project Background and Overview)
   - Terms and Definitions → `proposal.md` + `design.md`
   - Constraints → `proposal.md` (Constraints section)
   - System Architecture → `design.md` (include mermaid diagrams, and note which parts run on Mobility Client vs Mobility API)
   - Module Design → `design.md` (Module Design and Implementation) — preserve the Mobility Client / Mobility API subsections already mandated in `design.md`
   - Function Module Design → `design.md` (Function Module Design) — keep repo ownership explicit
   - Data Table Design → `design.md` (include ER diagrams)
   - Code Implementation → `design.md` (Function Development and Implementation) — cite concrete file paths under `src/...` for the Mobility Client or API module paths for the Mobility API
   - API Design → `design.md` (API Design & Integration)

3. **Writing Guidelines**:
   - Use technical language for developers
   - Provide specific details: class names, method signatures, parameters, return types
   - Include code examples where relevant
   - Include all diagrams from `design.md` (architecture, ER, flow charts)
   - Maintain the Mobility Client vs Mobility API structure throughout the TS so owners understand which repository implements each change
   - Define interfaces with complete parameter/return type information
   - Detail database schema: tables, fields, constraints, indexes, relationships
   - Document API endpoints: request/response formats, HTTP methods, data models
   - Include specific file paths and code locations

4. **Save**: `openspec/docs/[change-id]/[change-id] TS v1.0.md` (create directory if needed)

### Step 4: Validate

Before saving, verify:
- ✅ **Metadata sections excluded**: Document does NOT contain any AI guidance metadata sections (e.g., `**AI Role**`, `**Task Requirements**`, `**Save Output Instructions**`)
- ✅ All template content sections present (or marked N/A)
- ✅ Technical details clearly defined with class/method names
- ✅ Diagrams included and properly formatted
- ✅ Database schema complete (tables, fields, constraints, relationships)
- ✅ API endpoints fully documented (request/response formats)
- ✅ Code implementation details include file paths, methods, parameters, return types
- ✅ Template structure followed exactly
- ✅ File path correct: `openspec/docs/[change-id]/[change-id] TS v1.0.md`

After saving, confirm success and inform user of document location.