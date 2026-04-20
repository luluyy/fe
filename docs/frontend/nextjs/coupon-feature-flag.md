---
title: 场景题：Next.js 优惠券全局开关设计
---

# 场景题：Next.js 优惠券全局开关设计

## 代码示例

### 1) 开关 Provider（可接 DB/Redis/配置中心）

```ts
// lib/feature-flag.ts
import { unstable_cache, revalidateTag } from "next/cache";

type CouponFlags = {
  displayEnabled: boolean; // 前端是否展示入口
  claimEnabled: boolean; // 是否允许领券
  redeemEnabled: boolean; // 是否允许核销
};

async function fetchFlagsFromStore(): Promise<CouponFlags> {
  // 这里可替换为 DB/Redis/ConfigCenter 查询
  return {
    displayEnabled: true,
    claimEnabled: true,
    redeemEnabled: true,
  };
}

export const getCouponFlags = unstable_cache(
  async () => fetchFlagsFromStore(),
  ["coupon-flags"],
  { tags: ["coupon-flags"], revalidate: 30 }
);

export async function refreshCouponFlags() {
  revalidateTag("coupon-flags");
}
```

### 2) 业务 Service（单点校验，防前端绕过）

```ts
// services/coupon.service.ts
import { getCouponFlags } from "../lib/feature-flag";

export class CouponDisabledError extends Error {
  code = "COUPON_DISABLED";
}

export async function assertCouponCanClaim() {
  const flags = await getCouponFlags();
  if (!flags.claimEnabled) throw new CouponDisabledError("优惠券领取已关闭");
}

export async function assertCouponCanRedeem() {
  const flags = await getCouponFlags();
  if (!flags.redeemEnabled) throw new CouponDisabledError("优惠券核销已关闭");
}
```

### 3) API 路由（领取接口）

```ts
// app/api/coupons/claim/route.ts
import { z } from "zod";
import { assertCouponCanClaim, CouponDisabledError } from "../../../../services/coupon.service";

const ClaimSchema = z.object({
  userId: z.string().min(1),
  couponId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = ClaimSchema.parse(body);

    await assertCouponCanClaim();
    // ...执行发券逻辑
    return Response.json({ ok: true, data: input });
  } catch (err) {
    if (err instanceof CouponDisabledError) {
      return Response.json({ ok: false, code: err.code, message: err.message }, { status: 409 });
    }
    return Response.json({ ok: false, code: "BAD_REQUEST" }, { status: 400 });
  }
}
```

### 4) 管理端修改开关后主动失效缓存

```ts
// app/api/admin/coupon-flags/route.ts
import { refreshCouponFlags } from "../../../../lib/feature-flag";

export async function PATCH() {
  // 1. 写入 DB/配置中心
  // 2. 失效 Next.js 缓存，让新开关尽快生效
  await refreshCouponFlags();
  return Response.json({ ok: true });
}
```

## 原理讲解

优惠券“全局开关”推荐采用 **双层控制 + 单点校验**：

1. **UI 层控制体验**：页面根据 `displayEnabled` 决定是否展示领券入口。
2. **API/Service 层控制准入**：领取与核销必须服务端再校验，防止请求绕过前端。
3. **缓存层控制性能**：开关读取走缓存，运营改配置后主动 `revalidateTag` 保证一致性。

## 高频追问

### 开关存在缓存，如何避免“改了不生效”？
用短 TTL + 主动失效（`revalidateTag("coupon-flags")`）组合策略。

### 紧急止损怎么做？
预留 `redeemEnabled = false` 的 kill switch，并让核销链路优先检查该开关。

### 如何审计运营改动？
记录操作人、时间、变更前后值、变更原因，必要时接入审批流。

## 面试口述模板

我会把优惠券开关做成 Feature Flag，拆成展示、领取、核销三层。页面层只做体验控制，真正准入在 Service 层统一校验。开关读取走缓存，配置变更后通过 `revalidateTag` 主动失效，保证一致性，并保留 kill switch 和审计日志。
