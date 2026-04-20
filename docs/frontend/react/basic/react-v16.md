---
title: React 16 新特性详解
---

# React 16 新特性详解

## 1) Fiber 架构（重写协调器）
### 代码示例
```tsx
import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div>Fiber allows interruptible rendering internally.</div>;
}

createRoot(document.getElementById("root")!).render(<App />);
```
### 原理讲解
React 16 把旧的同步递归协调器替换成 Fiber。Fiber 把渲染任务拆成更细粒度单元，后续版本（18 的并发能力）就是基于这个基础演进。

## 2) Error Boundaries（错误边界）
### 代码示例
```tsx
import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("Captured error:", error);
  }
  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```
### 原理讲解
子树渲染出错时，错误边界可兜底，避免整个应用白屏。

## 3) Fragments（不额外生成 DOM）
### 代码示例
```tsx
function ListItem() {
  return (
    <>
      <td>Name</td>
      <td>Age</td>
    </>
  );
}
```
### 原理讲解
Fragment 让组件返回多个子节点，不额外套一层 `div`。

## 4) Portals（跨层级渲染）
### 代码示例
```tsx
import { createPortal } from "react-dom";

function Modal({ children }: { children: React.ReactNode }) {
  const el = document.getElementById("modal-root");
  if (!el) return null;
  return createPortal(children, el);
}
```
### 原理讲解
Portal 可把 UI 渲染到 DOM 其它节点，常用于弹窗、抽屉、Tooltip。

## 5) 新生命周期与弃用旧生命周期
### 代码示例
```tsx
class Demo extends React.Component<{ value: number }, { derived: number }> {
  state = { derived: 0 };
  static getDerivedStateFromProps(nextProps: { value: number }) {
    return { derived: nextProps.value * 2 };
  }
  getSnapshotBeforeUpdate() {
    return window.scrollY;
  }
  componentDidUpdate(_: unknown, __: unknown, snapshot: number) {
    console.log("previous scroll:", snapshot);
  }
  render() {
    return <div>{this.state.derived}</div>;
  }
}
```
### 原理讲解
引入更安全生命周期（如 `getDerivedStateFromProps`），旧生命周期逐步标记为不推荐。

## 面试口述模板
React 16 的里程碑是 Fiber 架构，奠定了后续并发渲染基础；同时引入 Error Boundary、Fragments、Portals 和新生命周期，核心是提升稳定性和渲染能力。
