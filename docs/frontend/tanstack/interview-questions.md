---
title: TanStack 生态面试题（完整结构）
---

# TanStack 生态面试题（完整结构）

## 1) Query 解决什么问题？
### 代码示例
```ts
const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
```
### 原理讲解
管理服务端状态：缓存、失效、重试、后台刷新。
### 追问
- 为什么不只用 useEffect + useState？
### 参考答案
- 手工方案缺缓存去重与一致性策略，复杂场景维护成本高。

## 2) queryKey 设计原则
### 代码示例
```ts
['users', { page, pageSize, keyword }]
```
### 原理讲解
queryKey 是缓存身份，必须稳定且可序列化。
### 追问
- key 设计错误会怎样？
### 参考答案
- 会导致错缓存、重复请求或脏数据。

## 3) staleTime vs gcTime
### 代码示例
```ts
useQuery({ queryKey:['users'], queryFn, staleTime: 60_000, gcTime: 300_000 });
```
### 原理讲解
staleTime 控制新鲜期，gcTime 控制回收时机。
### 追问
- 怎么设默认值？
### 参考答案
- 高频变化数据短 staleTime，低频数据长 staleTime；gcTime按内存预算设。

## 4) invalidate vs refetch
### 代码示例
```ts
queryClient.invalidateQueries({ queryKey: ['users'] });
```
### 原理讲解
invalidate 标记失效并择机刷新，refetch 立即拉取。
### 追问
- 修改成功后选哪个？
### 参考答案
- 大多用 invalidate，语义更稳；需要马上刷可配 refetch。

## 5) 乐观更新流程
### 代码示例
```ts
useMutation({ mutationFn, onMutate, onError, onSettled });
```
### 原理讲解
先本地更新提升手感，失败回滚保证一致性。
### 追问
- 并发冲突怎么处理？
### 参考答案
- 用快照和版本/序列化策略，失败按快照回滚。

## 6) SSR Hydration
### 代码示例
```ts
// server dehydrate -> client Hydrate
```
### 原理讲解
服务端预取并注水，客户端复用缓存减少二次请求。
### 追问
- Next.js 怎么接？
### 参考答案
- 服务端 prefetchQuery + dehydrate，客户端 Hydrate 恢复 QueryCache。

## 7) Router 优势
### 代码示例
```ts
createFileRoute('/users/$id')({ component: UserPage });
```
### 原理讲解
参数与 loader 类型安全，路由数据契约更强。
### 追问
- 与 react-router 最大区别？
### 参考答案
- 类型推导和数据路由一体化体验更突出。

## 8) Table headless 含义
### 代码示例
```ts
const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
```
### 原理讲解
只提供状态和算法，不绑定 UI。
### 追问
- 代价是什么？
### 参考答案
- 自由度高但需要自行实现更多 UI 细节与一致性规范。

## 9) Table + Query 联动
### 代码示例
```ts
useQuery({ queryKey: ['users', page, sort], queryFn: fetchUsers });
```
### 原理讲解
把分页排序纳入 key 保证缓存一致。
### 追问
- 前后端分页如何选？
### 参考答案
- 小数据前端分页，大数据后端分页并保留 key 参数。

## 10) 重试策略
### 代码示例
```ts
useQuery({ queryKey:['x'], queryFn, retry: (c,e) => c < 2 && isServerError(e) });
```
### 原理讲解
按错误类型配置重试，避免无意义请求。
### 追问
- 如何做监控？
### 参考答案
- 记录重试次数、错误码、耗时与最终状态。

## 11) 与状态库关系
### 代码示例
```ts
// Query 管服务端状态，Zustand/Redux 管本地业务状态
```
### 原理讲解
两类状态职责不同，可组合使用。
### 追问
- 何时只用 Query 就够？
### 参考答案
- 本地状态简单且流程不复杂时可只用 Query。

## 12) 常见踩坑
### 代码示例
```ts
// queryKey 不稳定 / 过度 invalidate / 乐观更新不回滚
```
### 原理讲解
这些问题会导致抖动、脏数据、性能下降。
### 追问
- 排查顺序？
### 参考答案
- 先查 queryKey 稳定性，再查失效策略、重试、并发与回滚。
