# 部署变更记录 (Deployment Notes)

## 日期: 2026-01-31

---

## 一、API 设置简化

### 变更 1: 移除 API 设置按钮
- **文件**: `components/NavBar.jsx`
- **变更**: 移除了右上角的"设置 Key"按钮
- **原因**: API key 已硬编码，不再需要用户手动输入

### 变更 2: 硬编码 DeepSeek API Key
- **API Key**: `sk-fe74936882674bf5ab67e874d06628ec`
- **位置**:
  - `services/deepseekService.ts`
  - `services/masterChatService.ts`
  - `cloudflare-worker/src/index.ts`

---

## 二、API 调用架构变更

### 变更 3: 使用 Vite 代理绕过 CORS
- **文件**: `vite.config.ts`
- **新增配置**:
  ```typescript
  proxy: {
    '/api/deepseek': {
      target: 'https://api.deepseek.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      configure: (proxy, options) => {
        proxy.on('proxyReq', (proxyReq, req, res) => {
          proxyReq.setHeader('Authorization', 'Bearer sk-fe74936882674bf5ab67e874d06628ec');
        });
      },
    }
  }
  ```
- **工作原理**:
  - 开发模式: 通过 Vite 代理调用 DeepSeek API（绕过 CORS）
  - 生产模式: 直接调用 DeepSeek API（API key 硬编码在客户端）

### 变更 4: 更新 API 服务层
- **文件**: `services/deepseekService.ts`
  - 移除了 Cloudflare Worker 依赖
  - 直接调用 DeepSeek API
  - 使用 `import.meta.env.MODE === 'development'` 判断环境

- **文件**: `services/masterChatService.ts`
  - 同样更新为直接调用 DeepSeek API

---

## 三、数据结构修复

### 变更 5: 修复 FortuneResult 数据转换
- **文件**: `services/deepseekService.ts`
- **问题**: API 返回 `dates` 数组，但组件期望 `dates` 对象（包含 immediate/shortTerm/longTerm）
- **解决方案**: 添加转换逻辑：
  ```typescript
  // 将 dates 数组转换为对象结构
  const datesWithDefaults = datesArray.map((date: any) => ({
    date: date.date || '',
    weekDay: date.weekDay || '',
    lunarDate: date.lunarDate || '',
    reason: date.reason || '',
    energyScore: date.energyScore || 70,
    tags: date.tags || [],
    type: date.type || '吉日',
    bestTime: date.bestTime || '吉时待定',
    direction: date.direction || '正南',
    taboo: date.taboo || ''
  }));

  // 按日期分类分配
  const transformedResult: FortuneResult = {
    title: apiResult.title,
    summary: apiResult.summary,
    dates: {
      immediate: datesWithDefaults.slice(0, 1),     // 近期急用 (7日内)
      shortTerm: datesWithDefaults.slice(1, 3),   // 短期规划 (1个月内)
      longTerm: datesWithDefaults.slice(3, 5),    // 从容筹备 (半年内)
    },
    advice: apiResult.advice
  };
  ```

### 变更 6: 扩展 RecommendedDate 类型
- **文件**: `types.ts`
- **新增字段**:
  ```typescript
  export interface RecommendedDate {
    date: string;
    weekDay: string;
    lunarDate: string;
    reason: string;
    energyScore: number;
    tags: string[];
    type: string;        // 新增: 天赐吉日、上上吉日等
    bestTime: string;    // 新增: 巳时 (09:00-11:00)
    direction: string;   // 新增: 正南等
    taboo: string;      // 新增: 冲鼠(壬子)煞北
  }
  ```

---

## 四、TypeScript 类型修复

### 变更 7: 添加 Vite 环境类型定义
- **文件**: `vite-env.d.ts` (新建)
- **内容**:
  ```typescript
  interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly MODE: string;
    readonly PROD: boolean;
    readonly SSR: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  ```

---

## 五、Cloudflare Worker 更新

### 变更 8: 硬编码 API Key 到 Worker
- **文件**: `cloudflare-worker/src/index.ts`
- **变更**: 移除了环境变量依赖，直接硬编码 API key
- **部署**: Worker 已部署到 `https://taoist-fortune-calculator-api.pawipat-1327.workers.dev`

**注意**: 当前应用使用 Vite 代理，Worker 暂时不用，但已部署备用

---

## 六、生产部署

### 构建命令
```bash
npm run build
```

### 构建输出
- `dist/index.html`: 0.95 kB (gzip: 0.57 kB)
- `dist/assets/index-BrR-jjiX.css`: 80.26 kB (gzip: 12.36 kB)
- `dist/assets/index-CfxCQ9gE.js`: 576.17 kB (gzip: 186.60 kB)

### 部署选项

#### 选项 A: Firebase Hosting
```bash
firebase deploy
```

#### 选项 B: Vercel
```bash
vercel --prod
```

#### 选项 C: Netlify
```bash
netlify deploy --prod
```

---

## 七、重要提醒

### 安全注意事项
- **API Key 已硬编码在客户端代码中** - 这在构建时会被打包进 JS 文件
- **建议**: 如果是生产环境，考虑使用后端服务器或 Cloudflare Worker 来保护 API Key
- **当前方案**: 适合内部使用或测试环境

### 已知限制
- 开发环境依赖 Vite 开发服务器，生产环境直接调用 API
- 如果 DeepSeek API 变更，需要更新代码中的 URL 和请求格式

---

## 八、下次开发需要关注的问题

1. **API Key 安全**: 考虑将 API key 移到环境变量或后端服务
2. **代码分割**: 生产包较大 (576 kB)，可考虑使用动态 import 优化
3. **错误处理**: 当前只有简单的 alert，可改进为更好的用户体验
4. **加载状态**: 可考虑添加更详细的加载动画

---

## 九、Git 提交建议

```bash
git add .
git commit -m "feat: Simplify API configuration with hardcoded DeepSeek key

- Remove API settings button from NavBar
- Hardcode DeepSeek API key (sk-fe74936882674bf5ab67e874d06628ec)
- Use Vite proxy to bypass CORS in development
- Add data transformation logic for FortuneResult
- Extend RecommendedDate type with missing fields
- Add TypeScript type definitions for Vite environment
- Update Cloudflare Worker with hardcoded API key

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
