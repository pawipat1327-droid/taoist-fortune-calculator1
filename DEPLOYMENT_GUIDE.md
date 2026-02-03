# 部署指南 / Deployment Guide

## 快速部署（推荐方式）

### 方式一：Vercel（推荐）⭐

**优点：**
- 零配置，自动识别 Vite 项目
- 免费 HTTPS 和全球 CDN
- 自动部署（Git 推送即部署）
- 支持环境变量和 API 代理

**步骤：**

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

4. **设置环境变量（生产环境 API）**
在 Vercel 控制台中添加环境变量：
- 不需要额外配置，开发环境使用代理，生产环境使用硬编码的 API key

5. **正式部署**
```bash
vercel --prod
```

完成！你的网站将部署到：`https://你的项目名.vercel.app`

---

### 方式二：Netlify

**步骤：**

1. **安装 Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **登录 Netlify**
```bash
netlify login
```

3. **初始化部署**
```bash
netlify init
```

4. **部署**
```bash
netlify deploy --prod
```

---

### 方式三：Cloudflare Pages

**步骤：**

1. **安装 Wrangler**
```bash
npm install -g wrangler
```

2. **登录**
```bash
wrangler login
```

3. **部署**
```bash
npx wrangler pages publish dist --project-name=taoist-fortune-calculator
```

---

### 方式四：GitHub Pages

**步骤：**

1. **修改 vite.config.ts 添加 base**
```typescript
base: '/your-repo-name/',
```

2. **构建**
```bash
npm run build
```

3. **推送 dist 目录到 GitHub**

4. **在 GitHub 仓库设置中启用 GitHub Pages**
- Settings → Pages → Source: Deploy from a branch
- Branch: gh-pages

---

## 环境变量配置

### 开发环境（使用代理）
无需配置，Vite 自动代理 DeepSeek API。

### 生产环境
API key 已硬编码在 `deepseekService.ts` 中，生产环境直接使用。

---

## 域名配置（可选）

### Vercel
在 Vercel 控制台 → Settings → Domains → Add Domain

### Netlify
在 Netlify 控制台 → Domain management → Add custom domain

### Cloudflare Pages
在 Cloudflare 控制台 → Pages → Custom domains

---

## 常见问题

### Q: API 请求失败？
A: 检查 vite.config.ts 中的代理配置是否正确。

### Q: 构建失败？
A: 确保 `node_modules` 已安装，运行 `npm install`。

### Q: 样式丢失？
A: 检查 index.css 是否正确引入，Tailwind CSS 配置是否正确。

---

## 技术支持

- Vercel 文档：https://vercel.com/docs
- Netlify 文档：https://docs.netlify.com
- Cloudflare Pages 文档：https://developers.cloudflare.com/pages

---

## 当前项目信息

- **项目名称**：天机神算 / Taoist Fortune Calculator
- **功能模块**：
  - 择日（紫微斗数）
  - 姻缘（iztro 紫微斗数）
  - 财运（奇门遁甲）
  - 解梦（周公解梦 + 心理分析）
- **技术栈**：React 19 + Vite 6 + TypeScript + Tailwind CSS
- **API**：DeepSeek AI
