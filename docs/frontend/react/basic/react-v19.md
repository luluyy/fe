---
title: React 19 新特性详解
---

# React 19 新特性详解

> 说明：React 19 处于新能力持续落地阶段，不同脚手架与框架（如 Next.js）接入节奏可能不同。面试里建议回答“核心方向 + 已稳定能力 + 生态接入现状”。

## 1) Actions（表单 Action + 异步状态协同）
### 代码示例
```tsx
import { useActionState } from "react";

async function submitAction(_: string, formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  if (!name) return "Name is required";
  await new Promise((r) => setTimeout(r, 300));
  return `Saved: ${name}`;
}

export default function FormDemo() {
  const [message, action, pending] = useActionState(submitAction, "");
  return (
    <form action={action}>
      <input name="name" placeholder="input name" />
      <button disabled={pending}>{pending ? "Saving..." : "Submit"}</button>
      <p>{message}</p>
    </form>
  );
}
```
### 原理讲解
把“提交动作 + 状态回写”收敛成统一模型，减少样板代码。

## 2) `useFormStatus`（表单提交状态）
### 代码示例
```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Submitting..." : "Submit"}</button>;
}
```
### 原理讲解
在表单子树中读取提交状态，避免层层传 props。

## 3) `useOptimistic`（乐观更新）
### 代码示例
```tsx
import { useOptimistic, useState } from "react";

export default function LikeDemo() {
  const [count, setCount] = useState(10);
  const [optimistic, addOptimistic] = useOptimistic(count, (s, inc: number) => s + inc);

  async function like() {
    addOptimistic(1);
    try {
      await fakeRequest();
      setCount((v) => v + 1);
    } catch {
      // 失败时真实 state 不变，UI 回到真实值
    }
  }

  return <button onClick={like}>Like: {optimistic}</button>;
}

function fakeRequest() {
  return new Promise((r) => setTimeout(r, 300));
}
```
### 原理讲解
先给用户即时反馈，再与真实结果对齐，优化交互体感。

## 4) 对 Web Components 支持增强
### 代码示例
```tsx
export default function WC() {
  return <my-counter value={2}></my-counter>;
}
```
### 原理讲解
React 19 在与自定义元素（Web Components）协作上兼容性更好。

## 5) 资源加载与元信息管理改进（与 SSR 协同）
### 代码示例
```tsx
// 资源提示示意（框架层常封装）
// <link rel="preload" href="/fonts/inter.woff2" as="font" />
// <link rel="preconnect" href="https://api.example.com" />
```
### 原理讲解
强调与服务端渲染、流式输出配合，优化关键资源到达时间。

## 6) `use()` Hook（Render-as-you-fetch）
### 代码示例
```tsx
import { Suspense, use } from "react";

function UserName({ promise }: { promise: Promise<{ name: string }> }) {
  const user = use(promise);
  return <h3>{user.name}</h3>;
}

export default function Page() {
  const userPromise = fetch("/api/user").then((r) => r.json());
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserName promise={userPromise} />
    </Suspense>
  );
}
```
### 原理讲解
`use()` 可直接消费 Promise/Context，并把“等待数据”与渲染阶段对齐（Render-as-you-fetch）。当资源未就绪会挂起到 `Suspense` fallback，数据到达再继续渲染。

## 7) `ref` as prop（函数组件可直接接收 `ref`）
### 代码示例
```tsx
import { useRef } from "react";

function MyInput({ ref, placeholder }: { ref: React.Ref<HTMLInputElement>; placeholder?: string }) {
  return <input ref={ref} placeholder={placeholder} />;
}

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <MyInput ref={inputRef} placeholder="type here" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```
### 原理讲解
React 19 里 `ref` 能像普通 prop 一样传给函数组件，减少一些 `forwardRef` 样板代码（注意类型与生态工具链支持版本）。

## 8) React Compiler（自动优化方向）
### 代码示例
```tsx
// 语义示例：无需手写 memo/useMemo/useCallback 组合
function ProductList({ products, keyword }: { products: string[]; keyword: string }) {
  const filtered = products.filter((p) => p.includes(keyword));
  return (
    <ul>
      {filtered.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}
```
### 原理讲解
React Compiler 是编译期自动优化方向，目标是减少手写性能优化心智负担，让编译器识别稳定性与可复用子表达式。面试回答时建议强调：这是“编译器能力 + 生态接入”问题，不等于所有场景都不需要手动优化。

## 面试口述模板
React 19 的方向是“表单/异步交互 + 渲染与编译协同优化”。代表点包括 Actions、`useActionState`、`useFormStatus`、`useOptimistic`、`use()`（Render-as-you-fetch）、`ref` as prop 和 React Compiler。面试要补一句：不同框架和构建链路接入节奏不同，需结合实际版本回答。
