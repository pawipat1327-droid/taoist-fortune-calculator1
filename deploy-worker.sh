#!/bin/bash

# Cloudflare Worker 部署脚本
# 运行此脚本来部署 Cloudflare Worker

echo "=========================================="
echo "   Cloudflare Worker 部署指南"
echo "=========================================="
echo ""
echo "步骤 1: 登录 Cloudflare"
echo "运行以下命令在浏览器中完成 OAuth 登录："
echo ""
echo "  wrangler login"
echo ""
read -p "登录完成后按 Enter 继续..."
echo ""

echo "步骤 2: 设置 DeepSeek API Key"
echo "运行以下命令设置 API key："
echo ""
echo "  wrangler secret put DEEPSEEK_API_KEY --project taoist-fortune-calculator-api"
echo ""
read -p "API key 设置完成后按 Enter 继续..."
echo ""

echo "步骤 3: 进入 Worker 目录并部署"
cd "$(dirname "$0")/cloudflare-worker"

echo ""
echo "=========================================="
echo "   准备部署 Worker"
echo "=========================================="
echo ""

echo "运行以下命令部署："
echo ""
echo "  wrangler deploy"
echo ""
echo "或者本地测试："
echo ""
echo "  wrangler dev"
echo ""
echo "=========================================="
echo ""

read -p "准备好部署了吗？按 Enter 继续，或按 Ctrl+C 取消..." || exit 0

# 执行部署
wrangler deploy

echo ""
echo "=========================================="
echo "   部署完成！"
echo "=========================================="
echo ""
echo "请记下返回的 Worker URL"
echo ""
echo "步骤 4: 更新前端 .env 文件"
echo "在项目根目录的 .env 文件中添加："
echo ""
echo "  VITE_CLOUDFLARE_WORKER_URL=<你的-worker-url>"
echo ""
echo "例如："
echo "  VITE_CLOUDFLARE_WORKER_URL=https://taoist-fortune-calculator-api.your-subdomain.workers.dev"
echo ""
echo "然后重新构建前端："
echo ""
echo "  npm run build"
echo ""
echo "最后部署前端："
echo ""
echo "  firebase deploy --only hosting"
