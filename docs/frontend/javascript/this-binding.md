---
title: this 指向规则
---

# this 指向规则

一句话：`this` 由**调用方式**决定，不由定义位置决定（箭头函数除外）。

## 常见绑定规则

1. 默认绑定：普通函数直接调用。
2. 隐式绑定：通过对象调用（`obj.fn()`）。
3. 显式绑定：`call/apply/bind` 指定 `this`。
4. `new` 绑定：构造调用时 `this` 指向新实例。
5. 箭头函数：没有自己的 `this`，继承定义时外层作用域。

优先级：`new` > 显式 > 隐式 > 默认（箭头函数走词法绑定，不参与这套比较）。

## 高频面试题讲法

### 1) 默认绑定

```js
function foo() {
  console.log(this);
}
foo();
```

- 非严格模式下浏览器一般是 `window`
- 严格模式是 `undefined`

### 2) 隐式绑定

```js
const obj = {
  a: 1,
  foo() {
    console.log(this.a);
  },
};
obj.foo(); // 1

const obj = {
  a: 1,
  get b() {
    return this.a + 2;
  }
};
obj.b; // 3

const obj = { a: 1, b: obj.a + '2' };
obj.b; // 12
```

### 3) 隐式丢失（高频）

```js
const bar = obj.foo;
bar(); // this 丢失，回到默认绑定
setTimeout(obj.foo, 0); // 也是同理
```

`this` 看的是“调用点”而不是“定义点”：

- `obj.foo()` 的调用点是对象方法调用，走隐式绑定，`this === obj`。
- `const bar = obj.foo` 只是把函数引用取出来，`bar()` 调用时左侧不再有对象，变成普通函数调用，回到默认绑定。
- `setTimeout(obj.foo, 0)` 本质也是“把函数当回调传入”，定时器触发时由宿主环境直接调用该函数，不再保留 `obj` 这个调用者。

### 如何避免 this 丢失

```js
const bar1 = obj.foo.bind(obj); // 显式绑定
const bar2 = () => obj.foo(); // 用包装函数保持调用点
```

面试可直接说：**this 丢失不是变量丢了，而是调用方式变了。**

### 4) call / apply / bind 区别

```js
function foo(x, y) {
  console.log(this.name, x, y);
}
const obj = {name: 'yl'};

foo.call(obj, 1, 2); // 立即执行
foo.apply(obj, [1, 2]); // 立即执行
const fn = foo.bind(obj, 1); // 返回新函数
fn(2);
```

### 5) new 绑定

```js
function Person(name) {
  this.name = name;
}
const p = new Person('yl');
```

`new` 会创建对象并把 `this` 绑定到这个新对象。

### 6) 箭头函数 this

```js
const obj2 = {
  a: 1,
  foo: () => {
    console.log(this.a);
  },
};
obj2.foo(); // 通常不是 1
```

箭头函数的 `this` 来自定义位置外层，不会指向 `obj2`。

## 判断输出练习（面试常见）

### 练习 1

```js
const obj = {
  a: 10,
  foo() {
    console.log(this.a);
  },
};
const f = obj.foo;
f();
```

<details>
  <summary>答案</summary>
  默认绑定（或严格模式下 undefined），不是 obj，通常输出不是 10。
</details>

### 练习 2

```js
function Foo(name) {
  this.name = name;
}
const obj = {name: 'outer'};
const Bound = Foo.bind(obj);
const ins = new Bound('inner');
console.log(ins.name);
```

<details>
  <summary>答案</summary>
  `inner`。`new` 绑定优先于 `bind` 绑定。
</details>

### 练习 3

```js
const obj = {
  a: 1,
  foo() {
    const bar = () => console.log(this.a);
    bar();
  },
};
obj.foo();
```

<details>
  <summary>答案</summary>
  输出 1。箭头函数继承 foo 执行时的 this（即 obj）。
</details>

## 快速答题模板（20 秒）

`this` 由调用方式决定：默认、隐式、显式、new 四种绑定，优先级是 `new > 显式 > 隐式 > 默认`。箭头函数没有自己的 this，取定义时外层作用域。常见坑是方法提取导致 this 丢失和箭头函数误判。
