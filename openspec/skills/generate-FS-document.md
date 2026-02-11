# Functional Specification (FS) Document Generation Guide

## Purpose

Generate an FS document from an OpenSpec change proposal. Focus on **business functionality** and **user requirements**, not technical implementation details.

## Process

### Step 1: Read Required Files

Read in order:
1. **Template**: `@/openspec/docs/template/Prompt - FS_Prompt_FS_EN.md`
2. **Change files**:
   - `@/openspec/changes/[change-id]/proposal.md`
   - `@/openspec/changes/[change-id]/design.md`
   - `@/openspec/changes/[change-id]/specs/*/spec.md` (all spec delta files)

**Validation**: Verify `proposal.md` and `design.md` exist. If `[change-id]` not found, inform user and ask for clarification.

### Step 2: Extract Content

**From `proposal.md`**: Business Background, Goals, Scope, User Roles, System Interfaces, Performance/Security/Error Handling requirements, UI/UX descriptions

**From `design.md`**: UI/UX elements, User roles, Frontend details (for functional description), Business process flows

**From `specs/*/spec.md`**: Functional requirements (ADDED/MODIFIED sections), User scenarios, Acceptance criteria

### Step 3: Generate Document

**CRITICAL**: When reading the template file, **DO NOT include** the following metadata sections in the final output document:
- `**AI Role**` section and its content
- `**Task Requirements**` section and its content  
- `**Save Output Instructions**` section and its content

These sections are for AI guidance only and must be excluded from the generated document. Start the document from the actual content structure (e.g., "## Output Structure Requirements" or the main document title).

1. **Structure**: Use template structure from `Prompt - FS_Prompt_FS_EN.md`, but **exclude the metadata sections** mentioned above. Include ALL content sections (mark as "N/A" if not applicable)

2. **Content Mapping**:
   - Business Context → `proposal.md` (Business Background, Goals)
   - Scope → `proposal.md` (Scope and Requirements)
   - Functional Requirements → Transform spec delta requirements into business-focused descriptions
   - User Scenarios → Convert technical scenarios into user stories/use cases
   - UI/UX Elements → `design.md` (Frontend Implementation) + `proposal.md` (UI Elements)
   - User Roles → `proposal.md` + `design.md`
   - System Interfaces → `proposal.md` (System Boundaries)
   - Non-functional Requirements → `proposal.md` (Performance, Security, Error Handling)

3. **Writing Guidelines**:
   - Use business-focused language (avoid technical jargon)
   - Write from user/business stakeholder perspective
   - Include diagrams from `design.md` or create new ones for business processes
   - Focus on "what" and "why", not "how"
   - Convert technical requirements into functional requirements

4. **Save**: `openspec/docs/[change-id]/[change-id] FS v1.0.md` (create directory if needed)

### Step 4: Validate

Before saving, verify:
- ✅ **Metadata sections excluded**: Document does NOT contain `**AI Role**`, `**Task Requirements**`, or `**Save Output Instructions**` sections
- ✅ All template content sections present (or marked N/A)
- ✅ Technical details translated to functional requirements
- ✅ Template structure followed exactly
- ✅ Business/user perspective maintained
- ✅ File path correct: `openspec/docs/[change-id]/[change-id] FS v1.0.md`

After saving, confirm success and inform user of document location.