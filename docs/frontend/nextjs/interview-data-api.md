---
title: Next.js 面试题（二）数据、路由与接口
---

# Next.js 面试题（二）数据、路由与接口

## 30 秒口述速记卡

- Next.js 的数据策略核心是 `fetch` 缓存：`force-cache`、`no-store`、`revalidate`。
- 动态路由用文件系统参数化，必要时配合 `generateStaticParams` 预渲染。
- Route Handlers 是 App Router 的接口入口，适合做轻中量 BFF。
- Middleware 只做前置轻逻辑，不做重查询和重计算。
- Server Actions 提效明显，但鉴权与参数校验不能省略。

## 本篇固定模板说明（5 题）

每题统一结构：**代码示例 -> 原理讲解 -> 高频追问 -> 面试口述模板**。

## 1) Next.js 缓存策略怎么理解？
### 代码示例
```ts
fetch(url, { cache: "force-cache" });
fetch(url, { cache: "no-store" });
fetch(url, { next: { revalidate: 300 } });
```
### 原理讲解
Next.js 对 `fetch` 做了增强，缓存策略直接影响页面是静态、动态还是可增量更新。
### 高频追问
### 为什么“改了数据页面不更新”？
通常是缓存命中导致，需要 `revalidatePath`/`revalidateTag` 或改缓存策略。
### 面试口述模板
先定义数据新鲜度，再映射到 `force-cache` / `no-store` / `revalidate`。

## 2) 动态路由怎么写？
### 代码示例
```tsx
// app/blog/[slug]/page.tsx
export default function BlogPage({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;
}
```
### 原理讲解
`[slug]` 单段动态，`[...slug]` 捕获多段，`[[...slug]]` 可选多段。
### 高频追问
### 什么时候用 `generateStaticParams`？
想在构建期预渲染部分动态路径时使用。
### 面试口述模板
动态路由是文件系统路由的参数化能力，可配合静态预生成优化性能。

## 3) Route Handlers 和传统 API Route 的区别
### 代码示例
```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true });
}
```
### 原理讲解
App Router 用 `route.ts` 声明接口，基于 Web 标准 Request/Response，更统一。
### 高频追问
### 适合放复杂 BFF 吗？
可以，但复杂场景仍要注意拆层与可测试性。
### 面试口述模板
Route Handlers 是 Next.js 全栈能力的关键入口，适合轻中量 BFF。

## 4) Middleware 能做什么？
### 代码示例
```ts
// middleware.ts
import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next();
}
```
### 原理讲解
Middleware 运行在请求进入路由前，常用于鉴权、重写、重定向、A/B 分流。
### 高频追问
### Middleware 里能做重 DB 查询吗？
不建议，应该保持轻量，避免拉高全站延迟。
### 面试口述模板
Middleware 适合前置轻逻辑，重业务应放路由处理层。

## 5) Server Actions 是什么？
### 代码示例
```tsx
// app/actions.ts
"use server";
export async function createPost(formData: FormData) {
  // write db
}
```
### 原理讲解
Server Actions 允许从组件直接触发服务端函数，减少手写 API 样板代码。
### 高频追问
### 安全上要注意什么？
服务端仍需鉴权和参数校验，不能因为是 action 就省略。
### 面试口述模板
Server Actions 提升开发效率，但安全校验流程不能省。
