---
title: React 各主要版本更新了什么
---

# React 各主要版本更新了什么？

面试里通常不要求背每个小版本号，但要能按**大版本**说出**一两句标志性变化**，并和「Fiber / Hooks / 并发」能对上号。

下面按**主线大版本**整理（以官方发布说明为准，细节以你项目实际版本为准）。

---

## React 15 及以前（了解即可）

- 协调器以 **Stack Reconciler** 为主，长列表或大更新时容易阻塞主线程。
- 面试较少单独问，常作为「为什么 16 要 Fiber」的背景。

---

## React 16（2016～2017，里程碑）

### 核心：Fiber 架构

- 引入 **Fiber Reconciler**：把更新拆成可中断、可恢复的工作单元，为后续并发能力打基础。
- **Error Boundary**、**Portals**、**Fragment** 等能力逐步完善。

### React 16.8（2019）：Hooks

- `useState` / `useEffect` 等：**函数组件成为一等公民**，逻辑复用从 HOC/render props 转向自定义 Hook。

**一句话**：16 = Fiber +（后期）Hooks 革命。

---

## React 17（2020）

- **没有新「开发者必须学」的大型特性**，更像「垫脚石版本」。
- 事件系统调整，利于 **渐进升级**（多版本 React 共存、逐步迁移）。
- 对 JSX 转换有新编译方式（与后续工具链衔接）。

**一句话**：17 = 为升级路径和工程化铺路。

---

## React 18（2022）

### 新根 API

- `createRoot` 替代 `ReactDOM.render`（启用并发特性入口）。

### 并发渲染（Concurrent Features）

- `startTransition` / `useTransition` / `useDeferredValue`：把更新标成「可中断/低优先级」，改善交互卡顿。
- **自动批处理（Automatic Batching）** 扩展：更多场景下 state 更新会合并。

### Suspense 能力增强（配合生态）

- 更强调数据/异步与 UI 协调（具体能力依赖路由/数据方案版本）。

**一句话**：18 = 并发 + 新 Root + 批处理增强。

---

## React 19（2024）

### 新特性

    React 19 于 2024年12月5日正式发布稳定版，带来了多项重大更新，旨在简化开发、提升性能并统一异步处理逻辑。以下是其核心新特性：

---

一、核心新特性概览

- Actions（动作）机制  
  通过 `useActionState` 和表单集成，统一管理异步操作（如表单提交、数据变更），自动处理 `pending`、`success`、`error` 状态，大幅减少样板代码。

- 新 Hook：`use()`  
  允许在组件渲染中直接消费 Promise 或 Context，配合 `Suspense` 实现声明式数据获取，无需手动管理加载/错误状态。

- Server Components（服务器组件）进入稳定版  
  组件可在服务端直接渲染，不打包到客户端，显著减小包体积、提升首屏加载速度与 SEO。

- 自动批处理（Automatic Batching）增强  
  所有状态更新（包括 Promise、setTimeout 等异步回调中）自动合并为一次渲染，无需手动使用 `unstable_batchedUpdates`。

- `useOptimistic` Hook  
  支持乐观 UI 更新：在异步请求完成前先更新界面，提升交互流畅度；失败时可自动回滚。

- `useFormStatus` Hook  
  子组件可直接获取所属 `<form>` 的提交状态（如 `pending`、`data`、`method`），无需通过 props 逐层传递。

- 资源与元数据管理优化  
  原生支持 `<title>`、`<meta>` 标签设置，以及 `preload`、`preinit` API，优化 SEO 和资源加载优先级。

- React Compiler（实验性）  
  自动识别可 memoized 的值，减少对 `useMemo`、`useCallback` 的手动依赖，提升渲染性能。

---

二、关键特性详解

1. Actions 与表单处理革命
- 传统方式（React 18）：需手动管理 `loading`、`error`、`value` 状态，配合 `onSubmit` + `e.preventDefault()`。
- React 19 方式：
  ```jsx
  import { useActionState } from 'react';

  async function submitAction(prevState, formData) {
    const name = formData.get('name');
    if (!name) return 'Name is required';
    await new Promise(resolve => setTimeout(resolve, 1000));
    return null;
  }

  function NameForm() {
    const [error, submitAction, isPending] = useActionState(submitAction, null);
    return (
      <form action={submitAction}>
        <input type="text" name="name" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    );
  }
  ```
  > 代码量减少约 30%–50%，状态逻辑内聚，避免竞态条件 。

2. 服务器组件（Server Components）
- 执行环境：仅在服务端运行，不包含在客户端 bundle 中。
- 优势：
  - 零客户端打包体积
  - 直接访问数据库/后端服务
  - 支持流式渲染与渐进式加载
- 使用示例：
  ```jsx
  // ProductList.server.js
  import db from '@server/database';
  async function ProductList({ category }) {
    const products = await db.products.findMany({ where: { category } });
    return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
  }
  ```

3. `use()` Hook 与数据获取
- 直接在渲染中消费 Promise，配合 `Suspense` 显示加载状态：
  ```jsx
  import { use, Suspense } from 'react';

  async function fetchUser(id) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  }

  function UserProfile({ userId }) {
    const user = use(fetchUser(userId)); // 挂起直到 Promise resolve
    return <div>{user.name}</div>;
  }

  function App() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={123} />
      </Suspense>
    );
  }
  ```

4. 性能与开发体验优化
- 自动批处理：异步回调中的多个 `setState` 自动合并，避免重复渲染 。
- Ref 作为 Prop 传递：简化 `forwardRef` 使用 。
- Context 提供者语法简化：减少样板代码 。

---

三、升级建议
- 兼容性：React 19 对 React 18 代码完全兼容，支持渐进式升级 。
- 迁移步骤：
  1. `npm install react@19 react-dom@19`
  2. 删除对 `unstable_batchedUpdates` 的依赖
  3. 逐步用 `useActionState` 替代传统表单逻辑
  4. 评估是否保留 Redux/Zustand 等第三方状态库 

> 官方文档：[React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19)

> 不同资料对「19 新特性」列举略有侧重，面试以「你用过哪些」为准。

常见会被提到的方向包括：

- **Actions**、表单与异步状态更工程化的写法（减少手写 pending/error）。
- **`use`**：在渲染中读取 Promise / Context 等（需配合正确数据模式）。
- **ref 作为 props** 等 DX 改进。
- 与 **React Compiler**、Server Components 生态的持续演进（是否启用取决于构建链）。

**一句话**：19 = 在 18 并发基础上，把「应用层写法」和工具链再往前推一档。

---

## 面试怎么答（30 秒模板）

按版本递进说：

1. **16**：Fiber + Hooks，解决可中断更新与逻辑复用。
2. **17**：渐进升级与工程衔接。
3. **18**：`createRoot`、并发特性、批处理增强。
4. **19**：Actions / `use` 等应用层 API 与工具链演进。

再补一句：**版本号背后主线是「调度能力 + 开发体验 + 服务端/编译生态」**。

---

## 易错点

- 把「Hooks」说成 React 18：Hooks 是 **16.8**。
- 把「并发」说成从 16 开始就全开：并发能力在 **18** 通过新根 API 才成为主叙事。
