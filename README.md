# 彩相美学（caixianglab.online）

移动端优先的个人色彩、体型骨骼与数字形象档案网站，使用 Next.js 16 部署到 Vercel。

## 功能

- 手机拍照或从相册上传照片
- 色彩初测、Body Type 与骨骼测试
- 按用户保存并展示历史初测结果
- 全身、正脸、左侧脸、右侧脸四类照片档案
- UNIQLO 初始推荐商品库与 CSV 商品导入口
- 30 天登录状态，用户主动退出后才需重新登录

## 本地运行

```bash
pnpm install
pnpm dev
```

复制 `.env.example` 为 `.env.local` 并填写数据库和文件存储变量。

## Vercel 环境变量

- `DATABASE_URL`：Vercel Marketplace 中 Neon Postgres 的连接地址
- `BLOB_READ_WRITE_TOKEN`：Vercel Blob 读写令牌
- `SESSION_SECRET`：至少 32 位的随机字符串
- `ADMIN_PHONES`：管理员手机号，多个号码用英文逗号分隔

数据库表会在首次 API 请求时自动建立，UNIQLO 初始商品会在首次读取推荐时写入。

## 微信小程序

原生微信小程序工程位于 `miniapp/`，支持微信自动登录、线上初测、逐题体型测试、历史记录、四张档案照片、UNIQLO 推荐、工作室与价格页面。配置方法见 `miniapp/README.md`。
