# VIEW OpenSpec Collaboration User Manual

## 1. Introduction

VIEW OpenSpec Collaboration is a specification-driven development methodology designed to improve collaboration efficiency and code quality in VIEW development projects. Through standardized documentation structures, processes, and automation tools, VIEW OpenSpec Collaboration helps team members maintain consistency across requirements, design, implementation, and testing phases.

## 2. Core Concepts

### 2.1 Specification-Driven Development

VIEW OpenSpec Collaboration emphasizes defining clear specifications before coding, using the following three stages:

1. **Specification Stage**: Create `proposal.md`, `design.md`, `tasks.md`, and `spec.md` files, as well as using skills to generate test cases, function specification, technical specification, and to do the corresponding self-review. 
2. **Implementation Stage**: Develop according to specification documents
3. **Archiving Stage**: Move completed changes to the `archive/` directory

### 2.2 File Structure

```
openspec/
├── project.md              # VIEW conventions
├── specs/                  # Current truth - what IS built
│   └── [capability]/       # Single focused capability
│       └── spec.md         # Requirements and scenarios
├── changes/                # Proposals - what SHOULD change
│   ├── [change-name]/
│   │   ├── proposal.md     # Why, what, impact
│   │   ├── tasks.md        # Implementation checklist
│   │   ├── design.md       # Technical decisions
│   │   └── specs/          # Delta changes
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # Completed changes
├── skills/
│   └── [skill-name].md     # Keywords triggerred skills  
├── docs/                   # Documentation - Function Specification, Technical Specification, Test Cases
│   ├── template/ 
│   └── [change-name]/       
```

## 3. Install & Initialize

Prerequisites: Node.js >= 20.19.0

### 3.1 **Install**
```
npm install -g @fission-ai/openspec@latest
```
Verify installation:
```
openspec --version
```

### 3.2 **Initialize**
Run `git pull` to sync with VIEW remote repository, having openspec folder placed at the root of VIEW core directory as well as AGENTS.md file.

## 4. Workflows

### 4.1 Create Change Proposals

**Responsibility**: BA

**Trigger**: When adding new features, modifying existing features, architectural changes, performance optimization, or security-related changes

**Process**:
```
You: Create an OpenSpec change proposal for adding profile search filters by role and team

AI:  I'll create an OpenSpec change proposal for profile filters.
     *Scaffolds openspec/changes/add-profile-filters/ with proposal.md, design.md, tasks.md, spec deltas.*
```
BA should only focus on the `proposal.md` and `spec.md` files aligned with AI agent after one or more rounds of conversation. 
```
You: Can you add acceptance criteria for the role and team filters?

AI:  I'll update the spec delta with scenarios for role and team filters.
     *Edits openspec/changes/add-profile-filters/specs/profile/spec.md and tasks.md.*
```

### 4.2 Clarify Change Proposals (Skill, Optional)

**Responsibility**: BA

**Trigger**: When writing `proposal.md`, perform a self-review to ensure completeness and accuracy

**Process**:
```
You: proposal self-review
```
AI agent will analyze the `proposal.md` and `spec.md` files to identify potential issues and suggest improvements by Q&A, and update the files accordingly. 

### 4.3 Create Test Cases (Skill, Optional)

**Responsibility**: BA

**Trigger**: When `proposal.md` and `spec.md` files are complete, generate test cases

**Process**:
```
You: Generate Test Case [change-id]
```
Test cases will be generated and placed in `openspec/docs/[change-id]`.

### 4.4 Create Function Specification (Skill, Optional)

**Responsibility**: BA

**Trigger**: When `proposal.md` and `spec.md` files are complete, generate Function Specification

**Process**:
```
You: Generate FS [change-id]
```
Function Specification will be generated and placed in `openspec/docs/[change-id]`.

### 4.5 Update Design and Tasks

**Responsibility**: Developer

**Trigger**: When the requirement part is done by BA, developer should take over and continue updating the `design.md` and `tasks.md` files.

**Process**:
```
You: Update design.md to rename the field from "name" to "fullName"
```
Developer should focus on the `design.md` and `tasks.md` files aligned with AI agent after one or more rounds of conversation. 

### 4.6 Review Design (Skill, Optional)

**Responsibility**: Developer

**Trigger**: When writing `design.md`, perform a self-review to ensure technical architecture consistency and implementation detail completeness

**Process**:
```
You: design self-review
```
AI agent will analyze the `design.md` files to identify potential issues and suggest improvements by Q&A, and update the files accordingly. 

### 4.7 Analyze Tasks (Skill, Optional)

**Responsibility**: Developer

**Trigger**: When writing `tasks.md`, perform a self-review to ensure all requirements have corresponding implementation tasks

**Process**:
```
You: tasks self-review
```
AI agent will analyze the `tasks.md` files to identify potential issues and suggest improvements by Q&A, and update the files accordingly. 

### 4.8 Create Technical Specification (Skill, Optional)

**Responsibility**: Developer

**Trigger**: When `design.md` and `tasks.md` files are complete, generate Technical Specification

**Process**:
```
You: Generate TS [change-id]
```
Technical Specification will be generated and placed in `openspec/docs/[change-id]`.

### 4.9 Implement Changes

**Responsibility**: Developer

**Trigger**: When all spec documents are complete and approved after human review, implement the changes

**Process**:
```
You: The specs look good. Let's implement this change.

AI:  I'll work through the tasks in the add-profile-filters change.
     *Implements tasks from openspec/changes/add-profile-filters/tasks.md*
     *Marks tasks complete: Task 1.1 ✓, Task 1.2 ✓, Task 2.1 ✓...*
```
Developer should review and verify the code generated and ensure it is aligned with AI agent after one or more rounds of conversation. 

### 4.10 Archive Changes

**Responsibility**: Developer/Infra

**Trigger**: When the changes are released to live and confirmed working as expected, archive the changes  

**Process**:
```
You: Please archive the change

AI:  I'll archive the add-profile-filters change.
    *Runs: openspec archive add-profile-filters --yes*
     ✓ Change archived successfully. Specs updated. Ready for the next feature!
```
The changes folder will be moved to `openspec/archive/[change-id]`, and the specs folder contents will be updated to reflect the changes. 

## 5. Common Commands

### 5.1 Basic Commands
```bash
# View active changes
openspec list

# View specific change
openspec show [change-id]

# View specification
openspec show [spec-id]

# Validate changes
openspec validate [change-id] --strict

# Archive completed changes
openspec archive <change-id> [--yes|-y]
```

### 5.2 Debug Commands
```bash
# Debug delta parsing
openspec show [change] --json --deltas-only

# Check specific requirement
openspec show [spec] --json -r 1
```

## 6. Troubleshooting

### 6.1 "When creating a change proposal, I find the files generated are not in the correct format"
- Check openspec is installed 'openspec --version'
- Check AGENTS.md is in the root of the VIEW core directory
- This could also happen due to AI agent not reading the AGENTS.md file correctly, for such case, manually input again to let AI agent read the corresponding AGENTS.md file 'please follow the instructions of AGENTS.md to generate the files'

### 6.2 "When creating a change proposal, I find the code is generated directly"
- This could happen due to AI agent not following the AGENTS.md file correctly, for such case, manually input again to let AI agent read the corresponding AGENTS.md file and revert the code 'please follow the instructions of AGENTS.md to generate the files first and revert the code'

### 6.3 "When using keywords to trigger a skill, I find that skill is not triggered, or not working properly"
- This could happen due to AI agent not following the AGENTS.md and skill.md files correctly, for such case, manually input again to let AI agent read the corresponding skill.md file 'please follow the instructions of proposal-self-review.md to review the proposal'

### 6.4 "Change must have at least one delta"
- Check `changes/[name]/specs/` exists with .md files
- Verify files have operation prefixes (## ADDED Requirements)

### 6.5 "Requirement must have at least one scenario"
- Check scenarios use `#### Scenario:` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

### 6.6 "C:\Users\Administrator\AppData\Roaming\npm\openspec.ps1 cannot be loaded because running scripts is disabled on this system"
- Windows PowerShell has execution policy restrictions by default that prevent scripts from being run (including tools installed via npm)
- Execute this command in PowerShell: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 7. Official Site
https://github.com/Fission-AI/OpenSpec

## 8. Conclusion

VIEW OpenSpec collaboration provides a standardized, scalable development process for projects. By following specification-driven approaches, VIEW OpenSpec collaboration ensures code quality, team collaboration, and project maintainability. Team members should follow the guidelines in this manual to fully leverage the benefits provided by VIEW OpenSpec collaboration.