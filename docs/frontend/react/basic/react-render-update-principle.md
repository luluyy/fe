---
title: React 更新与渲染原理
---

# React 更新与渲染原理

面试推荐用「**两大阶段 + 协调 + 提交**」来讲清楚，比背名词更稳。

---

## 1. 触发更新（从哪里来）

常见来源：

- `setState` / `useState` 的 setter
- `useReducer` 的 dispatch
- 父组件重渲染导致子组件 props 变化
- Context Provider value 变化
- 根节点首次挂载

**要点**：一次更新从「状态变更请求」开始，不一定立刻同步刷到屏幕。

---

## 2. 渲染阶段（Render Phase，纯计算）

目标：根据最新的 props/state，计算出新的 UI 描述（通常说是 Virtual DOM / React Element 树）。

特点：

- 应该是**纯函数式**的：同样输入应得到同样输出。
- 可能被中断、重复（并发模式下更明显），因此**不要**在渲染函数里做副作用（请求、订阅、直接改 DOM）。

**Fiber**：把整棵树的更新拆成工作单元（work），可调度、可中断、可恢复，为并发更新打基础。

---

## 3. 协调与 Diff（Reconciliation）

React 会把**新树**和**旧树**做比较，决定哪些节点可以复用、哪些需要增删改。

- `key` 帮助列表项**身份识别**，减少错位复用。
- 复用能保留 DOM 节点与组件实例，减少销毁创建成本。

---

## 4. 提交阶段（Commit Phase，副作用落地）

目标：把渲染结果真正作用到宿主环境（浏览器 DOM）。

常见拆分理解：

- **Mutation**：更新 DOM（文本、属性、插入删除节点）。
- **Layout**：`useLayoutEffect` 这类需要同步读取布局/测量的时机（在浏览器绘制前）。
- **Paint 之后**：`useEffect` 这类副作用（更适合订阅、请求、日志）。

**一句话**：Render 决定「是什么」，Commit 决定「落到页面上的变更」。

---

## 5. 批处理（Batching）

React 会把同一事件循环内的多个 state 更新合并处理，减少重复渲染（React 18 后批处理范围更广）。

---

## 6. 并发模式（Concurrent，React 18+）

在并发特性开启时，React 可以把某些更新标记为低优先级（例如 `startTransition`），让紧急交互（输入）更优先。

**注意**：并发不是多线程并行执行 JS，而是**调度与可中断渲染**的策略。

---

## 面试口述模板（45 秒）

1. 更新由 state/props/context 等触发。
2. 进入 Render：计算出新的 element 树，Fiber 负责可中断调度。
3. Reconciliation：diff 决定复用与变更。
4. Commit：提交到 DOM，再跑 layout/effect 副作用。
5. 并发下通过优先级与 transition 改善交互体验。

---

## 高频追问

### Q：为什么不要在 render 里发请求？

render 可能执行多次/被打断，副作用不应绑定在纯渲染计算里。

### Q：`useEffect` 为什么在渲染之后？

它属于提交后副作用阶段，适合对接浏览器与外部世界；需要同步测量用 `useLayoutEffect`。
