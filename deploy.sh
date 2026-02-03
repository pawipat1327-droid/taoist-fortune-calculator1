#!/bin/bash

# 天机神算项目部署脚本

echo "================================"
echo "天机神算项目部署"
echo "================================"
echo ""

# 检查是否已构建
if [ ! -d "dist" ]; then
  echo "📦 正在构建项目..."
  npm run build
  echo "✅ 构建完成"
else
  echo "✅ 已存在构建文件 (dist/)"
fi

echo ""
echo "================================"
echo "部署选项："
echo "================================"
echo ""
echo "1️⃣  Vercel（推荐）- 免费HTTPS、全球CDN、自动部署"
echo "2️⃣  Netlify - 免费HTTPS、表单处理、函数支持"
echo "3️⃣  Cloudflare Pages - 免费HTTPS、快速全球网络"
echo ""
read -p "请选择部署平台 (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "🚀 使用 Vercel 部署..."
    echo ""
    echo "如果这是第一次部署，请先登录："
    echo "  vercel login"
    echo ""
    echo "然后运行："
    echo "  vercel"
    echo ""
    echo "正式部署到生产环境："
    echo "  vercel --prod"
    ;;
  2)
    echo ""
    echo "🚀 使用 Netlify 部署..."
    echo ""
    echo "如果这是第一次部署，请先安装并登录："
    echo "  npm install -g netlify-cli"
    echo "  netlify login"
    echo ""
    echo "然后运行："
    echo "  netlify deploy --prod"
    ;;
  3)
    echo ""
    echo "🚀 使用 Cloudflare Pages 部署..."
    echo ""
    echo "如果这是第一次部署，请先安装并登录："
    echo "  npm install -g wrangler"
    echo "  wrangler login"
    echo ""
    echo "然后运行："
    echo "  npx wrangler pages publish dist --project-name=taoist-fortune-calculator"
    ;;
  *)
    echo "❌ 无效的选择"
    exit 1
    ;;
esac

echo ""
echo "================================"
echo "更多信息请查看: DEPLOYMENT_GUIDE.md"
echo "================================"
