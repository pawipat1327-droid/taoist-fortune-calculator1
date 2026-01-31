#!/bin/bash

# Cloudflare Worker 本地测试脚本
# 用于测试 Worker 配置是否正确

echo "=========================================="
echo "   Cloudflare Worker 测试工具"
echo "=========================================="
echo ""

# 配置 Worker URL
WORKER_URL="${1:-https://taoist-fortune-api.workers.dev}"

echo "Worker URL: $WORKER_URL"
echo ""

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 测试函数
test_health() {
    echo -e "${YELLOW}测试 1: 健康检查端点${NC}"
    echo "curl -s $WORKER_URL/health"

    response=$(curl -s -w "%{http_code}" "$WORKER_URL/health")

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ 健康检查通过${NC}"
        echo ""
        curl -s "$WORKER_URL/health" | jq '.'
        return 0
    else
        echo -e "${RED}✗ 健康检查失败 (HTTP $response)${NC}"
        return 1
    fi
}

test_generate_fortune() {
    echo -e "${YELLOW}测试 2: 生成运势端点${NC}"
    echo ""

    # 测试数据
    test_data='{
        "systemPrompt": "You are a test.",
        "userPrompt": "Test request."
    }'

    echo "发送测试请求..."
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$test_data" \
        "$WORKER_URL/api/generate-fortune")

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ 生成运势端点通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 生成运势端点失败 (HTTP $response)${NC}"
        return 1
    fi
}

test_start_chat() {
    echo -e "${YELLOW}测试 3: 开始对话端点${NC}"
    echo ""

    test_data='{
        "systemPrompt": "Test.",
        "userPrompt": "Start test."
    }'

    echo "发送测试请求..."
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$test_data" \
        "$WORKER_URL/api/start-chat")

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ 开始对话端点通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 开始对话端点失败 (HTTP $response)${NC}"
        return 1
    fi
}

test_continue_chat() {
    echo -e "${YELLOW}测试 4: 继续对话端点${NC}"
    echo ""

    test_data='{
        "systemPrompt": "Test.",
        "conversation": "user: hello\nassistant: hi"
    }'

    echo "发送测试请求..."
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$test_data" \
        "$WORKER_URL/api/continue-chat")

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ 继续对话端点通过${NC}"
        return 0
    else
        echo -e "${RED}✗ 继续对话端点失败 (HTTP $response)${NC}"
        return 1
    fi
}

# 主菜单
show_menu() {
    echo ""
    echo "请选择要执行的测试："
    echo "  1) 健康检查"
    echo "  2) 生成运势端点"
    echo "  3) 开始对话端点"
    echo "  4) 继续对话端点"
    echo "  5) 运行所有测试"
    echo "  0) 退出"
    echo ""
    echo -n "请输入选项 [0-5]: "
}

# 执行测试
run_tests() {
    case $1 in
        1)
            test_health
            ;;
        2)
            test_generate_fortune
            ;;
        3)
            test_start_chat
            ;;
        4)
            test_continue_chat
            ;;
        5)
            echo ""
            echo "=========================================="
            echo "运行所有测试"
            echo "=========================================="
            echo ""

            pass_count=0
            fail_count=0

            test_health || ((fail_count++))
            test_generate_fortune || ((fail_count++))
            test_start_chat || ((fail_count++))
            test_continue_chat || ((fail_count++))

            echo ""
            echo "=========================================="
            echo "   测试结果汇总"
            echo "=========================================="
            echo ""
            echo -e "通过: ${GREEN}$pass_count${NC} / 4"
            echo -e "失败: ${RED}$fail_count${NC} / 4"
            echo ""
            ;;
        0)
            echo "退出测试"
            return 0
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            return 1
            ;;
    esac
}

# 主程序
main() {
    if [ -n "$2" ]; then
        WORKER_URL="$2"
        echo "使用自定义 Worker URL: $WORKER_URL"
    fi

    while true; do
        show_menu
        read -r choice

        if [ -z "$choice" ]; then
            continue
        fi

        run_tests "$choice"

        if [ $? -ne 0 ] || [ "$choice" = "0" ]; then
            break
        fi

        echo ""
        read -p "按 Enter 继续..."
        echo ""
    done
}

main
