---
title: Next.js 面试题（基础 + 进阶）
---


# Next.js 面试题（基础 + 进阶）
  

这篇改为总览入口，15 题已按主题拆分为 3 篇，阅读更聚焦：

1. `frontend/nextjs/interview-routing-rendering`  
   - 框架认知、App Router、SSR/SSG/ISR、RSC、`use client`
2. `frontend/nextjs/interview-data-api`  
   - 缓存策略、动态路由、Route Handlers、Middleware、Server Actions
3. `frontend/nextjs/interview-seo-performance-deploy`  
   - `next/image`、metadata SEO、性能优化、部署与故障排查

建议复习顺序：路由与渲染 -> 数据与接口 -> SEO/性能/部署。

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
### 面试口述模板
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
### 面试口述模板
App Router 是 Next.js 未来方向，核心优势是 RSC + 嵌套布局 + 流式渲染。

## 3) SSR / SSG / ISR 分别是什么？
### 代码示例
```ts
// App Router 里通过 fetch 缓存策略体现
await fetch(url, { cache: "force-cache" }); // 类似 SSG
await fetch(url, { cache: "no-store" }); // SSR
await fetch(url, { next: { revalidate: 60 } }); // ISR
```
### 原理讲解
SSR 每次请求服务端生成；SSG 构建时生成静态页；ISR 在静态基础上按周期增量再生成。
### 高频追问
### 选型原则？
看实时性、SEO、成本：实时强选 SSR；稳定内容选 SSG/ISR。
### 面试口述模板
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
### 面试口述模板
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
### 面试口述模板
`use client` 是边界声明，不要滥用，避免拖大前端包体积。

## 6) Next.js 缓存策略怎么理解？
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

## 7) 动态路由怎么写？
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

## 8) Route Handlers 和传统 API Route 的区别
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

## 9) Middleware 能做什么？
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

## 10) Next.js 图片优化 `next/image` 原理
### 代码示例
```tsx
import Image from "next/image";
<Image src="/avatar.png" alt="avatar" width={96} height={96} />;
```
### 原理讲解
自动做尺寸控制、懒加载与格式优化，减少无效传输。
### 高频追问
### 为什么要提供 width/height？
可提前占位，减少布局偏移（CLS）。
### 面试口述模板
`next/image` 的价值是“性能默认值更好”，尤其对 LCP/CLS 友好。

## 11) SEO 在 Next.js 里怎么做？
### 代码示例
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata() {
  return { title: "文章标题", description: "文章摘要" };
}
```
### 原理讲解
通过服务端渲染 + metadata API 输出可抓取内容与 meta 信息。
### 高频追问
### SPA 为什么 SEO 弱？
首屏主要靠客户端 JS，爬虫抓取稳定性和完整性较差。
### 面试口述模板
Next.js SEO 关键是服务端输出可索引内容和准确 metadata。

## 12) 性能优化常见手段（Next.js 语境）
### 代码示例
```tsx
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("./Chart"), { ssr: false });
```
### 原理讲解
常见手段：按路由/组件拆包、减少 `use client` 边界、缓存静态数据、图片优化、流式渲染。
### 高频追问
### 什么情况下关掉 SSR（`ssr: false`）？
仅浏览器可用组件（依赖 `window`）且 SEO 不关键时。
### 面试口述模板
Next.js 性能优化就是减少首屏 JS + 合理渲染策略 + 精细缓存。

## 13) Server Actions 是什么？
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

## 14) 部署到 Vercel 之外有什么注意点？
### 代码示例
```txt
关注 Node 版本、环境变量、文件系统可写性、缓存与 CDN 方案。
```
### 原理讲解
Next.js 在不同平台能力不完全一致，尤其是边缘运行时与 ISR 行为。
### 高频追问
### 为什么本地好好的，线上 ISR 不生效？
通常与平台缓存层、构建输出模式、权限配置相关。
### 面试口述模板
部署问题本质是“框架能力 + 平台能力”匹配问题。

## 15) Next.js 常见线上故障怎么排查？
### 代码示例
```txt
先看 500 日志 -> 定位路由层/数据层 -> 检查缓存策略 -> 回滚
```
### 原理讲解
高频问题：服务端异常、环境变量缺失、缓存导致脏数据、客户端水合不一致。
### 高频追问
### 水合不一致典型原因？
服务端和客户端渲染结果不一致（时间、随机数、浏览器专属 API）。
### 面试口述模板
排障优先级：可用性优先，先止血回滚，再做根因修复和防再发。
