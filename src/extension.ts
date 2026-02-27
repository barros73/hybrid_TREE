/*
 * Hybrid-TREE - The Semantic Project Cartographer
 * Copyright 2026 Fabrizio Baroni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TreeProvider } from './provider/TreeProvider';
import { ContextManager } from './bridge/ContextManager';
import { ReasoningLoop } from './bridge/ReasoningLoop';

/**
 * Activates the extension.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hybrid-tree" is now active!');

    const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    const treeProvider = new TreeProvider(workspaceRoot);
    vscode.window.registerTreeDataProvider('hybridTree', treeProvider);

    const contextManager = new ContextManager(workspaceRoot);
    const reasoningLoop = new ReasoningLoop(workspaceRoot);

    let disposableInit = vscode.commands.registerCommand('hybridTree.init', () => {
        vscode.window.showInformationMessage('Hybrid Tree: Initializing...');
        treeProvider.refresh();
    });

    let disposableToggle = vscode.commands.registerCommand('hybridTree.toggleState', () => {
        vscode.window.showInformationMessage('Hybrid Tree: Toggling State...');
    });

    let disposableRefresh = vscode.commands.registerCommand('hybridTree.refreshEntry', () => {
        treeProvider.refresh();
    });

    let disposableCopyContext = vscode.commands.registerCommand('hybridTree.copyContext', async () => {
        const snapshot = await contextManager.getContextSnapshot();
        await vscode.env.clipboard.writeText(snapshot);
        vscode.window.showInformationMessage('Hybrid Tree: AI Context copied to clipboard!');
    });

    let disposableSuggest = vscode.commands.registerCommand('hybridTree.suggestNextStep', async () => {
        const suggestion = await reasoningLoop.suggestNextStep();
        vscode.window.showInformationMessage(`Hybrid Tree Suggestion: ${suggestion}`);
    });

    let disposableExport = vscode.commands.registerCommand('hybridTree.exportJson', async () => {
        if (!workspaceRoot) return;
        const hybridDir = path.join(workspaceRoot, '.hybrid');
        if (!fs.existsSync(hybridDir)) fs.mkdirSync(hybridDir);

        const jsonContext = contextManager.getJsonContext();
        const exportPath = path.join(hybridDir, 'hybrid_state_sync.json');
        fs.writeFileSync(exportPath, JSON.stringify(jsonContext, null, 2));
        vscode.window.showInformationMessage(`Hybrid Tree: Project state exported to hybrid_state_sync.json`);
    });

    context.subscriptions.push(disposableInit);
    context.subscriptions.push(disposableToggle);
    context.subscriptions.push(disposableRefresh);
    context.subscriptions.push(disposableCopyContext);
    context.subscriptions.push(disposableSuggest);
    context.subscriptions.push(disposableExport);

    // File Watcher for State Sync
    if (workspaceRoot) {
        const pattern = new vscode.RelativePattern(workspaceRoot, 'MASTER_PROJECT_TREE.md');
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);

        watcher.onDidChange(() => treeProvider.refresh());
        watcher.onDidCreate(() => treeProvider.refresh());
        watcher.onDidDelete(() => treeProvider.refresh());

        context.subscriptions.push(watcher);
    }
}

/**
 * Deactivates the extension.
 */
export function deactivate() { }
