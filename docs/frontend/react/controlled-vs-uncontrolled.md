---
title: 受控组件与非受控组件
---

# 受控 vs 非受控

- 受控：表单值由 React state 管理（`value` + `onChange`）。
- 非受控：表单值由 DOM 管理，通常用 `ref` 读取。

复杂业务表单一般优先受控。
