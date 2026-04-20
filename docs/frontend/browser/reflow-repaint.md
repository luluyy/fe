---
title: 重排与重绘
---

# 重排（Reflow）与重绘（Repaint）

- 重排：布局几何信息变化，开销更大。
- 重绘：仅视觉变化，不改布局，开销更小。

优化方向：减少频繁 DOM 读写、优先用 `transform` 与 `opacity` 做动画。
