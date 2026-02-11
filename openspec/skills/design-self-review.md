# Design Self Review

Purpose: Reduce ambiguity in a change's `design.md` by asking targeted clarification questions one at a time, and **IMMEDIATELY** writing answers into relevant OpenSpec files (`design.md`, `tasks.md`) after each answer. This workflow helps ensure design decisions are clear, complete, and implementation ready.

## Scope
- Target change directory: `openspec/changes/<change-id>/`
- Files to read/edit (check existence and update as needed):
  - `openspec/changes/<change-id>/design.md` (required)
  - `openspec/changes/<change-id>/tasks.md` (if exists; update if design changes implementation approach)

### Alignment with Frontend / Backend Change Guidance
- `design.md` **must** contain clearly labeled `Mobility Client` and `Mobility API` sections. Every architectural decision, module description, and interface addition must declare which repo owns the work.
- When both repos participate in the same requirement, split the narrative so each subsection details its own code paths, providers/pages/controllers, and cross-repo dependencies.
- Feature toggles, integration points, and shared contracts should document the ownership on both sides instead of leaving it implicit.
- During the review, flag and resolve any gaps where work is described generically without stating whether it belongs to the Mobility Client, Mobility API, or both.

## Workflow

### Step 1: Identify Change and Load Files
1. Extract or ask for `<change-id>` (must exist in `openspec/changes/`).
2. Load all existing files:
   - `design.md` (required)
   - `proposal.md` (if exists; read for context and alignment)
   - All `spec.md` files under `specs/*/` (read for context)
   - `tasks.md` (if exists; read for context)
3. Do not touch unrelated sections.

### Step 2: Scan for Ambiguities
Perform a structured ambiguity scan using this taxonomy. For each category, mark status internally: Clear / Partial / Missing.

- **Technical Architecture Consistency**: Alignment with system architecture, pattern consistency, tech stack compatibility
- **Implementation Detail Sufficiency**: Component definitions, data models, API endpoints, database schemas, code organization
- **Risk and Trade-off Analysis**: Risk identification, mitigation strategies, performance/scalability considerations, trade-off explanations
- **Module Design Completeness**: Required modules/classes/functions, interfaces/contracts, error handling, edge cases
- **Frontend vs Backend Ownership**: Does `design.md` follow the project rule by splitting content into `Mobility Client` and `Mobility API` subsections with concrete file paths per repo?
- **Testability and Verification**: Separation of concerns, unit testability, integration points, verification approach
- **Data Model Clarity**: Entities, attributes, relationships, constraints, lifecycle/state transitions
- **Integration Points**: External dependencies, interfaces, failure modes, protocol assumptions

For each category with Partial or Missing status, add a candidate question unless:
- Clarification would not materially change implementation or validation strategy
- Information is better deferred to implementation phase

### Step 3: Generate Question Queue
Generate internally a prioritized queue of up to 5 high-impact clarification questions. Apply constraints:
- Maximum 5 total questions across the whole session
- Each question must be answerable with multiple-choice (2-5 distinct, mutually exclusive options)
- Only include questions whose answers materially impact architecture, implementation approach, data modeling, test design, or operational readiness
- Favor clarifications that reduce downstream rework risk
- If more than 5 categories remain unresolved, select top 5 by (Impact * Uncertainty) heuristic

### Step 4: Sequential Questioning Loop
**CRITICAL**: Ask EXACTLY ONE question at a time. After user answers, **IMMEDIATELY** update ALL relevant files, then continue to next question without interruption.

**Question Format** (multiple-choice only):
```
design.md confirm: <question>?

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
   - **Technical Architecture/Decisions** → `design.md`
   - **Implementation Approach** → `design.md` + `tasks.md` (if exists)
   - **Data Model** → `design.md`
   - **Module/Component Design** → `design.md` + `tasks.md` (if exists)
   - **Risk/Trade-offs** → `design.md`
   - **Integration/Interfaces** → `design.md`
   - **Testability** → `design.md` + `tasks.md` (if exists; may add testing tasks)

3. **Update files IMMEDIATELY** (do this for each file that needs updating):

   **Update `design.md`**:
   - Technical decisions → Update "Decisions" section
   - Architecture → Update "Technical Design Elements" or relevant sections
   - Data model → Update "Data Table Design" or relevant sections
   - Implementation approach → Update "Module Design and Implementation"
   - Risk/trade-offs → Update "Risks / Trade-offs" section
   - Module design → Update "Module Design and Implementation" or relevant sections
   - Testability → Add or update testability considerations
   - Integration → Update relevant integration sections

   **Update `tasks.md`** (if exists and answer affects implementation):
   - Add new tasks if clarification introduces new work
   - Modify existing tasks if clarification changes approach
   - Update task descriptions to reflect clarified design decisions
   - Add testing tasks if testability considerations change

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
- Paths to all updated files (`design.md`, `tasks.md` as applicable)
- Sections touched in each file
- Any remaining open issues (if quota reached with unresolved high-impact categories)

## Behavior Rules
- If no meaningful ambiguities found, respond: "No critical ambiguities detected. Design is clear for proceeding."
- If `design.md` missing, instruct user to create it first
- Never exceed 5 total asked questions
- Respect user early termination signals ("stop", "done", "proceed")
- If no questions asked due to full coverage, output compact summary then suggest advancing
- **MANDATORY**: Update files after EACH answer, not at the end of all questions
