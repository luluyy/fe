---
title: 手写 bind
---

# 如何手写一个 bind？

`bind` 的核心是：返回一个新函数，并把 `this` 固定到指定对象，同时支持预置参数。

## 基础版实现

```js
if (!Function.prototype.myBind) {
  Function.prototype.myBind = function (context, ...presetArgs) {
    const fn = this;
    return function (...laterArgs) {
      return fn.apply(context, [...presetArgs, ...laterArgs]);
    };
  };
}
```

## 支持 new 调用的进阶版

```js
if (!Function.prototype.myBind2) {
  Function.prototype.myBind2 = function (context, ...presetArgs) {
    const fn = this;

    function bound(...laterArgs) {
      // new bound() 时，this 应该指向新实例，而不是 context
      const isNewCall = this instanceof bound;
      const thisArg = isNewCall ? this : context;
      return fn.apply(thisArg, [...presetArgs, ...laterArgs]);
    }

    // 维护原型链关系
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
```

## 技术解释要点

1. `bind` 不会立刻执行，返回新函数。
2. 新函数合并“预置参数 + 调用时参数”。
3. 若被 `new` 调用，`this` 需要指向新实例（这是高频追问）。
