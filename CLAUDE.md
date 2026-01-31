# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup
1. Install dependencies: `npm install`
2. Set environment variables: Copy `.env.example` (if exists) or create `.env.local` with your API keys:
   - `VITE_DEEPSEEK_API_KEY`: Your DeepSeek API key for fortune generation

### Running the App
- **Development**: `npm run dev` - Starts development server at http://localhost:3000
- **Build**: `npm run build` - Creates production build in `dist/`
- **Preview**: `npm run preview` - Previews production build

### Testing
- Manual test scripts available in project root:
  - `test_api.mjs` - Tests API connection
  - `test_deepseek.mjs` - Tests DeepSeek service

### Docker Deployment
- Build and run with: `docker build -t taoist-fortune-calculator .`
- Run container: `docker run -p 8080:8080 taoist-fortune-calculator`

## Project Architecture

### Tech Stack
- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Core Dependencies**:
  - `lunar-javascript` - Chinese lunar calendar and BaZi calculations
  - `html2canvas` - Screenshot generation for sharing
  - `qrcode.react` - QR code generation for social sharing
  - `@types/qrcode.react` - TypeScript definitions

### Directory Structure
```
├── components/          # React components
│   ├── FortuneForm.tsx      # User input form
│   ├── FortuneResultView.tsx # Display results
│   ├── RitualLoader.tsx     # Loading animation
│   ├── SettingsModal.tsx    # Settings/config
│   ├── SharePreviewModal.tsx # Social sharing
│   └── SpiritLot.tsx        # Main fortune calculation
├── services/           # Business logic
│   ├── deepseekService.ts   # AI API integration
│   └── loggingService.ts   # Google Sheets logging
├── utils/              # Utility functions
│   ├── icsHelper.ts        # Calendar file generation
│   └── lunarHelper.ts       # Lunar calendar helpers
├── App.tsx             # Main application component
├── constants.ts        # App constants and icons
├── types.ts            # TypeScript type definitions
└── index.html          # HTML entry point
```

### Key Architecture Patterns

#### State Management
- App state handled through React useState hooks
- Loading states managed with finite state machine:
  ```typescript
  type LoadingStatus = 'idle' | 'loading' | 'finishing'
  ```

#### Fortune Generation Flow
1. User submits form with personal data (name, birth date/time, request)
2. `lunar-javascript` calculates BaZi (8 characters) and lunar calendar data
3. Data formatted and sent to DeepSeek API via `deepseekService.ts`
4. AI generates fortune analysis and recommended dates
5. Results displayed with animated transition
6. Optional: Log to Google Sheets via `loggingService.ts`

#### Data Models
- `UserData`: User input data
- `LunarAnalysisData`: Calculated BaZi and lunar calendar data
- `FortuneResult`: AI-generated fortune analysis
- `RecommendedDate`: Specific date recommendations with Taoist details

#### Configuration
- Environment variables loaded via Vite's `loadEnv`
- DeepSeek API key used for AI fortune generation
- Google Apps Script URL stored in localStorage for analytics

### Component Responsibilities
- **FortuneForm**: Collects user input, validates, triggers calculation
- **FortuneResultView**: Displays formatted results, handles sharing
- **SpiritLot**: Main calculation engine, coordinates services
- **RitualLoader**: Handles loading states with themed animations
- **SettingsModal**: Configuration for Google Sheets integration

### External Integrations
- **DeepSeek AI**: Primary API for fortune generation
- **Google Sheets**: Analytics logging (via Apps Script)
- **Google Calendar**: ICS file generation for recommended dates

### Development Notes
- Uses Vite path aliases: `@` resolves to project root
- TypeScript strict mode enabled
- Firebase configuration available for potential deployment
- Components styled with Tailwind CSS (standard React approach)