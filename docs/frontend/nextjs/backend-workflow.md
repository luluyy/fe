---
title: Next.js 项目中如何处理后端 workflow？
---

# Next.js 项目中如何处理后端 workflow？

## 这页是总览，详细内容已拆分

你提到这题过长，所以我把原文拆成了 4 篇，方便按需复习：

1. **后端 workflow 总览（本页）**：分层思维与最小代码。
2. `frontend/nextjs/coupon-feature-flag`：优惠券全局开关设计题。
3. `frontend/nextjs/cache-consistency`：开关缓存一致性专项。
4. `frontend/nextjs/db-atomicity-2pc`：MySQL/PostgreSQL 日志与两阶段提交。

## 最小代码示例（总览）

```ts
// app/api/orders/route.ts
import { z } from "zod";
import { createOrder } from "../../../services/order.service";

const CreateOrderSchema = z.object({
  userId: z.string().min(1),
  skuId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const input = CreateOrderSchema.parse(json);
  const data = await createOrder(input);
  return Response.json({ ok: true, data });
}
```

```ts
// services/order.service.ts
import { db } from "../lib/db";

export async function createOrder(input: {
  userId: string;
  skuId: string;
  quantity: number;
}) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.create({ data: input });
    await tx.inventory.update({
      where: { skuId: input.skuId },
      data: { stock: { decrement: input.quantity } },
    });
    return order;
  });
}
```

## 核心框架（背诵版）

1. 入口层（Route Handlers / Server Actions）
2. 鉴权与校验层
3. Service 业务编排层
4. Repository/DB 层
5. 观测与可靠性层

一句话：**入口薄、服务厚、存储纯、全链路可观测。**
