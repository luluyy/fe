---
title: React 生命周期（函数组件视角）
---

# React 生命周期（函数组件）

函数组件没有 class 生命周期方法，但可以用 Hook 对应：

- 挂载后：`useEffect(() => {}, [])`
- 更新后：`useEffect(() => {}, [deps])`
- 卸载前：`useEffect(() => () => {}, [])`

## 更准确的理解（React 18）

- **渲染阶段**：根据 state/props 计算 UI（纯计算，不应写副作用）。
- **提交阶段**：DOM 更新完成后再执行副作用（`useEffect`）。
- `cleanup` 会在两种时机触发：
  - 组件卸载时
  - effect 下一次执行前（依赖变化时）

## 典型代码

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(id); // cleanup
}, []);
```

## 高频追问

### 为什么开发环境 effect 会执行两次？

React StrictMode 在开发环境会额外执行一次 mount/unmount 流程，帮助你发现副作用不幂等问题（生产环境不会这样双调用）。

### useEffect 和 useLayoutEffect 区别？

- `useEffect`：浏览器绘制后执行，不阻塞渲染。
- `useLayoutEffect`：DOM 提交后、绘制前同步执行，可能阻塞绘制。

## 20 秒口述模板

函数组件没有 class 生命周期，但可以用 Hook 映射：`useEffect([], ...)` 类似挂载后，依赖变化时重新执行，返回函数处理卸载和重执行前清理。面试重点是“渲染阶段和副作用阶段分离”以及 cleanup 时机。
