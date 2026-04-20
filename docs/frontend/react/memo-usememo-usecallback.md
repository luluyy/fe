---
title: memo、useMemo、useCallback 区别
---

# 三者区别

- `React.memo`：缓存组件渲染结果（props 不变时减少重渲染）。
- `useMemo`：缓存计算结果。
- `useCallback`：缓存函数引用。

先定位性能瓶颈，再使用这些优化手段。
