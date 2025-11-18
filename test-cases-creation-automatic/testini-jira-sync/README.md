# Testiny ↔ Jira Sync Prompts

## Purpose

Reference material for linking Testiny test cases with Jira issues. These prompts document the required metadata, mapping rules, and manual steps so the sync can be reproduced consistently.

## Contents

- `jira_testiny_linking_guide.md` – Step-by-step instructions for configuring the integration.
- `test_case_csv_prompt.md` – Prompt to generate or adjust CSV exports before importing into Jira.
- `cursorrules` – Additional agent scripting rules.
- `t1` – Scratch data/example payload.

## How to Use

1. Read the linking guide to understand required fields and Jira project mappings.
2. Use the prompt file when you need to transform Testiny exports into Jira-friendly CSV.
3. Keep `cursorrules` nearby when running the workflow through an agent or MCP tool.

