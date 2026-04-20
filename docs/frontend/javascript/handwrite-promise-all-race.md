---
title: 手写 Promise.all / Promise.race
---

# 手写 Promise.all / Promise.race（带讲解）

这题核心不是 API 背诵，而是理解两者的“完成条件”：

- `Promise.all`：全部成功才成功；任意一个失败就立刻失败。
- `Promise.race`：谁先 settle（成功或失败）就以谁为准。

---

## 一、手写 Promise.all

```js
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    const len = arr.length;

    // 边界：空数组直接成功
    if (len === 0) {
      resolve([]);
      return;
    }

    const results = new Array(len);
    let fulfilledCount = 0;

    arr.forEach((item, index) => {
      // 用 Promise.resolve 兼容普通值
      Promise.resolve(item)
        .then((value) => {
          results[index] = value; // 保证结果顺序和输入一致
          fulfilledCount += 1;
          if (fulfilledCount === len) {
            resolve(results);
          }
        })
        .catch((err) => {
          // 任意一个失败，整体立刻失败
          reject(err);
        });
    });
  });
}
```

### 讲解要点

1. **为什么要 `Promise.resolve(item)`**  
   因为传入可能是普通值（如 `123`）而不一定是 Promise，需要统一成 Promise 处理。

2. **为什么要 `results[index] = value`**  
   `all` 的返回顺序必须和输入顺序一致，而不是按完成先后。

3. **为什么失败要立刻 `reject`**  
   这是 `Promise.all` 语义：fail fast。

---

## 二、手写 Promise.race

```js
function myPromiseRace(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);

    // 空数组会一直 pending，这里保持原生语义（不主动 resolve/reject）
    arr.forEach((item) => {
      Promise.resolve(item).then(resolve, reject);
    });
  });
}
```

### 讲解要点

1. `race` 不关心顺序，只关心“第一个完成”的结果。  
2. 第一个如果成功就 `resolve`，第一个如果失败就 `reject`。  
3. 后续再完成的 Promise 会被忽略（状态已确定不可逆）。

---

## 三、快速测试

```js
const p1 = new Promise((r) => setTimeout(() => r('A'), 300));
const p2 = new Promise((r) => setTimeout(() => r('B'), 100));
const p3 = 42;

myPromiseAll([p1, p2, p3]).then(console.log); // ['A', 'B', 42]
myPromiseRace([p1, p2, p3]).then(console.log); // 42（同步值最快）
```

---

## 四、面试常见追问

### Q1：`Promise.all` 里有一个 reject 了，其他还会继续执行吗？

会继续执行（它们的异步任务无法被取消），但 `all` 返回的那个总 Promise 已经 reject 了。

### Q2：`Promise.race([])` 返回什么？

返回一个永远 pending 的 Promise（原生语义）。

### Q3：`Promise.all([])` 返回什么？

立即 resolve，一个空数组 `[]`。

---

## 五、30 秒口述模板

`Promise.all` 我会用计数器 + 结果数组实现：每个输入先 `Promise.resolve`，成功就按原索引写入，计数满了才 resolve；任意一个失败立刻 reject。  
`Promise.race` 更简单：把每个输入都 `Promise.resolve` 后直接 `then(resolve, reject)`，谁先完成就用谁的结果。
