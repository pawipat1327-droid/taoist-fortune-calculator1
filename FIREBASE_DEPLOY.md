# 🔥 Firebase 部署指南

## 快速开始

### 第一次部署（3 步）

#### 1. 安装 Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. 登录 Firebase
```bash
firebase login
```
会打开浏览器，用 Google 账号登录。

#### 3. 初始化并部署
```bash
cd /Users/ouyangsheng/Desktop/Claude\ Code/taoist-fortune-calculator1
firebase init
firebase deploy
```

---

## 详细步骤

### 初始化 Firebase 配置

运行 `firebase init` 后的选项：

```
? Are you ready to proceed? (Y/n)
→ Y

? Which Firebase CLI features do you want to set up for this folder?
→ ◉ Hosting (按空格选中，回车确认)

? Please select an option:
→ Use an existing project

? Select a default Firebase project for this directory:
→ 选择你的 Firebase 项目（或创建新的）

? What do you want to use as your public directory?
→ dist

? Configure as a single-page app? (y/N)
→ Y

? Set up automatic builds with GitHub? (y/N)
→ N

? File dist/index.html already exists. Overwrite? (y/N)
→ N
```

### 构建 + 部署

```bash
# 构建项目
npm run build

# 部署到 Firebase
firebase deploy
```

---

## 一键部署脚本

如果你已安装 Firebase CLI 并登录，可以直接运行：

```bash
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

---

## Firebase 配置文件 (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 常见问题

### Q: 如何更新部署？
```bash
npm run build
firebase deploy
```

### Q: 如何查看部署状态？
访问 Firebase Console：
https://console.firebase.google.com/

### Q: 如何配置自定义域名？
1. 访问 Firebase Console
2. 点击 "Hosting"
3. 点击 "添加自定义域名"
4. 按照提示配置 DNS 记录

### Q: 部署失败怎么办？
```bash
# 清理缓存重新构建
rm -rf dist node_modules
npm install
npm run build
firebase deploy --only hosting
```

---

## Firebase vs Vercel vs Netlify

| 平台 | 优点 | 缺点 |
|------|------|------|
| **Firebase** | Google 基础设施、免费 SSL、实时数据库 | 构建速度较慢 |
| **Vercel** | 极速部署、预览环境、边缘网络 | 需要信用卡 |
| **Netlify** | 表单处理、函数支持、Rollback | 免费版有限制 |

---

## 当前项目信息

- **项目名称**: 天机神算
- **功能**: 择日、姻缘、财运、解梦
- **技术栈**: React 19 + Vite 6 + TypeScript
- **构建输出**: dist/
- **部署平台**: Firebase Hosting

---

## 相关链接

- Firebase 官网: https://firebase.google.com/
- Firebase Hosting 文档: https://firebase.google.com/docs/hosting
- Firebase CLI 文档: https://firebase.google.com/docs/cli

---

**准备好了吗？运行以下命令开始部署：**

```bash
firebase login
firebase init
firebase deploy
```
