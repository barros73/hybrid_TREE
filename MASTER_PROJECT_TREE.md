# 🗺️ Master Project Tree: hybrid_TREE

**Status Legend:**
- `[ ]` : Empty (To start)
- `[/]` : In Progress (AI working or blocked)
- `[X]` : Finished (Code validated and tested)
- `[!]` : Error/Conflict (e.g., Rust Ownership violation)

---

## 🏗️ Logical Block Architecture (Logical Tree)
root (Hybrid Tree Orchestrator)
├── [X] Project_Initialization (Core)
│   └── [X] manifest_generator: Generates the initial MASTER_PROJECT_TREE.md file.
├── [X] VSCode_Integration (Interface)
│   ├── [X] command_registration: Registers VS Code commands in package.json.
│   ├── [X] tree_view_provider: Implements manifest parsing and visualization.
│   └── [X] state_sync_engine: Synchronizes state between manifest and UI in real-time.
├── [X] AI_Context_Bridge (Logic)
│   ├── [X] context_aggregator: Aggregates manifest and physical structure for AI prompts.
│   ├── [X] reasoning_loop: Identifies the next task and manages priorities.
│   └── [X] manifest_validator: Detects duplicates and integrity violations in the manifest.
└── [ ] Multi_Language_Support (Roadmap)
    ├── [ ] Rust_Ownership_Guard: Visualization of borrow checker and ownership.
    ├── [ ] CPP_Header_Mapper: .hpp/.cpp mapping and memory audit.
    └── [ ] Python_Import_Graph: Import analysis and type hinting suggestions.

---

## 📂 File Structure & Synchronization (Physical Tree)
hybrid_TREE/
├── [X] package.json (Sync: OK)
├── [X] tsconfig.json (Sync: OK)
├── [X] src/
│   ├── [X] extension.ts: Extension entry point and service registration.
│   ├── [X] bridge/
│   │   ├── [X] ContextManager.ts: Context snapshot manager for AI.
│   │   ├── [X] ReasoningLoop.ts: Task suggestion engine and decision logic.
│   │   └── [X] ManifestValidator.ts: Ironclad validation against duplicates.
│   └── [X] provider/
│       └── [X] TreeProvider.ts: Provides data for the Project Tree View.
├── [X] README.md: Technical documentation and user manual.
├── [X] LICENSE: GNU General Public License v3 text.
└── [X] MASTER_PROJECT_TREE.md: State and architecture manifesto.

---

## 📝 Detailed Checklist by Chapters (Action Tree)

### Chapter 1: Foundations
- [X] Repository setup and initial README.
- [X] Base structure recruitment (src/extension.ts).
- [X] Creation of MASTER_PROJECT_TREE.md.

### Chapter 2: VS Code Interface
- [X] TreeView implementation to visualize status.
- [X] Real-time synchronization via FileSystemWatcher.
- [X] Command layout (Toggle, Refresh, Init).

### Chapter 3: AI Bridge & Integrity
- [X] Context Aggregator development (Snapshot).
- [X] Reasoning Loop development (Task Suggestions).
- [X] Manifest Validator development (Duplicate Detection).

### Chapter 4: Integration Interface
- [X] Programmatic JSON Export (hybrid_state_sync.json).
- [X] Advanced support for leaf descriptions.
- [X] Automatic conflict prioritization [!].

---

## 🤖 AI Context Instructions
1. **Priority:** Jules, always work on the first `[/]` node starting from the top.
2. **Update:** Whenever you complete a function in the Target project, change the state from `[/]` to `[X]` in this file.
3. **Block:** If you find a compilation error you cannot resolve, mark the node with `[!]` and stop execution.
