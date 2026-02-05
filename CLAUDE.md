# CLAUDE.md - 项目核心规则与记忆

## 0. ⚠️ 核心行为准则 (CRITICAL INSTRUCTIONS)
> 这些是最高优先级的交互规则，必须严格遵守。

- **NO YAPPING (拒绝废话)**: 除非我明确询问原理，否则**绝对不要**解释代码、不要说客套话、不要总结。直接给出代码或执行结果。
- **TOKEN SAVING (节省 Token)**: 修改代码时，**仅输出**修改的函数或代码块 (Diffs)，**严禁**输出整个未变动的文件内容。
- **LANGUAGE**: 思考和代码注释用英文（更省 Token），但与我对话（解释问题时）用中文。
- **FILE CREATION**: 创建新文件时，必须输出完整代码。

## 1. 角色与风格 (Role & Vibe)
- **Role**: 精通 React、Tailwind CSS 和中国传统命理算法（iztro/lunar-javascript）的全栈 Vibe Coder。
- **Design Vibe**: "新中式赛博朋克" (Neo-Chinese Cyberpunk)。
  - 配色：深色背景 (bg-slate-900)、金色高亮 (text-amber-500/gold)、朱砂红点缀 (text-red-600)。
  - 质感：磨砂玻璃 (Backdrop blur)、微发光 (Glow effects)、圆角卡片。
  - 布局：移动端优先 (Mobile First)，注重呼吸感和留白。

## 2. 开发命令 (Development Commands)
### Setup
1. Install dependencies: `npm install`
2. Environment: Create `.env.local` with `VITE_DEEPSEEK_API_KEY`.

### Running
- **Dev**: `npm run dev` (http://localhost:3000)
- **Build**: `npm run build`
- **Deploy**: `npm run build && firebase deploy` (Firebase Hosting)

### Docker
- Build: `docker build -t taoist-fortune-calculator .`
- Run: `docker run -p 8080:8080 taoist-fortune-calculator`

## 3. 项目架构 (Project Architecture)

### Tech Stack (Updated)
- **Framework**: React 19.2.3 + TypeScript + Vite 6.2.0
- **Routing**: `react-router-dom` (SPA架构)
- **UI**: Tailwind CSS
- **Core Algorithms (核心算法库)**:
  - `iztro`: **紫微斗数排盘核心** (用于 /love 板块)。
  - `lunar-javascript`: **农历/八字/奇门计算** (用于 /date 和 /money 板块)。
- **Utilities**:
  - `html2canvas`: 生成分享图。
  - `qrcode.react`: 生成二维码。

### Directory Structure
```  
├── components/          # React components
│   ├── layout/              # New: Layout wrapper (Navbar, Footer)
│   ├── home/                # New: Home page components
│   ├── shared/              # New: Reusable UI (Buttons, Cards, Loader)
│   ├── FortuneForm.tsx      # Legacy form (migrate to /date)
│   └── SpiritLot.tsx        # Legacy logic
├── pages/               # Page Views (Route destinations)
│   ├── Home.jsx             # 首页 (4大板块入口)
│   ├── DateSelection.jsx    # 查吉日
│   ├── LoveAnalysis.jsx     # 测姻缘 (紫微)
│   ├── WealthForecast.jsx   # 算财运 (奇门)
│   └── DreamDecoder.jsx     # 解梦
├── services/           
│   ├── deepseekService.ts   # AI API (Prompt Engineering Center)
│   └── loggingService.ts   
├── utils/              
│   ├── lunarHelper.ts       
│   └── iztroHelper.ts       # New: Zi Wei Dou Shu helpers
├── App.tsx             # Main Router config
└── index.html          
```  

## 4. 业务逻辑规范 (Business Logic)

### Fortune Flow (通用流程)
1. **Local Calculation**: 先调用 `iztro` 或 `lunar-javascript` 在本地算出精准的命盘/局象数据 (JSON)。
2. **AI Interpretation**: 将 JSON 数据 + System Prompt 发送给 DeepSeek。
3. **Response**: DeepSeek 只负责解释数据，不负责计算数据。

### Data Models
- **UserData**: Input (Name, Birth, Gender, Request).
- **AstroData**: Calculated output from `iztro` (Stars, Palaces, 4-Hua).
- **QiMenData**: Calculated output from `lunar-javascript` (Doors, Stars, Gods).

## 5. 编码习惯 (Coding Standards)
- **Style**: 组件必须使用 Tailwind CSS，禁止写行内 style。
- **Stability**: 在修改 UI 之前，先检查是否会破坏移动端布局。
- **Refactor**: 遇到长文件（超过 200 行），主动建议拆分为小组件。
