import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class TreeProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | void> = new vscode.EventEmitter<TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve(element.children || []);
        } else {
            const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
            if (this.pathExists(manifestPath)) {
                return Promise.resolve(this.parseManifest(manifestPath));
            } else {
                vscode.window.showInformationMessage('Workspace has no MASTER_PROJECT_TREE.md');
                return Promise.resolve([]);
            }
        }
    }

    private parseManifest(manifestPath: string): TreeItem[] {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const lines = content.split('\n');
        const rootItems: TreeItem[] = [];
        const stack: { item: TreeItem, indent: number }[] = [];

        // Basic parser for hierarchy like:
        // ├── [X] Config_Manager
        // │   └── [X] .env_parser

        lines.forEach(line => {
            const match = line.match(/^([│\s├└─]+)\s*(\[[\s/X!]\])\s*(.*)$/);
            if (match) {
                const prefix = match[1];
                const status = match[2];
                let fullText = match[3];
                const indent = prefix.length;

                // Handle Label: Description format
                let label = fullText;
                let description = "";
                if (fullText.includes(':')) {
                    const parts = fullText.split(':');
                    label = parts[0].trim();
                    description = parts.slice(1).join(':').trim();
                }

                const item = new TreeItem(
                    label,
                    status,
                    description,
                    vscode.TreeItemCollapsibleState.None
                );

                while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    rootItems.push(item);
                } else {
                    const parent = stack[stack.length - 1].item;
                    parent.addChild(item);
                    parent.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
                }

                stack.push({ item, indent });
            }
        });

        return rootItems;
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }
}

class TreeItem extends vscode.TreeItem {
    public children: TreeItem[] = [];

    constructor(
        public readonly label: string,
        private status: string,
        private funcDescription: string,
        public collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label} - ${this.status}${this.funcDescription ? `\n\n${this.funcDescription}` : ""}`;
        this.description = this.funcDescription || this.status;
        this.iconPath = this.getIcon(status);
    }

    addChild(child: TreeItem) {
        this.children.push(child);
    }

    private getIcon(status: string): vscode.ThemeIcon {
        switch (status) {
            case '[X]': return new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
            case '[/]': return new vscode.ThemeIcon('sync~spin', new vscode.ThemeColor('testing.iconQueued'));
            case '[!]': return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
            case '[ ]': return new vscode.ThemeIcon('circle-outline');
            default: return new vscode.ThemeIcon('question');
        }
    }
}
