# 💌 Unsent

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <em>A sanctuary for your unspoken feelings</em>
</p>

---

## 🌸 About

**Unsent** is a therapeutic web application designed to help you process unspoken emotions. Write the words you can't say, let them rest, and watch yourself heal. The app provides a safe, private space to express feelings that may never be sent — letters to loved ones, thoughts about the past, or emotions you're still working through.

## ✨ Features

### 📝 Write (Sanctuary)
- Express your deepest feelings in a safe, judgment-free space
- Address messages to anyone (optional) — past relationships, lost loved ones, or yourself
- **AI-powered emotion analysis** detects the dominant emotion and intensity of your writing
- Receive personalized comfort messages based on your emotional state
- Choose to **keep** your entry for later reflection or **release** it

### 🔄 Reflect
- Revisit past entries after they've had time to "incubate"
- Track how your emotions have evolved over time
- Compare your feelings **then vs. now**
- Receive AI-generated **growth insights** celebrating your emotional journey
- Beautiful side-by-side visualization of your emotional progress

### 📊 Emotion Journey
- Visual dashboard tracking all your emotional patterns
- Emotion frequency bars with intensity averages
- Beautiful emotion symbols for 12 different emotions:
  - ✨ Joy | 〰 Grief | ⚡ Anger | ♡ Love
  - ☀ Hope | ◐ Fear | ◯ Peace | ⋯ Longing
  - ◈ Regret | ❋ Gratitude | ≋ Anxiety | ◡ Relief

### 🎨 Beautiful Design
- Warm, calming color palette with soft gradients
- Glassmorphism UI with backdrop blur effects
- Floating particle animations for a serene atmosphere
- Smooth micro-animations and transitions
- Fully responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Meryy4/Unsent_project.git

# Navigate to the project directory
cd Unsent_project

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file based on `.env.example`:

```env
VITE_API_KEY=your_api_key_here
```

> **Note:** The app includes fallback responses when the AI API is unavailable, so it works out of the box without configuration.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **LocalStorage** | Data Persistence |
| **Claude API** | AI Emotion Analysis |
| **CSS-in-JS** | Styling (inline styles) |

## 📁 Project Structure

```
unsent-app/
├── index.html          # Entry HTML file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main application (all components)
    └── index.css       # Global styles
```

## 🔒 Privacy

- **All data is stored locally** in your browser's LocalStorage
- No data is sent to external servers (except AI analysis requests)
- Your entries never leave your device
- Clear your data anytime by signing out

## 🎯 Demo Mode

The app runs in demo mode by default:
- Click "Sign In" without credentials to enter
- Entries become ready for reflection after **1 minute** (instead of days)
- Perfect for testing the full experience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💜 Acknowledgments

- Inspired by the concept of therapeutic letter writing
- Built with love for emotional wellness
- Designed to be a digital sanctuary for healing

---

<p align="center">
  <em>Your feelings are valid. Your journey matters. 💌</em>
</p>
