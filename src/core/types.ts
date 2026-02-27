export type NodeType = 'file' | 'folder' | 'feature' | 'logic_block';
export type NodeStatus = 'void' | 'in_progress' | 'solidified' | 'entropy';

export interface TreeNode {
    id: string;
    label: string;
    type: NodeType;
    status: NodeStatus;
    specs?: string;
    ai_notes?: string;
    children: TreeNode[];
    parentId?: string;
}
