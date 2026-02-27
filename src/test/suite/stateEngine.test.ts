import * as assert from 'assert';
import { TreeNode, NodeStatus } from '../../core/types';
import { StateEngine } from '../../core/StateEngine';

suite('StateEngine Test Suite', () => {

    test('Parent becomes Entropy if any child is Entropy', () => {
        const children: TreeNode[] = [
            { id: '1', label: 'Child 1', type: 'feature', status: 'solidified', children: [] },
            { id: '2', label: 'Child 2', type: 'feature', status: 'entropy', children: [] }
        ];

        const parentStatus = StateEngine.calculateParentStatus(children);
        assert.strictEqual(parentStatus, 'entropy');
    });

    test('Parent becomes Solidified if all children are Solidified', () => {
        const children: TreeNode[] = [
            { id: '1', label: 'Child 1', type: 'feature', status: 'solidified', children: [] },
            { id: '2', label: 'Child 2', type: 'feature', status: 'solidified', children: [] }
        ];

        const parentStatus = StateEngine.calculateParentStatus(children);
        assert.strictEqual(parentStatus, 'solidified');
    });

    test('Parent becomes Void if all children are Void', () => {
        const children: TreeNode[] = [
            { id: '1', label: 'Child 1', type: 'feature', status: 'void', children: [] },
            { id: '2', label: 'Child 2', type: 'feature', status: 'void', children: [] }
        ];

        const parentStatus = StateEngine.calculateParentStatus(children);
        assert.strictEqual(parentStatus, 'void');
    });

    test('Parent becomes In Progress if mixed status (no entropy)', () => {
        const children: TreeNode[] = [
            { id: '1', label: 'Child 1', type: 'feature', status: 'solidified', children: [] },
            { id: '2', label: 'Child 2', type: 'feature', status: 'in_progress', children: [] }
        ];

        const parentStatus = StateEngine.calculateParentStatus(children);
        assert.strictEqual(parentStatus, 'in_progress');
    });
});
