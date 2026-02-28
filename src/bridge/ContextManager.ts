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
import * as fs from 'fs';
import * as path from 'path';

export class ContextManager {
    constructor(private workspaceRoot: string | undefined) { }

    public async getContextSnapshot(): Promise<string> {
        if (!this.workspaceRoot) {
            return "No workspace opened.";
        }

        // User reads MASTER_PROJECT_TREE.md from the root.
        const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        let manifestContent = "MASTER_PROJECT_TREE.md not found in workspace root.";
        if (fs.existsSync(manifestPath)) {
            manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        }

        const projectStructure = await this.getPhysicalStructure(this.workspaceRoot);

        return `
# Hybrid Tree: AI Context Snapshot
Generated: ${new Date().toISOString()}

## 🗺️ Logical Manifest (MASTER_PROJECT_TREE.md)
\`\`\`markdown
${manifestContent}
\`\`\`

## 📂 Physical Project Structure
\`\`\`text
${projectStructure}
\`\`\`
`;
    }

    public getJsonContext(): any {
        if (!this.workspaceRoot) return { error: "No workspace" };

        // Let's also support reading from GENESIS_EXPORT_TREE.md
        let manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        if (!fs.existsSync(manifestPath)) {
            manifestPath = path.join(this.workspaceRoot, 'GENESIS_EXPORT_TREE.md');
        }
        if (!fs.existsSync(manifestPath)) return { error: "No manifest found in root directory" };

        const content = fs.readFileSync(manifestPath, 'utf-8');
        return {
            project: "Hybrid Tree",
            timestamp: new Date().toISOString(),
            manifest: this.parseManifestToJson(content)
        };
    }

    private parseManifestToJson(content: string): any[] {
        const lines = content.split('\n');
        const flatNodes: any[] = [];
        const stack: { item: any, depth: number, childCount: number }[] = [];

        let currentHeaderDepth = 0;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('---')) return;

            // 1. Skip H1 completely
            if (trimmed.match(/^#\s+(.*)$/)) {
                return;
            }

            // 2. Handle Descriptions (Blockquotes)
            const bqMatch = line.match(/^(\s*)>\s+(.*)$/);
            if (bqMatch) {
                if (stack.length > 0) {
                    const descText = bqMatch[2].trim();
                    const lastItem = stack[stack.length - 1].item;
                    lastItem.description = lastItem.description
                        ? lastItem.description + " " + descText
                        : descText;

                    const ownershipMatch = descText.match(/\[(Shared|Mut|Owned)\]/i);
                    if (ownershipMatch && !lastItem.ownership) {
                        lastItem.ownership = ownershipMatch[1];
                        lastItem.description = lastItem.description.replace(ownershipMatch[0], '').trim();
                    }
                }
                return;
            }

            let indent = 0;
            let status = " ";
            let label = "";
            let fullText = "";
            let ownership = undefined;

            // 3. Handle Headers
            const headerMatch = line.match(/^(#{2,})\s+(.*)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                indent = (level - 2) * 1000; // Large multiplier to separate headers from lists if needed, but depth logic is key
                currentHeaderDepth = (level - 2) * 4;
                fullText = headerMatch[2];
                status = " ";
            } else {
                // 4. Handle List Items
                const listMatch = line.match(/^(\s*)(?:-\s*(?:\[([\s/X!])\])?\s*)?(.*?)$/);
                if (!listMatch || !listMatch[3].trim()) return;

                indent = listMatch[1].length + currentHeaderDepth + 4;
                status = listMatch[2] || " ";
                fullText = listMatch[3];
            }

            fullText = fullText.replace(/^\*\*\[(.*?)\]\(.*?\)\*\*/, '$1').replace(/^\*\*(.*?)\*\*/, '$1').trim();
            if (!fullText) return;

            const ownershipMatch = fullText.match(/\[(Shared|Mut|Owned)\]/i);
            if (ownershipMatch) {
                ownership = ownershipMatch[1];
                fullText = fullText.replace(ownershipMatch[0], '').trim();
            }

            label = fullText;
            let description = "";
            if (fullText.includes(':')) {
                const parts = fullText.split(/:(.*)/s);
                label = parts[0].trim();
                description = parts[1] ? parts[1].trim() : "";
            }

            // Re-evaluate indent logic for strict hierarchy
            while (stack.length > 0 && stack[stack.length - 1].depth >= indent) {
                stack.pop();
            }

            const parent = stack.length > 0 ? stack[stack.length - 1] : null;
            if (parent) parent.childCount++;

            const currentIdx = parent ? `${parent.item.index}.${parent.childCount}` : `${flatNodes.filter(n => !n.parentId).length + 1}`;

            const semanticId = label.toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');

            const item: any = {
                id: semanticId,
                index: currentIdx,
                parentId: parent ? parent.item.index : null,
                status: `[${status}]`,
                label: label,
                description: description
            };

            if (ownership) {
                item.ownership = ownership;
            }

            flatNodes.push(item);
            stack.push({ item, depth: indent, childCount: 0 });
        });

        return flatNodes;
    }

    private async getPhysicalStructure(root: string): Promise<string> {
        // Simple recursive simplified tree view
        const lines: string[] = [];
        this.walk(root, "", lines);
        return lines.join('\n');
    }

    private walk(dir: string, prefix: string, lines: string[]): void {
        const files = fs.readdirSync(dir);
        files.forEach((file, index) => {
            if (file === 'node_modules' || file === '.git' || file === 'out') return;

            const filePath = path.join(dir, file);
            const isLast = index === files.length - 1;
            const marker = isLast ? "└── " : "├── ";
            const stats = fs.statSync(filePath);

            lines.push(`${prefix}${marker}${file}`);

            if (stats.isDirectory()) {
                this.walk(filePath, prefix + (isLast ? "    " : "│   "), lines);
            }
        });
    }
}
