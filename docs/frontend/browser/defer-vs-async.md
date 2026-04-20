---
title: defer 是什么？和 async 有什么区别？
---

# defer 是什么？和 async 有什么区别？

## 代码示例

```html
<!-- 推荐：业务脚本多数用 defer -->
<script defer src="/a.js"></script>
<script defer src="/b.js"></script>

<!-- 独立统计脚本常用 async -->
<script async src="/analytics.js"></script>
```

## 原理讲解

- `defer`：脚本会并行下载，但**不会阻塞 HTML 解析**；等 DOM 解析完成后再执行，且多个 `defer` 脚本按出现顺序执行。
- `async`：脚本也并行下载，但下载完成就立刻执行；执行时机不确定，多个 `async` 之间也不保证顺序。
- 不加属性的普通 `script`：会阻塞解析，下载+执行完才继续解析页面。

一句话记忆：

- 要“**不阻塞 + 保序 + DOM 就绪后执行**”选 `defer`。
- 要“**谁先下好谁先跑**”选 `async`。

## 练习

### 练习 1（基础）

你有两个脚本：`vendor.js` 和 `app.js`，其中 `app.js` 依赖 `vendor.js`。应该怎么写？

### 练习 1 参考答案

```html
<script defer src="/vendor.js"></script>
<script defer src="/app.js"></script>
```

原因：`defer` 会保持顺序，避免依赖脚本先后错乱。

### 练习 2（进阶）

为什么把 `script` 放在 `body` 底部，仍然有人推荐用 `defer`？

### 练习 2 参考答案

- `defer` 语义更明确：告诉浏览器这是“延后执行脚本”。
- 即便脚本位置变化（被移到 `head`），行为仍稳定。
- 便于统一团队规范和构建产物管理。

## 高频追问

### `defer` 一定在 `DOMContentLoaded` 前执行吗？

是的，`defer` 脚本会在 DOM 完成解析后、`DOMContentLoaded` 触发前执行完。

### `type="module"` 和 `defer` 的关系？

模块脚本默认就类似 `defer`（不阻塞解析，DOM 解析后执行）。但模块有自己的依赖加载和作用域机制。

### `defer` 能用于内联脚本吗？

不能。`defer` 对外链脚本（带 `src`）有效，对内联脚本无效。

## 面试口述模板

`defer` 的核心是“下载不阻塞解析、执行延后到 DOM 解析后、并且按顺序执行”。所以依赖链脚本一般用 `defer`，独立统计脚本可用 `async`。如果不用这两个属性，普通脚本会阻塞 HTML 解析，影响首屏。
