---
title: target 和 currentTarget 的区别
---

# target vs currentTarget

这是事件机制里的高频面试题，尤其常和“事件委托”一起考。

## 核心区别

- `event.target`：事件最初触发的元素（真实点击源）。
- `event.currentTarget`：当前执行监听器的元素（谁绑定了监听器）。

## 示例

```html
<ul id="list">
  <li><button id="btn">删除</button></li>
</ul>
```

```js
const list = document.getElementById('list');
list.addEventListener('click', (event) => {
  console.log('target:', event.target.id); // 可能是 btn
  console.log('currentTarget:', event.currentTarget.id); // 一直是 list
});
```

当你点击按钮时：

- `target` 指向 `button#btn`
- `currentTarget` 指向绑定监听器的 `ul#list`

## 在事件委托中的使用

- 通过 `target` 判断“点到的是谁”。
- 通过 `currentTarget` 保证“处理逻辑在容器上”。

常见写法：

```js
container.addEventListener('click', (event) => {
  const el = event.target.closest('.item');
  if (!el || !event.currentTarget.contains(el)) return;
  // handle item click...
});
```

## 技术要点总结（15 秒）

`target` 是事件源，`currentTarget` 是当前处理者。在事件委托里通常用 `target` 做命中判断，用 `currentTarget` 作为边界容器。
