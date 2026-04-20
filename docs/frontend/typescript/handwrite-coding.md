---
title: TypeScript 手写代码题（详细版）
---

# TypeScript 手写代码题（详细版）

## 1) 手写 MyPick
### 代码示例
```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
```
### 原理讲解
映射类型遍历键并取属性类型。
### 练习
- 基础练习：实现 `MyPick<User,'id'|'name'>` 并验证结果。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 如果 K 不在 T 中会怎样？

编译期报错，由 `K extends keyof T` 约束保证。
### 面试口述模板
核心是映射类型 + 键约束，保证选取字段类型安全。

## 2) 手写 MyOmit
### 代码示例
```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
### 原理讲解
先过滤键再重组类型。
### 练习
- 基础练习：实现去掉 password 字段的安全响应类型。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 为什么 K 用 keyof any？

覆盖 string/number/symbol 键类型。
### 面试口述模板
Omit 本质是 Exclude + Pick 组合。

## 3) 手写 MyReturnType
### 代码示例
```ts
type MyReturnType<T> = T extends (...args:any[]) => infer R ? R : never;
```
### 原理讲解
用 infer 从函数签名提取返回值。
### 练习
- 基础练习：给一个函数联合类型提取返回值。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 非函数输入返回什么？

返回 never。
### 面试口述模板
条件类型 + infer 是手写工具类型高频组合。

## 4) 手写 DeepReadonly
### 代码示例
```ts
type DeepReadonly<T> = T extends (...args:any[])=>any ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
```
### 原理讲解
递归把对象各层属性只读化。
### 练习
- 基础练习：让嵌套配置对象变成只读并尝试修改。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 数组会怎样？

数组元素同样会被递归处理。
### 面试口述模板
递归映射是深层类型变换关键技巧。

## 5) 类型安全 EventEmitter
### 代码示例
```ts
type Events = { login:{id:string}; logout:undefined };
```
### 原理讲解
事件名与 payload 通过 `E[K]` 绑定。
### 练习
- 基础练习：实现 `on/emit` 并验证类型提示。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 如何扩展 once/off？

维护 handler 列表并支持按引用移除。
### 面试口述模板
核心是键到值的映射约束。

## 6) 手写 debounce（保留签名）
### 代码示例
```ts
function debounce<T extends (...args:any[])=>void>(fn:T, wait=300){ let t:ReturnType<typeof setTimeout>; return (...args:Parameters<T>)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args),wait); }; }
```
### 原理讲解
`Parameters<T>` 保留参数类型，避免 any 退化。
### 练习
- 基础练习：增加 cancel 方法并保持类型安全。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 立即执行版怎么写？

加入 leading 逻辑，首次立即执行。
### 面试口述模板
在工具函数中保留签名是 TS 面试加分点。

## 7) 手写 promiseAll（类型安全）
### 代码示例
```ts
type AwaitedValue<T> = T extends Promise<infer R> ? R : T;
```
### 原理讲解
对元组每项做 Promise 展开后再组装返回类型。
### 练习
- 基础练习：实现支持元组输入的 `promiseAll`。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 为什么要支持普通值？

原生 Promise.all 就支持普通值并原样返回。
### 面试口述模板
关键是元组映射与 Awaited 思维。

## 8) 手写类型守卫 isUser
### 代码示例
```ts
function isUser(v: unknown): v is {id:string;name:string} { return typeof v==='object' && v!==null && 'id' in v && 'name' in v; }
```
### 原理讲解
类型谓词让分支内自动收窄。
### 练习
- 基础练习：给 API 返回值写守卫并在调用处复用。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 高频追问

### 为什么比 as 更安全？

有运行时判断，不依赖编译期假设。
### 面试口述模板
守卫是 unknown 边界收敛的标准做法。
