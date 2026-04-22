---
title: Next.js 面试题（一）路由与渲染
---

# Next.js 面试题（一）路由与渲染

## 30 秒口述速记卡

- Next.js 是 React 全栈框架，核心价值是路由、渲染策略和全栈能力内建。
- App Router 是主线，依托 RSC、嵌套路由和流式渲染优化体验。
- SSR/SSG/ISR 本质是“页面何时生成”，按实时性和成本选型。
- RSC 负责服务端取数和拼装，`use client` 负责交互，边界要收敛。
- 面试高分点：讲“为什么这样选”，不只背概念。

## 本篇固定模板说明（5 题）

每题统一结构：**代码示例 -> 原理讲解 -> 高频追问 -> 面试口述模板**。

## 1) Next.js 是什么？核心价值是什么？
### 代码示例
```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js</h1>;
}
```
### 原理讲解
Next.js 是基于 React 的全栈框架，提供路由、SSR/SSG、数据获取、API 路由、构建优化等能力，目标是提升首屏性能和工程效率。
### 高频追问
### Next.js 和纯 React SPA 的最大区别？
Next.js 内置服务端渲染与文件路由，天然更适合 SEO、首屏性能和同构场景。
### 技术要点总结
Next.js = React 的工程化增强框架，重点解决路由、渲染策略和全栈集成问题。

## 2) App Router 和 Pages Router 的区别？
### 代码示例
```txt
Pages Router: pages/*.tsx
App Router: app/**/page.tsx + layout.tsx + server components
```
### 原理讲解
App Router 是新架构，基于 React Server Components，支持嵌套布局、流式渲染和更细粒度的数据获取；Pages Router 更传统、学习成本更低。
### 高频追问
### 新项目应该选哪个？
优先 App Router，除非已有大量 Pages Router 历史资产。
### 技术要点总结
App Router 是 Next.js 未来方向，核心优势是 RSC + 嵌套布局 + 流式渲染。

## 3) SSR / SSG / ISR 分别是什么？
### 代码示例
```ts
await fetch(url, { cache: "force-cache" }); // 类似 SSG
await fetch(url, { cache: "no-store" }); // SSR
await fetch(url, { next: { revalidate: 60 } }); // ISR
```
### 原理讲解
SSR 每次请求服务端生成；SSG 构建时生成静态页；ISR 在静态基础上按周期增量再生成。
### 高频追问
### 选型原则？
看实时性、SEO、成本：实时强选 SSR；稳定内容选 SSG/ISR。
### 技术要点总结
三者本质是“何时生成 HTML”的不同策略，用实时性换性能与成本。

## 4) React Server Component（RSC）是什么？
### 代码示例
```tsx
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const users = await fetch("https://api.example.com/users").then((r) => r.json());
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```
### 原理讲解
RSC 在服务端执行，不把组件 JS 发送到浏览器，可减少客户端 bundle；交互逻辑需放在 Client Component。
### 高频追问
### 怎么声明 Client Component？
文件顶部加 `"use client"`。
### 技术要点总结
RSC 负责“取数+组装 UI”，Client Component 负责“交互+状态”。

## 5) `use client` 的作用与边界
### 代码示例
```tsx
"use client";
import { useState } from "react";
export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN((v) => v + 1)}>{n}</button>;
}
```
### 原理讲解
`use client` 会把该文件及其依赖纳入客户端 bundle，应尽量下沉到最小交互单元，避免整页变重。
### 高频追问
### Server Component 能 import Client Component 吗？
可以；反过来不行（Client 不能直接 import Server-only 逻辑）。
### 技术要点总结
`use client` 是边界声明，不要滥用，避免拖大前端包体积。
