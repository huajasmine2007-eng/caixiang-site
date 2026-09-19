# 彩相美学微信小程序

## 在微信开发者工具中预览

1. 打开微信开发者工具，选择“导入项目”。
2. 目录选择本仓库的 `miniapp` 文件夹。
3. 没有正式 AppID 时可先使用测试号；拿到 AppID 后替换 `project.config.json` 中的 `appid`。
4. 开发阶段可在“详情 → 本地设置”暂时勾选“不校验合法域名”。

## 上线前配置

1. 在微信公众平台把 `https://caixianglab.online` 加入 request、uploadFile、downloadFile 合法域名。
2. 在 Vercel 环境变量中添加 `WECHAT_APP_ID`、`WECHAT_APP_SECRET`，并重新部署。
3. 配置 `DATABASE_URL`、`BLOB_READ_WRITE_TOKEN`、`SESSION_SECRET`。
4. 完成小程序备案、服务类目、用户隐私保护指引和照片处理说明。

`WECHAT_APP_SECRET` 只能保存在 Vercel，禁止写入小程序代码或 GitHub。
