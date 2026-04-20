---
title: React 18 新特性详解
---

# React 18 新特性详解

## 1) 新 Root API：`createRoot`
### 代码示例
```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
```
### 原理讲解
`createRoot` 是并发能力入口，旧 `ReactDOM.render` 保留兼容但不启用新能力。

## 2) Automatic Batching（自动批处理）
### 代码示例
```tsx
import { useState } from "react";

export default function Demo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const onClick = () => {
    Promise.resolve().then(() => {
      setA((v) => v + 1);
      setB((v) => v + 1);
    });
  };
  return <button onClick={onClick}>{a}-{b}</button>;
}
```
### 原理讲解
18 把更多异步场景下的多次 state 更新合并为一次渲染。

## 3) `startTransition` / `useTransition`
### 代码示例
```tsx
import { useState, useTransition } from "react";

export default function SearchList() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const onChange = (v: string) => {
    setText(v); // 高优先级：输入
    startTransition(() => setQuery(v)); // 低优先级：列表过滤
  };

  return (
    <>
      <input value={text} onChange={(e) => onChange(e.target.value)} />
      {isPending ? <p>Loading...</p> : <p>Query: {query}</p>}
    </>
  );
}
```
### 原理讲解
把更新分优先级，保证输入等交互保持流畅。

## 4) `useDeferredValue`
### 代码示例
```tsx
import { useDeferredValue, useMemo, useState } from "react";

export default function DeferredDemo() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const list = useMemo(() => heavyFilter(deferred), [deferred]);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>items: {list.length}</p>
    </>
  );
}

function heavyFilter(keyword: string) {
  return Array.from({ length: 10000 }, (_, i) => `item-${i}`).filter((x) => x.includes(keyword));
}
```
### 原理讲解
延后低优先级值传播，避免高频输入卡顿。

## 5) Streaming SSR + Suspense（服务端流式渲染）
### 代码示例
```tsx
// Node 端示意
import { renderToPipeableStream } from "react-dom/server";

renderToPipeableStream(<App />, {
  onShellReady() {
    // 先返回壳，再逐步推送内容
  },
});
```
### 原理讲解
支持流式返回与分段展示，缩短可见时间并改善首屏体验。

## 面试口述模板
React 18 的关键词是并发渲染能力：`createRoot`、自动批处理、Transition、Deferred Value 和流式 SSR。目标是提升交互流畅度与首屏体验，而不是单纯追求一次性全量渲染。
