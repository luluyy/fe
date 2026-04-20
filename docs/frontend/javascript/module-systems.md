---
title: CommonJS、AMD、CMD、ESM 是什么？
---

# CommonJS、AMD、CMD、ESM 是什么？

## 代码示例

### CommonJS
```js
// a.js
const b = require("./b");
module.exports = { b };
```

### AMD
```js
define(["dep1", "dep2"], function (dep1, dep2) {
  return { dep1, dep2 };
});
```

### CMD
```js
define(function (require, exports, module) {
  const dep = require("./dep");
  exports.run = () => dep.work();
});
```

### ESM
```js
import { foo } from "./foo.js";
export const bar = foo + 1;
```

## 原理讲解

- `CommonJS`：Node 生态主流规范，`require` 在运行时执行，模块加载是同步的。
- `AMD`：为早期浏览器异步加载设计，依赖前置声明（`define([...], fn)`）。
- `CMD`：与 AMD 同时代，特点是依赖就近声明（`define(function(require){...})`）。
- `ESM`：ECMAScript 官方标准模块系统，语法静态、可分析，天然更利于 tree-shaking。

核心对比可以记为：

- **加载方式**：CJS 同步；AMD/CMD 异步；ESM 原生模块化（浏览器按模块请求，构建阶段可打包优化）。
- **分析时机**：CJS 偏运行时；ESM 可静态分析。
- **现代主流**：新项目基本优先 ESM。

## 练习

### 练习 1（基础）

为什么说 ESM 比 CommonJS 更利于 tree-shaking？

### 练习 1 参考答案

因为 ESM 的 `import/export` 是静态语法，构建工具在编译期就能确定依赖关系和导出使用情况，从而安全删除未使用代码；CommonJS 的 `require` 是运行时执行，静态分析难度更高。

### 练习 2（进阶）

在浏览器里为什么 AMD/CMD 曾经流行，后来又逐步被 ESM + 构建工具替代？

### 练习 2 参考答案

- 早期浏览器没有原生模块标准，AMD/CMD 解决了“异步加载脚本”的现实问题。
- 随着 ESM 成为标准、打包工具成熟，统一语法和生态后，维护成本更低。
- 现代工程化还需要 tree-shaking、代码分割、产物优化，ESM 生态更适配。

## 高频追问

### CommonJS 和 ESM 可以互相导入吗？

可以，但要看运行环境和工具链兼容策略。Node 下常见互操作细节包括 `default` 包装、`type` 字段、文件扩展名规则等。

### AMD 和 CMD 现在还有必要学吗？

在新项目里很少直接使用，但面试常考“模块化演进史”和历史项目兼容，了解差异有价值。

### ESM 一定比 CJS 快吗？

不绝对。性能取决于运行环境、网络、构建与缓存策略。ESM 的核心优势是标准化和可静态分析能力。

## 面试口述模板

模块化经历了从社区规范到语言标准的演进：Node 时代常见 CommonJS（同步、运行时 require）；浏览器早期有 AMD/CMD 解决异步加载；现在主流是 ESM，因其静态语法更利于 tree-shaking 和工程优化。新项目一般优先 ESM。
