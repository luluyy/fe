---
title: 自定义 Hook 设计
---

# 自定义 Hook 设计

高质量 Hook 的目标：**复用逻辑、隔离副作用、暴露稳定接口**。

## 设计原则

1. 命名以 `use` 开头，符合 Hook 规则。
2. 单一职责：一个 Hook 解决一类问题。
3. 输入输出清晰：参数、返回值可预测。
4. 副作用可控：清理逻辑完整。
5. 尽量暴露稳定引用（必要时 `useMemo/useCallback`）。

## 示例：`useDebounceValue`

```tsx
function useDebounceValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

## 高频追问

### Q1：Hook 里能不能写条件调用？

不能，Hook 调用顺序必须稳定。

### Q2：如何避免 Hook 返回对象导致子组件频繁渲染？

可在 Hook 内部对返回对象/函数做稳定化处理，或由调用方 memo。

### Q3：如何测试自定义 Hook？

用 hook 测试工具（如 React Testing Library 的 hooks 能力）验证状态流转和副作用清理。

## 30 秒口述模板

自定义 Hook 是函数组件逻辑复用方案。设计上强调单一职责、清晰输入输出和可清理副作用。典型如 `useDebounce`、`useRequest`，既减少重复代码，也提升测试和维护效率。
