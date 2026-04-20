---
title: 缓存一致性专项：开关缓存如何保证正确
---

# 缓存一致性专项：开关缓存如何保证正确

## 代码示例

```ts
// lib/feature-flag-cache.ts
import { unstable_cache, revalidateTag } from "next/cache";

type CouponFlags = {
  version: number;
  redeemEnabled: boolean;
  claimEnabled: boolean;
  updatedAt: string;
};

async function queryFlagsFromDB(): Promise<CouponFlags> {
  return {
    version: 12,
    redeemEnabled: true,
    claimEnabled: true,
    updatedAt: new Date().toISOString(),
  };
}

export const getCouponFlagsCached = unstable_cache(
  async () => queryFlagsFromDB(),
  ["coupon-flags-v1"],
  {
    tags: ["coupon-flags"],
    revalidate: 30,
  }
);

export async function updateFlagsAndInvalidate() {
  // 1) 先写 DB（权威源）
  // 2) 成功后再失效缓存
  revalidateTag("coupon-flags");
}
```

```ts
// services/coupon-guard.ts
import { getCouponFlagsCached } from "../lib/feature-flag-cache";

export async function canRedeemCoupon() {
  const flags = await getCouponFlagsCached();
  return flags.redeemEnabled;
}
```

## 原理讲解

缓存一致性的实战原则：**TTL + 主动失效 + 版本校验 + 风险分级**。

1. **TTL 兜底**：漏失效事件时仍能自动收敛到新值。
2. **主动失效**：配置变更后立即 `revalidateTag`，缩短生效延迟。
3. **版本校验**：记录 `version/updatedAt`，防止旧值覆盖新值。
4. **风险分级**：高风险路径（核销/支付）用更短 TTL，必要时直读权威源。

## 高频追问

### 哪些场景应 fail-close（默认关闭）？
核销、支付、发券等高风险动作应 fail-close，防止异常放量。

### 如何证明缓存正确？
监控 `cache_hit_rate`、`flag_staleness_seconds`、`flag_mismatch_count`、`revalidate_latency`。

### 为什么“先写库再失效缓存”？
避免删缓存后写库失败导致读到旧值或空值。

## 面试口述模板

我会用 TTL + 主动失效保障开关缓存一致性：平时靠短 TTL 兜底，变更时立即触发 `revalidateTag`。再用 `version/updatedAt` 防脏读。高风险路径用更短 TTL 或直读权威源，并通过生效延迟和不一致率指标验证正确性。
