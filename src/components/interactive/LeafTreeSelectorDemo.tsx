import {useMemo, useState} from 'react';

type TreeNode = {
  id: string;
  label: string;
  isLeaf: boolean;
  children?: TreeNode[];
};

const treeData: TreeNode[] = [
  {
    id: 'dept-fe',
    label: '前端组',
    isLeaf: false,
    children: [
      {id: 'user-a', label: '小明', isLeaf: true},
      {id: 'user-b', label: '小红', isLeaf: true},
    ],
  },
  {
    id: 'dept-be',
    label: '后端组',
    isLeaf: false,
    children: [{id: 'user-c', label: '小刚', isLeaf: true}],
  },
];

export default function LeafTreeSelectorDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const idToNode = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const walk = (nodes: TreeNode[]) => {
      nodes.forEach((n) => {
        map.set(n.id, n);
        if (n.children) walk(n.children);
      });
    };
    walk(treeData);
    return map;
  }, []);

  const onTreeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest('[data-node-id]') as HTMLElement | null;
    if (!nodeEl) return;

    const nodeId = nodeEl.dataset.nodeId!;
    const node = idToNode.get(nodeId);
    if (!node || !node.isLeaf) return;

    setSelectedIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId],
    );
  };

  const renderNodes = (nodes: TreeNode[]) => (
    <ul className="ml-0 list-none pl-0">
      {nodes.map((node) => {
        const selected = selectedIds.includes(node.id);
        return (
          <li key={node.id} className="my-1">
            <div
              data-node-id={node.id}
              className={`inline-block rounded px-2 py-1 ${
                node.isLeaf ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
              } ${selected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : ''}`}>
              {node.label}
              {!node.isLeaf ? '（部门）' : selected ? '（已选）' : ''}
            </div>
            {node.children ? <div className="ml-5">{renderNodes(node.children)}</div> : null}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      onClick={onTreeClick}
      className="rounded-lg border border-solid border-gray-200 p-4 dark:border-gray-700">
      {renderNodes(treeData)}
      <p className="mb-0 mt-3 text-sm">当前选中叶子: {selectedIds.join(', ') || '无'}</p>
    </div>
  );
}
