# hybrid_TREE
An AI-driven Project Orchestrator that uses a tree-based hierarchical manifest to synchronize architecture, dependencies, and codebase across decoupled environments.

## The Concept
Transforming a passive checklist into a "State Tree" structure (inspired by the Linux `tree` command) allows the AI to instantly map the project topology and understand its current location and context.

The `MASTER_PROJECT_TREE.md` file acts as the "State Manifest," serving as a bridge between the developer's intent and the AI's execution.

## Manifest Structure: MASTER_PROJECT_TREE.md

### Status Legend:
- `[ ]` : Empty (To start)
- `[/]` : In Progress (AI working or blocked)
- `[X]` : Finished (Code validated and tested)
- `[!]` : Error/Conflict (e.g., Rust Ownership violation)

---

### 🏗️ Logical Block Architecture (Logical Tree)
```text
root (Core)
├── [X] Config_Manager (Core_Subblock)
│   └── [X] .env_parser
├── [/] Network_Engine (Subpart)
│   ├── [X] Socket_Listener
│   ├── [/] Protocol_Handler [! Ownership Conflict on Core_State]
│   └── [ ] Encryption_Layer
└── [ ] UI_Renderer (Subpart)
    ├── [ ] Terminal_View
    └── [ ] Web_Dashboard
```

---

### 📂 File Structure & Synchronization (Physical Tree)
```text
target_project/
├── [X] Cargo.toml (Sync: OK)
├── src/
│   ├── [X] main.rs
│   ├── [X] lib.rs (Core)
│   └── network/
│       ├── [X] mod.rs
│       ├── [/] handler.rs (AI is writing...)
│       └── [ ] crypto.rs
└── docs/
    └── [X] core_architecture.md
```

---

### 📝 Detailed Checklist by Chapters (Action Tree)

#### Chapter 1: Core Foundations
- [X] Definition of the `State` struct in Core.
- [X] Implementation of the `Default` trait for Core.
- [ ] Global logger setup.

#### Chapter 2: Subpart Integration
- [/] Connection Network_Engine -> Core (via Arc<Mutex>).
- [!] Bug Resolution: `Protocol_Handler` cannot access Core if `Socket_Listener` is active.
- [ ] Integration test between the first two blocks.

---

## 🤖 AI Context Instructions
1. **Priority:** Jules (or your AI agent), always work on the first `[/]` node starting from the top.
2. **Update:** Whenever you complete a function in the Target project, change the state from `[/]` to `[X]` in this file.
3. **Block:** If you find a compilation error you cannot resolve, mark the node with `[!]` and stop execution.

## Why this structure works for AI?
1. **Multi-level Vision:** The AI simultaneously sees the logic (dependencies), the files (where to write), and the tasks (what to do).
2. **"Tree" command as Index:** Using tree symbology (`├──`, `└──`) allows the AI to use tree-search algorithms to navigate the project efficiently.
3. **Point of Conflict:** Marking `[!]` helps the AI immediately understand that the problem is architectural, not just a syntax error.
4. **Multi-Tree:** You can have trees for logic, documentation, and tests all in the same file.

## Technical Description
**Structural AI Orchestration for Complex Systems.**
This project is a decoupled Project Manager Sidecar designed to solve context-drift in AI-assisted development. By implementing a Multi-Tree State Machine (Logic Tree, Physical Tree, and Dependency Tree), it provides a source of truth that guides the AI through complex architectures.

While optimized for Rust’s Ownership and Module system, the core engine is language-agnostic, allowing the same hierarchical checklist logic to be applied to Python, C, or any modular codebase.

## Features
- **Decoupled Architecture**: Operates as a standalone "Brain" project that observes and commands a separate "Worker" codebase.
- **Tree-State Synchronization**: Tracks task status: `[ ]` Empty, `[/]` In-Progress, `[X]` Completed, and `[!]` Conflict.
- **Rust Ownership Guard**: Helps visualize data-access conflicts between Core and Sub-blocks.
- **Automated Dependency Alignment**: Direct mapping between the manifest and project configuration files.

## Technical Glossary
| Term | English |
| :--- | :--- |
| Senza legami / Separato | Decoupled / Standalone |
| Albero delle dipendenze | Dependency Tree |
| Ponte / Orchestratore | Bridge / Orchestrator |
| Indipendente dal linguaggio | Language-Agnostic |
| Conflitto di possesso (Rust) | Ownership Conflict |
| Manifesto dello stato | State Manifest |

## 🏁 Getting Started

### Prerequisites
- **Node.js**: Version 16.x or higher.
- **npm**: Standard Node package manager.

### 🚀 Quick Installation
```bash
curl -sSL https://raw.githubusercontent.com/barros73/hybrid-BIM/main/install.sh | bash
```

---

## 🛠️ CLI Reference & Operational Manual

This module exposes a command-line interface directly usable from the project root.

### Global Options
All commands support the hidden `--ai-format` flag. When appended, it suppresses human-readable console outputs (emojis, formatting) to return strictly parseable JSON payloads. This is essential for Machine-To-Machine orchestration and CI/CD pipelines.

### Usage
```bash
node dist/cli.js <command> [options]
```

### 1. `consolidate` (Core Build Command)
**Merges and compiles fragmented feature trees into a master manifest.**

This is the most critical operation in Layer 1. It gathers all human-written intent and translates it into a rigid, machine-readable semantic state.

*   **Behavior:**
    *   Scans the `docs/feature_trees/` directory for all Markdown files (excluding `00_index.md`).
    *   Injects file-markers and merges their contents with the `MASTER_PROJECT_TREE.md`.
    *   Flattens complex hierarchical lists into a computable JSON object.
    *   Performs **Orphan Code Detection**: If `hybrid-rcp.json` (Layer 3) exists in the `.hybrid/` folder, it cross-references documented requirements against actual scanned code to discover legacy or undocumented structural blocks.

*   **Artifacts Generated:**
    *   📁 `.hybrid/FULL_BIM_MANIFEST.md` (Human/AI Comprehensive Read)
    *   📁 `.hybrid/hybrid-tree.json` (Machine State Representation)

*   **Example Usage:**
    ```bash
    node dist/cli.js consolidate
    ```

### 2. `export`
**Passively exports the current logical state to JSON.**

*   **Behavior:**
    *   Reads the current state manifest context without triggering merging or orphan detection.
    *   Updates the `.hybrid/hybrid-tree.json` payload directly.
    *   Useful for fast state re-evaluations without the heavy lifting of the consolidate compilation.

*   **Example Usage:**
    ```bash
    node dist/cli.js export --ai-format
    ```

### 3. `snapshot`
**Displays an interactive summary of the current project state.**

*   **Behavior:**
    *   Reads both the logical boundaries (from Tree parsing) and the physical system boundaries (if RCP data is available).
    *   Outputs a terminal-friendly view of logical/physical metrics (e.g., Number of Requirements vs Number of Code Nodes).

*   **Example Usage:**
    ```bash
    node dist/cli.js snapshot
    ```

---

## 📜 Global Ecosystem Logging (Audit Trail)

To ensure zero loss of context, especially when dealing with AI prompt orchestrators that iterate multiple times a day, `hybrid-TREE` features persistent action logging.

Execution of `consolidate`, `export`, and `snapshot` appends a timestamped record detailing exactly what was processed, the paths of generated artifacts, and critically, the count of **Orphans detected**.

**Log Location:**
**`📁 .hybrid/tree-report.log`**

**Example Log Entry:**
```text
[2026-02-28T14:41:00.000Z] COMMAND: consolidate
--- HYBRID TREE CONSOLIDATION REPORT ---
✅ Consolidated manifest: /project/.hybrid/FULL_BIM_MANIFEST.md
✅ Exported JSON: /project/.hybrid/hybrid-tree.json
⚠️  Found 7 potential undocumented code modules (Orphans).
----------------------------------------
```

---

## Ecosystem Integration
TREE provides the "Logical Layer" (Logic) for the Hybrid ecosystem:
1. **Define Intent**: Use `hybrid-GENESIS export` to generate the initial map.
2. **Consolidate**: Run `hybrid-tree consolidate` to create the checklist.
3. **Analyze Reality**: Run `hybrid-rcp export-structure .` to map the code.
4. **Bridge**: Use `hybrid-MATRIX bridge` to generate the Next Best Action.

---

*Copyright 2026 Fabrizio Baroni. Licensed under the Apache License, Version 2.0.*
