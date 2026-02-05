#!/bin/bash

echo "================================"
echo "🔥 Firebase 部署脚本"
echo "================================"
echo ""

# 检查是否已安装 Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI 未安装"
    echo "请先运行: npm install -g firebase-tools"
    exit 1
fi

# 检查是否已登录
if ! firebase login:list &> /dev/null; then
    echo "❌ 未登录 Firebase"
    echo "请先运行: firebase login"
    exit 1
fi

echo "✅ Firebase CLI 已安装并登录"
echo ""

# 构建项目
echo "📦 正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"
echo ""

# 部署到 Firebase
echo "🚀 正在部署到 Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ 部署成功！"
    echo "================================"
    echo ""
    echo "请访问 Firebase Console 查看你的网站："
    echo "https://console.firebase.google.com/"
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi
