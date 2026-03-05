import * as fs from 'fs';
import * as path from 'path';

export class TreeConsolidator {
    constructor(private workspaceRoot: string) { }

    private async findAllMdFiles(dir: string, fileList: string[] = []): Promise<string[]> {
        const EXCLUDED_DIRS = ['.git', 'node_modules', 'target', 'dist', 'build', 'out', '.hybrid', '.gemini', 'obj', 'bin', '.vscode-test', 'test'];
        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (EXCLUDED_DIRS.includes(file)) continue;
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                await this.findAllMdFiles(filePath, fileList);
            } else if (file.endsWith('.md') && file !== 'MASTER_PROJECT_TREE.md' && file !== 'GENESIS_EXPORT_TREE.md') {
                fileList.push(filePath);
            }
        }
        return fileList;
    }

    public async consolidate(manifestContent: string): Promise<string> {
        let fullManifest = manifestContent;
        const docsDir = path.join(this.workspaceRoot, 'docs');
        const mdFiles = fs.existsSync(docsDir) ? await this.findAllMdFiles(docsDir) : [];

        // 1. Identify all existing requirement indices in the base manifest
        const existingIndices = new Set<string>();
        const indexRegex = /(?:Mission\s+)?([A-Z]{1,3}\.[0-9]+(?:\.[0-9]+)*)/g;
        let match;
        while ((match = indexRegex.exec(manifestContent)) !== null) {
            existingIndices.add(match[1]);
        }

        // 2. Process each found MD file
        for (const filePath of mdFiles) {
            const relativePath = path.relative(this.workspaceRoot, filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            let currentSection: string[] = [];
            let inNewSection = false;
            let sectionHasNewContent = false;
            let newIndicesInSection: string[] = [];

            for (const line of lines) {
                if (line.startsWith('###') || line.startsWith('##')) {
                    if (inNewSection && sectionHasNewContent) {
                        fullManifest += `\n\n--- FROM: ${relativePath} ---\n` + currentSection.join('\n');
                        // Add newly found indices to existingIndices so they aren't added again from subsequent files
                        newIndicesInSection.forEach(idx => existingIndices.add(idx));
                    }
                    currentSection = [line];
                    inNewSection = true;
                    sectionHasNewContent = false;
                    newIndicesInSection = [];
                    continue;
                }

                if (inNewSection) {
                    currentSection.push(line);
                    const lineMatch = line.match(/(?:Mission\s+)?([A-Z]{1,3}\.[0-9]+(?:\.[0-9]+)*)/);
                    if (lineMatch) {
                        const index = lineMatch[1];
                        if (!existingIndices.has(index)) {
                            sectionHasNewContent = true;
                            newIndicesInSection.push(index);
                        }
                    }
                }
            }

            if (inNewSection && sectionHasNewContent) {
                fullManifest += `\n\n--- FROM: ${relativePath} ---\n` + currentSection.join('\n');
                newIndicesInSection.forEach(idx => existingIndices.add(idx));
            }
        }

        return fullManifest;
    }
}
