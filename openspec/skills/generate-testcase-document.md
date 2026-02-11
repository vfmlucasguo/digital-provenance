# Test Case Document Generation Guide

## Purpose

Generate Test Case documents (Excel + Markdown) from OpenSpec change proposals. Both files must contain identical test case content.

## Process Overview

1. Read change proposal files
2. Generate test case data
3. Create Excel file with test cases filled in
4. Create Markdown file with same test cases

## Step 1: Read Required Files

Read these files:
- `@/openspec/docs/template/Prompt - Test Case_Prompt_EN.md` (template guide)
- `@/openspec/changes/[change-id]/proposal.md` (business context)
- `@/openspec/changes/[change-id]/design.md` (technical design)
- `@/openspec/changes/[change-id]/specs/*/spec.md` (requirements and scenarios)

**CRITICAL**: When reading the template file, **DO NOT include** the following metadata sections in any output:
- `# AI Role` section and its content
- `# Task Requirements` section and its content
- `# Format Requirements` section (if it's metadata, not actual content structure)
- `# Output Instructions` section and its content

These sections are for AI guidance only and must be excluded from generated documents. Use only the actual test case content and structure requirements from the template.

## Step 2: Generate Test Case Data

**CRITICAL**: Generate complete test cases covering:
- Valid scenarios (normal paths)
- Invalid scenarios (errors, missing data, permissions)
- Edge cases (boundaries, min/max values)
- Conflict scenarios (concurrency, state transitions)

**For each test case, create:**
- Level 1 Number (integer, sequential)
- Level 1 Test Area Name (major feature)
- Level 2 Number (integer, sequential per Level 1)
- Level 2 Test Area Name (sub-feature/scenario)
- Prerequisites (setup requirements)
- Functional Requirement Section (from spec.md)
- Screen/Program ID/Flow (from design.md)
- Procedure (step-by-step instructions)
- Expected Result (verifiable behavior)
- Test Effort (minutes) (estimate: 5-30 min)

**Leave blank**: Region, Tested By, Pass(Y/N), Test Date, Notes

## Step 3: Create Excel File

**MANDATORY**: You MUST fill the Excel file with test case data using Python and openpyxl library. Copying the template alone is NOT sufficient.

### 3.1 Install Required Tool

**CRITICAL**: Before proceeding, check if `openpyxl` is already installed:
- **First check**: Run `python -c "import openpyxl"` or `pip show openpyxl`
- **Only if not installed**, then install it: `pip install openpyxl` or `python -m pip install openpyxl`
- **DO NOT install if already installed** (to avoid unnecessary operations)
- **DO NOT proceed without openpyxl. DO NOT claim "tool limitations" as an excuse.**

### 3.2 Copy Template

Copy `@/openspec/docs/template/TKE- AP Project Detail Test Case Template.xlsx` to `openspec/docs/[change-id]/[change-id] Test Case v1.0.xlsx`

### 3.3 Write Test Cases to Excel (REQUIRED)

**CRITICAL**: You MUST use Python with openpyxl to write test cases into the Excel file. You MUST execute the script, not just create it.

**Execution Steps**:

1. **Check/Install openpyxl**:
   - First check: `python -c "import openpyxl"` or `pip show openpyxl`
   - **Only if the check fails** (module not found), then install: `pip install openpyxl` or `python -m pip install openpyxl`
   - **If already installed, skip installation** (no need to reinstall)

2. **Create a temporary Python script** (e.g., `temp_generate_testcase.py`) with the following structure:

```python
from openpyxl import load_workbook
import os

# Configuration
# NOTE: This is a temporary script. It will be deleted after execution.
change_id = "[change-id]"  # Replace with actual change-id
template_path = "openspec/docs/template/TKE- AP Project Detail Test Case Template.xlsx"
output_path = f"openspec/docs/{change_id}/{change_id} Test Case v1.0.xlsx"

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Copy template (if not already copied)
import shutil
if not os.path.exists(output_path):
    shutil.copy(template_path, output_path)

# Load workbook
wb = load_workbook(output_path)
ws = wb["Test Case"]

# Fill metadata (from proposal.md)
project_name = "[Extract from proposal.md]"  # Replace with actual project name
project_manager = "[Extract from proposal.md or use 'TBD']"  # Replace with actual PM or "TBD"
ws["E5"] = project_name
ws["E6"] = project_manager

# Clear sample rows (8-11) - remove values, fill, and borders
from openpyxl.styles import PatternFill
for row in range(8, 12):
    for col in range(1, 19):  # Columns A through R
        cell = ws.cell(row=row, column=col)
        cell.value = None
        cell.fill = PatternFill(fill_type=None)
        cell.border = None

# Write test cases starting from row 8
# Replace this with actual test case data from Step 2
test_cases = [
    # Example structure - REPLACE with actual test cases from Step 2
    {
        "level1_num": 1,
        "level1_name": "Feature Name",
        "level2_num": 1,
        "level2_name": "Scenario Name",
        "prerequisites": "Setup requirements",
        "requirement_section": "Requirement ID",
        "screen_program_id": "Screen/Program ID",
        "procedure": "1. Step one\n2. Step two\n3. Step three",
        "expected_result": "Expected behavior",
        "test_effort": 15
    },
    # Add all test cases from Step 2 here
]

# Write each test case as a row (solid borders on populated rows only; empty rows use Excel default format)
from openpyxl.styles import Border, Side
thin = Border(left=Side(style="thin"), right=Side(style="thin"),
              top=Side(style="thin"), bottom=Side(style="thin"))
current_row = 8
for tc in test_cases:
    mapping = {
        3: tc["level1_num"],           # C
        4: tc["level1_name"],          # D
        5: tc["level2_num"],           # E
        6: tc["level2_name"],          # F
        7: tc["prerequisites"],        # G
        8: "",                         # H: Region (blank)
        9: tc["requirement_section"],  # I
        10: tc["screen_program_id"],   # J
        11: tc["procedure"],           # K
        12: tc["expected_result"],     # L
        13: "As expected",             # M
        14: "",                        # N: Tested By
        15: "",                        # O: Pass(Y/N)
        16: "",                        # P: Test Date
        17: "",                        # Q: Notes
        18: tc["test_effort"],         # R
    }
    # Apply solid borders to A-R for rows with content
    for col in range(1, 19):
        cell = ws.cell(row=current_row, column=col)
        if col in mapping:
            cell.value = mapping[col]
        cell.border = thin
    current_row += 1

# Empty rows after the last data row will use Excel default format (no borders applied)

# Save workbook
wb.save(output_path)
print(f"Excel file created with {len(test_cases)} test cases at {output_path}")
```

3. **Execute the script**:
   - Save the script as a temporary `.py` file (e.g., `temp_generate_testcase.py`)
   - **MUST execute it**: Run `python temp_generate_testcase.py` or use `run_terminal_cmd` to execute it
   - **DO NOT skip execution**. The script MUST run to populate the Excel file.

4. **Clean up temporary script** (MANDATORY):
   - **After successful script execution, MUST delete the temporary Python script**
   - Use `delete_file temp_generate_testcase.py` or `run_terminal_cmd` with `rm temp_generate_testcase.py` (Linux/Mac) or `del temp_generate_testcase.py` (Windows)
   - **DO NOT leave temporary script files in the workspace**

5. **Key requirements for the script**:
   - **MUST use openpyxl library** (install if needed: `pip install openpyxl`)
   - **MUST write ALL test cases from Step 2** into the Excel file
   - **MUST preserve template formatting**; when clearing sample rows also clear fill and borders (A8–R11)
   - **MUST fill metadata cells** E5 (Project) and E6 (Project Manager)
   - **MUST clear sample rows** (rows 8-11) before writing, removing values, fill, and borders
   - **MUST write starting from row 8** with all fields mapped to correct columns (C through R)
   - **MUST apply borders dynamically**: populated rows (including columns A-R) use solid borders (thin style); empty rows after the last data row use Excel default format (no borders applied, dynamic - no fixed row count)
   - **MUST save the file** after writing all test cases

6. **Column mapping** (must match exactly):
   - Column C: Level 1 Number
   - Column D: Level 1 Test Area Name
   - Column E: Level 2 Number
   - Column F: Level 2 Test Area Name
   - Column G: Prerequisites
   - Column H: Region (leave blank)
   - Column I: Functional Requirement Section
   - Column J: Screen/Program ID/Flow
   - Column K: Procedure
   - Column L: Expected Result
   - Column M: Actual Result ("As expected")
   - Column N: Tested By (leave blank)
   - Column O: Pass(Y/N) (leave blank)
   - Column P: Test Date (leave blank)
   - Column Q: Notes (leave blank)
   - Column R: Test Effort (minutes)

**CRITICAL REQUIREMENTS**: 
- **You MUST execute this Python script using `run_terminal_cmd` to populate the Excel file.**
- **You CANNOT skip execution or claim "tool limitations".**
- **You CANNOT just create the script file - you MUST run it.**
- **After successful execution, you MUST delete the temporary script file** (e.g., `delete_file temp_generate_testcase.py`)
- **If openpyxl is not installed, check first, then install it only if needed using `pip install openpyxl`, then run the script.**
- **After script execution, verify the Excel file contains actual test case rows with data, not just an empty template.**
- **If the script fails, fix the errors and re-run it until the Excel file is properly populated.**

**VERIFICATION**: After executing the script, verify the Excel file has actual test case rows (not just header row) before proceeding.

## Step 4: Create Markdown File

Create `openspec/docs/[change-id]/[change-id] Test Case v1.0.md` with the same test case data as the Excel file.

**Format**:
```markdown
# Test Cases: [Project Name]

**Project**: [from E5]  
**Project Manager**: [from E6]  
**Change ID**: [change-id]  
**Version**: 1.0

## Test Cases

| Level 1 Number | Level 1 Test  Area Name | Level 2 Number | Level 2 Test Area Name | Prerequisites | Region(Global/Country/Branch) | Functional Requirement Section | Sceen/Program ID/Flow | Procedure | Expected Result  | Actual Result  | Tested By  | Pass(Y/N) | Test Date  | Notes  | Test Effort (minutes) |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
```

**Important**: 
- Use the exact same test case data from Step 2 (same as Excel)
- Match Excel header names exactly (including typos like "Sceen" and trailing spaces)
- Both files must contain identical test case content

## Final Verification

Before completing:
- ✅ **Metadata sections excluded**: Markdown file does NOT contain `# AI Role`, `# Task Requirements`, `# Format Requirements`, or `# Output Instructions` metadata sections
- ✅ Excel file has actual test case rows (not just header)
- ✅ All test cases from Step 2 are in both files
- ✅ Excel metadata (E5, E6) is filled
- ✅ Both files contain the same number of test cases