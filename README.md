# AI Study Assistant - Browser Extension

A powerful browser extension that transforms web content into study materials using AI. Real-time synchronization with mobile app for seamless learning across devices.

## Features

✨ **Core Features**
- 📖 Extract and clean webpage text with permission-based access
- 🤖 AI-powered content analysis and summarization
- 📱 Real-time sync with paired mobile app
- 🔐 End-to-end encryption and secure authentication
- ⚡ Low-latency, optimized for minimal API costs
- 🎨 Clean side panel UI with React
- 🏗️ Modular, scalable architecture

## Tech Stack

**Frontend (Extension)**
- React 18+ with TypeScript
- Webpack for bundling
- TailwindCSS for styling
- Chrome Extension APIs

**Backend (Node.js)**
- Express.js for REST API
- Firebase Realtime Database / WebSocket for sync
- JWT for authentication
- AES-256 encryption for data security

**AI Integration**
- OpenAI API (configurable)
- Prompt optimization for cost efficiency

## Quick Start

### Prerequisites
- Node.js 18+
- Chrome/Chromium browser
- Firebase account
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/rahulbrar-dev/ai-study-assistant.git
cd ai-study-assistant

# Install extension dependencies
cd extension && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Setup

**Backend (.env)**
```
OPENAI_API_KEY=sk_your_key_here
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
ENCRYPTION_KEY=your_32_byte_hex_key
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

**Extension (.env)**
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}
```

### 3. Run Backend

```bash
cd backend
npm run dev
```

### 4. Build Extension

```bash
cd extension
npm run build
```

### 5. Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder

## Project Structure

```
ai-study-assistant/
├── extension/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── content/     # Content scripts
│   │   ├── background/  # Service worker
│   │   ├── utils/       # Utilities
│   │   └── types/       # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Express middleware
│   └── package.json
└── docs/
    ├── SETUP.md
    ├── API.md
    └── ARCHITECTURE.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### AI Processing
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/extract-key-points` - Extract key points
- `POST /api/ai/generate-quiz` - Generate quiz questions

### Synchronization
- `GET /api/sync/status` - Check sync status
- `POST /api/sync/init-pairing` - Initiate mobile pairing
- `WS /ws/sync` - WebSocket for real-time updates

## Security

- **TLS 1.3** for data in transit
- **AES-256-GCM** encryption for data at rest
- **JWT tokens** with 24h expiry
- **Secure QR code** for mobile pairing

## License

MIT License
