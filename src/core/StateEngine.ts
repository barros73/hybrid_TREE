import { TreeNode, NodeStatus } from './types';

export class StateEngine {

    /**
     * Updates the status of a parent node based on its children's statuses.
     * Rules:
     * - If ANY child is 'entropy', parent becomes 'entropy'.
     * - If ALL children are 'solidified', parent becomes 'solidified'.
     * - If ALL children are 'void', parent becomes 'void'.
     * - Otherwise, parent becomes 'in_progress'.
     */
    static calculateParentStatus(children: TreeNode[]): NodeStatus {
        if (!children || children.length === 0) {
            return 'void'; // Or keep existing status? For now default to void if no children logic
        }

        let hasEntropy = false;
        let hasInProgress = false;
        let allSolidified = true;
        let allVoid = true;

        for (const child of children) {
            if (child.status === 'entropy') {
                hasEntropy = true;
            }
            if (child.status !== 'solidified') {
                allSolidified = false;
            }
            if (child.status !== 'void') {
                allVoid = false;
            }
            if (child.status === 'in_progress') {
                hasInProgress = true;
            }
        }

        if (hasEntropy) {
            return 'entropy';
        }
        if (allSolidified) {
            return 'solidified';
        }
        if (allVoid) {
            return 'void';
        }

        return 'in_progress';
    }

    /**
     * Recursively updates the tree states up to the root.
     * Note: This is a simplified version. In a real graph, we'd need to look up parents.
     */
    static refreshTreeState(node: TreeNode, lookup: Map<string, TreeNode>): void {
        if (!node.parentId) {
            return;
        }

        const parent = lookup.get(node.parentId);
        if (parent) {
            const newStatus = this.calculateParentStatus(parent.children);
            if (parent.status !== newStatus) {
                parent.status = newStatus;
                this.refreshTreeState(parent, lookup);
            }
        }
    }
}
