import {useEffect, useMemo, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import MonacoEditor from '@monaco-editor/react';

type TreeNode = {
  id: string;
  label: string;
  isLeaf: boolean;
  children?: TreeNode[];
};

const defaultTreeCode = `// 你可以在这里“写实现代码”（最小输入要求：定义 treeData）
// 只允许选叶子节点：改 onlyLeaf 就能切换约束

const onlyLeaf = true;

const treeData = [
  {
    id: 'dept-fe',
    label: '前端组',
    isLeaf: false,
    children: [
      { id: 'user-a', label: '小明', isLeaf: true },
      { id: 'user-b', label: '小红', isLeaf: true },
    ],
  },
  {
    id: 'dept-be',
    label: '后端组',
    isLeaf: false,
    children: [{ id: 'user-c', label: '小刚', isLeaf: true }],
  },
];
`;

function safeRunTreeCode(
  code: string,
): {ok: true; treeData: TreeNode[]; onlyLeaf: boolean} | {ok: false; error: string} {
  try {
    const validate = (nodes: any[]): TreeNode[] => {
      if (!Array.isArray(nodes)) throw new Error('treeData 必须是数组（TreeNode[]）');

      return nodes.map((n) => {
        if (!n || typeof n !== 'object') throw new Error('节点必须是对象');
        if (typeof n.id !== 'string') throw new Error('node.id 必须是字符串');
        if (typeof n.label !== 'string') throw new Error('node.label 必须是字符串');
        if (typeof n.isLeaf !== 'boolean') throw new Error('node.isLeaf 必须是 boolean');
        const children = n.children;
        const childNodes = children ? validate(children) : undefined;
        return {id: n.id, label: n.label, isLeaf: n.isLeaf, children: childNodes};
      });
    };

    // 执行用户代码，并返回我们关心的变量
    const run = new Function(`${code}\nreturn {treeData, onlyLeaf};`) as () => {
      treeData: any;
      onlyLeaf: any;
    };

    const result = run();
    const onlyLeaf = result.onlyLeaf === undefined ? true : Boolean(result.onlyLeaf);
    const treeData = validate(result.treeData);

    return {ok: true, treeData, onlyLeaf};
  } catch (e) {
    return {ok: false, error: e instanceof Error ? e.message : String(e)};
  }
}

export default function LeafTreeSelectorCodePlayground() {
  const [code, setCode] = useState(() => defaultTreeCode);
  const [parseError, setParseError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [onlyLeaf, setOnlyLeaf] = useState(true);

  useEffect(() => {
    const res = safeRunTreeCode(code);
    if (res.ok) {
      setParseError(null);
      setTreeData(res.treeData);
      setOnlyLeaf(res.onlyLeaf);
      return;
    }

    setParseError((res as {ok: false; error: string}).error);
  }, [code]);

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
  }, [treeData]);

  // treeData 变更后，过滤掉不存在的旧选择
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => idToNode.has(id)));
  }, [idToNode]);

  const selectedLabels = useMemo(
    () =>
      selectedIds
        .map((id) => idToNode.get(id)?.label)
        .filter(Boolean)
        .join(', ') || '无',
    [idToNode, selectedIds],
  );

  const onTreeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest('[data-node-id]') as HTMLElement | null;
    if (!nodeEl) return;

    const nodeId = nodeEl.dataset.nodeId;
    if (!nodeId) return;
    const node = idToNode.get(nodeId);
    if (!node) return;
    if (onlyLeaf && !node.isLeaf) return; // 只允许选叶子

    setSelectedIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId],
    );
  };

  const renderNodes = (nodes: TreeNode[]) => (
    <ul className="ml-0 list-none pl-0">
      {nodes.map((node) => {
        const selected = selectedIds.includes(node.id);
        const clickable = !onlyLeaf || node.isLeaf;

        return (
          <li key={node.id} className="my-1">
            <div
              data-node-id={node.id}
              className={[
                'inline-block rounded px-2 py-1',
                clickable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : 'cursor-not-allowed opacity-80',
                selected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : '',
              ].join(' ')}>
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
    <div className="grid gap-4 md:grid-cols-2">
      {/* Left: code */}
      <div className="flex flex-col rounded-lg border border-solid border-gray-200 p-3 dark:border-gray-700">
        <div className="mb-2 text-sm font-semibold">编辑：实现代码（只允许选叶子）</div>
        <div className="min-h-[420px] flex-1 overflow-hidden rounded border border-solid border-gray-300 dark:border-gray-600">
          <BrowserOnly
            fallback={
              <textarea
                className="h-full w-full bg-transparent p-2 font-mono text-xs"
                value={code}
                readOnly
              />
            }>
            {() => (
              <MonacoEditor
                height="420px"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val ?? '')}
                options={{
                  minimap: {enabled: false},
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
          </BrowserOnly>
        </div>
        {parseError ? (
          <p className="mt-2 text-sm text-red-600">代码执行错误：{parseError}</p>
        ) : null}
      </div>

      {/* Right: preview */}
      <div className="flex flex-col rounded-lg border border-solid border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 text-sm font-semibold">实时 UI 预览</div>
        <div className="flex-1 overflow-auto" onClick={onTreeClick}>
          {renderNodes(treeData)}
        </div>
        <p className="mb-0 mt-3 text-sm">
          当前选中：<span className="font-semibold">{selectedLabels}</span>
        </p>
      </div>
    </div>
  );
}

