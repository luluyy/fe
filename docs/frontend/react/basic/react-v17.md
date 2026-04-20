---
title: React 17 新特性详解
---

# React 17 新特性详解

## 1) “No New Features” 版本定位
### 代码示例
```tsx
// React 17 更像过渡版本，API 变化很少
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<div>React 17 transition release</div>, document.getElementById("root"));
```
### 原理讲解
React 17 主要目标是升级兼容与渐进迁移，不是功能爆发版本。

## 2) 事件系统从 document 挂载改为 root 容器
### 代码示例
```tsx
import React from "react";
import ReactDOM from "react-dom";

const rootA = document.getElementById("root-a")!;
const rootB = document.getElementById("root-b")!;

ReactDOM.render(<button onClick={() => console.log("A click")}>A</button>, rootA);
ReactDOM.render(<button onClick={() => console.log("B click")}>B</button>, rootB);
```
### 原理讲解
事件委托从 `document` 改到各 root 容器，提升多版本 React 共存与微前端场景兼容性。

## 3) 改进升级路径（渐进升级支持）
### 代码示例
```txt
应用可逐步升级子应用 React 版本，而不是一次性大迁移。
```
### 原理讲解
17 重点在“让未来升级到 18 更平滑”，降低大项目升级风险。

## 4) JSX 转换可不显式引入 React
### 代码示例
```tsx
// 在新 JSX transform 下可不写: import React from "react";
export default function App() {
  return <h1>Hello JSX Transform</h1>;
}
```
### 原理讲解
配合新编译器转换，JSX 文件不再必须手动引入 React。

## 5) Effect 清理与执行行为更可预期
### 代码示例
```tsx
import { useEffect } from "react";

function Demo() {
  useEffect(() => {
    const id = setInterval(() => {}, 1000);
    return () => clearInterval(id);
  }, []);
  return null;
}
```
### 原理讲解
17 对内部行为细节做稳定性增强，让调试和迁移更可控。

## 面试口述模板
React 17 核心不是新 API，而是“升级工程化”：事件系统改为 root 级委托、支持多版本共存、为 18 铺路，并配合新 JSX transform 改善开发体验。
