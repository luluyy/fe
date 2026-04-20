---
title: Hook 使用规则
---

# Hook 规则

Hook 必须在函数组件或自定义 Hook 顶层调用，不能放在条件/循环里。

原因：React 依赖固定调用顺序来匹配每个 Hook 的状态槽位。
