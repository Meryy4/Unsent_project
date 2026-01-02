import React, { useState, useEffect } from 'react';

// Storage utilities
const storage = {
  getUser: () => {
    const user = localStorage.getItem('unsent_user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (userData) => localStorage.setItem('unsent_user', JSON.stringify(userData)),
  clearUser: () => localStorage.removeItem('unsent_user'),
  getEntries: () => {
    const entries = localStorage.getItem('unsent_entries');
    return entries ? JSON.parse(entries) : [];
  },
  addEntry: (entry) => {
    const entries = storage.getEntries();
    const newEntry = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...entry,
      created_at: new Date().toISOString(),
      status: 'incubating'
    };
    entries.push(newEntry);
    localStorage.setItem('unsent_entries', JSON.stringify(entries));
    return newEntry;
  },
  updateEntry: (id, updates) => {
    const entries = storage.getEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      localStorage.setItem('unsent_entries', JSON.stringify(entries));
    }
  },
  getReflections: () => {
    const reflections = localStorage.getItem('unsent_reflections');
    return reflections ? JSON.parse(reflections) : [];
  },
  addReflection: (reflection) => {
    const reflections = storage.getReflections();
    const newReflection = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...reflection,
      created_at: new Date().toISOString()
    };
    reflections.push(newReflection);
    localStorage.setItem('unsent_reflections', JSON.stringify(reflections));
    return newReflection;
  }
};

// AI Functions
const analyzeEmotion = async (content) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `A person wrote: "${content}"

Analyze with empathy. Respond with ONLY valid JSON (no markdown):
{
  "emotion": "one of: Longing, Grief, Anger, Love, Regret, Hope, Peace, Gratitude, Joy, Fear, Anxiety, Relief",
  "intensity": 1-10,
  "comfort": "A warm, validating sentence (15-20 words)"
}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('\n');
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return { emotion: 'Peace', intensity: 5, comfort: 'Your feelings are valid. Sharing them is an important step in healing.' };
  }
};

const generateGrowthInsight = async (oldEntry, newData, daysSince) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `${daysSince} minutes ago: ${oldEntry.dominant_feeling} (${oldEntry.warmth_level}/10)
Today: ${newData.now_feeling} (${newData.now_warmth}/10)
Write a warm insight (20-30 words) about their growth. Respond with ONLY JSON: {"insight": "your message"}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('\n');
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned).insight;
  } catch {
    return 'Your journey shows beautiful growth. The weight you carried has transformed into wisdom.';
  }
};

const getDaysSince = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 60));
};

const emotionSymbols = {
  'Joy': '✨', 'Grief': '〰', 'Anger': '⚡', 'Love': '♡',
  'Hope': '☀', 'Fear': '◐', 'Peace': '◯', 'Longing': '⋯',
  'Regret': '◈', 'Gratitude': '❋', 'Anxiety': '≋', 'Relief': '◡'
};

// Beautiful SVG Logo Component
const Logo = ({ size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Envelope base */}
    <path
      d="M40 70 L100 110 L160 70 L160 150 L40 150 Z"
      fill="url(#gradient1)"
      stroke="url(#gradient2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Envelope flap */}
    <path
      d="M40 70 L100 110 L160 70 L100 40 Z"
      fill="url(#gradient3)"
      stroke="url(#gradient2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Heart-flame rising */}
    <path
      d="M100 95 C95 90, 85 90, 82 97 C79 104, 85 110, 100 120 C115 110, 121 104, 118 97 C115 90, 105 90, 100 95 Z M100 80 Q95 60, 100 40"
      fill="url(#gradient4)"
      stroke="url(#gradient5)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
    {/* Leaf accent */}
    <path
      d="M105 50 Q115 45, 120 50 Q115 55, 105 50"
      fill="url(#gradient6)"
      stroke="url(#gradient7)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5dcc8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#e8c4a8" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#45a0ad" stopOpacity="1" />
        <stop offset="100%" stopColor="#357a85" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8e9d8" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#f5dcc8" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gradient4" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#ed8975" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#f5a89a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f8c9be" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="gradient5" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#c97268" stopOpacity="1" />
        <stop offset="100%" stopColor="#ed8975" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b7355" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#5d3a1a" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5d3a1a" stopOpacity="1" />
        <stop offset="100%" stopColor="#8b7355" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  </svg>
);

// Floating background
const FloatingBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(25)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: Math.random() * 6 + 2 + 'px',
        height: Math.random() * 6 + 2 + 'px',
        borderRadius: '50%',
        background: `rgba(${Math.random() > 0.5 ? '237, 137, 117' : '69, 160, 173'}, ${Math.random() * 0.4 + 0.1})`,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
        animationDelay: `-${Math.random() * 10}s`,
        filter: 'blur(1px)'
      }} />
    ))}
  </div>
);

// Login Screen
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f8e9d8 25%, #f5dcc8 50%, #f8e9d8 75%, #fdfbf7 100%)', position: 'relative' }}>
      <FloatingBg />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '32rem', width: '100%', animation: 'fadeInUp 0.8s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', padding: '2rem', background: 'radial-gradient(circle, rgba(237, 137, 117, 0.2) 0%, transparent 70%)', borderRadius: '50%', marginBottom: '1.5rem', animation: 'pulse 3s ease-in-out infinite' }}>
              <Logo size={140} />
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a 0%, #a8826d 50%, #5d3a1a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}>Unsent</h1>
            <p style={{ color: '#78716c', fontWeight: '300', fontSize: '1.125rem', opacity: 0.8, marginTop: '0.5rem' }}>A sanctuary for your unspoken feelings</p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', padding: '3rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '300', color: '#44403c', marginBottom: '2rem', textAlign: 'center' }}>Welcome Back</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.5rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = '#ed8975'} onBlur={(e) => e.target.style.borderColor = 'rgba(214, 211, 209, 0.5)'} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = '#ed8975'} onBlur={(e) => e.target.style.borderColor = 'rgba(214, 211, 209, 0.5)'} />
            <button onClick={onLogin} style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, #5d3a1a 0%, #8b6f47 100%)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '400', boxShadow: '0 6px 25px rgba(93, 58, 26, 0.35)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 35px rgba(93, 58, 26, 0.45)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 25px rgba(93, 58, 26, 0.35)'; }}>Sign In</button>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#a8a29e', marginTop: '2rem' }}>Your feelings are safe here</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(253, 230, 138, 0.5))', borderRadius: '1rem', border: '1px solid rgba(253, 224, 71, 0.4)', backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: '0.9375rem', color: '#78543d', fontWeight: '400' }}>✦ <strong>Demo Mode</strong> — Click "Sign In" to continue</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 25% { transform: translateY(-20px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-10px); } 75% { transform: translateY(-30px) translateX(5px); } }
      `}</style>
    </div>
  );
};

// Welcome Screen  
const WelcomeScreen = ({ onStart }) => {
  const [name, setName] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f8e9d8 25%, #f5dcc8 50%, #f8e9d8 75%, #fdfbf7 100%)', position: 'relative' }}>
      <FloatingBg />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '48rem', width: '100%', textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
          <div style={{ display: 'inline-block', padding: '2.5rem', background: 'radial-gradient(circle, rgba(237, 137, 117, 0.2) 0%, transparent 70%)', borderRadius: '50%', marginBottom: '2rem', animation: 'pulse 3s ease-in-out infinite' }}>
            <Logo size={160} />
          </div>
          <h1 style={{ fontSize: '5rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a 0%, #a8826d 50%, #5d3a1a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>Unsent</h1>
          <p style={{ fontSize: '1.5rem', color: '#57534e', fontWeight: '300', marginBottom: '1rem', opacity: 0.9 }}>A sanctuary for your shadow thoughts</p>
          <p style={{ color: '#78716c', fontWeight: '300', marginBottom: '4rem', fontSize: '1.125rem', maxWidth: '32rem', margin: '0 auto 4rem', lineHeight: '1.8' }}>Write the words you cannot say. Let them rest. Watch yourself heal.</p>
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.12)', marginBottom: '2rem' }}>
              <input type="text" placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1.25rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#ed8975'; e.target.style.transform = 'scale(1.02)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(214, 211, 209, 0.5)'; e.target.style.transform = 'scale(1)'; }} autoFocus />
              <button onClick={() => { if (name.trim()) { storage.setUser({ name: name.trim(), joined_at: new Date().toISOString() }); onStart(); } }} disabled={!name.trim()} style={{ width: '100%', padding: '1.5rem', background: name.trim() ? 'linear-gradient(135deg, #5d3a1a 0%, #8b6f47 100%)' : '#d6d3d1', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.25rem', cursor: name.trim() ? 'pointer' : 'not-allowed', fontWeight: '400', boxShadow: name.trim() ? '0 8px 30px rgba(93, 58, 26, 0.35)' : 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { if (name.trim()) { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 12px 40px rgba(93, 58, 26, 0.45)'; } }} onMouseLeave={(e) => { if (name.trim()) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 30px rgba(93, 58, 26, 0.35)'; } }}>Enter the Sanctuary</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Screen
const HomeScreen = ({ onNavigate, user }) => {
  const entries = storage.getEntries();
  const reflections = storage.getReflections();
  const ready = entries.filter(e => getDaysSince(e.created_at) >= 1 && e.status !== 'released').length;
  
  const emotionColors = { 'Joy': '#fbbf24', 'Grief': '#60a5fa', 'Anger': '#ef4444', 'Love': '#ec4899', 'Hope': '#f59e0b', 'Fear': '#6366f1', 'Peace': '#10b981', 'Longing': '#8b5cf6', 'Regret': '#f97316', 'Gratitude': '#14b8a6', 'Anxiety': '#f43f5e', 'Relief': '#84cc16' };
  const emotionCounts = {}, emotionIntensities = {};
  entries.forEach(e => { emotionCounts[e.dominant_feeling] = (emotionCounts[e.dominant_feeling] || 0) + 1; if (!emotionIntensities[e.dominant_feeling]) emotionIntensities[e.dominant_feeling] = []; emotionIntensities[e.dominant_feeling].push(e.warmth_level); });
  const stats = Object.keys(emotionCounts).map(e => ({ emotion: e, count: emotionCounts[e], avgIntensity: (emotionIntensities[e].reduce((a,b) => a+b, 0) / emotionIntensities[e].length).toFixed(1), color: emotionColors[e] || '#78716c' })).sort((a,b) => b.count - a.count);
  const maxCount = Math.max(...stats.map(e => e.count), 1);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f8e9d8 25%, #f5dcc8 50%, #f8e9d8 75%, #fdfbf7 100%)', position: 'relative', padding: '2rem' }}>
      <FloatingBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a 0%, #a8826d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Welcome back, {user.name}</h1>
          <p style={{ color: '#78716c', fontWeight: '300', fontSize: '1.125rem' }}>Your sanctuary awaits</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <button onClick={() => onNavigate('sanctuary')} style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.1)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.4s ease', animation: 'fadeInUp 0.7s ease-out' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 20px 50px rgba(93, 58, 26, 0.18)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = '0 10px 40px rgba(93, 58, 26, 0.1)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(236, 72, 153, 0.3))' }}>♡</span>
              <span style={{ fontSize: '3rem', opacity: 0.7 }}>✎</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '300', color: '#292524', marginBottom: '0.75rem' }}>Write</h3>
            <p style={{ color: '#78716c', fontWeight: '300', fontSize: '1.0625rem' }}>Share what's weighing on your heart</p>
          </button>

          <button onClick={() => onNavigate('reflections')} style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.1)', textAlign: 'left', cursor: 'pointer', position: 'relative', transition: 'all 0.4s ease', animation: 'fadeInUp 0.8s ease-out' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 20px 50px rgba(93, 58, 26, 0.18)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = '0 10px 40px rgba(93, 58, 26, 0.1)'; }}>
            {ready > 0 && <div style={{ position: 'absolute', top: '-0.75rem', right: '-0.75rem', width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', animation: 'pulse 2s ease-in-out infinite' }}>{ready}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }}>◐</span>
              <span style={{ fontSize: '3rem', opacity: 0.7 }}>⟳</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '300', color: '#292524', marginBottom: '0.75rem' }}>Reflect</h3>
            <p style={{ color: '#78716c', fontWeight: '300', fontSize: '1.0625rem' }}>See how you've grown</p>
          </button>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.1)', marginBottom: '2rem', animation: 'fadeInUp 0.9s ease-out' }}>
          <h4 style={{ fontSize: '1.375rem', fontWeight: '300', color: '#44403c', marginBottom: '1.5rem' }}>Your Journey</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2.5rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a, #8b6f47)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{entries.length}</div><div style={{ fontSize: '0.9375rem', color: '#78716c', fontWeight: '300', marginTop: '0.5rem' }}>Entries</div></div>
            <div><div style={{ fontSize: '2.5rem', fontWeight: '300', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{reflections.length}</div><div style={{ fontSize: '0.9375rem', color: '#78716c', fontWeight: '300', marginTop: '0.5rem' }}>Reflections</div></div>
            <div><div style={{ fontSize: '2.5rem', fontWeight: '300', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{ready}</div><div style={{ fontSize: '0.9375rem', color: '#78716c', fontWeight: '300', marginTop: '0.5rem' }}>Ready</div></div>
          </div>
        </div>

        {entries.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.1)', marginBottom: '2rem', animation: 'fadeInUp 1s ease-out' }}>
            <h4 style={{ fontSize: '1.75rem', fontWeight: '300', color: '#44403c', marginBottom: '0.75rem' }}>Emotion Journey</h4>
            <p style={{ fontSize: '1rem', color: '#78716c', fontWeight: '300', marginBottom: '2.5rem', opacity: 0.8 }}>Track how your emotions evolve over time</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {stats.map((s, i) => (
                <div key={s.emotion} style={{ animation: `fadeInUp ${0.3 + i * 0.1}s ease-out` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.75rem', width: '2rem', textAlign: 'center' }}>{emotionSymbols[s.emotion]}</span>
                      <span style={{ fontWeight: '300', color: '#44403c', fontSize: '1.125rem' }}>{s.emotion}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9375rem', color: '#78716c', fontWeight: '300' }}>{s.count} {s.count === 1 ? 'entry' : 'entries'}</span>
                      <span style={{ fontSize: '0.875rem', color: '#a8a29e', fontWeight: '300' }}>avg: {s.avgIntensity}/10</span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '0.875rem', background: 'rgba(245, 245, 244, 0.6)', borderRadius: '9999px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: `${(s.count / maxCount) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`, borderRadius: '9999px', transition: 'width 1s ease-out', boxShadow: `0 0 10px ${s.color}88` }} />
                  </div>
                </div>
              ))}
            </div>
            {stats.length > 0 && (
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(253, 230, 138, 0.5))', borderRadius: '1.25rem', border: '1px solid rgba(253, 224, 71, 0.3)' }}>
                <p style={{ fontSize: '1rem', color: '#78543d', fontWeight: '300', textAlign: 'center' }}>✦ <strong>Most frequent:</strong> {stats[0].emotion} ({stats[0].count} {stats[0].count === 1 ? 'time' : 'times'})</p>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={() => { storage.clearUser(); window.location.reload(); }} style={{ fontSize: '0.9375rem', color: '#a8a29e', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '300', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(168, 162, 158, 0.1)'; e.target.style.color = '#78716c'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#a8a29e'; }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

// Sanctuary Screen
const SanctuaryScreen = ({ onNavigate }) => {
  const [step, setStep] = useState('input');
  const [feeling, setFeeling] = useState('');
  const [recipient, setRecipient] = useState('');
  const [emotionData, setEmotionData] = useState(null);

  const handleSubmit = async () => {
    if (!feeling.trim()) return;
    setStep('processing');
    const result = await analyzeEmotion(feeling);
    setEmotionData(result);
    setStep('comfort');
  };

  const handleSave = () => {
    storage.addEntry({ recipient: recipient || 'myself', content: feeling, dominant_feeling: emotionData.emotion, warmth_level: emotionData.intensity, supportive_prompt: emotionData.comfort });
    setStep('fadeout');
    setTimeout(() => onNavigate('home'), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f8e9d8 25%, #f5dcc8 50%, #f8e9d8 75%, #fdfbf7 100%)', position: 'relative', padding: '2rem' }}>
      <FloatingBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '48rem', margin: '0 auto', paddingTop: '2rem' }}>
        <button onClick={() => onNavigate('home')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a8a29e', background: 'rgba(255, 255, 255, 0.6)', border: 'none', cursor: 'pointer', fontWeight: '300', fontSize: '1rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.9)'; e.target.style.color = '#78716c'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.6)'; e.target.style.color = '#a8a29e'; }}>← Back home</button>

        {step === 'input' && (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a, #a8826d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem' }}>How are you feeling?</h2>
            <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 10px 40px rgba(93, 58, 26, 0.12)' }}>
              <input placeholder="To whom? (optional)" value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.5rem', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = '#ed8975'} onBlur={(e) => e.target.style.borderColor = 'rgba(214, 211, 209, 0.5)'} />
              <textarea autoFocus placeholder="Share what's on your mind..." value={feeling} onChange={(e) => setFeeling(e.target.value)} style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', outline: 'none', resize: 'none', minHeight: '200px', transition: 'all 0.3s ease' }} rows={8} onFocus={(e) => e.target.style.borderColor = '#ed8975'} onBlur={(e) => e.target.style.borderColor = 'rgba(214, 211, 209, 0.5)'} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => onNavigate('home')} style={{ padding: '1rem 1.75rem', color: '#78716c', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '300', fontSize: '1.0625rem', borderRadius: '0.75rem', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#57534e'} onMouseLeave={(e) => e.target.style.color = '#78716c'}>Cancel</button>
                <button onClick={handleSubmit} disabled={!feeling.trim()} style={{ padding: '1rem 2.5rem', background: feeling.trim() ? 'linear-gradient(135deg, #5d3a1a, #8b6f47)' : '#d6d3d1', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.0625rem', cursor: feeling.trim() ? 'pointer' : 'not-allowed', fontWeight: '400', boxShadow: feeling.trim() ? '0 6px 25px rgba(93, 58, 26, 0.35)' : 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { if (feeling.trim()) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 35px rgba(93, 58, 26, 0.45)'; } }} onMouseLeave={(e) => { if (feeling.trim()) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 25px rgba(93, 58, 26, 0.35)'; } }}>Share</button>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>⋯</div>
            <p style={{ color: '#78716c', fontWeight: '300', fontSize: '1.25rem' }}>Understanding your feelings...</p>
          </div>
        )}

        {step === 'comfort' && emotionData && (
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8), rgba(253, 230, 138, 0.6))', borderRadius: '9999px', boxShadow: '0 8px 25px rgba(253, 224, 71, 0.3)', marginBottom: '1.5rem', border: '1px solid rgba(253, 224, 71, 0.4)' }}>
                <span style={{ fontSize: '3rem' }}>{emotionSymbols[emotionData.emotion]}</span>
                <span style={{ fontSize: '1.75rem', color: '#44403c', fontWeight: '300' }}>{emotionData.emotion}</span>
              </div>
            </div>
            <p style={{ fontSize: '1.375rem', color: '#57534e', fontWeight: '300', fontStyle: 'italic', marginBottom: '4rem', maxWidth: '40rem', margin: '0 auto 4rem', lineHeight: '1.8' }}>"{emotionData.comfort}"</p>
            <p style={{ color: '#78716c', fontWeight: '300', marginBottom: '2rem', fontSize: '1.125rem' }}>Would you like to keep this thought or release it?</p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button onClick={() => { setStep('fadeout'); setTimeout(() => onNavigate('home'), 2000); }} style={{ padding: '1.25rem 2.5rem', background: 'transparent', color: '#57534e', border: '2px solid rgba(214, 211, 209, 0.8)', borderRadius: '1rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '300', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(214, 211, 209, 0.2)'; e.target.style.borderColor = '#a8a29e'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(214, 211, 209, 0.8)'; }}>Release it</button>
              <button onClick={handleSave} style={{ padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, #5d3a1a, #8b6f47)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '400', boxShadow: '0 6px 25px rgba(93, 58, 26, 0.35)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 35px rgba(93, 58, 26, 0.45)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 25px rgba(93, 58, 26, 0.35)'; }}>Keep it safe</button>
            </div>
          </div>
        )}

        {step === 'fadeout' && (
          <div style={{ textAlign: 'center', animation: 'fadeOut 2s ease-out' }}>
            <p style={{ fontSize: '1.75rem', color: '#a8a29e', fontWeight: '300' }}>Your words rest here now...</p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`}</style>
    </div>
  );
};

// Reflections Screen - simplified for space
const ReflectionsScreen = ({ onNavigate }) => {
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ now_feeling: '', now_warmth: 5, reflection_note: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const entries = storage.getEntries().filter(e => getDaysSince(e.created_at) >= 1 && e.status !== 'released');
  const reflections = storage.getReflections();
  const selectedEntry = entries.find(e => e.id === selectedEntryId);
  const selectedReflection = reflections.find(r => r.entry_id === selectedEntryId);

  const handleCreateReflection = async () => {
    setIsProcessing(true);
    const daysSince = getDaysSince(selectedEntry.created_at);
    const insight = await generateGrowthInsight(selectedEntry, formData, daysSince);
    storage.addReflection({ entry_id: selectedEntryId, then_feeling: selectedEntry.dominant_feeling, then_warmth: selectedEntry.warmth_level, ...formData, growth_insight: insight, days_since_original: daysSince });
    storage.updateEntry(selectedEntryId, { status: 'reflected' });
    setIsProcessing(false);
    setShowForm(false);
    setFormData({ now_feeling: '', now_warmth: 5, reflection_note: '' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f8e9d8 25%, #f5dcc8 50%, #f8e9d8 75%, #fdfbf7 100%)', position: 'relative', padding: '2rem' }}>
      <FloatingBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '72rem', margin: '0 auto', paddingTop: '2rem' }}>
        <button onClick={() => { if (selectedEntry) { setSelectedEntryId(null); setShowForm(false); } else onNavigate('home'); }} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a8a29e', background: 'rgba(255, 255, 255, 0.6)', border: 'none', cursor: 'pointer', fontWeight: '300', fontSize: '1rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.9)'; e.target.style.color = '#78716c'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.6)'; e.target.style.color = '#a8a29e'; }}>← {selectedEntry ? 'Back to list' : 'Back home'}</button>

        {!selectedEntry ? (
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: '300', background: 'linear-gradient(135deg, #5d3a1a, #a8826d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>Remember When...</h2>
            <p style={{ color: '#78716c', fontWeight: '300', marginBottom: '2.5rem', fontSize: '1.125rem' }}>See how you've grown</p>
            {entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.4 }}>◐</div>
                <h3 style={{ fontSize: '1.5rem', color: '#57534e', marginBottom: '0.75rem', fontWeight: '300' }}>No reflections ready yet</h3>
                <p style={{ color: '#a8a29e', fontWeight: '300', fontSize: '1.0625rem' }}>Entries become ready after 1 minute (demo mode)</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {entries.map((entry, i) => {
                  const hasReflection = reflections.some(r => r.entry_id === entry.id);
                  const daysSince = getDaysSince(entry.created_at);
                  return (
                    <div key={entry.id} onClick={() => setSelectedEntryId(entry.id)} style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid ' + (hasReflection ? 'rgba(167, 243, 208, 0.6)' : 'rgba(255, 255, 255, 0.6)'), background: hasReflection ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.8), rgba(204, 251, 241, 0.6))' : 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', cursor: 'pointer', transition: 'all 0.3s ease', animation: `fadeInUp ${0.4 + i * 0.1}s ease-out`, boxShadow: '0 4px 15px rgba(93, 58, 26, 0.05)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 12px 30px rgba(93, 58, 26, 0.1)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(93, 58, 26, 0.05)'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          {entry.recipient && <p style={{ fontSize: '0.9375rem', color: '#a8a29e', fontStyle: 'italic', fontWeight: '300' }}>To: {entry.recipient}</p>}
                          <p style={{ fontSize: '0.875rem', color: '#a8a29e', marginTop: '0.5rem' }}>{daysSince} {daysSince === 1 ? 'minute' : 'minutes'} ago • {emotionSymbols[entry.dominant_feeling]} {entry.dominant_feeling}</p>
                        </div>
                        {hasReflection && <span style={{ color: '#059669', fontSize: '0.9375rem', fontWeight: '400' }}>✨ Reflected</span>}
                      </div>
                      <p style={{ color: '#57534e', fontWeight: '300', fontSize: '1.0625rem', lineHeight: '1.7', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{entry.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 30px rgba(93, 58, 26, 0.08)' }}>
                <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', marginBottom: '1.5rem', fontWeight: '400' }}>THEN</h3>
                {selectedEntry.recipient && <p style={{ fontSize: '0.9375rem', color: '#a8a29e', fontStyle: 'italic', marginBottom: '0.75rem' }}>To: {selectedEntry.recipient}</p>}
                <p style={{ fontSize: '0.9375rem', color: '#78716c', marginBottom: '1.5rem' }}>{getDaysSince(selectedEntry.created_at)} {getDaysSince(selectedEntry.created_at) === 1 ? 'minute' : 'minutes'} ago</p>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #ffe4e6, #fecdd3)', borderRadius: '9999px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{emotionSymbols[selectedEntry.dominant_feeling]}</span>
                    <span style={{ fontWeight: '300', color: '#44403c', fontSize: '1.0625rem' }}>{selectedEntry.dominant_feeling}</span>
                    <span style={{ fontSize: '0.9375rem', color: '#78716c' }}>({selectedEntry.warmth_level}/10)</span>
                  </div>
                </div>
                <p style={{ color: '#57534e', fontWeight: '300', fontStyle: 'italic', fontSize: '1.0625rem', lineHeight: '1.7' }}>"{selectedEntry.content}"</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 30px rgba(93, 58, 26, 0.08)' }}>
                <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', marginBottom: '1.5rem', fontWeight: '400' }}>NOW</h3>
                {selectedReflection ? (
                  <>
                    <p style={{ fontSize: '0.9375rem', color: '#78716c', marginBottom: '1.5rem' }}>Today</p>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '1.5rem' }}>{emotionSymbols[selectedReflection.now_feeling]}</span>
                        <span style={{ fontWeight: '300', color: '#44403c', fontSize: '1.0625rem' }}>{selectedReflection.now_feeling}</span>
                        <span style={{ fontSize: '0.9375rem', color: '#78716c' }}>({selectedReflection.now_warmth}/10)</span>
                      </div>
                    </div>
                    {selectedReflection.reflection_note && <p style={{ color: '#57534e', fontWeight: '300', fontStyle: 'italic', fontSize: '1.0625rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>"{selectedReflection.reflection_note}"</p>}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7), rgba(253, 230, 138, 0.5))', borderRadius: '1.25rem', border: '1px solid rgba(253, 224, 71, 0.3)' }}>
                      <p style={{ fontSize: '1rem', color: '#78543d', fontWeight: '300', fontStyle: 'italic', lineHeight: '1.7' }}>"{selectedReflection.growth_insight}"</p>
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#a8a29e', fontWeight: '300', fontSize: '1.0625rem' }}>How do you feel about this now?</p>
                )}
              </div>
            </div>

            {!selectedReflection && !showForm && (
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setShowForm(true)} style={{ padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, #5d3a1a, #8b6f47)', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '400', boxShadow: '0 6px 25px rgba(93, 58, 26, 0.35)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 35px rgba(93, 58, 26, 0.45)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 25px rgba(93, 58, 26, 0.35)'; }}>Reflect on this moment</button>
              </div>
            )}

            {showForm && !selectedReflection && (
              <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.6)', animation: 'fadeInUp 0.5s ease-out' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#44403c', marginBottom: '2rem' }}>How do you feel now?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9375rem', color: '#57534e', fontWeight: '300', marginBottom: '0.75rem' }}>Current emotion</label>
                    <select value={formData.now_feeling} onChange={(e) => setFormData({...formData, now_feeling: e.target.value})} style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', outline: 'none' }}>
                      <option value="">Select...</option>
                      <option>Peace</option><option>Gratitude</option><option>Hope</option><option>Relief</option><option>Joy</option><option>Love</option><option>Longing</option><option>Grief</option><option>Anger</option><option>Fear</option><option>Anxiety</option><option>Regret</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9375rem', color: '#57534e', fontWeight: '300', marginBottom: '0.75rem' }}>Intensity: {formData.now_warmth}/10</label>
                    <input type="range" min="1" max="10" value={formData.now_warmth} onChange={(e) => setFormData({...formData, now_warmth: parseInt(e.target.value)})} style={{ width: '100%', height: '8px', borderRadius: '4px', outline: 'none', background: 'linear-gradient(to right, #ed8975, #45a0ad)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9375rem', color: '#57534e', fontWeight: '300', marginBottom: '0.75rem' }}>Your thoughts (optional)</label>
                    <textarea value={formData.reflection_note} onChange={(e) => setFormData({...formData, reflection_note: e.target.value})} placeholder="What's changed? What have you learned?" style={{ width: '100%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(214, 211, 209, 0.5)', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.9)', outline: 'none', resize: 'none', minHeight: '120px' }} rows={4} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowForm(false)} style={{ padding: '1rem 1.75rem', color: '#78716c', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '300', fontSize: '1.0625rem' }}>Cancel</button>
                    <button onClick={handleCreateReflection} disabled={!formData.now_feeling || isProcessing} style={{ padding: '1rem 2.5rem', background: (formData.now_feeling && !isProcessing) ? 'linear-gradient(135deg, #5d3a1a, #8b6f47)' : '#d6d3d1', color: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.0625rem', cursor: (formData.now_feeling && !isProcessing) ? 'pointer' : 'not-allowed', fontWeight: '400', boxShadow: (formData.now_feeling && !isProcessing) ? '0 6px 25px rgba(93, 58, 26, 0.35)' : 'none', transition: 'all 0.3s ease' }}>{isProcessing ? 'Creating...' : 'Complete Reflection'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App
export default function UnsentApp() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentPage('home');
    }
  }, []);

  return (
    <>
      {currentPage === 'login' && <LoginScreen onLogin={() => setCurrentPage('welcome')} />}
      {currentPage === 'welcome' && <WelcomeScreen onStart={() => { setUser(storage.getUser()); setCurrentPage('home'); }} />}
      {currentPage === 'home' && <HomeScreen onNavigate={setCurrentPage} user={user} />}
      {currentPage === 'sanctuary' && <SanctuaryScreen onNavigate={setCurrentPage} />}
      {currentPage === 'reflections' && <ReflectionsScreen onNavigate={setCurrentPage} />}
    </>
  );
}
