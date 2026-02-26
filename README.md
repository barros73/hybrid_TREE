# 🌌 Antigravity IDE
**Structural AI Orchestration for VS Code**

> *Transforming flat checklists into a living, multi-dimensional State Tree.*

**Antigravity IDE** is a VS Code extension designed to bridge the gap between Human Intent and AI Execution. It replaces passive Markdown checklists with an interactive, object-oriented **Tree of State** that maps your project's architecture, dependencies, and implementation status in real-time.

---

## 🚀 The Concept

Large-scale AI development often suffers from "Context Drift." As a project grows, simple to-do lists fail to capture the complexity of file relationships, ownership rules (especially in Rust), and architectural hierarchy.

**Antigravity IDE** solves this by treating your project plan not as text, but as a **Dynamic Node Tree**.
It allows you to expand or collapse complexity at will, keeping the AI focused on the leaf it is currently implementing while maintaining awareness of the forest.

---

## ✨ Key Features

### 1. 🌲 The Dynamic State Tree
Navigate your project through a hierarchical sidebar. Each node represents a feature, a file, or a logic block.
- **Collapsible Focus**: Fold completed branches to reduce noise. Expand active branches to drill down into specifics.
- **Visual Status Tracking**: Instantly see the health of your project.

### 2. 🚦 The 4-State Logic Engine
Every node in the tree tracks its lifecycle through four distinct states:
- `[ ]` **Void**: Planned but untouched.
- `[/]` **In Progress**: Currently under AI construction.
- `[X]` **Solidified**: Implemented, verified, and locked.
- `[!]` **Entropy**: Conflict detected (e.g., compilation error, broken dependency, Rust ownership violation).

### 3. 🧠 Deep Context Nodes
Unlike a simple checkbox, every Node is a rich object containing two distinct data layers:
- **Human Layer (Specs)**: What *you* want (e.g., "Create a thread-safe connection pool").
- **AI Layer (Implementation)**: What the *AI* did (e.g., "Used `Arc<Mutex>` with `tokio::sync`").

### 4. 🔄 Bi-Directional Synchronization
Antigravity supports two powerful workflows:
- **Design-First (The Architect)**: Import a `PLAN.md`. The extension parses it into a Logic Tree. You define the specs, the AI fills the code.
- **Code-First (The Archaeologist)**: Point Antigravity at an existing codebase. It scans the file system and AST to reconstruct the Logic Tree, mapping what already exists.

---

## 🛠️ Implementation & Stack

Built for **VS Code** using **TypeScript**, Antigravity IDE is language-agnostic but features specialized "Gravity Compensators" for **Rust**:
- **Crate Mapping**: Automatically aligns tree nodes with `Cargo.toml` workspace members.
- **Ownership Visualization**: Highlights potential borrow-checker conflicts before code is written.

---

## 🔮 Roadmap

1.  **Phase 1**: Markdown Parser & Tree Visualization (Read-Only).
2.  **Phase 2**: State Management & Node Editing (Read/Write).
3.  **Phase 3**: Code-Scanning Engine (Reverse Sync).
4.  **Phase 4**: Direct AI Agent Integration (The "Gardener").
