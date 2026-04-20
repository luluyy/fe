---
title: 原型链
---

# 原型链

对象属性查找会沿 `[[Prototype]]` 向上查找，直到 `null` 为止。构造函数的 `prototype` 用于给实例共享方法。

 
```ts
function A(this: any) {}
(A as any).prototype.say = function () {
  return 'hi';
};
```


原型链就是：对象在访问属性/方法时的一条向上查找链路。

简单说：

先在对象自身找这个属性
找不到就去它的原型对象找
还找不到就继续沿着原型的原型往上找
一直找到 null 为止（终点）
例如：
```ts   
obj -> obj.__proto__ -> obj.__proto__.__proto__ -> ... -> null
```
### 为什么有它
为了复用方法，避免每个实例都拷贝一份函数，节省内存。

一个直观例子
arr.map(...)
arr 自己并没有 map 这个自有属性，它来自 Array.prototype，这就是沿原型链查找到的。

面试一句话回答
原型链是 JavaScript 对象的属性查找机制：对象查找失败后会沿 [[Prototype]] 逐级向上，直到 null。