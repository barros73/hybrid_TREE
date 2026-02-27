#!/usr/bin/env node
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

import * as path from 'path';
import * as fs from 'fs';
import { ContextManager } from './bridge/ContextManager';

const args = process.argv.slice(2);
const command = args[0];
const workspaceRoot = process.cwd();

/**
 * CLI entry point for hybrid-TREE.
 * Handles manifest export, snapshots, and high-resolution manifest consolidation.
 */
async function run() {
    const contextManager = new ContextManager(workspaceRoot);

    switch (command) {
        // Export the logical manifest to JSON
        case 'export': {
            console.log('Hybrid Tree: Exporting JSON State...');
            const hybridDir = path.join(workspaceRoot, '.hybrid');
            if (!fs.existsSync(hybridDir)) fs.mkdirSync(hybridDir);

            const jsonContext = contextManager.getJsonContext();
            const exportPath = path.join(hybridDir, 'hybrid-tree.json');
            fs.writeFileSync(exportPath, JSON.stringify(jsonContext, null, 2));
            console.log(`Exported state to ${exportPath}`);
            break;
        }

        // Display a formatted snapshot of the current logical and physical context
        case 'snapshot': {
            const snapshot = await contextManager.getContextSnapshot();
            console.log(snapshot);
            break;
        }

        // Consolidate fragmented requirement files from docs/feature_trees/ into a single manifest
        case 'consolidate':
            console.log('Hybrid Tree: Consolidating Feature Trees...');
            const manifestPath = path.join(workspaceRoot, 'MASTER_PROJECT_TREE.md');
            if (!fs.existsSync(manifestPath)) {
                console.error('Error: MASTER_PROJECT_TREE.md not found.');
                process.exit(1);
            }

            let fullManifest = fs.readFileSync(manifestPath, 'utf-8');
            const treeDir = path.join(workspaceRoot, 'docs', 'feature_trees');

            // Look for additional markdown feature trees to merge
            if (fs.existsSync(treeDir)) {
                const treeFiles = fs.readdirSync(treeDir).filter(f => f.endsWith('.md') && f !== '00_index.md');
                console.log(`Merging ${treeFiles.length} feature trees...`);
                for (const file of treeFiles) {
                    process.stdout.write(`  + ${file}\n`);
                    const content = fs.readFileSync(path.join(treeDir, file), 'utf-8');
                    // Add markers for each source file
                    fullManifest += `\n\n--- FILE: ${file} ---\n\n` + content;
                }
            }

            const consolidatedPath = path.join(workspaceRoot, '.hybrid', 'FULL_BIM_MANIFEST.md');
            const hybridDir2 = path.join(workspaceRoot, '.hybrid');
            if (!fs.existsSync(hybridDir2)) fs.mkdirSync(hybridDir2);

            // Save the flattened manifest for high-resolution analysis
            fs.writeFileSync(consolidatedPath, fullManifest);
            console.log(`✅ Consolidated manifest saved to ${consolidatedPath}`);

            const jsonContext = contextManager.getJsonContext();
            const treePath = path.join(workspaceRoot, '.hybrid', 'hybrid-tree.json');
            fs.writeFileSync(treePath, JSON.stringify(jsonContext, null, 2));
            console.log(`✅ Exported state to ${treePath}`);

            // Check for RCP orphans (Code without documentation)
            const rcpPath = path.join(workspaceRoot, '.hybrid', 'hybrid-rcp.json');
            if (fs.existsSync(rcpPath)) {
                console.log('🔍 Checking for undocumented code constructs...');
                const rcp = JSON.parse(fs.readFileSync(rcpPath, 'utf-8'));
                const treeStr = JSON.stringify(jsonContext);
                const orphans = rcp.nodes.filter((n: any) => !treeStr.includes(n.id.split('/').pop()?.replace('.rs', '') || ""));
                if (orphans.length > 5) {
                    console.log(`⚠️  Found ${orphans.length} potential undocumented code modules (Orphans).`);
                }
            }
            break;

        default:
            console.log('Usage: hybrid-tree [export|snapshot|consolidate]');
    }
}

// Start the CLI application
run();
