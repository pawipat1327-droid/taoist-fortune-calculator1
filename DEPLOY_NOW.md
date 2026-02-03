# 🚀 立即部署指南

## 当前状态

✅ 代码已提交到本地 Git 仓库
✅ 项目已构建成功 (dist/ 目录)
✅ Vercel CLI 已安装
❌ Git 推送需要配置凭据
❌ 需要登录 Vercel

---

## 快速部署到 Vercel（推荐）

### 方法 1：直接部署（最简单）

```bash
# 1. 登录 Vercel（会打开浏览器）
vercel login

# 2. 部署项目（会提示配置）
vercel

# 3. 正式部署到生产环境
vercel --prod
```

**部署时的问题回答：**
- `? Set up and deploy "~/path/to/project"?` → **Y**
- `? Which scope do you want to deploy to?` → 选择你的账号
- `? Link to existing project?` → **N**（首次部署）
- `? What's your project's name?` → **taoist-fortune-calculator**（或自定义）
- `? In which directory is your code located?` → **./**（当前目录）
- `? Want to override the settings?` → **N**（使用默认配置）

完成！你的网站将部署到：`https://taoist-fortune-calculator.vercel.app`

---

### 方法 2：通过 Vercel 网站（更直观）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 导入你的 Git 仓库
   - Vercel 会自动检测到 Vite 项目

3. **配置项目**
   - Framework Preset: **Vite**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

4. **部署**
   - 点击 "Deploy"
   - 等待约 1-2 分钟
   - 完成！

---

### 方法 3：使用 Netlify

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化项目
netlify init

# 4. 部署
netlify deploy --prod
```

---

### 方法 4：使用 Cloudflare Pages

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录
wrangler login

# 3. 部署
npx wrangler pages publish dist --project-name=taoist-fortune-calculator
```

---

## 部署后的配置

### 环境变量（Vercel）

如果需要配置环境变量：
1. 进入 Vercel 项目控制台
2. Settings → Environment Variables
3. 添加变量（本项目已硬编码 API key，无需配置）

### 自定义域名

1. 进入项目控制台
2. Settings → Domains
3. 添加你的域名
4. 按照提示配置 DNS 记录

---

## 验证部署

部署完成后，访问你的网站：
- 检查导航是否正常（4个模式）
- 测试表单提交
- 查看 API 是否正常工作

---

## 推送代码到 GitHub（可选）

如果你想将代码推送到 GitHub 后再部署：

```bash
# 配置 Git（如果还没配置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 推送到 GitHub
git push -u origin main
```

---

## 需要帮助？

- **Vercel 文档**: https://vercel.com/docs
- **部署问题**: 查看 `DEPLOYMENT_GUIDE.md`
- **本地测试**: `npm run dev`

---

## 快速命令参考

```bash
# 本地开发
npm run dev

# 构建项目
npm run build

# 预览生产构建
npm run preview

# 部署到 Vercel（开发环境）
vercel

# 部署到 Vercel（生产环境）
vercel --prod

# 登录 Vercel
vercel login

# 查看 Vercel 项目列表
vercel list
```

---

**准备好了吗？运行以下命令开始部署：**

```bash
vercel login
vercel
```
