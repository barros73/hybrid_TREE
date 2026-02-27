import * as fs from 'fs';
import * as path from 'path';

export interface ValidationIssue {
    type: 'DUPLICATE_LABEL' | 'DUPLICATE_DESC' | 'LOGICAL_OVERLAP';
    message: string;
    item: string;
}

export class ManifestValidator {
    constructor(private workspaceRoot: string | undefined) { }

    public validate(): ValidationIssue[] {
        if (!this.workspaceRoot) return [];
        const manifestPath = path.join(this.workspaceRoot, 'MASTER_PROJECT_TREE.md');
        if (!fs.existsSync(manifestPath)) return [];

        const content = fs.readFileSync(manifestPath, 'utf-8');
        const lines = content.split('\n');

        const labels = new Map<string, number[]>();
        const descriptions = new Map<string, number[]>();
        const issues: ValidationIssue[] = [];

        lines.forEach((line, index) => {
            const match = line.match(/^([│\s├└─]+)\s*(\[[\s/X!]\])\s*(.*)$/);
            if (match) {
                const fullText = match[3];
                let label = fullText;
                let description = "";

                if (fullText.includes(':')) {
                    const parts = fullText.split(':');
                    label = parts[0].trim();
                    description = parts.slice(1).join(':').trim();
                }

                // Check Labels
                if (labels.has(label)) {
                    issues.push({
                        type: 'DUPLICATE_LABEL',
                        message: `Duplicate label found: "${label}" on lines ${labels.get(label)} and ${index + 1}`,
                        item: label
                    });
                } else {
                    labels.set(label, [index + 1]);
                }

                // Check Descriptions
                if (description && descriptions.has(description)) {
                    issues.push({
                        type: 'DUPLICATE_DESC',
                        message: `Duplicate description found: "${description}" for labels "${label}" and others.`,
                        item: description
                    });
                } else if (description) {
                    descriptions.set(description, [index + 1]);
                }
            }
        });

        return issues;
    }
}
