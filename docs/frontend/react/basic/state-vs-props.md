---
title: state 和 props 区别
---

# state vs props

- `props`：父组件传入，只读。
- `state`：组件内部状态，可通过 setState/useState 更新。

## 什么时候用 props，什么时候用 state？

- **props**：组件“输入参数”，用于配置组件行为/展示。
- **state**：组件“可变数据”，用于响应用户交互和异步结果。

## 常见面试场景

### 场景 1：表单输入值放哪？

- 单组件内部用：放 `state`
- 多组件共享：提升到共同父组件，再通过 `props` 下发

### 场景 2：props 能不能改？

不能直接改。props 是只读约定，修改应由父组件更新后重新传入。

## 代码示例

```tsx
function Counter({step}: {step: number}) {
  const [count, setCount] = useState(0); // state

  return (
    <button onClick={() => setCount((c) => c + step)}>
      {count}
    </button>
  );
}
```

这里 `step` 是 props（外部给），`count` 是 state（内部维护）。

## 20 秒口述模板

props 是父组件传入的只读输入，state 是组件内部可变状态。React 通过单向数据流把 state 变化映射到 UI；共享状态要上提到父组件，再以 props 下发。
