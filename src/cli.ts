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

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { ContextManager } from './bridge/ContextManager';
import { TreeConsolidator } from './core/TreeConsolidator';

const program = new Command();
const workspaceRoot = process.cwd();
const contextManager = new ContextManager(workspaceRoot);

program
    .name('hybrid-tree')
    .description('Layer 1 of the Hybrid Ecosystem: Project Cartographer')
    .version('0.6.2');

function appendLog(cmd: string, message: string): void {
    const hybridDir = path.join(workspaceRoot, '.hybrid');
    if (!fs.existsSync(hybridDir)) fs.mkdirSync(hybridDir, { recursive: true });
    const logPath = path.join(hybridDir, 'tree-report.log');
    const timestampedOutput = `[${new Date().toISOString()}] COMMAND: ${cmd}\n${message.trim()}\n\n`;
    fs.appendFileSync(logPath, timestampedOutput);
}

program
    .command('export')
    .description('Export the logical manifest to JSON')
    .option('--ai-format', 'Output in machine-readable JSON format')
    .action((options) => {
        const aiFormat = options.aiFormat;
        if (!aiFormat) console.log('Hybrid Tree: Exporting JSON State...');
        const hybridDir = path.join(workspaceRoot, '.hybrid');
        if (!fs.existsSync(hybridDir)) fs.mkdirSync(hybridDir, { recursive: true });

        const jsonContext = contextManager.getJsonContext();
        const exportPath = path.join(hybridDir, 'hybrid-tree.json');
        fs.writeFileSync(exportPath, JSON.stringify(jsonContext, null, 2));

        if (aiFormat) {
            console.log(JSON.stringify({ status: 'success', path: exportPath }));
        } else {
            const msg = `Exported state to ${exportPath}`;
            console.log(msg);
            appendLog('export', msg);
        }
    });

program
    .command('snapshot')
    .description('Display a formatted snapshot of context')
    .action(async () => {
        const snapshot = await contextManager.getContextSnapshot();
        console.log(snapshot);
        appendLog('snapshot', snapshot);
    });

program
    .command('consolidate')
    .description('Consolidate fragmented requirement files')
    .option('--ai-format', 'Output in machine-readable JSON format')
    .action(async (options) => {
        const aiFormat = options.aiFormat;
        if (!aiFormat) console.log('Hybrid Tree: Consolidating Feature Trees...');

        let manifestPath = path.join(workspaceRoot, '.hybrid', 'MASTER_PROJECT_TREE.md');
        if (!fs.existsSync(manifestPath)) {
            manifestPath = path.join(workspaceRoot, 'MASTER_PROJECT_TREE.md');
        }
        if (!fs.existsSync(manifestPath)) {
            manifestPath = path.join(workspaceRoot, 'GENESIS_EXPORT_TREE.md');
        }

        if (!fs.existsSync(manifestPath)) {
            if (aiFormat) console.log(JSON.stringify({ error: 'No manifest found in .hybrid/ or root' }));
            else console.error('Error: No manifest found.');
            process.exit(1);
        }

        const initialManifest = fs.readFileSync(manifestPath, 'utf-8');
        let fullManifest = initialManifest;
        const consolidator = new TreeConsolidator(workspaceRoot);
        fullManifest = await consolidator.consolidate(initialManifest);

        const consolidatedPath = path.join(workspaceRoot, '.hybrid', 'MASTER_PROJECT_TREE.md');
        const hybridDir2 = path.join(workspaceRoot, '.hybrid');
        if (!fs.existsSync(hybridDir2)) fs.mkdirSync(hybridDir2, { recursive: true });

        fs.writeFileSync(consolidatedPath, fullManifest);
        const jsonContext = contextManager.getJsonContext();
        const treePath = path.join(workspaceRoot, '.hybrid', 'hybrid-tree.json');
        fs.writeFileSync(treePath, JSON.stringify(jsonContext, null, 2));

        const reportData: any = { status: 'success', manifest: consolidatedPath, state: treePath };

        const rcpPath = path.join(workspaceRoot, '.hybrid', 'hybrid-rcp.json');
        if (fs.existsSync(rcpPath)) {
            try {
                const rcp = JSON.parse(fs.readFileSync(rcpPath, 'utf-8'));
                if (rcp.nodes && jsonContext.manifest) {
                    const treeStr = JSON.stringify(jsonContext.manifest);
                    const orphans = rcp.nodes.filter((n: any) => !treeStr.includes(n.id.split('/').pop()?.replace('.rs', '') || ""));
                    reportData.orphans_count = orphans.length > 5 ? orphans.length : 0;
                }
            } catch (e) {
                // Ignore RCP parse errors
            }
        }

        if (aiFormat) {
            console.log(JSON.stringify(reportData));
        } else {
            let reportOutput = `--- HYBRID TREE CONSOLIDATION REPORT ---\n`;
            reportOutput += `✅ Consolidated manifest: ${reportData.manifest}\n`;
            reportOutput += `✅ Exported JSON: ${reportData.state}\n`;
            if (reportData.orphans_count > 0) {
                reportOutput += `⚠️  Found ${reportData.orphans_count} potential undocumented code modules (Orphans).\n`;
            } else {
                reportOutput += `✅ No significant orphans detected.\n`;
            }
            reportOutput += `----------------------------------------\n`;
            console.log(reportOutput);
            appendLog('consolidate', reportOutput);
        }
    });

program.parse(process.argv);
