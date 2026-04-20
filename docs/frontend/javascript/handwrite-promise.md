---
title: 手写 Promise（简版）
---

# 如何手写一个 Promise？

面试通常不要求完整规范实现，写出核心流程即可：状态、回调队列、异步执行、链式 then。

## 简版实现（可运行）

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn());
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    const realOnRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const runFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const runRejected = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.state === 'fulfilled') runFulfilled();
      else if (this.state === 'rejected') runRejected();
      else {
        this.onFulfilledCallbacks.push(runFulfilled);
        this.onRejectedCallbacks.push(runRejected);
      }
    });

    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('Chaining cycle'));
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}
```

## 面试讲解顺序

1. 先说三态：`pending/fulfilled/rejected` 且状态不可逆。
2. 再说回调缓存：pending 时把回调先存起来。
3. 解释 then 返回新 Promise，支持链式调用。
4. 说明异步时机（微任务）和异常穿透。
