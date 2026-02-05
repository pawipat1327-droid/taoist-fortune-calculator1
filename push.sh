#!/bin/bash

echo "================================"
echo "GitHub 推送助手"
echo "================================"
echo ""
echo "请选择推送方式："
echo ""
echo "1️⃣  使用 Token 推送（推荐）"
echo "2️⃣  使用 GitHub CLI"
echo "3️⃣  配置 SSH 密钥"
echo ""
read -p "请选择 (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "📝 步骤："
    echo "1. 访问: https://github.com/settings/tokens/new"
    echo "2. 勾选 'repo' 权限"
    echo "3. 点击 'Generate token'"
    echo "4. 复制 token（只显示一次）"
    echo ""
    echo "然后运行:"
    echo "  git push"
    echo "用户名: pawipat1327-droid"
    echo "密码: [粘贴 token]"
    ;;

  2)
    echo ""
    echo "运行: gh auth login"
    echo "然后按照提示在浏览器中完成登录"
    ;;

  3)
    echo ""
    echo "运行: ssh-keygen -t ed25519 -C \"your_email@example.com\""
    echo "然后添加公钥到 GitHub"
    ;;

  *)
    echo "无效选择"
    exit 1
    ;;
esac

echo ""
echo "================================"
echo "当前状态:"
git status -sb
echo "================================"
