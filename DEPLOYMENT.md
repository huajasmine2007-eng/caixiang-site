# 彩相美学：GitHub 与 Vercel 部署

建议使用“GitHub 私密仓库 + Vercel 部署”。GitHub Pages 只有静态页面，无法安全保存视觉模型密钥。

## 1. 上传至 GitHub

1. 登录 GitHub，点击 **New repository**。
2. 仓库名建议填写 `caixianglab-site`。
3. 必须选择 **Private**，不要勾选自动创建 README。
4. 在本项目目录执行：

```bash
git remote add github https://github.com/你的用户名/caixianglab-site.git
git push -u github main
```

也可以使用 GitHub Desktop：选择 **Add Existing Repository**，然后发布为 Private repository。

## 2. 导入 Vercel

1. 登录 [Vercel](https://vercel.com/)，选择 **Add New → Project**。
2. 连接 GitHub，导入刚创建的私密仓库。
3. Framework Preset 选择 **Next.js**。
4. 项目已包含 `vercel.json`，Build Command 会使用标准 Next.js 构建。
5. 先不要添加正式域名，也不要开启视觉分析，完成第一次部署。

## 3. 配置视觉模型密钥

进入 Vercel 项目的 **Settings → Environment Variables**，添加：

| Name | Value | 环境 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 你的真实 API Key | Production、Preview |
| `OPENAI_VISION_MODEL` | `gpt-4o-mini` | Production、Preview |
| `ENABLE_VISION_ANALYSIS` | `true` | Production、Preview |

真实 API Key 只能填写在 Vercel 后台，不能写入 `.env.example`、代码、聊天截图或 GitHub。保存变量后需要重新部署一次。

如果网站还没有真实的手机号登录与访问控制，建议把 `ENABLE_VISION_ANALYSIS` 保持为 `false`，避免接口被陌生人消耗额度。

## 4. 绑定 caixianglab.online

等私密测试完成后，进入 **Settings → Domains**：

1. 添加 `caixianglab.online`。
2. 添加 `www.caixianglab.online`，并设置其中一个跳转到另一个。
3. 按 Vercel 页面显示的记录，到域名购买平台修改 DNS。
4. 不要照抄网上旧的 DNS 值，以 Vercel 当前给你的记录为准。

## 5. 上线前安全检查

- GitHub 仓库保持 Private。
- `.env.local` 和所有 `.env` 文件不得提交。
- API Key 只存在 Vercel Environment Variables。
- 短信登录接通前，不开放视觉接口给公众。
- 设置单用户调用次数限制和每日预算告警。
- 客户照片需要明确授权、保存期限和主动删除入口。
- 模型结果标记为初测，并保留管理员人工复核。

相关官方说明：

- [Vercel Git 部署](https://vercel.com/docs/git)
- [Vercel 环境变量](https://vercel.com/docs/environment-variables)
- [Vercel 自定义域名](https://vercel.com/docs/domains/set-up-custom-domain)
- [OpenAI Responses API](https://developers.openai.com/api/reference/typescript/resources/beta/subresources/responses/methods/create)
