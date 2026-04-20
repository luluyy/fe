---
title: React 18 并发特性
---

# React 18 并发特性

并发不是“多线程并行执行 JS”，而是**可中断、可让步的渲染调度策略**。

## 核心能力

1. `createRoot`：并发能力入口。
2. 自动批处理（Automatic Batching）：更多场景合并状态更新。
3. `startTransition` / `useTransition`：把更新标记为低优先级。
4. `useDeferredValue`：延迟低优先级值，优先保证输入流畅。

## 典型场景

- 搜索框输入 + 大列表过滤：输入应优先响应，列表可稍后更新。

```tsx
const [text, setText] = useState('');
const [isPending, startTransition] = useTransition();

const onChange = (e) => {
  const v = e.target.value;
  setText(v); // 紧急更新
  startTransition(() => {
    setKeyword(v); // 低优先级更新
  });
};
```

## 高频追问

### Q1：并发会不会改变业务结果？

不应改变最终一致结果，主要影响“何时渲染、先渲什么”。

### Q2：什么时候不该用 transition？

输入框当前值本身这类“紧急交互”不该包进 transition，否则手感会变差。

### Q3：自动批处理和旧版本差异？

React 18 在更多异步场景（如 Promise、setTimeout）也会批处理更新。

## 30 秒口述模板

React 18 并发的本质是调度优化：把更新分优先级，让紧急交互先响应。常用 API 是 `startTransition/useTransition/useDeferredValue`，配合自动批处理提升复杂页面流畅度。
