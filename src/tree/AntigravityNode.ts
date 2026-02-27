import * as vscode from 'vscode';

export class AntigravityNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'file' | 'folder' | 'feature' | 'logic_block',
        public readonly status: 'void' | 'in_progress' | 'solidified' | 'entropy',
        public readonly description?: string
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label} (${this.status})`;
        this.description = description;

        // Set icon based on status
        this.iconPath = this.getIconForStatus(status);
    }

    private getIconForStatus(status: string): vscode.ThemeIcon {
        switch (status) {
            case 'in_progress':
                return new vscode.ThemeIcon('sync~spin');
            case 'solidified':
                return new vscode.ThemeIcon('check');
            case 'entropy':
                return new vscode.ThemeIcon('warning');
            case 'void':
            default:
                return new vscode.ThemeIcon('circle-outline');
        }
    }
}
