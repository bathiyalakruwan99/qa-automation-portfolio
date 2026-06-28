# QA Graph Tool (Architecture Overview)

> Synthetic example for portfolio demonstration. No private source code is included.

## Purpose

A local-only visualisation tool that renders the QA operating model as an interactive graph. It reads the project's agent, skill, rule, and memory structure and displays nodes and relationships in a browser-based UI.

## What It Shows

- **Agent nodes**: each specialised QA agent as a node, grouped by category.
- **Skill edges**: links between agents and the shared skills they use.
- **Rule edges**: links between agents and the quality rules they follow.
- **Memory edges**: links between agents and the memory categories they read or write.
- **Flow overlay**: the end-to-end QA orchestration sequence as a directed path.

## Architecture

```
qa-graph-tool/
├── api/           # Node.js + TypeScript API server
│   ├── src/        # Reads project structure, returns graph JSON
│   ├── Dockerfile
│   └── package.json
├── web/           # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api/       # API client
│   │   ├── components/ # Graph rendering components
│   │   ├── hooks/      # Data fetching hooks
│   │   ├── pages/      # Page layouts
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml  # Orchestrates api + web
```

## How to Run (Conceptual)

```bash
cd qa-graph-tool
docker-compose up --build
# API: http://localhost:3001
# Web: http://localhost:5173
```

The API mounts the project root as a read-only volume, scans the agent/skill/rule/memory structure, and returns a graph JSON. The web frontend renders it as an interactive force-directed graph.

## Tech Stack

| Layer | Technology |
| --- | --- |
| API | Node.js, Express, TypeScript |
| Web | React, Vite, Tailwind CSS |
| Container | Docker Compose |
| Graph rendering | Force-directed layout in browser |

## Portfolio Note

Only the architecture is documented here. The actual implementation source code is private and not included in this public portfolio. The tool is described to show the breadth of the QA operating model tooling.

## Confidentiality

No private source code, API endpoints, internal paths, or proprietary logic is exposed. This README describes the tool's purpose and architecture at a high level only.
