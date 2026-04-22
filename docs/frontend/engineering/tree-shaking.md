---
title: Tree Shaking 是什么
---

# Tree Shaking

Tree Shaking 是构建阶段删除未使用代码（dead code）的优化手段。

## 生效前提

- 使用 ES Module（`import` / `export`）。
- 依赖包标记 `sideEffects`（避免误删有副作用的文件）。

## 技术回答要点

“静态分析 + ESM + sideEffects 配置”三点讲清即可。
