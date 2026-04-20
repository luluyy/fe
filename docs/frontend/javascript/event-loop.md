---
title: 事件循环（Event Loop）
---

# 事件循环

JavaScript 先执行同步代码，再按队列调度异步任务。每轮事件循环会先清空微任务，再进入下一个宏任务。

```ts
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1 4 3 2
```
