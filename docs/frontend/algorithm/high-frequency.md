---
title: 前端面试高频算法题（10 题）
---

# 前端面试高频算法题（10 题）

## 30 秒口述速记卡

- 高频题不是越难越好，而是“常见 + 可口述 + 可手写”。
- 先说思路和复杂度，再写代码，最后补边界条件。
- 常考 4 类：双指针、哈希、栈、滑动窗口。

## 1) 两数之和（Two Sum）
### 代码示例
```ts
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need)!, i];
    map.set(nums[i], i);
  }
  return [];
}
```
### 原理讲解
用哈希表记录“值 -> 下标”，每次 O(1) 查补数，整体 O(n)。
### 高频追问
### 为什么不是双重循环？
双重循环 O(n^2)，哈希可降到 O(n)。
### 面试口述模板
这题用哈希换时间，边遍历边查补数，时间 O(n)、空间 O(n)。

## 2) 最长无重复子串（滑动窗口）
### 代码示例
```ts
function lengthOfLongestSubstring(s: string): number {
  let left = 0;
  let ans = 0;
  const pos = new Map<string, number>();
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (pos.has(ch) && pos.get(ch)! >= left) left = pos.get(ch)! + 1;
    pos.set(ch, right);
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}
```
### 原理讲解
窗口区间始终保持“无重复”，右指针扩张，左指针按需收缩。
### 高频追问
### 为什么 left 不能简单 +1？
要跳到重复字符上一次出现位置后一个索引，避免漏解。
### 面试口述模板
维护无重复窗口，遇到重复就移动 left 到合法位置，线性扫描一次。

## 3) 有效括号（栈）
### 代码示例
```ts
function isValid(s: string): boolean {
  const st: string[] = [];
  const mp: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") st.push(ch);
    else if (st.pop() !== mp[ch]) return false;
  }
  return st.length === 0;
}
```
### 原理讲解
后进先出匹配模型，用栈保存未闭合左括号。
### 高频追问
### 为什么最后还要判空？
防止全是左括号这类未闭合情况。
### 面试口述模板
括号匹配天然用栈，遇右括号就和栈顶匹配，最终栈为空才合法。

## 4) 合并两个有序数组（双指针）
### 代码示例
```ts
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}
```
### 原理讲解
从后往前写，避免覆盖 nums1 里未处理元素。
### 高频追问
### 为什么不用新数组？
题目通常要求原地修改，空间 O(1) 更优。
### 面试口述模板
双指针从尾部比较并填充，保证原地合并且不覆盖有效值。

## 5) 反转链表
### 代码示例
```ts
type Node = { val: number; next: Node | null };
function reverseList(head: Node | null): Node | null {
  let prev: Node | null = null;
  let cur: Node | null = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}
```
### 原理讲解
三指针迭代重连方向，时间 O(n)、空间 O(1)。
### 高频追问
### 递归写法缺点？
递归有调用栈开销，长链表可能栈溢出。
### 面试口述模板
用 prev/cur/nxt 逐个反转指针方向，最后 prev 即新头结点。

## 6) 二叉树层序遍历（BFS）
### 代码示例
```ts
type Tree = { val: number; left: Tree | null; right: Tree | null };
function levelOrder(root: Tree | null): number[][] {
  if (!root) return [];
  const q: Tree[] = [root];
  const ans: number[][] = [];
  while (q.length) {
    const size = q.length;
    const row: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift()!;
      row.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    ans.push(row);
  }
  return ans;
}
```
### 原理讲解
队列按层推进，每轮固定处理当前层节点数。
### 高频追问
### DFS 能做层序吗？
能，用深度参数分组，但 BFS 更直观。
### 面试口述模板
层序遍历本质是队列分层消费，每层处理 size 个节点。

## 7) 买卖股票的最佳时机
### 代码示例
```ts
function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let ans = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    ans = Math.max(ans, p - minPrice);
  }
  return ans;
}
```
### 原理讲解
遍历中维护历史最低价，并计算当前卖出收益最大值。
### 高频追问
### 为什么不是先排序？
排序会破坏时间顺序，买卖先后关系失效。
### 面试口述模板
单次遍历维护最低买入点和最大利润差，时间 O(n)。

## 8) 三数之和（排序 + 双指针）
### 代码示例
```ts
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const ans: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        ans.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return ans;
}
```
### 原理讲解
固定一个数后退化为 two-sum，注意去重细节。
### 高频追问
### 去重为什么要在命中后 while？
避免重复组合进入答案集。
### 面试口述模板
排序后固定 i，用左右指针夹逼找和为 0，并在每层做去重。

## 9) LRU 缓存（Map + 双向链表思路）
### 代码示例
```ts
class LRUCache {
  private cap: number;
  private map = new Map<number, number>();
  constructor(capacity: number) { this.cap = capacity; }
  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  put(key: number, value: number): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}
```
### 原理讲解
JS `Map` 维护插入顺序，可模拟 LRU 的“最近使用移到末尾”。
### 高频追问
### 真正 O(1) 方案？
哈希表 + 双向链表是语言无关的标准解。
### 面试口述模板
核心是“访问即更新顺序、超容删最旧”，Map 版好写，链表版更标准。

## 10) 岛屿数量（DFS/BFS）
### 代码示例
```ts
function numIslands(grid: string[][]): number {
  const m = grid.length, n = grid[0].length;
  let ans = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const dfs = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= m || y >= n || grid[x][y] !== "1") return;
    grid[x][y] = "0";
    for (const [dx, dy] of dirs) dfs(x + dx, y + dy);
  };
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        ans++;
        dfs(i, j);
      }
    }
  }
  return ans;
}
```
### 原理讲解
每找到一块陆地就做一次连通块淹没，计数加一。
### 高频追问
### 为什么要原地改 1 为 0？
避免额外 visited 数组，节省空间。
### 面试口述模板
遍历网格，遇到 1 就 DFS 清整块并计数，答案是连通块数量。
