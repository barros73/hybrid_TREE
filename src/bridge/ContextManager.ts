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
        const stack: { item: any, indent: number }[] = [];

        lines.forEach(line => {
            const match = line.match(/^([│\s├└─]+)\s*(\[[\s/X!]\])\s*(.*)$/);
            if (match) {
                const indent = match[1].length;
                let fullText = match[3];

                let label = fullText;
                let description = "";
                if (fullText.includes(':')) {
                    const parts = fullText.split(':');
                    label = parts[0].trim();
                    description = parts.slice(1).join(':').trim();
                }

                const item = {
                    status: match[2],
                    label: label,
                    description: description,
                    children: []
                };

                while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    root.push(item);
                } else {
                    stack[stack.length - 1].item.children.push(item);
                }
                stack.push({ item, indent });
            }
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
