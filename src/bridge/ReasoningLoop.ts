import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ManifestValidator } from './ManifestValidator';

export class ReasoningLoop {
    private validator: ManifestValidator;

    constructor(private workspaceRoot: string | undefined) {
        this.validator = new ManifestValidator(workspaceRoot);
    }

    public async suggestNextStep(): Promise<string> {
        if (!this.workspaceRoot) return "No workspace opened.";

        // Priority 0: Manifest Integrity (Duplicates/Overlaps)
        const issues = this.validator.validate();
        if (issues.length > 0) {
            const firstIssue = issues[0];
            return `INTEGRITY ERROR: ${firstIssue.message}. Resolve this duplicate before proceeding.`;
        }

        const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        if (!fs.existsSync(manifestPath)) return "Manifest (MASTER_PROJECT_TREE.md) not found.";

        const content = fs.readFileSync(manifestPath, 'utf-8');
        const lines = content.split('\n');

        // Priority 0: Architectural Conflicts [!]
        for (const line of lines) {
            if (line.includes('[!]')) {
                const task = this.cleanLine(line);
                return `CRITICAL: Resolve conflict in "${task}" before proceeding.`;
            }
        }

        for (const line of lines) {
            // Priority 1: In Progress tasks [/]
            if (line.includes('[/]')) {
                const task = this.cleanLine(line);
                return `Next Priority: Continue working on "${task}" (currently In Progress).`;
            }
        }

        for (const line of lines) {
            // Priority 2: Empty tasks [ ]
            if (line.includes('[ ]')) {
                const task = this.cleanLine(line);
                return `Next Step: Start working on "${task}" (not yet started).`;
            }
        }

        return "All tasks in the manifest are completed! [X]";
    }

    private cleanLine(line: string): string {
        // Extracts "Label: Description" or just "Label"
        const clean = line.replace(/^[│\s├└─]+/, '').replace(/\[[\s/X!]\]/, '').trim();
        if (clean.includes(':')) {
            const parts = clean.split(':');
            const label = parts[0].trim();
            const desc = parts.slice(1).join(':').trim();
            return `"${label}" (${desc})`;
        }
        return `"${clean}"`;
    }
}
