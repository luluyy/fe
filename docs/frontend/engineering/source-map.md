---
title: Source Map 的作用
---

# Source Map

Source Map 用于把压缩/转译后的代码映射回源码，便于调试和错误定位。

## 注意点

- 生产环境通常用受控策略（如 hidden-source-map）。
- 避免把完整源码暴露给公网。

## 技术回答要点

“定位线上错误很关键，但要兼顾源码安全”。
