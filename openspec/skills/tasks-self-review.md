# Tasks Self Review

Purpose: Reduce ambiguity in a change's `tasks.md` by asking targeted clarification questions one at a time, and **IMMEDIATELY** writing answers into `tasks.md` after each answer. This workflow helps ensure tasks are complete, properly sequenced, and implementation ready.

## Scope
- Target change directory: `openspec/changes/<change-id>/`
- Files to read/edit (check existence and update as needed):
  - `openspec/changes/<change-id>/tasks.md` (required)

## Workflow

### Step 1: Identify Change and Load Files
1. Extract or ask for `<change-id>` (must exist in `openspec/changes/`).
2. Load all existing files:
   - `tasks.md` (required)
   - `proposal.md` (if exists; read for context and requirement mapping)
   - `design.md` (if exists; read for context and design decision mapping)
   - All `spec.md` files under `specs/*/` (read for context and requirement mapping)
3. Do not touch unrelated sections.

### Step 2: Scan for Ambiguities
Perform a structured ambiguity scan using this taxonomy. For each category, mark status internally: Clear / Partial / Missing.

- **Requirement Coverage**: Mapping from proposal/design/spec to tasks, missing requirements, acceptance criteria mapping
- **Implementation Tasks**: Task breakdown, logical sequencing, actionable steps, technical dependencies, missing implementation steps
- **Testing Tasks**: Unit testing coverage, integration testing, non-functional testing (performance/security), test data setup
- **Documentation Tasks**: API documentation, user guides, internal documentation, code comments
- **Deployment Tasks**: Deployment procedures, rollback plans, environment configuration, migration tasks
- **Task Clarity**: Task descriptions, acceptance criteria per task, dependencies between tasks, task sequencing
- **Completeness**: All functional areas covered, edge cases addressed, error handling tasks, monitoring/logging tasks

For each category with Partial or Missing status, add a candidate question unless:
- Clarification would not materially change implementation or validation strategy
- Information is better deferred to implementation phase

### Step 3: Generate Question Queue
Generate internally a prioritized queue of up to 5 high-impact clarification questions. Apply constraints:
- Maximum 5 total questions across the whole session
- Each question must be answerable with multiple-choice (2-5 distinct, mutually exclusive options)
- Only include questions whose answers materially impact task decomposition, sequencing, completeness, or implementation approach
- Favor clarifications that reduce downstream rework risk
- If more than 5 categories remain unresolved, select top 5 by (Impact * Uncertainty) heuristic

### Step 4: Sequential Questioning Loop
**CRITICAL**: Ask EXACTLY ONE question at a time. After user answers, **IMMEDIATELY** update ALL relevant files, then continue to next question without interruption.

**Question Format** (multiple-choice only):
```
tasks.md confirm: <question>?

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
   - **Task Addition/Modification** → `tasks.md` (always)
   - **Requirement Coverage** → `tasks.md`
   - **Implementation Approach** → `tasks.md`
   - **Testing Strategy** → `tasks.md`
   - **Deployment/Migration** → `tasks.md`
   - **Task Sequencing** → `tasks.md` (reorder or add dependencies)

3. **Update files IMMEDIATELY** (do this for each file that needs updating):

   **Update `tasks.md`**:
   - Add new tasks if clarification introduces new work
   - Modify existing tasks if clarification changes approach or scope
   - Update task descriptions to reflect clarified requirements
   - Reorder tasks if sequencing changes
   - Add dependencies between tasks if needed
   - Update task acceptance criteria if needed
   - Group related tasks if structure improves

   **Update relevant `spec.md` file(s)** (no longer updated during tasks review)

4. **Preserve structure**:
   - Keep heading order and unrelated content untouched
   - Maintain Markdown structure validity
   - Keep task checklist format consistent
   - Ensure tasks are actionable and testable

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
- Paths to all updated files (`tasks.md` as applicable)
- Sections touched in each file
- Summary of task changes (added/modified/reordered tasks)
- Any remaining open issues (if quota reached with unresolved high-impact categories)

## Behavior Rules
- If no meaningful ambiguities found, respond: "No critical ambiguities detected. Tasks are clear for proceeding."
- If `tasks.md` missing, instruct user to create it first
- Never exceed 5 total asked questions
- Respect user early termination signals ("stop", "done", "proceed")
- If no questions asked due to full coverage, output compact summary then suggest advancing
- **MANDATORY**: Update files after EACH answer, not at the end of all questions
