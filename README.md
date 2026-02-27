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

## Usage

The `hybrid` ecosystem works in three stages to bridge documentation and code.

### 1. Snapshot Code Structure
Run this inside your project directory to extract the physical architecture into a high-fidelity JSON map.
```bash
node /path/to/hybrid-RCP/dist/cli.js export-structure .
```

### 2. Consolidate Manifest (Automatic Tree)
This command automatically parses all Markdown files in `docs/feature_trees/` and creates a consolidated `hybrid-tree.json`. It also detects "orphan" code files not yet documented.
```bash
node /path/to/hybrid-TREE/dist/cli.js consolidate
```

### 3. Connect Requirements to Code
Bridge the logical tree and the physical code structure to generate a deterministic traceability matrix.
```bash
node /path/to/hybrid-MATRIX/dist/cli.js connect -w .
```

---

## License
This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.
