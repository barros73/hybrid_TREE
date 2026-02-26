# 🛠️ Antigravity IDE: Implementation Plan

This document outlines the technical roadmap for building the **Antigravity IDE** VS Code extension.

---

## 🏗️ Phase 1: Extension Scaffold & Core Environment
**Goal:** Establish a working VS Code extension base that can activate and display a basic Tree View.

### 1.1 Project Initialization
- [ ] Initialize a new VS Code extension using `yo code` (TypeScript + Webpack).
- [ ] Configure `package.json`:
    - Define `activationEvents` (e.g., `onView:antigravityTree`).
    - Register the `antigravityTree` view container in the Activity Bar.
- [ ] Set up ESLint and Prettier.

### 1.2 Tree Data Provider (The Skeleton)
- [ ] Implement `TreeDataProvider` interface (`vscode.TreeDataProvider`).
- [ ] Create a basic `AntigravityNode` class extending `vscode.TreeItem`.
- [ ] Register the provider in `extension.ts` to populate the sidebar.
- [ ] Add dummy data (static JSON) to verify the tree renders correctly.

---

## 🧠 Phase 2: The Data Core (State Machine)
**Goal:** Define the robust data structure that powers the "Antigravity" logic.

### 2.1 Node Schema Definition
- [ ] Define the `TreeNode` interface:
    ```typescript
    interface TreeNode {
        id: string;
        label: string;
        type: 'file' | 'folder' | 'feature' | 'logic_block';
        status: 'void' | 'in_progress' | 'solidified' | 'entropy';
        specs: string;        // Human intent
        ai_notes: string;     // AI implementation details
        children: TreeNode[];
    }
    ```

### 2.2 State Logic
- [ ] Implement state transition rules:
    - A parent node cannot be `[X]` (Solidified) if any child is `[!]` (Entropy).
    - Marking a parent `[/]` (In Progress) should visually affect children.

---

## 🖥️ Phase 3: UI Implementation
**Goal:** Create the interactive visual layer for the user.

### 3.1 Advanced Sidebar (Tree View)
- [ ] **Icons**: Add custom SVG icons for each state:
    - `[ ]` Empty circle / Square.
    - `[/]` Spinner or Half-filled circle.
    - `[X]` Green checkmark.
    - `[!]` Red warning triangle.
- [ ] **Context Menu**: Right-click actions on nodes:
    - "Mark as Done"
    - "Add Child Node"
    - "Delete Node"

### 3.2 Webview Panel (Node Details)
- [ ] Create a Webview that opens when a node is clicked.
- [ ] **Split View Interface**:
    - **Left Column (Specs)**: Editable Markdown area for user requirements.
    - **Right Column (AI Implementation)**: Read-only (or editable) area for AI notes.
- [ ] Implement message passing (`postMessage`) between the Webview and the Extension Host to save changes.

---

## ⚙️ Phase 4: The "Antigravity" Engines
**Goal:** Build the logic that connects the Tree to the real world (Files and Markdown).

### 4.1 The Markdown Parser (Design-First)
- [ ] Implement a parser that reads a `PROJECT_MAP.md` (or similar).
- [ ] Convert indented lists and checkboxes into the internal `TreeNode` structure.
- [ ] Handle special markers (e.g., `[!]` in text becomes Entropy state).

### 4.2 The Code Scanner (Code-First - *Rust Focused*)
- [ ] **File System Mapper**: Recursively scan the workspace folder.
- [ ] **Rust Analyzer Hook**:
    - Detect `Cargo.toml` to identify crate structure.
    - Map `mod.rs` and `lib.rs` to tree nodes.
- [ ] Auto-generate a `TreeNode` hierarchy from the file system.

---

## 🤖 Phase 5: AI Integration Hooks
**Goal:** Prepare the system for AI agents (Copilot/ChatGPT/Custom).

### 5.1 Context Export
- [ ] "Copy Context" command: Serializes the current active branch (specs + code path) into a prompt-ready format.
- [ ] "Update from AI": Accept a JSON payload from an AI to update the status or `ai_notes` of a node.

---

## 🧪 Testing Strategy
- **Unit Tests**: Test the State Machine logic (transitions and constraints).
- **Integration Tests**: Verify the Markdown Parser against complex nested lists.
- **UI Tests**: Ensure the Tree View renders and updates correctly on command.
