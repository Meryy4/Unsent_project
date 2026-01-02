# Unsent - A Sanctuary for Your Unspoken Feelings

A beautiful, therapeutic web application for emotional well-being and self-reflection.

## ✨ Features

- **Write**: Share your unspoken thoughts in a safe, judgment-free space
- **AI Emotion Detection**: Powered by Claude AI to understand and validate your feelings
- **Reflection Therapy**: Compare your emotions "Then vs Now" to see your growth
- **Emotion Tracking**: Visualize your emotional journey over time
- **Beautiful UI**: Premium glass morphism design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd unsent-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## 🎨 Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Claude AI API** - Emotion analysis
- **LocalStorage** - Data persistence (PoC)

## 📝 Demo Mode

This is a proof-of-concept with:
- 1-minute reflection timer (instead of 30 days)
- LocalStorage for data (no backend required)
- Mock login (any credentials work)

## 🔒 Privacy

All data is stored locally in your browser. Nothing is sent to any server except for AI emotion analysis via Claude API.

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 👤 Author

Created by Binary Belle Team

---

**Note**: This is a proof-of-concept demo. For production use, you would need:
- Real authentication system
- Backend database (Firebase, Supabase, etc.)
- Proper API key management
- 30-day reflection timer
