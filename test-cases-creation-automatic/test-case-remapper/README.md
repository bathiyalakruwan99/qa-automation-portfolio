# Test Case Remapper

## Purpose

Transforms raw test case exports into platform-specific import formats. The CSV/Markdown files in this folder capture both the source cases and the cleaned versions required by different QA tools.

## Key Areas

- `after fix/` – Finalized CSV imports paired with review notes for GPS Manager, Job Master, Job Groups Search, etc.
- `correct/` – Known-good templates for quick reference (e.g., `Job_Summary_Test_Cases_Import.csv`).
- `need to change/` – Work-in-progress CSV/Markdown combos awaiting cleanup.
- `test_case_csv_prompt.md` – Prompt template used to instruct agents on how to remap cases.

## How to Use

1. Drop the latest exported CSV/Markdown into `need to change/`.
2. Use the prompt file to guide an agent (or manual process) in standardizing headings, IDs, and descriptions.
3. Move the cleaned files into `after fix/` once they meet import requirements.

