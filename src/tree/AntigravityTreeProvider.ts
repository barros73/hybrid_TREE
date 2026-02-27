import * as vscode from 'vscode';
import { AntigravityNode } from './AntigravityNode';

export class AntigravityTreeProvider implements vscode.TreeDataProvider<AntigravityNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<AntigravityNode | undefined | void> = new vscode.EventEmitter<AntigravityNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<AntigravityNode | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: AntigravityNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: AntigravityNode): Thenable<AntigravityNode[]> {
        if (!element) {
            // Root elements
            return Promise.resolve([
                new AntigravityNode('Core', vscode.TreeItemCollapsibleState.Expanded, 'folder', 'solidified', 'Framework Core'),
                new AntigravityNode('Features', vscode.TreeItemCollapsibleState.Collapsed, 'folder', 'in_progress', 'User facing features'),
                new AntigravityNode('API', vscode.TreeItemCollapsibleState.Collapsed, 'folder', 'void', 'External APIs')
            ]);
        }

        // Dummy children for demonstration
        if (element.label === 'Core') {
             return Promise.resolve([
                new AntigravityNode('AuthService', vscode.TreeItemCollapsibleState.None, 'logic_block', 'solidified'),
                new AntigravityNode('Database', vscode.TreeItemCollapsibleState.None, 'logic_block', 'solidified')
            ]);
        }

        if (element.label === 'Features') {
             return Promise.resolve([
                new AntigravityNode('Login', vscode.TreeItemCollapsibleState.None, 'feature', 'in_progress'),
                new AntigravityNode('Dashboard', vscode.TreeItemCollapsibleState.None, 'feature', 'entropy', 'Broken tests')
            ]);
        }

        return Promise.resolve([]);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
