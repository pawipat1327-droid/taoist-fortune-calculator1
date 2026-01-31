# Cloudflare Worker 完整部署指南

## 当前状态

✅ **Worker 代码已准备** - API Key 已设置为 Secret
✅ **前端代码已更新** - 配置为调用 Cloudflare Worker
⚠️ **需要手动完成部署** - 需要通过浏览器注册子域名

---

## 完成部署的步骤

### 步骤 1：通过浏览器注册子域名

1. 访问 Cloudflare Workers Onboarding 页面：
   ```
   https://dash.cloudflare.com/b88ddf8b1e90790f5292be4b83e9e64e/workers/onboarding
   ```

2. 登录你的 Cloudflare 账户（如果还没有）

3. 注册一个 `workers.dev` 子域名：
   - 建议子域名：`taoist-fortune-api`
   - 完整的 Worker URL 将是：`https://taoist-fortune-api.workers.dev`

4. **记下你的 Worker URL**，例如：
   ```
   https://taoist-fortune-api.workers.dev
   ```

---

### 步骤 2：测试 Worker

获取到 Worker URL 后，测试健康检查端点：

```bash
curl https://taoist-fortune-api.workers.dev/health
```

预期响应：
```json
{
  "status": "ok",
  "service": "Taoist Fortune Calculator API",
  "timestamp": "2026-01-30T..."
}
```

---

### 步骤 3：更新前端 `.env` 文件

在项目根目录的 `.env` 文件中添加或更新 Worker URL：

```bash
VITE_CLOUDFLARE_WORKER_URL=https://taoist-fortune-api.workers.dev
```

---

### 步骤 4：重新构建和部署前端

```bash
# 构建前端
npm run build

# 部署到 Firebase
firebase deploy --only hosting
```

---

## API 端点说明

部署后，Worker 提供以下端点：

| 端点 | 方法 | 功能 |
|-------|------|------|
| `/health` | GET | 健康检查 |
| `/api/generate-fortune` | POST | 生成运势 |
| `/api/start-chat` | POST | 开始大师对话 |
| `/api/continue-chat` | POST | 继续大师对话 |

---

## 前端代码说明

前端已配置为自动在两种模式间切换：

1. **开发模式**（默认）
   - 当 `.env` 文件中没有 `VITE_CLOUDFLARE_WORKER_URL` 时
   - 前端直接调用 DeepSeek API
   - 需要在 `.env` 中设置 `VITE_DEEPSEEK_API_KEY`

2. **生产模式**
   - 当 `.env` 文件中设置了 `VITE_CLOUDFLARE_WORKER_URL` 时
   - 前端通过 Cloudflare Worker 代理调用 DeepSeek API
   - DeepSeek API Key 安全存储在 Worker 的环境变量中

---

## 测试前端集成

在浏览器中打开应用并测试：

1. 填写运势表单并提交
2. 检查是否成功生成运势结果
3. 点击"对结果有疑问？向大师追问"按钮
4. 验证对话功能是否正常工作

---

## 故障排查

### Worker 返回 404

如果访问 Worker URL 返回 404：

1. 确认子域名已正确注册
2. 检查 URL 格式：`https://your-subdomain.workers.dev/`
3. 注意末尾有 `/` 斜杠

### Worker 返回 CORS 错误

如果浏览器控制台显示 CORS 错误：

1. Worker 代码已配置 CORS，应该允许所有来源
2. 检查 Worker 日志：`wrangler tail`

### API Key 问题

如果遇到 API 相关错误：

1. 确认 DeepSeek API Key 已正确设置
2. 检查 Key 格式：应该以 `sk-` 开头
3. 查看 Secret：`wrangler secret list`

---

## 高级配置

### 使用自定义域名

如果你有自己的域名并想使用：

1. 在 Cloudflare Workers 控制台中：
   - 添加你的自定义域名
   - 设置 Worker 路由规则

2. 或者在 `wrangler.toml` 中配置路由：

```toml
routes = [
  { pattern = "api/*", zone_name = "your-domain.com" }
]
```

### 查看实时日志

实时查看 Worker 日志：

```bash
wrangler tail
```

---

## 联系与支持

- Cloudflare Workers 文档：https://developers.cloudflare.com/workers
- Wrangler CLI 文档：https://developers.cloudflare.com/workers/wrangler
- 本项目 GitHub：https://github.com/your-repo/taoist-fortune-calculator

---

**注意**：API Key 已安全存储在 Cloudflare Workers Secrets Store 中，不会暴露在代码仓库或客户端。
