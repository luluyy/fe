---
title: TypeScript 基础 20 题（详细版）
---

# TypeScript 基础 20 题（详细版）

## 1) TypeScript 是什么？
### 代码示例
```ts
const n: number = 1;
```
### 原理讲解
TS 是 JS 的超集，在编译期做类型检查。
### 练习
- 基础练习：把一个 JS 函数改成带参数和返回值类型。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function sum(a: number, b: number): number {
  return a + b;
}
```
### 练习讲解
给参数和返回值标注类型后，编辑器会在调用时提示错误输入，重构更安全。
### 高频追问

### TS 会不会影响运行时性能？

不会，类型会在编译后擦除。
### 面试口述模板
TS 核心是把错误前移到编译期，提高可维护性。

## 2) `any` / `unknown` / `never` 区别
### 代码示例
```ts
let a: any; let u: unknown; function fail(): never { throw new Error('x'); }
```
### 原理讲解
`any` 关闭检查，`unknown` 需收窄后使用，`never` 表示不可能类型。
### 练习
- 基础练习：把 `any` 接口返回值改成 `unknown` 并做守卫。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function parseUser(input: unknown) {
  if (typeof input === 'object' && input !== null && 'id' in input) {
    return input as { id: string };
  }
  throw new Error('invalid user');
}
```
### 练习讲解
先用 `unknown` 接住不可信输入，再通过守卫收窄，避免 `any` 污染。
### 高频追问

### 何时必须避免 any？

跨模块公共接口、外部输入边界尽量避免 any。
### 面试口述模板
unknown 更安全，any 会污染下游类型。

## 3) `type` vs `interface`
### 代码示例
```ts
type A = {id:string}; interface B {id:string}
```
### 原理讲解
interface 适合对象契约且可合并，type 更灵活支持联合/交叉。
### 练习
- 基础练习：把一组接口定义改成 type+联合。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number };
```
### 练习讲解
`type` 在联合类型场景表达力更强，配合判别字段可做完整分支检查。
### 高频追问

### 团队里如何统一使用？

对象契约优先 interface，复杂组合优先 type。
### 面试口述模板
两者都能建模，关键是统一规范与可读性。

## 4) 联合类型与类型守卫
### 代码示例
```ts
function f(x: string | number){ return typeof x==='string' ? x.length : x.toFixed(2); }
```
### 原理讲解
联合类型访问成员前必须先收窄。
### 练习
- 基础练习：写一个处理 `string | Date` 的格式化函数。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function formatValue(v: string | Date) {
  if (typeof v === 'string') return v.toUpperCase();
  return v.toISOString();
}
```
### 练习讲解
`typeof` 分支后，TS 能在各分支识别精确类型。
### 高频追问

### `in` 和 `instanceof` 何时用？

in 适合对象结构判别，instanceof 适合类实例判别。
### 面试口述模板
先收窄再访问，是联合类型的核心原则。

## 5) 交叉类型
### 代码示例
```ts
type U = {id:string} & {name:string};
```
### 原理讲解
交叉类型要求同时满足多个类型约束。
### 练习
- 基础练习：定义一个同时包含分页和排序字段的类型。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type Pageable = { page: number; pageSize: number };
type Sortable = { sortBy: string; order: 'asc' | 'desc' };
type Query = Pageable & Sortable;
```
### 练习讲解
交叉类型用于能力组合，适合查询参数等复合结构。
### 高频追问

### 交叉冲突会怎样？

冲突字段可能收敛为 never，导致类型不可赋值。
### 面试口述模板
交叉是“且”关系，适合组合能力。

## 6) 类型断言 `as`
### 代码示例
```ts
const el = document.getElementById('app') as HTMLDivElement;
```
### 原理讲解
断言仅影响编译期，不会做运行时转换。
### 练习
- 基础练习：给第三方库返回值做安全收敛（先守卫再断言）。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function getInput() {
  const el = document.querySelector('#app');
  if (!(el instanceof HTMLInputElement)) return null;
  return el.value;
}
```
### 练习讲解
优先守卫再断言，减少错误断言带来的运行时风险。
### 高频追问

### `as unknown as` 有何风险？

可能绕过类型系统，掩盖真实错误。
### 面试口述模板
断言是兜底，不是常规建模手段。

## 7) 字面量类型与 `as const`
### 代码示例
```ts
const cfg = { mode: 'dark' } as const;
```
### 原理讲解
`as const` 会把值字面量化并只读化。
### 练习
- 基础练习：把状态常量对象改造成 `as const` 并推导联合类型。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  DONE: 'done',
} as const;
type Status = (typeof STATUS)[keyof typeof STATUS];
```
### 练习讲解
`as const` + 索引类型可生成稳定联合类型。
### 高频追问

### 和 enum 怎么选？

轻量和产物体积优先时常选 `as const`。
### 面试口述模板
as const 很适合前端常量映射场景。

## 8) `readonly` vs `const`
### 代码示例
```ts
const obj: { readonly id: string } = { id:'1' };
```
### 原理讲解
const 约束变量绑定，readonly 约束属性可写性。
### 练习
- 基础练习：实现一个 `ReadonlyUser` 类型并尝试修改字段。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type User = { readonly id: string; profile: { name: string } };
const u: User = { id: '1', profile: { name: 'yl' } };
// u.id = '2' // error
u.profile.name = 'new';
```
### 练习讲解
浅 readonly 只限制第一层，深层需递归只读类型。
### 高频追问

### 深层只读怎么做？

使用递归映射类型实现 `DeepReadonly`。
### 面试口述模板
两者作用层级不同：变量 vs 属性。

## 9) 可选属性与可选参数
### 代码示例
```ts
type User = {name:string; age?:number};
```
### 原理讲解
可选成员本质包含 undefined 语义。
### 练习
- 基础练习：写一个函数参数含可选配置对象并处理默认值。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type Options = { retry?: number };
function request(url: string, options: Options = {}) {
  const retry = options.retry ?? 0;
  return { url, retry };
}
```
### 练习讲解
可选参数结合默认值和空值合并，避免 undefined 分支遗漏。
### 高频追问

### `exactOptionalPropertyTypes` 是什么？

开启后可选属性语义更严格，避免误判。
### 面试口述模板
可选不等于任意，依然要做判空。

## 10) 函数重载
### 代码示例
```ts
function g(x:string):string; function g(x:number):number; function g(x:any){ return x; }
```
### 原理讲解
重载提高调用体验，实现签名要覆盖所有分支。
### 练习
- 基础练习：给 `parse` 写两个输入重载。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) {
  return typeof x === 'string' ? Number(x) : String(x);
}
```
### 练习讲解
重载给调用侧精确提示，实现函数覆盖所有输入分支。
### 高频追问

### 何时改用泛型？

当参数与返回有统一映射规则时优先泛型。
### 面试口述模板
重载适合少量分支且语义明确场景。

## 11) 泛型基础
### 代码示例
```ts
function id<T>(x:T):T { return x; }
```
### 原理讲解
泛型让复用逻辑不丢类型信息。
### 练习
- 基础练习：实现一个泛型 `first<T>(arr:T[])`。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```
### 练习讲解
泛型让工具函数复用且不丢失具体类型。
### 高频追问

### 泛型默认值怎么写？

`<T = unknown>`。
### 面试口述模板
泛型是 TS 可复用的核心能力。

## 12) 泛型约束 `extends`
### 代码示例
```ts
function getId<T extends {id:string}>(x:T){ return x.id; }
```
### 原理讲解
约束让泛型参数必须具备最小结构。
### 练习
- 基础练习：实现 `pluckId<T extends {id:string}>`。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function pluckId<T extends { id: string }>(list: T[]) {
  return list.map((i) => i.id);
}
```
### 练习讲解
通过约束确保泛型参数具备最小字段。
### 高频追问

### 多个约束如何组合？

使用交叉约束 `T extends A & B`。
### 面试口述模板
先约束再复用，类型更稳。

## 13) `keyof` / `typeof` / `T[K]`
### 代码示例
```ts
const cfg = {port:3000}; type K = keyof typeof cfg; type V = (typeof cfg)['port'];
```
### 原理讲解
用于从值反推类型、从类型提取键和值。
### 练习
- 基础练习：写一个 `getProp<T, K extends keyof T>(obj:T,key:K)`。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```
### 练习讲解
`K extends keyof T` 与 `T[K]` 配合可构建类型安全访问器。
### 高频追问

### 联合上的 keyof 行为？

通常得到键并集，访问仍需收窄。
### 面试口述模板
这是构建高级类型工具的三件套。

## 14) 工具类型 `Record/Pick/Omit`
### 代码示例
```ts
type X = Pick<{a:number;b:string}, 'a'>;
```
### 原理讲解
工具类型是映射/条件类型的工程封装。
### 练习
- 基础练习：把完整用户类型拆成列表项类型和更新 DTO。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type User = { id: string; name: string; age: number };
type UserListItem = Pick<User, 'id' | 'name'>;
type UserUpdate = Omit<Partial<User>, 'id'>;
```
### 练习讲解
先抽展示字段，再构建更新 DTO，减少重复类型定义。
### 高频追问

### 如何手写 MyOmit？

`type MyOmit<T,K extends keyof any> = Pick<T, Exclude<keyof T,K>>`。
### 面试口述模板
先用内置工具，再考虑自定义。

## 15) `Partial/Required/Readonly`
### 代码示例
```ts
type P = Partial<{a:number;b:string}>;
```
### 原理讲解
同一模型可在不同阶段转换可选性和只读性。
### 练习
- 基础练习：设计“创建 DTO”和“更新 DTO”两种类型。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type User = { id: string; name: string; age: number };
type CreateUser = Omit<User, 'id'>;
type UpdateUser = Partial<CreateUser>;
```
### 练习讲解
创建与更新阶段的数据约束应分开建模。
### 高频追问

### Partial 用多了风险？

可能放宽过度，关键字段需补回必填。
### 面试口述模板
工具类型要服务业务边界。

## 16) 结构化类型系统
### 代码示例
```ts
type A = {x:number}; const v: A = {x:1, y:2};
```
### 原理讲解
TS 以结构兼容而非名义类型为主。
### 练习
- 基础练习：验证对象字面量与变量赋值差异。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
type Point = { x: number };
const p = { x: 1, y: 2 };
const ok: Point = p; // 结构兼容
```
### 练习讲解
TS 关注结构是否满足，不要求名义类型一致。
### 高频追问

### excess property check 何时触发？

对象字面量直接赋值时最严格。
### 面试口述模板
理解结构化类型能解释很多“为什么能赋值”。

## 17) `enum` 与替代
### 代码示例
```ts
enum Role { Admin='admin', User='user' }
```
### 原理讲解
enum 可读性好，但可能引入运行时代码。
### 练习
- 基础练习：用 `as const` 重写一个 enum 场景。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
const ROLE = { ADMIN: 'admin', USER: 'user' } as const;
type Role = (typeof ROLE)[keyof typeof ROLE];
```
### 练习讲解
`as const` 方案零运行时代码，常用于前端常量枚举。
### 高频追问

### const enum 优缺点？

优点是内联，缺点是构建兼容性要评估。
### 面试口述模板
按项目构建链与团队偏好选型。

## 18) `tsconfig` 核心项
### 代码示例
```ts
// strict / moduleResolution / jsx / target
```
### 原理讲解
配置决定严格度、模块解析与编译目标。
### 练习
- 基础练习：解释你项目里 3 个关键编译配置。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```
### 练习讲解
`strict` 提升安全，`moduleResolution` 保证构建链解析一致。
### 高频追问

### strict 下最常见报错？

strictNullChecks 与 noImplicitAny。
### 面试口述模板
编译配置是 TS 质量底座。

## 19) `strict` 的价值
### 代码示例
```ts
let x: string | undefined;
```
### 原理讲解
把潜在运行时错误前移到编译期。
### 练习
- 基础练习：修复一个 strictNullChecks 报错链路。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
function printName(name?: string) {
  if (!name) return 'anonymous';
  return name.toUpperCase();
}
```
### 练习讲解
strictNullChecks 下必须显式处理空值分支。
### 高频追问

### 老项目如何渐进开启？

先新模块开启，再按目录灰度收敛。
### 面试口述模板
strict 不是负担，是长期收益。

## 20) 团队落地策略
### 代码示例
```ts
// unknown + runtime validate + CI
```
### 原理讲解
落地关键是规范、边界收敛、CI 持续治理。
### 练习
- 基础练习：给现有项目设计 4 周 TS 治理计划。
- 进阶练习：补一个边界场景（空值/并发/错误处理）并解释。
### 练习参考代码
```ts
// 1) API 边界使用 unknown
// 2) zod 校验后导出推断类型
// 3) CI 执行 tsc --noEmit
```
### 练习讲解
落地是流程问题：边界收敛 + 自动化检查 + 渐进治理。
### 高频追问

### 收益如何衡量？

看故障率、重构效率、PR 质量。
### 面试口述模板
TS 落地是工程治理，不是一次性改造。
