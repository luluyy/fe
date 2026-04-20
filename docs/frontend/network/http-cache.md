---
title: HTTP 缓存（强缓存与协商缓存）
---

# HTTP 缓存

## 强缓存

浏览器直接使用本地副本，不发请求。常见响应头：

- `Cache-Control: max-age=...`
- `Expires: ...`

## 协商缓存

浏览器会发请求到服务端，由服务端判断资源是否变化：

- `ETag` / `If-None-Match`
- `Last-Modified` / `If-Modified-Since`

若未变化返回 `304 Not Modified`，减少响应体传输。

## 实战建议

- 带 hash 的静态资源用长期强缓存。
- HTML 入口文件用较短缓存或不缓存，确保版本切换及时。
