---
title: Context 性能优化
---

# Context 性能优化

Context 的核心问题：**Provider 的 value 引用变化时，相关消费者都可能重渲染**。

## 为什么会重渲染？

当 `value` 是对象且每次 render 都创建新引用时，即使字段值没变，消费者也会收到“变化通知”。

## 常见优化策略

1. 拆分 Context：按业务域拆成多个 Provider，减少更新波及面。
2. 稳定 `value` 引用：`useMemo` 包裹 value。
3. 状态分层：高频变化状态不要全放全局 Context。
4. 组件层优化：消费者组件配合 `memo`、拆分读取范围。

## 示例

```tsx
const value = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme]);
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

## 高频追问

### Q1：只用 `useMemo` 就够了吗？

不一定。若 Context 设计过大，仍会导致不必要更新；拆分 Context 往往更关键。

### Q2：什么时候该用 Context，什么时候该用状态库？

跨层共享且更新频率不高可用 Context；复杂全局状态、频繁更新可考虑 Zustand/Redux 等。

### Q3：如何排查 Context 引发的性能问题？

用 React DevTools Profiler 看“谁因为 Provider 更新而重渲染”，再拆分和下沉状态。

## 30 秒口述模板

Context 性能问题主要来自 value 引用变化引发的广播式重渲染。优化路径是拆分 Context、稳定 value 引用、把高频状态从全局 Context 中剥离，并结合组件级 memo 做精准控制。
