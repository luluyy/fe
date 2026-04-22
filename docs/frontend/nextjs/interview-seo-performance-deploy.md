---
title: Next.js 面试题（三）SEO、性能与部署排障
---

# Next.js 面试题（三）SEO、性能与部署排障

## 30 秒口述速记卡

- `next/image` 通过尺寸约束、懒加载和格式优化改善 LCP/CLS。
- SEO 关键是服务端可抓取内容 + metadata 输出（如 `generateMetadata`）。
- 性能优化优先减少首屏 JS，控制 `use client` 边界与按需加载。
- 非 Vercel 平台部署要重点核对运行时能力、缓存层和环境变量。
- 排障先保可用：先止血回滚，再做根因分析与防再发。

## 本篇固定模板说明（5 题）

每题统一结构：**代码示例 -> 原理讲解 -> 高频追问 -> 面试口述模板**。

## 1) Next.js 图片优化 `next/image` 原理
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
### 技术要点总结
`next/image` 的价值是“性能默认值更好”，尤其对 LCP/CLS 友好。

## 2) SEO 在 Next.js 里怎么做？
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
### 技术要点总结
Next.js SEO 关键是服务端输出可索引内容和准确 metadata。

## 3) 性能优化常见手段（Next.js 语境）
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
### 技术要点总结
Next.js 性能优化就是减少首屏 JS + 合理渲染策略 + 精细缓存。

## 4) 部署到 Vercel 之外有什么注意点？
### 代码示例
```txt
关注 Node 版本、环境变量、文件系统可写性、缓存与 CDN 方案。
```
### 原理讲解
Next.js 在不同平台能力不完全一致，尤其是边缘运行时与 ISR 行为。
### 高频追问
### 为什么本地好好的，线上 ISR 不生效？
通常与平台缓存层、构建输出模式、权限配置相关。
### 技术要点总结
部署问题本质是“框架能力 + 平台能力”匹配问题。

## 5) Next.js 常见线上故障怎么排查？
### 代码示例
```txt
先看 500 日志 -> 定位路由层/数据层 -> 检查缓存策略 -> 回滚
```
### 原理讲解
高频问题：服务端异常、环境变量缺失、缓存导致脏数据、客户端水合不一致。
### 高频追问
### 水合不一致典型原因？
服务端和客户端渲染结果不一致（时间、随机数、浏览器专属 API）。
### 技术要点总结
排障优先级：可用性优先，先止血回滚，再做根因修复和防再发。
