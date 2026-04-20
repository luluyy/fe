---
title: React 严格模式（StrictMode）
---

# React 严格模式是什么？

`<React.StrictMode>` 是开发环境下的检查工具，用来帮助你提前发现不安全副作用、过时 API 使用和潜在兼容问题。

> 重点：它主要影响开发体验，不会把这些额外检查直接带到生产环境行为里。

## 你会看到什么现象？

在开发环境里，某些生命周期与副作用会被“额外调用/验证”，最典型就是：

- 组件函数可能额外执行一次
- `useEffect` 的 mount/cleanup 流程会额外跑一轮

这不是 bug，而是 StrictMode 故意帮你测出“副作用是否可重复执行、是否正确清理”。

## 为什么 React 要这么做？

为了让你的代码更适应未来并发能力和可中断渲染场景，避免这些问题：

- 在 render 里写副作用（请求、订阅、改 DOM）
- effect 没有 cleanup 导致内存泄漏
- 依赖写错导致闭包拿旧值

## 示例：为什么看起来 effect 执行了两次

```tsx
useEffect(() => {
  console.log('effect mount');
  return () => console.log('effect cleanup');
}, []);
```

在 StrictMode 开发环境下，可能看到：

1. mount
2. cleanup
3. mount

这是 React 用来验证 cleanup 是否正确。

## 如何开启

通常在入口包裹：

```tsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

## 面试易错点

- 严格模式 ≠ JS 的 `'use strict'`（那是语言层面的严格模式）
- 严格模式下开发看到的“重复调用”不等于生产环境会重复请求

## 30 秒口述模板

React StrictMode 是开发期检查机制，不是生产功能。它会通过额外执行某些流程来暴露副作用不幂等、cleanup 缺失等问题，帮助代码更安全地适配并发和可中断渲染。
