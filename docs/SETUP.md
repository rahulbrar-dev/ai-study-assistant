# Setup Guide

## Prerequisites

- Node.js 18+ with npm
- Chrome/Chromium-based browser
- Firebase project
- OpenAI API key
- Git

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/rahulbrar-dev/ai-study-assistant.git
cd ai-study-assistant
```

### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - Add OpenAI API key
# - Configure Firebase
# - Set JWT secret

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Extension Setup

```bash
cd ../extension

# Install dependencies
npm install

# Build extension
npm run build

# Watch mode for development
npm run dev
```

### 4. Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `extension/dist` folder
5. Extension should appear in your toolbar

### 5. Create Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the output to your `.env` file as `ENCRYPTION_KEY`

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk_...
FIREBASE_PROJECT_ID=...
ENCRYPTION_KEY=...
```

### Extension (.env)

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENCRYPTION_KEY=...
```

## Testing the Extension

1. Visit any webpage
2. Click AI Study Assistant icon in toolbar
3. Click "Extract Page Content"
4. Select analysis type (Summarize, Key Points, Quiz)
5. Click "Analyze"

## Troubleshooting

### Extension not loading
- Check manifest.json syntax
- Verify file paths are correct
- Clear extension cache: Remove and reload extension

### API connection errors
- Verify backend is running on port 3000
- Check CORS configuration in backend
- Verify environment variables are set

### Encryption errors
- Ensure encryption key is 64 hex characters
- Clear extension storage and reload

## Next Steps

- Read [API Documentation](./API.md)
- Review [Architecture Guide](./ARCHITECTURE.md)
- Check out [Deployment Guide](./DEPLOYMENT.md)
