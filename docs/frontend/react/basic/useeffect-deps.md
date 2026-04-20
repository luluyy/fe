---
title: useEffect 依赖数组
---

# useEffect 依赖数组怎么理解？

- 不传：每次渲染后都执行。
- `[]`：仅首次执行（和卸载 cleanup）。
- `[a, b]`：`a/b` 变化时执行。

## 执行时机要点

- effect 总是在提交阶段执行，不在渲染函数里执行。
- 当依赖变化时：先执行上一次 cleanup，再执行新的 effect。

## 常见坑

依赖漏写会造成闭包拿到旧值；依赖乱写会造成重复请求。

### 坑 1：漏依赖（stale closure）

```tsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []); // count 漏了，会一直打印旧值
```

### 坑 2：把对象/函数直接放依赖导致频繁触发

```tsx
const options = {page: 1}; // 每次 render 都是新引用
useEffect(() => {
  fetchData(options);
}, [options]); // 容易重复执行
```

可用 `useMemo` / `useCallback` 稳定引用。

## 面试答题建议

1. 先说三种依赖写法。
2. 再说“先 cleanup 再执行新 effect”。
3. 补充 stale closure 与引用类型依赖问题。

## 20 秒口述模板

`useEffect` 依赖数组决定 effect 是否重跑：不传每次都跑，空数组只在挂载和卸载时机跑，有依赖则在依赖变化时跑。变化时会先 cleanup 再执行新 effect，常见问题是漏依赖和依赖引用不稳定。
