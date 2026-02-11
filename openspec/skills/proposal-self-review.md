# Proposal Self Review

Purpose: Reduce ambiguity in a change's proposal by asking targeted clarification questions one at a time, and **IMMEDIATELY** writing answers into all relevant OpenSpec files (`proposal.md`, `spec.md`, `design.md`, `tasks.md`) after each answer. This workflow helps identify and resolve ambiguities early in development to ensure clear guidance for subsequent work.

## Scope
- Target change directory: `openspec/changes/<change-id>/`
- Files to read/edit (check existence and update as needed):
  - `openspec/changes/<change-id>/proposal.md` (always)
  - `openspec/changes/<change-id>/specs/<capability>/spec.md` (one or more; update all impacted)
  - `openspec/changes/<change-id>/design.md` (if exists)
  - `openspec/changes/<change-id>/tasks.md` (if exists)

## Workflow

### Step 1: Identify Change and Load Files
1. Extract or ask for `<change-id>` (must exist in `openspec/changes/`).
2. Load all existing files:
   - `proposal.md` (required)
   - All `spec.md` files under `specs/*/`
   - `design.md` (if exists)
   - `tasks.md` (if exists)
3. Do not touch unrelated sections.

### Step 2: Scan for Ambiguities
Perform a structured ambiguity scan using this taxonomy. For each category, mark status internally: Clear / Partial / Missing.

- **Business Context & Goals**: Problem definition, objectives, measurable goals
- **Scope & Requirements**: Inclusions/exclusions, testable requirements, missing critical requirements
- **Functional Behavior**: User journeys, scenarios (happy/empty/error/combined), edge cases
- **Non-Functional**: Performance expectations, error messaging, security/input handling, scalability
- **Data Model**: Entities, attributes, relationships, constraints
- **Technical Design**: Architecture decisions, implementation approach, technology choices
- **Integration**: External dependencies, interfaces, failure modes

For each category with Partial or Missing status, add a candidate question unless:
- Clarification would not materially change implementation or validation strategy
- Information is better deferred to planning phase

### Step 3: Generate Question Queue
Generate internally a prioritized queue of up to 5 high-impact clarification questions. Apply constraints:
- Maximum 5 total questions across the whole session
- Each question must be answerable with multiple-choice (2-5 distinct, mutually exclusive options)
- Only include questions whose answers materially impact architecture, data modeling, task decomposition, test design, UX behavior, or operational readiness
- Favor clarifications that reduce downstream rework risk
- If more than 5 categories remain unresolved, select top 5 by (Impact * Uncertainty) heuristic

### Step 4: Sequential Questioning Loop
**CRITICAL**: Ask EXACTLY ONE question at a time. After user answers, **IMMEDIATELY** update ALL relevant files, then continue to next question without interruption.

**Question Format** (multiple-choice only):
```
proposal.md confirm: <question>?

**Recommended:** Option <X> - <1-2 sentence reasoning>

| Option | Description |
|--------|-------------|
| A | <Option A description> |
| B | <Option B description> |
| C | <Option C description> |
| D | <Option D description> (add E if needed, up to 5 total) |

You can reply with the option letter (e.g., "A") or accept by saying "yes"/"recommended".
```

**Rules**:
- Wait for user's reply before proceeding
- No free-form questions or answers; always provide options with one recommended
- Cap total asked at 5
- Never reveal future queued questions in advance
- If no valid questions exist, immediately report no critical ambiguities

### Step 5: Integration After EACH Answer (MANDATORY IMMEDIATE UPDATE)
**ABSOLUTELY CRITICAL**: After user provides answer, you **MUST IMMEDIATELY** update ALL relevant files before asking the next question. Do NOT wait until all questions are answered. This is a hard requirement.

**Execution Flow**:
1. **Parse user answer**: Determine the selected option or accepted recommendation.
2. **Map answer to file updates**: Based on the question category and answer, determine which files need updates:
   - **Business Context/Goals/Scope** → `proposal.md`
   - **Functional Requirements/Scenarios** → `proposal.md` + `spec.md` (all affected)
   - **Technical Design Decisions** → `proposal.md` + `design.md` (if exists)
   - **Implementation Approach** → `proposal.md` + `tasks.md` (if exists)
   - **Non-Functional Requirements** → `proposal.md` + `design.md` (if exists)
   - **Data Model** → `proposal.md` + `design.md` (if exists) + `spec.md` (if affected)
   - **Integration/Interfaces** → `proposal.md` + `design.md` (if exists)

3. **Update files IMMEDIATELY** (do this for each file that needs updating):

   **Update `proposal.md`**:
   - Business context → Update "Business Context & Goals" section
   - Scope → Update "Scope and Requirements" section
   - Functional → Update "What Changes" or "Scope and Requirements"
   - Non-functional → Update "System Design Considerations" with measurable criteria
   - Data model → Update relevant sections with clarified entities/attributes
   - Technical design → Update "System Design Considerations" or add to appropriate section
   - Edge cases → Add to appropriate section

   **Update relevant `spec.md` file(s)** (if functional/scenario-related):
   - Adjust requirements/scenarios to reflect clarification
   - Preserve OpenSpec formatting (use `## ADDED|MODIFIED|REMOVED Requirements`, `#### Scenario:` format)
   - Ensure each requirement has at least one scenario
   - If clarification invalidates earlier statement, replace it (don't duplicate)

   **Update `design.md`** (if exists and answer relates to technical design):
   - Technical decisions → Update "Decisions" section
   - Architecture → Update "Technical Design Elements" or relevant sections
   - Data model → Update "Data Table Design" or relevant sections
   - Implementation approach → Update "Module Design and Implementation"
   - Non-functional → Update "Risks / Trade-offs" or relevant sections

   **Update `tasks.md`** (if exists and answer relates to implementation):
   - Add new tasks if clarification introduces new work
   - Modify existing tasks if clarification changes approach
   - Update task descriptions to reflect clarified requirements

4. **Preserve structure**:
   - Keep heading order and unrelated content untouched
   - Maintain Markdown structure validity
   - Keep each inserted clarification minimal and testable

5. **Save ALL updated files IMMEDIATELY**: Write all files that were modified. Do not batch updates.

6. **Confirm update**: Briefly show which files were updated and which sections were touched (1-2 sentences).

7. **Continue immediately**: After saving, immediately proceed to next question (if any remain) or completion. Do NOT wait for user confirmation.

**CRITICAL REMINDER**: You MUST update files after EACH answer. Do NOT accumulate answers and update at the end. This is a hard requirement.

### Step 6: Completion
Stop when:
- All critical ambiguities resolved, OR
- User signals completion ("done", "good", "no more"), OR
- Reached 5 asked questions

**Report**:
- Number of questions asked & answered
- Paths to all updated files (`proposal.md`, `spec.md`, `design.md`, `tasks.md` as applicable)
- Sections touched in each file
- Any remaining open issues (if quota reached with unresolved high-impact categories)

## Behavior Rules
- If no meaningful ambiguities found, respond: "No critical ambiguities detected. Proposal is clear for proceeding."
- If `proposal.md` missing, instruct user to create it first
- Never exceed 5 total asked questions
- Respect user early termination signals ("stop", "done", "proceed")
- If no questions asked due to full coverage, output compact summary then suggest advancing
- **MANDATORY**: Update files after EACH answer, not at the end of all questions
