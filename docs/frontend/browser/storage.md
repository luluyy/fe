---
title: localStorage、sessionStorage、Cookie 区别
---

# 三者区别

## 生命周期

- `localStorage`：长期保存，除非主动清理。
- `sessionStorage`：页面会话级别，关闭标签页后失效。
- `Cookie`：可设置过期时间，到期后失效。

## 大小限制

- `localStorage` / `sessionStorage`：通常约 5MB。
- `Cookie`：通常约 4KB。

## 是否自动随请求发送

- `Cookie`：会自动随同域请求发送（受 SameSite 等策略影响）。
- `localStorage` / `sessionStorage`：不会自动发送，需要手动读取并放到请求头。

## 安全提醒

敏感信息尽量不要直接存储在可被脚本读取的位置，必要时结合 HttpOnly Cookie 与服务端会话策略。
