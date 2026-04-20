---
title: MySQL/PostgreSQL：undo、redo、binlog 与两阶段提交
---

# MySQL/PostgreSQL：undo、redo、binlog 与两阶段提交

## 代码示例

### 1) 业务事务代码（应用层）

```ts
await db.$transaction(async (tx) => {
  await tx.inventory.update({
    where: { skuId: "sku_1001" },
    data: { stock: { decrement: 1 } },
  });

  await tx.order.create({
    data: { userId: "u_1", skuId: "sku_1001", amount: 19900 },
  });
});
```

### 2) MySQL 观察点

```sql
SHOW VARIABLES LIKE 'log_bin';
SHOW MASTER STATUS;
SHOW VARIABLES LIKE 'transaction_isolation';
```

### 3) PostgreSQL 观察点

```sql
SELECT pg_current_wal_lsn();
SELECT pg_last_committed_xact();
```

## 原理讲解

- **MySQL(InnoDB)**
  - `undo log`：回滚与 MVCC。
  - `redo log`：崩溃恢复。
  - `binlog`：复制与归档（Server 层日志）。
- **PostgreSQL**
  - 核心是 WAL + MVCC，不是 InnoDB 的 undo/redo/binlog 三件套命名。

### MySQL 日志关系图（简化）

```txt
应用事务
  -> InnoDB 更新
     -> undo log
     -> redo prepare
  -> Server 写 binlog
  -> InnoDB redo commit
  -> 提交成功
```

### MySQL 两阶段提交（2PC）

目标：保证 redo 与 binlog 一致，防止“一个有、一个没有”。

1. InnoDB 写 `redo prepare`
2. Server 写并刷 `binlog`
3. InnoDB 写 `redo commit`

恢复时：
- `redo prepare` + 无完整 binlog => 回滚
- `redo prepare` + 完整 binlog => 提交

### PostgreSQL 对应答法

PostgreSQL 强调 WAL 先行与 WAL 重放恢复；复制多基于 WAL streaming 或 logical decoding。

## 高频追问

### undo/redo/binlog 分别解决什么问题？
- undo：回滚与旧版本可见性
- redo：已提交事务可恢复
- binlog：复制、归档与时间点恢复

### 两阶段提交代价是什么？
提交链路更长、刷盘更多，吞吐下降；可通过 group commit 等方式优化。

### PostgreSQL 有没有 undo log？
不按 InnoDB 命名表达，机制等价但实现不同（MVCC + VACUUM）。

## 面试口述模板

MySQL 我会按分工来讲：undo 管回滚与 MVCC，redo 管崩溃恢复，binlog 管复制归档。为保证 redo 与 binlog 一致，提交采用两阶段提交：redo prepare -> binlog flush -> redo commit。PostgreSQL 的核心是 WAL 先行和 WAL 重放恢复，不是 InnoDB 那套命名体系。
