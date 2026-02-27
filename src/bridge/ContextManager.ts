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

        const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        let manifestContent = "MASTER_PROJECT_TREE.md not found.";
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
        const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        if (!fs.existsSync(manifestPath)) return { error: "No manifest" };

        const content = fs.readFileSync(manifestPath, 'utf-8');
        return {
            project: "Hybrid Tree",
            timestamp: new Date().toISOString(),
            manifest: this.parseManifestToJson(content)
        };
    }

    private parseManifestToJson(content: string): any[] {
        const lines = content.split('\n');
        const root: any[] = [];
        const stack: { item: any, depth: number }[] = [];

        lines.forEach(line => {
            // Match standard Markdown bullets with status boxes: "- [ ] Title" or "- **[Title](...)**"
            // Or just a regular bullet "- Title"
            const match = line.match(/^(\s*)(?:-\s*(?:\[([\s/X!])\])?\s*)?(.*?)$/);

            // Skip empty titles or decorative lines
            if (!match || !match[3].trim() || match[3].startsWith('---') || match[3].startsWith('#')) return;

            const indent = match[1].length;
            const status = match[2] || " ";
            const fullText = match[3].replace(/^\*\*\[(.*?)\]\(.*?\)\*\*/, '$1').replace(/^\*\*(.*?)\*\*/, '$1').trim();

            if (!fullText) return;

            let label = fullText;
            let description = "";
            if (fullText.includes(':')) {
                const parts = fullText.split(':');
                label = parts[0].trim();
                description = parts.slice(1).join(':').trim();
            }

            const item = {
                status: `[${status}]`,
                label: label,
                description: description,
                children: []
            };

            // Heuristic for depth: use indent level divided by 2 or 4
            const depth = indent;

            while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
                stack.pop();
            }

            if (stack.length === 0) {
                root.push(item);
            } else {
                stack[stack.length - 1].item.children.push(item);
            }
            stack.push({ item, depth });
        });
        return root;
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
