import * as vscode from 'vscode';
import { AntigravityTreeProvider } from './tree/AntigravityTreeProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "antigravity-ide" is now active!');

    const treeProvider = new AntigravityTreeProvider();
    vscode.window.registerTreeDataProvider('antigravityTree', treeProvider);

    let disposable = vscode.commands.registerCommand('antigravity.refreshEntry', () => treeProvider.refresh());

    context.subscriptions.push(disposable);
}

export function deactivate() {}
