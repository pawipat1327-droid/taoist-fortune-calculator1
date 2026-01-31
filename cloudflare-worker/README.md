# Cloudflare Worker 部署指南

本项目使用 Cloudflare Workers 作为后端 API，保护 DeepSeek API key 不暴露在前端。

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 设置 DeepSeek API Key

```bash
wrangler secret put DEEPSEEK_API_KEY --project taoist-fortune-calculator-api
```

输入你的 DeepSeek API key（格式：`sk-xxxxx`）

### 4. 部署 Worker

```bash
cd cloudflare-worker
wrangler deploy
```

部署成功后，你会得到一个 URL，例如：
```
https://taoist-fortune-calculator-api.your-subdomain.workers.dev
```

### 5. 更新前端配置

在项目根目录的 `.env` 文件中添加：

```bash
VITE_CLOUDFLARE_WORKER_URL=https://taoist-fortune-calculator-api.your-subdomain.workers.dev
```

### 6. 重新构建和部署前端

```bash
npm run build
firebase deploy --only hosting
```

## API 端点说明

部署后的 Worker 提供以下端点：

| 端点 | 方法 | 说明 |
|-------|------|------|
| `/health` | GET | 健康检查 |
| `/api/generate-fortune` | POST | 生成运势 |
| `/api/start-chat` | POST | 开始大师对话 |
| `/api/continue-chat` | POST | 继续大师对话 |

## 请求示例

### 生成运势

```javascript
const response = await fetch('https://your-worker.workers.dev/api/generate-fortune', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    systemPrompt: "...",
    userPrompt: "..."
  })
});

const fortune = JSON.parse(await response.text());
```

### 开始大师对话

```javascript
const response = await fetch('https://your-worker.workers.dev/api/start-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    systemPrompt: "...",
    userPrompt: "..."
  })
});

const message = await response.json();
```

### 继续大师对话

```javascript
const response = await fetch('https://your-worker.workers.dev/api/continue-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    systemPrompt: "...",
    conversation: "user: hello\nassistant: hi there"
  })
});

const message = await response.json();
```

## 本地开发

在本地运行 Worker 进行开发：

```bash
cd cloudflare-worker
wrangler dev
```

访问 `http://localhost:8787` 进行测试。

## 监控日志

查看 Worker 实时日志：

```bash
wrangler tail
```

## 注意事项

1. **CORS 配置**：Worker 已配置 CORS，允许任何来源访问
2. **环境变量**：API key 通过 wrangler secret 设置，不会出现在代码仓库中
3. **免费额度**：Cloudflare Workers 免费计划提供每天 100,000 次请求
4. **全球分发**：Cloudflare Workers 自动在全球 300+ 数据中心部署
5. **冷启动**：首次请求可能有约 50-200ms 的冷启动延迟

## 故障排查

### 部署失败

```bash
# 检查登录状态
wrangler whoami

# 重新登录
wrangler login
```

### 环境变量未设置

```bash
# 列出所有 secrets
wrangler secret list

# 删除 secret
wrangler secret delete DEEPSEEK_API_KEY

# 重新设置
wrangler secret put DEEPSEEK_API_KEY
```

### API 调用失败

1. 检查 DeepSeek API key 是否正确
2. 查看日志：`wrangler tail`
3. 检查 Cloudflare 仪表板：https://dash.cloudflare.com

## 升级到自定义域名

如果你有自己的域名：

```bash
# 在 wrangler.toml 中配置
[routes]
pattern = "api.taoist-fortune-calculator.com/*"
zone_name = "taoist-fortune-calculator.com"

# 或使用命令行
wrangler publish --name taoist-fortune-calculator-api --route "api.taoist-fortune-calculator.com/*"
```
